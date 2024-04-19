/* eslint-disable */
import { Box, Button, Grid, Typography } from '@mui/material'

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import React from 'react';
import { Dispatch } from '@reduxjs/toolkit';
import { generateReport } from '../../actions/actions';
import ReviewItem from './ReviewItem';
import MenuButton from '../chat/MenuButton';
import jsPDF from 'jspdf';


const styles = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        mx: '30px'
    },
    section: {
        minHeight: '25 %',
    },
    sectionName: {
        color: "#0C53B0",
        variant: "h4",
    },
    questionName: {
        marginRight: '10px',
        fontWeight: "600",
        variant: "body1"
    },
    questionValue: {
        variant: "body1"
    },
    exportButton: {
        color: 'black',
        width: '100%',
        border: '3px solid black',
        marginTop: '15px',
    },
} as const;

const ReviewSurvey = () => {
    const dispatch = useDispatch<Dispatch<any>>();

    const formState = useSelector((state: RootState) => state.survey.formState);
    const report: Map<string, any> | undefined = useSelector((state: RootState) => state.survey.surveyMetadata.report);

    React.useEffect(() => {
        console.log(`Form state in review: ${JSON.stringify(formState)}`);
    }, [formState]);

    React.useEffect(() => {
        console.log(`Report in review: ${JSON.stringify(typeof report)}`);
    }, [report]);

    /**  
       * On init. 
       */
    React.useEffect(() => {
        console.log(`Generating report`);
        dispatch(generateReport(formState));
    }, [])

    function getScore(sectionName: string) {
        // This instanceof hack is so weird, I don't know why it's necessary.
        if (!report || !(report instanceof Map) || !report.has(sectionName)) {
            return <></>;
        };
        return <Typography
            variant="subtitle1"
            color="#0C53B0">
            score: {report.get(sectionName)}
        </Typography>;
    }

    function getImpairmentThreshold(sectionName: string) {
        if (!report || !(report instanceof Map) || !report.has(sectionName)) {
            return <></>;
        };
        return <Typography
            variant="subtitle1"
            color="#0C53B0">
            impairment threshold: {formState.survey?.sections?.find(section => section.name == sectionName)?.threshold}
        </Typography>;
    }

    function getSurveyDate() {
        const myDate = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });
        return formatter.format(myDate);
    }

    async function handleExport() {
        console.log('Handle export');
        const pdf = new jsPDF("landscape", "pt", [1194, 834]);
        const data = document.querySelector("#report") as HTMLElement;
        pdf.html(data).then(() => {
            pdf.save("report.pdf");
        });

    }

    return (
        report !== undefined ?
            <Grid id="report" sx={styles.root} container direction="column" alignItems="flex-start">
                <Typography variant="h2">
                    Electronic Rapid Fitness Assessment (eRFA) Report
                </Typography>
                <Grid item>
                    <Typography variant="h4" color="#0C53B0">
                        Patient
                    </Typography>
                    <ReviewItem questionName='Survey date' questionValue={getSurveyDate()}></ReviewItem>
                </Grid>
                <Grid container direction={'column'} spacing={{ xs: 2, md: 6 }}>
                    {formState?.survey?.sections?.map((section, index) => (
                        <Grid item key={index} sx={styles.section}>
                            <Typography variant="h4" sx={styles.sectionName}>
                                {section.name}
                            </Typography>
                            {section.questions?.map((question, questionIndex) => (
                                <ReviewItem key={questionIndex} questionName={question.name.replace(/_/g, ' ')} questionValue={question.currentValue}></ReviewItem>
                            ))}
                            {getScore(section.name)}
                            {getImpairmentThreshold(section.name)}
                        </Grid >
                    ))
                    }
                </Grid>
                <Grid item>
                    <Button variant="outlined"
                        aria-label="Exit"
                        style={styles.exportButton}
                        onClick={handleExport}>
                        <MenuButton text="Export"></MenuButton>
                    </Button>
                </Grid>
            </Grid > : <></>
    );
}
export default ReviewSurvey;
