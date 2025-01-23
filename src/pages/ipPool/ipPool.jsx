import React, { useState, useEffect, useMemo, useRef } from "react";
import { FaGlobe } from "react-icons/fa6";
import { isValidIPv4WithCIDR } from "../../utils/common";
import {
  ipPoolColumn,
  ipRangeColumn,
  defaultColDef,
} from "../../components/tabbedpane/datatablesourse";
import { AgGridReact } from "ag-grid-react";
import {
  ipRangeURL,
  ipAllIpsURL,
  ipAvailableURL,
} from "../../utils/backend_rest_urls";
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
      return []; // Return an empty array on error
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
    getPool();
  }, []);

  const getPool = () => {
    getIpAllIpsCommon().then((res) => {
      // console.log(res);
      setIpAllIps(res);
    });

    let ranges = [];
    getIpRangeCommon()
      .then((res) => {
        setIpRange(res);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIpFrom({ range: value });
  };

  const handleSubmit = (e) => {
    if (ipFrom.range === "") {
      alert("Starting range and ending range are required");
      return;
    }

    // if (!isValidIPv4WithCIDR(ipPool.range)) {
    //   alert("Invalid IP address");
    //   return;
    // }

    const apiUrl = ipRangeURL();
    const instance = interceptor();
    instance
      .put(apiUrl, ipFrom)
      .then((res) => {})
      .catch((err) => {})
      .finally(() => {
        setIpFrom({ range: "" });
        getPool();
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
      .then((res) => {
      })
      .catch((err) => {})
      .finally(() => {
        setSelectedRange([]);
        getPool();
      });
  };
  return (
    <>
      <div className="listContainer">
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
              value={ipFrom.range}
              className=""
            />
          </div>
          <div>
            <button className="btnStyle" onClick={handleSubmit}>
              Add
            </button>
          </div>
        </div>

        <div className="listTable">
          <div className="listTitle mt-15">
            All IP Ranges
            <button
              className="btnStyle"
              style={{ float: "right" }}
              onClick={handleRemove}
            >
              Remove
            </button>
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

          <div className="listTitle mt-15">All IP's</div>

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
                // onCellClicked={onCellClicked}
                stopEditingWhenCellsLoseFocus={true}
                // onCellValueChanged={handleCellValueChanged}
              ></AgGridReact>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IpPool;
