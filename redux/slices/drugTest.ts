import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
    testClip: ""
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
        clearTestData: (state) => {
            state.testingKit = {}
            state.timerObjs = []
            state.testSteps = []
            state.testStepsFiltered = []
            state.testClip = initialState.testClip
            state.signature = ""
            state.startTime = ""
            state.endTime = ""
            state.barcode = ""
        }
    },
});

export const testData = (state: { drugTest: TestState }) => state.drugTest
export const testingKit = (state: { drugTest: TestState }) => state.drugTest.testingKit;

export const { setTestSteps, setKit, setSig, clearTestData, setStartTime, setEndTime, saveTestClip, setUploadStatus, saveBarcode, setFilename, saveConfirmationNo } = appSlice.actions;

export default appSlice.reducer;
