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
  Chip,
  Tooltip,
  alpha,
  Card,
  CardContent,
  keyframes,
  Grow,
  Fade,
  Slide,
  Zoom,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import getUserDetails from "../../customHooks/extractPayload";
import DropzoneComponent from "../../components/DropzoneComponenet";
import { addMenuItems, MenuItem } from "../../api/menuItemApi";
import { FaMoneyBill } from "react-icons/fa6";

// Define keyframe animations
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

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

  const mainColor = "#3a4d39";
  const lightMainColor = alpha(mainColor, 0.1);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    watch,
  } = useForm<MenuItem>({
    mode: "onChange",
  });

  const watchedFields = watch();

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const { mutate: createMenuItemMutation, isPending } = useMutation({
    mutationFn: addMenuItems,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      setSnackbarMessage(data.message || "Menu item added successfully!");
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

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);

    // Create image preview
    if (newFiles.length > 0) {
      const file = newFiles[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const isFormComplete =
    isValid &&
    watchedFields.name &&
    watchedFields.description &&
    watchedFields.price &&
    files.length > 0;

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: { xs: 2, md: 3 },
        backgroundColor: "#f8f9fa",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 1 } }}>
        {/* Animated header with floating effect */}
        <Box
          sx={{
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: mainColor,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <MenuBookIcon fontSize="large" />
            Menu Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create appealing menu items with detailed descriptions and
            high-quality images.
          </Typography>
        </Box>

        <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
          {/* Main Content */}
          <Box flex={2}>
            {/* Grow animation for the main form */}
            <Grow in={true} timeout={800}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  backgroundColor: "white",
                  border: "1px solid #e0e0e0",
                  overflow: "hidden",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: lightMainColor,
                    borderBottom: `1px solid ${alpha(mainColor, 0.2)}`,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      color: mainColor,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <FastfoodIcon /> Add New Menu Item
                  </Typography>
                </Box>

                <Box
                  component="form"
                  onSubmit={handleSubmit(handleSubmitMenuItem)}
                  noValidate
                  sx={{ p: { xs: 2, md: 4 } }}
                >
                  <Stack spacing={4}>
                    {/* Form Header with completion indicator */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="subtitle1" color="text.secondary">
                        Fill in the details below
                      </Typography>
                      <Zoom in={true} style={{ transitionDelay: "100ms" }}>
                        <Chip
                          label={
                            isFormComplete ? "Ready to Submit" : "Incomplete"
                          }
                          color={isFormComplete ? "success" : "default"}
                          size="small"
                          sx={{
                            backgroundColor: isFormComplete
                              ? alpha(mainColor, 0.1)
                              : undefined,
                            color: isFormComplete ? mainColor : undefined,
                            fontWeight: isFormComplete ? 600 : 400,
                          }}
                        />
                      </Zoom>
                    </Box>

                    {/* Name */}
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          mb: 1,
                          color: mainColor,
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <FastfoodIcon fontSize="small" /> Food Name
                      </Typography>
                      <Slide direction="right" in={true} timeout={500}>
                        <div>
                          <Controller
                            name="name"
                            control={control}
                            defaultValue=""
                            rules={{ required: "Food name is required" }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                variant="outlined"
                                placeholder="e.g. Margherita Pizza"
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                InputProps={{
                                  sx: {
                                    borderRadius: 2,
                                    backgroundColor: alpha("#f8f9fa", 0.5),
                                  },
                                }}
                              />
                            )}
                          />
                        </div>
                      </Slide>
                    </Box>

                    {/* Description */}
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          mb: 1,
                          color: mainColor,
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <DescriptionIcon fontSize="small" /> Description
                      </Typography>
                      <Slide direction="right" in={true} timeout={600}>
                        <div>
                          <Controller
                            name="description"
                            control={control}
                            defaultValue=""
                            rules={{ required: "Description is required" }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                placeholder="Describe your dish including key ingredients, preparation method, and any special features..."
                                error={!!errors.description}
                                helperText={errors.description?.message}
                                InputProps={{
                                  sx: {
                                    borderRadius: 2,
                                    backgroundColor: alpha("#f8f9fa", 0.5),
                                  },
                                }}
                              />
                            )}
                          />
                        </div>
                      </Slide>
                    </Box>

                    {/* Price and Image Upload */}
                    <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                      <Box flex={1}>
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 1,
                            color: mainColor,
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <FaMoneyBill fontSize="small" /> Price
                        </Typography>
                        <Slide direction="right" in={true} timeout={700}>
                          <div>
                            <Controller
                              name="price"
                              control={control}
                              defaultValue={0}
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
                                  fullWidth
                                  variant="outlined"
                                  placeholder="1200.00"
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        Rs
                                      </InputAdornment>
                                    ),
                                    sx: {
                                      borderRadius: 2,
                                      backgroundColor: alpha("#f8f9fa", 0.5),
                                    },
                                  }}
                                  error={!!errors.price}
                                  helperText={errors.price?.message}
                                />
                              )}
                            />
                          </div>
                        </Slide>
                      </Box>

                      <Box flex={1}>
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 1,
                            color: mainColor,
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <ImageIcon fontSize="small" /> Food Image
                        </Typography>
                        <Slide direction="right" in={true} timeout={800}>
                          <div>
                            <DropzoneComponent
                              files={files}
                              setFiles={handleFileChange}
                              dropzoneLabel="Upload Food Image (Max Size 10MB)"
                            />
                          </div>
                        </Slide>
                      </Box>
                    </Stack>

                    {/* Form Actions with pulse animation on submit when ready */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        justifyContent: "flex-end",
                        mt: 3,
                        flexWrap: "wrap",
                      }}
                    >
                      <Slide direction="up" in={true} timeout={900}>
                        <div>
                          <Button
                            type="button"
                            variant="outlined"
                            startIcon={<RestartAltIcon />}
                            onClick={resetForm}
                            size="large"
                            sx={{
                              color: mainColor,
                              borderColor: mainColor,
                              borderRadius: 2,
                              px: 3,
                              "&:hover": {
                                borderColor: "#2a3a29",
                                backgroundColor: alpha(mainColor, 0.08),
                              },
                            }}
                          >
                            Reset Form
                          </Button>
                        </div>
                      </Slide>
                      <Slide direction="up" in={true} timeout={1000}>
                        <div>
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            disabled={isPending || !isFormComplete}
                            size="large"
                            sx={{
                              backgroundColor: mainColor,
                              borderRadius: 2,
                              px: 4,
                              "&:hover": {
                                backgroundColor: "#2a3a29",
                                animation: isFormComplete
                                  ? `${pulse} 2s infinite`
                                  : "none",
                              },
                              "&:disabled": {
                                backgroundColor: alpha(mainColor, 0.5),
                                color: "white",
                              },
                            }}
                          >
                            {isPending ? "Adding..." : "Add to Menu"}
                          </Button>
                        </div>
                      </Slide>
                    </Box>
                  </Stack>
                </Box>
              </Paper>
            </Grow>
          </Box>

          {/* Side Panel */}
          <Box flex={1} sx={{ display: { xs: "block", lg: "block" } }}>
            <Stack spacing={3}>
              {/* Guidelines Card with animation */}
              <Grow in={true} timeout={1000}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    backgroundColor: "white",
                    border: "1px solid #e0e0e0",
                    overflow: "hidden",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: lightMainColor,
                      borderBottom: `1px solid ${alpha(mainColor, 0.2)}`,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: mainColor,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <InfoOutlinedIcon /> Menu Guidelines
                    </Typography>
                  </Box>

                  <Box sx={{ p: 3 }}>
                    {[
                      {
                        title: "High-quality images",
                        description:
                          "Use clear, well-lit photos of your dishes that showcase the dish's presentation and appeal.",
                      },
                      {
                        title: "Accurate descriptions",
                        description:
                          "Include key ingredients, preparation style, and note any allergens or dietary specifications.",
                      },
                      {
                        title: "Competitive pricing",
                        description:
                          "Research local market prices to ensure your offerings remain competitive yet profitable.",
                      },
                      {
                        title: "Categorize items",
                        description:
                          "Group similar items together (Appetizers, Mains, Desserts, etc.) for better organization.",
                      },
                    ].map((item, index) => (
                      <Fade key={index} in={true} timeout={(index + 1) * 300}>
                        <Box sx={{ mb: 2.5 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: mainColor,
                              fontWeight: 600,
                              mb: 0.5,
                            }}
                          >
                            {index + 1}. {item.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.description}
                          </Typography>
                        </Box>
                      </Fade>
                    ))}

                    <Tooltip title="Following these guidelines can increase orders by up to 30%">
                      <Box
                        sx={{
                          mt: 3,
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: alpha(mainColor, 0.1),
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.02)",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          },
                        }}
                      >
                        <InfoOutlinedIcon color="info" fontSize="small" />
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, color: mainColor }}
                        >
                          Well-presented menu items boost sales!
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Box>
                </Paper>
              </Grow>

              {/* Preview Card with animation */}
              <Grow in={true} timeout={1200}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: "1px solid #e0e0e0",
                    backgroundColor: "white",
                    overflow: "hidden",
                    display: { xs: "none", md: "block" },
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: lightMainColor,
                      borderBottom: `1px solid ${alpha(mainColor, 0.2)}`,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: mainColor,
                        fontWeight: 600,
                      }}
                    >
                      Live Preview
                    </Typography>
                  </Box>
                  <CardContent>
                    {watchedFields.name ||
                    watchedFields.description ||
                    watchedFields.price ||
                    imagePreview ? (
                      <Box>
                        <Box
                          sx={{
                            p: 2,
                            border: "1px solid #e0e0e0",
                            borderRadius: 2,
                            backgroundColor: "#fff",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                          }}
                        >
                          {imagePreview && (
                            <Fade in={!!imagePreview} timeout={500}>
                              <Box
                                sx={{
                                  height: 140,
                                  width: "100%",
                                  borderRadius: 1,
                                  overflow: "hidden",
                                  mb: 2,
                                  backgroundColor: "#f0f0f0",
                                }}
                              >
                                <Box
                                  component="img"
                                  src={imagePreview}
                                  alt="Menu Item"
                                  sx={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    transition: "transform 0.5s ease",
                                    "&:hover": {
                                      transform: "scale(1.05)",
                                    },
                                  }}
                                />
                              </Box>
                            </Fade>
                          )}
                          <Typography variant="h6" gutterBottom>
                            {watchedFields.name || "Food Name"}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                          >
                            {watchedFields.description ||
                              "Food description will appear here..."}
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{ color: mainColor, fontWeight: 600 }}
                          >
                            {watchedFields.price
                              ? `Rs ${watchedFields.price}`
                              : "Rs 0.00"}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Fade in={true} timeout={500}>
                        <Box sx={{ textAlign: "center", py: 4 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontStyle: "italic" }}
                          >
                            Fill out the form to see a live preview of your menu
                            item
                          </Typography>
                        </Box>
                      </Fade>
                    )}
                  </CardContent>
                </Card>
              </Grow>
            </Stack>
          </Box>
        </Stack>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            backgroundColor:
              snackbarSeverity === "success" ? mainColor : undefined,
            color: snackbarSeverity === "success" ? "white" : undefined,
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
