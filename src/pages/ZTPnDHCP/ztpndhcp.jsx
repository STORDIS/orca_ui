import React, { useRef, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import "./ztpndhcp.scss";
import { FaRegCircleXmark } from "react-icons/fa6";
import { FaCircle } from "react-icons/fa";
import { FaFolderPlus } from "react-icons/fa";
import {
  ztpURL,
  dhcpConfigURL,
  dhcpBackupURL,
} from "../../utils/backend_rest_urls";
import interceptor from "../../utils/interceptor";
import CredentialForm from "./CredentialsForm";
import { Tooltip } from "@mui/material";

export const ZTPnDHCP = () => {
  const parentDivRef = useRef(null);
  const fileInputZTPRef = useRef(null);
  const fileInputDHCPRef = useRef(null);

  const [deviceIp, setDeviceIp] = useState("");

  const instance = interceptor();

  const [layout, setLayout] = useState({
    height: "60vh",
    width: "100%",
  });

  const [files, setFiles] = useState([]);

  const [file, setFile] = useState({});
  const [tab, setTab] = useState([]);

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
    getStpFileList();
  }, []);

  useEffect(() => {
    if (deviceIp) {
      getDhcpFiles(deviceIp, false);
      getDhcpBackupFiles(deviceIp);
    }
  }, [deviceIp]);

  // ztp apis
  const getStpFileList = () => {
    instance
      .get(ztpURL())
      .then((res) => {
        let list = res.data.map((item) => {
          return {
            filename: item.filename,
            language: getFileLanguage(item.filename),
            content: item.content,
            status: "saved",
          };
        });

        setFiles(list);
        // setFile(list[0]);

        let tabList = res.data[0].map((item) => {
          return {
            filename: item.filename,
            language: getFileLanguage(item.filename),
            status: "saved",
          };
        });

        setTab([]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getZtpFile = (filename) => {
    instance
      .get(ztpURL(filename))
      .then((res) => {
        let data = res.data;

        setFiles((prevFiles) =>
          prevFiles.map((file) => {
            if (file.filename === filename) {
              return { ...file, content: data.content };
            }
            return file;
          })
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const putZtpFile = (payload, getfile) => {
    instance
      .put(ztpURL(), payload)
      .then((res) => {})
      .catch((err) => {
        console.error(err);
      })
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
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {});
  };

  const handleFileChangeZTP = (event) => {
    const uploadedFile = event.target.files[0];

    if (uploadedFile) {
      const reader = new FileReader();
      let fileText = "";
      reader.onload = (e) => {
        fileText = e.target.result;

        setFiles([
          ...files,
          {
            filename: uploadedFile.name,
            language: uploadedFile.type.split("/")[1],
            content: fileText,
            status: "unsaved",
          },
        ]);

        setFile({
          filename: uploadedFile.name,
          language: uploadedFile.type.split("/")[1],
          content: fileText,
          status: "unsaved",
        });
        setTab([
          ...tab,
          {
            filename: uploadedFile.name,
            language: uploadedFile.type.split("/")[1],
            status: "unsaved",
          },
        ]);
      };
      reader.readAsText(uploadedFile);
    }
  };

  // dhcp apis

  const getDhcpBackupFiles = (device_ip) => {
    instance
      .get(dhcpBackupURL(device_ip))
      .then((res) => {
        let data = res.data;

        setFiles((prevFiles) => [
          ...prevFiles,
          ...data.map((item) => {
            return {
              filename: item.filename,
              language: getFileLanguage(item.filename),
              content: item.content,
              status: "readonly",
            };
          }),
        ]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDhcpFiles = (device_ip, getfile) => {
    instance
      .get(dhcpConfigURL(device_ip))
      .then((res) => {
        let data = res.data;

        if (getfile) {
          setFiles((prevFiles) =>
            prevFiles.map((file) => {
              if (file.filename === "dhcpd.conf") {
                return { ...file, content: data.content };
              }
              return file;
            })
          );
        } else {
          setFiles((prevFiles) => [
            ...prevFiles,
            {
              filename: res.data.filename,
              language: getFileLanguage(res.data.filename),
              content: res.data.content,
              status: "saved",
            },
          ]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const putDhcpFiles = (payload, getfile) => {
    instance
      .put(dhcpConfigURL(deviceIp), payload)
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        if (getfile) {
          getDhcpFiles(deviceIp, getfile);
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
    console.log(list);

    setFile(list);
  };
  console.log(tab);

  const removeTab = (list) => {
    if (list.status !== "unsaved") {
      const updatedTab = tab.filter((item) => item.filename !== list.filename);
      if (updatedTab.length === 0) {
        setTab([]);
        setFile({
          filename: "default",
          language: "txt",
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
    console.log(file);
    if (Object.keys(file).length !== 0 && file?.status !== "readonly") {
      console.log("===");
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
      const updatedFileList = files.map((item) => {
        if (item.filename === file.filename) {
          return {
            ...item,
            content: e,
            status: "unsaved",
          };
        }
        return item;
      });
      setFiles(updatedFileList);
      setFile({
        filename: file.filename,
        language: file.language,
        content: e,
      });
    } else {
    }
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
    const updatedFiles = files.map((item) => {
      if (item.filename === list.filename) {
        return {
          ...item,
          status: "saved",
        };
      }
      return item;
    });
    setTab(updatedTab);
    setFiles(updatedFiles);

    if (list.filename === "dhcpd.conf") {
      putDhcpFiles(
        {
          device_ip: deviceIp,
          content: list.content,
        },
        true
      );
    } else {
      putZtpFile(
        {
          filename: list.filename,
          content: list.content,
        },
        true
      );
    }
  };

  const renameFile = (list) => {
    // const updatedTab = tab.map((item) => {
    //   if (item.filename === oldFileName) {
    //     return {
    //       ...item,
    //       filename: newFileName,
    //       status: "saved",
    //     };
    //   }
    //   return item;
    // });
    // const updatedFiles = files.map((item) => {
    //   if (item.filename === oldFileName) {
    //     return {
    //       ...item,
    //       filename: newFileName,
    //       status: "saved",
    //     };
    //   }
    //   return item;
    // });
    // setTab(updatedTab);
    // setFiles(updatedFiles);
    // if (newFileName === "dhcpd.conf" || oldFileName === "dhcpd.conf") {
    //   alert("Cannot rename dhcpd.conf file");
    // } else {
    //   putZtpFile(
    //     {
    //       filename: newFileName,
    //       content: list.content,
    //     },
    //     true
    //   );
    // }
  };

  const removeFile = (list) => {
    const payload = {
      filename: list.filename,
    };
    deleteZtpFile(payload);

    const updatedFiles = files.filter(
      (item) => item.filename !== list.filename
    );
    setFiles(updatedFiles);

    const updatedTab = tab.filter((item) => item.filename !== list.filename);
    if (updatedTab.length === 0) {
      setTab([]);
      setFile({
        filename: "default",
        language: "txt",
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

            {files.map((list, index) => (
              <Tooltip title={"file is " + list?.status} placement="right">
                <div
                  className={`fileItem ${
                    file?.filename === list?.filename ? "active" : ""
                  }`}
                  key={index}
                  onClick={() => addTab(list, "single")}
                  onDoubleClick={() => addTab(list, "double")}
                  onContextMenu={(e) => handleRightClick(e, list)}
                >
                  {list?.filename}
                </div>
              </Tooltip>
            ))}
            <div className="fileBottomSection">
              <button
                onClick={() => {
                  fileInputZTPRef.current.click();
                }}
                className="ml-5"
              >
                ZTP
                <FaFolderPlus className="ml-5" />
              </button>
              <input
                type="file"
                // multiple
                accept=".txt, .yml, .json, .conf"
                ref={fileInputZTPRef}
                style={{ display: "none" }} // Hide the input element
                onChange={handleFileChangeZTP}
              />
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
                defaultLanguage={"txt"}
                defaultValue={"Select a file"}
                theme="light" // light / vs-dark
                onChange={(e) => editorChange(e, file)}
                options={{
                  readOnly: file.status === "readonly" ? true : false,
                }}
              />
            </div>

            <div className="editorBottomSection">
              <button className="" onClick={() => save(file)}>
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
                {popover.file.filename !== "dhcpd.conf" ? (
                  <li onClick={() => renameFile(popover.file)}>Rename file</li>
                ) : null}
                {popover.file.filename !== "dhcpd.conf" ? (
                  <li onClick={() => removeFile(popover.file)}>Remove file</li>
                ) : null}
                {/* <li onClick={() => renameFile(popover.file)}>Rename file</li>
                <li onClick={() => removeFile(popover.file)}>Remove file</li> */}
                <li onClick={() => save(popover.file)}>Save file</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ZTPnDHCP;
