"use client";

import { Menu } from "@mui/icons-material";
import { Button, darken, Grid, useTheme } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import MenuDrawer from "./MenuDrawer";

export default function Header () {
    const theme = useTheme()
    const [isMenuOpen, setIsMenuOpen] = useState()

    return (
        <Grid  
            container 
            alignItems="center" 
            justifyContent="space-between" 
            padding="1rem 2rem"
            marginBottom="24px"
            direction="row"
            display="flex"
            width="100%"
            sx={{ backgroundColor: "primary.main" }}
        >

            <Grid style={{display: 'flex', alignItems: 'center'}}>
                <Link href="/">
                    <Image
                        style={{cursor: 'pointer'}}
                        unselectable="on" 
                        src={`/icon-light.svg`}
                        height={40}
                        width={40}
                        alt="logo"
                    />
                </Link>
            </Grid>

            <Grid>
                <Button 
                    size="small"
                    sx={{ 
                        padding: "8px", 
                        minWidth: "fit-content", 
                        backgroundColor: "primary.main",
                        '&:hover': {
                            backgroundColor: darken(theme.palette.primary.main, 0.2)
                        }
                    }}
                    onClick={() => setIsMenuOpen(true)}
                >
                    <Menu sx={{color: "secondary.main"}}/>
                </Button>
            </Grid>

            <MenuDrawer isOpenState={[isMenuOpen, setIsMenuOpen]} />
        </Grid>
    )
}
