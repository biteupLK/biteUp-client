import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: {
      default: "#E7E7E7", // --color-background
      paper: "#ffffff",   // --color-surface
    },
    primary: {
      main: "#008000",        // --color-primary
      light: "#22AC74",       // --color-primary-light
    },
    secondary: {
      main: "#FF9800",        // --color-accent
    },
    text: {
      primary: "#1e293b",     // --color-text
      secondary: "#64748b",   // --color-text-light
    },
    divider: "#e2e8f0",       // --color-border
  },
  typography: {
    fontFamily: '"Arial Rounded MT Bold", "Poppins", "Inter", sans-serif',
  },
  shape: {
    borderRadius: 12,          // --border-radius-default
  }
});

export default theme;
