import { combineReducers } from '@reduxjs/toolkit';
import { reducer as chatReducer } from '../slices/chat';
import { reducer as curriculumReducer } from '../slices/curriculum';
import { surveyReducer } from '../slices/surveyReducer';

const rootReducer = combineReducers({
  chat: chatReducer,
  curriculum: curriculumReducer,
  survey: surveyReducer
});

export default rootReducer;
