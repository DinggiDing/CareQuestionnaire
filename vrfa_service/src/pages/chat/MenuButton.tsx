/* eslint-disable */
import { Box, Typography } from '@mui/material'

interface MenuButtonProps {
    text: string;
}

const MenuButton = ({ text }: MenuButtonProps) => {
    return (
        <Box>
            <Typography variant="h6"
                textAlign="center"
                fontWeight="bold"
                color="black">
                {text}
            </Typography>
        </Box >
    );
}
export default MenuButton;
