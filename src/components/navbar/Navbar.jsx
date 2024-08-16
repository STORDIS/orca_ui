import "./navbar.scss";
import { FaSearch } from "react-icons/fa";
import { useAuth } from "../../utils/auth";
import React, { useState } from "react";
import { getDiscoveryUrl } from "../../utils/backend_rest_urls";
import DiscoveryForm from "./DiscoveryForm";
import Modal from "../modal/Modal";
import interceptor from "../../utils/interceptor";
import { getIsStaff } from "../../utils/common";
import useStoreLogs from "../../utils/store";

const Navbar = () => {
    const auth = useAuth();
    

    const [isDiscoveryBtnDisabled, disableDiscBtn] = useState(!getIsStaff());
    const [discBtnText, setDiscBtnText] = useState("Discover Network");

    const [showForm, setShowForm] = useState(false);

    const instance = interceptor();
    const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);

    const start_discovery = async (formData) => {
        setDiscBtnText("Discovery In Progress");
        disableDiscBtn(true);
        try {
            setShowForm(false);
            const response = await instance.put(getDiscoveryUrl(), formData);
            setDiscBtnText("Discover Network");
            disableDiscBtn(false);
            setUpdateLog(true);

            window.location.reload();
        } catch (error) {
            console.log(error);
            window.location.reload();
            setDiscBtnText("Discover Network");
            disableDiscBtn(false);
            setUpdateLog(true);
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
                            <DiscoveryForm handleSubmit={start_discovery} />
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
