import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import './tabbedPaneTable.scss';
import { interfaceColumns } from "./datatablesourse";
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
import { getAllInterfacesOfDeviceURL } from "../../backend_rest_urls";

const InterfaceDataTable = (props) => {
    const gridRef = useRef();
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const { rows, columns, selectedDeviceIp = '' } = props;
    const [dataTable, setDataTable] = useState([]);
    const [changes, setChanges] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [isConfigInProgress, setIsConfigInProgress] = useState(false);
    const [configStatus, setConfigStatus] = useState('');


    useEffect(() => {
        const apiUrl = getAllInterfacesOfDeviceURL(selectedDeviceIp);
        axios.get(apiUrl)
            .then(res => {
                setDataTable(res.data);
                setOriginalData(JSON.parse(JSON.stringify(res.data)));
            })
            .catch(err => console.log(err));
    }, [selectedDeviceIp]);

    const defaultColDef = {
        tooltipValueGetter: (params) => { return params.value },
        resizable: true,
    };


    const handleCellValueChanged = useCallback((params) => {
        if (params.newValue !== params.oldValue) {

            setChanges(prev => {
                if (!Array.isArray(prev)) {
                    console.error("Expected array but got:", prev);
                    return [];
                }
                const index = prev.findIndex(change => change.name === params.data.name);

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
                setConfigStatus('Config Successful');
            })
            .catch(err => {
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
                    rowSelection="multiple"
                    enableCellTextSelection='true'
                ></AgGridReact>
            </div>
        </div>
    )
}

export default InterfaceDataTable