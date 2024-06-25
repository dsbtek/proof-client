import * as Yup from 'yup';

//Validation schema for signin
export const signinSchema = Yup.object().shape({
    participant_id: Yup.number().required('Participant ID is required'),
    pin: Yup.number().required('Pin is required'),
});

//Validation schema for forgot pin
export const forgotPinSchema = Yup.object().shape({
    participant_id: Yup.number().required('Participant ID is required'),
});

//Validation schema for otp
export const otpSchema = Yup.object().shape({
    otp: Yup.string().required('OTP is required'),
});

//Validation schema for set pin
export const setPinSchema = Yup.object().shape({
    // pin: Yup.number().required('Pin is required'),
    // confirm_pin: Yup.number().oneOf([Yup.ref('pin')], 'Pin must match').required('Confirm Pin is required'),
});
