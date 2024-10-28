import React, { useEffect, useState } from "react";
import "./logModel.scss";
import { json } from "react-router-dom";

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

    return (
        <div className="modalContainer" onClick={onClose} id={id}>
            <div className="modalInner" onClick={(e) => e.stopPropagation()}>
                <h4 className="modalHeader">{title}</h4>

                <div className="modalBody mt-10 mb-10">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Consequatur, similique dolor. Placeat architecto est odit
                    libero, recusandae veritatis dicta explicabo facilis illo
                    quas. Harum hic deserunt numquam minima iste sit.
                </div>
                <div className="modalFooter">footer</div>
            </div>
        </div>
    );
};

export default GenericLogModal;
