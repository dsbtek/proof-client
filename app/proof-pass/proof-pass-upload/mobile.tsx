"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { toast } from "react-toastify";
import {
  TextInput,
  Button,
  SelectComponent,
  AppHeader,
  DatePicker,
} from "@/components";
import { useDispatch } from "react-redux";
import {
  setProofPassData,
  setReDirectToProofPass,
} from "@/redux/slices/appConfig";
import { typeOfServices, proofPassResult } from "../../../utils/appData";

interface Option {
  id: number;
  value: string;
  label: string;
}

interface ProofPassType {
  firstName: string;
  lastName: string;
  panel: string;
  typeOfService: Option | null;
  collectionDate: string;
  result: Option | null;
}

const ProofPassUpload = () => {
  const dispatch = useDispatch();
  const [uploadFlag, setUploadFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState<ProofPassType>({
    firstName: "",
    lastName: "",
    panel: "",
    typeOfService: null,
    collectionDate: "",
    result: null,
  });
  const [formErrors, setFormErrors] = useState<{
    [key: string]: string | null;
  }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const handleChange = (name: string, value: string | Option | null) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));
    validateField(name, value);
  };

  const validateField = (name: string, value: string | Option | null) => {
    let error = null;
    if ((typeof value === "string" && value === "") || value === null) {
      error = `${name} is required`;
    }
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleDateSelect = (date: string) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      collectionDate: date,
    }));
  };

  const handleSubmission = () => {
    const formValid = Object.values(formErrors).every(
      (error) => error === null
    );
    const allTouched = Object.keys(formValues).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as { [key: string]: boolean });

    setTouched(allTouched);

    if (formValid) {
      try {
        dispatch(setProofPassData(formValues));
        setUploadFlag(true);
      } catch (error) {
        toast.error("Something went wrong");
        console.error(error);
      }
    } else {
      toast.error("Please fill out all required fields");
    }
  };

  const resetUploadFlag = () => {
    setLoading(true);
  };

  useEffect(() => {
    dispatch(setReDirectToProofPass(false));
  }, [dispatch]);

  return (
    <div className="container">
      <AppHeader title="PROOFpass Upload" />
      <br />
      {!uploadFlag ? (
        <div className="items-wrap">
          <TextInput
            type="text"
            placeholder="First Name"
            name="firstName"
            value={formValues.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            errors={formErrors.firstName}
            touched={touched.firstName}
          />
          <TextInput
            type="text"
            placeholder="Last Name"
            name="lastName"
            value={formValues.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            errors={formErrors.lastName}
            touched={touched.lastName}
          />
          <SelectComponent
            className=""
            data={typeOfServices}
            placeholder="Type of services"
            name="typeOfService"
            value={formValues.typeOfService}
            onChange={(option) => handleChange("typeOfService", option)}
          />
          {formValues.typeOfService && (
            <div className="wrap-collection">
              <TextInput
                type="text"
                placeholder="Panel"
                name="panel"
                value={formValues.panel}
                onChange={(e) => handleChange("panel", e.target.value)}
                errors={formErrors.panel}
                touched={touched.panel}
              />
              <DatePicker
                title="Collection Date"
                onDateSelect={handleDateSelect}
                date={formValues.collectionDate}
              />
              <SelectComponent
                className=""
                data={proofPassResult}
                placeholder="Results"
                name="result"
                value={formValues.result}
                onChange={(option) => handleChange("result", option)}
              />
            </div>
          )}
          <br />
          <p>I certify that my responses are true and correct</p>
          <br />
          <Button blue onClick={handleSubmission}>
            Continue
          </Button>
        </div>
      ) : (
        <div className="proof-pass-camera-wrapper">
          <Button
            blue
            onClick={resetUploadFlag}
            link="/proof-pass/add-proof-pass-image"
          >
            {"+ Take a photo"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProofPassUpload;
