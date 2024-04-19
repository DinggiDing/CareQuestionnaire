/* eslint-disable */
import React from 'react'
import { Typography, Grid, TextField } from '@mui/material'
import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch } from 'redux';
import { getStorage } from "firebase/storage";
import { initializeApp } from 'firebase/app';
import { createSpeechlySpeechRecognition } from '@speechly/speech-recognition-polyfill';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { firebaseConfig } from "../../config";
import { RenderingState, updateSurvey } from '../../actions/actions';
import { RootState } from '../../store';
import MenuBar from './MenuBar';
import PageLoading from './PageLoading';

import { QUESTION_TO_ICON, normalizeAnswer, wait } from './utils';
import MicFooterIcon from './MicFooterIcon';
import AnswerContainer from './AnswerContainer';
import { useNavigate } from 'react-router-dom';


initializeApp(firebaseConfig);
const storage = getStorage();

const ChatHome = () => {
  const [botText, setBotText] = useState("");
  const [micOn, setMicOn] = useState<Boolean>(false);
  const [botSpeaking, setBotSpeaking] = useState<Boolean>(true);
  const [userWantsMicOn, setUserWantsMicOn] = useState<Boolean>(true);
  const dispatch = useDispatch<Dispatch<any>>();
  const lastVoice = useRef("");
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [userTextInput, setUserTextInput] = useState<string>('');
  const [botThinking, setBotThinking] = useState<boolean>(true);
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const responseStateId = useRef(0)


  const questionNumber = useSelector((state: RootState) => state.survey.surveyMetadata.questionNumber);
  const totalQuestions = useSelector((state: RootState) => state.survey.surveyMetadata.totalQuestions);
  const renderingState = useSelector((state: RootState) => state.survey.surveyMetadata.renderingState);
  const userId = useSelector((state: RootState) => state.survey.surveyMetadata.userId);
  const formState = useSelector((state: RootState) => state.survey.formState);
  const error = useSelector((state: RootState) => state.survey.formState?.error);

  // SPEECH TO TEXT
  const [botVoice, setBotVoice] = useState("");

  const {
    transcript,
    resetTranscript
  } = useSpeechRecognition();

  const navigate = useNavigate();

  const styles = {
    downloadButton: {
      borderRadius: 5,
      color: 'rgba(255,255,255, 0.8)',
      backgroundColor: '#62A1F4',
      justifyContent: 'center',
      textTransform: "none",
      fontSize: "52px",
      margin: "10px",
      width: "100%",
      '&:hover': {
        backgroundColor: 'black',
        color: '#CECECE'
      }
    },
    chatHomeRoot: {
      flexGrow: 1,
    },
    imageBox: {
      justifyContent: "center",
    },
    questionBox: {
      paddingTop: "5%",
      justifyContent: "center",
    },
    image: { objectFit: "scale-down", maxWidth: "80%", height: "auto", },
    textBox: {
      justifyContent: "center",
    },
    footer: {
      direction: "column",
      justifyContent: "flex-end",
      paddingTop: "0"
    }

  } as const;

  /**
   * State listeners. 
   */

  React.useEffect(() => {
    if (transcript && micOn) {
      lastVoice.current = transcript
      checkIfTalking(transcript, responseStateId.current)
    }
  }, [transcript])

  /**  
   * On init. 
   */
  React.useEffect(() => {
    if (!formState?.survey) {
      dispatch(updateSurvey());
    }
  }, [])

  React.useEffect(() => {
    if (error) {
      setBotThinking(false);
    }
  }, [error])

  React.useEffect(() => {
    //console.log(`Form state survey changed: ${JSON.stringify(formState?.survey, null, 2)}`);
    //console.log(`Form new current question number ${JSON.stringify(formState?.currentQuestion, null, 2)}`);
    updateCurrentQuestion();
  }, [formState]);

  /**  
   * This is purely for debugging purposes. 
   */
  React.useEffect(() => {
    console.log(`questionNumber: ${questionNumber}`);
    console.log(`totalQuestions: ${totalQuestions}`)
  }, [questionNumber, totalQuestions])

  /**
   *  Listens for text to speech events. 
   */
  React.useEffect(() => {
    if (botVoice) {
      var msgEvent = new SpeechSynthesisUtterance(botVoice)

      msgEvent.onerror = (event) => {
        console.log(
          `Text to Speech - An error has occurred with the speech synthesis: ${event.error}`
        );
      };
      speechSynthesis.speak(msgEvent);
      _waitToFinishSpeaking();
    }
  }, [botVoice])

  async function _waitToFinishSpeaking() {
    await wait(200);
    if (!speechSynthesis.speaking) {
      setBotSpeaking(false);
    } else {
      window.setTimeout(_waitToFinishSpeaking, 200);
    }
  }

  /** 
   * Handle any changes in microphone. 
   */
  React.useEffect(() => {
    console.log(`Change in microphone ${micOn} so resetting transcript`);
    resetTranscript();
    if (micOn) {
      // If the microphone is listening, cancel any current speech and start listening.
      SpeechRecognition.startListening();
    } else {
      SpeechRecognition.abortListening();
    }
  }, [micOn])

  /**
   * Changes the microphone state based on the conditions if the bot is speaking or silent
   */
  React.useEffect(() => {
    console.log(`userWantsMicOn: ${userWantsMicOn} and botSpeaking ${botSpeaking}`)
    if (!botSpeaking && !botThinking && userWantsMicOn) {
      setMicOn(true);
    } else {
      setMicOn(false);
    }
  }, [userWantsMicOn, botSpeaking, botThinking])

  async function checkIfTalking(oldInput: string, oldStateId: number) {
    await wait(3000);
    if (oldInput == lastVoice.current && oldInput != "" && !botThinking && oldStateId == responseStateId.current) {
      handleAnswer(oldInput);
    }
  }

  /** 
   * Changes the text of the question and speaks the spoken question.
   */
  async function updateCurrentQuestion() {
    if (!formState || !formState.conversation) return;
    setBotThinking(false);

    // There may not be an image.
    try {
      const imageRelativePath = QUESTION_TO_ICON.has(formState?.currentQuestion?.name ?? '') ? QUESTION_TO_ICON.get(formState!.currentQuestion!.name) : null;
      console.log(`Image relative path: ${imageRelativePath}`);
      setImagePath(imageRelativePath);
    } catch (e) {
      console.log(`Error getting image: ${e}`);
      setImagePath(null);
    }

    let formText = '';
    let formVoice = '';

    if (formState?.conversation && formState.conversation.length > 0) {
      formText = formState?.currentQuestion?.displayQuestion ?? '';
      formVoice = _removeQuestionId(formState?.conversation[formState?.conversation.length - 1] ?? '');
    }

    setBotSpeaking(true);
    setBotVoice(formVoice);
    setBotText(formText);

    if (questionNumber >= totalQuestions && formState?.currentQuestion?.currentValue != null) {
      await _waitToFinishSpeaking();
      navigate('/review');
    }
  }

  function _removeQuestionId(input: string): string {
    const regex = /\(id: \d+\)/; // Regular expression to match "(id: X)"
    const result = input.replace(regex, ''); // Replace the matched pattern with an empty string
    return result.trim();
  }

  function handleAnswer(answer?: string) {
    if (!formState) return
    responseStateId.current = responseStateId.current + 1

    if (answer) {
      answer = normalizeAnswer(answer);
    }

    resetInputsAndUpdateSurvey({ answer: answer });
  }

  // TODO: Get rid of this.
  interface AnswerUpdate {
    answer?: string
  }

  function resetInputsAndUpdateSurvey(answerUpdate?: AnswerUpdate) {
    if (answerUpdate?.answer != '') {
      // Clear out all possible ways to answer a question and stop talking. 
      speechSynthesis.cancel();
      setUserTextInput('');

      const newSurveyState = {
        metadata: {
          questionNumber: questionNumber,
          totalQuestions: totalQuestions,
          userResponse: answerUpdate?.answer,
          userId: userId,
        },
        formState: formState,
      };

      setBotThinking(true);
      dispatch(updateSurvey(newSurveyState));
    }
  }

  function handleKeyDown(event: any) {
    if (event.key === 'Enter') {
      speechSynthesis.cancel();
      handleAnswer(userTextInput);
    }
  };

  return (
    <Grid container spacing={{ xs: 2, md: 4 }} sx={styles.chatHomeRoot}>
      {error != null ?
        <Typography variant="h2" textAlign="center" color="red">
          Error: {error}
        </Typography> : <></>}
      <PageLoading load={botThinking || renderingState === RenderingState.LOADING}></PageLoading>
      {demoMode ? <MenuBar /> : <></>}
      <Grid container item direction={"column"} >
        <Typography
          variant="h3"
          textAlign="center"
          color="#0C53B0"
          sx={styles.questionBox}>
          {botText}
        </Typography>
      </Grid>
      {imagePath != null ?
        <Grid item container sx={styles.imageBox}>
          <Grid container item justifyContent={"center"} md={4}>
            <img src={imagePath} style={styles.image}></img>
          </Grid>
        </Grid> : <></>}
      <AnswerContainer
        handleAnswer={handleAnswer}></AnswerContainer>
      <Grid item
        container
        direction="column"
        sx={styles.footer}>
        <MicFooterIcon
          micOn={micOn}
          changeMic={() => setUserWantsMicOn(!userWantsMicOn)}
          transcript={transcript} userWantsMicOn={userWantsMicOn} ></MicFooterIcon>
      </Grid>
    </Grid >
  );
}

export default ChatHome;