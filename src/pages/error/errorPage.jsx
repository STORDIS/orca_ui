import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { GraphCanvas } from "reagraph";

import "./error.scss";

function ErrorPage() {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    const cols = [
        {
            label: "VLAN ID",
            type: "number",
        },
        {
            label: "Name",
            type: "string",
        },
        {
            label: "MTU",
            type: "number",
        },
        {
            label: "Admin Status",
            type: "string",
        },
        {
            label: "Oper Status",
            type: "string",
        },
        {
            label: "Autostate",
            type: "string",
        },
        {
            label: "ID",
            type: "number",
        },
        {
            label: "Members",
            type: "string",
        },
    ];
    const rows = [
        {
            c: [
                {
                    v: 3,
                },
                {
                    v: "Vlan3",
                },
                {
                    v: 9100,
                },
                {
                    v: "up",
                },
                {
                    v: "down",
                },
                {
                    v: "enable",
                },
                {
                    v: 156,
                },
                {
                    v: "",
                },
            ],
        },
        {
            c: [
                {
                    v: 2,
                },
                {
                    v: "Vlan2",
                },
                {
                    v: 9100,
                },
                {
                    v: "up",
                },
                {
                    v: "down",
                },
                {
                    v: "enable",
                },
                {
                    v: 155,
                },
                {
                    v: "",
                },
            ],
        },
        {
            c: [
                {
                    v: 1,
                },
                {
                    v: "Vlan1",
                },
                {
                    v: 9100,
                },
                {
                    v: "up",
                },
                {
                    v: "down",
                },
                {
                    v: "enable",
                },
                {
                    v: 154,
                },
                {
                    v: "",
                },
            ],
        },
    ];

    useEffect(() => {

    }, []);

    return (
        <div>
            <div className="listContainer">
                <div className="listTitle">Page Not Found</div>
                <div className="graph">
                    <GraphCanvas
                        draggable
                        nodes={nodes}
                        edges={edges}
                        sizingType="centrality"
                        maxNodeSize={25}
                        minNodeSize={10}
                        labelType="all"
                        pathSelectionType="all"
                    />
                </div>
            </div>
        </div>
    );
}
export default ErrorPage;
