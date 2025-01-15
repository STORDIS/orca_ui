import React, { useEffect, useState, useMemo } from "react";
import "../orcAsk.scss";
import { AgGridReact } from "ag-grid-react";
import { defaultColDef } from "../../../components/tabbedpane/datatablesourse";
import SigmaGraph from "../../graphsNcharts/sigmaGraph/sigmaGraph";
import secureLocalStorage from "react-secure-storage";

const DynamicRender = ({ prompt_response, confirmationToParent }) => {
  const [displayData, setDisplayData] = useState([
    {
      heading: "",
      content: "",
      message: "",
      confirmationDesc: "",
      responseType: "",
      type: "",
    },
  ]);

  const theme = useMemo(() => {
    if (secureLocalStorage.getItem("theme") === "dark") {
      return "ag-theme-alpine-dark";
    } else {
      return "ag-theme-alpine";
    }
  }, []);

  useEffect(() => {
    checkWhichResponce(prompt_response);
  }, [prompt_response]);

  const checkWhichResponce = (res) => {
    setDisplayData([]);

    Object.keys(res).forEach((element, index) => {
      if (
        Array.isArray(res[element]?.result) &&
        res[element]?.result?.length > 0
      ) {
        setDisplayData((prevData) => [
          ...prevData,
          {
            heading: element,
            content: res[element]?.result,
            message: res[element]?.get_desc,
            confirmationDesc: undefined,
            responseType: "success",
            viewType: "table",
            type: "table_json",
          },
        ]);
      } else if (res[element]?.result && !Array.isArray(res[element]?.result)) {
        setDisplayData((prevData) => [
          ...prevData,
          {
            heading: element,
            content: [res[element]?.result],
            message: res[element]?.get_desc,
            confirmationDesc: undefined,
            responseType: "success",
            viewType: "table",
            type: "table_json",
          },
        ]);
      } else if (res[element]?.[0]?.["confirmation_desc"]) {
        let preKey = Object.keys(res)[index];

        setDisplayData((prevData) => [
          ...prevData,
          {
            heading: undefined,
            content: undefined,
            confirmationDesc: res[preKey][0]["confirmation_desc"],
            message: "I need your confirmation for the above operations.",
            responseType: "success",
            viewType: undefined,
            type: "confirmation",
          },
        ]);
      } else if (res[element]?.[0]?.["missing_args_desc"]) {
        let preKey = Object.keys(res)[index];

        setDisplayData((prevData) => [
          ...prevData,
          {
            heading: undefined,
            content: undefined,
            confirmationDesc: res[preKey][0]["missing_args_desc"],
            message:
              "Please provide the missing information to let me proceed.",
            responseType: "failure",
            viewType: undefined,
            type: "confirmation",
          },
        ]);
      } else if (element === "default_message") {
        setDisplayData((prevData) => [
          ...prevData,
          {
            message: res.default_message,
            content: undefined,
            heading: undefined,
            confirmationDesc: undefined,
            responseType: "success",
            viewType: undefined,
            type: "string",
          },
        ]);
      } else if (res[element].success) {
        setDisplayData((prevData) => [
          ...prevData,
          {
            message: res[element].success,
            content: undefined,
            heading: undefined,
            confirmationDesc: undefined,
            responseType: "success",
            viewType: undefined,
            type: "string",
          },
        ]);
      } else if (res[element].fail) {
        setDisplayData((prevData) => [
          ...prevData,
          {
            message: res[element].fail,
            content: undefined,
            heading: undefined,
            confirmationDesc: undefined,
            responseType: "failure",
            viewType: undefined,
            type: "string",
          },
        ]);
      } else {
        // setDisplayData((prevData) => [
        //   ...prevData,
        //   {
        //     message: "Something went wrong",
        //     content: undefined,
        //     heading: undefined,
        //     responseType: "failure",
        //     type: "string",
        //   },
        // ]);
      }
    });
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

  const handleOptionChange = (e, index) => {
    const value = e.target.value;

    setDisplayData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = {
        ...updatedData[index],
        viewType: value,
      };
      return updatedData;
    });

    // setViewType(e.target.value);
  };

  const handelConfirmation = () => {
    confirmationToParent("Yes");
  };

  const gridStyle = useMemo(() => ({ height: "300px", width: "100%" }), []);

  return (
    <div>
      {displayData.map((item, index) => (
        <div>
          {item.type === "table_json" ? (
            <div className="content mb-10">
              <div
                style={{
                  paddingBottom: "10px",
                }}
              >
                <div className="mt-5 mb-10 selectView">
                  {item.heading}

                  <select
                    className="selectView"
                    name="selectView"
                    value={item.viewType}
                    onChange={(e) => handleOptionChange(e, index)}
                  >
                    <option value="table">Table</option>
                    <option value="graph">Graph</option>
                  </select>
                </div>
                {item.viewType === "table" ? (
                  <>
                    <div style={gridStyle} className={theme}>
                      <AgGridReact
                        rowData={getValue(item.content)}
                        columnDefs={generateColumnDefs(item.content)}
                        defaultColDef={defaultColDef}
                        enableCellTextSelection="true"
                      />
                    </div>
                    <div className="mt-10"> {item.message} </div>
                  </>
                ) : item.viewType === "graph" ? (
                  <>
                    <div className="graph" id="graph">
                      <SigmaGraph message={getValue(item.content)} />
                    </div>
                    <div className="mt-10">{item.message}</div>
                  </>
                ) : null}
              </div>
            </div>
          ) : item.type === "confirmation" ? (
            <div
              className="content mb-10"
              style={{ display: "flex", alignItems: "center" }}
            >
              <div className="confirmation">
                {item.heading && <p className="mb-10"> {item.heading} </p>}
                {item.confirmationDesc && (
                  <p className="mb-10"> {item.confirmationDesc} </p>
                )}
                {item.message && <p className="mb-10"> {item.message} </p>}
              </div>
              <div style={{ marginLeft: "auto" }}>
                <button className="btnStyle" onClick={handelConfirmation}>
                  Yes
                </button>
              </div>
            </div>
          ) : (
            <div className="content mb-10">
              {item.heading && <p className="mb-10"> {item.heading} </p>}
              {item.confirmationDesc && (
                <p className="mb-10"> {item.confirmationDesc} </p>
              )}
              {item.message && <p className="mb-10"> {item.message} </p>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DynamicRender;
