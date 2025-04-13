import React, { useState, useEffect } from "react";
import { Box, ThemeProvider } from "@mui/material";

import theme from "../../theme"; // Import your Poppins theme
import Navbar from "../../components/layOuts/Navbar";
import Loaders from "../../components/Loader.tsx";
import { AnimatePresence } from "framer-motion";

const Loader = () => {
  return <Loaders />;
};

const FoodsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <AnimatePresence>
        {isLoading ? <Loader /> : 
        
        <Box>Foods</Box>
        
        }
      </AnimatePresence>
    </ThemeProvider>
  );
};

export default FoodsPage;
