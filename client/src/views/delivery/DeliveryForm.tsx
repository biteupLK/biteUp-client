import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container,
  Typography,
  Box,
  Avatar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  CircularProgress,
  Alert,
  SelectChangeEvent,
  Stepper,
  Step,
  StepLabel,
  Fade,
  Grow,
  Slide,
  useTheme,
  Paper
} from '@mui/material';
import { LocalShipping as DeliveryIcon, EmojiTransportation, TwoWheeler, DirectionsCar, AirplanemodeActive } from '@mui/icons-material';
import { createDelivery, validateDeliveryData } from '../../api/deliveryApi';
import { DeliverySchema } from '../../api/deliveryApi';
import getUserDetails from "../../customHooks/extractPayload";

// Vehicle type options with icons
const vehicleTypes = [
  { value: 'bike', label: 'Bicycle', icon: <TwoWheeler /> },
  { value: 'motorcycle', label: 'Motorcycle', icon: <TwoWheeler /> },
  { value: 'car', label: 'Car', icon: <DirectionsCar /> },
  { value: 'truck', label: 'Truck', icon: <EmojiTransportation /> },
  { value: 'scooter', label: 'Scooter', icon: <AirplanemodeActive /> },
];

const steps = ['Welcome', 'Personal Info', 'Vehicle Details', 'Complete'];

