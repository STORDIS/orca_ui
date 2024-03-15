import React, { useState } from "react";

const MemberSelectionComponent = ({ interfaceNames, onMemberChange, assignedInterfaces }) => {
  const [member, setMember] = useState("");
  const [showCheckbox, setCheckboxVisible] = useState(false);
  const [isCheckboxChecked, setCheckboxChecked] = useState(false);
  const [memberFinalObj, setMemberFinalObj] = useState({});

  const handleDropdownChange = (e) => {
    const selectedMember = e.target.value;
    if (selectedMember !== "") {
      setMember(selectedMember);
      setCheckboxVisible(true);
      const currentStatus = memberFinalObj[selectedMember];
      setCheckboxChecked(currentStatus === "tagged");
    } else {
      setMember("");
      setCheckboxVisible(false);
    }
  };

  const handleCheckbox = (e) => {
    setCheckboxChecked(e.target.checked);
  };

  const handleBtnClicked = () => {
    const newStatus = isCheckboxChecked ? "tagged" : "untagged";
    const updatedMemberFinalObj = {
      ...memberFinalObj,
      [member]: newStatus,
    };
    setMemberFinalObj(updatedMemberFinalObj);

    onMemberChange(updatedMemberFinalObj);
  };

  return (
    <div>
      <select id="memberDropdown" onChange={handleDropdownChange} value={member}>
        <option value="">Select one...</option>
        {interfaceNames.map((name, i) => (
          <option key={i} value={name} disabled={assignedInterfaces.includes(name)}>
            {name}
          </option>
        ))}
      </select>
      {showCheckbox && (
        <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
          <label>
            <input type="checkbox" checked={isCheckboxChecked} onChange={handleCheckbox} />
            Tagged
          </label>
          <button onClick={handleBtnClicked} style={{ marginLeft: "10px" }}>Update</button>
        </div>
      )}
    </div>
  );
};

export default MemberSelectionComponent;
