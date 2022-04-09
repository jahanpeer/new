import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import axios from "axios";
import { BACKEND_SERVER } from "..//URLConfig";
import ClipLoader from "react-spinners/ClipLoader";
import { BsLockFill } from "react-icons/bs";
import {AiOutlineHistory} from "react-icons/ai"

const EditorX = () => {
  const [text, setText] = useState("");
  const [shortURL, setShortURL] = useState(null);
  // const [fileName, setFileName] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState("");
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [encryptedText, setEncryptedText] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const apiKey = "WXY5M9960yJgCM0Mpu8R4lgmqZwOnSNAO7tdzyL16cyIto58fp54xcsnd7SF";

  const onOpenModal = () => {
    setOpen(true);
  };
  const onCloseModal = () => {
    setOpen(false);
    setIsClicked(false);
  };
  const parseText = () => {
    var htmlString = text;
    var plainString = htmlString.replace(/<[^>]+>/g, "");
    return plainString;
  };

  // useEffect(() => {
  //   setIsURL(validURL(parseText()));
  // }, [text]);

  const validURL = (str) => {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  };

  // const getURL = async () => {
  //   if (validURL(parseText())) {
  //     //api call
  //     onOpenModal();
  //     setIsClicked(true);
  //     const longURL = parseText();
  //     const res = await axios.get(
  //       `https://api.shrtco.de/v2/shorten?url=${longURL}`
  //     );
  //     onOpenModal();
  //     setShortURL(res.data.result.short_link);
  //     setIsClicked(true);
  //   }
  // };

  const shortenURL = async () => {
    try {
      if (validURL(parseText())) {
        const url = parseText();
        onOpenModal();
        setIsClicked(true);
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
        onOpenModal();
        const res = await result.json();
        setShortURL(res.data.tiny_url);
      } else {
        toast.error("Not a valid url", {
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

  const saveData = async () => {
    if (!text) {
      toast.error("Please Add all the Fields", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      const res = await axios.get("https://ipapi.co/json/");
      const ipAdd = res.data.ip;
      const createdAt = new Date().getTime();
      const expiryAt = createdAt + 86400000;
      const firstAccess = [
        {
          time: createdAt,
          ip: ipAdd,
        },
      ];
      await fetch(`${BACKEND_SERVER}/saveData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: isEncrypted ? encryptedText : text,
          shortUrl: shortURL,
          isEncrypted: isEncrypted,
          expiryDate: expiryAt,
          accessLogs: firstAccess,
        }),
      })
        .then((res) => {
          res.json().then((doc) => {
            toast.success("Succesfully Saved !", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            if(isEncrypted)
            {
              navigate(`/file/${doc.data._id}`);
            }
            
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const encryptData = async () => {
    try {
      const response = await fetch(
        "https://classify-web.herokuapp.com/api/encrypt",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            data: text,
            key: encryptionKey,
          }),
        }
      );
      const res = await response.json();
      setIsEncrypted(true);
      setEncryptedText(res.result);
      toast.success("Encrypted Successfully! Please remember the key", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (shortURL !== null) saveData();
  }, [shortURL]);

  return (
    <div>
      <div className="viewPage">
        <div className="editorContainer">
          <div className="top">
            <div className="topHeading">
              <h1>YouTube URL Shortener</h1>
              <h4>Shorten that YouTube video URL into a short URL</h4>
            </div>
            {/* <Link to="/allFiles">
              <button className="btn allFiles">Show All Links</button>
            </Link> */}
          </div>
          <div className="container">
           <div className="inputContainer spaceBetween">
           <p>Paste a YouTube link to shorten it</p>
           <Link to="/allFiles" className="link recent" ><AiOutlineHistory className="icon recentIcon"/>&nbsp;&nbsp;
           <span>Recent Links</span></Link>
           </div>
            <div className="inputContainer">
              <input
                type="text"
                placeholder="http://youtube.com/watch?v=uashkuhas"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="linkInput"
              />
              <button
                title="Encrypt Link"
                className="encrypt"
                onClick={() => {
                  if (!text) {
                    toast.error("Please Add all the Fields", {
                      position: "top-right",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "dark",
                    });
                  } else {
                    onOpenModal();
                  }
                }}
              >
                <BsLockFill className="icon homeLock" />
              </button>
              <button className="btn save" onClick={shortenURL}>
                Shorten
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>{/* <Youtube videoId={videoCode} /> */}</div>
      <Modal open={open} onClose={onCloseModal} center>
        <h2 className="modalText">Share</h2>
        {isClicked ? (
          shortURL ? (
            <div>
              <input type="text" className="modalInput" value={shortURL} />
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
                Generating.. <br />
                <ClipLoader color={"black"} size={20} />
              </h3>
            </div>
          )
        ) : (
          <div>
            <div>
              <input
                type="password"
                className="modalInput"
                placeholder="Enter your key to encrypt"
                value={encryptionKey}
                onChange={(e) => setEncryptionKey(e.target.value)}
              />
            </div>
            <div className="modalBtnContainer">
              <button
                className="btn modalBtn "
                onClick={isEncrypted ? () => saveData() : () => encryptData()}
              >
                {isEncrypted ? "Save" : "Encrypt"}
              </button>
            </div>
          </div>
        )}
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default EditorX;
