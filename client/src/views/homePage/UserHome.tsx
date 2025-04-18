import React, { useState, useEffect } from "react";
import useIsMobile from "../../customHooks/useIsMobile";
import theme from "../../theme";
import {
  ThemeProvider,
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  Paper,
  Stack,
  Fade,
  Slide,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

import SearchIcon from "@mui/icons-material/Search";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PopularRestaurants from "../../components/PopularRestaurants";
import Footer from "../../components/layOuts/Footer.tsx";
import Loaders from "../../components/Loader.tsx";

import kottu from "../../assets/kottu.jpg";
import food from "../../assets/food.jpg";
import Navbar from "../../components/layOuts/Navbar";

//images
import bikerider from "../../assets/homepage/homepageImgwithcricle.png";
import { useQuery } from "@tanstack/react-query";
import { fetchRestaurantData } from "../../api/restaurantApi";

const Loader = () => {
  return <Loaders />;
};

// Animation variants for reuse
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const textReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const Home: React.FC = () => {
  const { isMobile } = useIsMobile();
  const [value, setValue] = React.useState(0);
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);

  const { data: restaurantData, isLoading } = useQuery({
    queryKey: ["restaurant"],
    queryFn: fetchRestaurantData,
  });

  useEffect(() => {
    // Prevent scrolling during loading
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      // Reset scroll position when loading completes
      window.scrollTo(0, 0);
      setLoadingComplete(true);
    }

    const handleHashChange = () => {
      if (window.location.hash === "#search-section") {
        setTimeout(() => {
          document
            .getElementById("search-section")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    };

    // Initial check
    handleHashChange();

    // Add event listener for hash changes
    window.addEventListener("hashchange", handleHashChange);

    // Add scroll event listener
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("scroll", handleScroll);
      document.body.style.overflow = 'auto'; // Cleanup
    };
  }, [isLoading]);

  const deals = [
    {
      title: "30% OFF First Order",
      description: "Use code WELCOME30",
      image: food,
    },
    {
      title: "Free Delivery Weekend",
      description: "No minimum order",
      image: kottu,
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ overflow: "hidden" }}>
        {/* Optimized Loader with improved animation */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1000,
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Loader />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box sx={{ flexGrow: 1, bgcolor: "white", minHeight: "100vh" }}>
            <Navbar />

            <Container
              maxWidth="lg"
              sx={{
                display: "flex",
                alignItems: "center",
                height: "90vh",
                py: 4,
              }}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={4}
                alignItems="center"
                justifyContent="space-between"
                width="100%"
              >
                {/* Text Content with staggered animations */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={staggerChildren}
                  style={{
                    maxWidth: 550,
                    textAlign: isMobile ? "center" : "left",
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  <motion.div variants={textReveal}>
                    <Typography
                      variant="h3"
                      component="h3"
                      gutterBottom
                      sx={{
                        fontWeight: "bold",
                        color: "text.primary",
                        fontSize: isMobile ? "3rem" : "h2.fontSize",
                      }}
                    >
                      Fastest <br />
                      <motion.span
                        initial={{ color: "#000" }}
                        animate={{ color: "#ff9800" }}
                        transition={{
                          duration: 0.8,
                          delay: 0.6,
                        }}
                        style={{ display: "inline-block" }}
                      >
                        Delivery
                      </motion.span>{" "}
                      &, <br />
                      Easy{" "}
                      <motion.span
                        initial={{ color: "#000" }}
                        animate={{ color: "#ff9800" }}
                        transition={{
                          duration: 0.8,
                          delay: 1.2,
                        }}
                        style={{ display: "inline-block" }}
                      >
                        Pickup
                      </motion.span>
                      .
                    </Typography>
                  </motion.div>

                  <motion.div variants={fadeInUp} transition={{ delay: 0.4 }}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      sx={{
                        mb: 10,
                        mt: 5,
                        justifyContent: { xs: "center", md: "flex-start" },
                      }}
                    >
                      {["Order Now", "Check Process"].map((text, index) => (
                        <motion.button
                          key={text}
                          whileHover={{
                            scale: 1.05,
                            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
                          }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.2 + 1.0,
                          }}
                          style={{
                            padding: "12px 24px",
                            borderRadius: 8,
                            backgroundColor:
                              index === 0 ? "black" : "transparent",
                            color: index === 0 ? "white" : "gray",
                            border: index === 0 ? "none" : "1px solid gray",
                            width: isMobile ? "100%" : "auto",
                            cursor: "pointer",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          {text}
                        </motion.button>
                      ))}
                    </Stack>
                  </motion.div>
                </motion.div>

                {/* Image Section with Enhanced Motion Effects */}
                <Box
                  sx={{
                    position: "relative",
                    maxWidth: 500,
                    width: "100%",
                    display: { xs: "none", md: "flex" },
                    justifyContent: "center",
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.8,
                      ease: "easeOut",
                      delay: 0.5,
                    }}
                  >
                    {/* Background circle animation */}
                    <motion.div
                      style={{
                        position: "absolute",
                        borderRadius: "50%",
                        background: "rgba(255, 165, 0, 0.1)",
                        width: "100%",
                        height: "100%",
                        zIndex: -1,
                      }}
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    <motion.div
                      animate={{
                        y: [0, -15, 0],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Box
                        component="img"
                        src={bikerider}
                        alt="Delivery Person"
                        sx={{
                          maxHeight: 500,
                          mt: 5,
                          width: "auto",
                          objectFit: "contain",
                          filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.15))",
                        }}
                      />
                    </motion.div>
                  </motion.div>
                </Box>
              </Stack>
            </Container>

            <Container sx={{ py: 4 }}>
              {/* Hero Section with Search - Animated on scroll */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeInUp}
              >
                <Paper
                  id="search-section"
                  elevation={0}
                  sx={{
                    scrollMarginTop: "100px",
                    mb: 6,
                    textAlign: "center",
                    py: 6,
                    px: 2,
                    backgroundImage:
                      "linear-gradient(to right, rgba(255,255,255,0.95), rgba(255,255,255,0.95)), url(/api/placeholder/1200/300)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "16px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <motion.div variants={textReveal}>
                    <Typography
                      variant={isMobile ? "h4" : "h3"}
                      component="h1"
                      sx={{ fontWeight: 800, mb: 2, color: "#333" }}
                    >
                      Delicious food, delivered{" "}
                      <Box component="span" sx={{ color: "orange" }}>
                        fast {restaurantData?.restaurantName}
                      </Box>
                    </Typography>
                  </motion.div>

                  <motion.div variants={textReveal}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        mb: 4,
                        color: "#666",
                        maxWidth: "600px",
                        mx: "auto",
                      }}
                    >
                      Order from the best local restaurants with easy, on-demand
                      delivery.
                    </Typography>
                  </motion.div>

                  <motion.div
                    variants={fadeInUp}
                    animate={
                      searchFocused
                        ? {
                            scale: 1.02,
                            transition: { duration: 0.3 },
                          }
                        : {}
                    }
                  >
                    <TextField
                      fullWidth
                      placeholder="Search for food or restaurants"
                      variant="outlined"
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <motion.div
                              animate={
                                searchFocused
                                  ? {
                                      rotate: [0, -10, 10, -10, 0],
                                      transition: { duration: 0.5 },
                                    }
                                  : {}
                              }
                            >
                              <SearchIcon
                                sx={{
                                  color: searchFocused ? "orange" : "#9e9e9e",
                                }}
                              />
                            </motion.div>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        maxWidth: "600px",
                        mx: "auto",
                        "& .MuiOutlinedInput-root": {
                          height: "56px",
                          borderRadius: "28px",
                          backgroundColor: "white",
                          boxShadow: searchFocused
                            ? "0 8px 28px rgba(0, 0, 0, 0.15)"
                            : "0 6px 20px rgba(0, 0, 0, 0.20)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.30)",
                          },
                          "&.Mui-focused": {
                            boxShadow: "0 8px 28px rgba(0, 0, 0, 0.15)",
                          },
                          "& fieldset": {
                            border: "none",
                          },
                        },
                        "& .MuiInputBase-input": {
                          padding: "16px 20px 16px 8px",
                        },
                      }}
                    />
                  </motion.div>
                </Paper>
              </motion.div>

              {/* Featured Deals Carousel with improved animations */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeInUp}
              >
                <Box sx={{ mb: 6 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <motion.div
                          animate={{
                            rotate: [0, -10, 0],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 5,
                          }}
                        >
                          <LocalOfferIcon sx={{ mr: 1, color: "green" }} />
                        </motion.div>
                        Featured Deals
                      </Typography>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <Button
                        endIcon={<KeyboardArrowRightIcon />}
                        sx={{ color: "green", fontWeight: 500 }}
                      >
                        View All
                      </Button>
                    </motion.div>
                  </Box>

                  <Grid container spacing={3}>
                    {deals.map((deal, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.15,
                          }}
                        >
                          <motion.div
                            whileHover={{
                              y: -8,
                              boxShadow: "0 15px 30px rgba(0,0,0,0.12)",
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 17,
                            }}
                          >
                            <Card
                              elevation={0}
                              sx={{
                                borderRadius: "16px",
                                overflow: "hidden",
                                border: "1px solid #eee",
                                transition: "all 0.3s ease",
                                height: "100%",
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                              }}
                            >
                              <Box
                                sx={{
                                  width: { xs: "100%", sm: "40%" },
                                  position: "relative",
                                  overflow: "hidden",
                                }}
                              >
                                  <Box
                                    component="img"
                                    src={deal.image}
                                    sx={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                              </Box>

                              <CardContent
                                sx={{
                                  flexGrow: 1,
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  bgcolor: "#fffded",
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  component="h3"
                                  sx={{ fontWeight: 700, color: "#3a4d39" }}
                                >
                                  {deal.title}
                                </Typography>
                                <Typography
                                  variant="body1"
                                  sx={{ color: "#666", mb: 2 }}
                                >
                                  {deal.description}
                                </Typography>
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Button
                                    variant="outlined"
                                    sx={{
                                      borderColor: "#ffa500",
                                      color: "#D46F12",
                                      "&:hover": {
                                        bgcolor: "#ffa500",
                                        color: "white",
                                      },
                                      fontWeight: 500,
                                      alignSelf: "flex-start",
                                      borderRadius: "8px",
                                    }}
                                  >
                                    Get Deal
                                  </Button>
                                </motion.div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </motion.div>

              {/* Popular Restaurants with scroll animation */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={fadeInUp}
              >
                <PopularRestaurants />
              </motion.div>

              {/* Footer with subtle animation */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Footer />
              </motion.div>
            </Container>
          </Box>
        </motion.div>
      </Box>
    </ThemeProvider>
  );
};

export default Home;
