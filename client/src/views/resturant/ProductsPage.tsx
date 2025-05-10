import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Container,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateMenuItem, getMenuItemsByEmail, deleteMenuItem, MenuItem } from "../../api/menuItemApi";
import UpdateProductModal from "./UpdateProductModal";
import getUserDetails from "../../customHooks/extractPayload";

const ProductsPage = () => {
  const [successMessage, setSuccessMessage] = useState(""); 
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<MenuItem | null>(null);

  const userDetails = getUserDetails();
  const restaurantEmail = userDetails?.email;

  const cardWidth = 350;
  const cardHeight = 330;
  const imageHeight = 180;
  const contentHeight = 163;

  const queryClient = useQueryClient();

  // Use React Query to fetch products
  const {
    data: products = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['menuItems', restaurantEmail],
    queryFn: () => getMenuItemsByEmail(restaurantEmail as string),
    enabled: !!restaurantEmail,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update mutation with proper cache invalidation
  const updateProductMutation = useMutation({
    mutationFn: (updatedProduct: MenuItem) =>
      updateMenuItem(updatedProduct.id, updatedProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems', restaurantEmail] });
      setModalOpen(false);
      setSuccessMessage("Product updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    onError: (error) => {
      console.error("Failed to update product:", error);
      setSuccessMessage("Update failed. Please try again.");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  });

  // Delete mutation with proper cache invalidation
  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => deleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems', restaurantEmail] });
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      setSuccessMessage("Product deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    onError: (error) => {
      console.error("Failed to delete product:", error);
      setSuccessMessage("Delete failed. Please try again.");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  });

  const handleDeleteClick = (product: MenuItem) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!productToDelete) return;
    deleteProductMutation.mutate(productToDelete.id);
  };

  const handleUpdate = (product: MenuItem) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleUpdateComplete = (updatedProduct: MenuItem) => {
    updateProductMutation.mutate(updatedProduct);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: "linear-gradient(to bottom, #f8f9fa, #e9ecef)",
        minHeight: "100vh",
        pt: 4,
        pb: 8
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            background: "linear-gradient(to right, #ffffff, #f8f9fa)"
          }}
        >
          <Box display="flex" alignItems="center" mb={1}>
            <RestaurantMenuIcon sx={{ fontSize: 36, mr: 2, color: "primary.main" }} />
            <Typography variant="h4" component="h1" fontWeight="500" color="primary.dark">
              My Restaurant Menu Items
            </Typography>
          </Box>
          <Typography variant="subtitle1" color="text.secondary" sx={{ ml: 0.5 }}>
            Manage your restaurant's products with easy update and delete options
          </Typography>
        </Paper>

        {/* Success Message */}
        {successMessage && (
          <Alert severity="success" variant="filled" sx={{ mb: 3, borderRadius: 2 }}>
            {successMessage}
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert severity="error" variant="filled" sx={{ mb: 3, borderRadius: 2 }}>
            An error occurred while loading products. Please try again.
          </Alert>
        )}

        {/* No Products */}
        {products.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
            <Typography variant="h6" color="text.secondary">
              No products found in your menu. Add some products to get started.
            </Typography>
          </Paper>
        ) : (
          <Stack
            direction="row"
            flexWrap="wrap"
            gap={3}
            sx={{
              marginLeft: '-24px',
              marginTop: '-24px',
              '& > *': {
                paddingLeft: '24px',
                paddingTop: '24px'
              }
            }}
          >
            {products.map((product: any) => (
  <Box
    key={product.id}
    sx={{
      width: { xs: '100%', sm: 'calc(50% - 24px)', md: 'calc(33.333% - 24px)' },
      minWidth: cardWidth,
      flexGrow: 1
    }}
  >
    <Fade in={true} timeout={500}>
      <Card
        sx={{
          width: cardWidth,
          height: cardHeight,
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          overflow: "hidden",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 6
          }
        }}
      >
        <Box
          sx={{
            position: "relative",
            height: imageHeight,
            width: "100%",
            overflow: "hidden"
          }}
        >
          {product.signedUrl ? (
            <CardMedia
              component="img"
              sx={{
                height: "100%",
                width: "100%",
                objectFit: "cover"
              }}
              image={product.signedUrl}
              alt={product.name}
            />
          ) : (
            <Box
              sx={{
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "grey.100"
              }}
            >
              <RestaurantMenuIcon sx={{ fontSize: 60, color: "grey.400" }} />
            </Box>
          )}
          <Chip
            label={product.category}
            color="primary"
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              fontWeight: 500,
              textTransform: "capitalize"
            }}
          />
        </Box>

        <Box
          sx={{
            height: contentHeight,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}
        >
          <CardContent
            sx={{
              flexGrow: 1,
              p: 2,
              pb: 0,
              overflow: "hidden"
            }}
          >
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              sx={{
                fontWeight: 600,
                mb: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical"
              }}
            >
              {product.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical"
              }}
            >
              {product.description}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main" }}>
              ${product.price.toFixed(2)}   
            </Typography>
          </CardContent>

          <Box
            sx={{
              p: 1,
              display: "flex",
              justifyContent: "flex-end",
              borderTop: "1px solid",
              borderColor: "divider",
              bgcolor: "grey.50",
              mt: "auto"
            }}
          >
            <IconButton
              size="small"
              color="primary"
              sx={{
                mr: 1,
                bgcolor: "primary.light",
                color: "white",
                "&:hover": {
                  bgcolor: "primary.main"
                }
              }}
              onClick={() => handleUpdate(product)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              sx={{
                bgcolor: "error.light",
                color: "white",
                "&:hover": {
                  bgcolor: "error.main"
                }
              }}
              onClick={() => handleDeleteClick(product)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Card>
    </Fade>
  </Box>
))}

          </Stack>
        )}

        {selectedProduct && (
          <UpdateProductModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            product={selectedProduct}
            onUpdate={handleUpdateComplete}
          />
        )}

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete{" "}
              <strong>{productToDelete?.name}</strong>?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="inherit" variant="outlined">
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete} 
              color="error" 
              variant="contained"
              disabled={deleteProductMutation.isPending}
            >
              {deleteProductMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ProductsPage;