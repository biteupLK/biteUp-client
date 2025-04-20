import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Container,
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import getUserDetails from "../../customHooks/extractPayload";
import DropzoneComponent from "../../components/DropzoneComponenet";
import { addMenuItems, MenuItem } from "../../api/menuItemApi";

export default function AddMenuItem() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [files, setFiles] = useState<File[]>([]);
  const queryClient = useQueryClient();
  const userDetails = getUserDetails();
  const email = userDetails?.email;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MenuItem>();

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const { mutate: createMenuItemMutation, isPending } = useMutation({
    mutationFn: addMenuItems,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      setSnackbarMessage(data.message);
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    },
    onError: () => {
      setSnackbarMessage("Failed to add Menu Item. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    },
  });

  const resetForm = () => {
    reset();
    setFiles([]);
    setImagePreview(null);
  };

  const handleSubmitMenuItem = (data: MenuItem) => {
    const submitData: MenuItem = {
      ...data,
      restaurantEmail: email!,
      image: files,
    };
    createMenuItemMutation(submitData);
    resetForm();
  };

  return (
    <>
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
              onSubmit={handleSubmit(handleSubmitMenuItem)}
              noValidate
              sx={{ mt: 2 }}
            >
              <Stack spacing={3}>
                {/* Name */}
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

                {/* Description */}
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

                {/* Price and Image Upload in a row */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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

                  <Box sx={{ width: "100%" }}>
                    <DropzoneComponent
                      files={files}
                      setFiles={setFiles}
                      dropzoneLabel={"Add Menu Item Image"}
                    />
                  </Box>
                </Stack>

                {imagePreview && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Image Preview:
                    </Typography>
                    <Box
                      component="img"
                      src={imagePreview}
                      alt="Preview"
                      sx={{
                        height: 200,
                        width: 200,
                        border: "1px solid #ddd",
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                )}

                {/* Buttons */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    disabled={isPending}
                  >
                    {isPending ? "Adding..." : "Add Menu Item"}
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    startIcon={<RestartAltIcon />}
                    onClick={resetForm}
                  >
                    Reset
                  </Button>
                </Box>
              </Stack>
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
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
