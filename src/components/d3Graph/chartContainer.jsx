// ChartContainer.js
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const ChartContainer = (props) => {
    useEffect(() => {
        let tempNodes = [];
        let tempEdges = [];

        props.message.rows.forEach((element) => {
            tempNodes.push({
                id: "",
                label: "",
                color: "Green",
            });
            tempEdges.push({
                source: "0",
                target: "",
                value: 1,
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

        console.log("Label to use:", labelToUse);

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

        tempNodes.push({ id: "0", label: "Device", color: "Red" });
        console.log("-----", tempNodes);
        console.log("-----", tempEdges);

        // The force simulation mutates links and nodes, so create a copy
        // so that re-evaluating this cell produces the same result.
        const links = tempEdges.map((d) => ({ ...d }));
        const nodes = tempNodes.map((d) => ({ ...d }));

        // Get dimensions of the container
        const containerWidth =
            document.getElementById("chart-container").clientWidth;
        const containerHeight =
            document.getElementById("chart-container").clientHeight;

        // Create a simulation with several forces.
        const simulation = d3
            .forceSimulation(nodes)
            .force(
                "link",
                d3
                    .forceLink(links)
                    .id((d) => d.id)
                    .distance(150)
            )
            .force("charge", d3.forceManyBody())
            .force(
                "center",
                d3.forceCenter(containerWidth / 2, containerHeight / 2)
            )
            .on("tick", ticked);

        // Create the SVG container.
        const svg = d3
            .create("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`) // Set viewBox with container's dimensions
            .attr("style", "width: 100%; height: 100%;");

        // Add a line for each link, and a circle for each node.
        const link = svg
            .append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .attr("stroke-width", 2)
            .selectAll()
            .data(links)
            .join("line")
            .attr("stroke-width", (d) => Math.sqrt(d.value));

        // Add labels for each link
        const linkLabels = svg
            .append("g")
            .selectAll("text")
            .data(links)
            .enter()
            .append("text")
            .attr("dy", "-0.2em")
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .text((d) => d.name);

        const node = svg
            .append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll()
            .data(nodes)
            .join("circle")
            .attr("r", 20)
            .attr("fill", (d) => d.color)
            .call(
                d3
                    .drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended)
            );

        // Add labels for each node
        const nodeLabels = svg
            .append("g")
            .selectAll("text")
            .data(nodes)
            .enter()
            .append("text")
            .attr("dy", "3em")
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .text((d) => d.label);

        // Set the position attributes of links, nodes, and linkText each time the simulation ticks.
        function ticked() {
            link.attr("x1", (d) => d.source.x)
                .attr("y1", (d) => d.source.y)
                .attr("x2", (d) => d.target.x)
                .attr("y2", (d) => d.target.y);

            linkLabels
                .attr("x", (d) => (d.source.x + d.target.x) / 2)
                .attr("y", (d) => (d.source.y + d.target.y) / 2);

            node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

            nodeLabels.attr("x", (d) => d.x).attr("y", (d) => d.y);
        }

        // Drag functions
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        // When this cell is re-run, stop the previous simulation. (This doesn’t
        // really matter since the target alpha is zero and the simulation will
        // stop naturally, but it’s a good practice.)
        simulation.stop();

        // Append SVG to the container
        document.getElementById("chart-container").appendChild(svg.node());

        return () => {
            // Cleanup if necessary
            svg.remove();
        };
    }, []);

    return (
        <div
            id="chart-container"
            style={{ width: "100%", height: "100%" }}
        ></div>
    );
};

export default ChartContainer;
