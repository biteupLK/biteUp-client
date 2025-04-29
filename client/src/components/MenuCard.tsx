import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Snackbar,
  Typography,
  SnackbarContent,
  Alert,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useMutation } from "@tanstack/react-query";
import { addToCart, Cart } from "../api/cartApi";
import queryClient from "../state/queryClient";
import { MenuItem } from "../api/menuItemApi";
import getUserDetails from "../customHooks/extractPayload";

interface MenuItemCardProps {
  item: MenuItem;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarFailOpen, setSnackbarFailOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Cart | null>(null);
  const userDetails = getUserDetails();
  const email = userDetails?.email || "";
  const [errorMessage, setErrorMessage] = useState("");

  const { mutate: addToCartMutation } = useMutation({
    mutationFn: addToCart,
    onSuccess: (data) => {
      setSnackbarOpen(true);
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
    },
    onError: (error) => {
      setSnackbarFailOpen(true);
      // Optional: Store the error message in state to display in the snackbar
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to add item to cart"
      );
    },
  });

  const handleAddToCartClick = () => {
    const quantity = 1;
    const cartItem: Cart = {
      ...item,
      quantity,
      email,
    };
    setSelectedItem(cartItem);
    setConfirmOpen(true);
  };

  const handleConfirmAddToCart = () => {
    if (selectedItem) {
      addToCartMutation(selectedItem);
    }
    setConfirmOpen(false);
    setSelectedItem(null);
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setSelectedItem(null);
  };

  return (
    <>
      <Card
        sx={{
          width: 300,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: 8,
          },
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "relative", height: 180, width: "100%" }}>
          <CardMedia
            component="img"
            image={item.signedUrl}
            alt={item.name}
            sx={{
              height: "100%",
              objectFit: "cover",
              backgroundPosition: "center",
            }}
          />
        </Box>
        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: 3,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 1, color: "#333" }}
            >
              {item.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, lineHeight: 1.6 }}
            >
              {item.description}
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              position: "relative",
              "&::before": {
                content: '"$"',
                fontSize: "0.8em",
                position: "relative",
                top: "-0.2em",
                marginRight: "2px",
              },
            }}
          >
            {item.price}
          </Typography>
          <Button
            onClick={handleAddToCartClick}
            startIcon={<ShoppingCartOutlinedIcon />}
            variant="outlined"
            sx={{ mt: 2 }}
          >
            Add to Cart
          </Button>
        </CardContent>
      </Card>

      <Snackbar
        open={confirmOpen}
        onClose={handleCancel}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <SnackbarContent
          sx={{ bgcolor: "#333", color: "#fff" }}
          message={`Add "${selectedItem?.name}" to cart?`}
          action={
            <>
              <Button
                color="primary"
                size="small"
                onClick={handleConfirmAddToCart}
              >
                OK
              </Button>
              <Button color="secondary" size="small" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          }
        />
      </Snackbar>

      <Snackbar open={snackbarOpen} autoHideDuration={3000}>
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Food Added To Cart
        </Alert>
      </Snackbar>

      <Snackbar
        open={snackbarFailOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarFailOpen(false)}
      >
        <Alert severity="error" onClose={() => setSnackbarFailOpen(false)}>
          {errorMessage || "Failed to add item to cart"}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MenuItemCard;
