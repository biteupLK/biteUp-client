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
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Navbar Icons
import HomeIcon from "@mui/icons-material/Home";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { IoFastFood } from "react-icons/io5";
import LoginIcon from "@mui/icons-material/Login";
import { FaCartShopping, FaStore, FaUserLarge } from "react-icons/fa6";
import { TiThMenu } from "react-icons/ti";
import useAuth from "../../customHooks/keycloak";

import { checkRestaurantEmail } from "../../api/restaurantApi"; // Import your API function here

// Import your logo here
import logo from "../../assets/logo/biteUpLogo.png";
import getUserDetails from "../../customHooks/extractPayload";

import NavigationButtons from "../NavigationButtons"; // Import your NavigationButtons component
import { ChevronRight } from "@mui/icons-material";

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate(); // Add this line
  const userDetails = getUserDetails();
  const name = userDetails?.name;
  const { isLogin, handleLogout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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

  // Updated handleNavigation to refresh the page
  const handleNavigation = (path: string, page: string) => {
    setActivePage(page);
    navigate(path); // Changed to use navigate
  };

  const navItems = [
    { label: "Home", icon: <HomeIcon />, path: "/" },
    { label: "Restaurant", icon: <RestaurantIcon />, path: "/restaurant" },
    { label: "Foods", icon: <IoFastFood />, path: "/foods" },
  ];

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
            onClick={() => handleNavigation("/profile", "Profile")}
            selected={activePage === "Profile"}
            sx={{
              transition: "all 0.3s ease",
              "&.Mui-selected": {
                backgroundColor: "rgba(0,0,0,0.1)",
              },
            }}
          >
            <ListItemIcon>
              <FaUserLarge />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>

        {getUserDetails()?.role === "ResAdmin" && (
        <ListItem disablePadding>
          <ListItemButton
            onClick={async () => {
              if (loading) return; // prevent double click
              setLoading(true);
              try {
                const userDetails = getUserDetails();
                const email = userDetails?.email;

                if (!email) {
                  console.error("No user email found.");
                  handleNavigation("/", "Login");
                  return;
                }

                const restaurantExists = await checkRestaurantEmail(email);
                if (restaurantExists) {
                  handleNavigation("/restaurantAdmin", "Dashboard");
                } else {
                  handleNavigation("/restaurantForm", "Login");
                }
              } catch (error) {
                console.error("Error checking restaurant:", error);
                handleNavigation("/loginform", "Login");
              } finally {
                setLoading(false);
              }
            }}
            selected={activePage === "My Restaurant"}
            sx={{
              transition: "all 0.3s ease",
              "&.Mui-selected": {
                backgroundColor: "rgba(0,0,0,0.1)",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "rgba(0,0,0,0.15)",
              },
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.05)",
              },
            }}
          >
            <ListItemIcon>
              <FaStore />
            </ListItemIcon>
            <ListItemText primary="My Restaurant" />
          </ListItemButton>
        </ListItem>
        )}

        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LoginIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
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
            <NavigationButtons
              activePage={activePage}
              setActivePage={setActivePage}
              isMobile={isMobile}
              handleNavigation={handleNavigation}
            />
          </motion.div>

          {/* Mobile Menu Toggle and Desktop Controls */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 3, sm: 2 },
            }}
          >
            {/* Search Button */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton
                sx={{
                  display: { xs: "inline-flex", md: "inline-flex" },
                  p: 1,
                }}
                onClick={() => {
                  if (window.location.pathname !== "/home") {
                    navigate("/home#search-section"); // Navigate with hash
                  } else {
                    const searchSection =
                      document.getElementById("search-section");
                    if (searchSection) {
                      searchSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }
                }}
              >
                <SearchIcon style={{ fontSize: 30 }} />
              </IconButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Shopping Cart */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link to="/cart">
                  <IconButton
                    sx={{
                      display: { xs: "inline-flex", md: "inline-flex" },
                      p: 1,
                    }}
                  >
                    <FaCartShopping style={{ fontSize: 25 }} />
                  </IconButton>
                </Link>
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

            {/* Avatar / User Menu for Desktop */}
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
                  {name ? (
                    <Button
                      startIcon={
                        <Avatar sx={{ width: 24, height: 24 }}>
                          {name?.charAt(0).toUpperCase()}
                        </Avatar>
                      }
                      sx={{
                        color: "black",
                        textTransform: "none",
                        transition: "all 0.3s ease",
                        borderRadius: 10,
                        p: 2,
                      }}
                      onClick={handleMenuOpen}
                    >
                      Hi {name}
                    </Button>
                  ) : (
                    <Button
                      startIcon={
                        <Avatar sx={{ width: 24, height: 24 }}>
                          {name?.charAt(0).toUpperCase()}
                        </Avatar>
                      }
                      sx={{
                        color: "black",
                        textTransform: "none",
                        transition: "all 0.3s ease",
                        borderRadius: 10,
                        p: 2,
                      }}
                      onClick={() => (window.location.href = "/home")}
                    >
                      Login / Signup
                    </Button>
                  )}
                </motion.div>

                {/* Dropdown Menu */}
                {name ? (
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        mt: 1,
                        minWidth: 200,
                        borderRadius: 2,
                        boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                      },
                    }}
                  >
                    <MenuItem
                      onClick={handleMenuClose}
                      sx={{
                        cursor: "default",
                        pointerEvents: "none",
                        py: 1.5,
                        px: 2,
                        "&:hover": { bgcolor: "transparent" },
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          fontWeight: 500,
                          opacity: 0.7,
                          transition: "opacity 0.2s ease",
                        }}
                      >
                        Signed in as <strong>{name}</strong>
                      </Typography>
                    </MenuItem>

                    {/* Profile Item */}
                    <MenuItem
                      onClick={() => {
                        handleNavigation("/profile", "Profile");
                        handleMenuClose();
                      }}
                      sx={{
                        borderRadius: "16px",
                        mx: 1,
                        my: 0.5,
                        py: 1.5,
                        px: 2,
                        transition: "all 0.25s ease-out",
                        "&:hover": {
                          bgcolor: "action.hover",
                          "& .menu-item-icon": {
                            transform: "scale(1.1)",
                            color: "primary.main",
                          },
                          "& .menu-item-arrow": {
                            opacity: 1,
                            transform: "translateX(0)",
                          },
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <FaUserLarge
                          fontSize="small"
                          className="menu-item-icon"
                        />
                      </ListItemIcon>
                      <Typography variant="body1">Profile</Typography>
                      <Box
                        className="menu-item-arrow"
                        sx={{
                          ml: "auto",
                          opacity: 0,
                          transform: "translateX(-4px)",
                          transition: "all 0.25s ease-out",
                          color: "text.secondary",
                        }}
                      >
                        <ChevronRight fontSize="small" />
                      </Box>
                    </MenuItem>

                    {/* Restaurant Item */}
                    {getUserDetails()?.role === "ResAdmin" && (
                      <MenuItem
                        onClick={async () => {
                          try {
                            handleMenuClose();

                            const userDetails = getUserDetails();
                            const email = userDetails?.email;

                            if (!email) {
                              console.error("No user email found.");
                              handleNavigation("/", "Login");
                              return;
                            }

                            const restaurantExists =
                              await checkRestaurantEmail(email);

                            if (restaurantExists) {
                              handleNavigation("/restaurantAdmin", "Dashboard");
                            } else {
                              handleNavigation(
                                "/restaurantForm",
                                "Setup Restaurant"
                              );
                            }
                          } catch (error) {
                            console.error(
                              "Error checking restaurant for email:",
                              error
                            );
                            handleNavigation("/", "Login");
                          }
                        }}
                        sx={{
                          borderRadius: "16px",
                          mx: 1,
                          my: 0.5,
                          py: 1.5,
                          px: 2,
                          transition: "all 0.25s ease-out",
                          "&:hover": {
                            bgcolor: "action.hover",
                            "& .menu-item-icon": {
                              transform: "scale(1.1)",
                              color: "primary.main",
                            },
                            "& .menu-item-arrow": {
                              opacity: 1,
                              transform: "translateX(0)",
                            },
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <FaStore
                            fontSize="small"
                            className="menu-item-icon"
                          />
                        </ListItemIcon>
                        <Typography variant="body1">My Restaurant</Typography>
                        <Box
                          className="menu-item-arrow"
                          sx={{
                            ml: "auto",
                            opacity: 0,
                            transform: "translateX(-4px)",
                            transition: "all 0.25s ease-out",
                            color: "text.secondary",
                          }}
                        >
                          <ChevronRight fontSize="small" />
                        </Box>
                      </MenuItem>
                    )}

                    {/* Logout Item */}
                    <MenuItem
                      onClick={() => {
                        handleLogout();
                        handleMenuClose();
                      }}
                      sx={{
                        borderRadius: "16px",
                        mx: 1,
                        my: 0.5,
                        py: 1.5,
                        px: 2,
                        transition: "all 0.25s ease-out",
                        "&:hover": {
                          bgcolor: "error.light",
                          color: "white",
                          "& .menu-item-icon": {
                            transform: "translateX(2px)",
                            color: "white",
                          },
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <LoginIcon
                          fontSize="small"
                          className="menu-item-icon"
                          sx={{
                            color: "text.secondary",
                            transition: "all 0.25s ease-out",
                          }}
                        />
                      </ListItemIcon>
                      <Typography variant="body1">Logout</Typography>
                    </MenuItem>
                  </Menu>
                ) : (
                  isLogin
                )}
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
