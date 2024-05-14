import chroma from "chroma-js";
import Graph from "graphology";
import ForceSupervisor from "graphology-layout-force/worker";
import Sigma from "sigma";
import { v4 as uuid } from "uuid";
import React, { useRef, useEffect, useState } from "react";
import { color } from "d3";

const SigmaGraph = (props) => {
    // Retrieve the html document for sigma container

    let container_id = "check" + Math.random();

    useEffect(() => {
        let tempNodes = [];
        let tempEdges = [];

        props.message.rows.forEach((element) => {
            tempNodes.push({
                id: "",
                label: "",
                color: "Green",
                size: 10,
            });
            tempEdges.push({
                source: "0",
                target: "",
                name: "",
                color: "Grey",
            });
        });

        let found = false;
        let labelToUse;

        props?.message?.cols.forEach((col, i) => {
            if (
                col?.label.toLowerCase().includes("name") &&
                col?.label.toLowerCase() !== "name"
            ) {
                found = true;
                labelToUse = col?.label;
                return;
            } else if (col?.label.toLowerCase() === "name" && !found) {
                labelToUse = col?.label;
                return;
            } else if (
                col?.label.toLowerCase().includes("id") &&
                col?.label.toLowerCase() !== "id" &&
                !found
            ) {
                labelToUse = col?.label;
            }
        });

        props?.message?.cols.forEach((col, i) => {
            if (col?.label.toLowerCase() === "id") {
                props.message.rows.forEach((row, j) => {
                    tempEdges[j].target = row.c[i].v.toString();
                    tempNodes[j].id = row.c[i].v.toString();
                });
            } else {
                props.message.rows.forEach((row, j) => {
                    tempEdges[j].target = (j + 1).toString();
                    tempNodes[j].id = (j + 1).toString();
                });
            }
            if (col?.label?.toLowerCase() === labelToUse?.toLowerCase()) {
                props.message.rows.forEach((row, j) => {
                    tempNodes[j].label = row.c[i].v.toString();
                    tempEdges[j].name = row.c[i].v + "-has";
                });
            } else {
                // tempNodes[0].label = "No data found";
                // tempEdges[0].name = "No data found";
            }
        });

        console.log("====", labelToUse);

        if (labelToUse === undefined) {
            tempNodes = [
                {
                    id: "0",
                    label: "No Data Found",
                    size: 40,
                    color: "Red",
                },
            ];
            tempEdges = [];
        } else {
            tempNodes.push({
                id: "0",
                label: "Device",
                size: 20,
                color: "Blue",
            });
        }

        const container = document.getElementById(container_id);

        const graph = new Graph();
        tempNodes.forEach((node) => {
            graph.addNode(node.id, {
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: node.size,
                color: node.color,
                label: node.label,
            });
        });

        tempEdges.forEach((edge, index) => {
            graph.addEdge(edge.source, edge.target, {
                type: "arrow",
                label: edge.name,
                size: 2,
                color: edge.color,
            });
        });

        const layout = new ForceSupervisor(graph, {
            isNodeFixed: (_, attr) => attr.highlighted,
        });
        layout.start();

        let renderer = new Sigma(graph, container, {
            renderEdgeLabels: true,
            enableEdgeEvents: true,
        });

        let draggedNode = null;
        let isDragging = false;

        renderer.on("downNode", (e) => {
            isDragging = true;
            draggedNode = e.node;
            graph.setNodeAttribute(draggedNode, "highlighted", true);
        });

        renderer.getMouseCaptor().on("mousemovebody", (e) => {
            if (!isDragging || !draggedNode) return;

            const pos = renderer.viewportToGraph(e);

            graph.setNodeAttribute(draggedNode, "x", pos.x);
            graph.setNodeAttribute(draggedNode, "y", pos.y);

            e.preventSigmaDefault();
            e.original.preventDefault();
            e.original.stopPropagation();
        });

        renderer.getMouseCaptor().on("mouseup", () => {
            if (draggedNode) {
                graph.removeNodeAttribute(draggedNode, "highlighted");
            }

            isDragging = false;
            draggedNode = null;
        });

        renderer.getMouseCaptor().on("mousedown", () => {
            if (!renderer.getCustomBBox())
                renderer.setCustomBBox(renderer.getBBox());
        });

        // graph.addNode(id, node);
        // graph.getNodeAttributes(nodeId)
        let hoveredEdge = null;

        const nodeEvents = [
            // "enterNode",
            // "leaveNode",
            // "downNode",
            "clickNode",
            "rightClickNode",
            "doubleClickNode",
            // "wheelNode",
        ];
        const edgeEvents = [
            // "downEdge",
            "clickEdge",
            "rightClickEdge",
            "doubleClickEdge",
            // "wheelEdge",
        ];

        //         res.color = "#cc0000"

        nodeEvents.forEach((eventType) =>
            renderer.on(eventType, ({ node }) =>
                console.log(eventType, "node", node)
            )
        );

        edgeEvents.forEach((eventType) =>
            renderer.on(eventType, ({ edge }) =>
                console.log(eventType, "edge", edge)
            )
        );

        renderer.on("enterEdge", ({ edge }) => {
            console.log("enterEdge", "edge", edge.split("_")[2]);
            hoveredEdge = edge;
            console.log(graph.getEdgeAttribute(edge, "color"));

            graph.setEdgeAttribute(edge, "color", "Black");
            renderer.refresh();
        });
        renderer.on("leaveEdge", ({ edge }) => {
            console.log("leaveEdge", "edge", edge);
            hoveredEdge = null;
            graph.setEdgeAttribute(edge, "color", "Grey");

            renderer.refresh();
        });

        return () => {
            renderer.kill();
            layout.kill();
        };
    }, []);

    return (
        <div
            id={container_id}
            style={{ width: "-webkit-fill-available", height: "100%", backgroundColor: "white" }}
        ></div>
    );
};

export default SigmaGraph;
