import React, { useEffect, useState } from 'react';
import './tabbedpane/PortChannelForm.scss';

const PortChannelForm = ({ onSubmit, selectedDeviceIp, onCancel }) => {
    const [formData, setFormData] = useState({
        mgt_ip: selectedDeviceIp || '',
        lag_name: '',
        admin_sts: '',
        mtu: 0,
        members: '',
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
        const membersArray = formData.members.split(',').map(member => member.trim());
        console.log('123', membersArray, formData.members.split(','))
        const dataToSubmit = {
            ...formData,
            members: membersArray,
        };
        onSubmit(dataToSubmit);
    };

    const handleValue = (e) => {
        console.log('valiue', e)
        if (!/^PortChannel\d+$/.test(e.target.value)) {
            alert('Invalid lag_name format. It should follow the pattern "PortChannel..." where "..." is a numeric value.');
            return;
        }
    }

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
        <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(formData);
        }} className="port-channel-form">
            <div className="form-field">
                <label>Device IP:</label>
                <span>{selectedDeviceIp}</span>
            </div>
            <div className="form-field">
                <label htmlFor="lag-name">Channel Name:</label>
                <input
                    type="text"
                    name="lag_name"
                    value={formData.lag_name}
                    onChange={handleChange}
                    onBlur={handleValue}
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
                <label>Members:</label>
                <input
                    type="text"
                    name="members"
                    value={formData.members}
                    onChange={handleChange}
                />
            </div>
            <div className="form-field">
                <input type="submit" value="Submit" />
                <button type='button' onClick={onCancel}>Cancel</button>

            </div>
        </form>
    );
};

export default PortChannelForm;


