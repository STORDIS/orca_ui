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
import { areAllIPAddressesValid } from "../../utils/common";

export const Home = () => {
    const instance = interceptor();

    const [dataTable, setDataTable] = useState([]);
    const gridRef = useRef();
    const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

    const [formData, setFormData] = useState({
        image_url: "",
        device_ips: "",
        discover_also: false,
    });

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

    const handleChange = (e) => {
        let { name, value } = e.target;

        if (name === "device_ips") {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value.trim(),
            }));
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
        }
    };

    const handleCheckbox = (e) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            discover_also: e.target.checked,
        }));
    };

    const send_update = () => {
        if (areAllIPAddressesValid(formData.device_ips)) {
            console.log(formData);
        } else {
            alert("Invalid IP Address");
            return;
        }
    };

    return (
        <div>
            <div className="listContainer">
                <div className="listTitle">Selecte Devices</div>
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
                            <label>Image URL : </label>
                        </div>
                        <div className="form-field w-75">
                            <input
                                type="text"
                                name="image_url"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-wrapper align-center">
                        <div className="form-field w-25">
                            <label>ONIE Devices : </label>
                        </div>
                        <div className="form-field w-50">
                            <input
                                type="text"
                                name="device_ips"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-field w-25">
                            <div style={{ display: "flex" }}>
                                <label className="">Discover also </label>
                                <input
                                    type="checkbox"
                                    className="ml-15"
                                    checked={formData.discover_also}
                                    onChange={handleCheckbox}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <button className="btnStyle" onClick={send_update}>
                            Update SONiC on Devices Selected
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Home;
