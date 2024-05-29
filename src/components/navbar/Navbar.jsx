import "./navbar.scss";
import { FaSearch } from "react-icons/fa";
import { useAuth } from "../../utils/auth";
import React, { useState } from "react";
import { getDiscoveryUrl } from "../../utils/backend_rest_urls";
import DiscoveryForm from "./DiscoveryForm";
import Modal from "../modal/Modal";
import { useLog } from "../../utils/logpannelContext";
import interceptor from "../../utils/interceptor";

const Navbar = () => {
    const auth = useAuth();
    const { setLog } = useLog();

    const [isDiscoveryBtnDisabled, disableDiscBtn] = useState(false);
    const [discBtnText, setDiscBtnText] = useState("Discover Network");

    const [showForm, setShowForm] = useState(false);

    const instance = interceptor();

    const isValidIPv4WithCIDR = (ipWithCidr) => {
        const ipv4Regex =
            /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/;
        const cidrRegex = /^([0-9]|[12][0-9]|3[0-2])$/;

        const [ip, cidr] = ipWithCidr.split("/");

        if (ipv4Regex.test(ip)) {
            if (cidr === undefined || cidrRegex.test(cidr)) {
                return true;
            }
        }
        return false;
    };

    const start_discovery = async (formData) => {
        if (isValidIPv4WithCIDR(formData.address)) {
            console.log(formData.address);
            setDiscBtnText("Discovery In Progress");
            disableDiscBtn(true);
            try {
                setShowForm(false);
                const response = await instance.put(getDiscoveryUrl(), formData);

                setDiscBtnText("Discover Network");
                disableDiscBtn(false);
                setLog(true);

                window.location.reload();
            } catch (error) {
                console.log(error);
                setDiscBtnText("Discover Network");
                disableDiscBtn(false);
                setLog(true);
            }
        } else {
            alert("ip_address is not valid");
        }
    };

    const handleLogout = () => {
        auth.logout();
    };

    return (
        <div className="navbar">
            <div className="wrapper">
                <div className="search">
                    <input type="text" placeholder="Search..." />
                    <FaSearch />
                </div>
                <div className="items">
                    <div className="item">
                        <button
                            className="btnStyle"
                            onClick={() => setShowForm(true)}
                            disabled={isDiscoveryBtnDisabled}
                        >
                            {discBtnText}
                        </button>

                        <Modal
                            show={showForm}
                            onClose={() => setShowForm(false)}
                            title="Discover Devices"
                        >
                            <DiscoveryForm
                                handleSubmit={start_discovery}
                                onCancel={() => setShowForm(false)}
                            />
                        </Modal>
                    </div>

                    <div className="items" onClick={handleLogout}>
                        <button className="btnStyle">Logout</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
