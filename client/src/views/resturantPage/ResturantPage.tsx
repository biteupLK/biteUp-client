import React, { useState, useEffect } from "react";
import {
  Box,
  ThemeProvider,
  createTheme,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Container,
  TextField,
  InputAdornment,
  Paper,
  Skeleton,
  useMediaQuery,
  Rating,
  Chip,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import Navbar from "../../components/layOuts/Navbar";
import { fetchRestaurantData, RestaurantSchema } from "../../api/restaurantApi";

// Updated custom theme with modern typography
const customTheme = createTheme({
  palette: {
    primary: {
      main: "#FF9800",
    },
    secondary: {
      main: "#FFFFFF",
    },
    background: {
      default: "#FAFAFA",
      paper: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: 1.3,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    body1: {
      fontSize: "0.9375rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
          boxShadow: "0px 4px 10px rgba(255, 152, 0, 0.1)",
          "&:hover": {
            boxShadow: "0px 6px 15px rgba(255, 152, 0, 0.2)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.1)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            height: 48,
          },
        },
      },
    },
  },
});

// Shimmer loading component
const RestaurantCardSkeleton = () => {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Skeleton
        variant="rectangular"
        height={180}
        animation="wave"
        sx={{
          borderRadius: "12px 12px 0 0",
        }}
      />
      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        <Skeleton variant="text" height={28} width="80%" animation="wave" />
        <Skeleton
          variant="text"
          height={20}
          width="60%"
          animation="wave"
          sx={{ mb: 1.5 }}
        />
        <Skeleton variant="text" height={16} width="100%" animation="wave" />
        <Skeleton variant="text" height={16} width="90%" animation="wave" />
        <Skeleton
          variant="text"
          height={16}
          width="80%"
          animation="wave"
          sx={{ mb: 1.5 }}
        />
        <Skeleton variant="text" height={16} width="70%" animation="wave" />
      </CardContent>
      <Box sx={{ p: 2.5, pt: 0 }}>
        <Skeleton
          variant="rectangular"
          height={40}
          width="100%"
          animation="wave"
          sx={{ borderRadius: 2 }}
        />
      </Box>
    </Card>
  );
};

interface RestaurantCardProps {
  restaurant: RestaurantSchema;
}

// Modern restaurant card component
const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          border: "1px solid rgba(0, 0, 0, 0.05)",
        }}
      >
        {restaurant.logo ? (
          <CardMedia
            component="img"
            height={180}
            image={
              typeof restaurant.logo === "string"
                ? restaurant.logo
                : URL.createObjectURL(restaurant.logo)
            }
            alt={restaurant.name}
            sx={{
              objectFit: "cover",
              borderRadius: "12px 12px 0 0",
            }}
          />
        ) : (
          <Box
            sx={{
              height: 180,
              background: "linear-gradient(135deg, #FF9800 0%, #FF5722 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              borderRadius: "12px 12px 0 0",
            }}
          >
            <RestaurantIcon sx={{ fontSize: 48, opacity: 0.9 }} />
          </Box>
        )}

        <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            fontWeight="600"
            sx={{ mb: 1 }}
          >
            {restaurant.name}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <Rating
              value={4.5}
              precision={0.5}
              size="small"
              readOnly
              sx={{
                color: "primary.main",
                mr: 1,
                "& .MuiRating-icon": {
                  fontSize: "1.1rem",
                },
              }}
            />
            <Typography variant="body2" color="text.secondary">
              4.5 (120)
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              height: 60,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              fontSize: "0.875rem",
            }}
          >
            {restaurant.description}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              mb: 1.5,
              "& svg": {
                fontSize: "1rem",
                mt: 0.25,
                mr: 1,
                color: "text.secondary",
              },
            }}
          >
            <LocationOnIcon />
            <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
              {restaurant.address}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              "& svg": {
                fontSize: "1rem",
                mt: 0.25,
                mr: 1,
                color: "text.secondary",
              },
            }}
          >
            <PhoneIcon />
            <Typography variant="body2" color="text.secondary">
              {restaurant.phoneNumber}
            </Typography>
          </Box>
        </CardContent>

        <Box sx={{ p: 2.5, pt: 0 }}>
          <Button
            variant="contained"
            fullWidth
            // href={`/restaurant/${restaurant.id}`}
            disableElevation
            size="medium"
            sx={{
              fontWeight: 600,
              letterSpacing: "0.5px",
            }}
          >
            View Menu
          </Button>
        </Box>
      </Card>
    </motion.div>
  );
};

const RestaurantPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<RestaurantSchema[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<
    RestaurantSchema[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRestaurantData();
        setRestaurants(data);
        setFilteredRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1200);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const results = restaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRestaurants(results);
  }, [searchTerm, restaurants]);

  return (
    <ThemeProvider theme={customTheme}>
      <Navbar />
      <Box
        sx={{
          pt: { xs: 3, sm: 5 },
          pb: 10,
          minHeight: "100vh",
          background: "linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)",
        }}
      >
        <Container maxWidth="lg">
          {/* Modern header section */}
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 1.5,
                  fontSize: isMobile ? "1.75rem" : "2.125rem",
                }}
              >
                Discover Local Restaurants
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  maxWidth: 600,
                  mx: "auto",
                  fontSize: isMobile ? "0.875rem" : "0.9375rem",
                }}
              >
                Explore top-rated dining options near you with seamless ordering
                and delivery
              </Typography>
            </motion.div>
          </Box>

          {/* Modern search bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Box sx={{ mb: 5 }}>
              <TextField
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search restaurants by name, cuisine or location..."
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ ml: 1 }}>
                      <SearchIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                  sx: {
                    bgcolor: "background.paper",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
                    "& fieldset": {
                      border: "none",
                    },
                  },
                }}
              />
            </Box>
          </motion.div>

          {/* Restaurant grid */}
          {isLoading ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
                gap: 3,
              }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <RestaurantCardSkeleton key={i} />
              ))}
            </Box>
          ) : filteredRestaurants.length > 0 ? (
            <AnimatePresence>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                    lg: "repeat(4, 1fr)",
                  },
                  gap: 3,
                }}
              >
                {filteredRestaurants.map((restaurant) => (
                  <motion.div
                    key={restaurant.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <RestaurantCard restaurant={restaurant} />
                  </motion.div>
                ))}
              </Box>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Paper
                elevation={0}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 300,
                  textAlign: "center",
                  p: 4,
                  borderRadius: 3,
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                }}
              >
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#FFF3E0",
                    mb: 3,
                  }}
                >
                  <SearchIcon sx={{ fontSize: 40, color: "#FF9800" }} />
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  No restaurants found
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {searchTerm.trim()
                    ? `No results for "${searchTerm}"`
                    : "No restaurants available at the moment"}
                </Typography>
                {searchTerm.trim() && (
                  <Chip
                    label="Clear search"
                    onClick={() => setSearchTerm("")}
                    color="primary"
                    variant="outlined"
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "primary.light",
                        color: "primary.contrastText",
                      },
                    }}
                  />
                )}
              </Paper>
            </motion.div>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default RestaurantPage;
