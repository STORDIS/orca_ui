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

    const start_discovery = async (formData) => {
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
            window.location.reload();
            setDiscBtnText("Discover Network");
            disableDiscBtn(false);
            setLog(true);
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
