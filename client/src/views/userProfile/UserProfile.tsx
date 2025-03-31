import { Stack, TextField, Button, Box, CircularProgress } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import {
  UserSchema,
  fetchUserByEmail,
  profileSave,
  profileUpdate,
} from "../../api/userApi";
import useIsMobile from "../../customHooks/useIsMobile";
import getUserDetails from "../../customHooks/extractPayload";
import Navbar from "../../components/layOuts/Navbar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import queryClient from "../../state/queryClient";
import { FaBarsProgress } from "react-icons/fa6";

export default function UserProfile() {
  const isMobile = useIsMobile();
  const userDetails = getUserDetails();

  const { data: userData, isFetching: isUserDataFetching } = useQuery({
    queryKey: ["users", userDetails?.email],
    queryFn: () => fetchUserByEmail(userDetails?.email),
    enabled: !!userDetails?.email, // Ensure query runs only if email exists
  });
  const data = queryClient.getQueryData<UserSchema[]>(["users"]);

  // Log the user data after it is fetched successfully
  useEffect(() => {
    if (userData) {
      console.log(userData); // Log user data after it's fetched
    }
  }, [userData]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserSchema>({
    defaultValues: {
      firstName: userDetails?.name || "",
      lastName: userDetails?.family_name || "",
      email: userDetails?.email || "",
      mobile: userData?.mobile || "", // Ensure this won't be undefined
      address: userData?.address || "", // Ensure this won't be undefined
    },
  });

  const { mutate: profileSaveMutation, isRegisterPending } = useMutation({
    mutationFn: profileSave,
    onSuccess: (data) => {
      enqueueSnackbar("Account Updated Successfully!", { variant: "success" });
    },
    onError: (error: any) => {
      console.log(error);
      enqueueSnackbar(error?.data?.message ?? `Account Update Failed`, {
        variant: "error",
      });
    },
  });

  const { mutate: profileUpdateMutation, isUpdatePending } = useMutation({
    mutationFn: profileUpdate,
    onSuccess: (data) => {
      enqueueSnackbar("Account Updated Successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      console.log(error);
      enqueueSnackbar(error?.data?.message ?? `Account Update Failed`, {
        variant: "error",
      });
    },
  });

  const onRegistrationSubmit = (data: UserSchema) => {
    console.log(data);
    profileSaveMutation(data);
  };

  const onUpdateSubmit = (data: UserSchema) => {
    console.log(data);
    profileUpdateMutation(data);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "white", minHeight: "100vh" }}>
      <Navbar />
      <Stack
        spacing={2}
        sx={{
          padding: 10,
        }}
      >
        <Controller
          name="email"
          control={control}
          rules={{ required: "Email is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              required
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              label="Email"
              fullWidth
              InputProps={{ readOnly: true }}
            />
          )}
        />
        <Controller
          name="firstName"
          control={control}
          rules={{ required: "First Name is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              required
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              label="First Name"
              fullWidth
              InputProps={{ readOnly: true }}
            />
          )}
        />

        <Controller
          name="lastName"
          control={control}
          rules={{ required: "Last Name is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              required
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              label="Last Name"
              fullWidth
              InputProps={{ readOnly: true }}
            />
          )}
        />

        {isUserDataFetching ? (
          <CircularProgress color="info" />
        ) : userData && userData.length > 0 ? (
          <Box>
            {userData.map((res: any, index: number) => (
              <Controller
                key={index} // Added a unique key
                name="mobile"
                control={control}
                rules={{ required: "Mobile Number is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    type="tel"
                    value={field.value || res.mobile || ""}
                    error={!!errors.mobile}
                    helperText={errors.mobile?.message}
                    label="Mobile Number"
                    fullWidth
                  />
                )}
              />
            ))}
          </Box>
        ) : (
          <Controller
            name="mobile"
            control={control}
            rules={{ required: "Mobile Number is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                required
                type="tel"
                error={!!errors.mobile}
                helperText={errors.mobile?.message}
                label="Mobile Number"
                fullWidth
              />
            )}
          />
        )}

        {isUserDataFetching ? (
          <CircularProgress color="info" />
        ) : userData && userData.length > 0 ? (
          <Box>
            {userData.map((res: any, index: number) => (
              <Controller
                key={index} // Added a unique key
                name="address"
                control={control}
                rules={{ required: "Address is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    type="tel"
                    value={field.value || res.address}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                    label="Address"
                    fullWidth
                  />
                )}
              />
            ))}
          </Box>
        ) : (
          <Controller
            name="address"
            control={control}
            rules={{ required: "Address is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                required
                type="tel"
                error={!!errors.address}
                helperText={errors.address?.message}
                label="Address"
                fullWidth
              />
            )}
          />
        )}

        {isUserDataFetching ? (
          <CircularProgress color="info" />
        ) : userData && userData.length > 0 ? (
          <Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleSubmit(onUpdateSubmit)}
              disabled={isRegisterPending}
            >
              {isRegisterPending ? <CircularProgress color="info" /> : "Update"}
            </Button>
          </Box>
        ) : (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSubmit(onRegistrationSubmit)}
            disabled={isRegisterPending}
          >
            {isRegisterPending ? <CircularProgress color="info" /> : "Save"}
          </Button>
        )}
      </Stack>
    </Box>
  );
}
