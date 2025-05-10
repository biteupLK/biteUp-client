// UpdateProductModal.tsx

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Divider,
  InputAdornment,
  CircularProgress,
  Paper,
  Alert,
  Slide,
  Chip,
  MenuItem,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import DescriptionIcon from "@mui/icons-material/Description";
import CategoryIcon from "@mui/icons-material/Category";
import React from "react";
import { MenuItem as MenuItemType, updateMenuItem } from "../../api/menuItemApi";

// Custom transition for dialog
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface UpdateProductModalProps {
  open: boolean;
  onClose: () => void;
  product: MenuItemType;
  onUpdate: (updatedProduct: MenuItemType) => void;
}

const UpdateProductModal = ({
  open,
  onClose,
  product,
  onUpdate,
}: UpdateProductModalProps) => {
  const [formData, setFormData] = useState<Omit<MenuItemType, "id" | "signedUrl">>({
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    restaurantEmail: product.restaurantEmail,
    email: product.email,
    restaurentId: product.restaurentId,
    image: [],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(product.signedUrl || null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const updatedProduct = await updateMenuItem(
        product.id,
        { ...formData, id: product.id, signedUrl: product.signedUrl },
        imageFile || undefined
      );
      onUpdate(updatedProduct);
      onClose();
    } catch (err) {
      setError("Failed to update product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 2,
        }}
      >
        <Box display="flex" alignItems="center">
          <RestaurantIcon sx={{ mr: 1.5 }} />
          <Typography variant="h6" fontWeight={500}>
            Update Menu Item
          </Typography>
        </Box>
        {!loading && (
          <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close" size="small">
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            height: "100%",
          }}
        >
          {/* Image Upload Section */}
          <Box
            sx={{
              width: { xs: "100%", md: "40%" },
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "grey.50",
              borderRight: { xs: "none", md: "1px solid" },
              borderBottom: { xs: "1px solid", md: "none" },
              borderColor: "divider",
            }}
          >
            <Paper
              elevation={3}
              sx={{
                width: "100%",
                height: 250,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                borderRadius: 2,
                position: "relative",
              }}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Product preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <RestaurantIcon sx={{ fontSize: 60, color: "grey.400", mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    No image selected
                  </Typography>
                </Box>
              )}

              {imagePreview && (
                <Chip
                  label={formData.category}
                  color="primary"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    fontWeight: 500,
                  }}
                />
              )}
            </Paper>

            <Box sx={{ width: "100%", textAlign: "center" }}>
              <input
                accept="image/*"
                id="image-upload"
                type="file"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    width: "100%",
                    py: 1.5,
                    borderRadius: 2,
                    boxShadow: 1,
                    bgcolor: "primary.light",
                    "&:hover": {
                      bgcolor: "primary.main",
                    },
                  }}
                >
                  {imageFile ? "Change Image" : "Upload New Image"}
                </Button>
              </label>
              {imageFile && (
                <Typography variant="body2" sx={{ mt: 1, color: "text.secondary", fontSize: "0.85rem" }}>
                  Selected: {imageFile.name}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Form Section */}
          <Box sx={{ width: { xs: "100%", md: "60%" }, p: 3 }}>
            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField
                required
                fullWidth
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RestaurantIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                required
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalOfferIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: <InputAdornment position="end">$</InputAdornment>,
                }}
              />

              <TextField
                required
                select
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              >
                {["Burgers", "Pizza", "Beverages", "Vegetables"].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                required
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1.5 }}>
                      <DescriptionIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: 1 }}>
                  {error}
                </Alert>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <Divider />
      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button onClick={onClose} disabled={loading} variant="outlined" sx={{ borderRadius: 2, px: 3 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          sx={{ borderRadius: 2, px: 3, boxShadow: 2 }}
        >
          {loading ? "Updating..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateProductModal;
