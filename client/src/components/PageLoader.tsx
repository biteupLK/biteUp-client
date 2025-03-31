import { Backdrop, CircularProgress } from "@mui/material";
import theme from "../theme";

export default function PageLoader() {
  return (
    <Backdrop
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
      }}
      open={true}
    >
      <CircularProgress color="info" size={"3rem"} />
    </Backdrop>
  );
}
