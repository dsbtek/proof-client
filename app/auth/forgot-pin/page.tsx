"use client";

import Image from "next/image";
import { Formik, Form } from 'formik';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

import { TextField, Button, HeaderText, AppHeader } from "@/components";
import { forgotPinSchema } from "@/utils/validations";

interface ForgotPinType {
    participant_id: number | string;
}

function ForgotPin() {
    const router = useRouter();
    const initialValues: ForgotPinType = {
        participant_id: "",
    };

    const onSubmit = async (values: ForgotPinType) => {
        try {
            const { participant_id } = values;

            const response = await fetch("/api/forgot-pin", {
                method: 'POST',
                headers: {
                    participant_id: participant_id as string
                }
            })

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
            console.error(error)
        }
    }

    return (
        <div className="desktop-wrap">

            <div className="container">
                <div className="items-wrap">
                    <AppHeader title='' />
                    <HeaderText
                        title={"Forgot PIN"}
                        text={
                            "Complete the form below and you will receive a reset code which you will enter on the next screen"
                        }
                    />
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
                                            <Image src="/icons/user.svg" alt="image" width={24} height={24} loading='lazy' />
                                        }
                                        name="participant_id"
                                        errors={errors}
                                        touched={touched}
                                    />
                                    <div className="buttons">
                                        <Button
                                            white
                                            // onClick={() => { router.push("/auth/enter-otp/") }}
                                            onClick={() => { router.push("/auth/set-new-pin") }}
                                        >I already have a code</Button>
                                        <Button
                                            blue
                                            disabled={isSubmitting}
                                            type="submit"
                                        >Continue</Button>
                                    </div>
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
        </div>
    )
};

export default ForgotPin;
