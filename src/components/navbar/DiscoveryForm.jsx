import { useState } from "react";

const DiscoveryForm = ({ handleSubmit, onCancel }) => {
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

    const isValidIPv4 = (ip) => {
        const ipv4Pattern =
            /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return ipv4Pattern.test(ip);
    };

    const isValidCIDR = (cidr) => {
        const cidrPattern =
            /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/([0-9]|[1-2][0-9]|3[0-2])$/;
        return cidrPattern.test(cidr);
    };

    const areAllIPAddressesValid = (input) => {
        const ipAddresses = input.split(",").map((ip) => ip.trim());
        return ipAddresses.every((ip) => isValidIPv4(ip) || isValidCIDR(ip));
    };

    const handleFormData = () => {
        if (formData.address.trim().length === 0) {
            formData.discover_from_config = true;
        }

        if (areAllIPAddressesValid(formData.address)) {

            
            let payload = {
                address: formData.address.split(",").map((ip) => ip.trim()),
                discover_from_config: formData.discover_from_config,
            }
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
                    onChange={handleChange}
                    placeholder="Network Address or Device IP."
                />

                <p className="mt-10">
                    Note : Use (,) Comma to separate the multiple IP address{" "}
                </p>
            </div>
            <div className="">
                <button className="btnStyle mt-10 mr-10" type="submit">
                    Submit
                </button>
                <button
                    className="btnStyle mt-10"
                    type="button"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default DiscoveryForm;
