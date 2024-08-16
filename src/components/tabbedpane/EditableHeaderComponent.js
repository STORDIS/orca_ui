import React from "react";
import { FaEdit } from "react-icons/fa";
import { getIsStaff } from "../../utils/common";

const EditableHeaderComponent = (props) => {
    const { displayName, column } = props;
    return (
        <span>
            {column.colDef.editable &&
                getIsStaff() && (
                    <FaEdit style={{ marginRight: "5px" }} />
                )}
            {displayName}
        </span>
    );
};

export default EditableHeaderComponent;
