"use client";

import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { getTheme } from "../style/palette";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

const Provider = ({ 
  children 
}) => {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={getTheme()}>
          <CssBaseline />
          {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export default Provider;
