import React, { useState } from "react";
import { getDiscoveryUrl } from "../../backend_rest_urls";
import DiscoveryForm from "./DiscoveryForm";
import Modal from "../modal/Modal";

import { useLog } from "../../LogContext";

import interceptor from "../../interceptor";

const DiscoverButton = () => {
    const [isDiscoveryBtnDisabled, disableDiscBtn] = useState(false);
    const [discBtnText, setDiscBtnText] = useState("Discover Network");
    const buttonStyle =
        discBtnText === "Discovery In Progress"
            ? {
                  backgroundColor: "#ccc",
                  color: "#666",
                  border: "1px solid black",
                  borderRadius: "4px",
                  padding: "6px 12px",
                  fontFamily: "Nunito, sans-serif",
                  disabled: true,
              }
            : {
                  backgroundColor: "lightgray",
                  color: "black",
                  border: "1px solid black",
                  borderRadius: "4px",
                  padding: "6px 12px",
                  fontFamily: "Nunito, sans-serif",
              };

    const { setLog } = useLog();

    const [showForm, setShowForm] = useState(false);

    const instance = interceptor();

    const start_discovery = async (formData) => {
        setDiscBtnText("Discovery In Progress");
        disableDiscBtn(true);
        try {
            setShowForm(false);
            const response = await instance.put(getDiscoveryUrl(), formData);
            console.log(response.data);

            if (response?.data?.result?.length === 1) {
                console.log("if");
                setLog({
                    status: "success",
                    result: "Device discovered successfully",
                    timestamp: new Date().getTime(),
                });
            } else {
                console.log("else");
                setLog({
                    status: response?.data?.result[1],
                    result: response?.data?.result[0],
                    timestamp: new Date().getTime(),
                });
            }

            setDiscBtnText("Discover Network");
            disableDiscBtn(false);
        } catch (error) {
            console.log(error);
            setDiscBtnText("Discover Network");
            disableDiscBtn(false);

            let startIndex = error?.response?.data?.result[0]?.indexOf("{");
            let endIndex = error?.response?.data?.result[0]?.lastIndexOf("}");
            let trimmedResponse = error?.response?.data?.result[0]?.substring(
                startIndex + 1,
                endIndex
            );
            const match =
                error?.response?.data?.result[0]?.match(/Reason:(.*)/);

            const reasonText = match[1].trim();

            setLog({
                status: reasonText,
                result: trimmedResponse,
                timestamp: new Date().getTime(),
            });
        }
    };
    return (
        <>
            <button
                className="btnStyle"
                id="btnDiscovery"
                // onClick={btnHandler}
                onClick={() => setShowForm(true)}
                disabled={isDiscoveryBtnDisabled}
                variant="contained"
                size="small"
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
