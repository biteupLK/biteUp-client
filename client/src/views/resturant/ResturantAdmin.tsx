import React, { useState, useEffect, useRef } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout, SidebarFooterProps } from '@toolpad/core/DashboardLayout';
import {
  Account,
  AccountPreview,
  AccountPopoverFooter,
  SignOutButton,
  AccountPreviewProps,
} from '@toolpad/core/Account';
import type { Navigation, Router, Session } from '@toolpad/core/AppProvider';

import logo from "../../assets/logo/biteUpLogo.png";



// Component imports
import Dashboard from "./Dashboard";
import Menu from "./MenuManager";
import Orders from "./Orders";
import Settings from "../homePage/UserHome";

const RestaurantAdmin: React.FC = () => {

  
  

  return (
    <Box>
    </Box>
  );
};

export default RestaurantAdmin;