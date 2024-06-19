"use client";

import { toast } from "react-toastify";
import { typeOfServices, proofPassResult } from '../../../utils/appData';
import { TextInput, Button, SelectComponent, AppHeader, DateSelector } from "@/components";
import { useDispatch } from 'react-redux';
import { setProofPassData, setReDirectToProofPass } from "@/redux/slices/appConfig";
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';

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
  const [formValues, setFormValues] = useState<ProofPassType>({
    firstName: "",
    lastName: "",
    panel: "",
    typeOfService: null,
    collectionDate: "",
    result: null,
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string | null }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true
    }));
    validateField(name, value);
  };

  const handleSelectChange = (name: string, option: Option | null) => {
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: option
    }));
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true
    }));
    validateField(name, option);
  };

  const validateField = (name: string, value: any) => {
    let error = null;
    if (value === "" || value === null) {
      error = `${name} is required`;
    }
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
  };

  const handleSubmission = (e: FormEvent) => {
    e.preventDefault();
    const formValid = Object.values(formErrors).every(error => error === null);
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

  const ressetUploadFlag = () => {
    setLoading(true);
  };

  useEffect(() => {
    dispatch(setReDirectToProofPass(false));
  }, [dispatch]);

  return (
    <div className="container">
      <AppHeader title="PROOFpass Upload" />
      {!uploadFlag ? (
        <div className="items-wrap">
          <form onSubmit={handleSubmission}>
            <TextInput
              type="text"
              placeholder="First Name"
              name="firstName"
              value={formValues.firstName}
              onChange={handleChange}
              errors={formErrors.firstName}
              touched={touched.firstName}
            />
            <TextInput
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={formValues.lastName}
              onChange={handleChange}
              errors={formErrors.lastName}
              touched={touched.lastName}
            />
            <SelectComponent
              className="select-w"
              data={typeOfServices}
              placeholder="Type of services"
              name="typeOfService"
              value={formValues.typeOfService}
              onChange={(option) => handleSelectChange('typeOfService', option)}
            />
            {formValues.typeOfService && (
              <div className="wrap-collection">
                <TextInput
                  type="text"
                  placeholder="Panel"
                  name="panel"
                  value={formValues.panel}
                  onChange={handleChange}
                  errors={formErrors.panel}
                  touched={touched.panel}
                />
                <DateSelector
                  placeholder="Collection Date"
                  label="Collection Date"
                  name="collectionDate"
                  value={formValues.collectionDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
                />
                <SelectComponent
                  className="select-w"
                  data={proofPassResult}
                  placeholder="Results"
                  name="result"
                  value={formValues.result}
                  onChange={(option) => handleSelectChange('result', option)}
                />
              </div>
            )}
            <br />
            <p>I certify that my responses are true and correct</p>
            <br />
            <Button blue type="submit">
              Continue
            </Button>
          </form>
        </div>
      ) : (
        <div className='proof-pass-camera-wrapper'>
          <Button blue onClick={ressetUploadFlag} link='/proof-pass/add-proof-pass-image'>
            {'+ Take a photo'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProofPassUpload;
