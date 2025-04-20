import { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Container,
  Snackbar,
  Alert,
  InputAdornment,
  createTheme,
  ThemeProvider,
  styled,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

// TypeScript interfaces
interface MenuItemFormData {
  name: string;
  description: string;
  price: string;
  image: FileList;
}

// Custom theme with your colors
const theme = createTheme({
  palette: {
    primary: {
      main: "#3a4d39", // Dark green
    },
    secondary: {
      main: "#ffa500", // Orange
    },
    background: {
      default: "#ffffff", // White
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontWeight: 600,
      color: "#3a4d39",
    },
    h6: {
      fontWeight: 600,
      color: "#3a4d39",
    },
  },
});

// Styled components
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ImagePreview = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: "4px",
});

const MenuManager: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MenuItemFormData>();

  // Mock API call to add a menu item
  const addMenuItem = async (data: FormData): Promise<any> => {
    // In a real app, this would be an API call
    console.log("Adding menu item:", data);
    return new Promise((resolve) => setTimeout(() => resolve(data), 500));
  };

  const mutation = useMutation({
    mutationFn: addMenuItem,
    onSuccess: () => {
      // Invalidate and refetch queries that could be affected
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      reset();
      setImagePreview(null);
      setOpenSnackbar(true);
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit: SubmitHandler<MenuItemFormData> = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    if (data.image[0]) {
      formData.append("image", data.image[0]);
    }

    mutation.mutate(formData);
  };

  const handleReset = () => {
    reset();
    setImagePreview(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="md">
          <Box mb={4}>
            <Typography variant="h4" gutterBottom>
              Menu Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Add new items to your restaurant menu
            </Typography>
          </Box>

          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Add New Menu Item
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              sx={{ mt: 2 }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Controller
                    name="name"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Food name is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Food Name"
                        fullWidth
                        variant="outlined"
                        placeholder="e.g. Margherita Pizza"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="description"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Description is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        placeholder="Describe your food item..."
                        error={!!errors.description}
                        helperText={errors.description?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="price"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Price is required",
                      pattern: {
                        value: /^\d+(\.\d{1,2})?$/,
                        message: "Enter a valid price",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Price"
                        fullWidth
                        variant="outlined"
                        placeholder="1200.00"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">Rs</InputAdornment>
                          ),
                        }}
                        error={!!errors.price}
                        helperText={errors.price?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <input
                    {...register("image", { required: "Image is required" })}
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  <Button
                    component="label"
                    htmlFor="image-upload"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{ height: "56px", width: "100%" }}
                  >
                    Upload Image
                  </Button>
                  {errors.image && (
                    <Typography
                      color="error"
                      variant="caption"
                      sx={{ display: "block", mt: 1 }}
                    >
                      {errors.image.message}
                    </Typography>
                  )}
                </Grid>

                {imagePreview && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Image Preview:
                    </Typography>
                    <Box
                      sx={{
                        height: 200,
                        width: 200,
                        border: "1px solid #ddd",
                        borderRadius: 1,
                      }}
                    >
                      <ImagePreview src={imagePreview} alt="Preview" />
                    </Box>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? "Adding..." : "Add Menu Item"}
                    </Button>
                    <Button
                      type="button"
                      variant="contained"
                      color="secondary"
                      startIcon={<RestartAltIcon />}
                      onClick={handleReset}
                    >
                      Reset
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Current Menu Items
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: "italic" }}
            >
              Your menu items will appear here after you add them.
            </Typography>
          </Paper>
        </Container>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Menu item added successfully!
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default MenuManager;
