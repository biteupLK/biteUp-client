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
} from "@mui/material";
import {
  LocationOn as LocationIcon,
  Search as SearchIcon,
  CheckCircleOutline,
  ErrorOutline,
  Info,
  ContactMail,
  Map,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { updateRestaurant, RestaurantSchema, fetchRestaurantByEmail } from "../../api/restaurantApi";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import DropzoneComponent from "../../components/DropzoneComponenet";
import axios from "axios";
import getUserDetails from "../../customHooks/extractPayload";
import logo from "../../assets/logo/biteUpLogo.png";

// Custom styled component for file upload
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

// Google Maps type declarations
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const RestaurantProfileUpdate = () => {
  const userDetails = getUserDetails();
  const email = userDetails?.email;
  const navigate = useNavigate();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [predictions, setPredictions] = useState<any[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  // Refs for Google Maps objects
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);

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
    formState: { errors, isValid },
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
    if (activeTab === 1 && googleMapsLoaded && mapRef.current && !mapInstanceRef.current) {
      const initialLocation = watch("latitude") && watch("longitude")
        ? { lat: watch("latitude"), lng: watch("longitude") }
        : { lat: 40.7128, lng: -74.006 };

      const mapOptions = {
        center: initialLocation,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      };

      const map = new window.google.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = map;

      placesServiceRef.current = new window.google.maps.places.PlacesService(map);
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();

      if (watch("latitude") && watch("longitude")) {
        placeMarker(new window.google.maps.LatLng(watch("latitude"), watch("longitude")));
      }

      map.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          placeMarker(e.latLng);
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode(
            { location: e.latLng },
            (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
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
      fields: ["geometry", "formatted_address", "address_components", "place_id"],
    };

    placesServiceRef.current.getDetails(
      request,
      (place: google.maps.places.PlaceResult | null, status: google.maps.places.PlacesServiceStatus) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
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

  const placeMarker = (location: google.maps.LatLng) => {
    if (markerRef.current) markerRef.current.setMap(null);
    
    const marker = new window.google.maps.Marker({
      position: location,
      map: mapInstanceRef.current,
      animation: window.google.maps.Animation.DROP,
      draggable: true,
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
          (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
            if (status === "OK" && results[0]) {
              updateAddressFields(results[0]);
            }
          }
        );
      }
    });
  };

  const updateAddressFields = (place: google.maps.places.PlaceResult | google.maps.GeocoderResult) => {
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
        else if (types.includes("locality") || types.includes("sublocality")) city = component.long_name;
        else if (types.includes("administrative_area_level_1")) state = component.short_name;
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
        (predictions: google.maps.places.AutocompletePrediction[] | null, status: google.maps.places.PlacesServiceStatus) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
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

  const mutation = useMutation({
    mutationFn: (data: RestaurantSchema) => updateRestaurant(email || "", data, files[0]),
    onSuccess: (data) => {
      setSnackbarMessage("Restaurant updated successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setTimeout(() => navigate("/RestaurantAdmin"), 2000);
    },
    onError: (error) => {
      setSnackbarMessage("Failed to update restaurant. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      console.error(error);
    },
  });

  const onSubmit = (data: RestaurantSchema) => {
    mutation.mutate(data);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={0} sx={{ mx: "auto", borderRadius: 4, overflow: "hidden", backgroundColor: "white", maxWidth: { md: "1300px" } }}>
      <Box sx={{ p: { xs: 3, md: 6 }, background: "white" }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 6 }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Box component="img" src={logo} alt="Logo" sx={{ height: { xs: 80, sm: 110 }, maxWidth: { xs: 120, sm: "auto" } }} />
          </motion.div>

          <motion.div style={{ flexGrow: 1, textAlign: "center" }} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: "text.primary", letterSpacing: "-0.5px", mb: 1 }}>
                Update Restaurant Profile
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "600px", mx: "auto" }}>
                Update your restaurant information to keep your profile up to date.
              </Typography>
            </Box>
          </motion.div>

          <Box sx={{ width: { xs: 80, sm: 110 }, visibility: "hidden" }} />
        </Box>

        {/* Tabs */}
        <Paper elevation={0} sx={{ mb: 4, borderRadius: 3, backgroundColor: "white" }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} centered sx={{ mb: 3 }}>
            <Tab label="Basic Info" icon={<Info />} iconPosition="start" />
            <Tab label="Location" icon={<Map />} iconPosition="start" />
            <Tab label="Contact" icon={<ContactMail />} iconPosition="start" />
          </Tabs>
          <Divider sx={{ mb: 3 }} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              {activeTab === 0 && (
                <Stack spacing={3} sx={{ p: 3 }}>
                  {/* Restaurant Logo Upload */}
                  <Stack alignItems="center" spacing={2}>
                    <Typography variant="subtitle1" fontWeight={600}>Restaurant Logo</Typography>
                    {logoPreview && (
                      <Box sx={{ width: 150, height: 150, overflow: "hidden", borderRadius: "50%", border: "3px solid #f0f0f0" }}>
                        <img src={logoPreview} alt="Restaurant logo preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </Box>
                    )}
                    <DropzoneComponent
                      files={files}
                      setFiles={handleFileChange}
                      dropzoneLabel="Upload New Logo (Max Size 1MB)"
                    />
                  </Stack>

                  {/* Restaurant Name */}
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Restaurant Name"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                      />
                    )}
                  />

                  {/* Restaurant Description */}
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={4}
                        label="Restaurant Description"
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        placeholder="Tell potential customers about your restaurant, cuisine, specialties, etc."
                      />
                    )}
                  />
                </Stack>
              )}

              {activeTab === 1 && (
                <Stack spacing={3} sx={{ p: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600}>Restaurant Location</Typography>

                  <Autocomplete
                    freeSolo
                    options={predictions}
                    getOptionLabel={(option) => typeof option === "string" ? option : option.description}
                    inputValue={searchValue}
                    onInputChange={(_, value) => handleSearchChange(value)}
                    onChange={(_, value) => {
                      if (value && typeof value !== "string") {
                        handlePlaceSelect(value);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label="Search for your restaurant"
                        placeholder="Enter address or restaurant name"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.place_id}>
                        <LocationIcon color="primary" sx={{ mr: 1 }} />
                        {option.description}
                      </li>
                    )}
                  />

                  {/* Google Maps */}
                  <Box
                    ref={mapRef}
                    sx={{
                      width: "100%",
                      height: 300,
                      borderRadius: 1,
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    {!googleMapsLoaded && (
                      <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CircularProgress />
                      </Box>
                    )}
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Search for your restaurant or click on the map to update your location
                  </Typography>

                  {/* Address Details */}
                  <Typography variant="subtitle1" fontWeight={600}>Address Details</Typography>

                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Street Address"
                        error={!!errors.address}
                        helperText={errors.address?.message}
                      />
                    )}
                  />

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Controller
                      name="city"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="City"
                          error={!!errors.city}
                          helperText={errors.city?.message}
                        />
                      )}
                    />

                    <Controller
                      name="state"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="State"
                          error={!!errors.state}
                          helperText={errors.state?.message}
                        />
                      )}
                    />

                    <Controller
                      name="zipCode"
                      control={control}
                      rules={{
                        pattern: {
                          value: /^\d{5}(-\d{4})?$/,
                          message: "Enter a valid zip code",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Zip Code"
                          error={!!errors.zipCode}
                          helperText={errors.zipCode?.message}
                        />
                      )}
                    />
                  </Stack>
                </Stack>
              )}

              {activeTab === 2 && (
                <Stack spacing={3} sx={{ p: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600}>Contact Information</Typography>

                  <Controller
                    name="phoneNumber"
                    control={control}
                    rules={{
                      pattern: {
                        value: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
                        message: "Enter a valid phone number",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Phone Number"
                        placeholder="(555) 123-4567"
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber?.message}
                      />
                    )}
                  />

                  <TextField
                    fullWidth
                    label="Email Address"
                    value={email || ""}
                    InputProps={{
                      readOnly: true,
                    }}
                    helperText="Email cannot be changed"
                  />
                </Stack>
              )}

              {/* Navigation and Submit */}
              <Box sx={{ display: "flex", justifyContent: "space-between", p: 3 }}>
                <Button
                  variant="outlined"
                  disabled={activeTab === 0}
                  onClick={() => setActiveTab(activeTab - 1)}
                  sx={{ borderRadius: 2, px: 4, py: 1.5, textTransform: "none", fontWeight: 600 }}
                >
                  Back
                </Button>

                {activeTab < 2 ? (
                  <Button
                    variant="contained"
                    onClick={() => setActiveTab(activeTab + 1)}
                    sx={{ 
                      borderRadius: 2, 
                      px: 4, 
                      py: 1.5, 
                      textTransform: "none", 
                      fontWeight: 600,
                      backgroundColor: "#A95D2F",
                      "&:hover": { backgroundColor: "#8A4B28" }
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={mutation.isPending}
                    sx={{ 
                      borderRadius: 2, 
                      px: 4, 
                      py: 1.5, 
                      textTransform: "none", 
                      fontWeight: 600,
                      backgroundColor: "#A95D2F",
                      "&:hover": { backgroundColor: "#8A4B28" }
                    }}
                  >
                    {mutation.isPending ? <CircularProgress size={24} color="inherit" /> : "Update Profile"}
                  </Button>
                )}
              </Box>
            </form>
          </motion.div>
        </Paper>

        {/* Snackbar Notification */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbarSeverity}
              variant="filled"
              sx={{
                borderRadius: 2,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                alignItems: "center",
                minWidth: { xs: "300px", sm: "400px" },
              }}
              iconMapping={{
                success: <CheckCircleOutline fontSize="large" />,
                error: <ErrorOutline fontSize="large" />,
              }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                {snackbarMessage}
              </Typography>
            </Alert>
          </motion.div>
        </Snackbar>
      </Box>
    </Paper>
  );
};

export default RestaurantProfileUpdate;