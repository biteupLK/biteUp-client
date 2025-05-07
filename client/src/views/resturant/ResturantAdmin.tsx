import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EditIcon from "@mui/icons-material/Edit";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { AppProvider } from "@toolpad/core/AppProvider";
import {
  DashboardLayout,
  SidebarFooterProps,
} from "@toolpad/core/DashboardLayout";
import {
  Account,
  AccountPreview,
  AccountPreviewProps,
} from "@toolpad/core/Account";
import type { Navigation, Router, Session } from "@toolpad/core/AppProvider";
import logo from "../../assets/logo/biteUpLogo.png";
import CircularProgress from "@mui/material/CircularProgress";

//pages
import Dashboard from "./Dashboard";
import Orders from "./Orders";
import AddMenuItem from "./MenuManager";
import { FoodBankSharp } from "@mui/icons-material";

import getUserDetails from "../../customHooks/extractPayload";
import { Link, useNavigate } from "react-router-dom";
import { getRestaurantImg } from "../../api/restaurantApi";

function AppTitle() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="Logo"
        sx={{
          height: 50,
          maxWidth: "auto",
        }}
      />

      <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
        Restaurants
      </Typography>
    </Box>
  );
}

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "orders",
    title: "Orders",
    icon: <ShoppingCartIcon />,
  },
  {
    segment: "MenuManager",
    title: "Menu Manager",
    icon: <FoodBankSharp />,
  },
];

const Theme = createTheme({
  palette: {
    primary: {
      main: "#f28644",
      contrastText: "#ffffff",
    },
    mode: "light",
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function Loader() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress color="primary" size={60} />
    </Box>
  );
}

function RestaurantPageContent({ pathname }: { pathname: string }) {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (loading) {
    return <Loader />;
  }

  switch (pathname) {
    case "/dashboard":
      return <Dashboard />;
    case "/orders":
      return <Orders />;
    case "/MenuManager":
      return <AddMenuItem />;
    default:
      return (
        <Box
          sx={{
            py: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography>Dashboard content for {pathname}</Typography>
        </Box>
      );
  }
}

function AccountSidebarPreview(props: AccountPreviewProps & { mini: boolean }) {
  const { handleClick, open, mini } = props;
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const userDetails = getUserDetails();
  const restaurantEmail = userDetails?.email;

  React.useEffect(() => {
    async function fetchImage() {
      try {
        if (restaurantEmail) {
          const url = await getRestaurantImg(restaurantEmail);
          setImageUrl(url);
        }
      } catch (error) {
        console.error("Failed to fetch restaurant image:", error);
        setImageUrl(null);
      }
    }
    fetchImage();
  }, [restaurantEmail]);

  return (
    <Stack direction="column" p={0}>
      <Divider />
      <AccountPreview
        variant={mini ? "condensed" : "expanded"}
        handleClick={handleClick}
        open={open}
        slots={{
          avatar: imageUrl
            ? () => <Avatar src={imageUrl} alt="Restaurant" />
            : () => <Avatar>{restaurantEmail?.charAt(0).toUpperCase()}</Avatar>,
        }}
      />
    </Stack>
  );
}

const createPreviewComponent = (mini: boolean) => {
  function PreviewComponent(props: AccountPreviewProps) {
    return <AccountSidebarPreview {...props} mini={mini} />;
  }
  return PreviewComponent;
};

function SidebarFooterAccount({ mini }: SidebarFooterProps) {
  const PreviewComponent = React.useMemo(
    () => createPreviewComponent(mini),
    [mini]
  );
  return (
    <Account
      slots={{
        preview: PreviewComponent,
      }}
      slotProps={{
        popover: {
          transformOrigin: { horizontal: "left", vertical: "bottom" },
          anchorOrigin: { horizontal: "right", vertical: "bottom" },
          disableAutoFocus: true,
          slotProps: {
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1,
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  bottom: 10,
                  left: 0,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translate(-50%, -50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            },
          },
        },
      }}
    />
  );
}

function ToolbarAccount() {
  const userDetails = getUserDetails();
  const restaurantEmail = userDetails?.email;
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const [openEditModal, setOpenEditModal] = React.useState(false);

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

  const handleOpenUpdateProfile = () => {
    navigate("/restaurantProfileUpdate")
    
  };

  return (
    <>
      <Account
        slots={{
          preview: (props) => (
            <AccountPreview
              {...props}
              variant="condensed"
              slots={{
                avatar: () => (
                  <Avatar 
                    src={imageUrl || undefined} 
                    alt={restaurantEmail}
                    sx={{ 
                      width: 40, 
                      height: 40,
                      border: '2px solid #f28644',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        transition: 'transform 0.2s ease-in-out'
                      }
                    }}
                  >
                    {restaurantEmail?.charAt(0).toUpperCase()}
                  </Avatar>
                ),
              }}
            />
          ),
          popoverContent: ({ }) => (
            <Box sx={{ p: 2, width: 240 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  src={imageUrl || undefined}
                  sx={{ width: 48, height: 48, mr: 2 }}
                >
                  {restaurantEmail?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {userDetails?.name || 'Profile'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {restaurantEmail}
                  </Typography>
                </Box>
              </Box>
              <Link to="/restaurantProfileUpdate" style={{ textDecoration: 'none' }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<EditIcon />}
                // onClick={() => {
                //   handleOpenUpdateProfile();
                // }}
                sx={{
                  mt: 1,
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: '#f28644',
                  '&:hover': {
                    bgcolor: '#e07a3d',
                    boxShadow: '0 4px 12px rgba(242, 134, 68, 0.3)'
                  }
                }}
              >
                Edit Profile
              </Button>
              </Link>
            </Box>
          ),
        }}
        slotProps={{
          popover: {
            transformOrigin: { horizontal: "right", vertical: "top" },
            anchorOrigin: { horizontal: "right", vertical: "bottom" },
            slotProps: {
              paper: {
                sx: {
                  mt: 1.5,
                  borderRadius: 2,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  overflow: 'hidden',
                },
              },
            },
          },
        }}
      />
    </>
  );
}

export default function DashboardLayoutAccountSidebar() {
  const userDetails = getUserDetails();
  const restaurantEmail = userDetails?.email;
  const restaurantName = userDetails?.name;
  const [pathname, setPathname] = React.useState("/dashboard");
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const resAdminSession = {
    user: {
      name: restaurantName,
      email: restaurantEmail,
      image: imageUrl || "",
    },
  };

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

  const router = React.useMemo<Router>(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);
  const navigate = useNavigate();
  const [session, setSession] = React.useState<Session | null>(resAdminSession);
  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        setSession(resAdminSession);
      },
      signOut: () => {
        setSession(null);
        navigate("/");
      },
    };
  }, [navigate]);

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={Theme}
      authentication={authentication}
      session={session}
    >
      <DashboardLayout
        slots={{
          toolbarAccount: ToolbarAccount,
          sidebarFooter: SidebarFooterAccount,
          appTitle: AppTitle,
        }}
      >
        <RestaurantPageContent pathname={pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}