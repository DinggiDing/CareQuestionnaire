/* eslint-disable */
import { Grid, Typography } from '@mui/material'

const styles = {
    questionName: {
        marginRight: '10px',
        fontWeight: "600",
        variant: "body1"
    },
    questionValue: {
        variant: "body1"
    }
} as const;

interface ReviewItemProps {
    questionName: string;
    questionValue: string;
}

const ReviewItem = (props: ReviewItemProps) => {
    return (
        <Grid container >
            <Typography
                sx={styles.questionName}>
                {props.questionName}
            </Typography>
            <Typography
                sx={styles.questionValue}>
                {props.questionValue}
            </Typography>
        </Grid>
    );
}
export default ReviewItem;
