import React from "react";
import { Chart } from "react-google-charts";

import "./error.scss";

function ErrorPage() {
    const data = {
        cols: [
            { label: "Name", type: "string" },
            { label: "Admin Status", type: "number" },
        ],
        rows: [
            { c: [{ v: "Ethernet56" }, { v: 0 }] },
            { c: [{ v: "Management0" }, { v: 1 }] },
            { c: [{ v: "Ethernet76" }, { v: 1 }] },
            { c: [{ v: "Ethernet72" }, { v: 1 }] },
            { c: [{ v: "Ethernet68" }, { v: 1 }] },
            { c: [{ v: "Ethernet64" }, { v: 1 }] },
            { c: [{ v: "Ethernet60" }, { v: 0 }] },
            { c: [{ v: "Ethernet0" }, { v: 0 }] },
            { c: [{ v: "Ethernet1" }, { v: 0 }] },
            { c: [{ v: "Ethernet2" }, { v: 0 }] },
            { c: [{ v: "Ethernet3" }, { v: 0 }] },
            { c: [{ v: "Ethernet4" }, { v: 0 }] },
            { c: [{ v: "Ethernet5" }, { v: 0 }] },
            { c: [{ v: "Ethernet6" }, { v: 0 }] },
            { c: [{ v: "Ethernet7" }, { v: 0 }] },
            { c: [{ v: "Ethernet8" }, { v: 0 }] },
            { c: [{ v: "Ethernet9" }, { v: 0 }] },
            { c: [{ v: "Ethernet10" }, { v: 0 }] },
            { c: [{ v: "Ethernet11" }, { v: 0 }] },
            { c: [{ v: "Ethernet12" }, { v: 0 }] },
            { c: [{ v: "Ethernet13" }, { v: 0 }] },
            { c: [{ v: "Ethernet14" }, { v: 0 }] },
            { c: [{ v: "Ethernet15" }, { v: 0 }] },
            { c: [{ v: "Ethernet16" }, { v: 0 }] },
            { c: [{ v: "Ethernet17" }, { v: 0 }] },
            { c: [{ v: "Ethernet18" }, { v: 0 }] },
            { c: [{ v: "Ethernet19" }, { v: 0 }] },
            { c: [{ v: "Ethernet20" }, { v: 0 }] },
            { c: [{ v: "Ethernet21" }, { v: 0 }] },
            { c: [{ v: "Ethernet22" }, { v: 0 }] },
            { c: [{ v: "Ethernet23" }, { v: 0 }] },
            { c: [{ v: "Ethernet24" }, { v: 0 }] },
            { c: [{ v: "Ethernet25" }, { v: 0 }] },
            { c: [{ v: "Ethernet26" }, { v: 0 }] },
            { c: [{ v: "Ethernet27" }, { v: 0 }] },
            { c: [{ v: "Ethernet28" }, { v: 0 }] },
            { c: [{ v: "Ethernet29" }, { v: 0 }] },
            { c: [{ v: "Ethernet30" }, { v: 0 }] },
            { c: [{ v: "Ethernet31" }, { v: 0 }] },
            { c: [{ v: "Ethernet32" }, { v: 0 }] },
            { c: [{ v: "Ethernet33" }, { v: 0 }] },
            { c: [{ v: "Ethernet34" }, { v: 0 }] },
            { c: [{ v: "Ethernet35" }, { v: 0 }] },
            { c: [{ v: "Ethernet36" }, { v: 0 }] },
            { c: [{ v: "Ethernet37" }, { v: 0 }] },
            { c: [{ v: "Ethernet38" }, { v: 0 }] },
            { c: [{ v: "Ethernet39" }, { v: 0 }] },
            { c: [{ v: "Ethernet40" }, { v: 0 }] },
            { c: [{ v: "Ethernet41" }, { v: 0 }] },
            { c: [{ v: "Ethernet42" }, { v: 0 }] },
            { c: [{ v: "Ethernet43" }, { v: 0 }] },
            { c: [{ v: "Ethernet44" }, { v: 0 }] },
            { c: [{ v: "Ethernet45" }, { v: 0 }] },
            { c: [{ v: "Ethernet46" }, { v: 0 }] },
            { c: [{ v: "Ethernet47" }, { v: 0 }] },
            { c: [{ v: "Ethernet48" }, { v: 0 }] },
            { c: [{ v: "Ethernet52" }, { v: 0 }] },
        ],
    };

    return (
        <div>
            <div className="listContainer">
                <div className="listTitle">Page Not Found</div>

                <Chart
                    chartType="Table"
                    data={data}
                    width="100%"
                    height="400px"
                    legendToggle
                />
            </div>
        </div>
    );
}
export default ErrorPage;
