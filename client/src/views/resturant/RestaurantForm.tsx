import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
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
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  StepConnector,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  LocationOn as LocationIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Check as CheckIcon,
  CheckCircleOutlineOutlined,
  InfoOutlined,
  CheckCircleOutline,
  ErrorOutline,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { addRestaurant, RestaurantSchema } from "../../api/restaurantApi";
import getUserDetails from "../../customHooks/extractPayload";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo/biteUpLogo.png";
import { motion } from "framer-motion";
import DropzoneComponent from "../../components/DropzoneComponenet";

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

//google maps api key
const googleMapKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const GOOGLE_MAPS_API_KEY = googleMapKey;

// Steps definition
const steps = [
  {
    label: "Welcome",
    description: "Welcome to the restaurant setup process",
  },
  {
    label: "Restaurant Information",
    description: "Enter basic details about your restaurant",
  },
  {
    label: "Restaurant Location",
    description: "Set your restaurant's location on the map",
  },
  {
    label: "Address Details",
    description: "Confirm or edit your restaurant's address",
  },
  {
    label: "Contact Information",
    description: "Enter contact details for your restaurant",
  },
  {
    label: "Complete Setup",
    description: "Review and submit your information",
  },
];

const RestaurantStepperForm = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);

  // Refs for Google Maps objects
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(
    null
  );
  const autocompleteServiceRef =
    useRef<google.maps.places.AutocompleteService | null>(null);

  const userDetails = getUserDetails();
  const email = userDetails?.email;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    trigger,
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
      email: email,
      description: "",
      latitude: null,
      longitude: null,
      placeId: null,
    },
    mode: "onChange",
  });

  // Watch for values to validate steps
  const watchName = watch("name");
  const watchDescription = watch("description");
  const watchLogo = watch("image");
  const watchLatitude = watch("latitude");
  const watchLongitude = watch("longitude");
  const watchAddress = watch("address");
  const watchCity = watch("city");
  const watchState = watch("state");
  const watchZipCode = watch("zipCode");
  const watchPhoneNumber = watch("phoneNumber");
  const [files, setFiles] = useState<File[]>([]);

  // TanStack mutation for handling form submission
  const mutation = useMutation({
    mutationFn: addRestaurant,
    onSuccess: (data) => {
      setSnackbarMessage(data.message);
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      reset();
      setLogoPreview(null);
      setActiveStep(0);

      // Reset map marker
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }

      // Redirect to dashboard after 2 seconds (give time to see success message)
      setTimeout(() => {
        navigate("/RestaurantAdmin"); 
      }, 2000);
    },

    onError: (error) => {
      setSnackbarMessage("Failed to add restaurant. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      console.log(error);
    },
  });

  // Load Google Maps API
  useEffect(() => {
    if (!googleMapsLoaded && !window.google && activeStep === 2) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;

      window.initMap = () => {
        setGoogleMapsLoaded(true);
      };

      document.head.appendChild(script);
    }
  }, [googleMapsLoaded, activeStep]);

  // Initialize map after API loads and step is active
  useEffect(() => {
    if (
      googleMapsLoaded &&
      mapRef.current &&
      !mapInstanceRef.current &&
      activeStep === 2
    ) {
      // Default to a central location (can be customized)
      const defaultLocation = { lat: 40.7128, lng: -74.006 }; // New York

      const mapOptions = {
        center: defaultLocation,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      };

      const map = new window.google.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = map;

      // Initialize Places services
      placesServiceRef.current = new window.google.maps.places.PlacesService(
        map
      );
      autocompleteServiceRef.current =
        new window.google.maps.places.AutocompleteService();

      // Handle map click to place marker
      map.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          placeMarker(e.latLng);

          // Reverse geocode to get address details
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode(
            { location: e.latLng },
            (
              results: google.maps.GeocoderResult[],
              status: google.maps.GeocoderStatus
            ) => {
              if (status === "OK" && results[0]) {
                updateAddressFields(results[0]);
              }
            }
          );
        }
      });
    }
  }, [googleMapsLoaded, activeStep]);

  // Validate current step data to enable/disable next button
  useEffect(() => {
    const validateCurrentStep = async () => {
      switch (activeStep) {
        case 0:
          // Welcome step is always valid
          setIsFormValid(true);
          break;
        case 1:
          // Restaurant info step - require name, description, and logo
          setIsFormValid(!!watchName && !!watchDescription && !!watchLogo);
          break;
        case 2:
          // Location step - require coordinates
          setIsFormValid(!!watchLatitude && !!watchLongitude);
          break;
        case 3:
          // Address step
          setIsFormValid(
            !!watchAddress && !!watchCity && !!watchState && !!watchZipCode
          );
          break;
        case 4:
          // Contact info step
          const phoneValid =
            /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(
              watchPhoneNumber || ""
            );
          setIsFormValid(phoneValid && !!email);
          break;
        case 5:
          // Review step - validate entire form
          setIsFormValid(true);
          break;
        default:
          setIsFormValid(false);
      }
    };

    validateCurrentStep();
  }, [
    activeStep,
    watchName,
    watchDescription,
    watchLogo,
    watchLatitude,
    watchLongitude,
    watchAddress,
    watchCity,
    watchState,
    watchZipCode,
    watchPhoneNumber,
    email,
  ]);

  // Handle next step
  const handleNext = async () => {
    // If on final step, submit the form
    if (activeStep === steps.length - 1) {
      handleSubmit(onSubmit)();
      return;
    }

    // Move to next step
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  // Handle place selection
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
      (
        place: google.maps.places.PlaceResult | null,
        status: google.maps.places.PlacesServiceStatus
      ) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          place &&
          place.geometry &&
          place.geometry.location
        ) {
          // Update map and marker
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setCenter(place.geometry.location);
            mapInstanceRef.current.setZoom(17);
          }

          placeMarker(place.geometry.location);

          if (place) {
            updateAddressFields(place);
          }

          // Clear search field after selection
          setSearchValue("");
          setPredictions([]);
        }
      }
    );
  };

  // Place marker on map
  const placeMarker = (location: google.maps.LatLng) => {
    // Remove existing marker if any
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    // Create new marker
    const marker = new window.google.maps.Marker({
      position: location,
      map: mapInstanceRef.current,
      animation: window.google.maps.Animation.DROP,
      draggable: true,
    });

    markerRef.current = marker;

    // Update form values with coordinates
    setValue("latitude", location.lat());
    setValue("longitude", location.lng());

    // Handle marker drag
    marker.addListener("dragend", () => {
      const position = marker.getPosition();
      if (position) {
        setValue("latitude", position.lat());
        setValue("longitude", position.lng());

        // Reverse geocode to get updated address
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode(
          { location: position },
          (
            results: google.maps.GeocoderResult[],
            status: google.maps.GeocoderStatus
          ) => {
            if (status === "OK" && results[0]) {
              updateAddressFields(results[0]);
            }
          }
        );
      }
    });
  };

  // Update address fields from place data
  const updateAddressFields = (
    place: google.maps.places.PlaceResult | google.maps.GeocoderResult
  ) => {
    let streetNumber = "";
    let route = "";
    let city = "";
    let state = "";
    let zipCode = "";

    // Process address components
    if (place.address_components) {
      for (const component of place.address_components) {
        const types = component.types;

        if (types.includes("street_number")) {
          streetNumber = component.long_name;
        } else if (types.includes("route")) {
          route = component.long_name;
        } else if (
          types.includes("locality") ||
          types.includes("sublocality")
        ) {
          city = component.long_name;
        } else if (types.includes("administrative_area_level_1")) {
          state = component.short_name; // Use short name for state (e.g., CA instead of California)
        } else if (types.includes("postal_code")) {
          zipCode = component.long_name;
        }
      }
    }

    // Update form values
    setValue("address", `${streetNumber} ${route}`.trim());
    setValue("city", city);
    setValue("state", state);
    setValue("zipCode", zipCode);

    // Set place ID if available
    if ("place_id" in place) {
      setValue("placeId", place.place_id || null);
    }
  };

  // Handle address search
  const handleSearchChange = (value: string) => {
    setSearchValue(value);

    if (value.length > 2 && autocompleteServiceRef.current) {
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: value,
          types: ["establishment", "geocode"],
          componentRestrictions: { country: "lk" }, // Customize for your region
        },
        (
          predictions: google.maps.places.AutocompletePrediction[] | null,
          status: google.maps.places.PlacesServiceStatus
        ) => {
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

  const onSubmit = (data: RestaurantSchema) => {
    const submitData: RestaurantSchema = {
      ...data,
      image: files,
    };
    mutation.mutate(submitData);
  };

  const handleLogoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (...event: any[]) => void
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onChange(file);

      // Create preview URL for the logo
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Render step content based on active step
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ p: 2 }}>
            <Card elevation={3} sx={{ mb: 3, backgroundColor: "#f5f9ff" }}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Welcome to Your Restaurant Setup
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Before you can start using the platform, you need to complete
                  your restaurant profile. This information will be used to
                  create your restaurant page.
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  This setup wizard will guide you through the process step by
                  step. You'll need:
                </Typography>
                <ul>
                  <Typography component="li" variant="body1">
                    Your restaurant logo (high-quality image)
                  </Typography>
                  <Typography component="li" variant="body1">
                    Basic restaurant information
                  </Typography>
                  <Typography component="li" variant="body1">
                    Restaurant location and address details
                  </Typography>
                  <Typography component="li" variant="body1">
                    Contact information
                  </Typography>
                </ul>
                <Typography variant="body1" sx={{ mt: 2, fontWeight: "bold" }}>
                  Let's get started!
                </Typography>
              </CardContent>
            </Card>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ p: 2 }}>
            {/* Restaurant Logo Upload */}
            <Stack alignItems="center" spacing={2} sx={{ mb: 3 }}>
              <Typography variant="subtitle1">Restaurant Logo</Typography>

              {logoPreview && (
                <Box
                  sx={{
                    width: 150,
                    height: 150,
                    overflow: "hidden",
                    borderRadius: "50%",
                    border: "3px solid #f0f0f0",
                  }}
                >
                  <img
                    src={logoPreview}
                    alt="Restaurant logo preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}

              <DropzoneComponent
                files={files}
                setFiles={handleFileChange}
                dropzoneLabel="Upload Food Image (Max Size 1MB)"
              />

              <Controller
                name="image"
                control={control}
                rules={{ required: "Restaurant logo is required" }}
                render={({ field: { onChange, value, ...field } }) => (
                  <Box>
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload Logo
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file); // updates react-hook-form
                            handleFileChange([file]); // updates any additional state
                          }
                        }}
                        {...field}
                      />
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
                  </Box>
                )}
              />
            </Stack>

            {/* Restaurant Name */}
            <Controller
              name="name"
              control={control}
              rules={{ required: "Restaurant name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Restaurant Name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />

            {/* Restaurant Description */}
            <Controller
              name="description"
              control={control}
              rules={{ required: "Description is required" }}
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
          </Box>
        );
      case 2:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Restaurant Location
            </Typography>

            {/* Google Maps Search */}
            <Autocomplete
              freeSolo
              options={predictions}
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.description
              }
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
                  margin="normal"
                  variant="outlined"
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
                mt: 2,
                mb: 2,
                borderRadius: 1,
                backgroundColor: "#f5f5f5",
              }}
            >
              {!googleMapsLoaded && (
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
            </Box>

            <Stack spacing={2}>
              <Typography variant="caption" color="text.secondary">
                Search for your restaurant or click on the map to set your
                location
              </Typography>

              {/* Hidden fields for coordinates */}
              <Controller
                name="latitude"
                control={control}
                render={({ field }) => (
                  <input type="hidden" {...field} value={field.value || ""} />
                )}
              />
              <Controller
                name="longitude"
                control={control}
                render={({ field }) => (
                  <input type="hidden" {...field} value={field.value || ""} />
                )}
              />
              <Controller
                name="placeId"
                control={control}
                render={({ field }) => (
                  <input type="hidden" {...field} value={field.value || ""} />
                )}
              />

              {/* Location error message */}
              {(errors.latitude || errors.longitude || !watchLatitude) && (
                <Typography color="error" variant="caption">
                  Please select a location on the map
                </Typography>
              )}
            </Stack>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Confirm Address Details
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 2, display: "block" }}
            >
              Please verify the address information or make corrections if
              needed.
            </Typography>

            {/* Restaurant Address */}
            <Controller
              name="address"
              control={control}
              rules={{ required: "Address is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Street Address"
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />

            {/* City, State, Zip Code */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Controller
                name="city"
                control={control}
                rules={{ required: "City is required" }}
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
                rules={{ required: "State is required" }}
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
                  required: "Zip code is required",
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
          </Box>
        );
      case 4:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Contact Information
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 2, display: "block" }}
            >
              How customers will contact your restaurant
            </Typography>

            <Stack spacing={3}>
              <Controller
                name="phoneNumber"
                control={control}
                rules={{
                  required: "Phone number is required",
                  pattern: {
                    value:
                      /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
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

              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Enter a valid email address",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email Address"
                    inputProps={{ readOnly: true }}
                    error={!!errors.email}
                    helperText={
                      errors.email?.message ||
                      "Email is pre-filled from your account"
                    }
                  />
                )}
              />
            </Stack>
          </Box>
        );
      case 5:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Review Your Information
            </Typography>

            <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                {logoPreview && (
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      overflow: "hidden",
                      borderRadius: "50%",
                    }}
                  >
                    <img
                      src={logoPreview}
                      alt="Restaurant logo"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                )}
                <Box>
                  <Typography variant="h6">{watchName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {watchAddress}, {watchCity}, {watchState} {watchZipCode}
                  </Typography>
                </Box>
              </Stack>

              <Typography variant="subtitle2" gutterBottom>
                Description
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {watchDescription}
              </Typography>

              <Typography variant="subtitle2" gutterBottom>
                Contact Information
              </Typography>
              <Typography variant="body2">Phone: {watchPhoneNumber}</Typography>
              <Typography variant="body2">Email: {email}</Typography>
            </Card>

            <Typography variant="body2" sx={{ mb: 2 }}>
              Please review the information above. Once you submit, your
              restaurant profile will be created.
            </Typography>

            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              You can edit this information later from your restaurant settings.
            </Typography>
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        mx: "auto",
        borderRadius: 4,
        overflow: "hidden",
        backgroundColor: "background.default",
        maxWidth: { md: "1300px" },
      }}
    >
      <Box
        sx={{
          p: { xs: 3, md: 6 },
          background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
        }}
      >
        {/* Logo & Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
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
                height: { xs: 70, sm: 90 },
                maxWidth: { xs: 120, sm: "auto" },
                mb: 3,
                filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.08))",
              }}
            />
          </motion.div>

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: "text.primary",
              letterSpacing: "-0.5px",
              mb: 1,
            }}
          >
            Complete Your Restaurant Profile
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: "600px", mx: "auto" }}
          >
            Just a few steps to setup your restaurant and start managing your
            business
          </Typography>
        </Box>

        {/* Modern Stepper */}
        <Box sx={{ mb: 6, px: { xs: 0, md: 2 } }}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            connector={
              <StepConnector
                sx={{
                  "& .MuiStepConnector-line": {
                    height: 4,
                    borderRadius: 2,
                    border: 0,
                    background:
                      "linear-gradient(90deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.05) 100%)",
                  },
                  "&.Mui-active .MuiStepConnector-line": {
                    background:
                      "linear-gradient(90deg, rgba(246, 156, 61) 0%, rgb(246, 156, 61) 50%, rgba(246, 156, 61) 100%)",
                  },
                  "&.Mui-completed .MuiStepConnector-line": {
                    background:
                      "linear-gradient(90deg, rgba(202, 135, 28) 0%, rgb(202, 135, 28) 50%, rgba(202, 135, 28) 100%)",
                  },
                }}
              />
            }
          >
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  sx={{
                    "& .MuiStepLabel-label": {
                      mt: 1,
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      fontWeight: index <= activeStep ? 600 : 400,
                      color:
                        index <= activeStep ? "text.primary" : "text.secondary",
                    },
                  }}
                  StepIconComponent={(props) => (
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: props.completed
                          ? "success.main"
                          : props.active
                            ? "primary.main"
                            : "rgba(0,0,0,0.06)",
                        color:
                          props.completed || props.active
                            ? "#fff"
                            : "text.secondary",
                        boxShadow: props.active
                          ? "0 4px 12px rgba(99,102,241,0.3)"
                          : "none",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {props.completed ? (
                        <CheckIcon fontSize="small" />
                      ) : (
                        <Typography variant="body2" fontWeight={600}>
                          {props.icon}
                        </Typography>
                      )}
                    </Box>
                  )}
                >
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Content Card */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              mb: 4,
              borderRadius: 3,
              backgroundColor: "background.paper",
              border: "1px solid rgba(0,0,0,0.04)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 3 }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "12px",
                  backgroundColor: "background.default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {activeStep === steps.length - 1 ? (
                  <CheckCircleOutlineOutlined color="primary" />
                ) : (
                  <InfoOutlined color="primary" />
                )}
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  color="text.primary"
                  sx={{ fontWeight: 600, mb: 0.5 }}
                >
                  {steps[activeStep].label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {steps[activeStep].description}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ pt: 2 }}>{getStepContent(activeStep)}</Box>
          </Paper>
        </motion.div>

        {/* Navigation Buttons */}
        <Box sx={{ mb: 2, mt: 4 }}>
          <Stack
            direction={{ xs: "column-reverse", sm: "row" }}
            spacing={2}
            justifyContent="space-between"
          >
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              size="large"
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                textTransform: "none",
                borderWidth: "2px",
                "&:hover": {
                  borderWidth: "2px",
                },
              }}
            >
              Previous
            </Button>

            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!isFormValid || mutation.isPending}
              endIcon={
                activeStep === steps.length - 1 ? null : <ArrowForwardIcon />
              }
              size="large"
              sx={{
                borderRadius: 2,
                px: 5,
                py: 1.5,
                textTransform: "none",
                fontWeight: 600,
                background:
                  activeStep === steps.length - 1
                    ? "Secondary.main"
                    : "primary.light",
                boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                "&:hover": {
                  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                },
                "&:disabled": {
                  background: "rgba(0,0,0,0.12)",
                },
              }}
            >
              {mutation.isPending && activeStep === steps.length - 1 ? (
                <CircularProgress size={24} color="inherit" />
              ) : activeStep === steps.length - 1 ? (
                "Finish Setup"
              ) : (
                "Next Step"
              )}
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Snackbar Notification */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
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
    </Paper>
  );
};

export default RestaurantStepperForm;
