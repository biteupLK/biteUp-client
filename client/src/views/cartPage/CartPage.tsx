import React, { useState } from "react";
import {
  Box,
  Typography,
  CardMedia,
  Stack,
  IconButton,
  Button,
  Paper,
  Badge,
  List,
  ListItem,
  useTheme,
  alpha,
  Divider,
  Chip,
  useMediaQuery,
  Container,
  Card,
  CardContent,
  Skeleton,
  Fade,
  Slide,
  Drawer,
  SwipeableDrawer,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  LocationOn as LocationOnIcon,
  ShoppingCart as ShoppingCartIcon,
  ArrowBack as ArrowBackIcon,
  Storefront as StorefrontIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Payment as PaymentIcon,
  Info as InfoIcon,
  Restaurant as RestaurantIcon,
} from "@mui/icons-material";
import { loadStripe } from "@stripe/stripe-js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteCartItems, fetchCartItems } from "../../api/cartApi";
import getUserDetails from "../../customHooks/extractPayload";
import { createPayment } from "../../api/paymentApi";
import { enqueueSnackbar } from "notistack";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo/biteUpLogo.png";
import queryClient from "../../state/queryClient";

interface CartItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  signedUrl: string;
  phoneNumber: string;
  restaurantEmail: string;
  resName: string;
  address: string;
}

interface OrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  handleCheckout: (items: CartItem[]) => void;
  email: string | undefined;
}

interface CartItemProps {
  item: CartItem;
  isMobile: boolean;
  onRemove: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PAYMENT_KEY);

const CartItem: React.FC<CartItemProps> = ({
  item,
  isMobile,
  onRemove,
  onUpdateQuantity,
}) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        p: 0,
        borderRadius: "16px",
        bgcolor: "white",
        position: "relative",
        border: `1px solid ${theme.palette.grey[100]}`,
        overflow: "visible",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ p: isMobile ? 2 : 3 }}>
        <Tooltip title="Remove item">
          <IconButton
            size="small"
            onClick={() => onRemove(item.id)}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              bgcolor: theme.palette.grey[100],
              color: theme.palette.grey[700],
              "&:hover": {
                bgcolor: theme.palette.error.light,
                color: theme.palette.error.contrastText,
              },
              width: 30,
              height: 30,
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Stack direction="row" spacing={2}>
          <Box sx={{ position: "relative" }}>
            <CardMedia
              component="img"
              sx={{
                width: isMobile ? 80 : 100,
                height: isMobile ? 80 : 100,
                borderRadius: "12px",
                objectFit: "cover",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              image={item.signedUrl}
              alt={item.name}
            />
            <Chip
              label={`x${item.id}`}
              size="small"
              sx={{
                position: "absolute",
                top: -8,
                right: -8,
                bgcolor: theme.palette.primary.main,
                color: "white",
                fontSize: "12px",
                height: "22px",
                fontWeight: "bold",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            />
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 0.5 }}>
              {item.name}
            </Typography>

            {!isMobile && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.description || "Delicious food item from this restaurant"}
              </Typography>
            )}

            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color="primary"
              sx={{ mb: 2 }}
            >
              Rs {item.price.toFixed(2)}
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent={isMobile ? "space-between" : "flex-start"}
              spacing={2}
            >
              <Stack
                direction="row"
                alignItems="center"
                sx={{
                  border: `1px solid ${theme.palette.grey[200]}`,
                  borderRadius: "20px",
                  px: 1,
                  py: 0.5,
                  bgcolor: theme.palette.grey[50],
                }}
              >
                <IconButton
                  size="small"
                  onClick={() =>
                    onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                  }
                  sx={{
                    color: theme.palette.primary.main,
                    p: 0.5,
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>

                <Typography
                  sx={{
                    minWidth: "28px",
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  {item.quantity}
                </Typography>

                <IconButton
                  size="small"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  sx={{
                    color: theme.palette.primary.main,
                    p: 0.5,
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Stack>

              {isMobile && (
                <Typography fontWeight="700" color="text.primary">
                  Rs {(item.price * item.quantity).toFixed(2)}
                </Typography>
              )}
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartItems,
  subtotal,
  deliveryFee,
  total,
  handleCheckout,
  email,
}) => {
  const theme = useTheme();
  const totalItems = cartItems.length;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: "16px",
        bgcolor: "white",
        border: `1px solid ${theme.palette.grey[100]}`,
      }}
    >
      <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
        Payment Details
      </Typography>

      <List sx={{ mb: 3 }}>
        {cartItems.map((item) => (
          <ListItem
            key={item.id}
            sx={{
              p: 0,
              mb: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ width: "100%", mb: 1 }}>
              <Typography variant="subtitle2" fontWeight="600">
                {item.name} (x{item.quantity})
              </Typography>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Rs {item.price.toFixed(2)} each
                </Typography>
                <Typography variant="body2" fontWeight="600">
                  Rs {(item.price * item.quantity).toFixed(2)}
                </Typography>
              </Stack>
            </Box>

            <Button
              fullWidth
              variant="outlined"
              size="small"
              onClick={() => handleCheckout([item])}
              disabled={!email}
              startIcon={<PaymentIcon fontSize="small" />}
              sx={{
                borderRadius: "8px",
                py: 1,
                fontWeight: "500",
                textTransform: "none",
                fontSize: "14px",
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  borderColor: theme.palette.primary.dark,
                },
              }}
            >
              Pay for this item
            </Button>
          </ListItem>
        ))}
      </List>

      <Stack spacing={1.5}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            Subtotal ({totalItems} items)
          </Typography>
          <Typography variant="body2" fontWeight="500">
            Rs {subtotal.toFixed(2)}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            Delivery Fee
          </Typography>
          <Typography variant="body2" fontWeight="500">
            Rs {deliveryFee.toFixed(2)}
          </Typography>
        </Stack>

        <Divider sx={{ my: 1 }} />

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="subtitle1" fontWeight="700">
            Total
          </Typography>
          <Typography variant="subtitle1" fontWeight="700" color="primary">
            Rs {total.toFixed(2)}
          </Typography>
        </Stack>
      </Stack>

      {/* <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={() => handleCheckout(cartItems)}
        disabled={!email || totalItems === 0}
        startIcon={<PaymentIcon />}
        sx={{
          mt: 3,
          borderRadius: "12px",
          py: 1.5,
          fontWeight: "bold",
          textTransform: "none",
          fontSize: "16px",
          boxShadow: "0 4px 12px rgba(34, 172, 116, 0.2)",
          "&:disabled": { 
            bgcolor: theme.palette.grey[200], 
            color: theme.palette.grey[500] 
          },
        }}
      >
        Pay All Items (Rs {total.toFixed(2)})
      </Button> */}
    </Paper>
  );
};

