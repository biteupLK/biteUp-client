import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Avatar,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
  Skeleton,
} from "@mui/material";
import {
  TrendingUp,
  RestaurantMenu,
  People,
  Star,
  AttachMoney,
  ExpandMore,
  ArrowForward,
} from "@mui/icons-material";

// Custom color palette based on original design
const customPalette = {
  primary: {
    main: "surface",
    light: "rgba(58, 77, 57, 0.1)",
    contrastText: "#fff",
  },
  success: {
    main: "#3a4d39",
    light: "rgba(58, 77, 57, 0.1)",
  },
  warning: {
    main: "#f59e0b",
    light: "rgba(245, 158, 11, 0.1)",
  },
  text: {
    primary: "#2d3748",
    secondary: "#718096",
  },
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  loading?: boolean;
}

// Dashboard Stats Card Component
const StatCard = ({ title, value, icon, trend, loading = false }: StatCardProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 3,
        height: "100%",
        backgroundColor: "white",
        border: "1px solid",
        borderColor: "#e2e8f0",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
          borderColor: "#3a4d39",
        },
      }}
    >
      <Box sx={{ width: '70%' }}>
        <Typography
          color={customPalette.text.secondary}
          variant="body2"
          fontWeight="medium"
        >
          {loading ? <Skeleton width="60%" /> : title}
        </Typography>
        <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
          {loading ? <Skeleton /> : value}
        </Typography>
        {trend && (
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            {loading ? (
              <Skeleton width="80%" />
            ) : (
              <>
                <TrendingUp
                  sx={{
                    fontSize: 16,
                    color: trend.includes("+")
                      ? customPalette.primary.main
                      : "#e53e3e",
                    mr: 0.5,
                  }}
                />
                <Typography
                  variant="caption"
                  color={
                    trend.includes("+") ? customPalette.primary.main : "#e53e3e"
                  }
                  fontWeight="bold"
                >
                  {trend}
                </Typography>
              </>
            )}
          </Box>
        )}
      </Box>
      <Avatar
        sx={{
          bgcolor: loading ? '#e2e8f0' : customPalette.primary.light,
          width: 56,
          height: 56,
          color: loading ? 'transparent' : customPalette.primary.main,
        }}
      >
        {loading ? null : icon}
      </Avatar>
    </Paper>
  );
};

// Revenue Chart Component
const RevenueChart = ({ loading = false }: { loading?: boolean }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        height: "100%",
        minHeight: "300px",
        backgroundColor: "white",
        border: "1px solid",
        borderColor: "#e2e8f0",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 2 : 0,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {loading ? <Skeleton width={180} /> : "Revenue Overview"}
        </Typography>
        {loading ? (
          <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 2 }} />
        ) : (
          <Button
            endIcon={<ExpandMore />}
            size="small"
            sx={{
              color: customPalette.text.secondary,
              border: "1px solid",
              borderColor: "#e2e8f0",
              borderRadius: 2,
              "&:hover": {
                borderColor: customPalette.primary.main,
                color: customPalette.primary.main,
              },
            }}
          >
            This Week
          </Button>
        )}
      </Box>
      <Box
        sx={{
          height: "240px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(58, 77, 57, 0.05)",
          borderRadius: 2,
        }}
      >
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height="100%" />
        ) : (
          <Typography color={customPalette.text.secondary}>
            Revenue Chart Placeholder
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

// Popular Menu Items Component
const PopularItems = ({ loading = false }: { loading?: boolean }) => {
  const items = [
    { name: "Spaghetti Carbonara", sales: 142, trend: "+12%" },
    { name: "Margherita Pizza", sales: 98, trend: "+8%" },
    { name: "Grilled Salmon", sales: 87, trend: "+15%" },
    { name: "Caesar Salad", sales: 65, trend: "-3%" },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        height: "100%",
        backgroundColor: "white",
        border: "1px solid",
        borderColor: "#e2e8f0",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {loading ? <Skeleton width={140} /> : "Popular Items"}
        </Typography>
        {loading ? (
          <Skeleton width={80} />
        ) : (
          <Button
            size="small"
            endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
            sx={{
              color: customPalette.text.secondary,
              "&:hover": {
                color: customPalette.primary.main,
              },
            }}
          >
            View All
          </Button>
        )}
      </Box>
      <Stack spacing={2}>
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Box key={i}>
                <Skeleton width="60%" height={24} />
                <Skeleton width="40%" height={20} />
              </Box>
            ))}
          </>
        ) : (
          items.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="body1" fontWeight="medium">
                  {item.name}
                </Typography>
                <Typography variant="body2" color={customPalette.text.secondary}>
                  {item.sales} orders
                </Typography>
              </Box>
              <Typography
                variant="body2"
                fontWeight="bold"
                color={
                  item.trend.includes("+")
                    ? customPalette.primary.main
                    : "#e53e3e"
                }
              >
                {item.trend}
              </Typography>
            </Box>
          ))
        )}
      </Stack>
    </Paper>
  );
};

