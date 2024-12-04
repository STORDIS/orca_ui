import { useEffect, useState } from "react";
import "./tabbedPaneTable.scss";
import { deviceUserColumns } from "./datatablesourse";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  getAllDevicesURL,
  syncURL,
  sheduleURL,
} from "../../utils/backend_rest_urls.js";
import interceptor from "../../utils/interceptor.js";
import useStoreLogs from "../../utils/store";
import useStoreConfig from "../../utils/configStore.js";

export const syncFeatureCommon = (payload, status) => {
  status(true);
  const instance = interceptor();
  const apiUrl = syncURL();
  return instance
    .put(apiUrl, payload)
    .then((res) => {
      status(false);
      return true;
    })
    .catch((err) => {
      console.error(err);
      status(false);
      return false;
    });
};

const Deviceinfo = (props) => {
  const selectedDeviceIp = props.selectedDeviceIp;
  const [changes, setChanges] = useState(undefined);
  const [syncData, setSyncData] = useState({
    device_ip: undefined,
    interval: "none",
  });
  const [dataTable, setDataTable] = useState([]);
  const instance = interceptor();
  const [configStatus, setConfigStatus] = useState("");

  const setUpdateConfig = useStoreConfig((state) => state.setUpdateConfig);
  const updateConfig = useStoreConfig((state) => state.updateConfig);
  const setUpdateLog = useStoreLogs((state) => state.setUpdateLog);

  useEffect(() => {
    getDeviceDetails();
    getShedule();
  }, [selectedDeviceIp]);

  const getDeviceDetails = () => {
    instance(getAllDevicesURL())
      .then((res) => {
        let data = res.data.filter((item) => item.mgt_ip === selectedDeviceIp);
        setDataTable(data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (props.refresh && changes !== undefined) {
      setDataTable([]);
      getDeviceDetails();
      getShedule();
    }
    props.reset(false);
  }, [props.refresh]);

  const getShedule = () => {
    const apiUrl = sheduleURL(selectedDeviceIp);
    instance
      .get(apiUrl)
      .then((res) => {
        setSyncData(res.data);
      })
      .catch((err) => {})
      .finally(() => {});
  };

  const sendUpdates = () => {
    setConfigStatus("Config In Progress....");

    if (changes !== "none") {
      const apiUrl = sheduleURL(selectedDeviceIp);
      instance
        .put(apiUrl, {
          mgt_ip: selectedDeviceIp,
          interval: parseInt(changes),
        })
        .then((res) => {})
        .catch((err) => {})
        .finally(() => {
          reload();
          setUpdateLog(true);
          setUpdateConfig(false);
        });
    } else {
      const apiUrl = sheduleURL(selectedDeviceIp);
      instance
        .delete(apiUrl, { data: { mgt_ip: selectedDeviceIp } })
        .then((res) => {})
        .catch((err) => {})
        .finally(() => {
          reload();
          setUpdateLog(true);
          setUpdateConfig(false);
        });
    }
  };

  const handleChange = (e) => {
    setChanges(e.target.value);
  };

  const reload = () => {
    setSyncData({
      device_ip: undefined,
      interval: "none",
    });
    getDeviceDetails();
    getShedule();
    setConfigStatus("");
    setChanges(undefined);
  };

  return (
    <div className="datatable" id="deviceDataTable">
      <div className="mt-5 mb-5">
        <button
          onClick={sendUpdates}
          disabled={updateConfig || changes === undefined}
          className="btnStyle m-10"
          id="applyConfigBtn"
        >
          Apply Config
        </button>
        <span className="configStatus" id="configStatus">
          {configStatus}
        </span>
      </div>
      <div>
        <table
          style={{
            borderCollapse: "collapse",
            border: "1px solid #ddd",
          }}
        >
          <tbody>
            {deviceUserColumns("info").map((column, index) => (
              <tr key={index}>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  {column.headerName}:
                </td>
                {dataTable.map((dataRow, rowIndex) => (
                  <td
                    key={rowIndex}
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    {column.headerName === "Rediscovery Frequency" ? (
                      <select
                        className="p-5 w-75"
                        onChange={handleChange}
                        defaultValue={"none"}
                        value={syncData.interval}
                      >
                        <option value="none">None</option>
                        <option value="10">10 Minutes</option>
                        <option value="20">20 Minutes</option>
                        <option value="30">30 Minutes</option>
                      </select>
                    ) : column.headerName === "Orca Status" ? (
                      <span> {props.orcaState} </span>
                    ) : (
                      dataRow[column.field]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Deviceinfo;
