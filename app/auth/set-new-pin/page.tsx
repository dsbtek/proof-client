"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Formik, Form } from 'formik';
import { useRouter } from "next/navigation";

import { TextField, Button, HeaderText, AppHeader } from "@/components";
import { setPinSchema } from "@/utils/validations";
import { toast } from "react-toastify";

interface SetNewPinType {
    pin: number | string;
    confirm_pin: number | string;
}

function SetNewPin() {
    const router = useRouter();
    const initialValues: SetNewPinType = {
        pin: "",
        confirm_pin: "",
    };

    const onSubmit = async (values: SetNewPinType) => {
        try {
            const { pin, confirm_pin } = values;

            const response = await fetch("/api/set-pin", {
                method: 'POST',
                headers: {
                    change_code: pin as string,
                    new_pin: confirm_pin as string
                }
            })

            const data = await response.json();

            if (data.data.statusCode === 200) {
                toast.success("Pin changed successfully! Login to continue.");
                router.push("/auth/sign-in");
            } else {
                toast.warning(`Error ${data.data.statusCode}: ${data.data.message}`);
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error)
        }
    }

    return (
        <div className="desktop-wrap">
            <div className="container">
                <div className="items-wrap">
                    <AppHeader title='' />
                    <HeaderText
                        title={"Reset PIN"}
                        text={"Verification complete. Please enter your new PIN code."}
                    />
                    <Formik
                        initialValues={initialValues}
                        validationSchema={setPinSchema}
                        onSubmit={onSubmit}
                    >
                        {({ values, errors, touched, isSubmitting }) => (
                            <Form>
                                <div className="auth-form">
                                    <div>
                                        <TextField
                                            type="password"
                                            // placeholder="Pin"
                                            placeholder="OTP Code"
                                            value={values.pin}
                                            startIcon={
                                                <Image src="/icons/lock.svg" alt="image" width={24} height={24} loading='lazy' />
                                            }
                                            endIcon={true}
                                            name="pin"
                                            errors={errors}
                                            touched={touched}
                                        />
                                        <TextField
                                            type="password"
                                            // placeholder="Confirm Pin"
                                            placeholder="New Pin"
                                            value={values.confirm_pin}
                                            startIcon={
                                                <Image src="/icons/lock.svg" alt="proof image" width={24} height={24} loading='lazy' />
                                            }
                                            endIcon={true}
                                            name="confirm_pin"
                                            errors={errors}
                                            touched={touched}
                                        />
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
            <div className="wrap-login-img">
                <div className="auth-img"
                    style={{ backgroundImage: 'url("../images/login-img.svg")' }}
                >

                </div>
            </div>
        </div >
    );
};

export default SetNewPin;
