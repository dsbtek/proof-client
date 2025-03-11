"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  AgreementHeader,
  AgreementFooter,
  CheckBox,
  AppHeader,
  AppContainer,
} from "@/components";

const Bac = () => {
  const [checkboxes, setCheckboxes] = useState([
    {
      id: 1,
      label:
        "I will hold the device and look directly at my smartphone so that my head and face are within the `guide` on the screen during the entire test process.",
      isChecked: false,
    },
    {
      id: 2,
      label:
        "I will take a deep breath during the `warm up` phase and blow steadily during the `test` phase.",
      isChecked: false,
    },
    {
      id: 3,
      label:
        "I will not attempt to obstruct the device or the mouthpiece in any way.",
      isChecked: false,
    },
    {
      id: 4,
      label:
        "I will not wear anything on my face or head that would obstruct the camera and my photo during the test.",
      isChecked: false,
    },
    {
      id: 5,
      label:
        "I will ensure that i am in a well lit environment, to ensure that my face is visible. My lighting is on and my face can clearly be seen.",
      isChecked: false,
    },
    {
      id: 6,
      label:
        "I will not place my hands or anything near the device or the mouthpiece.",
      isChecked: false,
    },
    {
      id: 7,
      label:
        "I will not attempt to falsify the test or use any additional devices or assistance from other people to provide the device with a false reading.",
      isChecked: false,
    },
    {
      id: 8,
      label:
        "I will wait at leas 20 minutes after smoking, eating or drinking before testing to ensure accurate results.",
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
    <AppContainer
      header={<AppHeader title="PROOF BAC TEST" hasMute={false} />}
      body={
        <div className="container-test-collection">
          <div className="agreement-items-wrap what-new-scroller bac-checkList">
            <p className="get-started-title">
              By clicking continue below, you agree that you will follow the
              rules below when taking your breath alcohol test via the GetPROOF
              Application
            </p>
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
        </div>
      }
      footer={
        <AgreementFooter
          currentNumber={4}
          outOf={5}
          onPagination={false}
          onLeftButton={false}
          onRightButton={allChecked}
          btnLeftLink={""}
          btnRightLink={"/bac/bac-connect-device"}
          btnLeftText={""}
          btnRightText={"Next"}
        />
      }
    />
  );
};

export default Bac;
