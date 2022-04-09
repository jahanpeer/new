import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import "./viewall.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_SERVER } from "../URLConfig";
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/react";
import Youtube from "react-youtube";
import {BsLockFill } from "react-icons/bs"
import {MdDelete,MdShare} from "react-icons/md"

const ViewAll = () => {
  const [allFiles, setAllFiles] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const navigate = useNavigate();
  const color = "white";

  useEffect(() => {
    setisLoading(true);
    axios
      .get(`${BACKEND_SERVER}/showAllData`)
      .then((res) => {
        const presentTime = new Date().getTime();
        const results = res.data.datas.filter((item) => {
          return item.expiryDate > presentTime;
        });
        setAllFiles(results);
        setisLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const override = css`
    margin-top: 140px;
    margin-right: 60px;
  `;
  const redirect = (id) => {
    navigate(`/file/${id}`);
  };

  const deleteFile = async (id) => {
    await fetch(`${BACKEND_SERVER}/deleteFile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((res) => {
        res.json();
        navigate(0);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="AllFilesPage">
        <h1>All Links</h1>

        <Link to="/" className="link">
          <button className="newLink" >+ Shorten New Link</button>
        </Link>
        <div className="filesContainer">
          {isLoading ? (
            <ClipLoader
              css={override}
              color={color}
              loading={isLoading}
              size={50}
            />
          ) : (
            allFiles.map((file) => {
              const videoCode = file.isEncrypted
                ? null
                : file.data.split("v=")[1].split("&")[0];
              return (
                <div key={file._id} className="fileCard">
                  <div
                    onClick={() => {
                      redirect(file._id);
                    }}
                    className="fileContainer"
                  >
                    <div className="fileTransparent"></div>
                    {videoCode ? (
                      <Youtube className="fileVideo" videoId={videoCode} />
                    ) : (
                      <div className="iconContainer">
                      {/* <div><BsLockFill  className="icon lock" /></div> */}
                      <h3 className="noVideo"><BsLockFill  className="icon lock" />Link is encrypted!</h3>
                      </div>
                    )}
                  </div>
                  <div>
                    {videoCode ? (
                      <>
                        <button
                          className="btn renew"
                          onClick={() => {
                            navigator.clipboard.writeText(file.shortUrl);
                            toast.success("Link Copied to Clipboard", {
                              position: "top-right",
                              autoClose: 3000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme:"dark"
                            });
                          }}
                        >
                         <div className="iconButton" >
                          <MdShare className="icon deleteIcon " /><span>Share</span>
                          </div>
                        </button>
                        <button
                          className="btn delete "
                          onClick={() => {
                            deleteFile(file._id);
                            toast.success("Deleted !", {
                              position: "top-right",
                              autoClose: 3000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme:"dark"
                            });
                          }}
                        >
                          <div className="iconButton" >
                          <MdDelete className="icon deleteIcon" /><span>Delete</span>
                          </div>

                        </button>
                      </>
                    ) : (
                     <div className="iconButton">
                     <button
                        className="btn delete decrypt"
                        onClick={() => {
                          redirect(file._id);
                        }}
                      >
                        Decrypt
                      </button>
                     </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ViewAll;
