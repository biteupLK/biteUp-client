import React from 'react';
import { motion } from 'framer-motion';
import { Box, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { IoFastFood } from 'react-icons/io5';

// Define the context interface
interface NavContextType {
  activePage: string;
  setActivePage: (page: string) => void;
}

// Create the context
export const NavContext = React.createContext<NavContextType>({
  activePage: '',
  setActivePage: () => {},
});

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface NavigationButtonsProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isMobile: boolean;
  handleNavigation: (path: string, label: string) => void;
  customNavItems?: NavItem[]; // Optional custom navigation items
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  activePage,
  setActivePage,
  isMobile,
  handleNavigation,
  customNavItems,
}) => {
  // Default navigation items
  const defaultNavItems: NavItem[] = [
    { label: "Home", icon: <HomeIcon />, path: "/" },
    { label: "Restaurant", icon: <RestaurantIcon />, path: "/restaurant" },
    { label: "Foods", icon: <IoFastFood />, path: "/foods" },
  ];

  // Use customNavItems if provided, otherwise use default
  const navItems = customNavItems || defaultNavItems;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
                  ...(isMobile && { display: "none" }),
                }}
              >
                {item.label}
              </Button>
            </motion.div>
          ))}
        </NavContext.Provider>
      </Box>
    </motion.div>
  );
};

export default NavigationButtons;