// actions.ts
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { RootState } from '../store';
import { FormState, Question, Section, Survey } from '../types/FormState';
import { SurveyState } from '../slices/surveyReducer';
import { ApiRoute } from './endpoints';
import { v4 as uuidv4 } from 'uuid';

// Actions for SurveyState
const SET_QUESTION_NUMBER = 'SET_QUESTION_NUMBER';
const SET_TOTAL_QUESTIONS = 'SET_TOTAL_QUESTIONS';
const SET_FORM_STATE = 'SET_FORM_STATE';
const SET_REPORT = 'SET_REPORT';
const SET_ERROR = 'SET_ERROR';
const SET_RENDERING_STATE = 'SET_RENDERING_STATE';
const SET_CURRENT_USER_ID = 'SET_CURRENT_USER_ID';


export enum RenderingState {
    LOADING = 'LOADING',
    COMPLETE = 'COMPLETE',
    ERROR = 'ERROR'
}

export interface SurveyAction {
    type: string,
    payload: any
}

export interface SetQuestionNumberAction extends SurveyAction {
    type: typeof SET_QUESTION_NUMBER;
    payload: number;
}

export interface SetTotalQuestionsAction extends SurveyAction {
    type: typeof SET_TOTAL_QUESTIONS;
    payload: number;
}

export interface SetFormState extends SurveyAction {
    type: typeof SET_FORM_STATE;
    payload: FormState
}

export interface SetReport extends SurveyAction {
    type: typeof SET_REPORT;
    payload: { [key: string]: any }
}

export interface SetError extends SurveyAction {
    type: typeof SET_ERROR;
    payload: string
}

export interface SetRenderingState extends SurveyAction {
    type: typeof SET_RENDERING_STATE;
    payload: RenderingState
}

export interface SetUserId extends SurveyAction {
    type: typeof SET_CURRENT_USER_ID;
    payload: string | undefined
}

const setQuestionNumber = (number: number): SetQuestionNumberAction => ({
    type: SET_QUESTION_NUMBER,
    payload: number,
});

const setTotalQuestions = (number: number): SetTotalQuestionsAction => ({
    type: SET_TOTAL_QUESTIONS,
    payload: number,
});

const setFormState = (formState: FormState): SetFormState => ({
    type: SET_FORM_STATE,
    payload: formState,
});

const setReport = (report: Map<string, any>): SetReport => ({
    type: SET_REPORT,
    payload: report,
});

const setUserId = (userId?: string): SetUserId => ({
    type: SET_CURRENT_USER_ID,
    payload: userId,
});

const setError = (error: string): SetError => ({
    type: SET_ERROR,
    payload: error,
});

const setRenderingState = (renderingState: RenderingState): SetRenderingState => ({
    type: SET_RENDERING_STATE,
    payload: renderingState,
});

function convertJsonToQuestion(question: any): Question | undefined {
    if (question == null) return;
    const parsedQuestion = {
        id: question.id,
        name: question.name,
        spokenQuestion: question.spoken_question,
        // Ask to have this removed.
        displayQuestion: question.display_question?.replace(/"/g, ''),
        answerType: question.answer_type,
        answerChoices: question.answer_choices,
        scores: question.scores,
        currentValue: question.current_value
    } as Question;
    return parsedQuestion;
}

function convertJsonToSurveyState(json: any): SurveyState {
    const formState: FormState = {
        conversation: json['conversation'],
        survey: {
            // TODO: Add types here. 
            sections: json.survey?.sections?.map((section: { id: number; name: string; threshold: string; questions: any }) => {
                return {
                    id: section.id,
                    name: section.name,
                    threshold: section.threshold,
                    questions: section.questions.map(convertJsonToQuestion)
                } as Section;
            })
        } as Survey,
        currentQuestion: convertJsonToQuestion(json.current_question),
        currentSection: {
            id: json['current_section_id'],
        } as Section
    }

    return {
        metadata: {
            questionNumber: formState.currentQuestion?.id ?? 1,
            totalQuestions: formState.survey?.sections?.at(-1)?.questions?.at(-1)?.id ?? 1,
            userResponse: '', // Reset user response
            userId: json['current_user_id']
        },
        formState: formState,
    } as SurveyState;
}

// Calls autovrfa library
async function updateVrfaSurvey(survey?: SurveyState): Promise<SurveyState> {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            survey_state: survey,
            user_response: survey?.metadata.userResponse,
            user_id: survey?.metadata.userId ?? uuidv4()
        })
    };

    async function updateVrfaSurveyWithRetry(retryCount: number): Promise<SurveyState> {
        try {
            const res = await fetch(ApiRoute.UPDATE_SURVEY_AUTO_ENDPOINT, requestOptions);
            const result = await res.json();
            console.log(`Got result ${JSON.stringify(result, null, 2)}`);
            // console.log(`Got survey ${JSON.stringify(result['survey'], null, 2)}`);
            // console.log(`Got current question ${JSON.stringify(result['current_question'], null, 2)}`);
            // console.log(`Got conversation ${JSON.stringify(result['conversation'], null, 2)}`);

            return convertJsonToSurveyState(result);
        } catch (error) {
            console.log(`Error updating survey: ${error}`);

            if (retryCount < 2) {
                console.log(`Retrying...`);
                return updateVrfaSurveyWithRetry(retryCount + 1);
            }
            throw error; // Retry limit reached, re-throw the error
        }
    }
    return updateVrfaSurveyWithRetry(0);
}


