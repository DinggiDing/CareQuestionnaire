import { Button, Typography } from "@mui/material/";
import { forwardRef } from "react";

const styles = {
    answerButton: {
        borderRadius: 3,
        color: 'rgba(255,255,255, 0.8)',
        backgroundColor: '#62A1F4',
        textTransform: "none",
        width: '70%',
        "&:hover": {
            backgroundColor: "#62A1F4"
        },
        '&:active': {
            backgroundColor: 'black',
            color: '#CECECE',
        },
    }
} as const;

const AnswerChoice = forwardRef(({ buttonText, onPress }: { buttonText: string, onPress: any }, ref: any) => {

    return (
        <Button variant="contained" onClick={onPress} value={buttonText} ref={ref}
            sx={styles.answerButton}>
            <Typography variant="h4">{buttonText}</Typography>
        </Button>
    )
});

export default AnswerChoice;
