/* eslint-disable */
import { Typography, Button, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { Dispatch } from '@reduxjs/toolkit';
import { updateSurvey } from '../actions/actions';
import PageLoading from './chat/PageLoading';
import { useDispatch } from 'react-redux'
import {initTypingAudio} from '../slices/chat'
import React from 'react'
import { useAuth } from '../hooks/useAuth';
import Box from '@mui/material/Box';

const styles = {
    root: {
        height: '100%',
    }
} as const;

const Welcome = () => {
    const [botThinking, setBotThinking] = React.useState<boolean>(false);
    let audio  = new Audio("type_keyboard.mp3")
    const dispatch = useDispatch<Dispatch<any>>();
    const navigate = useNavigate();
    const { logout } : any = useAuth();


    async function handleContinue() {
        // TODO: Pull this into utility. 
        dispatch(initTypingAudio(audio))
        audio.loop = true
        audio.play()
        audio.pause()
        const hasPermission = await getPermissions() != null;
        localStorage.clear();
        setBotThinking(true)
        dispatch(updateSurvey());
        if (!hasPermission) {
            navigate('/');
        } else {
            navigate('/welcome');
        }
        setBotThinking(false);
    }
    async function getPermissions() {
        return navigator.mediaDevices.getUserMedia({ audio: true });
    }

    return (
        <Box flexDirection={"column"} display="flex" width={"100%"} height={"100%"}>
        <Box marginLeft={"auto"} marginTop={"20px"} marginRight={"20px"}>
          <Button onClick={logout} sx={{"color": "black", "borderColor": "black"}} variant="outlined">Logout</Button>
        </Box>
         <Grid container justifyContent="center" alignItems="center" direction="column" sx={styles.root}>
            <PageLoading load={botThinking}></PageLoading>
            <Button variant="contained" onClick={handleContinue}
                className='big-button'>
                <Typography variant="h3">Enable Microphone</Typography>
            </Button>
        </Grid >
        </Box>
       
    );
}
export default Welcome;