// RestaurantForm.tsx
import { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
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
  InputAdornment
} from '@mui/material';
import { 
  CloudUpload as CloudUploadIcon,
  LocationOn as LocationIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Custom styled component for file upload
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// Google Maps type declarations
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

// Define the restaurant data structure
interface RestaurantData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  email: string;
  description: string;
  logo: File | null;
  latitude: number | null;
  longitude: number | null;
  placeId: string | null;
}

// Simulated API call to add a restaurant
const addRestaurant = async (data: RestaurantData): Promise<{ success: boolean; message: string }> => {
  // This would be replaced with your actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Restaurant data submitted:', data);
      resolve({ success: true, message: 'Restaurant added successfully!' });
    }, 1500);
  });
};

// Google Maps API key - Replace with your actual API key
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

const RestaurantForm = () => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [predictions, setPredictions] = useState<any[]>([]);
  
  // Refs for Google Maps objects
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  
  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<RestaurantData>({
    defaultValues: {
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phoneNumber: '',
      email: '',
      description: '',
      logo: null,
      latitude: null,
      longitude: null,
      placeId: null
    }
  });

  // TanStack mutation for handling form submission
  const mutation = useMutation({
    mutationFn: addRestaurant,
    onSuccess: (data) => {
      setSnackbarMessage(data.message);
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      reset();
      setLogoPreview(null);
      
      // Reset map marker
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
    },
    onError: (error) => {
      setSnackbarMessage('Failed to add restaurant. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  });

  // Load Google Maps API
  useEffect(() => {
    if (!googleMapsLoaded && !window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      window.initMap = () => {
        setGoogleMapsLoaded(true);
      };
      
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
        delete window.initMap;
      };
    }
  }, [googleMapsLoaded]);
  
  // Initialize map after API loads
  useEffect(() => {
    if (googleMapsLoaded && mapRef.current && !mapInstanceRef.current) {
      // Default to a central location (can be customized)
      const defaultLocation = { lat: 40.7128, lng: -74.0060 }; // New York
      
      const mapOptions = {
        center: defaultLocation,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      };
      
      const map = new window.google.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = map;
      
      // Initialize Places services
      placesServiceRef.current = new window.google.maps.places.PlacesService(map);
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      
      // Handle map click to place marker
      map.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          placeMarker(e.latLng);
          
          // Reverse geocode to get address details
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: e.latLng }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
            if (status === 'OK' && results[0]) {
              updateAddressFields(results[0]);
            }
          });
        }
      });
    }
  }, [googleMapsLoaded]);
  
  // Handle place selection
  const handlePlaceSelect = (prediction: any) => {
    if (!placesServiceRef.current || !prediction) return;
    
    const request = {
      placeId: prediction.place_id,
      fields: ['geometry', 'formatted_address', 'address_components', 'place_id']
    };
    
    placesServiceRef.current.getDetails(request, (place: google.maps.places.PlaceResult | null, status: google.maps.places.PlacesServiceStatus) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place && place.geometry && place.geometry.location) {
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
        setSearchValue('');
        setPredictions([]);
      }
    });
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
      draggable: true
    });
    
    markerRef.current = marker;
    
    // Update form values with coordinates
    setValue('latitude', location.lat());
    setValue('longitude', location.lng());
    
    // Handle marker drag
    marker.addListener('dragend', () => {
      const position = marker.getPosition();
      if (position) {
        setValue('latitude', position.lat());
        setValue('longitude', position.lng());
        
        // Reverse geocode to get updated address
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: position }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
          if (status === 'OK' && results[0]) {
            updateAddressFields(results[0]);
          }
        });
      }
    });
  };
  
  // Update address fields from place data
  const updateAddressFields = (place: google.maps.places.PlaceResult | google.maps.GeocoderResult) => {
    let streetNumber = '';
    let route = '';
    let city = '';
    let state = '';
    let zipCode = '';
    
    // Process address components
    if (place.address_components) {
      for (const component of place.address_components) {
        const types = component.types;
        
        if (types.includes('street_number')) {
          streetNumber = component.long_name;
        } else if (types.includes('route')) {
          route = component.long_name;
        } else if (types.includes('locality') || types.includes('sublocality')) {
          city = component.long_name;
        } else if (types.includes('administrative_area_level_1')) {
          state = component.short_name; // Use short name for state (e.g., CA instead of California)
        } else if (types.includes('postal_code')) {
          zipCode = component.long_name;
        }
      }
    }
    
    // Update form values
    setValue('address', `${streetNumber} ${route}`.trim());
    setValue('city', city);
    setValue('state', state);
    setValue('zipCode', zipCode);
    
    // Set place ID if available
    if ('place_id' in place) {
      setValue('placeId', place.place_id || null);
    }
  };
  
  // Handle address search
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    
    if (value.length > 2 && autocompleteServiceRef.current) {
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: value,
          types: ['establishment', 'geocode'],
          componentRestrictions: { country: 'us' } // Customize for your region
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

  const onSubmit = (data: RestaurantData) => {
    mutation.mutate(data);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
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

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Add Your Restaurant
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={3}>
          {/* Restaurant Logo Upload */}
          <Stack alignItems="center" spacing={2}>
            <Typography variant="subtitle1">
              Restaurant Logo
            </Typography>
            
            {logoPreview && (
              <Box sx={{ width: 150, height: 150, overflow: 'hidden', borderRadius: '50%' }}>
                <img 
                  src={logoPreview} 
                  alt="Restaurant logo preview" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </Box>
            )}
            
            <Controller
              name="logo"
              control={control}
              rules={{ required: 'Restaurant logo is required' }}
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
                      onChange={(e) => handleLogoChange(e, onChange)}
                      {...field}
                    />
                  </Button>
                  {errors.logo && (
                    <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                      {errors.logo.message}
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
            rules={{ required: 'Restaurant name is required' }}
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
          
          {/* Restaurant Location */}
          <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Restaurant Location
            </Typography>
            
            {/* Google Maps Search */}
            <Autocomplete
              freeSolo
              options={predictions}
              getOptionLabel={(option) => typeof option === 'string' ? option : option.description}
              inputValue={searchValue}
              onInputChange={(_, value) => handleSearchChange(value)}
              onChange={(_, value) => {
                if (value && typeof value !== 'string') {
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
                    )
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
                width: '100%', 
                height: 300, 
                mt: 2, 
                mb: 2, 
                borderRadius: 1,
                backgroundColor: '#f5f5f5'
              }}
            >
              {!googleMapsLoaded && (
                <Box sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <CircularProgress />
                </Box>
              )}
            </Box>
            
            <Stack spacing={2}>
              <Typography variant="caption" color="text.secondary">
                Search for your restaurant or click on the map to set your location
              </Typography>
              
              {/* Hidden fields for coordinates */}
              <Controller name="latitude" control={control} render={({ field }) => <input type="hidden" {...field} />} />
              <Controller name="longitude" control={control} render={({ field }) => <input type="hidden" {...field} />} />
              <Controller name="placeId" control={control} render={({ field }) => <input type="hidden" {...field} />} />
              
              {/* Location error message */}
              {(errors.latitude || errors.longitude) && (
                <Typography color="error" variant="caption">
                  Please select a location on the map
                </Typography>
              )}
            </Stack>
          </Box>

          {/* Restaurant Address - These will be auto-filled from map */}
          <Controller
            name="address"
            control={control}
            rules={{ required: 'Address is required' }}
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
          
          {/* City, State, Zip Code */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Controller
              name="city"
              control={control}
              rules={{ required: 'City is required' }}
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
              rules={{ required: 'State is required' }}
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
                required: 'Zip code is required',
                pattern: {
                  value: /^\d{5}(-\d{4})?$/,
                  message: 'Enter a valid zip code'
                }
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
          
          {/* Contact Information */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Controller
              name="phoneNumber"
              control={control}
              rules={{ 
                required: 'Phone number is required',
                pattern: {
                  value: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
                  message: 'Enter a valid phone number'
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Phone Number"
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                />
              )}
            />
            
            <Controller
              name="email"
              control={control}
              rules={{ 
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Enter a valid email address'
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email Address"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Stack>
          
          {/* Restaurant Description */}
          <Controller
            name="description"
            control={control}
            rules={{ required: 'Description is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                rows={4}
                label="Restaurant Description"
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />
          
          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={mutation.isPending}
            sx={{ py: 1.5, mt: 2 }}
          >
            {mutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Add Restaurant'
            )}
          </Button>
        </Stack>
      </Box>
      
      {/* Success/Error Notification */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default RestaurantForm;