import React, { useState, useEffect } from "react";

export const View = (props) => {
    
    const handleOptionChange = (e) => {
        props.sendDataToParent(e.target.value);
    };

    return (
        <div className="selectView">
            <select
                className="selectView"
                name=""
                id=""
                value={props.viewType}
                onChange={handleOptionChange}
            >
                <option value="Table">Table</option>
                <option value="Bar">Bar</option>
                <option value="Graph">Graph</option>
            </select>
        </div>
    );
};
export default View;
