import { Stack, TextField, Button, Box, CircularProgress, Typography, Paper, Avatar } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import {
  UserSchema,
  fetchUserByEmail,
  profileSave,
  profileUpdate,
} from "../../api/userApi";
import getUserDetails from "../../customHooks/extractPayload";
import Navbar from "../../components/layOuts/Navbar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import queryClient from "../../state/queryClient";
import { Edit, Save, Phone, Home, Email, Person } from "@mui/icons-material";

export default function UserProfile() {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  
  useEffect(() => {
    const details = getUserDetails();
    setUserDetails(details);
  }, []);

  const { data: userData, isFetching: isUserDataFetching } = useQuery({
    queryKey: ["users", userDetails?.email],
    queryFn: () => fetchUserByEmail(userDetails?.email),
    enabled: !!userDetails?.email,
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<UserSchema>({
    mode: "onChange"
  });

  useEffect(() => {
    if (userDetails && userData) {
      reset({
        firstName: userDetails?.given_name || userDetails?.name || "",
        lastName: userDetails?.family_name || "",
        email: userDetails?.email || "",
        mobile: userData?.mobile || "",
        address: userData?.address || "",
      });
    }
  }, [userDetails, userData, reset]);

  const { mutate: profileSaveMutation, isPending: isRegisterPending } =
    useMutation({
      mutationFn: profileSave,
      onSuccess: () => {
        enqueueSnackbar("Profile saved successfully!", {
          variant: "success",
        });
        setEditMode(false);
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
      onError: (error: any) => {
        enqueueSnackbar(error?.data?.message ?? `Profile save failed`, {
          variant: "error",
        });
      },
    });

  const { mutate: profileUpdateMutation, isPending: isUpdatePending } =
    useMutation({
      mutationFn: profileUpdate,
      onSuccess: () => {
        enqueueSnackbar("Profile updated successfully!", {
          variant: "success",
        });
        setEditMode(false);
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
      onError: (error: any) => {
        enqueueSnackbar(error?.data?.message ?? `Profile update failed`, {
          variant: "error",
        });
      },
    });

  const onSubmit = (data: UserSchema) => {
    if (userData && userData.length > 0) {
      profileUpdateMutation(data);
    } else {
      profileSaveMutation(data);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "white", minHeight: "100vh" }}>
      <Navbar />
      <Box sx={{ maxWidth: 800, mx: "auto", p: { xs: 2, md: 4 } }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Stack spacing={4}>
            {/* Profile Header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: "#FF9800",
                  fontSize: "2rem"
                }}
              >
                {getInitials(
                  userDetails?.given_name || userDetails?.name || "",
                  userDetails?.family_name || ""
                )}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {userDetails?.given_name || userDetails?.name || ""} {userDetails?.family_name || ""}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {userDetails?.email || ""}
                </Typography>
              </Box>
              {!editMode && (
                <Button
                  startIcon={<Edit />}
                  variant="outlined"
                  onClick={() => setEditMode(true)}
                  sx={{ 
                    ml: "auto",
                    color: "#20AB73",
                    borderColor: "#20AB73",
                    '&:hover': {
                      borderColor: "#20AB73",
                      backgroundColor: "rgba(32, 171, 115, 0.08)"
                    }
                  }}
                >
                  Edit Profile
                </Button>
              )}
            </Box>

            {/* Profile Form */}
            <Box 
              component="form" 
              onSubmit={handleSubmit(onSubmit)}
              sx={{ display: "grid", gridTemplateColumns: { md: "1fr 1fr" }, gap: 3 }}
            >
              {/* First Name */}
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Person fontSize="small" /> First Name
                </Typography>
                <Controller
                  name="firstName"
                  control={control}
                  rules={{ required: "First Name is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      InputProps={{ 
                        readOnly: !editMode,
                        sx: { 
                          backgroundColor: editMode ? "white" : "action.disabledBackground",
                          borderRadius: 2
                        }
                      }}
                    />
                  )}
                />
              </Box>

              {/* Last Name */}
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Person fontSize="small" /> Last Name
                </Typography>
                <Controller
                  name="lastName"
                  control={control}
                  rules={{ required: "Last Name is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                      InputProps={{ 
                        readOnly: !editMode,
                        sx: { 
                          backgroundColor: editMode ? "white" : "action.disabledBackground",
                          borderRadius: 2
                        }
                      }}
                    />
                  )}
                />
              </Box>

              {/* Email */}
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Email fontSize="small" /> Email
                </Typography>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      InputProps={{ 
                        readOnly: true,
                        sx: { 
                          backgroundColor: "action.disabledBackground",
                          borderRadius: 2
                        }
                      }}
                    />
                  )}
                />
              </Box>

              {/* Mobile */}
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Phone fontSize="small" /> Mobile
                </Typography>
                {isUserDataFetching ? (
                  <CircularProgress size={24} color="info" />
                ) : (
                  <Controller
                    name="mobile"
                    control={control}
                    rules={{ 
                      required: "Mobile is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Please enter a valid 10-digit mobile number"
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size="small"
                        type="tel"
                        error={!!errors.mobile}
                        helperText={errors.mobile?.message}
                        InputProps={{ 
                          readOnly: !editMode,
                          sx: { 
                            backgroundColor: editMode ? "white" : "action.disabledBackground",
                            borderRadius: 2
                          }
                        }}
                      />
                    )}
                  />
                )}
              </Box>

              {/* Address */}
              <Box sx={{ gridColumn: "1 / -1" }}>
                <Typography variant="subtitle2" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Home fontSize="small" /> Address
                </Typography>
                {isUserDataFetching ? (
                  <CircularProgress size={24} color="info" />
                ) : (
                  <Controller
                    name="address"
                    control={control}
                    rules={{ required: "Address is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size="small"
                        multiline
                        rows={3}
                        error={!!errors.address}
                        helperText={errors.address?.message}
                        InputProps={{ 
                          readOnly: !editMode,
                          sx: { 
                            backgroundColor: editMode ? "white" : "action.disabledBackground",
                            borderRadius: 2
                          }
                        }}
                      />
                    )}
                  />
                )}
              </Box>

              {/* Action Buttons */}
              {editMode && (
                <Box sx={{ 
                  gridColumn: "1 / -1", 
                  display: "flex", 
                  justifyContent: "flex-end", 
                  gap: 2,
                  pt: 2
                }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      reset();
                      setEditMode(false);
                    }}
                    sx={{
                      color: "#FF9800",
                      borderColor: "#FF9800",
                      '&:hover': {
                        borderColor: "#FF9800",
                        backgroundColor: "rgba(255, 152, 0, 0.08)"
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!isDirty || isUpdatePending || isRegisterPending}
                    startIcon={<Save />}
                    sx={{
                      backgroundColor: "#20AB73",
                      '&:hover': {
                        backgroundColor: "#1a8f62"
                      }
                    }}
                  >
                    {isUpdatePending || isRegisterPending ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </Box>
              )}
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}