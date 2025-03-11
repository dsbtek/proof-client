"use client";

import Image from "next/image";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { TextField, Button, HeaderText, AppHeader, Header } from "@/components";
import { forgotPinSchema } from "@/utils/validations";
import { IoChevronBackOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { appData } from "@/redux/slices/appConfig";
import styles from "../sign-in/sigin.module.css";

interface ForgotPinType {
  participant_id: number | string;
}

function ForgotPin() {
  const { PROOF_Home_Message, PROOF_Home_Logo } = useSelector(appData);
  const router = useRouter();
  const initialValues: ForgotPinType = {
    participant_id: "",
  };

  const onSubmit = async (values: ForgotPinType) => {
    try {
      const { participant_id } = values;

      const response = await fetch("/api/forgot-pin", {
        method: "POST",
        headers: {
          participant_id: participant_id as string,
        },
      });

      const data = await response.json();

      if (data.data.statusCode === 200) {
        toast.success("Code sent successfully");
        // router.push("/auth/enter-otp/");
        router.push("/auth/set-new-pin");
      } else {
        toast.warning(`Error ${data.data.statusCode}: ${data.data.message}`);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="desktop-wrap">
      <div className="container" style={{ padding: "48px" }}>
        <div className="items-wrap_auth">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              minHeight: "10px",
            }}
          >
            <Image
              className={styles.siginPrLogo}
              src={PROOF_Home_Logo || "/icons/pr-logo.svg"}
              alt="image"
              width={3000}
              height={3000}
              priority
            />

            <div style={{ marginTop: "auto", marginBottom: "auto" }}>
              <div
                style={{ marginBottom: "32px", fontSize: "0.9rem" }}
                onClick={() => router.back()}
              >
                <IoChevronBackOutline />
                &nbsp;Go back
              </div>
              <div className="sign-header">
                <h1>Forgot PIN</h1>
                <p>
                  Complete the form below and you will receive a reset code
                  which you will enter on the next screen
                </p>
              </div>
              <Formik
                initialValues={initialValues}
                validationSchema={forgotPinSchema}
                onSubmit={onSubmit}
              >
                {({ values, errors, touched, isSubmitting }) => (
                  <Form>
                    <div className="auth-form">
                      <TextField
                        type="text"
                        placeholder="Participant ID"
                        value={values.participant_id}
                        startIcon={
                          <Image
                            src="/icons/participant-id-icon.svg"
                            alt="image"
                            width={24}
                            height={24}
                            loading="lazy"
                          />
                        }
                        name="participant_id"
                        errors={errors}
                        touched={touched}
                      />
                      <div className="buttons">
                        <Button
                          classname="custom-button-1"
                          // onClick={() => { router.push("/auth/enter-otp/") }}
                          onClick={() => {
                            router.push("/auth/set-new-pin");
                          }}
                        >
                          I already have a code
                        </Button>
                        <Button blue disabled={isSubmitting} type="submit">
                          Continue
                        </Button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
      <div className="wrap-login-img">
        <div
          className="auth-img"
          style={{ backgroundImage: 'url("../images/login-img.svg")' }}
        ></div>
      </div>
    </div>
  );
}

export default ForgotPin;
