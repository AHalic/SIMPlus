"use client";

import { OutlinedInput } from "@/components/OtulinedInput";
import { EmailOutlined, LockOutline } from "@mui/icons-material";
import { Button, Grid, InputAdornment, Typography } from "@mui/material";
import { useState } from "react";
import { StyledInput } from "@/components/StyledInputs";
import Image from "next/image";
import axios from "axios";
import Router from "next/router";

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


    const handleSignIn = async() => {
        setErrorMessage("");// clear any previous errors

        try {
            // Call backend login API with email + password
            const response = await axios.post('/api/login', { email, password });
            console.log('Login successful:', response.data);
            Router.push('/main'); //to main page after login

        } catch (error) {
            // If login fails, set error message to display under inputs
            const message ="Wrong email or password";
            setErrorMessage(message);
            console.log('Login failed:', error);
        }
        
    }


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
                        <StyledInput
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••"
                            error={!!errorMessage} // highlight red if error exists
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
