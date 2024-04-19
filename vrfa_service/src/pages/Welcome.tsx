/* eslint-disable */
import { Typography, Grid, Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { SurveyMetadata } from '../slices/surveyReducer';
import { RootState } from '../store';
import React from 'react';

import "./style/global.css";
import { useNavigate, useLocation } from 'react-router-dom';
import { wait } from './chat/utils';
import { createSpeechlySpeechRecognition } from '@speechly/speech-recognition-polyfill';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { RenderingState, updateSurvey } from '../actions/actions';
import PageLoading from './chat/PageLoading';
import { Dispatch } from '@reduxjs/toolkit';
import Box from '@mui/material/Box';
import { useAuth } from '../hooks/useAuth';

const WELCOME_TEXT = `Welcome to my care questionnaire!`;
const EXPLAIN_TEXT = `Your answers will help your medical team provide more comprehensive care for you,
which may improve your outcomes. Press or say start to begin`;
const QUESTION_TIME = `~ 20 MINUTES | 47 QUESTIONS`

const styles = {
    tapAnywhereRoot: {
        height: '100%',
        backgroundColor: '#62A1F4',
        color: 'rgba(255,255,255, 0.8)',
    },
    welcomeRoot: {
        height: '100%',
        padding: '5%'
    },
} as const;

const Welcome = () => {
    const [botThinking, setBotThinking] = React.useState<boolean>(false);
    const [buttonPressed, setButtonPressed] = React.useState(false);
    const botRefStarted = React.useRef(false);
    const [readyToContinue, setReadyToContinue] = React.useState(false);
    const { logout }: any = useAuth();

    const surveyMetadata = useSelector<RootState, SurveyMetadata>((state: RootState) => state.survey.surveyMetadata);
    const renderingState = useSelector((state: RootState) => state.survey.surveyMetadata.renderingState);

    const dispatch = useDispatch<Dispatch<any>>();
    const navigate = useNavigate();
    const { state } = useLocation();

    const {
        transcript,
        resetTranscript
    } = useSpeechRecognition();

    React.useEffect(() => {
        goToSuveyStartIfAllowed();
    }, [renderingState]);

    React.useEffect(() => {
        if (readyToContinue) {
            // If you skipped permissions, just load the survey.
            if (!renderingState) {
                dispatch(updateSurvey());
            }
            goToSuveyStartIfAllowed();
        }
    }, [readyToContinue]);

    React.useEffect(() => {
        if (transcript == "start") {
            handleContinue();
        }
    }, [transcript])

    function goToSuveyStartIfAllowed() {
        if (renderingState === RenderingState.COMPLETE && readyToContinue) {
            navigate('/start');
            setBotThinking(false);
        }
    }

    async function handleContinue() {
        if (!buttonPressed) {
            setButtonPressed(true);
            var msgEvent = new SpeechSynthesisUtterance(`${WELCOME_TEXT} ${EXPLAIN_TEXT}`);
            msgEvent.onerror = (event) => {
                console.log(
                    `ERROR: An error has occurred with the speech synthesis: ${event.error}`
                );
            };
            speechSynthesis.speak(msgEvent);
            await _waitToFinishSpeaking();

        } else {
            setReadyToContinue(true);
            setBotThinking(true);
            botRefStarted.current = true;
            resetTranscript();
            speechSynthesis.cancel();
            SpeechRecognition.abortListening();
            goToSuveyStartIfAllowed();
        }
    }

    async function onEnd() {
        console.log(`Text to Speech - Utterance has finished`);
        // Allow for time to finish stating the question.
        if (!botRefStarted.current) {
            SpeechRecognition.startListening();
            console.log("Microphone is on from Welcome Page");
        }
    }

    async function _waitToFinishSpeaking() {
        await wait(200);
        if (!speechSynthesis.speaking) {
            onEnd();
            return;
        } else if (botRefStarted.current) {
            return;
        }
        window.setTimeout(_waitToFinishSpeaking, 200);
    }

    return (
        <Box height={"100%"} style={(!buttonPressed && state == null) ? { backgroundColor: '#62A1F4' } : {}} flexDirection="column" display={"flex"} width={"100%"}>
            <Box marginLeft={"auto"} marginTop={"20px"} marginRight={"20px"}>
                <Button onClick={logout} sx={{ "color": "black", "borderColor": "black" }} variant="outlined">Logout</Button>
            </Box>
            {(!buttonPressed && state == null) ?
                <Grid container
                    onClick={handleContinue}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    sx={styles.tapAnywhereRoot}>
                    <Typography variant="h3">
                        Tap anywhere on the screen to begin
                    </Typography>
                </Grid>
                :
                <Grid container
                    direction="column"
                    justifyContent="center"
                    spacing={{ md: 6 }}
                    sx={styles.welcomeRoot}>
                    <PageLoading load={botThinking}></PageLoading>
                    <Grid item>
                        <Typography variant="h1"
                            textAlign="center">
                            {WELCOME_TEXT}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography
                            variant="h6"
                            textAlign="center">
                            {EXPLAIN_TEXT}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography
                            textAlign="center"
                            fontWeight="bold"
                            color="gray">
                            {state !== null ? `${surveyMetadata.questionNumber} / ${surveyMetadata.totalQuestions} questions completed` : QUESTION_TIME}
                        </Typography>
                    </Grid>
                    <Grid item
                        container
                        alignItems="center"
                        justifyContent="center">
                        <Button variant="contained" onClick={handleContinue}
                            className='big-button'>
                            <Typography variant="h3"> {state !== null ? `Continue` : `Start`}
                            </Typography>
                        </Button>
                    </Grid>
                </Grid>}
        </Box>
    );
}
export default Welcome;