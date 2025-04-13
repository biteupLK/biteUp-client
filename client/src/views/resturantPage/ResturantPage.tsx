import React, { useState, useEffect } from "react";
import theme from "../../theme";
import Navbar from "../../components/layOuts/Navbar";
import Loaders from "../../components/Loader.tsx";

import { Box, ThemeProvider } from '@mui/material';
import { AnimatePresence } from 'framer-motion';

const Loader = () => {
    return (
        <Loaders/>
    );
};

const RestaurantPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); 
        
        return () => clearTimeout(timer);
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Navbar/>
            <AnimatePresence>
                {isLoading ? (
                    <Loader />
                ) : (
                    <Box>
                        hi
                    </Box>
                )}
            </AnimatePresence>
        </ThemeProvider>
    );
};

export default RestaurantPage;