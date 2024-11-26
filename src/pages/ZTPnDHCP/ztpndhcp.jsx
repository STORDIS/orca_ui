import React, { useRef, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import "./ztpndhcp.scss";
import { FaRegCircleXmark } from "react-icons/fa6";
import { FaCircle } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import {
  ztpURL,
  dhcpConfigURL,
  dhcpBackupURL,
} from "../../utils/backend_rest_urls";
import interceptor from "../../utils/interceptor";
import CredentialForm from "./CredentialsForm";

import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

import Modal from "../../components/modal/Modal";

export const ZTPnDHCP = () => {
  const parentDivRef = useRef(null);

  const [deviceIp, setDeviceIp] = useState("");

  const instance = interceptor();

  const [layout, setLayout] = useState({
    height: "60vh",
    width: "100%",
  });

  // const [files, setFiles] = useState([]);
  const [ztpFiles, setztpFiles] = useState([]);
  const [dhcpFiles, setdhcpFiles] = useState([]);
  const [backupFiles, setbackupFiles] = useState([]);

  const [file, setFile] = useState({});
  const [tab, setTab] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState("null");

  const [newFileName, setNewFileName] = useState("");

  // Keep track of unsaved changes
  const hasUnsavedChanges = tab.some((item) => item.status === "unsaved");

  const getFileLanguage = (filename) => {
    const extension = filename.split(".")[1];
    // return 'json';
    return extension;
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleBeforeUnload = (event) => {
      if (hasUnsavedChanges) {
        const confirmationMessage =
          "You have unsaved changes. Are you sure you want to leave?";
        event.returnValue = confirmationMessage; // Gecko + WebKit
        return confirmationMessage; // Webkit, Safari, Chrome
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("resize", handleResize);
    };
  }, [tab]);

  useEffect(() => {
    getZtpFileList();
  }, []);

  useEffect(() => {
    if (deviceIp) {
      getDhcpFiles(deviceIp, false);
      getDhcpBackupFiles(deviceIp);
    }
  }, [deviceIp]);

  // ztp apis
  const getZtpFileList = () => {
    instance
      .get(ztpURL())
      .then((res) => {
        if (res?.data?.length > 0) {
          let list = res.data.map((item) => {
            return {
              filename: item.filename,
              language: getFileLanguage(item.filename),
              content: item.content,
              status: "saved",
            };
          });

          setztpFiles(list);
          setFile(list[0]);

          setTab([
            {
              filename: res.data[0].filename,
              language: res.data[0].language,
              status: "saved",
            },
          ]);
        } else {
          setztpFiles([]);
          setFile({
            filename: "default",
            language: "json",
            content: "Select a file",
          });
          setTab([]);
        }
      })
      .catch((err) => {});
  };

  const getZtpFile = (filename) => {
    instance
      .get(ztpURL(filename))
      .then((res) => {
        let data = res.data;

        setztpFiles((prevFiles) =>
          prevFiles.map((file) => {
            if (file.filename === filename) {
              return { ...file, content: data.content };
            }
            return file;
          })
        );
      })
      .catch((err) => {});
  };

  const putZtpFile = (payload, getfile) => {
    instance
      .put(ztpURL(), payload)
      .then((res) => {})
      .catch((err) => {})
      .finally(() => {
        if (getfile) {
          getZtpFile(payload.filename);
        }
      });
  };

  const deleteZtpFile = (payload) => {
    instance
      .delete(ztpURL(), { data: payload })
      .then((res) => {})
      .catch((err) => {})
      .finally(() => {});
  };

  const createNewFile = (newFileName) => {
    if (ztpFiles.some((file) => file.filename === newFileName + ".json")) {
      alert("File already exists");
    } else {
      setIsModalOpen("null");
      setztpFiles((prevFiles) => [
        ...prevFiles,
        {
          filename: newFileName + ".json",
          language: "json",
          content: "// new file created. write config here",
          status: "unsaved",
        },
      ]);
      setFile({
        filename: newFileName + ".json",
        language: "json",
        content: "// new file created. write config here",
        status: "unsaved",
      });

      addTab(
        {
          filename: newFileName + ".json",
          language: "json",
          content: "// new file created. write config here",
          status: "unsaved",
        },
        "single"
      );
    }
  };

  // dhcp apis

  const getDhcpBackupFiles = (device_ip) => {
    instance
      .get(dhcpBackupURL(device_ip))
      .then((res) => {
        let data = res.data;

        setbackupFiles(
          data.map((item) => {
            return {
              filename: item.filename,
              language: getFileLanguage(item.filename),
              content: item.content,
              status: "readonly",
            };
          })
        );
      })
      .catch((err) => {});
  };

  const getDhcpFiles = (device_ip, getfile) => {
    instance
      .get(dhcpConfigURL(device_ip))
      .then((res) => {
        setdhcpFiles([
          {
            filename: res.data.filename,
            language: getFileLanguage(res.data.filename),
            content: res.data.content,
            status: "saved",
          },
        ]);
      })
      .catch((err) => {});
  };

  const putDhcpFiles = (payload, getfile) => {
    instance
      .put(dhcpConfigURL(deviceIp), payload)
      .then((res) => {})
      .catch((err) => {})
      .finally(() => {
        if (getfile) {
          getDhcpFiles(deviceIp, getfile);
          getDhcpBackupFiles(deviceIp);
        }
      });
  };

  // other functions

  const handleResize = () => {
    if (parentDivRef.current) {
      setLayout({
        height: parentDivRef.current.offsetHeight,
        width: parentDivRef.current.offsetWidth,
      });
    }
  };

  const addTab = (list, clickType) => {
    if (clickType === "single") {
      const exists = tab.some((item) => item.filename === list.filename);

      if (!exists) {
        setTab([
          ...tab,
          {
            filename: list.filename,
            language: list.language,
            status: list.status,
          },
        ]);
      }
    } else {
      setTab([
        {
          filename: list.filename,
          language: list.language,
          status: list.status,
        },
      ]);
    }

    setFile(list);
  };

  const removeTab = (list) => {
    if (list.status !== "unsaved") {
      const updatedTab = tab.filter((item) => item.filename !== list.filename);
      if (updatedTab.length === 0) {
        setTab([]);
        setFile({
          filename: "default",
          language: "json",
          content: "Select a file",
        });
      } else {
        setTab(updatedTab);
        setFile(updatedTab[0]);
      }
    } else {
      alert("Unsaved changes, cannot remove. Please save.");
    }
  };

  const editorChange = (e, file) => {
    const updatedTab = tab.map((item) => {
      if (
        item.filename === file.filename &&
        !file.filename.includes("dhcpd.conf.orca")
      ) {
        return {
          ...item,
          status: file?.status !== "readonly" ? "unsaved" : "readonly",
        };
      }
      return item;
    });
    setTab(updatedTab);

    const updatedFileList = ztpFiles.map((item) => {
      if (item.filename === file.filename) {
        return {
          ...item,
          content: e,
          status: "unsaved",
        };
      }
      return item;
    });
    setztpFiles(updatedFileList);
    setFile({
      filename: file.filename,
      language: file.language,
      content: e,
    });
  };

  const save = (list) => {
    const updatedTab = tab.map((item) => {
      if (item.filename === list.filename) {
        return {
          ...item,
          status: "saved",
        };
      }
      return item;
    });
    setTab(updatedTab);

    if (list.filename === "dhcpd.conf") {
      const updatedFiles = dhcpFiles.map((item) => {
        if (item.filename === list.filename) {
          return {
            ...item,
            status: "saved",
          };
        }
        return item;
      });
      setdhcpFiles(updatedFiles);
      putDhcpFiles(
        {
          device_ip: deviceIp,
          content: list.content,
        },
        true
      );
    } else {
      const updatedFiles = ztpFiles.map((item) => {
        if (item.filename === list.filename) {
          return {
            ...item,
            status: "saved",
          };
        }
        return item;
      });
      setztpFiles(updatedFiles);

      putZtpFile(
        {
          filename: list.filename,
          content: list.content,
        },
        true
      );
    }
  };

  const removeFile = (list) => {
    const payload = {
      filename: list.filename,
    };
    deleteZtpFile(payload);

    const updatedFiles = ztpFiles.filter(
      (item) => item.filename !== list.filename
    );
    setztpFiles(updatedFiles);

    const updatedTab = tab.filter((item) => item.filename !== list.filename);
    if (updatedTab.length === 0) {
      setTab([]);
      setFile({
        filename: "default",
        language: "json",
        content: "Select a file",
      });
    } else {
      setTab(updatedTab);
      setFile(updatedTab[0]);
    }
  };

  const [popover, setPopover] = useState({
    visible: false,
    x: 0,
    y: 0,
    file: "",
  });

  const handleRightClick = (event, list) => {
    event.preventDefault();
    setPopover({
      visible: true,
      x: event.pageX,
      y: event.pageY,
      file: list,
    });
  };

  const getDeviceIp = (e) => {
    setDeviceIp(e);
  };

  const CustomToolTip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      fontSize: 15,
    },
  }));

  return (
    <div
      className=""
      onClick={() => setPopover({ ...popover, visible: false })}
    >
      <CredentialForm sendCredentialsToParent={getDeviceIp} />

      <div className="listContainer">
        <div className="editorContainer">
          <div className="fileSelection">
            <div className="fileHeader">File list</div>
            <div
              style={{
                height: layout.height,
                overflowY: "auto",
              }}
            >
              {ztpFiles.map((list, index) => (
                <CustomToolTip
                  arrow
                  title={"file is " + list?.status}
                  placement="right"
                  key={index}
                >
                  <div
                    className={`fileItem ${
                      file?.filename === list?.filename ? "active" : ""
                    }`}
                    onClick={() => addTab(list, "single")}
                    onDoubleClick={() => addTab(list, "double")}
                    onContextMenu={(e) => handleRightClick(e, list)}
                  >
                    <p className="text-overflow">{list?.filename}</p>
                  </div>
                </CustomToolTip>
              ))}
              {dhcpFiles.map((list, index) => (
                <CustomToolTip
                  arrow
                  title={"file is " + list?.status}
                  placement="right"
                  key={index}
                >
                  <div
                    className={`fileItem ${
                      file?.filename === list?.filename ? "active" : ""
                    }`}
                    key={index}
                    onClick={() => addTab(list, "single")}
                    onDoubleClick={() => addTab(list, "double")}
                    onContextMenu={(e) => handleRightClick(e, list)}
                  >
                    <p className="text-overflow">{list?.filename}</p>
                  </div>
                </CustomToolTip>
              ))}
              {backupFiles.map((list, index) => (
                <CustomToolTip
                  arrow
                  title={"file is " + list?.status}
                  placement="right"
                  key={index}
                >
                  <div
                    className={`fileItem ${
                      file?.filename === list?.filename ? "active" : ""
                    }`}
                    key={index}
                    onClick={() => addTab(list, "single")}
                    onDoubleClick={() => addTab(list, "double")}
                    onContextMenu={(e) => handleRightClick(e, list)}
                  >
                    <p className="text-overflow">{list?.filename}</p>
                  </div>
                </CustomToolTip>
              ))}
            </div>

            <div className="fileBottomSection">
              <button
                onClick={() => {
                  setIsModalOpen("addNewFileModal");
                }}
                className="ml-5"
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FaPlus className="mr-5" />
                ADD FILE
              </button>
            </div>
          </div>

          <div className="editor">
            <div className="tab" id="tabContainer">
              {tab.map((list, index) => (
                <div
                  className={`tabButton ${
                    file.filename === list.filename ? "tabActive" : ""
                  }`}
                  key={index}
                >
                  <div className="tabName">
                    <FaRegCircleXmark
                      className="cancel mr-5"
                      onClick={() => removeTab(list)}
                    />
                    <div
                      className="mr-5 text-overflow"
                      style={{ maxWidth: "125px" }}
                      onClick={() => setFile(list)}
                    >
                      {list.filename}
                    </div>
                  </div>
                  {list?.status === "unsaved" ? (
                    <div onClick={() => setFile(list)}>
                      <FaCircle style={{ color: "#c0c0c0" }} />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            {file?.filename?.match(/dhcpd\.conf\.orca\..+/) ? (
              <div
                className="resizable"
                id="editorContainer"
                ref={parentDivRef}
                onMouseMove={handleResize}
              >
                <textarea
                  name=""
                  id=""
                  value={file.content}
                  style={{
                    height: "100%",
                    width: "100%",
                    resize: "vertical",
                    minHeight: "60vh",
                  }}
                  readOnly
                ></textarea>
              </div>
            ) : (
              <div
                className="resizable"
                id="editorContainer"
                ref={parentDivRef}
                onMouseMove={handleResize}
              >
                <Editor
                  height={layout.height}
                  width={layout.width}
                  path={file.filename}
                  language={file.language}
                  value={file.content}
                  defaultLanguage={"json"}
                  defaultValue={"Select a file"}
                  theme="light" // light / vs-dark
                  onChange={(e) => editorChange(e, file)}
                />
              </div>
            )}

            <div className="editorBottomSection">
              <button
                className=""
                onClick={() => save(file)}
                disabled={
                  file?.filename?.match(/dhcpd\.conf\.orca\..+/) ? true : false
                }
              >
                Save
              </button>
            </div>
          </div>

          {/* Popover box */}
          {popover.visible && (
            <div
              className="popover"
              style={{
                position: "absolute",
                top: popover.y,
                left: popover.x,
                backgroundColor: "white",
                border: "1px solid black",
                zIndex: 1000,
                width: "125px",
              }}
            >
              <ul>
                {/* {popover.file.filename !== "dhcpd.conf" &&
                !popover?.file?.filename?.match(/dhcpd\.conf\.orca\..+/) ? (
                  <li onClick={() => setIsModalOpen("renameModal")}>
                    Rename file
                  </li>
                ) : null} */}
                {popover.file.filename !== "dhcpd.conf" &&
                !popover?.file?.filename?.match(/dhcpd\.conf\.orca\..+/) ? (
                  <li onClick={() => removeFile(popover.file)}>Remove file</li>
                ) : null}

                {!popover?.file?.filename?.match(/dhcpd\.conf\.orca\..+/) ? (
                  <li onClick={() => save(popover.file)}>Save file</li>
                ) : null}
                {popover?.file?.filename?.match(/dhcpd\.conf\.orca\..+/) ? (
                  <li> Read Only </li>
                ) : null}
              </ul>
            </div>
          )}

          {isModalOpen === "addNewFileModal" && (
            <Modal
              show={true}
              onClose={() => setIsModalOpen("null")}
              title="Add New File"
              // onSubmit={(e) => renameFile(e)}
              id="addNewFileModal"
            >
              <div className="form-wrapper" style={{ alignItems: "center" }}>
                <div className="form-field w-auto ">
                  <label htmlFor="">File Name :</label>
                </div>
                <div className="form-field  w-60">
                  <input
                    type="text"
                    value={newFileName}
                    placeholder="Enter File Name"
                    onChange={(e) => setNewFileName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <button
                  className="btnStyle"
                  onClick={() => {
                    createNewFile(newFileName);
                  }}
                >
                  Save
                </button>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
};

export default ZTPnDHCP;