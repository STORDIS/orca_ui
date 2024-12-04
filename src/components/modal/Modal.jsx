import React, { useEffect } from "react";
import "./Modal.scss";

const Modal = ({ show, onClose, onSubmit, children, title, id }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (show) {
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [show, onClose]);

    

    if (!show) {
        return null;
    }

    return (
        <div className="modal" onClick={onClose} id={id} >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h4 className="modal-title">{title}</h4>
                    <button className="modal-close" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    {React.Children.map(children, (child) =>
                        React.cloneElement(child, { onClose, onSubmit })
                    )}
                </div>
                <div className="modal-footer"></div>
            </div>
        </div>
    );
};

export default Modal;
