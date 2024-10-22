import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { retrieveS3image } from "@/app/identity-profile/action";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

export interface AppState {
  idType: string;
  idFront: string | StaticImport;
  idBack: string;
  facialCapture: string;
  appData: any;
  tutorialData: any;
  idCardFacialPercentageScore: string | undefined;
  scanReport: string;
  reDirectToProofPass: boolean;
  reDirectToBac: boolean;
  userId?: string;
  idFetchError?: string;
  historyData: any;
  proofPassData: any;
  proofPassImages: Array<string>;
  proofPassImageNames: Array<string>;
  extractedFaceImage: string;
  scanReports: Array<{}>;
  userSessionId: string
}

const initialState: AppState = {
  idType: "",
  idFront: "",
  idBack: "",
  facialCapture: "",
  appData: {},
  tutorialData: {},
  idCardFacialPercentageScore: "",
  scanReport: "",
  reDirectToProofPass: false,
  reDirectToBac: false,
  userId: "",
  idFetchError: "",
  historyData: {},
  proofPassData: {},
  proofPassImages: [],
  proofPassImageNames: [],
  extractedFaceImage: "",
  scanReports: [],
  userSessionId: ""
};

export const fetchS3Image = createAsyncThunk(
  "app/fetchS3Image",
  async (proofIdValue: string, { rejectWithValue }) => {
    try {
      // const response = await retrieveS3image(`${proofIdValue}.png`);
      const response = await retrieveS3image(`${proofIdValue}.png`);

      return response as string;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const appSlice = createSlice({
  name: "appConfig",
  initialState,
  reducers: {
    setIDType: (state, action: PayloadAction<string>) => {
      state.idType = action.payload;
    },
    setIDFront: (state, action: PayloadAction<string>) => {
      state.idFront = action.payload;
    },
    setIDBack: (state, action: PayloadAction<string>) => {
      state.idBack = action.payload;
    },
    setAppData: (state, action: PayloadAction<unknown>) => {
      state.appData = action.payload;
    },
    setTutorialData: (state, action: PayloadAction<unknown>) => {
      state.tutorialData = action.payload;
    },
    appDataDump: (state) => {
      state.appData = {};
      state.tutorialData = {};
      state.historyData = {};
    },
    setFacialCapture: (state, action: PayloadAction<string>) => {
      state.facialCapture = action.payload;
    },
    setIdCardFacialPercentageScore: (
      state,
      action: PayloadAction<string | undefined>
    ) => {
      state.idCardFacialPercentageScore = action.payload;
    },
    setReDirectToProofPass: (state, action: PayloadAction<boolean>) => {
      state.reDirectToProofPass = action.payload;
    },
    setReDirectToBac: (state, action: PayloadAction<boolean>) => {
      state.reDirectToBac = action.payload;
    },
    setHistoryData: (state, action: PayloadAction<unknown>) => {
      state.historyData = action.payload;
    },
    setProofPassData: (state, action: PayloadAction<unknown>) => {
      state.proofPassData = action.payload;
    },
    setProofPassImages: (state, action: PayloadAction<Array<string>>) => {
      state.proofPassImages = action.payload;
    },
    setProofPassImageNames: (state, action: PayloadAction<Array<string>>) => {
      state.proofPassImageNames = action.payload;
    },
    setExtractedFaceImage: (state, action: PayloadAction<string>) => {
      state.extractedFaceImage = action.payload;
    },
    setScanReport: (state, action: PayloadAction<{}>) => {
      state.scanReports.push(action.payload);
    },
    removeScanReport: (state, action: PayloadAction<number>) => {
      state.scanReports.splice(action.payload, 1);
    },

    setUserSessionId: (state, action: PayloadAction<string>) => {
      console.log("Updating userSessionId to: ", action.payload);

      state.userSessionId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchS3Image.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.userId = action.payload;
        }
      )
      .addCase(fetchS3Image.rejected, (state, action) => {
        state.idFetchError = action.payload as string;
      });
  },
});

export const appData = (state: { appConfig: AppState }) =>
  state.appConfig.appData;
export const tutorialData = (state: { appConfig: AppState }) =>
  state.appConfig.tutorialData;
export const idType = (state: { appConfig: AppState }) =>
  state.appConfig.idType;
export const idFrontString = (state: { appConfig: AppState }) =>
  state.appConfig.idFront;
export const idBackString = (state: { appConfig: AppState }) =>
  state.appConfig.idBack;
export const FacialCaptureString = (state: { appConfig: AppState }) =>
  state.appConfig.facialCapture;
export const IdCardFacialPercentageScoreString = (state: {
  appConfig: AppState;
}) => state.appConfig.idCardFacialPercentageScore;
export const userIdString = (state: { appConfig: AppState }) =>
  state.appConfig.userId;
export const ScanReportString = (state: { appConfig: AppState }) =>
  state.appConfig.scanReport;
export const ReDirectToProofPass = (state: { appConfig: AppState }) =>
  state.appConfig.reDirectToProofPass;
export const ReDirectToBac = (state: { appConfig: AppState }) =>
  state.appConfig.reDirectToBac;
export const historyData = (state: { appConfig: AppState }) =>
  state.appConfig.historyData;
export const proofPassData_ = (state: { appConfig: AppState }) =>
  state.appConfig.proofPassData;
export const proofPassImages = (state: { appConfig: AppState }) =>
  state.appConfig.proofPassImages;
export const proofPassImageNames = (state: { appConfig: AppState }) =>
  state.appConfig.proofPassImageNames;
export const extractedFaceImageString = (state: { appConfig: AppState }) =>
  state.appConfig.extractedFaceImage;
export const selectScanReports = (state: { appConfig: { scanReports: any } }) =>
  state.appConfig.scanReports;
export const selectUserSessionId = (state: { appConfig: { userSessionId: string } }) =>
  state.appConfig.userSessionId;

export const {
  setIDFront,
  setIDBack,
  setAppData,
  setTutorialData,
  appDataDump,
  setFacialCapture,
  setIdCardFacialPercentageScore,
  setScanReport,
  setReDirectToProofPass,
  setHistoryData,
  setProofPassData,
  setProofPassImages,
  setProofPassImageNames,
  setExtractedFaceImage,
  removeScanReport,
  setReDirectToBac,
  setIDType,
  setUserSessionId
} = appSlice.actions;

export default appSlice.reducer;