// Recent Orders Component
const RecentOrders = ({ loading = false }: { loading?: boolean }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  type OrderStatus = "Completed" | "In Progress" | "Pending";

  interface Order {
    id: string;
    customer: string;
    time: string;
    total: string;
    status: OrderStatus;
  }

  const orders: Order[] = [
    {
      id: "#ORD-7265",
      customer: "John Smith",
      time: "12:45 PM",
      total: "$124.00",
      status: "Completed",
    },
    {
      id: "#ORD-7264",
      customer: "Emma Johnson",
      time: "11:30 AM",
      total: "$86.50",
      status: "In Progress",
    },
    {
      id: "#ORD-7263",
      customer: "Michael Brown",
      time: "10:15 AM",
      total: "$210.75",
      status: "Completed",
    },
    {
      id: "#ORD-7262",
      customer: "Sarah Davis",
      time: "9:20 AM",
      total: "$57.25",
      status: "Pending",
    },
  ];

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "Completed":
        return customPalette.primary.main;
      case "In Progress":
        return customPalette.warning.main;
      case "Pending":
        return customPalette.text.secondary;
      default:
        return customPalette.primary.main;
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        backgroundColor: "white",
        border: "1px solid",
        borderColor: "#e2e8f0",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {loading ? <Skeleton width={140} /> : "Recent Orders"}
        </Typography>
        {loading ? (
          <Skeleton width={80} />
        ) : (
          <Button
            size="small"
            endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
            sx={{
              color: customPalette.text.secondary,
              "&:hover": {
                color: customPalette.primary.main,
              },
            }}
          >
            View All
          </Button>
        )}
      </Box>
      <Stack spacing={2} divider={<Divider flexItem />}>
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? 2 : 0,
                  py: isMobile ? 0 : 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box>
                    <Skeleton width={100} height={24} />
                    <Skeleton width={180} height={20} />
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexDirection: isMobile ? "column" : "row",
                    textAlign: isMobile ? "center" : "right",
                  }}
                >
                  <Skeleton width={60} height={24} />
                  <Skeleton width={80} height={32} sx={{ borderRadius: 2 }} />
                </Box>
              </Box>
            ))}
          </>
        ) : (
          orders.map((order, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 2 : 0,
                py: isMobile ? 0 : 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: customPalette.primary.light,
                    color: customPalette.primary.main,
                    width: 40,
                    height: 40,
                    fontSize: "0.9rem",
                  }}
                >
                  {order.customer
                    .split(" ")
                    .map((name) => name[0])
                    .join("")}
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    {order.id}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={customPalette.text.secondary}
                  >
                    {order.customer} • {order.time}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flexDirection: isMobile ? "column" : "row",
                  textAlign: isMobile ? "center" : "right",
                }}
              >
                <Typography variant="body1" fontWeight="medium">
                  {order.total}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: getStatusColor(order.status),
                    backgroundColor:
                      order.status === "Completed"
                        ? customPalette.primary.light
                        : order.status === "In Progress"
                          ? customPalette.warning.light
                          : "rgba(113, 128, 150, 0.1)",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                  }}
                >
                  {order.status}
                </Typography>
              </Box>
            </Box>
          ))
        )}
      </Stack>
    </Paper>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: isMobile ? 2 : 3,
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          color={customPalette.primary.main}
        >
          {loading ? <Skeleton width={300} /> : "Restaurant Dashboard"}
        </Typography>
        <Typography variant="body1" color={customPalette.text.secondary}>
          {loading ? (
            <Skeleton width="80%" />
          ) : (
            "Welcome back! Here's what's happening with your restaurant today."
          )}
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={3}
        sx={{ mb: 3 }}
        divider={isMobile ? <Divider flexItem /> : null}
      >
        <Box sx={{ width: isMobile ? "100%" : "25%" }}>
          <StatCard
            title="Today's Revenue"
            value="$3,456"
            icon={<AttachMoney />}
            trend="+8% from yesterday"
            loading={loading}
          />
        </Box>
        <Box sx={{ width: isMobile ? "100%" : "25%" }}>
          <StatCard
            title="Total Orders"
            value="78"
            icon={<RestaurantMenu />}
            trend="+12% from yesterday"
            loading={loading}
          />
        </Box>
        <Box sx={{ width: isMobile ? "100%" : "25%" }}>
          <StatCard
            title="Customers"
            value="145"
            icon={<People />}
            trend="+5% from yesterday"
            loading={loading}
          />
        </Box>
        <Box sx={{ width: isMobile ? "100%" : "25%" }}>
          <StatCard
            title="Avg. Rating"
            value="4.8"
            icon={<Star />}
            trend="+0.2 from last week"
            loading={loading}
          />
        </Box>
      </Stack>

      {/* Charts and Tables */}
      <Stack direction={isMobile ? "column" : "row"} spacing={3} sx={{ mb: 3 }}>
        <Box sx={{ width: isMobile ? "100%" : "66.66%" }}>
          <RevenueChart loading={loading} />
        </Box>
        <Box sx={{ width: isMobile ? "100%" : "33.33%" }}>
          <PopularItems loading={loading} />
        </Box>
      </Stack>

      <Box sx={{ width: "100%" }}>
        <RecentOrders loading={loading} />
      </Box>
    </Box>
  );
};

export default Dashboard;