// Calls autovrfa library
async function getVrfaReport(formState?: FormState): Promise<Map<string, any>> {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            form_state: formState,
            user_id: 'test_user_id'
        })
    };
    return fetch(ApiRoute.GENERATE_REPORT_ENDPOINT, requestOptions)
        .then(res => res.json())
        .then(
            (result: any) => {
                console.log(`Got scores ${JSON.stringify(result, null, 2)}`);
                try {
                    const report: Map<string, any> = new Map();
                    for (const section of formState?.survey?.sections ?? []) {
                        report.set(section.name, result[section.name]);
                    }
                    return report;
                } catch (error) {
                    console.log(`Error parsing scores: ${error}`);
                    throw error;
                }
            },
            (error: Error) => {
                console.log(`Error generating report: ${error} ${error.stack}`);
                throw error;
            }
        );
}

/*
async function _loadFakeSurveyFile(filePath: string): Promise<string> {
    try {
        console.log(`Fetching file ${filePath}`);
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to fetch the file: ${response.status} ${response.statusText}`);
        }
        return await response.text();
    } catch (error) {
        console.error('Error reading the JSON file:', error);
        return '';
    }
}


async function _loadFakeSurveyState(filePath: string): Promise<SurveyState> {
    try {
        const fileContents = await _loadFakeSurveyFile(filePath);
        const parsedJson = JSON.parse(fileContents);
        return convertJsonToSurveyState(parsedJson);
    } catch (error) {
        console.log(`Error parsing file to survey state ${error}`);
        throw new Error(`Error parsing file to survey state ${error}`);
    }
}*/

function updateSurvey(state?: SurveyState): ThunkAction<void, RootState, null, Action<string>> {
    return async (dispatch, _) => {

        try {
            dispatch(setRenderingState(RenderingState.LOADING));

            // Uncomment to load a fake part of the survey.
            //const surveyState = await _loadFakeSurveyState('./fake_data/assistive_devices.json');
            const surveyState = await updateVrfaSurvey(state);

            dispatch(setQuestionNumber(surveyState.metadata.questionNumber));
            dispatch(setTotalQuestions(surveyState.metadata.totalQuestions));
            dispatch(setUserId(surveyState.metadata.userId));

            if (surveyState.formState != null) {
                dispatch(setFormState(surveyState.formState));
            }

            dispatch(setRenderingState(RenderingState.COMPLETE));
        } catch (error) {
            const parsedError = error as Error;
            dispatch(setError(parsedError.message));
        }

    };
}

function generateReport(survey?: FormState): ThunkAction<void, RootState, null, Action<string>> {
    return async (dispatch, _) => {

        try {
            const report = await getVrfaReport(survey);
            dispatch(setReport(report));

        } catch (error) {
            const parsedError = error as Error;
            dispatch(setError(parsedError.message));
        }

    };
}

export {
    SET_QUESTION_NUMBER,
    SET_TOTAL_QUESTIONS,
    SET_FORM_STATE,
    SET_REPORT,
    SET_ERROR,
    SET_RENDERING_STATE,
    SET_CURRENT_USER_ID,
    setQuestionNumber,
    updateSurvey,
    generateReport,
};