import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PreTestState {
  preTestScreens: Array<Object>;
  preTestQuestionnaire: Array<Object>;
  preTestFeedback: Array<Object>;
}

const initialState: PreTestState = {
  preTestScreens: [],
  preTestQuestionnaire: [],
  preTestFeedback: [],
};

const appSlice = createSlice({
  name: "preTest",
  initialState,
  reducers: {
    setPreTestScreens: (state, action: PayloadAction<Array<Object>>) => {
      state.preTestScreens = action.payload;
    },
    setPreTestQuestionnaire: (state, action: PayloadAction<Array<Object>>) => {
      state.preTestQuestionnaire = action.payload;
    },
    setPreTestFeedback: (state, action: PayloadAction<Array<Object>>) => {
      state.preTestFeedback = action.payload;
    },
    clearTestData: (state) => {
      state.preTestScreens = [];
      state.preTestQuestionnaire = [];
      state.preTestFeedback = [];
    },
  },
});

export const preTestQuestionnaireData = (state: { preTest: PreTestState }) =>
  state.preTest.preTestQuestionnaire;
export const preTestScreensData = (state: { preTest: PreTestState }) =>
  state.preTest.preTestScreens;
export const preTestFeedbackData = (state: { preTest: PreTestState }) =>
  state.preTest.preTestFeedback;

export const {
  setPreTestScreens,
  setPreTestQuestionnaire,
  clearTestData,
  setPreTestFeedback,
} = appSlice.actions;

export default appSlice.reducer;
