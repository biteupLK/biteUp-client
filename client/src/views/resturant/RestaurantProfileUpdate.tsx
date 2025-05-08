import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Autocomplete,
  InputAdornment,
  Tabs,
  Tab,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  Grid,
  Card,
  CardContent,
  alpha,
} from "@mui/material";
import {
  LocationOn as LocationIcon,
  Search as SearchIcon,
  CheckCircleOutline,
  ErrorOutline,
  Info,
  ContactMail,
  Map,
  Delete,
  Warning,
  ArrowBack,
  SaveAlt,
  Restaurant as RestaurantIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  LocationCity as CityIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import {
  updateRestaurant,
  RestaurantSchema,
  fetchRestaurantByEmail,
  deleteRestaurant,
  getRestaurantImg,
} from "../../api/restaurantApi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DropzoneComponent from "../../components/DropzoneComponenet";
import getUserDetails from "../../customHooks/extractPayload";
import logo from "../../assets/logo/biteUpLogo.png";
import React from "react";

// Custom styled components with orange theme
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

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius * 2,
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&.Mui-focused": {
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
    "& fieldset": {
      borderColor: alpha(theme.palette.text.primary, 0.15),
    },
    "&:hover fieldset": {
      borderColor: alpha(theme.palette.primary.main, 0.6),
    },
  },
  "& .MuiInputBase-input": {
    padding: "15px 16px",
  },
  "& .MuiInputLabel-root": {
    transform: "translate(16px, 15px) scale(1)",
    "&.MuiInputLabel-shrink": {
      transform: "translate(16px, -6px) scale(0.75)",
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: "12px 24px",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "0 4px 14px 0 rgba(0,0,0,0.1)",
  transition: theme.transitions.create(["background-color", "box-shadow"]),
  "&:hover": {
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
  },
}));

const AnimatedCard = styled(motion.div)(({ theme }) => ({
  width: "100%",
  overflow: "hidden",
}));

