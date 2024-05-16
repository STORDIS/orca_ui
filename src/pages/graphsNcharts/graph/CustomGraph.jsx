// import { useEffect, useState } from "react";
// import { GraphCanvas } from "reagraph";

// import "./CustomGraph.scss";
// import { ContentPasteSearchOutlined } from "@mui/icons-material";

// const CustomGraph = (props) => {
//     const [nodes, setNodes] = useState([]);
//     const [edges, setEdges] = useState([]);

//     useEffect(() => {
//         console.log(props.message);
//         setEdges([]);
//         setNodes([]);
//         setNodes(get_chart_data()[0]);
//         setEdges(get_chart_data()[1]);
//     }, [props]);

//     const get_chart_from_json = () => {
//         setNodes([{ id: "0", label: "Device", fill: "Red" }]);
//         props.message.forEach((element, index) => {
//             setNodes((prevNodes) => [
//                 ...prevNodes,
//                 {
//                     id: element.id.toString(),
//                     label: element.name,
//                 },
//             ]);
//             setEdges((prevNodes) => [
//                 ...prevNodes,
//                 {
//                     source: "0",
//                     target: element.id.toString(),
//                     id: element.id + "-0",
//                     label: element.name + "-has",
//                 },
//             ]);
//         });
//     };

//     const get_chart_data = () => {
//         let tempNodes = [];
//         let tempEdges = [];

//         props.message.rows.forEach((element) => {
//             tempNodes.push({
//                 id: "",
//                 label: "",
//             });
//             tempEdges.push({
//                 source: "0",
//                 target: "",
//                 id: "",
//                 label: "",
//             });
//         });

//         let found = false;
//         let labelToUse;

//         props.message.cols.forEach((col, i) => {
//             if (
//                 col.label.toLowerCase().includes("name") &&
//                 col.label.toLowerCase() !== "name"
//             ) {
//                 found = true;
//                 labelToUse = col.label;
//                 return;
//             } else if (col.label.toLowerCase() === "name" && !found) {
//                 labelToUse = col.label;
//                 return;
//             } else if (
//                 col.label.toLowerCase().includes("id") &&
//                 col.label.toLowerCase() !== "id" &&
//                 !found
//             ) {
//                 labelToUse = col.label;
//             }
//         });

//         console.log("Label to use:", labelToUse);

//         props.message.cols.forEach((col, i) => {
//             if (col.label.toLowerCase() === "id") {
//                 props.message.rows.forEach((row, j) => {
//                     // console.log(row.c[i].v)
//                     tempEdges[j].target = row.c[i].v.toString();
//                     tempEdges[j].id = row.c[i].v + "-0";
//                     tempNodes[j].id = row.c[i].v.toString();
//                 });
//             } else {
//                 props.message.rows.forEach((row, j) => {
//                     // console.log(row.c[i].v)
//                     tempEdges[j].target = (j + 1).toString();
//                     tempEdges[j].id = j + 1 + "-0";
//                     tempNodes[j].id = (j + 1).toString();
//                 });
//             }
//             if (col.label.toLowerCase() === labelToUse.toLowerCase()) {
//                 props.message.rows.forEach((row, j) => {
//                     // console.log(row.c[i].v)
//                     tempNodes[j].label = row.c[i].v.toString();
//                     tempEdges[j].label = row.c[i].v + "-has";
//                 });
//             }
//         });

//         tempNodes.push({ id: "0", label: "Device", fill: "Red" });
//         console.log("-----", tempNodes);
//         console.log("-----", tempEdges);
//         return [tempNodes, tempEdges];
//     };


//     return (
//         <div className="graph">
//             Graph here
//             <GraphCanvas
//                 draggable
//                 nodes={nodes}
//                 edges={edges}
//                 sizingType="centrality"
//                 maxNodeSize={25}
//                 minNodeSize={10}
//                 // minDistance={5}
//                 labelType="all"
//                 pathSelectionType="all"
//             />
//         </div>
//     );
// };

// export default CustomGraph;
