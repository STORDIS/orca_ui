import React from 'react';
import { FaEdit } from 'react-icons/fa'; 

const EditableHeaderComponent = (props) => {
  const { displayName, column } = props;
  return (
    <span>
      {column.colDef.editable && <FaEdit style={{ marginRight: '5px' }} />} 
      {displayName} 
    </span>
  );
};

export default EditableHeaderComponent;
