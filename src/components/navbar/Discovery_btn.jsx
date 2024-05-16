import React, { useState } from "react";
import { getDiscoveryUrl } from "../../utils/backend_rest_urls";
import DiscoveryForm from "./DiscoveryForm";
import Modal from "../modal/Modal";
import { useLog } from "../../utils/logpannelContext";
import interceptor from "../../utils/interceptor";
import { useNavigate } from "react-router-dom";

const DiscoverButton = () => {
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
            setDiscBtnText("Discover Network");
            disableDiscBtn(false);
            setLog(true);
        }
    };
    return (
        <>
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
        </>
    );
};

export default DiscoverButton;
