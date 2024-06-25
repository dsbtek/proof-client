"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { Formik, Form } from 'formik';
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Crypto from "crypto-js";

import { TextField, CheckBox, Button } from "@/components";
import { login } from "@/redux/slices/auth";
import { setAppData, fetchS3Image } from "@/redux/slices/appConfig";
import { signinSchema } from "@/utils/validations";
import { AppDispatch } from "@/redux/store";
interface SignInType {
  participant_id: number | string;
  pin: number | string;
}

function LoginForm() {
  const landingCookie = Cookies.get("welView");
  const router = useRouter();
  const dispatch = useDispatch();
  const appDispatch = useDispatch<AppDispatch>();
  const [localId, setParticipant_id] = useState("");
  const [localPin, setPin] = useState("");
  const [checked, setChecked] = useState(false);

  const initialValues: SignInType = {
    participant_id: "",
    pin: "",
  };

  const handleCheck = () => {
    if (checked && localId !== '' && localPin !== '' && typeof window !== 'undefined') {
      localStorage.removeItem("participant_id");
      localStorage.removeItem("pin");
      setParticipant_id("");
      setPin("");
      setChecked(false);
    } else if (checked && localId === '' && localPin === '') {
      setChecked(false);
    } else {
      setChecked(true);
    }
  };

  const onSubmit = async (values: SignInType) => {
    try {
      const { participant_id, pin } = values;
      if (checked && typeof window !== 'undefined') {
        if (localStorage.getItem("participant_id") === null && localStorage.getItem("pin") === null) {
          const encryptedId = Crypto.AES.encrypt(participant_id as string, process.env.NEXT_PUBLIC_SECRET_KEY as string).toString();
          const encryptedPin = Crypto.AES.encrypt(pin as string, process.env.NEXT_PUBLIC_SECRET_KEY as string).toString();

          localStorage.setItem("participant_id", encryptedId as string);
          localStorage.setItem("pin", encryptedPin as string);
        }
      }
      const response = await fetch("/api/login", {
        method: 'POST',
        headers: {
          participant_id: localId !== '' ? localId : participant_id as string,
          pin: localPin !== '' ? localPin : pin as string
        }
      })

      const data = await response.json();

      if (data.data.statusCode === 200) {
        dispatch(login({ token: true, participant_id: localId !== '' ? localId : participant_id, pin: localPin !== '' ? localPin : pin }));
        dispatch(setAppData({ ...data.data }));
        // appDispatch(fetchS3Image(data.data.proof_id_value));
        appDispatch(fetchS3Image('8554443303-FacialCapture.png'));
        landingCookie !== undefined && landingCookie === 'true' ? router.push("/") : router.push("/home");
      } else {
        toast.warning(`Error ${data.data.statusCode}: ${data.data.message}`);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error)
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem("participant_id") !== null && localStorage.getItem("pin") !== null) {
        const decryptedId = Crypto.AES.decrypt(localStorage.getItem("participant_id") as string, process.env.NEXT_PUBLIC_SECRET_KEY as string).toString(Crypto.enc.Utf8);
        const decryptedPin = Crypto.AES.decrypt(localStorage.getItem("pin") as string, process.env.NEXT_PUBLIC_SECRET_KEY as string).toString(Crypto.enc.Utf8);

        setParticipant_id(decryptedId);
        setPin(decryptedPin);

        if (decryptedId !== '' && decryptedPin !== '') {
          setChecked(true);
        }
      }
    }
  }, [])

  return (
    <div className="container">
      <div className="items-wrap">
        <div className="sign-header">
          <h1>Welcome,</h1>
          <p>Sign in to continue</p>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={localId === '' ? signinSchema : null}
          onSubmit={onSubmit}
        >
          {({ values, errors, touched, isSubmitting }) => (
            <Form>
              <TextField
                type="text"
                placeholder="Participant ID"
                value={localId !== '' ? localId : values.participant_id}
                startIcon={
                  <Image
                    src="/images/person.png"
                    alt="image"
                    width={20}
                    height={20}
                    loading='lazy'
                  />
                }
                name="participant_id"
                errors={errors}
                touched={touched}
              />
              <TextField
                type="password"
                placeholder="Pin"
                value={localPin !== '' ? localPin : values.pin}
                startIcon={
                  <Image src="/images/lock.png" alt="image" width={20} height={20} loading='lazy' />
                }
                endIcon={true}
                name="pin"
                errors={errors}
                touched={touched}
              />
              <div className="check-wrap">
                <div>
                  <CheckBox
                    label={"Remember my login"}
                    checked={checked}
                    onChange={handleCheck}
                  />
                </div>
                <div className="forgot-pin">
                  <Link href="/auth/forgot-pin">Forgot PIN?</Link>
                </div>
              </div>
              <Button
                blue
                disabled={isSubmitting}
                type="submit"
              >{isSubmitting ? 'proof testing...' : 'Sign in'}</Button>
            </Form>
          )}
        </Formik>
      </div>
      <Link className="links" href="/new-to-proof">
        <Button classname="custom-button-1">{"New to Proof?"}</Button>
      </Link>
    </div>
  )
};

export default LoginForm;