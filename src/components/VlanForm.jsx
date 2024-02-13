import React, { useEffect, useState } from 'react';
import './tabbedpane/Form.scss'

const VlanForm = ({ onSubmit, selectedDeviceIp, onCancel }) => {
    const [formData, setFormData] = useState({
        mgt_ip: selectedDeviceIp || '',
        vlanid: 0,
        name: '',
        admin_sts: '',
        mtu: 9100,
    });
    const [selectedInterfaces, setSelectedInterfaces] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {

        const vlanid = parseFloat(formData.vlanid);
        const dataToSubmit = {
            ...formData,
            vlanid,
        };
        onSubmit(dataToSubmit);
    };

    const handleInterfaceSelect = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
        setSelectedInterfaces(selectedOptions);
    };

    useEffect(() => {
        setFormData(prevFormData => ({
            ...prevFormData,
            members: selectedInterfaces.join(', ')
        }));
    }, [selectedInterfaces]);

    return (
        <div className="form-wrapper">
            <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(formData);
            }} className="vlan-form">
                <div className="form-field">
                    <label>Device IP:</label>
                    <span>{selectedDeviceIp}</span>
                </div>

                <div className="form-field">
                    <label>VLAN_ID:</label>
                    <input
                        type="number"
                        name="vlanid"
                        value={formData.vlanid}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-field">
                    <label>Admin Status:</label>
                    <select
                        name="admin_sts"
                        value={formData.admin_sts}
                        onChange={handleChange}
                    >
                        <option value="up">up</option>
                        <option value="down">down</option>
                    </select>
                </div>

                <div className="form-field">
                    <label>MTU:</label>
                    <input
                        type="number"
                        name="mtu"
                        value={formData.mtu}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-field">
                    <input type="submit" value="Submit" />
                    <button type='button' onClick={onCancel}>Cancel</button>

                </div>
            </form>
        </div>
    );
};

export default VlanForm;