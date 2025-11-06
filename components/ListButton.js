"use client";

import { ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { usePathname } from "next/navigation";

export default function ListButton({ icon, text, onClick, link="", disabled=false }) {
    const pathname = usePathname()

    return (
        <ListItem disableGutters divider={false}
            sx={{
                backgroundColor: pathname === link.toLowerCase().replace(" ", "-") ? 'primary.main' : 'secondary.main',
                borderRadius: "12px",
                padding: 0,
                marginY: "8px",
            }}
            >
            <ListItemButton 
                onClick={onClick}
                alignItems="center"
                disabled={disabled}
                sx={{
                    padding: "4px 16px",
                }}
            >
                {icon && (
                    <ListItemIcon 
                        sx={{ 
                            color: pathname === link.toLowerCase().replace(" ", "-") ? 'secondary.main' : 'primary.main',
                            marginRight: "8px",
                            minWidth: 0
                        }}
                    >
                        {icon}
                    </ListItemIcon>
                )}

                <ListItemText
                    primary={
                        <Typography
                            sx={{
                                color: pathname === link.toLowerCase().replace(" ", "-") ? 'secondary.main' : 'primary.main',
                                textAlign: "start",
                                fontWeight: "600",
                            }}
                        >
                            {text}
                        </Typography>
                    }
                />
            </ListItemButton>
        </ListItem>
    )
}
