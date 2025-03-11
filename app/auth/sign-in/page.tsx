'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import Crypto from 'crypto-js';
import { appData } from '@/redux/slices/appConfig';
import { TextField, CheckBox, Button, Camera } from '@/components';
import { login } from '@/redux/slices/auth';
import { setAppData, fetchS3Image } from '@/redux/slices/appConfig';
import { signinSchema } from '@/utils/validations';
import { AppDispatch } from '@/redux/store';
import MfaModal from '@/components/modals/mfaModal';
import useResponsive from '@/hooks/useResponsive';
import styles from './sigin.module.css';
import { setProofID } from '@/redux/slices/drugTest';
import * as Sentry from '@sentry/nextjs';

interface SignInType {
    participant_id: number | string;
    pin: number | string;
}

function LoginForm() {
    const landingCookie = Cookies.get('welView');
    const { PROOF_Home_Message, PROOF_Home_Logo } = useSelector(appData);
    const router = useRouter();
    const dispatch = useDispatch();
    const appDispatch = useDispatch<AppDispatch>();
    const [localId, setParticipant_id] = useState('');
    const [localPin, setPin] = useState('');
    const [checked, setChecked] = useState(false);
    const [mfaModal, setMfaModal] = useState(false);
    const [loginRedirect, setLoginRedirect] = useState(false);
    const [loginData, setLoginData] = useState<any>();
    const [mobileNo, setMobileNo] = useState('+2348081608616');
    const isDesktop = useResponsive();

    const initialValues: SignInType = {
        participant_id: '',
        pin: '',
    };

    const handleCheck = () => {
        if (
            checked &&
            localId !== '' &&
            localPin !== '' &&
            typeof window !== 'undefined'
        ) {
            localStorage.removeItem('participant_id');
            localStorage.removeItem('pin');
            setParticipant_id('');
            setPin('');
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
                if (
                    localStorage.getItem('participant_id') === null &&
                    localStorage.getItem('pin') === null
                ) {
                    const encryptedId = Crypto.AES.encrypt(
                        participant_id as string,
                        process.env.NEXT_PUBLIC_SECRET_KEY as string,
                    ).toString();
                    const encryptedPin = Crypto.AES.encrypt(
                        pin as string,
                        process.env.NEXT_PUBLIC_SECRET_KEY as string,
                    ).toString();

                    localStorage.setItem(
                        'participant_id',
                        encryptedId as string,
                    );
                    localStorage.setItem('pin', encryptedPin as string);
                }
            }
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    participant_id:
                        localId !== '' ? localId : (participant_id as string),
                    pin: localPin !== '' ? localPin : (pin as string),
                },
            });

            const data = await response.json();

            if (data.data.statusCode === 200) {
                // setMobileNo(data.data?.mobile_phone || "");
                // setMobileNo("+2348143031312");
                if (data.data?.permissions?.includes('2FA')) {
                    const response = await fetch('/api/mfa', {
                        method: 'POST',

                        body: JSON.stringify({
                            phoneNumber: mobileNo,
                        }),
                    });
                    console.log(response);

                    if (response?.status === 200) {
                        setLoginData({ ...data.data, participant_id });
                        toast.success('otp sent ');
                        setMfaModal(true);
                    } else {
                        toast.error('error sending otp');
                    }
                } else {
                    dispatch(
                        login({
                            token: true,
                            participant_id:
                                localId !== '' ? localId : participant_id,
                            pin: localPin !== '' ? localPin : pin,
                            loggedOut: false,
                        }),
                    );
                    dispatch(setAppData({ ...data.data }));
                    if (data.data.proof_id_value)
                        dispatch(
                            setProofID(
                                data.data.proof_id_value.includes('.png')
                                    ? data.data.proof_id_value
                                    : `${data.data.proof_id_value}.png`,
                            ),
                        );
                    appDispatch(fetchS3Image(data.data.proof_id_value));

                    landingCookie !== undefined && landingCookie === 'true'
                        ? router.push('/')
                        : router.push('/home');
                }
            } else {
                toast.warning(
                    `Error ${data.data.statusCode}: ${data.data.message}`,
                );
            }
        } catch (error) {
            toast.error('Something went wrong');
            console.error(error);
        }
    };

    useEffect(() => {
        if (loginRedirect) {
            dispatch(
                login({
                    token: true,
                    participant_id:
                        localId !== '' ? localId : loginData?.participant_id,
                    pin: localPin !== '' ? localPin : loginData?.pin,
                }),
            );
            if (loginData?.participant_id) {
                Sentry.setUser({
                    id: loginData.participant_id,
                    email: loginData.email,
                });
            }
            dispatch(setAppData({ ...loginData }));
            appDispatch(fetchS3Image(loginData?.proof_id_value));
            landingCookie !== undefined && landingCookie === 'true'
                ? router.push('/')
                : router.push('/home');
        }
    }, [
        appDispatch,
        dispatch,
        landingCookie,
        localId,
        localPin,
        loginData,
        loginRedirect,
        router,
    ]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (
                localStorage.getItem('participant_id') !== null &&
                localStorage.getItem('pin') !== null
            ) {
                const decryptedId = Crypto.AES.decrypt(
                    localStorage.getItem('participant_id') as string,
                    process.env.NEXT_PUBLIC_SECRET_KEY as string,
                ).toString(Crypto.enc.Utf8);
                const decryptedPin = Crypto.AES.decrypt(
                    localStorage.getItem('pin') as string,
                    process.env.NEXT_PUBLIC_SECRET_KEY as string,
                ).toString(Crypto.enc.Utf8);

                setParticipant_id(decryptedId);
                setPin(decryptedPin);

                if (decryptedId !== '' && decryptedPin !== '') {
                    setChecked(true);
                }
            }
        }
    }, []);

    // const sendMail = async () => {
    //   const AIConfig = {
    //     test_review_threshold: 0.5,
    //     test_review_time: 5,
    //     hands_tracking_confidence: 0.5,
    //     hands_detection_confidence: 0.5,
    //     face_model_selection: 0,
    //     face_detection_confidence: 0.5,
    //     noise_filtering_aggressiveness: 1,
    //   };
    //   const response = await fetch("/api/send-email", {
    //     method: "POST",
    //     body: JSON.stringify({
    //       config: AIConfig,
    //       participant_id: "8554443303",
    //       date: "1100hrs",
    //       kit: "1200hrs",
    //       confirmation_no: "111000",
    //       videoLink: `https://proofdata.s3.amazonaws.com/bla`,
    //       face_scan_score: "100%",
    //       detections: detections,
    //     }),
    //   });
    //   const data = await response.json();
    //   console.log("sm data:", data);
    // };

    return (
        // <>
        //   {isDesktop ? "" : ""}
        // </>
        <div className="auth_container">
            <div className="container" style={{ padding: '48px' }}>
                <div className="items-wrap_auth">
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                            minHeight: '10px',
                        }}
                    >
                        <Image
                            className={styles.siginPrLogo}
                            src={PROOF_Home_Logo || '/icons/pr-logo.svg'}
                            alt="image"
                            width={3000}
                            height={3000}
                            priority
                        />
                        <div
                            style={{ marginTop: 'auto', marginBottom: 'auto' }}
                        >
                            <div className="sign-header">
                                <h1>Welcome Back 👋</h1>
                                <p
                                    style={{
                                        fontSize: isDesktop ? '18px' : '12px',
                                        fontWeight: '400',
                                    }}
                                >
                                    Enter your user name and password to access
                                    your account
                                </p>
                            </div>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={
                                    localId === '' ? signinSchema : null
                                }
                                onSubmit={onSubmit}
                            >
                                {({
                                    values,
                                    errors,
                                    touched,
                                    isSubmitting,
                                }) => (
                                    <Form className="gap-item-auth">
                                        <TextField
                                            type="text"
                                            placeholder="Participant ID"
                                            value={
                                                localId !== ''
                                                    ? localId
                                                    : values.participant_id
                                            }
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
                                        <TextField
                                            type="password"
                                            placeholder="Pin"
                                            value={
                                                localPin !== ''
                                                    ? localPin
                                                    : values.pin
                                            }
                                            startIcon={
                                                <Image
                                                    src="/icons/pin-icon.svg"
                                                    alt="image"
                                                    width={24}
                                                    height={24}
                                                    loading="lazy"
                                                />
                                            }
                                            endIcon={true}
                                            name="pin"
                                            errors={errors}
                                            touched={touched}
                                        />
                                        <div className="check-wrap">
                                            <div>
                                                <CheckBox
                                                    label={'Remember me'}
                                                    checked={checked}
                                                    onChange={handleCheck}
                                                />
                                            </div>
                                            <div className="forgot-pin">
                                                <Link href="/auth/forgot-pin">
                                                    Forgot PIN?
                                                </Link>
                                            </div>
                                        </div>
                                        <Button
                                            blue
                                            disabled={isSubmitting}
                                            type="submit"
                                        >
                                            {isSubmitting
                                                ? 'signing in...'
                                                : 'Sign in'}
                                        </Button>
                                        <br />
                                        <Link
                                            href="https://proofapp.my.salesforce-sites.com/New2Proof"
                                            className="links"
                                        >
                                            <Button classname="custom-button-1">
                                                {'New to Proof?'}
                                            </Button>
                                        </Link>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>

                {/* <Button classname="custom-button-1" onClick={sendMail}>{"New to Proof?"}</Button> */}
            </div>
            <div className="wrap-login-img">
                <div
                    className="auth-img"
                    style={{
                        backgroundImage: 'url("../images/login-img.svg")',
                    }}
                ></div>
            </div>

            <MfaModal
                show={mfaModal}
                onClose={() => setMfaModal(false)}
                setLoginRedirect={setLoginRedirect}
                mobilePhone={mobileNo}
            />
        </div>
    );
}

export default LoginForm;
