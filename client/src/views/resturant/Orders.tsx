import { useQuery } from "@tanstack/react-query";
import { CheckoutEvent, fetchRestaurantOrders } from "../../api/myOrdersApi";
import getUserDetails from "../../customHooks/extractPayload";
import { io } from "socket.io-client";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Card,
  CardContent,
  useTheme,
  Button,
} from "@mui/material";
import {
  ShoppingBag,
  Person,
  Email,
  Phone,
  Home,
  Receipt,
} from "@mui/icons-material";
import { fetchRestaurantByEmail } from "../../api/restaurantApi";
import { useEffect, useState } from "react";

const PaidOrders = () => {
  const theme = useTheme();
  const userDetails = getUserDetails();
  const email = userDetails?.email;
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleToDelivery = async (order: CheckoutEvent) => {
    if (!restaurantData?.location || !socket) return;

    const { lat, lng } = restaurantData.location;

    try {
      const res = await fetch(
        `http://localhost:3001/api/nearest-delivery?restaurantLat=${lat}&restaurantLng=${lng}`
      );
      if (!res.ok) throw new Error("Failed to find delivery person");
      
      const data = await res.json();

      const socketId = data.socketId;
      if (!socketId) throw new Error("No delivery person available");

      socket.emit("assign-order", {
        socketId,
        order,
      });

      alert("Order sent to nearest delivery person!");
    } catch (err) {
      console.error(err);
      alert("Failed to assign delivery person: " + (err as Error).message);
    }
  };

  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["paidOrders", email],
    queryFn: () => fetchRestaurantOrders(email!),
    enabled: !!email,
  });

  const { data: restaurantData } = useQuery({
    queryKey: ["res-data", email],
    queryFn: () => fetchRestaurantByEmail(email!),
    enabled: !!email,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Failed to load orders. Please try again.</Alert>
      </Box>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Paper
          elevation={3}
          sx={{ p: 4, borderRadius: 3, maxWidth: 600, mx: "auto" }}
        >
          <ShoppingBag sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            You have no paid orders yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your orders will appear here after you make a purchase
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 900, mx: "auto" }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          My Orders
        </Typography>
        <Typography variant="subtitle1">
          Managing your purchase history
        </Typography>
      </Paper>

      <Stack spacing={3}>
        {orders.map((order: CheckoutEvent) => {
          const m = order?.data?.object?.members;
          const metadata = m?.metadata?.members;
          const customer = m?.billing_details?.members;
          const addr = customer?.address?.members;
          const total = m?.amount?.value?.value;
          const pId = m?.payment_intent?.value;

          return (
            <Card
              key={order.id}
              elevation={2}
              sx={{
                borderRadius: 3,
                overflow: "visible",
                position: "relative",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <Box sx={{ position: "absolute", top: -16, right: 20 }}>
                <Chip
                  label="Paid"
                  color="success"
                  sx={{ fontWeight: "bold", px: 1 }}
                />
              </Box>

              <CardContent sx={{ p: 3 }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems="flex-start"
                  justifyContent="space-between"
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {metadata?.foodName?.value}
                    </Typography>

                    <Stack spacing={1.5} sx={{ mt: 2 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Person fontSize="small" color="action" />
                        <Typography variant="body2">
                          {customer?.name?.value}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <Email fontSize="small" color="action" />
                        <Typography variant="body2">
                          {customer?.email?.value}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <Phone fontSize="small" color="action" />
                        <Typography variant="body2">
                          {metadata?.phone?.value}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="flex-start">
                        <Home fontSize="small" color="action" sx={{ mt: 0.5 }} />
                        <Typography variant="body2">
                          {addr?.line1?.value}
                          {addr?.line2?.value && `, ${addr?.line2?.value}`}
                          <br />
                          {addr?.city?.value}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>

                  <Box>
                    <Paper
                      elevation={0}
                      sx={{
                        backgroundColor: theme.palette.grey[50],
                        p: 2,
                        borderRadius: 2,
                        minWidth: { xs: "100%", sm: 140 },
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Order Total
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        Rs. {(Number(total) / 100).toFixed(2)}

                      </Typography>

                      <Button 
                        variant="contained" 
                        onClick={() => handleToDelivery(order)}
                        sx={{ mt: 1, mb: 1 }}
                      >
                        Assign Delivery
                      </Button>

                      <Divider sx={{ my: 1 }} />
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        spacing={0.5}
                      >
                        <Receipt fontSize="small" color="action" />
                        <Button size="small">
                          <Typography variant="caption" color="text.secondary">
                            Receipt {pId?.slice(0, 8)}
                          </Typography>
                        </Button>
                      </Stack>
                    </Paper>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
};

export default PaidOrders;