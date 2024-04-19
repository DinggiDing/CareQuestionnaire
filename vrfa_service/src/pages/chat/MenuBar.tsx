/* eslint-disable */
import { IconButton, Grid, Button, Typography } from '@mui/material'
import MenuButton from './MenuButton';
import { ReactComponent as ReviewIcon } from '../../icons/reviewIcon.svg'
import ProgressBar from './ProgressBar';

import "../style/global.css";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateSurvey } from '../../actions/actions';
import { Dispatch } from '@reduxjs/toolkit';


const styles = {
    exitButton: {
        color: 'black',
        width: '100%',
        border: '3px solid black',
    },
    gridItem: {
        padding: '10px',
        display: 'grid',
        justifyItem: 'center',
        justifyContent: 'center',
    },
    gridExit: {
        display: 'grid',
        padding: '10px',
    },
    buttonText: {
        textAlign: "center",
        fontWeight: "bold",
        color: "black"
    }
} as const;

const MenuBar = () => {
    const dispatch = useDispatch<Dispatch<any>>();

    const questionNumber = useSelector((state: RootState) => state.survey.surveyMetadata.questionNumber);
    const totalQuestions = useSelector((state: RootState) => state.survey.surveyMetadata.totalQuestions);

    const navigate = useNavigate();

    function handleExit() {
        speechSynthesis.cancel()
        navigate('/welcome', { state: { start: true } });
    }

    function handleReset() {
        localStorage.clear();
        dispatch(updateSurvey());
        speechSynthesis.cancel()
        navigate('/');
    }

    function reviewCurrentState() {
        speechSynthesis.cancel()
        navigate('/review');
    }

    return (
        <Grid item container direction="column" spacing={{ xs: 2, md: 2 }} >
            <Grid item>
                <ProgressBar value={(questionNumber + 1) * 100 / totalQuestions}></ProgressBar>
            </Grid>
            <Grid item container bgcolor='#F2F2F2'>
                <Grid item style={styles.gridExit} xs={2}>
                    <Button variant="outlined"
                        aria-label="Exit"
                        style={styles.exitButton}
                        onClick={handleExit}>
                        <MenuButton text="Exit"></MenuButton>
                    </Button>
                </Grid>
                <Grid item style={styles.gridExit} xs={2}>
                    <Button variant="outlined"
                        aria-label="Reset"
                        style={styles.exitButton}
                        onClick={handleReset}>
                        <MenuButton text="Reset"></MenuButton>
                    </Button>
                </Grid>
                <Grid item xs={8}>
                    <Grid container direction="row-reverse"
                        spacing={{ xs: 2 }}
                        columns={{ xs: 1 }} >
                        <Grid item style={styles.gridItem}>
                            <IconButton sx={{ transform: 'scale(1.8)' }} aria-label="Review" onClick={reviewCurrentState}>
                                <ReviewIcon></ReviewIcon>
                            </IconButton>
                            <Typography variant='h6' style={styles.buttonText}>REVIEW</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid >
        </Grid >
    );
}
export default MenuBar;
