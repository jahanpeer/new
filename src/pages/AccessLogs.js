import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./logs.css";
import { BACKEND_SERVER } from "../URLConfig";
import ClipLoader from "react-spinners/ClipLoader";
import { BsPlus, BsArrowLeftShort } from "react-icons/bs"

const AccessLogs = () => {
  const { id } = useParams();
  const [fdata, setFData] = useState(null);

  useEffect(() => {
    axios
      .get(`${BACKEND_SERVER}/file/${id}`)
      .then((res) => {
        setFData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  if (fdata) {
    return (
      <div className="logPage viewPage">
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
                <Link to={"/file/" + id}>
                  <button className="btn renew newLink">
                    <div className="iconButton">
                      <BsArrowLeftShort className="icon deleteIcon " />
                      <span>Back</span>
                    </div>
                  </button>
                </Link>
          {/* <Link to="/">
            <button className="btn newLink"> + Shorten New Link</button>
          </Link>
          <Link to={"/file/" + id}>
            <button className="btn newLink">Back</button>
          </Link> */}
        </div>
        <h1>Access Logs</h1>
        <div className="logContainer">
          <div className="row heading">
            <div className="sno"> S No.</div>
            <div className="date"> Time of Access</div>
            <div className="ip">IP(IPv4/IPv6) Address</div>
          </div>
          {fdata.accessLogs.map((item, index) => {
            return (
              <div className="row">
                <div className="sno">{index + 1} </div>
                <div className="date">
                  {" "}
                  {new Date(item.time).toLocaleString()}{" "}
                </div>
                <div className="ip">{item.ip}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    return (
      <div className="expireScreen">
        <h1 className="generating">
          <ClipLoader color={"white"} size={50} />
        </h1>
      </div>
    );
  }
};

export default AccessLogs;
