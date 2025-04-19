import React, { useState, createContext, useContext, useEffect } from "react";
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
  Badge,
  Divider,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SettingsIcon from "@mui/icons-material/Settings";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LoginIcon from "@mui/icons-material/Login";
import { TiThMenu } from "react-icons/ti";
import { FaUserLarge } from "react-icons/fa6";
import { MdAnalytics } from "react-icons/md";
import useAuth from "../../customHooks/keycloak";

// Import your logo
import logo from "../../assets/logo/biteUpLogo.png";
import getUserDetails from "../../customHooks/extractPayload";
import { ChevronRight } from "@mui/icons-material";

// Create a context to manage active page
interface NavContextType {
  activePage: string;
  setActivePage: (page: string) => void;
}

// In your RestaurantAdminNavbar component
interface ExtendedUserDetails {
  name?: string;
  role?: string;
  restaurantName?: string;
  // ...other properties
}

const NavContext = createContext<NavContextType>({
  activePage: "Dashboard",
  setActivePage: () => {},
});

// Custom hook to use navigation context
export const useNavContext = () => useContext(NavContext);

// Restaurant Admin Navigation Component
const RestaurantAdminNavbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] =
    useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();
  // Then use type assertion when calling getUserDetails
  const userDetails = getUserDetails() as ExtendedUserDetails;
  //   const userDetails = getUserDetails();
  const restaurantName = userDetails?.restaurantName || "My Restaurant";
  const name = userDetails?.name;
  const { isLogin, handleLogout } = useAuth();

  // Notification count (replace with actual data later)
  const notificationCount = 3;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  // Update active page based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === "/restaurant-admin") setActivePage("Dashboard");
    else if (path === "/restaurant-admin/menu") setActivePage("Menu");
    else if (path === "/restaurant-admin/orders") setActivePage("Orders");
    else if (path === "/restaurant-admin/analytics") setActivePage("Analytics");
    else if (path === "/restaurant-admin/settings") setActivePage("Settings");
  }, [location]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string, page: string) => {
    setActivePage(page);
    navigate(path);
  };

  // Navigation items for restaurant admin
  const navItems = [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/restaurant-admin" },
    {
      label: "Menu Management",
      icon: <RestaurantMenuIcon />,
      path: "/restaurant-admin/menu",
    },
    {
      label: "Orders",
      icon: <ReceiptIcon />,
      path: "/restaurant-admin/orders",
    },
    {
      label: "Analytics",
      icon: <MdAnalytics size={24} />,
      path: "/restaurant-admin/analytics",
    },
    {
      label: "Settings",
      icon: <SettingsIcon />,
      path: "/restaurant-admin/settings",
    },
  ];

  // Create desktop navigation buttons component
  const RestaurantNavigationButtons: React.FC<{
    activePage: string;
    setActivePage: (page: string) => void;
    isMobile: boolean;
    handleNavigation: (path: string, page: string) => void;
  }> = ({ activePage, setActivePage, isMobile, handleNavigation }) => {
    if (isMobile) return null;

    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        {navItems.map((item) => (
          <motion.div
            key={item.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              startIcon={item.icon}
              onClick={() => handleNavigation(item.path, item.label)}
              sx={{
                color:
                  activePage === item.label ? "primary.main" : "text.secondary",
                fontWeight: activePage === item.label ? 600 : 400,
                textTransform: "none",
                borderRadius: 2,
                px: 2,
                py: 1,
                position: "relative",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.04)",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  width: activePage === item.label ? "80%" : "0%",
                  height: "3px",
                  bottom: "2px",
                  left: "10%",
                  backgroundColor: "primary.main",
                  transition: "all 0.3s ease",
                  borderRadius: "10px",
                },
              }}
            >
              {item.label}
            </Button>
          </motion.div>
        ))}
      </Box>
    );
  };

  const mobileDrawer = (
    <Drawer
      variant="temporary"
      anchor="right"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{ keepMounted: true }}
      sx={{
        "& .MuiDrawer-paper": { boxSizing: "border-box", width: 280 },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" color="primary" fontWeight="bold">
          {restaurantName} Admin
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              onClick={() => {
                handleNavigation(item.path, item.label);
                handleDrawerToggle();
              }}
              selected={activePage === item.label}
              sx={{
                transition: "all 0.3s ease",
                borderRadius: 2,
                m: 1,
                "&.Mui-selected": {
                  backgroundColor: "primary.light",
                  color: "primary.main",
                  "&:hover": {
                    backgroundColor: "primary.light",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: activePage === item.label ? "primary.main" : "inherit",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}

        <Divider sx={{ my: 1 }} />

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              handleNavigation("/user-view", "Customer View");
              handleDrawerToggle();
            }}
            sx={{
              transition: "all 0.3s ease",
              borderRadius: 2,
              m: 1,
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <FaUserLarge />
            </ListItemIcon>
            <ListItemText primary="Switch to Customer View" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              transition: "all 0.3s ease",
              borderRadius: 2,
              m: 1,
              "&:hover": {
                backgroundColor: "error.light",
                color: "white",
                "& .MuiListItemIcon-root": {
                  color: "white",
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
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
      <AppBar
        position="sticky"
        elevation={2}
        sx={{
          bgcolor: "white",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <Toolbar
          sx={{
            px: { xs: 2, sm: 6, md: 10, lg: 20 },
            gap: 3,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
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
                  height: { xs: 60, sm: 70 },
                  maxWidth: { xs: 100, sm: "auto" },
                }}
              />
            </motion.div>

            {!isMobile && (
              <Box ml={2}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color="primary.main"
                >
                  Restaurant Admin
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {restaurantName}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Navigation */}
          <RestaurantNavigationButtons
            activePage={activePage}
            setActivePage={setActivePage}
            isMobile={isMobile}
            handleNavigation={handleNavigation}
          />

          {/* Actions Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
            }}
          >
            {/* Add Food Button (desktop only) */}
            {!isMobile && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() =>
                    handleNavigation("/restaurant-admin/menu/add", "Add Item")
                  }
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    px: 2,
                  }}
                >
                  Add Food
                </Button>
              </motion.div>
            )}

            {/* Notifications */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton sx={{ p: 1 }} onClick={handleNotificationOpen}>
                <Badge badgeContent={notificationCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </motion.div>

            {/* Notification Menu */}
            <Menu
              anchorEl={notificationAnchorEl}
              open={Boolean(notificationAnchorEl)}
              onClose={handleNotificationClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1,
                  width: 320,
                  maxHeight: 400,
                  borderRadius: 2,
                  boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Box sx={{ p: 2, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Notifications
                </Typography>
              </Box>

              <MenuItem onClick={handleNotificationClose} sx={{ py: 2 }}>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    New order received
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Order #12345 - 10 minutes ago
                  </Typography>
                </Box>
              </MenuItem>

              <MenuItem onClick={handleNotificationClose} sx={{ py: 2 }}>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Customer left a review
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    4 stars - 1 hour ago
                  </Typography>
                </Box>
              </MenuItem>

              <MenuItem onClick={handleNotificationClose} sx={{ py: 2 }}>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Order #12340 completed
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    3 hours ago
                  </Typography>
                </Box>
              </MenuItem>

              <Box
                sx={{
                  p: 1,
                  borderTop: "1px solid rgba(0,0,0,0.08)",
                  textAlign: "center",
                }}
              >
                <Button
                  size="small"
                  sx={{ textTransform: "none" }}
                  onClick={() => {
                    handleNavigation(
                      "/restaurant-admin/notifications",
                      "All Notifications"
                    );
                    handleNotificationClose();
                  }}
                >
                  View all notifications
                </Button>
              </Box>
            </Menu>

            {/* Mobile Menu Toggle */}
            {isMobile && (
              <motion.div whileTap={{ scale: 0.9 }}>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                >
                  <TiThMenu style={{ color: "rgba(0,0,0,0.8)" }} />
                </IconButton>
              </motion.div>
            )}

            {/* User Menu for Desktop */}
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
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "primary.main",
                          }}
                        >
                          {name?.charAt(0).toUpperCase()}
                        </Avatar>
                      }
                      sx={{
                        color: "text.primary",
                        textTransform: "none",
                        transition: "all 0.3s ease",
                        borderRadius: 10,
                        p: 1,
                      }}
                      onClick={handleMenuOpen}
                    >
                      {name}
                    </Button>
                  ) : (
                    <Button
                      startIcon={<Avatar sx={{ width: 32, height: 32 }} />}
                      sx={{
                        color: "text.primary",
                        textTransform: "none",
                        borderRadius: 10,
                        p: 1,
                      }}
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </Button>
                  )}
                </motion.div>

                {/* User Dropdown Menu */}
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
                    elevation: 3,
                    sx: {
                      mt: 1,
                      minWidth: 230,
                      borderRadius: 2,
                      boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
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
                      sx={{ fontWeight: 500 }}
                    >
                      Signed in as <strong>{name}</strong>
                    </Typography>
                  </MenuItem>

                  <Divider sx={{ my: 1 }} />

                  {/* Restaurant Profile */}
                  <MenuItem
                    onClick={() => {
                      handleNavigation(
                        "/restaurant-admin/settings",
                        "Settings"
                      );
                      handleMenuClose();
                    }}
                    sx={{
                      borderRadius: "12px",
                      mx: 1,
                      my: 0.5,
                      py: 1,
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
                      <SettingsIcon
                        fontSize="small"
                        className="menu-item-icon"
                      />
                    </ListItemIcon>
                    <Typography variant="body2">Restaurant Profile</Typography>
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

                  {/* Switch to Customer View */}
                  <MenuItem
                    onClick={() => {
                      handleNavigation("/user-view", "Customer View");
                      handleMenuClose();
                    }}
                    sx={{
                      borderRadius: "12px",
                      mx: 1,
                      my: 0.5,
                      py: 1,
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
                      <FaUserLarge className="menu-item-icon" />
                    </ListItemIcon>
                    <Typography variant="body2">
                      Switch to Customer View
                    </Typography>
                  </MenuItem>

                  <Divider sx={{ my: 1 }} />

                  {/* Logout Item */}
                  <MenuItem
                    onClick={() => {
                      handleLogout();
                      handleMenuClose();
                    }}
                    sx={{
                      borderRadius: "12px",
                      mx: 1,
                      my: 0.5,
                      py: 1,
                      px: 2,
                      transition: "all 0.25s ease-out",
                      "&:hover": {
                        bgcolor: "error.light",
                        color: "white",
                        "& .MuiListItemIcon-root": {
                          color: "white",
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <LoginIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="body2">Logout</Typography>
                  </MenuItem>
                </Menu>
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

export default RestaurantAdminNavbar;
