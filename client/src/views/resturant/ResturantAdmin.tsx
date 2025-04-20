import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CssBaseline,
  Avatar,
  ThemeProvider,
  createTheme,
  ListItemButton,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Fastfood as MenuIconMaterial,
  LocalShipping as DeliveryIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { styled, useTheme } from "@mui/material/styles";

import logo from "../../assets/logo/biteUpLogo.png";

// Custom theme with white base and orange accents
const theme = createTheme({
  palette: {
    primary: {
      main: "#ffffff",
      contrastText: "#212121",
    },
    secondary: {
      main: "#ff9800",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff !important",
          color: "#212121",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#ffffff",
          borderRight: "none",
          boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
          position: "relative",
          zIndex: 1200,
          width: "80%", // Wider drawer on mobile
          maxWidth: 300, // But not too wide
        },
      },
    },
  },
});

// Drawer width - for expanded and collapsed states
const drawerWidth = 240;
const collapsedDrawerWidth = 72;

// Styled components
const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "collapsed",
})<{
  open?: boolean;
  collapsed?: boolean;
}>(({ theme, open, collapsed }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  [theme.breakpoints.up("md")]: {
    marginLeft: `${collapsed ? collapsedDrawerWidth : 2}px`,
    width: `calc(100% - ${collapsed ? collapsedDrawerWidth : 2}px)`,
  },
  position: "relative",
  zIndex: 1100,
  // Mobile adjustments
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
    marginTop: "56px", // Account for smaller app bar on mobile
  },
}));

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "collapsed",
})<{
  open?: boolean;
  collapsed?: boolean;
}>(({ theme, open, collapsed }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  [theme.breakpoints.up("md")]: {
    width: `calc(100% - ${collapsed ? collapsedDrawerWidth : drawerWidth}px)`,
    marginLeft: `${collapsed ? collapsedDrawerWidth : drawerWidth}px`,
  },
  // Mobile adjustments
  [theme.breakpoints.down("sm")]: {
    height: "56px", // Smaller app bar on mobile
  },
  // Set z-index lower than the drawer
  zIndex: theme.zIndex.drawer - 1,
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "space-between",
  // Mobile adjustments
  [theme.breakpoints.down("sm")]: {
    minHeight: "56px", // Match mobile app bar height
  },
}));

// Component imports
import Dashboard from "./Dashboard";
import Menu from "./Menu";
import Orders from "./Orders";
import Settings from "../homePage/UserHome";

