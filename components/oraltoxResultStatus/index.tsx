import Image from "next/image";
import React, { MouseEventHandler } from "react";



interface IOraltoxResult {
    color: string;
    statusText?: string;
    onClick?: MouseEventHandler<HTMLImageElement> | undefined
  }
  

const OraltoxResultStatusIndicator = ({color,statusText, onClick}:IOraltoxResult) => {
  return (
    <div className="oraltox-result-status-indicator">
      <div className="oral-result-status" style={{backgroundColor:color}}></div>
      <div className="oral-result-status-text"> {statusText? statusText: "Tap here to enter result"}</div>
      <Image
        className="oraltox-result-edit"
        src="/icons/edit-icon.svg"
        alt="edit icon"
        width={3000}
        height={3000}
        style={{cursor:"pointer"}}
        onClick={onClick}
      />
    </div>
  );
};

export default OraltoxResultStatusIndicator;
