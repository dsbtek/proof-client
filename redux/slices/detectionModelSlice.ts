// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import loadModels from "@/utils/modelContext";
// import faceapi from "face-api.js";

// interface FaceDetectionResult {
//   label: string;
//   confidence: number;
// }

// interface ModelState {
//   faceDetector: FaceDetectionResult | null; // Change this type to a serializable type if possible
//   loading: boolean;
//   error: string | null;
// }

// const initialState: ModelState = {
//   faceDetector: null,
//   loading: false,
//   error: null,
// };

// // Define an async thunk to load models
// export const loadModel = createAsyncThunk("model/loadModel", async () => {
//   const detector = await loadModels();
//   return detector;
// });

// const modelSlice = createSlice({
//   name: "model",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(loadModel.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loadModel.fulfilled, (state, action) => {
//         state.faceDetector = action.payload;
//         state.loading = false;
//       })
//       .addCase(loadModel.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || "Failed to load models";
//       });
//   },
// });

// export const selectFaceDetector = (state: { model: ModelState }) =>
//   state.model.faceDetector;
// export const selectLoading = (state: { model: ModelState }) =>
//   state.model.loading;
// export const selectError = (state: { model: ModelState }) => state.model.error;

// export default modelSlice.reducer;
