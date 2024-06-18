import { useEffect, useState } from "react";
import "./tabbedPaneTable.scss";
import { deviceUserColumns } from "./datatablesourse";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getAllDevicesURL } from "../../utils/backend_rest_urls.js";
import interceptor from "../../utils/interceptor.js";

const Deviceinfo = (props) => {
    const {
        rows,
        columns,
        isTabbedPane = false,
        selectedDeviceIp = "",
    } = props;
    console.log(rows, columns, selectedDeviceIp);

    const [dataTable, setDataTable] = useState([]);
    const instance = interceptor();

    useEffect(() => {
        instance(getAllDevicesURL())
            .then((res) => {
                if (isTabbedPane) {
                    let data = res.data.filter(
                        (item) => item.mgt_ip === selectedDeviceIp
                    );
                    setDataTable(data);
                } else {
                    setDataTable(res.data);
                }
            })
            .catch((err) => console.log(err));
    }, [selectedDeviceIp]);

    return (
        <table
            className="mt-25"
            style={{ borderCollapse: "collapse", border: "1px solid #ddd" }}
        >
            <tbody>
                {deviceUserColumns().map((column, index) => (
                    <tr key={index}>
                        <td
                            style={{ border: "1px solid #ddd", padding: "8px" }}
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
                                {dataRow[column.field]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Deviceinfo;
