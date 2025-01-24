import React, { useState, useEffect, useMemo, useRef } from "react";
import { FaGlobe } from "react-icons/fa6";
import {
  isValidIPv4WithCIDR,
  isValidIPAddressOrRange,
} from "../../utils/common.js";
import {
  ipPoolColumn,
  ipRangeColumn,
  defaultColDef,
} from "../../components/tabbedpane/datatablesourse.js";
import { AgGridReact } from "ag-grid-react";
import {
  ipRangeURL,
  ipAllIpsURL,
  ipAvailableURL,
} from "../../utils/backend_rest_urls.js";
import interceptor from "../../utils/interceptor.js";
import secureLocalStorage from "react-secure-storage";

export const getIpAllIpsCommon = () => {
  const instance = interceptor();
  const apiUrl = ipAllIpsURL();

  return instance
    .get(apiUrl)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
};

export const getIpAvailableCommon = () => {
  const instance = interceptor();
  const apiUrl = ipAvailableURL();

  return instance
    .get(apiUrl)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error(err);
      return [];
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
      return [];
    });
};

const IPAM = () => {
  const [ipFrom, setIpFrom] = useState({
    range: "",
  });
  const [ipAllIps, setIpAllIps] = useState([]);
  const [ipRange, setIpRange] = useState([]);

  const theme = useMemo(() => {
    if (secureLocalStorage.getItem("theme") === "dark") {
      return "ag-theme-alpine-dark";
    } else {
      return "ag-theme-alpine";
    }
  }, []);

  const [heightPoolTable, setHeightPoolTable] = useState(250);
  const poolTableRef = useRef(null);

  const handleResizePoolTable = () => {
    if (poolTableRef.current.offsetHeight > 250) {
      setHeightPoolTable(poolTableRef.current.offsetHeight);
    }
  };

  const gridStylePoolTable = useMemo(
    () => ({ height: heightPoolTable + "px", width: "100%" }),
    [heightPoolTable]
  );

  const [heightRangeTable, setHeightRangeTable] = useState(250);
  const rangeTableRef = useRef(null);
  const gridRefRangeTable = useRef(null);

  const handleResizeRangeTable = () => {
    if (rangeTableRef.current.offsetHeight > 250) {
      setHeightRangeTable(rangeTableRef.current.offsetHeight);
    }
  };

  const gridStyleRangeTable = useMemo(
    () => ({ height: heightRangeTable + "px", width: "100%" }),
    [heightRangeTable]
  );

  useEffect(() => {
    getRange();
    getIpAllIps();
  }, []);

  const getRange = () => {
    setIpRange([]);

    getIpRangeCommon()
      .then((res) => {
        setIpRange(res);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {});
  };

  const getIpAllIps = () => {
    setIpAllIps([]);
    getIpAllIpsCommon().then((res) => {
      setIpAllIps(res);
    });
  };

  const handleChange = (e) => {
    setIpFrom({ range: e.target.value });
  };

  const handleSubmit = (e) => {
    if (ipFrom.range === "") {
      alert("IP range is required");
      return;
    }

    if (!isValidIPAddressOrRange(ipFrom.range)) {
      alert("Invalid IP range");
      return;
    }

    const apiUrl = ipRangeURL();
    const instance = interceptor();
    instance
      .put(apiUrl, ipFrom)
      .then((res) => {})
      .catch((err) => {})
      .finally(() => {
        setIpFrom({ range: "" });
        getRange();
        getIpAllIps();
      });
  };

  const [selectedRange, setSelectedRange] = useState([]);

  const onSelectionChanged = (e) => {
    const selectedNodes = gridRefRangeTable.current.api.getSelectedNodes();
    let selectedIpRange = selectedNodes.map((node) => node.data.range);

    selectedIpRange = selectedIpRange.map((range) => {
      return {
        range: range,
      };
    });

    setSelectedRange(selectedIpRange);
  };

  const handleRemove = (e) => {
    console.log(selectedRange);

    const apiUrl = ipRangeURL();
    const instance = interceptor();
    instance
      .delete(apiUrl, { data: selectedRange })
      .then((res) => {})
      .catch((err) => {})
      .finally(() => {
        setSelectedRange([]);
        getRange();
        getIpAllIps();
      });
  };
  return (
    <div className="listContainer">
      <div
        className="form-wrapper"
        style={{
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          className="form-wrapper w-100 "
          style={{
            alignItems: "center",
          }}
        >
          <div className="form-field w-auto m-0">
            <label htmlFor="lag-name"> IP Range :</label>
          </div>
          <div className="form-field w-60 m-0">
            <input
              type="text"
              name="range"
              placeholder=" Range must be 10.10.10.10-10.10.10.20 (separated by hyphen) or subnet 10.10.10.0/24"
              onChange={handleChange}
              value={ipFrom.range}
              className=""
            />
          </div>
        </div>
        <div>
          <button
            className="btnStyle"
            onClick={handleSubmit}
            disabled={ipFrom.range === ""}
          >
            Add
          </button>
        </div>
      </div>

      <div className="listTable">
        <div className="listTitle mt-15">
          All IP Range
          <div style={{ float: "right" }}>
            <button
              className="btnStyle"
              onClick={handleRemove}
              disabled={selectedRange.length === 0}
            >
              Remove
            </button>
            <button
              className="btnStyle ml-15"
              onClick={() => {
                getRange();
                getIpAllIps();
              }}
            >
              Refresh
            </button>
          </div>
        </div>

        <div
          className="datatable resizable mt-15"
          id="dataTable"
          ref={rangeTableRef}
          onMouseMove={handleResizeRangeTable}
        >
          <div style={gridStyleRangeTable} className={theme}>
            <AgGridReact
              ref={gridRefRangeTable}
              rowData={ipRange}
              columnDefs={ipRangeColumn}
              defaultColDef={defaultColDef}
              enableCellTextSelection="true"
              stopEditingWhenCellsLoseFocus={true}
              onSelectionChanged={onSelectionChanged}
              rowSelection="multiple"
              suppressRowClickSelection={true}
            ></AgGridReact>
          </div>
        </div>

        <div className="listTitle mt-15">
          All IP's
          <button
            className="btnStyle"
            style={{ float: "right" }}
            onClick={getIpAllIps}
          >
            Refresh
          </button>
        </div>

        <div
          className="datatable resizable mt-15"
          id="dataTable"
          ref={poolTableRef}
          onMouseMove={handleResizePoolTable}
        >
          <div style={gridStylePoolTable} className={theme}>
            <AgGridReact
              rowData={ipAllIps}
              columnDefs={ipPoolColumn}
              defaultColDef={defaultColDef}
              enableCellTextSelection="true"
              stopEditingWhenCellsLoseFocus={true}
            ></AgGridReact>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPAM;
