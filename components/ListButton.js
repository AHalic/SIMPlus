
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";

export default function ListButton({ icon, text, onClick, disabled=false }) {
    return (
        <ListItem disableGutters>
            <ListItemButton 
                onClick={onClick}
                alignItems="center"
                disabled={disabled}
            >

                <ListItemText
                    primary={
                        <Typography
                            sx={{
                                color: 'text.secondary',
                                textAlign: "center",
                                fontWeight: "600",
                            }}
                        >
                            {text}
                        </Typography>
                    }
                />
                {icon && (
                    <ListItemIcon sx={{ marginLeft: "8px", minWidth: 0}}>
                        {icon}
                    </ListItemIcon>
                )}
            </ListItemButton>
        </ListItem>
    )
}