const RestaurantAdmin: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeComponent, setActiveComponent] = useState("Dashboard");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const navItems = [
    { text: "Dashboard", icon: <DashboardIcon />, component: <Dashboard /> },
    { text: "Menu", icon: <MenuIconMaterial />, component: <Menu /> },
    { text: "Orders", icon: <DeliveryIcon />, component: <Orders /> },
  ];

  const settingsItem = {
    text: "Settings",
    icon: <SettingsIcon />,
    component: <Settings />,
  };

  const renderComponent = () => {
    const selectedItem = [...navItems, settingsItem].find(
      (item) => item.text === activeComponent
    );
    return selectedItem ? selectedItem.component : <Dashboard />;
  };

  const drawerContent = (
    <>
      <DrawerHeader sx={{ px: isMobile ? 2 : collapsed ? 1 : 2 }}>
        {!collapsed || isMobile ? (
          <Box
            sx={{
              py: 2,
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Avatar sx={{ bgcolor: "#FF4500", mr: 1.5 }}>R</Avatar>
            <Box
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                display: collapsed && !isMobile ? "none" : "block",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Restaurant Name
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Admin Panel
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              py: 2,
            }}
          >
            <Avatar sx={{ bgcolor: "#FF4500" }}>R</Avatar>
          </Box>
        )}
        {isMobile ? (
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        ) : (
          !collapsed && (
            <IconButton onClick={toggleCollapse}>
              <ChevronLeftIcon />
            </IconButton>
          )
        )}
      </DrawerHeader>
      <Divider />
      <List sx={{ pt: 1 }}>
        {navItems.map((item) => (
          <ListItem
            key={item.text}
            disablePadding
            sx={{ display: "block", mb: 0.5 }}
            onClick={() => {
              setActiveComponent(item.text);
              if (isMobile) handleDrawerClose();
            }}
          >
            <Tooltip
              title={collapsed && !isMobile ? item.text : ""}
              placement="right"
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: collapsed && !isMobile ? "center" : "initial",
                  backgroundColor:
                    activeComponent === item.text
                      ? "rgba(255, 152, 0, 0.1)"
                      : "transparent",
                  borderRadius: "8px",
                  mx: collapsed && !isMobile ? 0.5 : 1,
                  my: 0.25,
                  px: collapsed && !isMobile ? 2.5 : 3,
                  "&:hover": {
                    backgroundColor: "rgba(255, 152, 0, 0.08)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapsed && !isMobile ? 0 : 3,
                    justifyContent: "center",
                    color:
                      activeComponent === item.text ? "#D46F12" : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {(!collapsed || isMobile) && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: activeComponent === item.text ? 600 : 400,
                      color:
                        activeComponent === item.text ? "#D46F12" : "inherit",
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 1 }} />
      <List>
        <ListItem
          disablePadding
          sx={{ display: "block", mb: 0.5 }}
          onClick={() => {
            setActiveComponent(settingsItem.text);
            if (isMobile) handleDrawerClose();
          }}
        >
          <Tooltip
            title={collapsed && !isMobile ? settingsItem.text : ""}
            placement="right"
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: collapsed && !isMobile ? "center" : "initial",
                backgroundColor:
                  activeComponent === settingsItem.text
                    ? "rgba(255, 152, 0, 0.1)"
                    : "transparent",
                borderRadius: "8px",
                mx: collapsed && !isMobile ? 0.5 : 1,
                my: 0.25,
                px: collapsed && !isMobile ? 2.5 : 3,
                "&:hover": {
                  backgroundColor: "rgba(255, 152, 0, 0.08)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: collapsed && !isMobile ? 0 : 3,
                  justifyContent: "center",
                  color:
                    activeComponent === settingsItem.text
                      ? "secondary.main"
                      : "inherit",
                }}
              >
                {settingsItem.icon}
              </ListItemIcon>
              {(!collapsed || isMobile) && (
                <ListItemText
                  primary={settingsItem.text}
                  primaryTypographyProps={{
                    fontWeight:
                      activeComponent === settingsItem.text ? 600 : 400,
                    color:
                      activeComponent === settingsItem.text
                        ? "secondary.main"
                        : "inherit",
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
      {!isMobile && collapsed && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <IconButton onClick={toggleCollapse}>
            <ChevronRightIcon />
          </IconButton>
        </Box>
      )}
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBarStyled
          position="fixed"
          open={!isMobile}
          collapsed={collapsed}
          sx={{
            bgcolor: "white",
            boxShadow: "none",
            borderBottom: "1px solid #e0e0e0",
            height: { xs: 56, sm: 64, md: 73 }, // Responsive heights
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{ 
                mr: 2, 
                ...(!isMobile && { display: "none" }),
                // Smaller icon on mobile
                [theme.breakpoints.down("sm")]: {
                  padding: "6px",
                }
              }}
            >
              <MenuIcon sx={{ color: 'black'}} />
            </IconButton>
            <Box
              sx={{
                flexGrow: 1,
                ml: collapsed ? { md: 10 } : { md: 2 },
                transition: "margin-left 0.3s ease-in-out",
                overflow: "hidden",
              }}
            >
              <Typography
                variant="h6"
                noWrap // Prevent text wrapping on mobile
                sx={{
                  fontWeight: 600,
                  color: "black",
                  mt: 1,
                  transform: collapsed ? "translateX(8px)" : "translateX(0)",
                  transition: "transform 0.3s ease-in-out",
                  whiteSpace: "nowrap",
                  fontSize: { xs: "1rem", sm: "1.25rem" }, // Responsive font size
                }}
              >
                Restaurant Dashboard
              </Typography>
            </Box>
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                height: { xs: 40, sm: 50, md: 60 }, // Responsive logo size
                maxWidth: { xs: 80, sm: 100, md: "auto" },
                mr: { xs: 1, sm: 3, md: 5 }, // Responsive margin
              }}
            />
          </Toolbar>
        </AppBarStyled>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: "80%", // Take up most of the screen but leave some space
              maxWidth: 300, // But not too wide
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          sx={{
            display: { xs: "none", md: "block" },
            width: collapsed ? collapsedDrawerWidth : drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: collapsed ? collapsedDrawerWidth : drawerWidth,
              boxSizing: "border-box",
              position: "fixed",
              height: "100vh",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
          variant="permanent"
          anchor="left"
          open
        >
          {drawerContent}
        </Drawer>

        <Main open={!isMobile} collapsed={collapsed}>
          <DrawerHeader />
          <Box
            sx={{
              p: { xs: 1, sm: 2, md: 3 }, // Responsive padding
              marginTop: { xs: 0, sm: 0 },
              // Full width on mobile
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
            }}
          >
            {renderComponent()}
          </Box>
        </Main>
      </Box>
    </ThemeProvider>
  );
};

export default RestaurantAdmin;