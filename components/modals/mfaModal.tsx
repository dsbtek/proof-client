"use client";

import { useEffect, useRef, useState } from "react";

import { Modal, Button, ImageModal, TextField } from "@/components";
import Badge from "../badge";
import { SlClose } from "react-icons/sl";
import { useSelector } from "react-redux";
import { historyData } from "@/redux/slices/appConfig";
import Crypto from "crypto-js";
import { Form, Formik } from "formik";
import { mfaSchema } from "@/utils/validations";
import { toast } from "react-toastify";
import Image from "next/image";
import axios from "@/utils/axios";

interface SessionModalProps {
  show: boolean;
  onClose?: (a?: any) => void;
  setLoginRedirect?: any;
}

interface mfaType {
  otp: string;
}

const MfaModal = ({ show, onClose, setLoginRedirect }: SessionModalProps) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const initialValues: mfaType = {
    otp: "",
  };

  const onSubmith = async (values: mfaType) => {
    try {
      const { otp } = values;
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  const onSubmit = async (values: mfaType) => {
    try {
      // const response = await axios.post(
      //   "https://sendotp-9168.twil.io/validate_otp",
      //   {
      //     phoneNumber: "+2348185261301", //participant id should be here
      //   }
      // );
      const response = await fetch("/api/verifyMfa", {
        method: "POST",
        body: JSON.stringify({
          phoneNumber: "+2348185261301", //participant_id
          code: parseInt(values.otp),
        }),
      });
      console.log(response);
      // setSentOtp(response.data.otp); // Store the sent OTP for validation
      if (response.status === 200) {
        setLoginRedirect(true);
        onClose && onClose();
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <div className="mfa-modal">
        <div className="close-icon-row" onClick={onClose}>
          <SlClose
            size={30}
            style={{ float: "right" }}
            className="clickable-icon-hover"
          />
        </div>
        <h1
          className="sm-text"
          style={{ color: "#009CF9", marginBottom: "16px" }}
        >
          Enter Otp
        </h1>
        <Formik
          initialValues={initialValues}
          validationSchema={mfaSchema}
          onSubmit={onSubmit}
        >
          {({ values, errors, touched, isSubmitting }) => (
            <Form>
              <div className="mfa-form">
                <div>
                  <TextField
                    type="pin"
                    placeholder="Enter Otp"
                    value={values.otp}
                    startIcon={
                      <Image
                        src="/icons/lock.svg"
                        alt="proof image"
                        width={24}
                        height={24}
                        loading="lazy"
                      />
                    }
                    endIcon={true}
                    name="otp"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <Button
                  blue
                  disabled={isSubmitting}
                  type="submit"
                  style={{ height: "42px" }}
                >
                  Verify
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default MfaModal;