const DeliveryForm: React.FC = () => {
  const theme = useTheme();
  const userDetails = getUserDetails();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Omit<DeliverySchema, 'id'>>({
    deliveryName: '',
    email: userDetails?.email || '',
    age: '',
    vehicleNumber: '',
    vehicleType: 'bike',
    contactNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (userDetails?.email) {
      setFormData(prev => ({
        ...prev,
        email: userDetails.email ?? prev.email, 
      }));
    }
  }, [userDetails]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleNext = () => {
    if (activeStep === steps.length - 2) {
      // On the last step before completion, validate all fields
      if (!formData.deliveryName || !formData.age || !formData.contactNumber || !formData.vehicleNumber) {
        setError('Please fill all required fields');
        return;
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setCompleted((prevCompleted) => ({
      ...prevCompleted,
      [activeStep]: true
    }));
    setError(null);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const validatedData = validateDeliveryData(formData);
      const result = await createDelivery(validatedData);
      
      if (result.error) {
        throw new Error(result.error);
      }

      setSuccess(true);
      setActiveStep(steps.length - 1);
      setTimeout(() => {
        navigate('/delivery');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grow in={true} timeout={500}>
            <Stack spacing={4} alignItems="center" textAlign="center">
              <Avatar sx={{ 
                bgcolor: '#22ac74', 
                width: 80, 
                height: 80,
                mb: 2,
                boxShadow: '0 4px 12px rgba(34, 172, 116, 0.3)'
              }}>
                <DeliveryIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h3" fontWeight="bold" color="#22ac74">
                Welcome to Our Delivery Team!
              </Typography>
              <Typography variant="h6" color="text.secondary">
                We're excited to have you join our network of delivery partners.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Let's get you set up in just a few simple steps. You'll be delivering in no time!
              </Typography>
              <Box sx={{ width: '100%', mt: 4 }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    bgcolor: '#ff9800',
                    '&:hover': { bgcolor: '#e68a00' },
                    px: 6,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1rem'
                  }}
                >
                  Get Started
                </Button>
              </Box>
            </Stack>
          </Grow>
        );
      case 1:
        return (
          <Slide direction="left" in={true} mountOnEnter unmountOnExit>
            <Stack spacing={3}>
              <Typography variant="h5" fontWeight="bold" color="#22ac74">
                Personal Information
              </Typography>
              <TextField
                required
                fullWidth
                id="deliveryName"
                label="Full Name"
                name="deliveryName"
                autoComplete="name"
                value={formData.deliveryName}
                onChange={handleInputChange}
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                variant="outlined"
                disabled
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  required
                  fullWidth
                  id="age"
                  label="Age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                  variant="outlined"
                  inputProps={{ min: 18, max: 70 }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
                <TextField
                  required
                  fullWidth
                  id="contactNumber"
                  label="Contact Number"
                  name="contactNumber"
                  autoComplete="tel"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  variant="outlined"
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Stack>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    bgcolor: '#ff9800',
                    '&:hover': { bgcolor: '#e68a00' },
                    px: 4,
                    py: 1.5,
                    borderRadius: 2
                  }}
                >
                  Next
                </Button>
              </Box>
            </Stack>
          </Slide>
        );
      case 2:
        return (
          <Slide direction="left" in={true} mountOnEnter unmountOnExit>
            <Stack spacing={3}>
              <Typography variant="h5" fontWeight="bold" color="#22ac74">
                Vehicle Details
              </Typography>
              <FormControl fullWidth required>
                <InputLabel id="vehicleType-label">Vehicle Type</InputLabel>
                <Select
                  labelId="vehicleType-label"
                  id="vehicleType"
                  name="vehicleType"
                  value={formData.vehicleType}
                  label="Vehicle Type"
                  onChange={handleSelectChange}
                  sx={{ 
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                >
                  {vehicleTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value} sx={{ display: 'flex', gap: 2 }}>
                      {type.icon}
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                required
                fullWidth
                id="vehicleNumber"
                label="Vehicle Number"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleInputChange}
                variant="outlined"
                placeholder="e.g., AB123CD"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  sx={{
                    color: '#ff9800',
                    borderColor: '#ff9800',
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    '&:hover': {
                      borderColor: '#e68a00',
                      backgroundColor: 'rgba(255, 152, 0, 0.04)'
                    }
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    bgcolor: '#22ac74',
                    '&:hover': { bgcolor: '#1d9a66' },
                    px: 4,
                    py: 1.5,
                    borderRadius: 2
                  }}
                >
                  Next
                </Button>
              </Box>
            </Stack>
          </Slide>
        );
      case 3:
        return (
          <Fade in={true} timeout={800}>
            <Stack spacing={4} alignItems="center" textAlign="center">
              {success ? (
                <>
                  <Avatar sx={{ 
                    bgcolor: '#22ac74', 
                    width: 80, 
                    height: 80,
                    mb: 2,
                    boxShadow: '0 4px 12px rgba(34, 172, 116, 0.3)'
                  }}>
                    <DeliveryIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h3" fontWeight="bold" color="#22ac74">
                    Congratulations!
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Your delivery profile is complete.
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    We're preparing your dashboard. You'll be redirected shortly...
                  </Typography>
                  <CircularProgress sx={{ color: '#22ac74', mt: 3 }} />
                </>
              ) : (
                <>
                  <Typography variant="h5" fontWeight="bold" color="#22ac74">
                    Review Your Information
                  </Typography>
                  <Paper elevation={0} sx={{ 
                    p: 3, 
                    width: '100%', 
                    borderRadius: 3,
                    border: '1px solid #e0e0e0',
                    textAlign: 'left'
                  }}>
                    <Stack spacing={2}>
                      <Typography><strong>Name:</strong> {formData.deliveryName}</Typography>
                      <Typography><strong>Email:</strong> {formData.email}</Typography>
                      <Typography><strong>Age:</strong> {formData.age}</Typography>
                      <Typography><strong>Contact:</strong> {formData.contactNumber}</Typography>
                      <Typography><strong>Vehicle Type:</strong> {vehicleTypes.find(v => v.value === formData.vehicleType)?.label}</Typography>
                      <Typography><strong>Vehicle Number:</strong> {formData.vehicleNumber}</Typography>
                    </Stack>
                  </Paper>
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      variant="outlined"
                      onClick={handleBack}
                      sx={{
                        color: '#ff9800',
                        borderColor: '#ff9800',
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        '&:hover': {
                          borderColor: '#e68a00',
                          backgroundColor: 'rgba(255, 152, 0, 0.04)'
                        }
                      }}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={loading}
                      sx={{
                        bgcolor: '#22ac74',
                        '&:hover': { bgcolor: '#1d9a66' },
                        px: 4,
                        py: 1.5,
                        borderRadius: 2
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        'Complete Registration'
                      )}
                    </Button>
                  </Box>
                </>
              )}
            </Stack>
          </Fade>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{ 
      mt: { xs: 4, md: 8 }, 
      mb: 8,
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <Paper elevation={4} sx={{ 
        p: { xs: 3, md: 6 }, 
        borderRadius: 4,
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.95))',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <Stepper 
          activeStep={activeStep} 
          alternativeLabel
          sx={{ 
            mb: 6,
            '& .MuiStepLabel-root .Mui-completed': {
              color: '#22ac74',
            },
            '& .MuiStepLabel-root .Mui-active': {
              color: '#ff9800',
            },
          }}
        >
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index] || false}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ width: '100%' }}>
          {getStepContent(activeStep)}
        </Box>

        {error && (
          <Fade in={!!error}>
            <Alert 
              severity="error" 
              sx={{ 
                mt: 3,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              {error}
            </Alert>
          </Fade>
        )}
      </Paper>
    </Container>
  );
};

export default DeliveryForm;