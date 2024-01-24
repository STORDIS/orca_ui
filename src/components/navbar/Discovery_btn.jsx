import React, { useState} from "react";
import axios from "axios";
import { getDiscoveryUrl } from "../../backend_rest_urls"
import DiscoveryForm from "./DiscoveryForm";
import Modal from "../modal/Modal";

const DiscoverButton = () => {
  const [isDiscoveryBtnDisabled, disableDiscBtn] = useState(false);
  const [discBtnText, setDiscBtnText] = useState('Discover Network');
  const buttonStyle = discBtnText === "Discovery In Progress"
    ? { backgroundColor: "#ccc", color: "#666", border: '1px solid black', borderRadius: '4px', padding: '6px 12px', fontFamily: 'Nunito, sans-serif', disabled: true }
    : { backgroundColor: "lightgray", color: "black", border: '1px solid black', borderRadius: '4px', padding: '6px 12px', fontFamily: 'Nunito, sans-serif' };

  const [showForm, setShowForm] = useState(false);

  const start_discovery = async (formData) => {
    setDiscBtnText("Discovery In Progress");
    disableDiscBtn(true);
    try {
      setShowForm(false)
      const response = await axios.put(getDiscoveryUrl(),formData);
      console.log(response.data);
      
      setDiscBtnText("Discover Network");
      disableDiscBtn(false);

    } catch (error) {
      console.log(error);
      setDiscBtnText("Discover Network");
      disableDiscBtn(false);
    }
  }
  return (
    <>
      <button
        style={buttonStyle}
        id="btnDiscovery"
        // onClick={btnHandler}
        onClick={() => setShowForm(true)}
        disabled={isDiscoveryBtnDisabled}
        variant="contained"
        size="small">
        {discBtnText}
      </button>
      <Modal show={showForm} onClose={() => setShowForm(false)} title="Discover">
        <DiscoveryForm handleSubmit={start_discovery} onCancel={() => setShowForm(false)} />
      </Modal>
    </>
  );
};


export default DiscoverButton;