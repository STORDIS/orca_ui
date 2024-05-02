import React, { useState } from "react";
import { getDiscoveryUrl } from "../../backend_rest_urls";
import DiscoveryForm from "./DiscoveryForm";
import Modal from "../modal/Modal";
import { useLog } from "../../utils/logpannelContext";
import interceptor from "../../interceptor";
import { useDisableConfig } from "../../utils/dissableConfigContext";

const DiscoverButton = () => {
    const { setLog } = useLog();
    const { disableConfig, setDisableConfig } = useDisableConfig();

    const [discBtnText, setDiscBtnText] = useState("Discover Network");

    const [showForm, setShowForm] = useState(false);

    const instance = interceptor();

    const start_discovery = async (formData) => {
        setDiscBtnText("Discovery In Progress");
        setDisableConfig(true);
        try {
            setShowForm(false);
            const response = await instance.put(getDiscoveryUrl(), formData);

            setDiscBtnText("Discover Network");
            setDisableConfig(false);
            setLog(true);
            // navigate("/home");
            window.location.reload();
        } catch (error) {
            console.log(error);
            setDiscBtnText("Discover Network");
            setDisableConfig(false);
            setLog(true);
        }
    };
    return (
        <>
            <button
                className="btnStyle"
                onClick={() => setShowForm(true)}
                disabled={disableConfig}
               
            >
                {discBtnText}
            </button>
            <Modal
                show={showForm}
                onClose={() => setShowForm(false)}
                title="Discover"
            >
                <DiscoveryForm
                    handleSubmit={start_discovery}
                    onCancel={() => setShowForm(false)}
                />
            </Modal>
        </>
    );
};

export default DiscoverButton;
