import React, { useEffect, useState } from "react";
import "./logModel.scss";
import Time from "react-time-format";

const GenericLogModal = ({ logData, onClose, onSubmit, title, id }) => {
    useEffect(() => {
        console.log(logData);
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    const formattedRequestJson = logData.request_json
        ? Object.entries(logData.request_json)
              .map(([key, value]) => `${key}: ${value}`)
              .join("\n") // Double newlines for extra space between pairs
        : "";

    return (
        <div className="modalContainer" onClick={onClose} id={id}>
            <div className="modalInner" onClick={(e) => e.stopPropagation()}>
                <h4 className="modalHeader">
                    {title}

                    <button className="btnStyle" onClick={onClose}>
                        Close
                    </button>
                </h4>

                <div className="modalBody mt-10 mb-10">
                    <table>
                        <tbody>
                            <tr>
                                <td className="w-25">Time :</td>
                                <td className="w-75">
                                    <Time
                                        value={logData.timestamp}
                                        format="hh:mm:ss DD-MM-YYYY"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="w-25">Status :</td>
                                <td className="w-75">
                                    {logData.status === "success" ? (
                                        <span style={{ color: "green" }}>
                                            {logData.status}
                                        </span>
                                    ) : logData.status === "failed" ? (
                                        <span style={{ color: "red" }}>
                                            {logData.status}
                                        </span>
                                    ) : (
                                        <span style={{ color: "yellow" }}>
                                            {logData.status}
                                        </span>
                                    )}
                                    - {logData.status_code}
                                </td>
                            </tr>
                            <tr>
                                <td className="w-25">http method :</td>
                                <td className="w-75">{logData.http_method}</td>
                            </tr>

                            <tr>
                                <td className="w-25">request Json :</td>
                                <td className="w-75">
                                    <pre>{formattedRequestJson}</pre>
                                </td>
                            </tr>
                            <tr>
                                <td className="w-25">response :</td>
                                <td className="w-75">{logData.response}</td>
                            </tr>
                            <tr>
                                <td className="w-25">processing Time :</td>
                                <td className="w-75">
                                    {parseFloat(
                                        logData.processing_time
                                    ).toFixed(4)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="modalFooter">footer</div>
            </div>
        </div>
    );
};

export default GenericLogModal;
