import React from 'react';
import { Box, ThemeProvider } from '@mui/material';

import theme from "../../theme"; // Import your Poppins theme
import Navbar from "../../components/layOuts/Navbar";

const Error: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <Navbar/>
            <Box>
                Error
            </Box>
        </ThemeProvider>
    );
};

export default Error;