const EmptyCart: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
        textAlign: "center",
        p: 3,
      }}
    >
      <Box
        sx={{
          bgcolor: alpha(theme.palette.grey[200], 0.6),
          borderRadius: "50%",
          p: 3,
          mb: 3,
          width: 120,
          height: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ShoppingCartIcon
          sx={{ fontSize: 64, color: theme.palette.grey[500] }}
        />
      </Box>

      <Typography
        variant="h5"
        fontWeight="600"
        color="text.primary"
        sx={{ mb: 1 }}
      >
        Your cart is empty
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, maxWidth: 400 }}
      >
        Looks like you haven't added any items to your cart yet. Explore our
        delicious food options!
      </Typography>

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => navigate("/")}
        startIcon={<RestaurantIcon />}
        sx={{
          borderRadius: "12px",
          py: 1.5,
          px: 3,
          fontWeight: "bold",
          textTransform: "none",
          fontSize: "16px",
          boxShadow: "0 4px 12px rgba(34, 172, 116, 0.2)",
        }}
      >
        Browse Restaurants
      </Button>
    </Box>
  );
};

interface PaymentData {
  foodName: string;
  currency: string;
  amount: number;
  email: string | undefined;
  customerPhone: string;
  signedUrl: string;
  restaurantEmail: string;
}

