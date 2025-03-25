import React, { useState, createContext, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Avatar,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

// Navbar Icons
import HomeIcon from "@mui/icons-material/Home";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { IoFastFood } from "react-icons/io5";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LoginIcon from "@mui/icons-material/Login";
import { FaCartShopping } from "react-icons/fa6";
import { TiThMenu } from "react-icons/ti";

// Import your logo here
import logo from "../../assets/logo/biteUpLogo.png";

// Create a context to manage active page
interface NavContextType {
  activePage: string;
  setActivePage: (page: string) => void;
}

const NavContext = createContext<NavContextType>({
  activePage: "Home",
  setActivePage: () => {},
});

// Custom hook to use navigation context
export const useNavContext = () => useContext(NavContext);

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePage, setActivePage] = useState("Home");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();

  // Update active page based on current route
  React.useEffect(() => {
    const path = location.pathname;
    if (path === "/") setActivePage("Home");
    else if (path === "/restaurant") setActivePage("Restaurant");
    else if (path === "/foods") setActivePage("Foods");
  }, [location]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string, page: string) => {
    navigate(path);
    setActivePage(page);
    setMobileOpen(false);
  };

  const navItems = [
    { label: "Home", icon: <HomeIcon />, path: "/" },
    { label: "Restaurant", icon: <RestaurantIcon />, path: "/restaurant" },
    { label: "Foods", icon: <IoFastFood />, path: "/foods" },
  ];

  const renderNavButtons = () => (
    <NavContext.Provider value={{ activePage, setActivePage }}>
      {navItems.map((item) => (
        <motion.div
          key={item.label}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            startIcon={item.icon}
            onClick={() => handleNavigation(item.path, item.label)}
            sx={{
              mx: 1,
              color: activePage === item.label ? "white" : "gray",
              fontWeight: 500,
              px: 3,
              py: 1,
              bgcolor: activePage === item.label ? "black" : "white",
              borderRadius: 7,
              display: "flex",
              alignItems: "center",
              border: activePage === item.label ? "none" : "1px solid gray",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor:
                  activePage === item.label
                    ? "rgba(0,0,0,0.9)"
                    : "rgba(0,0,0,0.1)",
              },
              ...(isMobile && { display: "none" }), // Hide on mobile
            }}
          >
            {item.label}
          </Button>
        </motion.div>
      ))}
    </NavContext.Provider>
  );

  const mobileDrawer = (
    <Drawer
      variant="temporary"
      anchor="right"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{ keepMounted: true }}
      sx={{
        "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
      }}
    >
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path, item.label)}
              selected={activePage === item.label}
              sx={{
                transition: "all 0.3s ease",
                "&.Mui-selected": {
                  backgroundColor: "rgba(0,0,0,0.1)",
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              /* Add login logic */
            }}
          >
            <ListItemIcon>
              <LoginIcon />
            </ListItemIcon>
            <ListItemText primary="Login / Signup" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: "white" }}>
        <Toolbar
          sx={{
            px: { xs: 2, sm: 6, md: 10, lg: 20 },
            gap: 3,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                height: { xs: 80, sm: 110 },
                maxWidth: { xs: 120, sm: "auto" },
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Navigation Buttons */}
            <Box
              sx={{
                display: "flex",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {renderNavButtons()}
            </Box>
          </motion.div>

          {/* Mobile Menu Toggle and Desktop Controls */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 3, sm: 2 },
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Shopping Cart */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  sx={{
                    display: { xs: "inline-flex", md: "inline-flex" },
                    p: 1,
                  }}
                >
                  <FaCartShopping style={{ fontSize: 25 }} />
                </IconButton>
              </motion.div>
            </motion.div>

            {/* Mobile Menu Toggle */}
            {isMobile && (
              <motion.div whileTap={{ scale: 0.9 }}>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <TiThMenu style={{ color: "rgba(0,0,0,0.9)" }} />
                </IconButton>
              </motion.div>
            )}

            {/* Avatar / Login for Desktop */}
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    startIcon={
                      <Avatar sx={{ width: 24, height: 24 }}>U</Avatar>
                    }
                    sx={{
                      color: "black",
                      textTransform: "none",
                      transition: "all 0.3s ease",
                      borderRadius: 10,
                      p: 2,
                    }}
                  >
                    Login / Signup
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      {mobileDrawer}
    </>
  );
};

export default Navbar;
