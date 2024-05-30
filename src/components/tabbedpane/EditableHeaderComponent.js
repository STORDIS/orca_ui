import React from 'react';
import { FaEdit } from 'react-icons/fa'; 
import secureLocalStorage from "react-secure-storage";

const EditableHeaderComponent = (props) => {
  const { displayName, column } = props;
  return (
    <span>
      {column.colDef.editable &&  secureLocalStorage.getItem("user_details").is_staff &&  <FaEdit style={{ marginRight: '5px' }} />} 
      {displayName} 
    </span>
  );
};

export default EditableHeaderComponent;
