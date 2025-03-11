import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import {
    homeViewCookie,
    testViewCookie,
    tutorialViewCookie,
    setCookie,
    welcomeCookie,
} from '@/utils/utils';
import * as Sentry from '@sentry/nextjs';

export interface AuthState {
    token: boolean;
    participant_id: number | string;
    pin: number | string;
    loggedOut?: boolean;
}

const initialState: AuthState = {
    token: false,
    participant_id: 0,
    pin: 0,
    loggedOut: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<AuthState>) => {
            state.token = action.payload.token;
            state.participant_id = action.payload.participant_id;
            state.pin = action.payload.pin;
            state.loggedOut = action.payload?.loggedOut;

            const in1Hour = 1 / 24;

            setCookie('token', `${action.payload.token}`, in1Hour);

            if (homeViewCookie === undefined) {
                setCookie('homeView', 'false', 2000);
            }

            if (testViewCookie === undefined) {
                setCookie('testView', 'false', 2000);
            }

            if (tutorialViewCookie === undefined) {
                setCookie('tutsView', 'false', 2000);
            }

            if (welcomeCookie === undefined) {
                setCookie('welView', 'true', 5000);
            }

            // toast.success("Login Successful");
        },
        logout: (state) => {
            state.token = false;
            state.participant_id = 0;
            state.pin = 0;
            state.loggedOut = true;
            Cookies.remove('token');
            Sentry.setUser(null);
            toast.success('Logout Successful');
        },
    },
});

export const authToken = (state: { auth: AuthState }) => state.auth;

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
