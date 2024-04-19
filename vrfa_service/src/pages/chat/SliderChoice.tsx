import { Slider } from "@mui/material"
import AnswerChoice from "./AnswerChoice";

const styles = {
    slider: {
        height: '25px',
        "& .MuiSlider-thumb": { height: '30px', width: '30px' },
        "& .MuiSlider-track": {
            color: '#C2D7F3'
        },
        "& .MuiSlider-rail": {
            color: '#C2D7F3',
            opacity: '100%'
        },
        "& span.MuiSlider-markLabel": {
            fontSize: '1.5em',
            textWrap: 'wrap',
            maxWidth: '175px',
        },
        "& span.MuiSlider-markLabel.MuiSlider-markLabelActive": {
            fontSize: '1.5em',
            textWrap: 'wrap',
            maxWidth: '175px',
        }
    }
}

const FUNCTIONAL_CAPACITY_MARKS = [
    { value: 30, label: '30%' },
    { value: 40, label: '40%' },
    { value: 50, label: '50%' },
    { value: 60, label: '60%' },
    { value: 70, label: '70%' },
    { value: 80, label: '80%' },
    { value: 90, label: '90%' },
    { value: 100, label: '100%' }
]


interface SliderChoiceProps {
    handleAnswer: (answer: string) => void;
    answerChoices?: string[];
}

function getLabelForValue(marks: Array<{ label?: any, value: number }>, value: number) {
    return marks.find(o => o.label === value)?.label;
}

function getMarks(answerChoices?: string[]): Array<{ label?: any, value: number }> {
    if (answerChoices === undefined || answerChoices?.length === 0) {
        return FUNCTIONAL_CAPACITY_MARKS;
    }
    let marks = new Array<{ label?: any, value: number }>();
    answerChoices.forEach((answer, index) => {
        marks.push({ value: (index + 1) * 10, label: `${answer}` });
    });
    return marks;
}

const SliderChoice = ({ handleAnswer, answerChoices }: SliderChoiceProps) => {
    let marks = getMarks(answerChoices);
    let maxMark = marks.length - 1;
    console.log(marks);

    return (
        <Slider sx={styles.slider}
            size='medium'
            defaultValue={0}
            step={10}
            marks={marks}
            min={marks[0].value}
            max={marks[maxMark].value}
            valueLabelDisplay="off"
            onChangeCommitted={(event: any, value: any) => { handleAnswer(`${getLabelForValue(marks, value)}`) }}>
        </Slider>
    )
};

export default SliderChoice;