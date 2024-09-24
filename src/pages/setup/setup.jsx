import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
    deviceUserColumns,
    defaultColDef,
} from "../../components/tabbedpane/datatablesourse";
import interceptor from "../../utils/interceptor";
import { getAllDevicesURL } from "../../utils/backend_rest_urls";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export const Home = () => {
    const instance = interceptor();

    const [dataTable, setDataTable] = useState([]);
    const gridRef = useRef();
    const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

    useEffect(() => {
        getDevices();
    }, []);

    const getDevices = () => {
        setDataTable([]);
        instance(getAllDevicesURL())
            .then((res) => {
                setDataTable(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onSelectionChanged = () => {
        const selectedNodes = gridRef.current.api.getSelectedNodes();
        const selectedData = selectedNodes.map((node) => node.data.mgt_ip);
        console.log(selectedData);
    };

    return (
        <div>
            <div className="listContainer">
                <div className="listTitle">Setup</div>
                <div className="resizable">
                    <div style={gridStyle} className="ag-theme-alpine">
                        <AgGridReact
                            ref={gridRef}
                            rowData={dataTable}
                            columnDefs={deviceUserColumns("setup")}
                            defaultColDef={defaultColDef}
                            domLayout={"autoHeight"}
                            enableCellTextSelection="true"
                            rowSelection="multiple"
                            onSelectionChanged={onSelectionChanged}
                        ></AgGridReact>
                    </div>
                </div>
            </div>
            <div className="listContainer">
                <div className="resizable p-5">
                    <div className="form-wrapper align-center ">
                        <div className="form-field w-25">
                            <label>Select Member Interface : </label>
                        </div>
                        <div className="form-field w-75">
                            <input type="text" name="sag_ip_address" />
                        </div>
                    </div>
                    <div className="form-wrapper align-center">
                        <div className="form-field w-25">
                            <label>ONIE Devices : </label>
                        </div>
                        <div className="form-field w-50">
                            <input type="text" name="sag_ip_address" />
                        </div>
                        <div className="form-field w-25">
                            <div style={{ display: "flex" }}>
                                <label className="">Discover also </label>
                                <input type="checkbox" className="ml-15" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <button className="btnStyle">
                            Update SONiC on Devices Selected
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Home;
