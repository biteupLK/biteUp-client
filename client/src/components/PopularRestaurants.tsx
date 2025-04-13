import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  AppBar,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
} from "@mui/material";
import {
  Restaurant as RestaurantIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  Fastfood as FastfoodIcon,
  RamenDining as RamenDiningIcon,
  Icecream as IcecreamIcon,
  Spa as SpaIcon,
  AccessTime as AccessTimeIcon,
  DeliveryDining as DeliveryDiningIcon,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";
import { styled } from '@mui/material/styles';

import burger from "../assets/burger.jpg";
import pizza from "../assets/pizza.jpg";
import noodles from "../assets/noodles.jpg";
import kottu from "../assets/kottu.jpg";
import food from "../assets/food.jpg";
import screen from "../assets/screen.jpg";

interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  time: string;
  tags: string[];
  promotion?: string;
  featured?: boolean;
  category: "fast-food" | "asian" | "desserts" | "healthy";
}

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const StyledTabs = styled(Tabs)({
  '& .MuiTabs-indicator': {
    height: '4px',
    borderRadius: '2px',
    backgroundColor: 'green',
    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  },
});

// Styled component for animated cards
const AnimatedCard = styled(Card)(({ theme }) => ({
  borderRadius: "16px",
  overflow: "hidden",
  border: "1px solid #eee",
  position: "relative",
  backgroundColor: "#fffded",
  transition: "all 0.3s ease",
  opacity: 0,
  transform: "translateY(20px)",
  animation: "fadeInUp 0.5s forwards",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
  },
  "@keyframes fadeInUp": {
    "0%": {
      opacity: 0,
      transform: "translateY(20px)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    }
  }
}));

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const PopularRestaurants: React.FC = () => {
  const [value, setValue] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const theme = { direction: "ltr" as const };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    // Update animation key to trigger re-render and new animations
    setAnimationKey(prev => prev + 1);
  };

  // Sample data - replace with your actual data
  const popularRestaurants: Restaurant[] = [
    {
      id: "1",
      name: "Burger Palace",
      image: burger,
      rating: 4.5,
      time: "15-25 min",
      tags: ["Burgers", "American", "Fast Food"],
      promotion: "20% OFF",
      featured: true,
      category: "fast-food",
    },
    {
      id: "2",
      name: "Chicken King",
      image: food,
      rating: 4.3,
      time: "20-30 min",
      tags: ["Fried Chicken", "Wings", "Fast Food"],
      promotion: "Free Fries",
      featured: false,
      category: "fast-food",
    },
    {
      id: "3",
      name: "Pizza Heaven",
      image: pizza,
      rating: 4.7,
      time: "25-35 min",
      tags: ["Pizza", "Italian", "Fast Food"],
      promotion: "30% OFF",
      featured: true,
      category: "fast-food",
    },
    {
      id: "4",
      name: "Taco Fiesta",
      image: kottu,
      rating: 4.4,
      time: "15-25 min",
      tags: ["Mexican", "Tacos", "Fast Food"],
      featured: false,
      category: "fast-food",
    },
    {
      id: "5",
      name: "Dragon Wok",
      image: noodles,
      rating: 4.6,
      time: "20-30 min",
      tags: ["Chinese", "Noodles", "Stir Fry"],
      promotion: "15% OFF",
      featured: true,
      category: "asian",
    },
    {
      id: "6",
      name: "Sushi World",
      image: food,
      rating: 4.8,
      time: "25-35 min",
      tags: ["Japanese", "Sushi", "Asian"],
      promotion: "10% OFF",
      featured: true,
      category: "asian",
    },
    {
      id: "7",
      name: "Thai Orchid",
      image: noodles,
      rating: 4.7,
      time: "30-40 min",
      tags: ["Thai", "Curry", "Asian"],
      promotion: "Free Spring Rolls",
      featured: false,
      category: "asian",
    },
    {
      id: "8",
      name: "Bamboo Garden",
      image: kottu,
      rating: 4.5,
      time: "25-35 min",
      tags: ["Dim Sum", "Chinese", "Asian"],
      featured: false,
      category: "asian",
    },
    {
      id: "9",
      name: "Sweet Dreams",
      image: pizza,
      rating: 4.9,
      time: "10-15 min",
      tags: ["Cakes", "Pastries", "Desserts"],
      promotion: "Free Coffee",
      featured: true,
      category: "desserts",
    },
    {
      id: "10",
      name: "Gelato Heaven",
      image: food,
      rating: 4.7,
      time: "5-10 min",
      tags: ["Ice Cream", "Gelato", "Desserts"],
      promotion: "Buy 1 Get 1 Free",
      featured: false,
      category: "desserts",
    },
    {
      id: "11",
      name: "Chocolate Factory",
      image: screen,
      rating: 4.8,
      time: "10-20 min",
      tags: ["Chocolate", "Desserts", "Candy"],
      promotion: "Free Sample",
      featured: true,
      category: "desserts",
    },
    {
      id: "12",
      name: "Donut Palace",
      image: pizza,
      rating: 4.6,
      time: "5-15 min",
      tags: ["Donuts", "Coffee", "Desserts"],
      featured: false,
      category: "desserts",
    },
    {
      id: "13",
      name: "Green Leaf",
      image: kottu,
      rating: 4.6,
      time: "15-20 min",
      tags: ["Healthy", "Vegan", "Salads"],
      promotion: "Free Dressing",
      featured: true,
      category: "healthy",
    },
    {
      id: "14",
      name: "Smoothie Bar",
      image: food,
      rating: 4.5,
      time: "10-15 min",
      tags: ["Smoothies", "Juices", "Healthy"],
      promotion: "Add Protein +$1",
      featured: false,
      category: "healthy",
    },
    {
      id: "15",
      name: "Vegan Delight",
      image: noodles,
      rating: 4.7,
      time: "20-30 min",
      tags: ["Vegan", "Plant-based", "Healthy"],
      promotion: "10% OFF",
      featured: true,
      category: "healthy",
    },
    {
      id: "16",
      name: "Fit Kitchen",
      image: noodles,
      rating: 4.4,
      time: "15-25 min",
      tags: ["Low-carb", "High-protein", "Healthy"],
      featured: false,
      category: "healthy",
    },
  ];

  // Get restaurants based on the active tab
  const getCurrentRestaurants = () => {
    const categories = ["fast-food", "asian", "desserts", "healthy"];
    return popularRestaurants.filter((r) => r.category === categories[value]);
  };

  const renderRestaurantCard = (restaurant: Restaurant, index: number) => (
    <Grid item xs={12} sm={6} md={3} key={restaurant.id}>
      <AnimatedCard
        elevation={0}
        sx={{
          animationDelay: `${index * 100}ms`,
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
                bgcolor: "green",
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
            <FavoriteIcon sx={{ color: "#FF4757" }} fontSize="small" />
          </IconButton>
        </Box>
        <CardContent sx={{ pt: 3 }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
            {restaurant.name}
            {restaurant.featured && (
              <Box component="span" sx={{ ml: 1, display: "inline-block" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF4757">
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
            <Box sx={{ mx: 1, fontSize: "0.5rem", color: "#98A2B3" }}>•</Box>
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
      </AnimatedCard>
    </Grid>
  );

  return (
    <Box sx={{ my: 4 }}>
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
          <RestaurantIcon sx={{ mr: 1, color: "green" }} /> Popular Restaurants
        </Typography>
        <Button
          endIcon={<KeyboardArrowRightIcon />}
          sx={{ color: "green", fontWeight: 500 }}
        >
          View All
        </Button>
      </Box>

      <Box sx={{ bgcolor: "background.paper", width: "100%" }}>
        <AppBar
          position="static"
          sx={{
            bgcolor: "white",
            color: "black",
            borderRadius: "40px",
            boxShadow: "none",
          }}
        >
          <StyledTabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
            sx={{
              '& .MuiTab-root': {
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: 'green',
                },
              },
              '& .Mui-selected': {
                color: 'green !important',
              },
            }}
          >
            <Tab 
              label="Fast Food" 
              icon={<FastfoodIcon />} 
              iconPosition="start"
              {...a11yProps(0)} 
              sx={{
                minHeight: '64px',
                '&.Mui-selected svg': {
                  color: 'green',
                }
              }}
            />
            <Tab
              label="Asian Cuisine"
              icon={<RamenDiningIcon />}
              iconPosition="start"
              {...a11yProps(1)}
              sx={{
                minHeight: '64px',
                '&.Mui-selected svg': {
                  color: 'green',
                }
              }}
            />
            <Tab 
              label="Desserts" 
              icon={<IcecreamIcon />} 
              iconPosition="start"
              {...a11yProps(2)} 
              sx={{
                minHeight: '64px',
                '&.Mui-selected svg': {
                  color: 'green',
                }
              }}
            />
            <Tab 
              label="Healthy" 
              icon={<SpaIcon />} 
              iconPosition="start"
              {...a11yProps(3)} 
              sx={{
                minHeight: '64px',
                '&.Mui-selected svg': {
                  color: 'green',
                }
              }}
            />
          </StyledTabs>
        </AppBar>

        {/* Tab Panels with Animation Key */}
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Grid container spacing={3} key={`fast-food-${animationKey}`}>
            {getCurrentRestaurants().map((restaurant, index) => 
              renderRestaurantCard(restaurant, index)
            )}
          </Grid>
        </TabPanel>

        <TabPanel value={value} index={1} dir={theme.direction}>
          <Grid container spacing={3} key={`asian-${animationKey}`}>
            {getCurrentRestaurants().map((restaurant, index) => 
              renderRestaurantCard(restaurant, index)
            )}
          </Grid>
        </TabPanel>

        <TabPanel value={value} index={2} dir={theme.direction}>
          <Grid container spacing={3} key={`desserts-${animationKey}`}>
            {getCurrentRestaurants().map((restaurant, index) => 
              renderRestaurantCard(restaurant, index)
            )}
          </Grid>
        </TabPanel>

        <TabPanel value={value} index={3} dir={theme.direction}>
          <Grid container spacing={3} key={`healthy-${animationKey}`}>
            {getCurrentRestaurants().map((restaurant, index) => 
              renderRestaurantCard(restaurant, index)
            )}
          </Grid>
        </TabPanel>
      </Box>
    </Box>
  );
};

export default PopularRestaurants;