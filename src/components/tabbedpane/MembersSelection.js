import React, { useState, useEffect } from 'react';

const MembersSelection = ({ interfaceNames, onSave, onCancel, existingMembers }) => {
  const [member, setMember] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    setSelectedMembers(existingMembers || []);
  }, [existingMembers]);

  const handleDropdownChange = (e) => {
    setMember(e.target.value);
  };

  const handleAddMember = () => {
    if (member && !selectedMembers.includes(member)) {
      setSelectedMembers(prev => [...prev, member]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '600px', margin: 'auto' }}>

      <div className="selection-container" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <select id="memberDropdown" onChange={handleDropdownChange} value={member} style={{ marginRight: '10px', marginBottom: '10px' }}>
          <option value="" disabled>Select Member</option>
          {interfaceNames.map((val, index) => (
            <option key={index} value={val}>{val}</option>
          ))}
        </select>
        <button onClick={handleAddMember}>Add Member Interface</button>
      </div>

      <textarea
        value={selectedMembers.join("\n")} 
        readOnly
        style={{ width: '80%', height: '100px', marginBottom: '20px' }} 
      />

      <div className="button-container" style={{marginTop: '10px', justifyContent: 'center', gap: '10px' }}>
        <button onClick={() => onSave(selectedMembers)}>Ok</button>   &nbsp; 
        &nbsp;
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default MembersSelection;

