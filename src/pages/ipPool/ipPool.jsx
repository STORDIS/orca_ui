import React, { useState, useEffect } from "react";
import { FaGlobe } from "react-icons/fa6";
import { isValidIPv4WithCIDR } from "../../utils/common";

import { ipRangeURL, ipAvailabilityURL } from "../../utils/backend_rest_urls";
import interceptor from "../../utils/interceptor.js";

export const getIpAvailabilityCommon = () => {
  const instance = interceptor();
  const apiUrl = ipAvailabilityURL();

  return instance
    .get(apiUrl)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error(err);
      return []; // Return an empty array on error
    });
};

export const getIpRangeCommon = () => {
  const instance = interceptor();
  const apiUrl = ipRangeURL();

  return instance
    .get(apiUrl)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error(err);
      return []; // Return an empty array on error
    });
};

const IpPool = () => {
  const [ipPool, setIpPool] = useState({
    range: "",
  });

  useEffect(() => {
    getPool();
  }, []);

  const getPool = () => {
    getIpAvailabilityCommon().then((res) => {
      console.log(res);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIpPool({ ...ipPool, [name]: value });
  };

  const handleSubmit = (e) => {
    if (ipPool.range == "") {
      alert("Starting range and ending range are required");
      return;
    }

    if (!isValidIPv4WithCIDR(ipPool.range)) {
      alert("Invalid IP address");
      return;
    }

    const apiUrl = ipRangeURL();
    const instance = interceptor();
    instance
      .put(apiUrl, ipPool)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {})
      .finally(() => {
        getPool();
      });

    console.log(ipPool);
  };

  return (
    <div className="listContainer" style={{ height: "50vh" }}>
      <div
        className="form-wrapper"
        style={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <div className="form-field w-auto m-0">
          <label htmlFor="lag-name"> IP Range :</label>
        </div>
        <div className="form-field w-75 m-0">
          <input
            type="text"
            name="range"
            placeholder="Either range must be separated by hyphen (10.10.10.10-10.10.10.20) or subnet (10.10.10.0/24) or combination of any"
            onChange={handleChange}
            value={ipPool.range}
            className=""
          />
        </div>
        <div>
          <button className="btnStyle" onClick={handleSubmit}>
            Apply Config
          </button>
        </div>
      </div>
    </div>
  );
};

export default IpPool;
