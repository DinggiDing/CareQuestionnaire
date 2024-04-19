/* eslint-disable no-else-return */
import { createSlice } from '@reduxjs/toolkit';
import { getApp } from "firebase/app";
import { getFunctions, httpsCallable, connectFunctionsEmulator} from "firebase/functions";
import type { AppThunk } from '../store';
import { FormResponse } from '../types/Questionaire';

const slice = createSlice({
  name: 'chat',
  initialState: {
    typingAudio: {}
  },
  reducers: {
    initTypingAudio: (state, action) => {
      state.typingAudio = action.payload
    }
  }
});

export const {
  initTypingAudio
} = slice.actions;

export const { reducer } = slice;

export const generateERFAReport = (formResponse?: FormResponse): AppThunk => async () => {
  if (!formResponse) return;
  try {
    const functions = getFunctions(getApp());
    connectFunctionsEmulator(functions, "localhost", 5001);
    const retreiveFileNameFunc = httpsCallable(functions, 'generateERFAReport');
    console.log(formResponse)
    const retrieveFileNameResponse = await retreiveFileNameFunc(formResponse);
    const fileName = retrieveFileNameResponse.data as string
    return fileName
  } catch (error) {
    console.log("Chat Slice: Issue retrieving pdf name", error);
    throw error;
  }
};

export default slice;
