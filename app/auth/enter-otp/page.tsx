"use client";

import { Form, Formik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { Button, Header, HeaderText, TextField } from "@/components";
import { otpSchema } from "@/utils/validations";
import { IoChevronBackOutline } from "react-icons/io5";

interface OTPType {
  otp: number | string;
}

function EnterOTP() {
  const router = useRouter();
  const initialValues: OTPType = {
    otp: "",
  };
  const onSubmit = async (values: OTPType) => {
    try {
      const { otp } = values;

      const response = await fetch("/api/enter-otp", {
        method: "POST",
        headers: {
          change_code: otp as string,
        },
      });

      const data = await response.json();

      if (data.data.statusCode === 200 && data.data.message === "success") {
        toast.success("OTP verified successfully!");
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
      <div className="container">
        <div className="items-wrap">
          <Header title="" icon1={<IoChevronBackOutline />} hasMute={false} />
          <HeaderText
            title={"Enter Code"}
            text={"Enter the code that you have received in your email."}
          />
          <Formik
            initialValues={initialValues}
            validationSchema={otpSchema}
            onSubmit={onSubmit}
          >
            {({ values, errors, touched, isSubmitting }) => (
              <Form>
                <div className="auth-form">
                  <div>
                    <TextField
                      type="text"
                      placeholder="verification code"
                      value={values.otp}
                      startIcon={
                        <Image
                          src="/icons/pin-icon.svg"
                          alt="image"
                          width={24}
                          height={24}
                          loading="lazy"
                        />
                      }
                      name="otp"
                      errors={errors}
                      touched={touched}
                    />
                    <p className="otp-text">
                      If you are having difficulties resetting your PIN, Please
                      contact{" "}
                      <span className="recoverytrek">
                        <a href="mailto: proof@recoverytrek.com">
                          proof@recoverytrek.com
                        </a>
                      </span>
                    </p>
                  </div>
                  <Button blue disabled={isSubmitting} type="submit">
                    Continue
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
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

export default EnterOTP;