const GradientDivider = styled(Divider)(({ theme }) => ({
  background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0)} 0%, ${alpha(theme.palette.primary.main, 0.3)} 50%, ${alpha(theme.palette.primary.main, 0)} 100%)`,
  height: 2,
  margin: theme.spacing(3, 0),
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius * 1.5,
  marginRight: theme.spacing(1),
  transition: theme.transitions.create(["color", "background-color"]),
  "&.Mui-selected": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
  },
}));

// Google Maps type declarations
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const RestaurantProfileUpdate = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Override primary color with orange (#ff9800)
  const orangeTheme = {
    ...theme,
    palette: {
      ...theme.palette,
      primary: {
        main: "#ff9800",
        light: "#ffb74d",
        dark: "#f57c00",
        contrastText: "#fff",
      },
    },
  };

  const userDetails = getUserDetails();
  const email = userDetails?.email;
  const navigate = useNavigate();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const restaurantEmail = userDetails?.email;
  const [searchValue, setSearchValue] = useState<string>("");
  const [predictions, setPredictions] = useState<any[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmDeleteText, setConfirmDeleteText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

    React.useEffect(() => {
      async function fetchImage() {
        try {
          if (restaurantEmail) {
            const url = await getRestaurantImg(restaurantEmail);
            setImageUrl(url);
          }
        } catch (error) {
          console.error("Failed to fetch restaurant image:", error);
        }
      }
      fetchImage();
    }, [restaurantEmail]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // Refs for Google Maps objects
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const placesServiceRef = useRef<any>(null);
  const autocompleteServiceRef = useRef<any>(null);

  if (!email) return null;

  const { data: restaurantData, isLoading } = useQuery({
    queryKey: ["restaurant", email],
    queryFn: () => fetchRestaurantByEmail(email),
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<RestaurantSchema>({
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      email: email || "",
      description: "",
      latitude: null,
      longitude: null,
      placeId: null,
    },
    mode: "onChange",
  });

  // When data loads, reset the form values
  useEffect(() => {
    if (restaurantData) {
      reset({
        ...restaurantData,
        email: email || "",
      });
      if (restaurantData.imageUrl) {
        setLogoPreview(restaurantData.imageUrl);
      }
    }
  }, [restaurantData, email, reset]);

  // Load Google Maps API only when location tab is active
  useEffect(() => {
    if (activeTab === 1 && !googleMapsLoaded && !window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;

      window.initMap = () => {
        setGoogleMapsLoaded(true);
      };

      document.head.appendChild(script);
    }
  }, [googleMapsLoaded, activeTab]);

  // Initialize map after API loads
  useEffect(() => {
    if (
      activeTab === 1 &&
      googleMapsLoaded &&
      mapRef.current &&
      !mapInstanceRef.current
    ) {
      const initialLocation =
        watch("latitude") && watch("longitude")
          ? { lat: Number(watch("latitude")), lng: Number(watch("longitude")) }
          : { lat: 6.9271, lng: 79.8612 }; // Default to Colombo, Sri Lanka

      const mapOptions = {
        center: initialLocation,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "transit",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#e9e9e9" }],
          },
        ],
      };

      const map = new window.google.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = map;

      placesServiceRef.current = new window.google.maps.places.PlacesService(
        map
      );
      autocompleteServiceRef.current =
        new window.google.maps.places.AutocompleteService();

      if (watch("latitude") && watch("longitude")) {
        placeMarker(
          new window.google.maps.LatLng(
            Number(watch("latitude")),
            Number(watch("longitude"))
          )
        );
      }

      map.addListener("click", (e: any) => {
        if (e.latLng) {
          placeMarker(e.latLng);
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode(
            { location: e.latLng },
            (results: any[], status: string) => {
              if (status === "OK" && results[0]) {
                updateAddressFields(results[0]);
              }
            }
          );
        }
      });
    }
  }, [googleMapsLoaded, activeTab, watch]);

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
    if (newFiles.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(newFiles[0]);
    }
  };

  const handlePlaceSelect = (prediction: any) => {
    if (!placesServiceRef.current || !prediction) return;

    const request = {
      placeId: prediction.place_id,
      fields: [
        "geometry",
        "formatted_address",
        "address_components",
        "place_id",
      ],
    };

    placesServiceRef.current.getDetails(
      request,
      (place: any, status: string) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          place?.geometry?.location
        ) {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setCenter(place.geometry.location);
            mapInstanceRef.current.setZoom(17);
          }
          placeMarker(place.geometry.location);
          if (place) updateAddressFields(place);
          setSearchValue("");
          setPredictions([]);
        }
      }
    );
  };

  const placeMarker = (location: any) => {
    if (markerRef.current) markerRef.current.setMap(null);

    const marker = new window.google.maps.Marker({
      position: location,
      map: mapInstanceRef.current,
      animation: window.google.maps.Animation.DROP,
      draggable: true,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: orangeTheme.palette.primary.main,
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
        scale: 10,
      },
    });

    markerRef.current = marker;
    setValue("latitude", location.lat());
    setValue("longitude", location.lng());

    marker.addListener("dragend", () => {
      const position = marker.getPosition();
      if (position) {
        setValue("latitude", position.lat());
        setValue("longitude", position.lng());
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode(
          { location: position },
          (results: any[], status: string) => {
            if (status === "OK" && results[0]) {
              updateAddressFields(results[0]);
            }
          }
        );
      }
    });
  };

  const updateAddressFields = (place: any) => {
    let streetNumber = "";
    let route = "";
    let city = "";
    let state = "";
    let zipCode = "";

    if (place.address_components) {
      for (const component of place.address_components) {
        const types = component.types;
        if (types.includes("street_number")) streetNumber = component.long_name;
        else if (types.includes("route")) route = component.long_name;
        else if (types.includes("locality") || types.includes("sublocality"))
          city = component.long_name;
        else if (types.includes("administrative_area_level_1"))
          state = component.short_name;
        else if (types.includes("postal_code")) zipCode = component.long_name;
      }
    }

    setValue("address", `${streetNumber} ${route}`.trim());
    setValue("city", city);
    setValue("state", state);
    setValue("zipCode", zipCode);
    if ("place_id" in place) setValue("placeId", place.place_id || null);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (value.length > 2 && autocompleteServiceRef.current) {
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: value,
          types: ["establishment", "geocode"],
          componentRestrictions: { country: "lk" },
        },
        (predictions: any[] | null, status: string) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setPredictions(predictions);
          } else {
            setPredictions([]);
          }
        }
      );
    } else {
      setPredictions([]);
    }
  };

  const updateMutation = useMutation({
    mutationFn: (data: RestaurantSchema) => {
      setIsSaving(true);
      return updateRestaurant(email || "", data, files[0]);
    },
    onSuccess: (data) => {
      setIsSaving(false);
      setSnackbarMessage("Restaurant updated successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setTimeout(() => navigate("/RestaurantAdmin"), 2000);
    },
    onError: (error) => {
      setIsSaving(false);
      setSnackbarMessage("Failed to update restaurant. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      console.error(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteRestaurant(email || ""),
    onSuccess: () => {
      setSnackbarMessage("Restaurant deleted successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setTimeout(() => navigate("/"), 2000);
    },
    onError: (error) => {
      setSnackbarMessage("Failed to delete restaurant. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      console.error(error);
    },
  });

  const onSubmit = (data: RestaurantSchema) => {
    updateMutation.mutate(data);
  };

  const handleDeleteRestaurant = () => {
    if (confirmDeleteText === restaurantData?.name) {
      deleteMutation.mutate();
      setDeleteDialogOpen(false);
    } else {
      setSnackbarMessage("Restaurant name doesn't match. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ backgroundColor: alpha(orangeTheme.palette.primary.main, 0.05) }}
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{ color: orangeTheme.palette.primary.main }}
        />
        <Typography
          variant="h6"
          sx={{
            mt: 3,
            fontWeight: 500,
            color: orangeTheme.palette.text.secondary,
          }}
        >
          Loading restaurant profile...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #fff8f0 100%)",
        py: 6,
        px: { xs: 2, sm: 4 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          mx: "auto",
          borderRadius: 4,
          overflow: "hidden",
          backgroundColor: "white",
          maxWidth: "1300px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.07)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: `linear-gradient(to right, ${alpha(orangeTheme.palette.primary.main, 0.05)}, ${alpha(orangeTheme.palette.primary.main, 0.02)})`,
            p: { xs: 3, md: 5 },
            borderBottom: `1px solid ${alpha(orangeTheme.palette.divider, 0.5)}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate("/RestaurantAdmin")}
              sx={{
                mr: 2,
                color: orangeTheme.palette.text.secondary,
                "&:hover": {
                  backgroundColor: alpha(
                    orangeTheme.palette.primary.main,
                    0.05
                  ),
                },
              }}
            >
              Back
            </Button>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Box
                component="img"
                src={logo}
                alt="Logo"
                sx={{
                  height: { xs: 50, sm: 60 },
                  maxWidth: { xs: 100, sm: "auto" },
                  cursor: "pointer",
                  "&:hover": {
                    opacity: 0.9,
                  },
                }}
                onClick={() => navigate("/")}
              />
            </motion.div>
          </Box>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={4}
              alignItems={{ xs: "center", md: "flex-start" }}
            >
              <Avatar
                src={imageUrl || ""}
                alt={restaurantData?.name}
                sx={{
                  width: { xs: 120, md: 160 },
                  height: { xs: 120, md: 160 },
                  border: `4px solid white`,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  backgroundColor: alpha(orangeTheme.palette.primary.main, 0.1),
                  fontSize: 50,
                  color: orangeTheme.palette.primary.main,
                }}
              >
                {restaurantData?.name?.[0]?.toUpperCase() || (
                  <RestaurantIcon fontSize="large" />
                )}
              </Avatar>

              <Box
                sx={{
                  textAlign: { xs: "center", md: "left" },
                  mt: { xs: 2, md: 0 },
                }}
              >
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    color: orangeTheme.palette.text.primary,
                    mb: 1.5,
                    fontSize: { xs: "1.75rem", sm: "2.125rem", md: "2.5rem" },
                  }}
                >
                  {restaurantData?.name || "Restaurant Profile"}
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 1, sm: 3 }}
                  mb={3}
                  justifyContent={{ xs: "center", md: "flex-start" }}
                  alignItems="center"
                  flexWrap="wrap"
                >
                  {restaurantData?.address && (
                    <Chip
                      icon={<LocationIcon />}
                      label={`${restaurantData.city}, ${restaurantData.state}`}
                      sx={{
                        borderRadius: 2,
                        bgcolor: alpha(orangeTheme.palette.primary.main, 0.08),
                        height: 32,
                        color: orangeTheme.palette.text.primary,
                      }}
                    />
                  )}
                  {restaurantData?.phoneNumber && (
                    <Chip
                      icon={<PhoneIcon />}
                      label={restaurantData.phoneNumber}
                      sx={{
                        borderRadius: 2,
                        bgcolor: alpha(orangeTheme.palette.info.main, 0.08),
                        height: 32,
                        color: orangeTheme.palette.text.primary,
                      }}
                    />
                  )}
                  <Chip
                    icon={<EmailIcon />}
                    label={email}
                    sx={{
                      borderRadius: 2,
                      bgcolor: alpha(orangeTheme.palette.success.main, 0.08),
                      height: 32,
                      color: orangeTheme.palette.text.primary,
                    }}
                  />
                </Stack>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    maxWidth: "800px",
                    mb: 3,
                    display: { xs: "none", md: "block" },
                  }}
                >
                  {restaurantData?.description ||
                    "Manage your restaurant's profile, location, and contact information. Keep your details up to date to attract more customers."}
                </Typography>
              </Box>
            </Stack>
          </motion.div>
        </Box>

        {/* Tabs Navigation */}
        <Box
          sx={{ borderBottom: 1, borderColor: "divider", px: { xs: 2, sm: 4 } }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTabs-indicator": {
                height: 3,
                backgroundColor: orangeTheme.palette.primary.main,
              },
            }}
          >
            <StyledTab
              label="Basic Info"
              icon={<Info />}
              iconPosition="start"
            />
            <StyledTab label="Location" icon={<Map />} iconPosition="start" />
            <StyledTab
              label="Contact"
              icon={<ContactMail />}
              iconPosition="start"
            />
            <StyledTab
              label="Delete Restaurant"
              icon={<Delete />}
              iconPosition="start"
              sx={{ color: orangeTheme.palette.error.main }}
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatedCard
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              key={`tab-${activeTab}`}
            >
              {activeTab === 0 && (
                <Stack spacing={4}>
                  <motion.div variants={itemVariants}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        display: "flex",
                        alignItems: "center",
                        color: orangeTheme.palette.text.primary,
                        fontWeight: 600,
                      }}
                    >
                      <Info
                        sx={{ mr: 1, color: orangeTheme.palette.primary.main }}
                      />
                      Basic Information
                    </Typography>
                  </motion.div>

                  {/* Restaurant Logo Upload */}
                  <motion.div variants={itemVariants}>
                    <Card
                      elevation={0}
                      sx={{
                        bgcolor: alpha(orangeTheme.palette.primary.main, 0.02),
                        border: `1px solid ${alpha(orangeTheme.palette.primary.main, 0.1)}`,
                        borderRadius: 3,
                        mb: 3,
                      }}
                    >
                      <CardContent
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", md: "row" },
                          alignItems: "center",
                          p: 4,
                        }}
                      >
                        <Box sx={{ mb: { xs: 3, md: 0 }, mr: { md: 4 } }}>
                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            gutterBottom
                          >
                            Restaurant Logo
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2, maxWidth: 300 }}
                          >
                            Upload a high-quality logo. This will appear on your
                            profile and in search results.
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: "center",
                            flex: 1,
                          }}
                        >
                          <Box sx={{ mb: { xs: 3, sm: 0 }, mr: { sm: 4 } }}>
                            <Avatar
                              src={logoPreview || ""}
                              alt="Restaurant logo preview"
                              sx={{
                                width: 100,
                                height: 100,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                border: `3px solid white`,
                                bgcolor: alpha(
                                  orangeTheme.palette.primary.main,
                                  0.1
                                ),
                                fontSize: 40,
                                color: orangeTheme.palette.primary.main,
                              }}
                            >
                              {restaurantData?.name?.[0]?.toUpperCase() || (
                                <RestaurantIcon fontSize="large" />
                              )}
                            </Avatar>
                          </Box>

                          <Box sx={{ width: "100%", maxWidth: 300 }}>
                            <DropzoneComponent
                              files={files}
                              setFiles={handleFileChange}
                              dropzoneLabel="Upload New Logo (Max Size 1MB)"
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Restaurant Name */}
                  <motion.div variants={itemVariants}>
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: "Restaurant name is required" }}
                      render={({ field }) => (
                        <StyledTextField
                          {...field}
                          fullWidth
                          label="Restaurant Name"
                          placeholder="Enter your restaurant's name"
                          error={!!errors.name}
                          helperText={errors.name?.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <RestaurantIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                  </motion.div>

                  {/* Restaurant Description */}
                  <motion.div variants={itemVariants}>
                    <Controller
                      name="description"
                      control={control}
                      rules={{ required: "Description is required" }}
                      render={({ field }) => (
                        <StyledTextField
                          {...field}
                          fullWidth
                          multiline
                          rows={5}
                          label="Restaurant Description"
                          error={!!errors.description}
                          helperText={
                            errors.description?.message ||
                            "Tell potential customers about your restaurant, cuisine, specialties, etc."
                          }
                          FormHelperTextProps={{
                            sx: { opacity: 0.7 },
                          }}
                        />
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        pt: 2,
                      }}
                    >
                      <StyledButton
                        type="submit"
                        variant="contained"
                        disabled={!isDirty || isSaving}
                        startIcon={<SaveAlt />}
                        sx={{
                          backgroundColor: orangeTheme.palette.primary.main,
                          "&:hover": {
                            backgroundColor: orangeTheme.palette.primary.dark,
                          },
                        }}
                      >
                        {isSaving ? (
                          <>
                            <CircularProgress
                              size={20}
                              color="inherit"
                              sx={{ mr: 1 }}
                            />
                            Saving...
                          </>
                        ) : (
                          "Save Basic Info"
                        )}
                      </StyledButton>
                    </Box>
                  </motion.div>
                </Stack>
              )}

              {activeTab === 1 && (
                <Stack spacing={4}>
                  <motion.div variants={itemVariants}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        display: "flex",
                        alignItems: "center",
                        color: orangeTheme.palette.text.primary,
                        fontWeight: 600,
                      }}
                    >
                      <Map
                        sx={{ mr: 1, color: orangeTheme.palette.primary.main }}
                      />
                      Location Details
                    </Typography>
                  </motion.div>

                  {/* Map Search */}
                  <motion.div variants={itemVariants}>
                    <Card
                      elevation={0}
                      sx={{
                        bgcolor: alpha(orangeTheme.palette.primary.main, 0.02),
                        border: `1px solid ${alpha(orangeTheme.palette.primary.main, 0.1)}`,
                        borderRadius: 3,
                        p: 3,
                        mb: 3,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        gutterBottom
                      >
                        Find Your Restaurant on Map
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                      >
                        Search for your restaurant or drag the marker to the
                        exact location.
                      </Typography>

                      <Autocomplete
                        freeSolo
                        options={predictions}
                        getOptionLabel={(option) =>
                          typeof option === "string"
                            ? option
                            : option.description
                        }
                        inputValue={searchValue}
                        onInputChange={(_, value) => handleSearchChange(value)}
                        onChange={(_, value) => handlePlaceSelect(value)}
                        renderInput={(params) => (
                          <StyledTextField
                            {...params}
                            fullWidth
                            placeholder="Search for your restaurant address"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon color="primary" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            {...props}
                            sx={{
                              "& > .MuiSvgIcon-root": {
                                mr: 2,
                                color: orangeTheme.palette.text.secondary,
                              },
                            }}
                          >
                            <LocationIcon />
                            {option.description}
                          </Box>
                        )}
                      />
                    </Card>
                  </motion.div>

                  {/* Interactive Map */}
                  <motion.div variants={itemVariants}>
                    <Box
                      ref={mapRef}
                      sx={{
                        height: 400,
                        width: "100%",
                        borderRadius: 3,
                        overflow: "hidden",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                        border: `1px solid ${alpha(orangeTheme.palette.divider, 0.2)}`,
                        position: "relative",
                      }}
                    >
                      {!googleMapsLoaded && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "background.paper",
                            zIndex: 1,
                          }}
                        >
                          <CircularProgress />
                          <Typography variant="body2" sx={{ ml: 2 }}>
                            Loading map...
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </motion.div>

                  {/* Address Fields */}
                  <motion.div variants={itemVariants}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        mt: 4,
                        mb: 2,
                        fontWeight: 600,
                        color: orangeTheme.palette.text.primary,
                      }}
                    >
                      Address Details
                    </Typography>
                    <Stack spacing={3}>
                      <Controller
                        name="address"
                        control={control}
                        rules={{ required: "Address is required" }}
                        render={({ field }) => (
                          <StyledTextField
                            {...field}
                            fullWidth
                            label="Street Address"
                            placeholder="123 Main Street"
                            error={!!errors.address}
                            helperText={errors.address?.message}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <HomeIcon color="primary" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />

                      <Box sx={{ display: "flex", gap: 3 }}>
                        <Controller
                          name="city"
                          control={control}
                          rules={{ required: "City is required" }}
                          render={({ field }) => (
                            <StyledTextField
                              {...field}
                              fullWidth
                              label="City"
                              error={!!errors.city}
                              helperText={errors.city?.message}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <CityIcon color="primary" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                        />

                        <Controller
                          name="state"
                          control={control}
                          rules={{ required: "State is required" }}
                          render={({ field }) => (
                            <StyledTextField
                              {...field}
                              fullWidth
                              label="State/Province"
                              error={!!errors.state}
                              helperText={errors.state?.message}
                            />
                          )}
                        />

                        <Controller
                          name="zipCode"
                          control={control}
                          rules={{ required: "Postal code is required" }}
                          render={({ field }) => (
                            <StyledTextField
                              {...field}
                              fullWidth
                              label="Postal Code"
                              error={!!errors.zipCode}
                              helperText={errors.zipCode?.message}
                            />
                          )}
                        />
                      </Box>
                    </Stack>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        pt: 2,
                      }}
                    >
                      <StyledButton
                        type="submit"
                        variant="contained"
                        disabled={!isDirty || isSaving}
                        startIcon={<SaveAlt />}
                        sx={{
                          backgroundColor: orangeTheme.palette.primary.main,
                          "&:hover": {
                            backgroundColor: orangeTheme.palette.primary.dark,
                          },
                        }}
                      >
                        {isSaving ? (
                          <>
                            <CircularProgress
                              size={20}
                              color="inherit"
                              sx={{ mr: 1 }}
                            />
                            Saving...
                          </>
                        ) : (
                          "Save Location"
                        )}
                      </StyledButton>
                    </Box>
                  </motion.div>
                </Stack>
              )}

              {activeTab === 2 && (
                <Stack spacing={4}>
                  <motion.div variants={itemVariants}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        display: "flex",
                        alignItems: "center",
                        color: orangeTheme.palette.text.primary,
                        fontWeight: 600,
                      }}
                    >
                      <ContactMail
                        sx={{ mr: 1, color: orangeTheme.palette.primary.main }}
                      />
                      Contact Information
                    </Typography>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={3}
                      sx={{ width: "100%" }}
                    >
                      {/* Phone Number */}
                      <Controller
                        name="phoneNumber"
                        control={control}
                        rules={{
                          required: "Phone number is required",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message:
                              "Please enter a valid 10-digit phone number",
                          },
                        }}
                        render={({ field }) => (
                          <StyledTextField
                            {...field}
                            fullWidth
                            label="Phone Number"
                            placeholder="0771234567"
                            error={!!errors.phoneNumber}
                            helperText={errors.phoneNumber?.message}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PhoneIcon color="primary" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />

                      {/* Email */}
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <StyledTextField
                            {...field}
                            fullWidth
                            label="Email"
                            disabled
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EmailIcon color="primary" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Stack>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        pt: 2,
                      }}
                    >
                      <StyledButton
                        type="submit"
                        variant="contained"
                        disabled={!isDirty || isSaving}
                        startIcon={<SaveAlt />}
                        sx={{
                          backgroundColor: orangeTheme.palette.primary.main,
                          "&:hover": {
                            backgroundColor: orangeTheme.palette.primary.dark,
                          },
                        }}
                      >
                        {isSaving ? (
                          <>
                            <CircularProgress
                              size={20}
                              color="inherit"
                              sx={{ mr: 1 }}
                            />
                            Saving...
                          </>
                        ) : (
                          "Save Contact Info"
                        )}
                      </StyledButton>
                    </Box>
                  </motion.div>
                </Stack>
              )}

              {activeTab === 3 && (
                <Stack spacing={4}>
                  <motion.div variants={itemVariants}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        display: "flex",
                        alignItems: "center",
                        color: orangeTheme.palette.error.main,
                        fontWeight: 600,
                      }}
                    >
                      <Warning sx={{ mr: 1 }} />
                      Delete Restaurant
                    </Typography>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Card
                      elevation={0}
                      sx={{
                        bgcolor: alpha(orangeTheme.palette.error.main, 0.03),
                        border: `1px solid ${alpha(orangeTheme.palette.error.main, 0.2)}`,
                        borderRadius: 3,
                        p: 3,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        gutterBottom
                      >
                        Permanent Action
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        Deleting your restaurant will permanently remove all
                        data including menu items, reviews, and photos. This
                        action cannot be undone.
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: orangeTheme.palette.error.main,
                        }}
                      >
                        Please proceed with caution.
                      </Typography>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        To confirm deletion, please type your restaurant name
                        below:
                      </Typography>
                      <StyledTextField
                        fullWidth
                        value={confirmDeleteText}
                        onChange={(e) => setConfirmDeleteText(e.target.value)}
                        placeholder={`Type "${restaurantData?.name}" to confirm`}
                        sx={{ mb: 3 }}
                      />
                      <Button
                        variant="contained"
                        color="error"
                        disabled={confirmDeleteText !== restaurantData?.name}
                        onClick={() => setDeleteDialogOpen(true)}
                        startIcon={<Delete />}
                        sx={{
                          borderRadius: 2,
                          px: 4,
                          py: 1.5,
                          fontWeight: 600,
                          "&:disabled": {
                            bgcolor: alpha(orangeTheme.palette.error.main, 0.2),
                            color: alpha(
                              orangeTheme.palette.error.contrastText,
                              0.5
                            ),
                          },
                        }}
                      >
                        Delete Restaurant
                      </Button>
                    </Box>
                  </motion.div>
                </Stack>
              )}
            </AnimatedCard>
          </form>
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 600 }}>
          <Warning color="error" sx={{ mr: 1, verticalAlign: "middle" }} />
          Confirm Restaurant Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ mb: 2 }}>
            Are you absolutely sure you want to delete{" "}
            <strong>{restaurantData?.name}</strong>? This will permanently erase
            all restaurant data.
          </DialogContentText>
          <DialogContentText>
            This action <strong>cannot</strong> be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
              color: orangeTheme.palette.text.secondary,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteRestaurant}
            color="error"
            variant="contained"
            autoFocus
            sx={{
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
            }}
          >
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
          iconMapping={{
            success: <CheckCircleOutline fontSize="inherit" />,
            error: <ErrorOutline fontSize="inherit" />,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RestaurantProfileUpdate;
