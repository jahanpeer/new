import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { BACKEND_SERVER } from "../URLConfig";
import Youtube from "react-youtube";
import ClipLoader from "react-spinners/ClipLoader";
import { MdShare } from "react-icons/md";
import { BsClockHistory, BsPlus, BsArrowLeftShort } from "react-icons/bs";

const ViewFile = () => {
  const [fdata, setFData] = useState(null);
  const [decryptionKey, setDecryptionKey] = useState("");
  const [renderData, setRenderData] = useState("");
  const [shortURL, setShortURL] = useState(null);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [videoCode, setVideoCode] = useState(null);

  console.log(renderData);
  const onOpenModal = () => {
    setOpen(true);
  };
  const onCloseModal = () => {
    setOpen(false);
  };
  const apiKey = "WXY5M9960yJgCM0Mpu8R4lgmqZwOnSNAO7tdzyL16cyIto58fp54xcsnd7SF";

  useEffect(() => {
    axios
      .get(`${BACKEND_SERVER}/file/${id}`)
      .then((res) => {
        setFData(res.data.data);
        const presentDate = new Date().getTime();
        if (res.data.data.expiryDate < presentDate) setIsExpired(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (fdata) {
      if (!fdata.isEncrypted) {
        const videoID = fdata.data.split("v=")[1].split("&")[0];
        setVideoCode(videoID);
      }
    }
  }, [fdata]);

  const shortenURL = async () => {
    try {
      const url = window.location.href;
      onOpenModal();
      const result = await fetch(
        `https://api.tinyurl.com/create?api_token=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json;",
            accept: "application/json",
          },
          body: JSON.stringify({
            url: url,
            domain: "tiny.one",
            alias: "",
            tags: "",
          }),
        }
      );
      const res = await result.json();
      setShortURL(res.data.tiny_url);
    } catch (err) {
      console.log(err);
    }
  };

  const getIp = async () => {
    const res = await axios.get("https://ipapi.co/json/");
    return res.data.ip;
  };

  useEffect(() => {
    try {
      getIp().then((ipAdd) => {
        fetch(`${BACKEND_SERVER}/updateLog`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            id: id,
            time: new Date().getTime(),
            ip: ipAdd,
          }),
        });
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const decryptData = async () => {
    try {
      const response = await fetch(
        "https://classify-web.herokuapp.com/api/decrypt",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            data: fdata.data,
            key: decryptionKey,
          }),
        }
      );
      const res = await response.json();
      // console.log(res);
      // setRenderData(res.result);
      const text = res.result.slice(0, 5);
      if (text === "https") {
        const videoID = res.result.split("v=")[1].split("&")[0];
        setVideoCode(videoID);
        setIsEncrypted(false);
      } else {
        toast.warn("Invalid Key!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (fdata) {
      setRenderData(fdata.data);
      setIsEncrypted(fdata.isEncrypted);
    }
  }, [fdata]);

  if (isExpired) {
    return (
      <>
        <div className="expireScreen">
          <h1>This Link has expired!</h1>
          <Link to="/">
            <button className="btn allFiles">Go to Home Page</button>
          </Link>
        </div>
      </>
    );
  } else {
    if (fdata) {
      return (
        <>
          {isEncrypted ? (
            <div className="expireScreen">
              <div className="navigation">
                <Link to="/">
                  <button className="btn allFiles newLink">
                    {" "}
                    <div className="iconButton">
                      <BsPlus className="icon deleteIcon " />
                      <span>Shorten New Link</span>
                    </div>
                  </button>
                </Link>
                <Link to="/allFiles">
                  <button className="btn renew newLink">
                    <div className="iconButton">
                      <BsArrowLeftShort className="icon deleteIcon " />
                      <span>Back</span>
                    </div>
                  </button>
                </Link>
              </div>
              <h1>
                The link is encrypted. Please enter the key to open the link.
              </h1>
              <input
                type="password"
                placeholder="Enter the key"
                value={decryptionKey}
                onChange={(e) => setDecryptionKey(e.target.value)}
              />
              <button className="btn save" onClick={decryptData}>
                Decrypt
              </button>
              <ToastContainer />
            </div>
          ) : (
            <div className="viewPage">
              <div className="top">
                <Link to="/">
                  <button className="btn allFiles newLink">
                    {" "}
                    <div className="iconButton">
                      <BsPlus className="icon deleteIcon " />
                      <span>Shorten New Link</span>
                    </div>
                  </button>
                </Link>
                <Link to={"/logs/" + id}>
                  <button className="btn renew newLink">
                    <div className="iconButton">
                      <BsClockHistory className="icon deleteIcon " />
                      <span>Access Logs</span>
                    </div>
                  </button>
                </Link>
              </div>
              <h1>{fdata.name}</h1>
              {/* <div className="textContainer">{parse(renderData)}</div> */}
              <Youtube className="videoPlayer" videoId={videoCode} />
              <div className="modalBtnContainer">
                <button className="btn renew" onClick={shortenURL}>
                  <div className="iconButton">
                    <MdShare className="icon deleteIcon " />
                    <span>Share</span>
                  </div>
                </button>
              </div>
              <Modal
                open={open}
                onClose={onCloseModal}
                center
                classNames={"modal"}
              >
                <h2 className="modalText">Share</h2>
                <p>
                  {shortURL ? (
                    <div>
                      <input
                        type="text"
                        value={shortURL}
                        className="modalInput"
                      />
                      <div className="modalBtnContainer">
                        <button
                          className="btn modalBtn allFiles"
                          onClick={() => {
                            navigator.clipboard.writeText(shortURL);
                            toast.warn("Copied !", {
                              position: "top-right",
                              autoClose: 3000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: "dark",
                            });
                          }}
                        >
                          Copy to Clipboard!
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="modalText generating">
                        Generating... <br />
                        <ClipLoader color={"black"} size={20} />
                      </h3>
                    </div>
                  )}
                </p>
              </Modal>
              <ToastContainer />
            </div>
          )}
        </>
      );
    } else {
      return (
        <div className="expireScreen">
          <ClipLoader color={"black"} size={50} />
        </div>
      );
    }
  }
};

export default ViewFile;
