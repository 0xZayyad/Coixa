import { createTheme, responsiveFontSizes } from "@mui/material";

const baseTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#06B6D4", // Modern indigo
      light: "#818CF8",
      dark: "#4F46E5",
    },
    secondary: {
      main: "#06B6D4", // Modern cyan
      light: "#22D3EE",
      dark: "#0891B2",
    },
    background: {
      default: "#111827", // Darker slate
      paper: "#1F2937",
    },
    text: {
      primary: "#F9FAFB",
      secondary: "#D1D5DB",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "system-ui", "Avenir", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          padding: "10px 20px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export const theme = responsiveFontSizes(baseTheme);
