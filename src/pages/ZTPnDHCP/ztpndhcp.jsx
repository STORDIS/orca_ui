import React, { useRef, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import "./ztpndhcp.scss";
import { FaRegCircleXmark } from "react-icons/fa6";
import { FaCircle } from "react-icons/fa";
import { FaFolderPlus } from "react-icons/fa";
import { ztpURL, dhcpConfigURL } from "../../utils/backend_rest_urls";
import interceptor from "../../utils/interceptor";
import CredentialForm from "./CredentialsForm";

export const ZTPnDHCP = () => {
  const parentDivRef = useRef(null);
  const fileInputZTPRef = useRef(null);
  const fileInputDHCPRef = useRef(null);

  const [dhcpCredentials, setDhcpCredentials] = useState({});

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
    const extension = filename.split(".").pop();
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

  const getStpFile = (filename) => {
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
      .then((res) => {
        console.info("file saved");
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        if (getfile) {
          getStpFile(payload.filename);
        }
      });
  };

  const deleteZtpFile = (payload) => {
    instance
      .delete(ztpURL(), { data: payload })
      .then((res) => {
        console.info("file deleted");
      })
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

  const putDhcpFiles = (device_ip, payload) => {
    instance
      .put(dhcpConfigURL(device_ip), payload)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDhcpFiles = (device_ip) => {
    instance
      .get(dhcpConfigURL(device_ip))
      .then((res) => {
        console.log(res.data);

        setFiles((prevFiles) => [
          ...prevFiles,
          {
            filename: res.data.filename,
            language: getFileLanguage(res.data.filename),
            content: res.data.content,
            status: "saved",
          },
        ]);

      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFileChangeDHCP = (event) => {
    const uploadedFile = event.target.files[0];

    if (uploadedFile) {
      const reader = new FileReader();
      let fileText = "";
      reader.onload = (e) => {
        fileText = e.target.result;
        console.log({
          filename: uploadedFile.name,
          content: fileText,
        });

        putDhcpFiles(dhcpCredentials.device_ip, {
          mgt_ip: dhcpCredentials.device_ip,
          content: fileText,
        });
      };
      reader.readAsText(uploadedFile);
    }
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
        setTab([...tab, list]);
      }
    } else {
      setTab([list]);
    }

    setFile(list);
  };

  const removeTab = (list) => {
    if (list.status === "saved") {
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
    const updatedTab = tab.map((item) => {
      if (item.filename === file.filename) {
        return {
          ...item,
          status: "unsaved",
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
    setFiles(updatedTab);
    const payload = {
      filename: list.filename,
      content: list.content,
    };
    putZtpFile(payload, true);
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

  const getCredentials = (e) => {
    setDhcpCredentials(e);
    console.log(e.device_ip);
    getDhcpFiles(e.device_ip);
  };

  return (
    <div
      className=""
      onClick={() => setPopover({ ...popover, visible: false })}
    >
      <CredentialForm sendCredentialsToParent={getCredentials} />

      <div className="listContainer">
        <div className="editorContainer">
          <div className="fileSelection">
            <div className="fileHeader">File list</div>

            {files.map((list, index) => (
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
              <button
                onClick={() => {
                  fileInputDHCPRef.current.click();
                }}
                className="ml-5"
              >
                DHCP
                <FaFolderPlus className="ml-5" />
              </button>
              <input
                type="file"
                // multiple
                accept=".txt, .yml, .json, .conf"
                ref={fileInputDHCPRef}
                style={{ display: "none" }} // Hide the input element
                onChange={handleFileChangeDHCP}
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
                    <div onClick={() => setFile(list)}>{list.filename}</div>
                  </div>
                  {list.status === "unsaved" && (
                    <div onClick={() => setFile(list)}>
                      <FaCircle />
                    </div>
                  )}
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
                <li onClick={() => removeFile(popover.file)}>Remove file</li>
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
