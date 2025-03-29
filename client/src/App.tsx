import { BrowserRouter } from "react-router";
import AppRoutes from "./Routes.tsx";
import { SnackbarProvider } from "notistack";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme.ts";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./state/queryClient.ts";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <SnackbarProvider maxSnack={3} autoHideDuration={2500}>
          <AppRoutes />
        </SnackbarProvider>
      </BrowserRouter>
    </ThemeProvider>
    </QueryClientProvider>

  )
}

export default App
