"use client";

import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { getTheme } from "../style/palette";

const Provider = ({ 
  children 
}) => {
  return (
        <ThemeProvider theme={getTheme()}>
            <CssBaseline />
            {children}
        </ThemeProvider>
  );
};

export default Provider;
