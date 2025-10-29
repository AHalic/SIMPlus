"use client";

import { Grid, Typography, Box, Button } from "@mui/material";
import CustomInput from "@/components/Input";

export default function Home() {
  return (
    <Grid
      container
      justifyContent="normal"
      alignItems="center"
      direction="column"
      spacing={3}
      sx={{
        minHeight: "85vh",
        padding: "2rem",
        textAlign: "center",
        backgroundColor: "background.default",
      }}
    >
      <Grid item>
        <Typography
          variant="h3"
          fontWeight="700"
          color="text.primary"
        
        >
          Welcome to SIM+
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your all-in-one stock control and management system
        </Typography>
      </Grid>

      {/* Search bar 
          needs to be connected to backend
      */}
      <Grid
        item
        sx={{
          width: "50%",
          maxWidth: "400px",
          mt: 1,
        }}
      >
        <CustomInput
          label="Search Products"
          placeholder="Enter product name..."
        />
      </Grid>


      {/*visuals go here 
        e.g., charts, recent activity, etc.
      */}
      <Grid item>

      </Grid>
      <Grid
        item
        sx={{
          display: "flex",
          gap: 1,
          mt: 1,
        }}
      >
        {/* Action Buttons 
          needs to be connected to backend
        */}
        <Button
          variant="contained"
          color="primary"
          sx={{ fontWeight: "600", paddingX: 3 }}
          
        >
          View Inventory
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ fontWeight: "600", paddingX: 3 }}
        >
          Add New Product
        </Button>
      </Grid>

      
        
      <Box sx={{ position: "absolute", bottom: 24 }}>
        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} SIMPlus | Stock Control System
        </Typography>
      </Box>
    </Grid>
  );
}

