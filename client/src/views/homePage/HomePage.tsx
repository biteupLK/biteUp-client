import React, { useState } from "react";
import useIsMobile from "../../customHooks/useIsMobile";
import theme from "../../theme"; // Import your Poppins theme
import {
  ThemeProvider,
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Paper,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";

import RestaurantIcon from "@mui/icons-material/Restaurant";
import SearchIcon from "@mui/icons-material/Search";
import LocalPizzaIcon from "@mui/icons-material/LocalPizza";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import RamenDiningIcon from "@mui/icons-material/RamenDining";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";


import burger from "../../assets/burger.jpg";
import pizza from "../../assets/pizza.jpg";
import noodles from "../../assets/noodles.jpg";
import kottu from "../../assets/kottu.jpg";
import food from "../../assets/food.jpg";
import screen from "../../assets/screen.jpg";
import Navbar from "../../components/layOuts/Navbar";



const Home: React.FC = () => {
  const { isMobile } = useIsMobile();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const foodCategories = [
    { name: "Pizza", icon: <LocalPizzaIcon /> },
    { name: "Burgers", icon: <FastfoodIcon /> },
    { name: "Asian", icon: <RamenDiningIcon /> },
    { name: "Cafe", icon: <LocalCafeIcon /> },
    { name: "Breakfast", icon: <EmojiFoodBeverageIcon /> },
    { name: "All", icon: <RestaurantIcon /> },
  ];

  const popularRestaurants = [
    {
      name: "Burger Joint",
      rating: 4.8,
      time: "20-30 min",
      image: burger,
      tags: ["Burgers", "American"],
      promotion: "20% OFF",
      featured: true,
    },
    {
      name: "Pizza Plaza",
      rating: 4.7,
      time: "25-35 min",
      image: pizza,
      tags: ["Pizza", "Italian"],
    },
    {
      name: "Noodle House",
      rating: 4.9,
      time: "15-25 min",
      image: noodles,
      tags: ["Asian", "Noodles"],
      promotion: "Free Delivery",
    },
    {
      name: "Green Garden",
      rating: 4.6,
      time: "20-30 min",
      image: kottu,
      tags: ["Healthy", "Salads"],
    },
  ];

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
      <Box sx={{ flexGrow: 1, bgcolor: "white", minHeight: "100vh" }}>
        {/* App Bar */}
        <Navbar/>

        

        {/* Main Content */}
        <Container sx={{ py: 4 }}>
          {/* Hero Section with Search */}
          <Paper
            elevation={0}
            sx={{
              mb: 6,
              textAlign: "center",
              py: 6,
              px: 2,
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.95), rgba(255,255,255,0.95)), url(/api/placeholder/1200/300)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "16px",
              border: "1px solid #eee",
            }}
          >
            <Typography
              variant={isMobile ? "h4" : "h3"}
              component="h1"
              sx={{ fontWeight: 800, mb: 2, color: "#333" }}
            >
              Delicious food, delivered{" "}
              <Box component="span" sx={{ color: "#FF4757" }}>
                fast
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
                    <SearchIcon sx={{ color: "#FF4757" }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "12px",
                  maxWidth: "600px",
                  mx: "auto",
                  bgcolor: "white",
                  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.05)",
                  "& fieldset": { border: "none" },
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
                sx={{ fontWeight: 700, display: "flex", alignItems: "center" }}
              >
                <LocalOfferIcon sx={{ mr: 1, color: "#FF4757" }} /> Featured
                Deals
              </Typography>
              <Button
                endIcon={<KeyboardArrowRightIcon />}
                sx={{ color: "#FF4757", fontWeight: 500 }}
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
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{ fontWeight: 700, color: "#FF4757" }}
                      >
                        {deal.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#666", mb: 2 }}>
                        {deal.description}
                      </Typography>
                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: "#FF4757",
                          color: "#FF4757",
                          "&:hover": { bgcolor: "rgba(255,71,87,0.1)" },
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

          {/* Categories Tabs Section */}
          <Box sx={{ mb: 6 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: "#FF4757",
                },
                "& .MuiTab-root.Mui-selected": {
                  color: "#FF4757",
                  fontWeight: 600,
                },
                mb: 3,
                borderBottom: "1px solid #eee",
              }}
            >
              {foodCategories.map((category, index) => (
                <Tab
                  key={index}
                  icon={category.icon}
                  label={category.name}
                  iconPosition="start"
                  sx={{ textTransform: "none", fontWeight: 500 }}
                />
              ))}
            </Tabs>
          </Box>

          {/* Popular Restaurants */}
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
                sx={{ fontWeight: 700, display: "flex", alignItems: "center" }}
              >
                <RestaurantIcon sx={{ mr: 1, color: "#FF4757" }} /> Popular
                Restaurants
              </Typography>
              <Button
                endIcon={<KeyboardArrowRightIcon />}
                sx={{ color: "#FF4757", fontWeight: 500 }}
              >
                View All
              </Button>
            </Box>

            <Grid container spacing={3}>
              {popularRestaurants.map((restaurant, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
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
                      position: "relative",
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <Box
                        component="img"
                        src={restaurant.image}
                        sx={{
                          width: "100%",
                          height: 160,
                          objectFit: "cover",
                        }}
                      />
                      {restaurant.promotion && (
                        <Chip
                          label={restaurant.promotion}
                          sx={{
                            position: "absolute",
                            top: 10,
                            left: 10,
                            bgcolor: "#FF4757",
                            color: "white",
                            fontWeight: 600,
                          }}
                          size="small"
                        />
                      )}
                      <Chip
                        label={`${restaurant.rating} ★`}
                        sx={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          bgcolor: "white",
                          fontWeight: 600,
                          color: "#FF9800",
                        }}
                        size="small"
                      />
                      <IconButton
                        sx={{
                          position: "absolute",
                          bottom: -20,
                          right: 10,
                          bgcolor: "white",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          "&:hover": { bgcolor: "#fff0f0" },
                        }}
                        size="small"
                      >
                        <FavoriteIcon
                          sx={{ color: "#FF4757" }}
                          fontSize="small"
                        />
                      </IconButton>
                    </Box>
                    <CardContent sx={{ pt: 3 }}>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{ fontWeight: 600 }}
                      >
                        {restaurant.name}
                        {restaurant.featured && (
                          <Box
                            component="span"
                            sx={{ ml: 1, display: "inline-block" }}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="#FF4757"
                            >
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          </Box>
                        )}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "#666",
                          mb: 1,
                        }}
                      >
                        <AccessTimeIcon
                          sx={{ fontSize: "0.9rem", mr: 0.5, color: "#98A2B3" }}
                        />
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          {restaurant.time}
                        </Typography>
                        <Box
                          sx={{ mx: 1, fontSize: "0.5rem", color: "#98A2B3" }}
                        >
                          •
                        </Box>
                        <DeliveryDiningIcon
                          sx={{ fontSize: "0.9rem", mr: 0.5, color: "#98A2B3" }}
                        />
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          Free delivery
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                        {restaurant.tags.map((tag, i) => (
                          <Chip
                            key={i}
                            label={tag}
                            size="small"
                            sx={{
                              bgcolor: "#f0f0f0",
                              color: "#666",
                              fontWeight: 500,
                            }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Download App CTA */}
          <Card
            elevation={0}
            sx={{
              borderRadius: "24px",
              mb: 6,
              background: "linear-gradient(135deg, #FF4757 0%, #FF7B69 100%)",
              color: "white",
              overflow: "hidden",
              border: "none",
              boxShadow: "0 10px 30px rgba(255, 71, 87, 0.3)",
            }}
          >
            <Grid container>
              <Grid item xs={12} md={7}>
                <CardContent sx={{ p: { xs: 4, md: 5 } }}>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{ fontWeight: 800, mb: 2 }}
                  >
                    Download the FoodGo app
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                    Get exclusive deals and faster ordering with our mobile app.
                    Plus, enjoy special offers only available to app users!
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: "white",
                        color: "#FF4757",
                        "&:hover": { bgcolor: "#f0f0f0" },
                        borderRadius: "12px",
                        fontWeight: 600,
                        px: 3,
                      }}
                    >
                      App Store
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: "white",
                        color: "white",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                        borderRadius: "12px",
                        fontWeight: 600,
                        px: 3,
                      }}
                    >
                      Google Play
                    </Button>
                  </Box>
                </CardContent>
              </Grid>
              <Grid
                item
                xs={12}
                md={5}
                sx={{
                  display: { xs: "none", md: "block" },
                  position: "relative",
                }}
              >
                <Box
                  component="img"
                  src={screen}
                  alt="Mobile app screenshot"
                  sx={{
                    width: "110%",
                    height: "120%",
                    objectFit: "cover",
                    position: "absolute",
                    bottom: "-10%",
                    right: "-5%",
                    transform: "rotate(-5deg)",
                    borderRadius: "24px",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
                  }}
                />
              </Grid>
            </Grid>
          </Card>

          {/* Footer */}
          <Box sx={{ pt: 4, pb: 8, textAlign: "center" }}>
            <Divider sx={{ mb: 4 }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#FF4757", mb: 2 }}
            >
              <RestaurantIcon sx={{ mr: 1, transform: "rotate(45deg)" }} />
              FoodGo
            </Typography>
            <Typography variant="body2" sx={{ color: "#666", mb: 2 }}>
              © 2025 FoodGo. All rights reserved.
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button sx={{ color: "#666" }}>About Us</Button>
              <Button sx={{ color: "#666" }}>Privacy</Button>
              <Button sx={{ color: "#666" }}>Terms</Button>
              <Button sx={{ color: "#666" }}>Help</Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Home;
