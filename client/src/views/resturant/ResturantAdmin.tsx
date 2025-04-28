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
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AppProvider } from "@toolpad/core/AppProvider";
import {
  DashboardLayout,
  SidebarFooterProps,
} from "@toolpad/core/DashboardLayout";
import {
  Account,
  AccountPreview,
  AccountPopoverFooter,
  SignOutButton,
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
import { useNavigate } from "react-router-dom";

//Get user dtails


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

      <Typography variant="h6" noWrap>
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
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (loading) {
    return <Loader />;
  }

  // Render different components based on the pathname
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
  return (
    <Stack direction="column" p={0}>
      <Divider />
      <AccountPreview
        variant={mini ? "condensed" : "expanded"}
        handleClick={handleClick}
        open={open}
      />
    </Stack>
  );
}

const userDetails = getUserDetails();
const restaurantEmail = userDetails?.email;
const restaurantName = userDetails?.name;

function SidebarFooterAccountPopover({ accounts = [] }) {
  const userDetails = getUserDetails();
  const restaurantEmail = userDetails?.email;
  const restaurantName = userDetails?.name;

  return (
    <Stack direction="column" sx={{ width: 250 }}>
      {/* User Account Section */}
      <MenuItem
        component="div"
        sx={{
          justifyContent: "flex-start",
          width: "100%",
          columnGap: 2,
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <ListItemIcon>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              fontSize: "1rem",
              bgcolor: '#f28644',
            }}
          >
            {restaurantName?.charAt(0)?.toUpperCase()}
          </Avatar>
        </ListItemIcon>
        <ListItemText
          primary={restaurantName ?? "Restaurant Name"}
          secondary={restaurantEmail ?? "email@example.com"}
          primaryTypographyProps={{ 
            variant: "subtitle2",
            fontWeight: 600 
          }}
          secondaryTypographyProps={{ 
            variant: "caption",
            color: "text.secondary"
          }}
        />
      </MenuItem>
      
      {/* Footer Section */}
      <AccountPopoverFooter>
        <SignOutButton />
      </AccountPopoverFooter>
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

const resAdminSession = {
  user: {
    name: restaurantName,
    email: restaurantEmail,
    image: "",
  },
};

export default function DashboardLayoutAccountSidebar() {
  const [pathname, setPathname] = React.useState("/dashboard");

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
        navigate('/'); // React Router navigation
      },
    };
  }, [router]); 

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
          toolbarAccount: () => null,
          sidebarFooter: SidebarFooterAccount,
          appTitle: AppTitle,
        }}
      >
        <RestaurantPageContent pathname={pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}