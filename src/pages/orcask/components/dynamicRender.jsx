import React, { useEffect, useState, useMemo } from "react";
import "../orcAsk.scss";
import { AgGridReact } from "ag-grid-react";
import { defaultColDef } from "../../../components/tabbedpane/datatablesourse";
import SigmaGraph from "../../graphsNcharts/sigmaGraph/sigmaGraph";

const DynamicRender = (props) => {
  const [displayData, setDisplayData] = useState([
    {
      message: "",
      responseType: "",
      type: "",
    },
  ]);

  useEffect(() => {
    checkWhichResponce(props.finalMessage);
  }, [props]);

  const checkWhichResponce = (res) => {
    setDisplayData([]);

    if (props.finalMessage.success.length > 0) {
      setDisplayData((prevData) => [
        ...prevData,
        {
          message: props.finalMessage.success,
          responseType: "success",
          type: checkTypeofResponse(props.finalMessage.success),
        },
      ]);
    }
    if (Object.keys(props.finalMessage.functions_result).length > 0) {
      setDisplayData((prev) => [
        ...prev,
        {
          message: props.finalMessage.functions_result,
          responseType: "function",
          type: checkTypeofResponse(props?.finalMessage?.functions_result),
        },
      ]);
    }

    if (props.finalMessage.fail.length > 0) {
      setDisplayData((prev) => [
        ...prev,
        {
          message: props.finalMessage.fail,
          responseType: "fail",
          type: checkTypeofResponse(props.finalMessage.fail),
        },
      ]);
    }

    if (
      props.finalMessage.success.length <= 0 &&
      Object.keys(props.finalMessage.functions_result).length <= 0 &&
      props.finalMessage.fail.length <= 0
    ) {
      setDisplayData((prev) => [
        ...prev,
        {
          message: "Unknown error",
          responseType: "unknown",
          type: checkTypeofResponse(""),
        },
      ]);
    }
  };

  const checkTypeofResponse = (res) => {
    if (typeof res === "string") {
      return "string";
    } else if (Array.isArray(res)) {
      return "array";
    } else if (res !== null && typeof res === "object") {
      for (const key in res) {
        if (
          res.hasOwnProperty(key) &&
          Array.isArray(res[key]) &&
          res[key].every((item) => typeof item === "object" && item !== null)
        ) {
          return "table_json";
        }
      }

      return "json";
    } else {
      return "unknown";
    }
  };

  const generateColumnDefs = (data) => {
    let temp = undefined;

    if (Array.isArray(data[0])) {
      temp = data[0];
    } else {
      temp = data;
    }

    if (temp?.length > 0) {
      return Object.keys(temp[0]).map((key) => ({
        headerName: key.replace(/_/g, " ").toUpperCase(),
        field: key,
        resizable: true,
        filter: true,
        filterParams: {
          buttons: ["clear"],
        },
        sortable: true,
        width: 130,
      }));
    }
    return [];
  };

  const getValue = (data) => {
    if (Array.isArray(data[0])) {
      return data[0];
    } else {
      return data;
    }
  };

  const [viewType, setViewType] = useState("table");

  const handleOptionChange = (e) => {
    setViewType(e.target.value);
  };

  const gridStyle = useMemo(() => ({ height: "300px", width: "100%" }), []);

  return (
    <div>
      {displayData.map((item, index) => (
        <>
          {item.type === "array" ? (
            <div className="mb-10">
              <ul
                style={{
                  listStyleType: "none",
                  padding: 0,
                  margin: 0,
                }}
              >
                {item.message?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : item.type === "table_json" ? (
            <div>
              {Object.entries(item.message).map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    marginBottom: "10px",
                    paddingBottom: "10px",
                  }}
                >
                  <div className="mt-5 mb-10 selectView">
                    {key}

                    <select
                      className="selectView"
                      name="selectView"
                      value={viewType}
                      onChange={handleOptionChange}
                    >
                      <option value="table">Table</option>
                      <option value="graph">Graph</option>
                    </select>
                  </div>
                  {viewType === "table" ? (
                    <div style={gridStyle} className="ag-theme-alpine">
                      <AgGridReact
                        rowData={getValue(value)}
                        columnDefs={generateColumnDefs(value)}
                        defaultColDef={defaultColDef}
                        enableCellTextSelection="true"
                      />
                    </div>
                  ) : viewType === "graph" ? (
                    <div className="graph" id="graph">
                      <SigmaGraph message={getValue(value)} />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div>
              {item.message.toString()}
              <br />
              {item.responseType}
              <br />
              {item.type}
            </div>
          )}
        </>
      ))}
    </div>
  );
};

export default DynamicRender;
