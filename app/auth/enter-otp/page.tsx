"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Formik, Form } from 'formik';
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { TextField, Button, HeaderText } from "@/components";
import { otpSchema } from "@/utils/validations";

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
                method: 'POST',
                headers: {
                    change_code: otp as string
                }
            })

            const data = await response.json();

            if (data.data.statusCode === 200 && data.data.message === "success") {
                toast.success("OTP verified successfully!");
                router.push("/auth/set-new-pin");
            } else {
                toast.warning(`Error ${data.data.statusCode}: ${data.data.message}`);
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error)
        }
    }

    return (
        <div className="container">
            <div className="items-wrap">
                <div className="back">
                    <Link href="/auth/forgot-pin/">
                        <Image
                            src="/images/arrow-back.png"
                            alt="image"
                            width={20}
                            height={20}
                            loading='lazy'
                        />
                    </Link>
                </div>
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
                                                src="/images/lock.png"
                                                alt="image"
                                                width={20}
                                                height={20}
                                                loading='lazy'
                                            />
                                        }
                                        name="otp"
                                        errors={errors}
                                        touched={touched}
                                    />
                                    <p className="otp-text">
                                        If you are having difficulties resetting your PIN, Please contact{" "}
                                        <span className="recoverytrek"><a href="mailto: proof@recoverytrek.com">proof@recoverytrek.com</a></span>
                                    </p>
                                </div>
                                <Button
                                    blue
                                    disabled={isSubmitting}
                                    type="submit"
                                >Continue</Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default EnterOTP;
