import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { getDiscoveryUrl } from "../../backend_rest_urls";

const DiscoverButton = () => {
  function wait(time) {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  }
  let [isDisabled, setIsDisabled] = useState(false);
  const [btnText, setBtnText] = useState("Discover Network");

  useEffect(() => {
    const disabledUntil = localStorage.getItem('disabledUntil');
    if (disabledUntil && new Date().getTime() < disabledUntil) {
      setIsDisabled(true);
      setTimeout(() => {
        setIsDisabled(false);
        localStorage.removeItem('disabledUntil');
      }, disabledUntil - new Date().getTime());
    }
  }, []);

 
  async function btnHandler() {
    setBtnText("Discovering");
    setIsDisabled(true);
    const disabledUntil = new Date().getTime() + 20000;
    localStorage.setItem('disabledUntil', disabledUntil);
    
    await wait(1);
    Axios({
      url: getDiscoveryUrl()
    })
      .then((response) => {
          console.log(response.data);
          setIsDisabled(false);
          setBtnText("Discover Network");
          localStorage.clear();
      })
      .catch((error) => {
        console.log(error);
          setIsDisabled(false);
          setBtnText("Discover Network");
          localStorage.clear();
      });
  }

  return (
    <>
      <Link to="/discover">
        <Button
          style={{
            backgroundColor: "#21b6ae"
          }}
          id="btn"
          onClick={btnHandler}
          disabled={isDisabled}
          variant="contained"
        >
          {btnText}
        </Button>
      </Link>
    </>
  );
};

export default DiscoverButton;