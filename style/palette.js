import { createTheme } from "@mui/material";


const getPalette = () => {
  return createTheme({
    palette: {
        primary: {
            main: "#13294D",
        },
        secondary: {
            main: "#FFFFFF",
        },
        divider: "#7F90AB",
        background: {
            default: "#F0F4F8",
        },
        text: {
            primary: "#13294D",
            secondary: "#5D5D6F",
        },
        success: {
          main: "#4CBC5D"
        }
    }
  }
)}


const getTheme = (mode) => {
  const { palette } = getPalette(mode);
 
  return createTheme({
    palette,
  });
};

export { getTheme, getPalette };
