/* eslint-disable no-else-return */
import { combineReducers } from '@reduxjs/toolkit';
import { RenderingState, SET_CURRENT_USER_ID, SET_ERROR, SET_FORM_STATE, SET_QUESTION_NUMBER, SET_RENDERING_STATE, SET_REPORT, SET_TOTAL_QUESTIONS, SurveyAction } from '../actions/actions';
import { FormState } from '../types/FormState';

const initialMetadata: SurveyMetadata = {
    questionNumber: 1,
    totalQuestions: 47
};

const initialFormState: FormState = {};

export interface SurveyMetadata {
    questionNumber: number;
    totalQuestions: number;
    userResponse?: string;
    userId?: string;
    report?: Map<string, any>;
    renderingState?: RenderingState;
}

export interface SurveyState {
    metadata: SurveyMetadata,
    formState?: FormState;
}

const metadataReducer = (state: SurveyMetadata = initialMetadata, action: SurveyAction): SurveyMetadata => {
    switch (action.type) {
        case SET_QUESTION_NUMBER:
            return {
                ...state,
                questionNumber: action.payload,
            };
        case SET_TOTAL_QUESTIONS:
            return {
                ...state,
                totalQuestions: action.payload,
            };
        case SET_REPORT:
            return {
                ...state,
                report: action.payload,
            };
        case SET_RENDERING_STATE:
            return {
                ...state,
                renderingState: action.payload,
            };
        case SET_CURRENT_USER_ID:
            return {
                ...state,
                userId: action.payload,
            };
        default:
            return state;
    }
};

const formReducer = (state: FormState = initialFormState, action: SurveyAction): FormState => {
    switch (action.type) {
        case SET_FORM_STATE:
            return {
                ...state,
                survey: action.payload.survey,
                conversation: action.payload.conversation,
                currentQuestion: action.payload.currentQuestion,
                currentSection: action.payload.currentSection
            };
        case SET_ERROR:
            return {
                ...state,
                error: action.payload.error
            };
        default:
            return state;
    }
};


const surveyReducer = combineReducers({
    surveyMetadata: metadataReducer,
    formState: formReducer,
})

export { surveyReducer };