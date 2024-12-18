import { useState } from "react";
import { areAllIPAddressesValid } from "../../utils/common";
import { getDiscoveryUrl } from "../../utils/backend_rest_urls";
import interceptor from "../../utils/interceptor";
import useStoreLogs from "../../utils/store";
import useStorePointer from "../../utils/pointerStore";

const DiscoveryForm = ({ onClose }) => {
  const instance = interceptor();

  const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);
  const setUpdateStorePointer = useStorePointer(
    (state) => state.setUpdateStorePointer
  );

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
      start_discovery(payload);
    } else {
      alert("Invalid IP Address");
      return;
    }
  };

  const start_discovery = async (formData) => {
    try {
      const response = await instance.put(getDiscoveryUrl(), formData);
      setUpdateLog(true);
    } catch (error) {
      console.error(error);
      setUpdateLog(true);
    } finally {
      setUpdateStorePointer();
      onClose();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleFormData();
      }}
      className="form-container"
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
