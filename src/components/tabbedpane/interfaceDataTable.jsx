import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import './tabbedPaneTable.scss';
import { interfaceColumns, defaultColDef } from "./datatablesourse";
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
import { getAllInterfacesOfDeviceURL } from "../../backend_rest_urls";
import LogViewer from "../logpane/logpane";
import "../../pages/home/home.scss";


const InterfaceDataTable = (props) => {
    const gridRef = useRef();
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const { selectedDeviceIp = '' } = props;
    const [dataTable, setDataTable] = useState([]);
    const [changes, setChanges] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [isConfigInProgress, setIsConfigInProgress] = useState(false);
    const [configStatus, setConfigStatus] = useState('');
    const [log, setLog] = useState([]);

    useEffect(() => {
        const apiUrl = getAllInterfacesOfDeviceURL(selectedDeviceIp);
        axios.get(apiUrl)
            .then(res => {
                setDataTable(res.data);
                setOriginalData(JSON.parse(JSON.stringify(res.data)));
            })
            .catch(err => console.log(err));
    }, [selectedDeviceIp]);

    const handleCellValueChanged = useCallback((params) => {
        if (params.newValue !== params.oldValue) {
            setChanges(prev => {
                if (!Array.isArray(prev)) {
                    console.error("Expected array but got:", prev);
                    return [];
                }
                let latestChanges;
                let isNameExsits = prev.filter(val => val.name === params.data.name)
                if (isNameExsits.length > 0) {
                    let existedIndex = prev.findIndex(val => val.name === params.data.name);
                    prev[existedIndex][params.colDef.field] = params.newValue
                    latestChanges = [...prev]
                } else {
                    latestChanges = [...prev, { name: params.data.name, [params.colDef.field]: params.newValue }];
                }
                return latestChanges
            });
        }
    }, [dataTable]);


    useEffect(() => {
        if (props.refresh) {
            props.setRefresh(!props.refresh);
            setDataTable(JSON.parse(JSON.stringify(originalData)));
            setChanges([]);
        }
    }, [props.refresh]);

    const createJsonOutput = useCallback(() => {
        return changes.map(change => ({
            mgt_ip: selectedDeviceIp,
            name: change.name,
            ...change
        }));
    }, [selectedDeviceIp, changes]);


    useEffect(() => {
        if (changes.length) {
            const output = createJsonOutput();
            console.log(JSON.stringify(output));
        }
    }, [changes, createJsonOutput]);


    const sendUpdates = useCallback(() => {
        if (changes.length === 0) {
            return;
        }
        setIsConfigInProgress(true);
        setConfigStatus('Config In Progress....');
        const output = createJsonOutput();
        const apiUrl = getAllInterfacesOfDeviceURL(selectedDeviceIp);
        axios.put(apiUrl, output)
            .then(res => {
                setLog(res.data.result)
                setConfigStatus('Config Successful');
            })
            .catch(err => {
                setLog(err.response.data.result)
                setConfigStatus('Config Failed');
            })
            .finally(() => {
                setIsConfigInProgress(false);
                setChanges([]);

            });
    }, [createJsonOutput, selectedDeviceIp, changes]);


    return (
        <div className="datatable">
            <button onClick={sendUpdates} disabled={isConfigInProgress || changes.length === 0} className={isConfigInProgress || changes.length === 0 ? 'button-disabled' : ''}>Apply Config</button>
            <span className={`config-status ${configStatus === 'Config Successful' ? 'config-successful' : configStatus === 'Config Failed' ? 'config-failed' : 'config-in-progress'}`}>{configStatus}</span>
            <div style={gridStyle} className="ag-theme-alpine">
                <AgGridReact
                    ref={gridRef}
                    rowData={dataTable}
                    columnDefs={interfaceColumns}
                    defaultColDef={defaultColDef}
                    onCellValueChanged={handleCellValueChanged}
                ></AgGridReact>
            </div>
            <div className="listContainer">
                <div className="listTitle">Logs</div>
                <LogViewer log={log} setLog={setLog} />
            </div>
        </div>

    )
}

export default InterfaceDataTable