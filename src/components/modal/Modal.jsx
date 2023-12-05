import React from 'react';
import './Modal.css';

const Modal = ({ show, onClose, children, title }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h4 className="modal-title">{title}</h4>
                    <button className='modal-close' onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-footer">
                </div>
            </div>
        </div>
    );
};

export default Modal;
