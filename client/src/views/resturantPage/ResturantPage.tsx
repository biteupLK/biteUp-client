import React from 'react';
import theme from "../../theme";
import Navbar from "../../components/layOuts/Navbar";
import { Box, ThemeProvider } from '@mui/material';

const RestaurantPage: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <Navbar/>
            <Box>
                hi
            </Box>
        </ThemeProvider>
    );
};

export default RestaurantPage;