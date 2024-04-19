/* eslint-disable */
import { Box, CircularProgress, Typography } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store';

const styles = {
    screen: {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.8)",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        zIndex: '2'
    },
    circle: {
        color: 'white'
    }
}

export default function PageLoading({ load }: { load: boolean }) {
    const audio = useSelector((state: RootState) => state.chat.typingAudio) as any;
    React.useEffect(() =>  {
        try {
            if (load) {
                audio.play();
            } else {
                audio.pause();
            }
        } catch (err) {
            console.log(err)
        }
    }, [load])
     
    return (
        load ?
            <Box sx={styles.screen}>
                <CircularProgress size='10vh' sx={styles.circle}></CircularProgress>
                <Typography variant='h3' color='white'>One moment please...</Typography>
            </Box>
            :
            <></>
    )
}