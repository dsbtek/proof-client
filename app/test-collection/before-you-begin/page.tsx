"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  AgreementHeader,
  AgreementFooter,
  CheckBox,
  DesktopFooter,
} from "@/components";
import useResponsive from "@/hooks/useResponsive";

const BeforeYouBegin = () => {
  const isDesktop = useResponsive();
  const [checkboxes, setCheckboxes] = useState([
    { id: 1, label: "Unopened Proof Collection Kit", isChecked: false },
    { id: 2, label: "Ballpoint Pen", isChecked: false },
    { id: 3, label: "Valid Government-Issued Photo ID", isChecked: false },
    { id: 4, label: "Volume is turned up on this Device", isChecked: false },
    {
      id: 5,
      label: "Device is in DO NOT Disturb Mode and Alarms are OFF",
      isChecked: false,
    },
    {
      id: 6,
      label: "Noted Participant ID and Today`s Date.",
      isChecked: false,
    },
  ]);

  const handleCheckboxChange = (id: number) => {
    setCheckboxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) =>
        checkbox.id === id
          ? { ...checkbox, isChecked: !checkbox.isChecked }
          : checkbox
      )
    );
  };

  const allChecked = checkboxes.every((checkbox) => checkbox.isChecked);

  return (
    <>
      <div className="container-test-collection">
        <AgreementHeader title="Confirmation" />
        {!isDesktop ? (
          <div className="agreement-items-wrap ">
            <Image
              className="get-started-img"
              src="/images/before-you-begin.svg"
              alt="image"
              width={3000}
              height={3000}
            />
            <p className="get-started-title">Before You Begin</p>
            <p className="get-started-title">Please confirm the following.</p>
            <div className="checkbox-container">
              {checkboxes.map((checkbox, index) => (
                <CheckBox
                  key={checkbox.id}
                  onChange={() => handleCheckboxChange(checkbox.id)}
                  checked={checkbox.isChecked}
                  label={checkbox.label}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="test-items-wrap-desktop_ ">
            <div className="sub-item">
              <p className="get-started-title bold-headig">Before You Begin</p>
              <p className="get-started-title">Please confirm the following.</p>
              <div className="checkbox-container">
                {checkboxes.map((checkbox, index) => (
                  <CheckBox
                    key={checkbox.id}
                    onChange={() => handleCheckboxChange(checkbox.id)}
                    checked={checkbox.isChecked}
                    label={checkbox.label}
                  />
                ))}
              </div>
            </div>
            <Image
              className="get-started-img"
              src="/images/b4bgin.svg"
              alt="image"
              width={3000}
              height={3000}
            />
          </div>
        )}
      </div>
      {isDesktop ? (
        <DesktopFooter
          currentNumber={4}
          outOf={5}
          onPagination={true}
          onLeftButton={false}
          onRightButton={allChecked}
          btnLeftLink={""}
          btnRightLink={"/test-collection/camera-view"}
          btnLeftText={"Decline"}
          btnRightText={"Next"}
        />
      ) : (
        <AgreementFooter
          currentNumber={4}
          outOf={5}
          onPagination={true}
          onLeftButton={false}
          onRightButton={allChecked}
          btnLeftLink={""}
          btnRightLink={"/test-collection/camera-view"}
          btnLeftText={"Decline"}
          btnRightText={"Next"}
        />
      )}
    </>
  );
};

export default BeforeYouBegin;
