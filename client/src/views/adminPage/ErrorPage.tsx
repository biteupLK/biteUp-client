import React from 'react';
import { Box, ThemeProvider } from '@mui/material';
import theme from "../../theme"; // Import your Poppins theme


const ErrorPage: React.FC = () => {
    

    return (
        <ThemeProvider theme={theme}>
            <Box>
                Page Not Found 404:Error
            </Box>
        </ThemeProvider>
    );
};

export default ErrorPage;
