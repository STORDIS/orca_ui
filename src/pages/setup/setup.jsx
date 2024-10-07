import React, {
    useEffect,
    useState,
    useRef,
    useCallback,
    useMemo,
} from "react";

import {
    deviceUserColumns,
    defaultColDef,
} from "../../components/tabbedpane/datatablesourse";
import interceptor from "../../utils/interceptor";
import {
    getAllDevicesURL,
    installSonicURL,
} from "../../utils/backend_rest_urls";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { areAllIPAddressesValid } from "../../utils/common";
import useStoreLogs from "../../utils/store";
import useStoreConfig from "../../utils/configStore";

export const Home = () => {
    const instance = interceptor();

    const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);

    const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
    const updateConfig = useStoreConfig((state) => state.updateConfig);

    const [dataTable, setDataTable] = useState([]);
    const gridRef = useRef();
    const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

    const [networkList, setNetworkList] = useState({
        "10.10.229.123/32": [
            {
                ip: "10.10.229.123",
                mac_address: "0c:47:b1:91:00:00",
                platform: "x86_64-kvm_x86_64-r0",
                version: "master-201811170418",
            },
        ],
    });

    const [formData, setFormData] = useState({
        image_url: "",
        device_ips: "",
        discover_also: false,
    });

    const [selectedDevices, setSelectedDevices] = useState([]);

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

        setSelectedDevices(selectedData);

        // console.log(selectedData);
    };

    const handleChange = (e) => {
        let { name, value } = e.target;

        if (name === "device_ips") {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: [value.trim()],
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
        // if (areAllIPAddressesValid(formData.device_ips)) {
        installImage();
        // } else {
        //     alert("Invalid IP Address");
        //     return;
        // }
    };

    const installImage = () => {
        let payload = {
            image_url: formData.image_url,
            device_ips: [...formData.device_ips, ...selectedDevices],
            discover_also: formData.discover_also,
        };
        console.log(payload);
        setUpdateConfig(true);
        const apiUrl = installSonicURL();
        instance
            .put(apiUrl, payload)
            .then((res) => {
                console.log(res);
                if (Object.keys(res.networks).length > 0) {
                    setNetworkList(res.networks);
                }
            })
            .catch((err) => {})
            .finally(() => {
                setUpdateLog(true);
                setUpdateConfig(false);
            });
    };

    return (
        <div>
            <div className="listContainer resizable">
                <div className="form-wrapper align-center ">
                    <div className="form-field w-25">
                        <label>SONiC Image URL : </label>
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
                        <label>ONIE Devices for SONiC installation : </label>
                    </div>
                    <div className="form-field w-50">
                        <input
                            type="text"
                            name="device_ips"
                            onChange={handleChange}
                            placeholder="Give one or more IP address or ONIE device address separated by comma"
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

                <div className="form-wrapper align-center">
                    <div className="form-field w-25">
                        <label>User Name : </label>
                    </div>
                    <div className="form-field w-25">
                        <input type="text" name="username" />
                    </div>
                    <div className="form-field w-25">
                        <label> Password : </label>
                    </div>
                    <div className="form-field w-25">
                        <input type="password" name="password" />
                    </div>
                </div>

                <div className="listTitle">
                    Select Devices for SONiC installation
                </div>
                <div className="">
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

                <div>
                    <button className="btnStyle mt-15" onClick={send_update}>
                        Update SONiC on Devices Selected
                    </button>
                </div>
            </div>

            <div className="listContainer resizable">
                <div className="listTitle">
                    Following ONIE devices identified from the repective
                    networks provided for SONiC installation
                </div>

                <div className="p-5 ">
                    <table
                        border="1"
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                        }}
                    >
                        <thead>
                            <tr>
                                <th>Network Address</th>
                                <th>IP Address</th>
                                <th>
                                    Select All
                                    <input className="ml-10" type="checkbox" />
                                </th>
                                <th>
                                    Discover All
                                    <input className="ml-10" type="checkbox" />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(networkList).map((key) => (
                                <React.Fragment key={key}>
                                    {networkList[key].map((value, index) => (
                                        <tr
                                            key={index}
                                            style={{
                                                textAlign: "center",
                                            }}
                                        >
                                            {index === 0 ? (
                                                <td
                                                    rowSpan={
                                                        networkList[key].length
                                                    }
                                                >
                                                    {key}
                                                </td>
                                            ) : null}
                                            <td>{value}</td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    name=""
                                                    id=""
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    name=""
                                                    id=""
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div>
                    <button className="btnStyle mt-15">Apply Config</button>
                </div>
            </div>
        </div>
    );
};
export default Home;
