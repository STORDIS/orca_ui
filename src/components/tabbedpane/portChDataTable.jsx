import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "./tabbedPaneTable.scss";
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { portChannelColumns,defaultColDef } from "./datatablesourse";
import axios from 'axios'
import { getAllPortChnlsOfDeviceURL } from '../../backend_rest_urls'
import PortChannelForm from "../PortChannelForm";
import Modal from "../modal/Modal";
import LogViewer from "../logpane/logpane";
import "../../pages/home/home.scss";


const PortChDataTable = (props) => {
    const gridRef = useRef();
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const { rows, columns, selectedDeviceIp = '' } = props;
    const [dataTable, setDataTable] = useState([]);
    const [changes, setChanges] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [isConfigInProgress, setIsConfigInProgress] = useState(false);
    const [configStatus, setConfigStatus] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [messageModalContent, setMessageModalContent] = useState(''); 
    const [selectedRows, setSelectedRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalType, setModalType] = useState('success');
    const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false);
    const [log, setLog] = useState([]);

    useEffect(() => {
        const apiPUrl = getAllPortChnlsOfDeviceURL(selectedDeviceIp);
        axios.get(apiPUrl)
            .then(res => {
                setDataTable(res.data);
                setOriginalData(JSON.parse(JSON.stringify(res.data)));
                console.log("data",res.data);
            })
            .catch(err => console.log(err));
    }, [selectedDeviceIp]);

    const defaultColDef = {
        tooltipValueGetter: (params) => { return params.value },
        resizable: true,
    }

    const refreshData = () => {
        const apiPUrl = getAllPortChnlsOfDeviceURL(selectedDeviceIp);
        axios.get(apiPUrl)
            .then(res => {
                setDataTable(res.data);
                setOriginalData(JSON.parse(JSON.stringify(res.data)));
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                setMessageModalContent("Error fetching data: " + err.message);
                setIsMessageModalOpen(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleOkClick = () => {
        setIsMessageModalOpen(false);
        refreshData();
    }

    const promptDeleteConfirmation = () => {
        setMessageModalContent(getDeleteConfirmationMessage());
        setIsDeleteConfirmationModalOpen(true);
    };
    
    const handleDeleteConfirmation = () => {
        setIsDeleteConfirmationModalOpen(false); 
        handleDelete(); 
    };
    
    const handleDeleteCancellation = () => {
        setIsDeleteConfirmationModalOpen(false); 
    };
    


    const handleFormSubmit = (formData) => {
        const apiPUrl = getAllPortChnlsOfDeviceURL(selectedDeviceIp);

        axios.put(apiPUrl, formData)
            .then(response => {
                console.log("Port Channel added successfully", response.data);
                setShowForm(false);
                setMessageModalContent('Port Channel added Successfully');
                setIsMessageModalOpen(true);
            })
            .catch(error => {
                console.error("Error adding port channel", error);
                setMessageModalContent('Error adding port channel');
                setIsMessageModalOpen(true);
            });
    };

    const handleDelete = () => {
        const apiPUrl = getAllPortChnlsOfDeviceURL(selectedDeviceIp);
        const deleteData = selectedRows.map(rowData =>({
            mgt_ip: selectedDeviceIp, lag_name: rowData.lag_name}));
        
        axios.delete(apiPUrl,{data: deleteData })
            .then(response => {
                console.log("delete",response.data);
                refreshData();
                setSelectedRows([]);
                setMessageModalContent("Rows deleted successfully");
                setIsMessageModalOpen(true); 

                setTimeout(() => {
                    setSelectedRows([]);
                }, 3000);
            })
            .catch(error => {
                console.error("Error",error);
            })
            .finally (() => {
            });
    };

    const onSelectionChanged = () => {
        const selectedNodes = gridRef.current.api.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        setSelectedRows(selectedData);
    };
    
    const handleCancel = () => {
        setShowForm(false);
    };

    const getDeleteConfirmationMessage = () => {
        if (selectedRows.length === 1) {
            return `Are you sure you want to delete ${selectedRows[0].lag_name}?`;
        }
        else if (selectedRows.length > 1) {
            const lagNames = selectedRows.map(row => row.lag_name).join(', ');
            return `Are you sure you want to delete these port channels: ${lagNames}?`;
        }
        else {
            return "No port channel selected.";
        }
    };

    const handleCellValueChanged = useCallback((params) => {
        if (params.newValue !== params.oldValue) {

            if (params.colDef.field === 'lag_name' ) {
                if (!/^PortChannel\d+$/.test(params.newValue)) {
                    alert('Invalid lag_name format. It should follow the pattern "PortChannel..." where "..." is a numeric value.');
                    params.node.setDataValue('lag_name', params.oldValue);
                    return;
                }
            }
            setChanges(prev => {
                if (!Array.isArray(prev)) {
                    console.error("Expected array but got:", prev);
                    return [];
                }
                const index = prev.findIndex(change => change.lag_name === params.data.lag_name);

                let latestChanges;
                let isNameExsits = prev.filter(val => val.lag_name === params.data.lag_name)
                if (isNameExsits.length > 0) {
                    let existedIndex = prev.findIndex(val => val.lag_name === params.data.lag_name);
                    prev[existedIndex][params.colDef.field] = params.newValue
                    latestChanges = [...prev]
                } else {
                    latestChanges = [...prev, { lag_name: params.data.lag_name, [params.colDef.field]: params.newValue }];
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
            lag_name: change.lag_name,
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
        if(changes.length === 0) {
            return;
        }
        setIsConfigInProgress(true);
        setConfigStatus('Config In Progress....');

        const output = createJsonOutput();
        const apiPUrl = getAllPortChnlsOfDeviceURL(selectedDeviceIp);
        axios.put(apiPUrl,output)
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
            });
    }, [createJsonOutput, selectedDeviceIp, changes]);



    return (
        <div className="datatable">
            <div className="button-group">
            <button onClick={() => setShowForm(true)}>Add Port Channel</button>
            <button onClick={promptDeleteConfirmation} disabled={selectedRows.length === 0}>Delete Selected Port Channel</button>
            </div>
            <div className="button-column">
            <button onClick={sendUpdates} disabled={isConfigInProgress || changes.length ===0} className={isConfigInProgress || changes.length ===0 ? 'button-disabled' : ''}>Apply Config</button>
            </div>
            <Modal show={showForm} onClose={() => setShowForm(false)}>
                <PortChannelForm 
                    onSubmit={handleFormSubmit} 
                    selectedDeviceIp={selectedDeviceIp} 
                    onCancel={handleCancel} />
            </Modal>
           
            <span className={`config-status ${configStatus === 'Config Successful' ? 'config-successful' : configStatus === 'Config Failed' ? 'config-failed' : 'config-in-progress'}`}>{configStatus}</span>
            <div style={gridStyle} className="ag-theme-alpine">
                <AgGridReact
                    ref={gridRef}
                    rowData={dataTable}
                    columnDefs={portChannelColumns}
                    defaultColDef={defaultColDef}
                    onCellValueChanged={handleCellValueChanged}
                    rowSelection="multiple"
                    checkboxSelection
                    enableCellTextSelection='true'
                    onSelectionChanged={onSelectionChanged}
                ></AgGridReact>
            </div>
            {/* Delete Confirmation Modal */}
{isDeleteConfirmationModalOpen && (
    <Modal show={isDeleteConfirmationModalOpen} onClose={handleDeleteCancellation}>
        <div>
            <p>{messageModalContent}</p>
            <button onClick={handleDeleteConfirmation}>Yes</button>
            <button onClick={handleDeleteCancellation}>No</button>
        </div>
    </Modal>
)}

{/* Success Message Modal */}
{isMessageModalOpen && (
    <Modal show={isMessageModalOpen} onClose={() => setIsMessageModalOpen(false)}>
        <div>
            {messageModalContent}
            <button onClick={() => setIsMessageModalOpen(false)}>OK</button>
        </div>
    </Modal>
)}
             {isMessageModalOpen &&
            <Modal show={isMessageModalOpen} >
            <div>
                {messageModalContent}
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    {modalType === 'success' ? (
                        <button onClick={handleOkClick}>OK</button>
                    ) : (
                        <button onClick={() => setIsMessageModalOpen(false)}>Close</button>
                    )}
                </div>  
            </div>
        </Modal>}
        <div className="listContainer">
            <div className="listTitle">Logs</div>
            <LogViewer log={log} setLog={setLog} />
        </div>
        </div>
    )
}

export default PortChDataTable