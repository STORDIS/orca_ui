import React from "react";
import { FaEdit } from "react-icons/fa";
import { getIsStaff } from "../../utils/common";

const EditableHeaderComponent = (props) => {
  const { displayName, column } = props;

  console.log(props.column.colDef.showIcon);

  return (
    <span>
      {props.column.colDef.showIcon && getIsStaff() ? (
        <FaEdit style={{ marginRight: "5px" }} />
      ) : null}
      {displayName}
    </span>
  );
};

export default EditableHeaderComponent;
