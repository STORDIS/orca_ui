import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { getDiscoveryUrl } from "../../backend_rest_urls"

const DISCOVERY_TIMEOUT = 20000;

const DiscoverButton = () => {
  const initialBtnText = localStorage.getItem('btnText') || "Discover Network";
  const [isDisabled, setIsDisabled] = useState(false);
  const [btnText, setBtnText] = useState(initialBtnText);

  useEffect(() => {
    const disabledUntil = localStorage.getItem('disabledUntil');
    if (disabledUntil && new Date().getTime() < disabledUntil) {
      setIsDisabled(true);

      setTimeout(() => {
        setIsDisabled(false);
        localStorage.removeItem('disabledUntil');
        localStorage.removeItem('btnText');
        setBtnText("Discover Network");
      }, disabledUntil - new Date().getTime());
    }
  }, []);

  const btnHandler = async (event) => {
    event.preventDefault();
    setBtnText("Discovery In Progress");
    localStorage.setItem('btnText', "Discovery In Progress");

    setIsDisabled(true);
    const disabledUntil = new Date().getTime() + DISCOVERY_TIMEOUT;
    localStorage.setItem('disabledUntil', disabledUntil);

    try {
      const response = await axios.get(getDiscoveryUrl());
      console.log(response.data);
      setBtnText("Discover Network");
      setIsDisabled(false);

      localStorage.removeItem('disabledUntil');
      localStorage.removeItem('btnText');
    } catch (error) {
      console.log(error);
      setBtnText("Discover Network");
      setIsDisabled(false);

      localStorage.removeItem('disabledUntil');
      localStorage.removeItem('btnText');
    }
  }

  const buttonStyle = btnText === "Discovery In Progress"
    ? { backgroundColor: "grey", color: "black" }
    : { backgroundColor: "grey" };


  return (
    <Link to="/">
      <Button
        style={buttonStyle}
        id="btn"
        onClick={btnHandler}
        disabled={isDisabled}
        variant="contained"
        size="small">
        {btnText}
      </Button>
    </Link>
  );
};


export default DiscoverButton;