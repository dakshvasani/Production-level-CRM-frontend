import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1E40AF" },
    secondary: { main: "#0EA5E9" },
    background: { default: "#F4F6F8" },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
  },
});

export default theme;