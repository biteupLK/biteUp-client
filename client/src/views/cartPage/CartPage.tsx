import React from "react";
import {
  Box,
  Typography,
  CardMedia,
  CardContent,
  Stack,
  IconButton,
  Divider,
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
import { useQuery } from "@tanstack/react-query";
import { fetchCartItems } from "../../api/cartApi";
import getUserDetails from "../../customHooks/extractPayload";

const CartPage: React.FC = () => {
  const theme = useTheme();
  const userDetails = getUserDetails();
  const email = userDetails?.email;

  // Fetch cart items data
  const { data: cartItems = [] } = useQuery({
    queryKey: ["cartItems", email],
    queryFn: () => fetchCartItems(email!),
  });

  const totalItems = cartItems.length;
  const subtotal = cartItems.reduce(
    (sum: any, item: any) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = 50; // Assuming a fixed delivery fee
  const total = subtotal + deliveryFee;

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
          bgcolor: theme.palette.background.paper,
          position: "relative",
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

      {/* Restaurant info */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
        }}
      >
        {cartItems[0] && (
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                p: 1,
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <StorefrontIcon color="primary" />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
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
        )}
      </Paper>

      {/* Cart Items */}
      <Typography variant="h6" fontWeight="600" sx={{ mb: 2, px: 1 }}>
        Order Items
      </Typography>

      <List disablePadding>
        {cartItems.map((item: any, index: any) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              mb: 2,
              borderRadius: 2,
              overflow: "hidden",
              bgcolor: theme.palette.background.paper,
            }}
          >
            <ListItem disablePadding>
              <Stack direction="row" sx={{ width: "100%" }}>
                {/* Food Image */}
                <CardMedia
                  component="img"
                  sx={{ width: 100, height: 100, objectFit: "cover" }}
                  image={item.signedUrl}
                  alt={item.name}
                />

                {/* Food Details */}
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

                  {/* Quantity */}
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mt: 1 }}
                  >
                    <Typography sx={{ width: 32, textAlign: "center" }}>
                      {item.quantity}
                    </Typography>
                  </Stack>
                </CardContent>
              </Stack>
            </ListItem>
          </Paper>
        ))}
      </List>

      {/* Order Summary */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mt: 3,
          mb: 2,
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
          Order Summary
        </Typography>

        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Subtotal</Typography>
            <Typography fontWeight="500">Rs {subtotal.toFixed(2)}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Delivery Fee</Typography>
            <Typography fontWeight="500">
              Rs {deliveryFee.toFixed(2)}
            </Typography>
          </Stack>

          <Divider sx={{ my: 1 }} />

          <Stack direction="row" justifyContent="space-between">
            <Typography fontWeight="600">Total</Typography>
            <Typography fontWeight="700" color="primary.main">
              Rs {total.toFixed(2)}
            </Typography>
          </Stack>
        </Stack>
      </Paper>

      {/* Checkout Button */}
      <Button
        variant="contained"
        fullWidth
        size="large"
        sx={{
          mt: 2,
          mb: 4,
          py: 1.5,
          borderRadius: 2,
          fontWeight: 600,
          boxShadow: 2,
          textTransform: "none",
        }}
      >
        Proceed to Checkout
      </Button>
    </Box>
  );
};

export default CartPage;
