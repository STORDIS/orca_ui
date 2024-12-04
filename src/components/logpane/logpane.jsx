import React, { useEffect, useMemo, useState, useRef } from "react";
import "./logpane.scss";
import Time from "react-time-format";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import interceptor from "../../utils/interceptor";
import { logPanelURL, logPanelDeleteURL } from "../../utils/backend_rest_urls";

import { getIsStaff } from "../../utils/common";
import useStoreLogs from "../../utils/store";
import GenericLogModal from "../../components/modal/genericLogModal";
import SetupLogModal from "../../components/modal/setupLogModal";
import DiscoveryLogModal from "../../components/modal/discoveryLogModal";
import { FaRegPlayCircle } from "react-icons/fa";
import { FaRotateLeft } from "react-icons/fa6";
import { FaHourglassHalf } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaRegCircleXmark } from "react-icons/fa6";

export const LogViewer = () => {
  const logPannelDivRef = useRef(null);

  const [logEntries, setLogEntries] = useState([]);

  const instance = interceptor();

  const updateLog = useStoreLogs((state) => state.updateLog);
  const resetUpdateLog = useStoreLogs((state) => state.resetUpdateLog);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs] = useState([
    {
      field: "index",
      headerName: "#",
      valueGetter: (params) => params.node.rowIndex + 1,
      width: 50,
      resizable: true,
      filter: true,
      filterParams: {
        buttons: ["clear"],
      },
      sortable: true,
    },
    {
      field: "timestamp",
      headerName: "Time",
      width: 170,
      resizable: true,
      filter: true,
      filterParams: {
        buttons: ["clear"],
      },
      sortable: true,
      cellRenderer: (params) => {
        return <Time value={params?.value} format="hh:mm:ss DD-MM-YYYY" />;
      },
      tooltipValueGetter: (params) => {
        return params.value;
      },
    },
    {
      field: "processing_time",
      headerName: "Process Time",
      width: 100,
      resizable: true,
      filter: true,
      filterParams: {
        buttons: ["clear"],
      },
      sortable: true,
      cellRenderer: (params) => {
        let num = params.value;
        num = parseFloat(num);
        num = num.toFixed(2);
        return <span>{num} sec</span>;
      },
      tooltipValueGetter: (params) => {
        return params.value;
      },
    },
    {
      field: "request_json",
      headerName: "Task",
      width: 500,
      resizable: true,
      filter: true,
      filterParams: {
        buttons: ["clear"],
      },
      sortable: true,
      valueGetter: (params) => {
        return (
          params.data.http_method +
          " : " +
          JSON.stringify(params.data.request_json)
        );
      },
      cellRenderer: (params) => {
        return params.value;
      },
      tooltipValueGetter: (params) => {
        return params.value;
      },
    },
    {
      field: "status",
      headerName: "State",
      width: 400,
      resizable: true,
      sortable: true,
      filter: true,
      filterParams: {
        buttons: ["clear"],
      },
      cellRenderer: (params) => {
        if (params.value.toUpperCase() === "SUCCESS") {
          return (
            <div
              className="icon"
              id={params?.data?.status_code}
              state="SUCCESS"
            >
              <FaRegCheckCircle style={{ fontSize: "24px" }} />
            </div>
          );
        } else if (params.value.toUpperCase() === "STARTED") {
          return (
            <div
              className="icon"
              id={params?.data?.status_code}
              state="STARTED"
            >
              <FaRegPlayCircle style={{ fontSize: "24px" }} />
              &nbsp; {params.data.status}
            </div>
          );
        } else if (params.value.toUpperCase() === "PENDING") {
          return (
            <div
              className="icon"
              id={params?.data?.status_code}
              state="PENDING"
            >
              <FaHourglassHalf style={{ fontSize: "24px" }} />
              &nbsp; {params.data.status}
            </div>
          );
        } else if (params.value.toUpperCase() === "REVOKED") {
          return (
            <div
              className="icon"
              id={params?.data?.status_code}
              state="REVOKED"
            >
              <FaRotateLeft style={{ fontSize: "24px" }} />
              &nbsp; {JSON.stringify(params?.data?.response)}
              &nbsp;
            </div>
          );
        } else {
          return (
            <div className="icon" id={params?.data?.status_code} state="FAILED">
              <FaRegCircleXmark style={{ fontSize: "24px" }} />
              &nbsp; {JSON.stringify(params?.data?.response)}
              &nbsp;
            </div>
          );
        }
      },
      cellStyle: (params) => {
        if (params.value.toUpperCase() === "SUCCESS") {
          return { color: "#198754", display: "flex" };
        } else if (params.value.toUpperCase() === "STARTED") {
          return { color: "#FFC107", display: "flex" };
        } else if (params.value.toUpperCase() === "PENDING") {
          return { color: "#6C757D", display: "flex" };
        } else if (params.value.toUpperCase() === "REVOKED") {
          return { color: "#198754", display: "flex" };
        } else {
          return { color: "#DC3545", display: "flex" };
        }
      },
      tooltipValueGetter: (params) => {
        if (params?.data?.response) {
          return JSON.stringify(params?.data?.response);
        } else {
          return params?.data?.status;
        }
      },
    },
  ]);

  const [height, setHeight] = useState(400);

  useEffect(() => {
    if (updateLog) {
      getLogs();
    }
  }, [updateLog]);

  useEffect(() => {
    getLogs();
  }, []);

  const getLogs = () => {
    setLogEntries([]);
    instance
      .get(logPanelURL())
      .then((response) => {
        setLogEntries(response.data);
        resetUpdateLog();
      })
      .catch((error) => {
        console.error("Error:", error);
        setLogEntries([]);
      });
  };

  const handelClearLog = () => {
    instance
      .delete(logPanelDeleteURL())
      .then((response) => {
        resetUpdateLog();
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        getLogs();
        resetUpdateLog();
      });
  };

  const handleResize = () => {
    if (logPannelDivRef.current.offsetHeight > 400) {
      setHeight(logPannelDivRef.current.offsetHeight);
    }
  };

  const gridStyle = useMemo(
    () => ({ height: height - 100 + "px", width: "100%" }),
    [height]
  );

  const [showLogDetails, setShowLogDetails] = useState("null");
  const [logDetails, setLogDetails] = useState({});

  const openLogDetails = (params) => {
    getLogs();
    switch (params.data.http_path) {
      case "/install_image":
        setShowLogDetails("setupDialog");
        break;
      case "/switch_image":
        setShowLogDetails("setupDialog");
        break;
      case "/discover":
        setShowLogDetails("discoveryDialog");
        break;

      default:
        setShowLogDetails("genericDialog");
        break;
    }

    setLogDetails(params.data);
  };

  const gridRef = useRef(null); // Reference for AG Grid instance
  const clearFilters = () => {
    if (gridRef.current) {
      gridRef.current.api.setFilterModel(null); // Clear all filters
    }
  };

  return (
    <div
      className="logPanel resizable"
      id="logPanel"
      ref={logPannelDivRef}
      onMouseMove={handleResize}
    >
      <div
        className="mb-15"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="listTitle">Task</div>
        <div>
          <button className="clearLogBtn btnStyle ml-15" onClick={clearFilters}>
            Clear All Filters
          </button>

          <button
            id="clearLogBtn"
            className="clearLogBtn btnStyle ml-15"
            onClick={handelClearLog}
            disabled={!getIsStaff()}
          >
            Remove All Tasks
          </button>

          <button
            id="refreshLogBtn"
            className="clearLogBtn btnStyle ml-15"
            onClick={getLogs}
            disabled={!getIsStaff()}
          >
            Refresh
          </button>
        </div>
      </div>
      <div style={gridStyle} className="ag-theme-alpine ">
        <AgGridReact
          ref={gridRef}
          rowData={logEntries}
          columnDefs={colDefs}
          onRowClicked={(params) => {
            openLogDetails(params);
          }}
          pagination={true}
          paginationPageSize={50}
          paginationPageSizeSelector={[50, 100, 150, 200]}
        />
      </div>

      {showLogDetails === "setupDialog" && (
        <SetupLogModal
          logData={logDetails}
          onClose={() => setShowLogDetails(false)}
          onSubmit={() => setShowLogDetails(false)}
          title="Log Details"
          id="setupLogDetails"
        />
      )}
      {showLogDetails === "genericDialog" && (
        <GenericLogModal
          logData={logDetails}
          onClose={() => setShowLogDetails(false)}
          onSubmit={() => setShowLogDetails(false)}
          title="Log Details"
          id="genericLogDetails"
        />
      )}
      {showLogDetails === "discoveryDialog" && (
        <DiscoveryLogModal
          logData={logDetails}
          onClose={() => setShowLogDetails(false)}
          onSubmit={() => setShowLogDetails(false)}
          title="Log Details"
          id="discoveryLogDetails"
        />
      )}
    </div>
  );
};

export default LogViewer;
