import { BrowserRouter } from "react-router";
import AppRoutes from "./Routes.tsx";
import { SnackbarProvider } from "notistack";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme.ts";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <SnackbarProvider maxSnack={3} autoHideDuration={2500}>
          <AppRoutes />
        </SnackbarProvider>
      </BrowserRouter>
    </ThemeProvider>

  )
}

export default App
