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
  templatedURL,
} from "../../utils/backend_rest_urls";
import interceptor from "../../utils/interceptor";
import CredentialForm from "./CredentialsForm";

import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

import Modal from "../../components/modal/Modal";

export const ZTPnDHCP = () => {
  const parentDivRef = useRef(null);
  const instance = interceptor();
  const [layout, setLayout] = useState({
    height: "60vh",
    width: "100%",
  });
  const [deviceIp, setDeviceIp] = useState("");

  const [ztpFiles, setztpFiles] = useState([]);
  const [dhcpFiles, setdhcpFiles] = useState([]);
  const [backupFiles, setbackupFiles] = useState([]);
  const [templateFiles, setTemplateFiles] = useState([]);

  const [file, setFile] = useState({});
  const [tab, setTab] = useState([]);

  const [currentContent, setCurrentContent] = useState("");

  const [isModalOpen, setIsModalOpen] = useState("null");
  const [newFileName, setNewFileName] = useState("");

  const hasUnsavedChanges = tab.some((item) => item.status === "unsaved");

  const getFileLanguage = (filename) => {
    const extension = filename.split(".")[1];
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
    getTemplates();
  }, []);

  useEffect(() => {
    if (deviceIp) {
      getDhcpFiles(deviceIp);
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
              path: item.path,
            };
          });

          setztpFiles(list);

          setFile(list[0]);

          setTab([
            {
              filename: list[0].filename,
              language: getFileLanguage(list[0].filename),
              status: "saved",
            },
          ]);
        } else {
          setztpFiles([]);
          selectTab("default");
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

  // templates

  const getTemplates = () => {
    instance
      .get(templatedURL())
      .then((res) => {
        let data = res.data;
        console.log(data);

        setTemplateFiles(
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

  const getDhcpFiles = (device_ip) => {
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

  const putDhcpFiles = (payload) => {
    instance
      .put(dhcpConfigURL(deviceIp), payload)
      .then((res) => {})
      .catch((err) => {})
      .finally(() => {
        getDhcpFiles(deviceIp);
        getDhcpBackupFiles(deviceIp);
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

    selectTab(list.filename);
  };

  const selectTab = (filename) => {
    let allFiles = [
      ...dhcpFiles,
      ...ztpFiles,
      ...backupFiles,
      ...templateFiles,
    ];

    const foundFile = allFiles.find((element) => element.filename === filename);

    if (foundFile) {
      setFile(foundFile);
    } else {
      setFile({
        filename: "default",
        language: "json",
        content: "Select a file",
      });
    }
  };

  const removeTab = (list) => {
    const shouldRemove =
      list.status !== "unsaved" ||
      window.confirm("Unsaved changes. Do you want to Discard it?");
    if (shouldRemove) {
      let updatedTab = tab.filter((item) => item.filename !== list.filename);

      if (updatedTab.length === 0) {
        setTab([]);
        selectTab("default");
      } else {
        setTab(updatedTab);
        selectTab(updatedTab[0].filename);
        getDhcpFiles(deviceIp);
        getZtpFile(list.filename);
      }
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
          status: "unsaved",
        };
      }
      return item;
    });
    setTab(updatedTab);

    if (file.filename === "dhcpd.conf") {
      const updatedFiles = dhcpFiles.map((item) => {
        if (item.filename === file.filename) {
          return {
            ...item,
            content: e,
            status: "unsaved",
          };
        }
        return item;
      });
      setdhcpFiles(updatedFiles);
      setFile(updatedFiles[0]);
    } else {
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
      setFile(updatedFileList[0]);
    }

    // selectTab(file.filename);
  };

  const copyPath = (file) => {
    const filePath = process.env.REACT_APP_HOST_ADDR_BACKEND + "/" + file.path;

    console.log(filePath);

    navigator.clipboard
      .writeText(filePath)
      .then(() => {
        // alert("Path copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
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
      putDhcpFiles({
        device_ip: deviceIp,
        content: list.content,
      });
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
      selectTab("default");
    } else {
      setTab(updatedTab);
      selectTab(updatedTab[0].filename);
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
                  title={"file is Readonly"}
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
              {templateFiles.map((list, index) => (
                <CustomToolTip
                  arrow
                  title={"file is Readonly"}
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
                      style={{
                        fontSize: "20px",
                      }}
                      className="cancel mr-5"
                      onClick={() => removeTab(list)}
                    />
                    <div
                      className=" text-overflow"
                      style={{ width: "105px" }}
                      onClick={() => selectTab(list.filename)}
                    >
                      {list.filename}
                    </div>
                  </div>
                  <div onClick={() => selectTab(list.filename)}>
                    {list?.status === "unsaved" ? (
                      <FaCircle
                        style={{ color: "#c0c0c0", fontSize: "20px" }}
                      />
                    ) : (
                      <FaCircle
                        style={{ color: "transparent", fontSize: "20px" }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {file?.filename?.match(/dhcpd\.conf\.orca\..+/) ||
            file?.filename?.includes("_template") ? (
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
                    width: "98%",
                    resize: "vertical",
                    minHeight: "60vh",
                    border: "none",
                    padding: "10px",
                    overflowY: "scroll",
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
              {!file?.filename?.match(/dhcpd\.conf\.orca\..+/) &&
              !file?.filename?.includes("_template") ? (
                <button
                  className=""
                  onClick={() => save(file)}
                  disabled={file.status === "saved"}
                >
                  Save
                </button>
              ) : null}
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
                {!popover?.file?.filename?.match(/dhcpd\.conf\.orca\..+/) &&
                !popover?.file?.filename?.includes("_template") ? (
                  <li onClick={() => save(popover.file)}>Save file</li>
                ) : null}

                {popover.file.filename !== "dhcpd.conf" &&
                !popover?.file?.filename?.match(/dhcpd\.conf\.orca\..+/) &&
                !popover?.file?.filename?.includes("_template") ? (
                  <li onClick={() => copyPath(popover.file)}>Copy path</li>
                ) : null}

                {popover.file.filename !== "dhcpd.conf" &&
                !popover?.file?.filename?.match(/dhcpd\.conf\.orca\..+/) &&
                !popover?.file?.filename?.includes("_template") ? (
                  <li onClick={() => removeFile(popover.file)}>Remove file</li>
                ) : null}

                {popover?.file?.filename?.match(/dhcpd\.conf\.orca\..+/) ||
                popover?.file?.filename?.includes("_template") ? (
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
