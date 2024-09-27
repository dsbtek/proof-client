import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type IdDetails = {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
};

export type AIConfig = {
    test_review_threshold: number;
    test_review_time: number;
    hands_tracking_confidence: number;
    hands_detection_confidence: number;
    face_model_selection: number;
    face_detection_confidence: number;
    noise_filtering_aggressiveness: number;
};

export interface TestState {
    testingKit: any;
    testSteps: any[];
    testStepsFiltered: any[];
    timerObjs: any[];
    startTime: string;
    endTime: string;
    uploading: boolean | undefined;
    filename: string;
    barcode: string;
    confirmationNo: string;
    signature: string;
    testClip: string;
    storage: string;
    lookAway: string;
    handsOut: string;
    trackingNumber: string;
    shippingLabel: string;
    barcodeKit: string;
    detectKit: string;
    proofId: string;
    faceCompare: string;
    faceScans: { [key: string]: string }[];
    imageCaptures: string[];
    passport: string;
    governmentID: string;
    idDetails: IdDetails;
    AIConfig: AIConfig;
}

const initialState: TestState = {
    testingKit: {},
    testSteps: [],
    testStepsFiltered: [],
    timerObjs: [],
    startTime: "",
    endTime: "",
    uploading: undefined,
    filename: '',
    barcode: "",
    confirmationNo: "",
    signature: "",
    testClip: "",
    storage: "",
    lookAway: "",
    handsOut: "",
    trackingNumber: "",
    shippingLabel: "",
    barcodeKit: "",
    detectKit: "",
    proofId: "",
    faceCompare: "",
    faceScans: [],
    imageCaptures: [],
    passport: "",
    governmentID: "",
    idDetails: {
        first_name: "",
        last_name: "",
        date_of_birth: "",
        address: "",
        city: "",
        state: "",
        zipcode: "",
    },
    AIConfig: {
        test_review_threshold: 0.5,
        test_review_time: 5,
        hands_tracking_confidence: 0.5,
        hands_detection_confidence: 0.5,
        face_model_selection: 0,
        face_detection_confidence: 0.5,
        noise_filtering_aggressiveness: 1,
    }
};

const appSlice = createSlice({
    name: "drugTest",
    initialState,
    reducers: {
        setTestSteps: (state, action: PayloadAction<any[]>) => {
            state.timerObjs = action.payload.filter((step) => step.step === null);
            if (state.timerObjs.length > 0) {
                state.testStepsFiltered = action.payload.filter((step) => step.step !== null);
            } else {
                state.testSteps = action.payload;
            }
        },
        setKit: (state, action: PayloadAction<any>) => {
            state.testSteps = [];
            state.testStepsFiltered = [];
            state.testingKit = action.payload;
        },
        setSig: (state, action: PayloadAction<string>) => {
            state.signature = action.payload;
        },
        setStartTime: (state, action: PayloadAction<string>) => {
            state.startTime = action.payload;
        },
        setEndTime: (state, action: PayloadAction<string>) => {
            state.endTime = action.payload;
        },
        saveTestClip: (state, action: PayloadAction<string>) => {
            state.testClip = action.payload;
        },
        setUploadStatus: (state, action: PayloadAction<boolean | undefined>) => {
            state.uploading = action.payload;
        },
        saveBarcode: (state, action: PayloadAction<string>) => {
            state.barcode = action.payload;
        },
        saveConfirmationNo: (state, action: PayloadAction<string>) => {
            state.confirmationNo = action.payload;
        },
        setFilename: (state, action: PayloadAction<string>) => {
            state.filename = action.payload
        },
        setStorage: (state, action: PayloadAction<string>) => {
            state.storage = action.payload
        },
        setLookAway: (state, action: PayloadAction<string>) => {
            state.lookAway = action.payload
        },
        setHandsOut: (state, action: PayloadAction<string>) => {
            state.handsOut = action.payload
        },
        setTrackingNumber: (state, action: PayloadAction<string>) => {
            state.trackingNumber = action.payload
        },
        setShippingLabel: (state, action: PayloadAction<string>) => {
            state.shippingLabel = action.payload
        },
        setBarcodeKit: (state, action: PayloadAction<string>) => {
            state.barcodeKit = action.payload
        },
        setDetectKit: (state, action: PayloadAction<string>) => {
            state.detectKit = action.payload
        },
        setProofID: (state, action: PayloadAction<string>) => {
            state.proofId = action.payload
        },
        setFaceCompare: (state, action: PayloadAction<string>) => {
            state.faceCompare = action.payload
        },
        setFaceScans: (state, action: PayloadAction<{ [key: string]: string }>) => {
            state.faceScans.push(action.payload);
        },
        setImageCaptures: (state, action: PayloadAction<string>) => {
            state.imageCaptures.push(action.payload);
        },
        setPassport: (state, action: PayloadAction<string>) => {
            state.passport = action.payload
        },
        setGovernmentID: (state, action: PayloadAction<string>) => {
            state.governmentID = action.payload
        },
        setIdDetails: (state, action: PayloadAction<IdDetails>) => {
            state.idDetails = action.payload
        },
        setAIConfig: (state, action: PayloadAction<AIConfig>) => {
            state.AIConfig = action.payload
        },
        clearTestData: (state) => {
            state = initialState;
        }
    },
});

export const testData = (state: { drugTest: TestState }) => state.drugTest
export const testingKit = (state: { drugTest: TestState }) => state.drugTest.testingKit;

export const { setTestSteps, setKit, setSig, clearTestData, setStartTime, setEndTime, saveTestClip, setUploadStatus, saveBarcode, setFilename, saveConfirmationNo, setTrackingNumber, setShippingLabel, setBarcodeKit, setDetectKit, setProofID, setFaceCompare, setFaceScans, setImageCaptures, setPassport, setGovernmentID, setIdDetails, setStorage, setHandsOut, setLookAway, setAIConfig } = appSlice.actions;

export default appSlice.reducer;
