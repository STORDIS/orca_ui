import React, { useState } from "react";
import { FaGlobe } from "react-icons/fa6";
import { isValidIPv4WithCIDR } from "../../utils/common";

const IpPool = () => {
  const [ipPool, setIpPool] = useState({
    starting_range: "",
    ending_range: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIpPool({ ...ipPool, [name]: value });
  };

  const handleSubmit = (e) => {
    if (ipPool.starting_range == "" || ipPool.ending_range == "") {
      alert("Starting range and ending range are required");
      return;
    }

    if (
      !isValidIPv4WithCIDR(ipPool.starting_range) ||
      !isValidIPv4WithCIDR(ipPool.ending_range)
    ) {
      alert("Invalid IP address");
      return;
    }

    e.preventDefault();
    console.log(ipPool);
  };

  return (
    <div className="listContainer">
      <div className="form-wrapper" style={{ justifyContent: "space-between" }}>
        <div className="form-field w-max">
          <label htmlFor="lag-name"> Starting Range :</label>
        </div>
        <div className="form-field w-33">
          <input
            type="text"
            name="starting_range"
            onChange={handleChange}
            value={ipPool.starting_range}
          />
        </div>
        <div className="form-field w-max">
          <label htmlFor="lag-name"> Ending Range :</label>
        </div>
        <div className="form-field w-33">
          <input
            type="text"
            name="ending_range"
            onChange={handleChange}
            value={ipPool.ending_range}
          />
        </div>
      </div>

      <div>
        <button className="btnStyle" onClick={handleSubmit}>
          Apply Config
        </button>
      </div>
    </div>
  );
};

export default IpPool;
