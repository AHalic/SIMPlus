"use client";

import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { getTheme } from "../style/palette";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';

const Provider = ({ 
  children 
}) => {
  return (
    <AppRouterCacheProvider>
    	<LocalizationProvider dateAdapter={AdapterLuxon}>
			<ThemeProvider theme={getTheme()}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</LocalizationProvider>
    </AppRouterCacheProvider>
  );
};

export default Provider;
