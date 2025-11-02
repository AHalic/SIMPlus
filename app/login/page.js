"use client";

import { OutlinedInput } from "@/components/OtulinedInput";
import { EmailOutlined, LockOutline } from "@mui/icons-material";
import { Button, Grid, InputAdornment, Typography } from "@mui/material";
import Image from "next/image";

export default function Login() {
    const handleSignIn = () => {
        // TODO: handle signing
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
                        <OutlinedInput 
                            label="Password" 
                            placeholder="••••"
                            type="password"
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