const CartPage: React.FC = () => {
  const theme = useTheme();
  theme.palette.primary = {
    ...theme.palette.primary,
    main: "#22ac74",
    light: "#e6f7ef",
    dark: "#1e9d6b",
    contrastText: "#ffffff",
  };

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const userDetails = getUserDetails();
  const email = userDetails?.email;
  const [message, setMessage] = useState<string>("");
  const [openMobileSummary, setOpenMobileSummary] = useState<boolean>(false);

  const { mutate: deleteCartItemMutation } = useMutation({
    mutationFn: deleteCartItems,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const removeItem = (itemId: string) => {
    console.log("Remove item:", itemId);
    deleteCartItemMutation(itemId);
    enqueueSnackbar("Item removed from cart", { variant: "success" });
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    console.log("Update quantity:", itemId, newQuantity);
  };

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["cartItems", email],
    queryFn: () => fetchCartItems(email!),
    enabled: !!email,
  });

  const subtotal = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = 0;
  const total = subtotal + deliveryFee;
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
    onError: (error: any) => {
      const errorMsg = error?.response?.data?.message ?? "Payment Failed";
      enqueueSnackbar(errorMsg, { variant: "error" });
      setMessage(errorMsg);
    },
  });

  const handleCheckout = (itemsToPay: CartItem[]) => {
    if (!email || itemsToPay.length === 0) return;

    itemsToPay.forEach((item: CartItem) => {
      const paymentData: PaymentData = {
        foodName: item.name,
        currency: "LKR",
        amount: item.price * item.quantity,
        email,
        customerPhone: item.phoneNumber,
        signedUrl: item.signedUrl,
        restaurantEmail: item.restaurantEmail,
      };
      paymentMutation(paymentData);
    });
  };

  const toggleMobileSummary = () => {
    setOpenMobileSummary(!openMobileSummary);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.grey[50],
        pb: isMobile ? 8 : 0,
      }}
    >
      <Box
        sx={{
          width: "100%",
          p: isSmall ? 2 : 3,
          bgcolor: "white",
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        <Container maxWidth="xl">
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Link to="/">
                <IconButton
                  sx={{
                    bgcolor: theme.palette.grey[100],
                    "&:hover": { bgcolor: theme.palette.grey[200] },
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
              </Link>
              <Typography variant="h5" fontWeight="700">
                {isMobile ? "Your Cart" : "Order Summary"}
              </Typography>
            </Stack>

            {isMobile && (
              <Stack direction="row" spacing={1}>
                <Box
                  component="img"
                  src={logo}
                  alt="Logo"
                  sx={{
                    height: { xs: 80, sm: 110 },
                    maxWidth: { xs: 120, sm: "auto" },
                  }}
                />
              </Stack>
            )}
          </Stack>
        </Container>
      </Box>
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        {isLoading ? (
          <Box sx={{ py: 4 }}>
            <Stack spacing={3}>
              {[1, 2, 3].map((item: number) => (
                <Skeleton
                  key={item}
                  variant="rectangular"
                  height={isMobile ? 120 : 160}
                  sx={{ borderRadius: "16px" }}
                />
              ))}
            </Stack>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 4,
            }}
          >
            <Box sx={{ width: isMobile ? "100%" : "60%" }}>
              {cartItems.length === 0 ? (
                <EmptyCart />
              ) : (
                <>
                  {cartItems[0] && (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: "16px",
                        bgcolor: "white",
                        border: `1px solid ${theme.palette.grey[100]}`,
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            p: 1,
                            width: 56,
                            height: 56,
                          }}
                        >
                          <StorefrontIcon
                            sx={{
                              color: theme.palette.primary.main,
                              fontSize: 28,
                            }}
                          />
                        </Avatar>

                        <Box>
                          <Typography variant="h6" fontWeight="600">
                            {cartItems[0].resName}
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                          >
                            <LocationOnIcon
                              sx={{
                                color: theme.palette.text.secondary,
                                fontSize: 18,
                              }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {cartItems[0].address}
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>
                    </Paper>
                  )}

                  <Typography
                    variant="h6"
                    fontWeight="600"
                    sx={{ mb: 2, ml: 1 }}
                  >
                    Your Items ({totalItems})
                  </Typography>

                  <Stack spacing={2}>
                    {cartItems.map((item: CartItem, index: number) => (
                      <Fade in={true} key={item.id} timeout={300 + index * 150}>
                        <Box>
                          <CartItem
                            item={item}
                            isMobile={isMobile}
                            onRemove={removeItem}
                            onUpdateQuantity={updateQuantity}
                          />
                        </Box>
                      </Fade>
                    ))}
                  </Stack>
                </>
              )}
            </Box>

            {!isMobile && cartItems.length > 0 && (
              <Box sx={{ width: "40%" }}>
                <Box
                  sx={{
                    position: "sticky",
                    top: 100,
                  }}
                >
                  <Slide direction="left" in={true} mountOnEnter unmountOnExit>
                    <Box>
                      <OrderSummary
                        cartItems={cartItems}
                        subtotal={subtotal}
                        deliveryFee={deliveryFee}
                        total={total}
                        handleCheckout={handleCheckout}
                        email={email}
                      />
                    </Box>
                  </Slide>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Container>
      {isMobile && (
        <SwipeableDrawer
          anchor="bottom"
          open={openMobileSummary}
          onClose={() => setOpenMobileSummary(false)}
          onOpen={() => setOpenMobileSummary(true)}
          disableSwipeToOpen={false}
          swipeAreaWidth={30}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <Box
            sx={{
              p: 2,
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography variant="h6" fontWeight="600">
                Order Summary
              </Typography>
              <IconButton onClick={() => setOpenMobileSummary(false)}>
                <CloseIcon />
              </IconButton>
            </Stack>

            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              total={total}
              handleCheckout={handleCheckout}
              email={email}
            />
          </Box>
        </SwipeableDrawer>
      )}
      // Update the mobile bottom sheet in the CartPage component
      {isMobile && cartItems.length > 0 && !openMobileSummary && (
        <Paper
          elevation={3}
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            bgcolor: "white",
            zIndex: 99,
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
          }}
        >
          <Stack spacing={1}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {totalItems} items
                </Typography>
                <Typography variant="h6" fontWeight="700" color="primary">
                  Rs {total.toFixed(2)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                onClick={toggleMobileSummary}
                startIcon={<PaymentIcon />}
                sx={{
                  borderRadius: "10px",
                  py: 1.2,
                  px: 3,
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "16px",
                }}
              >
                View Items
              </Button>
            </Stack>

            {/* <Button
        variant="outlined"
        fullWidth
        onClick={toggleMobileSummary}
        sx={{
          borderRadius: "10px",
          py: 1,
          fontWeight: "500",
          textTransform: "none",
          fontSize: "14px",
          borderColor: theme.palette.primary.main,
          color: theme.palette.primary.main,
        }}
      >
        Pay Items Individually
      </Button> */}
          </Stack>
        </Paper>
      )}
    </Box>
  );
};

export default CartPage;
