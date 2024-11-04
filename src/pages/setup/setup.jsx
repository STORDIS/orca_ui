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

import Modal from "../../components/modal/Modal";

export const Home = () => {
    const imageUrlRef = useRef(null);
    const userNameRef = useRef(null);
    const passwordRef = useRef(null);
    const deviceIpsRef = useRef(null);
    const discoverAlsoRef = useRef(null);

    const instance = interceptor();

    const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);

    const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
    const updateConfig = useStoreConfig((state) => state.updateConfig);

    const [dataTable, setDataTable] = useState([]);
    const gridRef = useRef();
    const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

    const [networkList, setNetworkList] = useState({});

    const [formData, setFormData] = useState({
        image_url: "",
        device_ips: "",
        discover_also: false,
        user_name: "",
        password: "",
    });

    const [selectedDevices, setSelectedDevices] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);

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
    };

    const handleChange = (e) => {
        let { name, value } = e.target;

        if (name === "device_ips" && value) {
            value = value
                .trim()
                .split(",")
                .map((ip) => ip.trim());

            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
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
        if (formData.image_url === "") {
            alert("URL is empty");
            return;
        } else if (formData.device_ips.length + selectedDevices.length === 0) {
            alert("No devices selected");
            return;
        } else {
            setIsModalOpen(true);

            let isValid = false;
            if (formData.device_ips.length > 0) {
                formData.device_ips.forEach((element) => {
                    if (areAllIPAddressesValid(element)) {
                        isValid = true;
                    } else {
                        isValid = false;
                        alert("Invalid IP Address");
                        return;
                    }
                });
            } else {
                isValid = true;
            }

            if (isValid) {
                let payload = {
                    image_url: formData.image_url,
                    device_ips: [...formData.device_ips, ...selectedDevices],
                    discover_also: formData.discover_also,
                    user_name: formData.user_name,
                    password: formData.password,
                };
                installImage(payload);
            }
        }
    };

    const installImage = async (payload) => {
        console.log("clear");

        imageUrlRef.current.value = "";
        userNameRef.current.value = "";
        passwordRef.current.value = "";
        deviceIpsRef.current.value = "";
        discoverAlsoRef.current.checked = false;
        gridRef.current.api.deselectAll();

        try {
            const response = await instance.put(installSonicURL(), payload);
            console.log(response?.data?.networks);

            if (Object.keys(response?.data?.networks).length > 0) {
                setNetworkList(response?.data?.networks);

                imageUrlRef.current.value = formData.image_url;
                userNameRef.current.value = formData.user_name;
                passwordRef.current.value = formData.password;
                deviceIpsRef.current.value = formData.device_ips;
                discoverAlsoRef.current.checked = formData.discover_also;
            }
        } catch (error) {
            console.log(error);
        } finally {
            setUpdateLog(true);
            setUpdateConfig(false);

            setFormData({
                image_url: "",
                device_ips: [],
                discover_also: false,
                user_name: "",
                password: "",
            });

            setSelectedDevices([]);
        }
    };

    return (
        <div>
            <div
                className="listContainer resizable"
                id="setupTopSection"
                style={{ overflowY: "auto" }}
            >
                <div className="form-wrapper align-center ">
                    <div className="form-field w-auto">
                        <label for="image_url">SONiC Image URL : </label>
                    </div>
                    <div className="form-field w-60">
                        <input
                            type="text"
                            name="image_url"
                            onChange={handleChange}
                            ref={imageUrlRef}
                        />
                    </div>
                </div>

                <div className="form-wrapper align-center">
                    <div className="w-50">
                        <div className="form-wrapper align-center">
                            <div className="form-field w-auto">
                                <label for="user_name">User Name : </label>
                            </div>
                            <div className="form-field w-60">
                                <input
                                    type="text"
                                    name="user_name"
                                    onChange={handleChange}
                                    ref={userNameRef}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-50">
                        <div className="form-wrapper align-center">
                            <div className="form-field w-auto">
                                <label for="password"> Password : </label>
                            </div>
                            <div className="form-field w-60">
                                <input
                                    type="password"
                                    name="password"
                                    onChange={handleChange}
                                    ref={passwordRef}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-field w-100" id="note">
                    <small>
                        NOTE: The user name and password is for SONiC image
                        specific
                    </small>
                </div>

                <div className="form-wrapper align-center">
                    <div className="form-field w-25">
                        <label for="device_ips">
                            ONIE Devices for SONiC installation :
                        </label>
                    </div>
                    <div className="form-field w-50">
                        <input
                            type="text"
                            name="device_ips"
                            ref={deviceIpsRef}
                            onChange={handleChange}
                            placeholder="Give one or more IP address or ONIE device address separated by comma"
                        />
                    </div>
                    <div className="form-field w-25">
                        <div style={{ display: "flex" }}>
                            <label for="discover_also" className="">
                                Discover also
                            </label>
                            <input
                                type="checkbox"
                                className="ml-15"
                                name="discover_also"
                                ref={discoverAlsoRef}
                                // checked={formData.discover_also}
                                onChange={handleCheckbox}
                            />
                        </div>
                    </div>
                </div>

                <div className="listTitle" id="sonicDeviceListHeader">
                    Select Devices for SONiC installation
                </div>
                <div className="" id="sonicDeviceTable">
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
                    <button
                        className="btnStyle mt-15 mr-15"
                        id="updateBtn"
                        onClick={send_update}
                        disabled={Object.keys(networkList).length > 0}
                    >
                        Update SONiC on Devices Selected
                    </button>
                </div>
            </div>

            <Modal
                show={isModalOpen}
                title={""}
                id={"installSonicModal"}
                onClose={() => setIsModalOpen(false)}
            >
                <div>
                    <p>Request has been submitted successfully</p>
                    <div className="mt-15 " style={{ textAlign: "center" }}>
                        <button
                            className="btnStyle "
                            onClick={() => setIsModalOpen(false)}
                        >
                            close
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
export default Home;
