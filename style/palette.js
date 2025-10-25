import { createTheme } from "@mui/material";


const getPalette = () => {
  return createTheme({
    palette: {
        primary: {
            main: "#0D1221",
        },
        secondary: {
            main: "#FFFFFF",
        },
        divider: "#7F90AB",
        background: {
            default: "#F0F4F8",
        },
        text: {
            primary: "#0D1221",
            secondary: "#5D5D6F",
        },
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
