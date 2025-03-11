"use client";

import { useState } from "react";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { CiCalendarDate } from "react-icons/ci";
import { FaCity, FaRegAddressBook } from "react-icons/fa";
import { MdOutlineRealEstateAgent } from "react-icons/md";
import { TbZip } from "react-icons/tb";

import TextField from "../text-field";
import CheckBox from "../checkBox";
import Button from "../button";
import { IDDetails, setIdDetails, testData } from "@/redux/slices/drugTest";
import { IDSchema } from "@/utils/validations";
import { useSelector } from "react-redux";

const IDCardForm = ({
  setShowForm,
  goToStep3,
}: {
  setShowForm: (a: boolean) => void;
  goToStep3: () => void;
}) => {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);
  const { idDetails } = useSelector(testData);
  const initialValues: IDDetails = {
    first_name: idDetails.first_name || "",
    last_name: idDetails.last_name || "",
    date_of_birth: idDetails.date_of_birth || "",
    address: idDetails.address || "",
    city: idDetails.city || "",
    state: idDetails.state || "",
    zipcode: idDetails.zipcode || "",
  };

  const handleCheck = () => {
    setChecked(!checked);
  };

  const onSubmit = async (values: IDDetails) => {
    try {
      dispatch(setIdDetails(values));
      //   setShowForm(false);
      goToStep3();
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };
  return (
    <div className="test-items-wrap-desktop_form">
      <h3>Please fill out the information</h3>
      <p>Please enter your details below to upload your ProofPass.</p>
      <Formik
        initialValues={initialValues}
        validationSchema={IDSchema}
        onSubmit={onSubmit}
      >
        {({ values, errors, touched, isSubmitting }) => (
          <Form>
            <TextField
              type="text"
              placeholder="First name"
              value={values.first_name}
              startIcon={
                <Image
                  src="/icons/user.svg"
                  alt="image"
                  width={24}
                  height={24}
                  loading="lazy"
                />
              }
              name="first_name"
              errors={errors}
              touched={touched}
            />
            <TextField
              type="text"
              placeholder="Last Name"
              value={values.last_name}
              startIcon={
                <Image
                  src="/icons/user.svg"
                  alt="image"
                  width={24}
                  height={24}
                  loading="lazy"
                />
              }
              name="last_name"
              errors={errors}
              touched={touched}
            />
            <TextField
              type="text"
              placeholder="Date of Birth"
              value={values.date_of_birth}
              startIcon={<CiCalendarDate color="#009cf9" size={24} />}
              name="date_of_birth"
              errors={errors}
              touched={touched}
            />
            <TextField
              type="text"
              placeholder="Address"
              value={values.address}
              startIcon={<FaRegAddressBook color="#009cf9" size={24} />}
              name="address"
              errors={errors}
              touched={touched}
            />
            <TextField
              type="text"
              placeholder="City"
              value={values.city}
              startIcon={<FaCity color="#009cf9" size={24} />}
              name="city"
              errors={errors}
              touched={touched}
            />
            <TextField
              type="text"
              placeholder="State"
              value={values.state}
              startIcon={<MdOutlineRealEstateAgent color="#009cf9" size={24} />}
              name="state"
              errors={errors}
              touched={touched}
            />
            <TextField
              type="text"
              placeholder="Zipcode"
              value={values.zipcode}
              startIcon={<TbZip color="#009cf9" size={24} />}
              name="zipcode"
              errors={errors}
              touched={touched}
            />
            <div className="check-wrap">
              <div>
                <CheckBox
                  label={
                    "I confirm that the information supplied above is correct and matches what is on my government issued ID."
                  }
                  checked={checked}
                  onChange={handleCheck}
                />
              </div>
            </div>
            <Button
              blue
              disabled={!checked}
              type="submit"
              style={{
                // width: '12rem',
                padding: "8px 36px",
                height: "3rem",
                marginBottom: "10px",
                textWrap: "nowrap",
              }}
            >
              {!checked ? "Please Confirm..." : "Confirm"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default IDCardForm;
