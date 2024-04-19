
import { Box, Typography, LinearProgress, LinearProgressProps, createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material'
import { styled } from '@mui/material'

let fontTheme = createTheme();
fontTheme = responsiveFontSizes(fontTheme);


const CustomLinearProgress = styled(LinearProgress)<LinearProgressProps>(() => ({
    height: '20px',
    "&.MuiLinearProgress-colorPrimary:not(.MuiLinearProgress-buffer)": {
        backgroundColor: "#F2F2F2"
    },
    "& .MuiLinearProgress-colorPrimary": {
        backgroundColor: "#F2F2F2"
    },
    "& .MuiLinearProgress-barColorPrimary": {
        backgroundColor: "#959595"
    },
}));


const styles = {
    root: {
        padding: '0',
        display: 'flex',
        flexDirection: 'row',
    },
    bar: {
        width: '95%',
        padding: '0',
    },
    label: {
        width: '5%',
        padding: '0',
        backgroundColor: '#F2F2F2',
    }
} as const;

interface ProgressBarProps {
    value: number
}


export default function ProgressBar({ value }: ProgressBarProps) {
    return (
        <Box sx={styles.root}>
            <Box sx={styles.bar}>
                <CustomLinearProgress color='primary' variant='determinate' value={value} />
            </Box>
            <Box sx={styles.label}>
                <ThemeProvider theme={fontTheme}>
                    <Typography variant="body2" fontWeight='bold' color='#959595'>{`${Math.round(
                        value,
                    )}%`}</Typography>
                </ThemeProvider>
            </Box>
        </Box>
    )
}
