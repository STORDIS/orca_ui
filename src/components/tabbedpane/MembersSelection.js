import React, { useState, useEffect } from "react";

const MembersSelection = ({
    interfaceNames,
    onSave,
    onCancel,
    existingMembers,
}) => {
    const [member, setMember] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);

    useEffect(() => {
        if (existingMembers) {
            if (typeof existingMembers !== "string") {
                setSelectedMembers(existingMembers || []);
            } else {
                setSelectedMembers(existingMembers.split(",") || []);
            }
        }

        console.log("existingMembers", selectedMembers);
    }, [existingMembers]);

    const handleDropdownChange = (e) => {
        console.log("--", e.target.value);
        setMember(e.target.value);
    };

    const handleAddMember = () => {
        console.log("member", member);
        if (member && !selectedMembers.includes(member)) {
            setSelectedMembers((prev) => [...prev, member]);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "600px",
                margin: "auto",
            }}
        >
            <div
                className="selection-container"
                style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >
                <select
                    id="memberDropdown"
                    onChange={handleDropdownChange}
                    value={member}
                    style={{ marginRight: "10px", marginBottom: "10px" }}
                >
                    <option value="" disabled selected>
                        Select Member
                    </option>
                    {interfaceNames.map((val, index) => (
                        <option key={index} value={val}>
                            {val}
                        </option>
                    ))}
                </select>
                <button onClick={handleAddMember}>Add Member Interface</button>
            </div>

            {selectedMembers.map((item, index) => (
                <div>
                    {index} &nbsp; {item}
                </div>
            ))}

            <div
                className="button-container"
                style={{
                    marginTop: "10px",
                    justifyContent: "center",
                    gap: "10px",
                }}
            >
                <button
                    className="btnStyle  mr-10"
                    onClick={() => onSave(selectedMembers)}
                >
                    Ok
                </button>

                <button className="btnStyle  " onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default MembersSelection;
