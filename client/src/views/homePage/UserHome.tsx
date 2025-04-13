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
  CircularProgress,
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

const Home: React.FC = () => {
  const { isMobile } = useIsMobile();
  const [value, setValue] = React.useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { data: restaurantData, isFetching: isAccidentDataFetching } = useQuery(
    {
      queryKey: ["restaurant"],
      queryFn: fetchRestaurantData,
    }
  );

  useEffect(() => {
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

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  useEffect(() => {
    // Simulate loading time (you can replace this with actual loading logic)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
      <AnimatePresence>
        {isLoading ? (
          <Loader />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ flexGrow: 1, bgcolor: "white", minHeight: "100vh" }}>
              {/* App Bar */}
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
                  {/* Text Content */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                    }}
                    style={{
                      maxWidth: 550,
                      textAlign: isMobile ? "center" : "left",
                      width: isMobile ? "100%" : "auto",
                    }}
                  >
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
                      <Box component="span" sx={{ color: "orange" }}>
                        Delivery
                      </Box>{" "}
                      &, <br />
                      Easy{" "}
                      <Box component="span" sx={{ color: "orange" }}>
                        Pickup
                      </Box>
                      .
                    </Typography>

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
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
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

                  {/* Image Section with Motion Effects */}
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
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut",
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 1, scale: 1 }}
                        animate={{
                          opacity: isMobile ? 0 : 1,
                          scale: isMobile ? 0.8 : 1,
                        }}
                        transition={{
                          duration: 0.5,
                          ease: "easeInOut",
                        }}
                      >
                        <motion.div
                          animate={{
                            y: [0, -10, 0],
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
                            }}
                          />
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </Box>
                </Stack>
              </Container>

              {/* Main Content */}
              <Container sx={{ py: 4 }}>
                {/* Hero Section with Search */}
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
                  }}
                >
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

                  <TextField
                    fullWidth
                    placeholder="Search for food or restaurants"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: "#9e9e9e" }} />
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
                        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.20)",
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
                </Paper>

                {/* Featured Deals Carousel */}
                <Box sx={{ mb: 6 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
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
                      <LocalOfferIcon sx={{ mr: 1, color: "green" }} /> Featured
                      Deals
                    </Typography>
                    <Button
                      endIcon={<KeyboardArrowRightIcon />}
                      sx={{ color: "green", fontWeight: 500 }}
                    >
                      View All
                    </Button>
                  </Box>

                  <Grid container spacing={3}>
                    {deals.map((deal, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Card
                          elevation={0}
                          sx={{
                            borderRadius: "16px",
                            overflow: "hidden",
                            border: "1px solid #eee",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                            },
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
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Popular Restaurants */}
                <PopularRestaurants />

                {/* Footer */}
                <Footer />
              </Container>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </ThemeProvider>
  );
};

export default Home;
