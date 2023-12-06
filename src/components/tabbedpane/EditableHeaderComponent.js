import React from 'react';
import { FaEdit } from 'react-icons/fa'; 

const EditableHeaderComponent = (props) => {
  const { displayName, column } = props;
  return (
    <span>
      {displayName} 
      {column.colDef.editable && <FaEdit style={{ marginLeft: '5px' }} />} 
    </span>
  );
};

export default EditableHeaderComponent;
