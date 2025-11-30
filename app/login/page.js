"use client";

import { OutlinedInput } from "@/components/OtulinedInput";
import { EmailOutlined, LockOutline } from "@mui/icons-material";
import { Button, Grid, InputAdornment, Typography } from "@mui/material";
import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

/**
 * Login Page Component
 *
 * Renders the login form with email and password inputs,
 * handles authentication via the `/api/login` endpoint,
 * and redirects the user to the main page on success.
 *
 * Displays an inline error message in red if login fails.
 *
 * @component
 * @returns {JSX.Element} The rendered login page UI
 */
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const router = useRouter(); 

  const handleSignIn = async () => {
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password");
      return;
    }

    try {
      const response = await axios.post("api/login", { email, password });

      router.push("/");
    } catch (error) {
      console.log("Login failed:", error);

      let message = "Wrong email or password";

      // error handling
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        console.log("Login API error status/data:", status, data);

        if (data?.error) {
        
          message = data.error;
        } else if (data?.message) {
          message = data.message;
        } else if (status === 500) {
          message = "Something went wrong on the server";
        }
      }

      setErrorMessage(message);
    }
  };

    return (
        <Grid container 
            width="100%"
            direction="column"
            alignItems="center"
            justifyContent="center"
            paddingY="3rem"
            gap="2rem"
        >
            {/* logo */}
            <Grid container 
                direction="column"
                alignItems="center"
                justifyContent="center"
                gap="1.5rem"
            >
                <Grid>
                    <Image
                        unselectable="on" 
                        src={`/icon.svg`}
                        height={80}
                        width={80}
                        alt="logo"
                    />
                </Grid>

                <Grid container direction="column" alignItems="center">
                    <Typography variant="h4" fontWeight={600}>
                        SIM+
                    </Typography>

                    <Typography variant="subtitle1" color="text.secondary">
                        Manage your inventory with ease
                    </Typography>
                </Grid>
            </Grid>

            {/* main form */}
            <Grid 
                container
                bgcolor="secondary.main"
                borderRadius="12px"
                padding="2.5rem"
                direction="column"
                boxShadow={1}
                gap="2rem"
                width="60vh"
                maxWidth="800px"
            >
                <Grid>
                    <Typography variant="h6">
                        Sign in to your account
                    </Typography>
                </Grid>

                {/* inputs */}
                <Grid container direction="column" gap="1rem">
                    <Grid width="100%">
                        <OutlinedInput 
                            label="Email" 
                            placeholder="you@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            slotProps={{
                            input: {
                            startAdornment: (
                            <InputAdornment position="start">
                                <EmailOutlined sx={{ color: "divider" }} />
                            </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    </Grid>

                    <Grid width="100%">
                        <OutlinedInput
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••"
                            error={!!errorMessage} // highlight red if error exists
                            slotProps={{
                            input: {
                            startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutline sx={{ color: "divider" }} />
                                    </InputAdornment>
                                    ),
                                },
                            }}
                        />
                        {/* Error message displayed in red under inputs */}
                        {errorMessage && (
                            <Typography color="error" variant="body2">
                                {errorMessage}
                            </Typography>
                        )}
                    </Grid>                    
                </Grid>

                <Grid container>
                    <Button onClick={(e) => handleSignIn()} variant="contained" fullWidth>
                        Sign in
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
}
