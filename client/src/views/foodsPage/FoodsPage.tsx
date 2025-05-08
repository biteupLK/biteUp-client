import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Box, 
  Container, 
  Typography, 
  InputAdornment, 
  TextField,
  Chip,
  Skeleton,
  useMediaQuery,
  useTheme,
  ToggleButtonGroup,
  ToggleButton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import Navbar from "../../components/layOuts/Navbar";
import { getMenuItems, MenuItem } from "../../api/menuItemApi";
import MenuItemCard from "../../components/MenuCard";
import { motion, AnimatePresence } from "framer-motion";

const FoodsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { data: menuItemData, isLoading } = useQuery({
    queryKey: ["menuItems"],
    queryFn: getMenuItems,
  });

  // Available categories
  const categories = ["All", "Pizza", "Burgers", "Beverages", "Vegetarian"];

  // Group items by restaurant and filter by search term and category
  const groupByRestaurant = (items: MenuItem[]) => {
    if (!items) return {};
    
    const filteredItems = items.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.restaurantEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        !selectedCategory || 
        selectedCategory === "All" ||
        item.category?.toLowerCase() === selectedCategory.toLowerCase();
      
      return matchesSearch && matchesCategory;
    });

    return filteredItems.reduce((acc: Record<string, MenuItem[]>, item) => {
      if (!acc[item.restaurentId]) {
        acc[item.restaurentId] = [];
      }
      acc[item.restaurentId].push(item);
      return acc;
    }, {});
  };

  const groupedItems = menuItemData ? groupByRestaurant(menuItemData) : {};
  const hasResults = Object.keys(groupedItems).length > 0;

  // Format restaurant name from email
  const formatRestaurantName = (email: string) => {
    return email.split('@')[0]
      .replace(/[^a-zA-Z]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleCategoryChange = (
    event: React.MouseEvent<HTMLElement>,
    newCategory: string | null
  ) => {
    setSelectedCategory(newCategory);
  };

  return (
    <Box sx={{ bgcolor: "white" }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4, bgcolor: "white" }}>
        {/* Search Section */}
        <Box 
          sx={{ 
            mb: 6,
            textAlign: 'center'
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              mb: 2,
              color: 'text.primary',
              fontSize: isMobile ? '1.75rem' : '2.125rem'
            }}
          >
            Discover Delicious Meals
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 3, 
              color: 'text.secondary',
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            Explore our diverse menu selections from top local restaurants
          </Typography>
          
          <TextField
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search dishes, cuisines, or restaurants..."
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: "12px",
                backgroundColor: "background.paper",
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
                "& fieldset": { border: "none" },
                height: 48,
                maxWidth: 600,
                mx: 'auto'
              }
            }}
          />

          {/* Category Filter */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <ToggleButtonGroup
              value={selectedCategory}
              onChange={handleCategoryChange}
              exclusive
              aria-label="food category"
              sx={{
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 1,
                '& .MuiToggleButtonGroup-grouped': {
                  borderRadius: '20px !important',
                  border: '1px solid !important',
                  borderColor: 'divider',
                  px: 3,
                  py: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark'
                    }
                  }
                }
              }}
            >
              {categories.map((category) => (
                <ToggleButton 
                  key={category} 
                  value={category}
                  aria-label={category.toLowerCase()}
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.875rem'
                  }}
                >
                  {category}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Content Section */}
        {isLoading ? (
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 3
          }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Skeleton 
                  variant="rectangular" 
                  height={200} 
                  sx={{ 
                    borderRadius: 2, 
                    mb: 1 
                  }} 
                />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </motion.div>
            ))}
          </Box>
        ) : hasResults ? (
          <AnimatePresence>
            {Object.entries(groupedItems).map(([restaurantId, items]) => (
              <motion.div
                key={restaurantId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ mb: 6 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 3,
                    gap: 2
                  }}>
                    <RestaurantIcon color="primary" />
                    <Chip 
                      label={`${items.length} items`} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </Box>
                  
                  <Box sx={{
                    display: "grid",
                    gridTemplateColumns: { 
                      xs: "1fr", 
                      sm: "1fr 1fr", 
                      md: "repeat(3, 1fr)",
                      lg: "repeat(4, 1fr)"
                    },
                    gap: 3,
                  }}>
                    {items.map((item: MenuItem) => (
                      <MenuItemCard key={item.id} item={item} />
                    ))}
                  </Box>
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 300,
            textAlign: 'center',
            p: 4
          }}>
            <SearchIcon sx={{ 
              fontSize: 64, 
              color: 'text.disabled',
              mb: 2 
            }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No results found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {searchTerm || selectedCategory ? (
                `We couldn't find any matches for your search`
              ) : (
                "No menu items available at the moment"
              )}
            </Typography>
            {(searchTerm || selectedCategory) && (
              <Chip 
                label="Clear filters" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory(null);
                }} 
                sx={{ mt: 3 }}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default FoodsPage;