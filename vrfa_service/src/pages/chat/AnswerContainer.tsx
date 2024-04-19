import { Checkbox, FormControl, FormControlLabel, FormGroup, Grid } from "@mui/material/";
import { useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import AnswerChoice from "./AnswerChoice";
import React from "react";

interface AnswerContainerProps {
    handleAnswer: (answer: string) => void;
}

const styles = {
    answerChoicesContainer: {
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    answerChoiceContainer: {
        flex: '1 0 33.33%',
        height: '100px',
        justifyContent: 'center',
        maxWidth: '33.33%',
        padding: '0.5em 0'
    },
    checkBox: {
        ".MuiFormControlLabel-label": {
            fontSize: '1.5em',
        },
        "& .MuiSvgIcon-root": {
            fontSize: '3.5em',
        }
    }
}

const AnswerContainer = ({ handleAnswer }: AnswerContainerProps) => {
    // const SLIDER_QUESTION_NAMES = new Set([]);
    // const NUMBER_INPUT_QUESTION_NAMES = new Set([]);
    const CHECKBOX_ANSWERS = new Set(["assistive_devices"]);

    const answersRef = useRef<typeof AnswerChoice[]>([]);
    const [shouldGoToNextQuestion, setShouldGoToNextQuestion] = useState<boolean>(false);

    // const [numberInput, setNumberInput] = useState<string>('');
    const formState = useSelector((state: RootState) => state.survey.formState);

    const [state, setState] = React.useState({
        Cane: false,
        Walker: false,
        Crutches: false,
        Wheelchair: false,
        Prosthesis: false,
    });

    const {
        Cane,
        Walker,
        Crutches,
        Wheelchair,
        Prosthesis, } = state;

    const CHECKBOX_LABEL_TO_VALUE = useMemo(() => new Map<string, boolean>([
        ['Cane', Cane],
        ['Walker', Walker],
        ['Crutches', Crutches],
        ['Wheelchair', Wheelchair],
        ['Prosthesis', Prosthesis],
    ]), [Cane, Walker, Crutches, Wheelchair, Prosthesis]);


    let checkBoxTimeoutHandlerId: number;

    const handleCheckboxClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [event.target.name]: event.target.checked,
        });

        if (checkBoxTimeoutHandlerId === undefined) {
            checkBoxTimeoutHandlerId = window.setTimeout(function () {
                setShouldGoToNextQuestion(true);
            }, 3000);
        }

        // Reset timer.
        window.clearTimeout(checkBoxTimeoutHandlerId);
        checkBoxTimeoutHandlerId = window.setTimeout(function () {
            setShouldGoToNextQuestion(true);
        }, 3000);

    };

    React.useEffect(() => {
        if (shouldGoToNextQuestion) {
            let response: string[] = [];
            CHECKBOX_LABEL_TO_VALUE.forEach((checked: boolean, answerAsString: string) => {
                if (checked) {
                    response.push(answerAsString);
                }
            });
            handleAnswer(response.join(', '));
            setShouldGoToNextQuestion(false);
        }
    }, [shouldGoToNextQuestion, CHECKBOX_LABEL_TO_VALUE, handleAnswer])

    React.useEffect(() => {
        if (formState?.currentQuestion === undefined) {
            return;
        }

        formState?.currentQuestion?.answerChoices?.map(
            (answer: string) => {
                return answersRef.current.push()
            });
    }, [formState]);

    return (
        CHECKBOX_ANSWERS.has(formState?.currentQuestion?.name ?? '') ?
            <Grid container item sx={styles.answerChoicesContainer}>
                <FormControl component="fieldset">
                    <FormGroup row>
                        {formState?.currentQuestion?.answerChoices?.map((answer: any, index: number) => {
                            let answerAsString = answer.toString();
                            return (<FormControlLabel
                                value={answer}
                                control={
                                    <Checkbox
                                        checked={CHECKBOX_LABEL_TO_VALUE.get(answerAsString)}
                                        onChange={handleCheckboxClick}
                                        name={answerAsString}
                                        sx={styles.checkBox} />
                                }
                                label={answerAsString}
                                labelPlacement="end"
                                sx={styles.checkBox}
                            />);
                        })}
                    </FormGroup>
                </FormControl>
            </Grid>
            :
            <Grid item container sx={styles.answerChoicesContainer}>
                {formState?.currentQuestion?.answerChoices?.map((answer: any, index: number) => {
                    let answerAsString = answer.toString();
                    return (
                        <Grid container item sx={styles.answerChoiceContainer}>
                            <AnswerChoice
                                key={answerAsString} // Adding a unique key for each AnswerChoice
                                buttonText={answerAsString}
                                onPress={() => handleAnswer(answer)}
                                ref={(ref: any) => answersRef.current[index] = ref}
                            />
                        </Grid>
                    );
                })}
            </Grid>
    );
};

export default AnswerContainer;
