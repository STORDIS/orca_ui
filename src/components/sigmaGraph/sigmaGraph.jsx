import chroma from "chroma-js";
import Graph from "graphology";
import ForceSupervisor from "graphology-layout-force/worker";
import Sigma from "sigma";
import { v4 as uuid } from "uuid";
import React, { useRef, useEffect, useState } from "react";

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
            });
        });

        let found = false;
        let labelToUse;

        props.message.cols.forEach((col, i) => {
            if (
                col.label.toLowerCase().includes("name") &&
                col.label.toLowerCase() !== "name"
            ) {
                found = true;
                labelToUse = col.label;
                return;
            } else if (col.label.toLowerCase() === "name" && !found) {
                labelToUse = col.label;
                return;
            } else if (
                col.label.toLowerCase().includes("id") &&
                col.label.toLowerCase() !== "id" &&
                !found
            ) {
                labelToUse = col.label;
            }
        });

        props.message.cols.forEach((col, i) => {
            if (col.label.toLowerCase() === "id") {
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
            if (col.label.toLowerCase() === labelToUse.toLowerCase()) {
                props.message.rows.forEach((row, j) => {
                    tempNodes[j].label = row.c[i].v.toString();
                    tempEdges[j].name = row.c[i].v + "-has";
                });
            }
        });

        tempNodes.push({ id: "0", label: "Device", size: 20, color: "Red" });

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
                size: 10,
            });
        });

        const layout = new ForceSupervisor(graph, {
            isNodeFixed: (_, attr) => attr.highlighted,
        });
        layout.start();

        const renderer = new Sigma(graph, container, {
            renderEdgeLabels: true,
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

        renderer.on("clickStage", (event) => {
            const coordForGraph = renderer.viewportToGraph({
                x: event.x,
                y: event.y,
            });

            const node = {
                ...coordForGraph,
                size: 10,
                color: chroma.random().hex(),
            };

            const closestNodes = graph
                .nodes()
                .map((nodeId) => {
                    const attrs = graph.getNodeAttributes(nodeId);
                    const distance =
                        Math.pow(node.x - attrs.x, 2) +
                        Math.pow(node.y - attrs.y, 2);
                    return { nodeId, distance };
                })
                .sort((a, b) => a.distance - b.distance)
                .slice(0, 2);

            const id = uuid();
            
            graph.addNode(id, node);
            closestNodes.forEach((e) => graph.addEdge(id, e.nodeId));
        });

        

        return () => {
            renderer.kill();
            layout.kill();
        };
    }, []);

    return (
        <div
            id={container_id}
            style={{ width: "-webkit-fill-available", height: "100%" }}
        ></div>
    );
};

export default SigmaGraph;
