import React from 'react';
import { Box, ThemeProvider } from '@mui/material';

import theme from "../../theme"; // Import your Poppins theme
import Navbar from "../../components/layOuts/Navbar";

const FoodsPage: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <Navbar/>
            <Box>
                Foods
            </Box>
        </ThemeProvider>
    );
};

export default FoodsPage;