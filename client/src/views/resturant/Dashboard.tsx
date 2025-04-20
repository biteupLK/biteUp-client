import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Stack,
  LinearProgress,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import OrdersIcon from "@mui/icons-material/ShoppingCart";
import RevenueIcon from "@mui/icons-material/AttachMoney";
import CustomersIcon from "@mui/icons-material/Group";
import StarIcon from "@mui/icons-material/Star";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { styled } from "@mui/material/styles";

// Styled components
const StatCard = styled(Card)(({ theme }) => ({
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
  },
}));

interface DashboardProps {
  // You can add any props you might need
}

const Dashboard: React.FC<DashboardProps> = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Mock data
  const stats = [
    {
      title: "Today's Orders",
      value: "24",
      change: "+12%",
      icon: <OrdersIcon />,
      color: "secondary",
    },
    {
      title: "Revenue",
      value: "$1,245",
      change: "+8%",
      icon: <RevenueIcon />,
      color: "secondary",
    },
    {
      title: "Active Customers",
      value: "156",
      change: "+5%",
      icon: <CustomersIcon />,
      color: "secondary",
    },
    {
      title: "Avg. Rating",
      value: "4.8",
      change: "+0.2",
      icon: <StarIcon />,
      color: "secondary",
    },
  ];

  const recentOrders = [
    {
      id: "#12345",
      customer: "John Doe",
      items: 3,
      total: "$45.50",
      status: "Preparing",
      time: "12 min",
    },
    {
      id: "#12346",
      customer: "Jane Smith",
      items: 2,
      total: "$32.00",
      status: "On the way",
      time: "5 min",
    },
    {
      id: "#12347",
      customer: "Robert Johnson",
      items: 5,
      total: "$78.25",
      status: "Delivered",
      time: "22 min",
    },
    {
      id: "#12348",
      customer: "Emily Davis",
      items: 1,
      total: "$12.99",
      status: "Pending",
      time: "35 min",
    },
  ];

  const popularItems = [
    { name: "Cheeseburger", orders: 42, progress: 80 },
    { name: "Chicken Wings", orders: 35, progress: 65 },
    { name: "Margherita Pizza", orders: 28, progress: 55 },
    { name: "Caesar Salad", orders: 22, progress: 45 },
    { name: "Chocolate Cake", orders: 18, progress: 35 },
  ];

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      {/* Welcome Header */}
      <Box sx={{ mb: isMobile ? 2 : 4 }}>
        <Typography variant={isMobile ? "h5" : "h4"} fontWeight="600" gutterBottom>
          Welcome back, Restaurant Name!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your restaurant today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={isMobile ? 1 : 3} sx={{ mb: isMobile ? 2 : 3 }}>
        {stats.map((stat, index) => (
          <Grid item xs={6} sm={6} md={3} key={index}>
            <StatCard>
              <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
                <Stack
                  direction={isMobile ? "column" : "row"}
                  alignItems={isMobile ? "flex-start" : "center"}
                  justifyContent="space-between"
                  spacing={isMobile ? 0.5 : 0}
                >
                  <Box>
                    <Typography 
                      variant={isMobile ? "caption" : "body2"} 
                      color="text.secondary" 
                      gutterBottom={!isMobile}
                    >
                      {stat.title}
                    </Typography>
                    <Typography variant={isMobile ? "h6" : "h4"} fontWeight="700">
                      {stat.value}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <TrendingUpIcon fontSize="small" color="secondary" />
                      <Typography variant={isMobile ? "caption" : "body2"} color="secondary.main">
                        {stat.change}
                      </Typography>
                    </Stack>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: "secondary.light",
                      color: "secondary.main",
                      width: isMobile ? 36 : 48,
                      height: isMobile ? 36 : 48,
                      mt: isMobile ? 0.5 : 0,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                </Stack>
              </CardContent>
            </StatCard>
          </Grid>
        ))}
      </Grid>

      {/* Recent Orders and Popular Items */}
      <Grid container spacing={isMobile ? 1 : 3}>
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: isMobile ? 1 : 3,
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight="600">
                Recent Orders
              </Typography>
              <IconButton size={isMobile ? "small" : "medium"}>
                <MoreVertIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            </Box>
            <Box sx={{ overflowX: "auto" }}>
              <Box component="table" sx={{ 
                width: "100%", 
                borderCollapse: "collapse",
                minWidth: isMobile ? "600px" : "100%"
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: "transparent",
                    borderBottom: "1px solid rgba(0,0,0,0.1)",
                  }}>
                    <th style={{ 
                      padding: isMobile ? "8px 12px" : "12px 16px", 
                      textAlign: "left",
                      fontSize: isMobile ? "0.75rem" : "0.875rem"
                    }}>
                      Order ID
                    </th>
                    <th style={{ 
                      padding: isMobile ? "8px 12px" : "12px 16px", 
                      textAlign: "left",
                      fontSize: isMobile ? "0.75rem" : "0.875rem"
                    }}>
                      Customer
                    </th>
                    <th style={{ 
                      padding: isMobile ? "8px 12px" : "12px 16px", 
                      textAlign: "left",
                      fontSize: isMobile ? "0.75rem" : "0.875rem"
                    }}>
                      Total
                    </th>
                    <th style={{ 
                      padding: isMobile ? "8px 12px" : "12px 16px", 
                      textAlign: "left",
                      fontSize: isMobile ? "0.75rem" : "0.875rem"
                    }}>
                      Status
                    </th>
                    <th style={{ 
                      padding: isMobile ? "8px 12px" : "12px 16px", 
                      textAlign: "left",
                      fontSize: isMobile ? "0.75rem" : "0.875rem"
                    }}>
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr
                      key={index}
                      style={{
                        borderBottom: "1px solid rgba(0,0,0,0.05)",
                      }}
                    >
                      <td style={{ 
                        padding: isMobile ? "12px" : "16px",
                        fontSize: isMobile ? "0.875rem" : "1rem"
                      }}>
                        <Typography fontWeight="500">{order.id}</Typography>
                      </td>
                      <td style={{ 
                        padding: isMobile ? "12px" : "16px",
                        fontSize: isMobile ? "0.875rem" : "1rem"
                      }}>
                        {order.customer}
                      </td>
                      <td style={{ 
                        padding: isMobile ? "12px" : "16px",
                        fontSize: isMobile ? "0.875rem" : "1rem"
                      }}>
                        <Typography fontWeight="500">{order.total}</Typography>
                      </td>
                      <td style={{ 
                        padding: isMobile ? "12px" : "16px",
                        fontSize: isMobile ? "0.875rem" : "1rem"
                      }}>
                        <Box
                          component="span"
                          sx={{
                            px: 1,
                            py: 0.5,
                            borderRadius: "12px",
                            bgcolor:
                              order.status === "Delivered"
                                ? "rgba(76, 175, 80, 0.1)"
                                : order.status === "On the way"
                                ? "rgba(33, 150, 243, 0.1)"
                                : order.status === "Preparing"
                                ? "rgba(255, 152, 0, 0.1)"
                                : "rgba(244, 67, 54, 0.1)",
                            color:
                              order.status === "Delivered"
                                ? "#4CAF50"
                                : order.status === "On the way"
                                ? "#2196F3"
                                : order.status === "Preparing"
                                ? "#FF9800"
                                : "#F44336",
                            fontSize: isMobile ? "0.65rem" : "0.75rem",
                            fontWeight: "600",
                            display: "inline-block",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {order.status}
                        </Box>
                      </td>
                      <td style={{ 
                        padding: isMobile ? "12px" : "16px",
                        fontSize: isMobile ? "0.875rem" : "1rem"
                      }}>
                        <Typography color="text.secondary">
                          {order.time}
                        </Typography>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: isMobile ? 1 : 3,
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Popular Items
            </Typography>
            <Box>
              {popularItems.map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant={isMobile ? "body2" : "body1"}>
                      {item.name}
                    </Typography>
                    <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
                      {item.orders} orders
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={item.progress}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: "rgba(255, 152, 0, 0.1)",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "secondary.main",
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;