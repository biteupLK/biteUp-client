import React, { useState } from "react";
import {
  Box,
  Typography,
  CardMedia,
  CardContent,
  Stack,
  IconButton,
  Button,
  Paper,
  Badge,
  List,
  ListItem,
  useTheme,
  alpha,
} from "@mui/material";
import {
  LocationOn as LocationOnIcon,
  ShoppingCart as ShoppingCartIcon,
  ArrowBack as ArrowBackIcon,
  Storefront as StorefrontIcon,
} from "@mui/icons-material";
import { loadStripe } from "@stripe/stripe-js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchCartItems } from "../../api/cartApi";
import getUserDetails from "../../customHooks/extractPayload";
import { createPayment } from "../../api/paymentApi";
import { enqueueSnackbar } from "notistack";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PAYMENT_KEY);

const CartPage: React.FC = () => {
  const theme = useTheme();
  const userDetails = getUserDetails();
  const email = userDetails?.email;
  const [message, setMessage] = useState("");
  console.log(message);

  const { data: cartItems = [] } = useQuery({
    queryKey: ["cartItems", email],
    queryFn: () => fetchCartItems(email!),
  });

  const totalItems = cartItems.length;
  const { mutate: paymentMutation } = useMutation({
    mutationFn: createPayment,
    onSuccess: async (data) => {
      const stripe = await stripePromise;
      if (data.id && stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.id,
        });
        if (error) {
          setMessage(error.message || "An unknown error occurred.");
        } else {
          enqueueSnackbar("Redirecting to Stripe...", { variant: "info" });
        }
      } else {
        setMessage("Failed to create checkout session.");
      }
    },
    onError: (error) => {
      const errorMsg =
        (error as any)?.response?.data?.message ?? "Payment Failed";
      enqueueSnackbar(errorMsg, { variant: "error" });
      setMessage(errorMsg);
    },
  });

  const handleItemPayment = (item: any) => {
    const paymentData = {
      foodName: item.name,
      currency: "LKR",
      amount: item.price,
      email,
      customerPhone: item.phoneNumber,
      signedUrl: item.signedUrl, // ✅ include the image URL here
    };
    paymentMutation(paymentData);
  };

  return (
    <Box
      sx={{
        bgcolor: alpha(theme.palette.primary.light, 0.05),
        minHeight: "100vh",
        maxWidth: "800px",
        mx: "auto",
        p: { xs: 2, sm: 3 },
      }}
    >
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        <IconButton sx={{ mr: 1 }} color="primary">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="600">
          Your Cart
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Badge badgeContent={totalItems} color="primary">
          <ShoppingCartIcon color="primary" />
        </Badge>
      </Paper>

      {/* Restaurant Info */}
      {cartItems[0] && (
        <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                p: 1,
                borderRadius: 1,
              }}
            >
              <StorefrontIcon color="primary" />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {cartItems[0].resName}
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <LocationOnIcon color="action" fontSize="small" />
                <Typography variant="body2" color="text.secondary" noWrap>
                  {cartItems[0].address}, {cartItems[0].city}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      )}

      {/* Cart Items */}
      <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
        Order Items
      </Typography>
      <List disablePadding>
        {cartItems.map((item: any, index: number) => (
          <Paper key={index} elevation={0} sx={{ mb: 2, borderRadius: 2 }}>
            <ListItem disablePadding>
              <Stack direction="row" sx={{ width: "100%" }}>
                <CardMedia
                  component="img"
                  sx={{ width: 100, height: 100, objectFit: "cover" }}
                  image={item.signedUrl}
                  alt={item.name}
                />
                <CardContent sx={{ flexGrow: 1, py: 1.5 }}>
                  <Typography variant="subtitle1" fontWeight="600">
                    {item.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                    sx={{ mb: 1 }}
                  >
                    {item.description}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    Rs {item.price.toFixed(2)}
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                    <Typography sx={{ width: 32, textAlign: "center" }}>
                      {item.quantity}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => handleItemPayment(item)}
                      disabled={!email}
                    >
                      Pay Now
                    </Button>
                  </Stack>
                </CardContent>
              </Stack>
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default CartPage;
