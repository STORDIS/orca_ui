import { useState } from "react";
import { areAllIPAddressesValid } from "../../utils/common";

const DiscoveryForm = ({ handleSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        address: "",
        discover_from_config: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value.trim(),
        }));
    };

    const handleFormData = () => {
        if (formData.address.trim().length === 0) {
            formData.discover_from_config = true;
        }

        if (areAllIPAddressesValid(formData.address)) {
            let payload = {
                address: formData?.address?.split(",").map((ip) => ip.trim()),
                discover_from_config: formData.discover_from_config,
            };
            handleSubmit(payload);
        } else {
            alert("Invalid IP Address");
            return;
        }
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleFormData();
            }}
            className="port-channel-form"
        >
            <div className="form-field">
                <label>Address:</label>

                <input
                    type="text"
                    name="address"
                    id="discoveryIpAddress"
                    onChange={handleChange}
                    placeholder="Network Address or Device IP."
                />

                <p className="mt-10">
                    Note : Use (,) Comma to separate the multiple IP address
                </p>
            </div>
            <div className="">
                <button
                    className="btnStyle mt-10 mr-10"
                    type="submit"
                    id="submitDiscovery"
                >
                    Submit
                </button>
                <button
                    className="btnStyle mt-10"
                    type="button"
                    id="cancelDiscovery"
                    onClick={onClose}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default DiscoveryForm;
