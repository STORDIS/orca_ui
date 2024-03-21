import React, { useState, useEffect } from "react";

const MembersSelection = ({
    interfaceNames,
    onSave,
    onCancel,
    existingMembers,
    onDeleteMember,
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

    const [membersSelectedForRemoval, setMembersSelectedForRemoval] = useState(
        []
    );

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
                    className="mr-10"
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

            <select
                multiple
                size="5"
                style={{ width: "100%" }}
                value={membersSelectedForRemoval}
                onChange={(e) =>
                    setMembersSelectedForRemoval(
                        Array.from(
                            e.target.selectedOptions,
                            (option) => option.value
                        )
                    )
                }
            >
                {selectedMembers.map((member) => (
                    <option key={member} value={member}>
                        {member}
                    </option>
                ))}
            </select>

            <div
                className=""
                style={{
                    marginTop: "10px",
                    justifyContent: "center",
                    gap: "10px",
                }}
            >
                <button
                    type="button"
                    className="btnStyle mr-10"
                    disabled={selectedMembers.length === 0}
                    onClick={() => onSave(selectedMembers)}
                >
                    Apply Config
                </button>

                <button
                    type="button"
                    className="btnStyle mr-10"
                    onClick={onCancel}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="btnStyle"
                    disabled={membersSelectedForRemoval.length === 0}
                    onClick={() => onDeleteMember(membersSelectedForRemoval)}
                >
                    Delete Selected Member
                </button>
            </div>
        </div>
    );
};

export default MembersSelection;
