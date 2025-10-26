import { FormControl, Input, InputLabel, TextField, Typography } from "@mui/material";

export default function CustomInput({label, ...props}) {

    return (
        <FormControl fullWidth 
            sx={{                    
                ':hover': {
                    borderColor: "divider"
                }
            }}
        >
            <Typography fontWeight={600}>
                {label}
            </Typography>

            <TextField
                {...props}
                fullWidth
                variant="outlined" 
                sx={{
                    '& .MuiInputBase-root': {
                        borderRadius: "8x", 
                        '&:hover fieldset': {
                            borderColor: "divider"
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: "divider"
                        }                        
                    },
                    '& .MuiInputBase-input': {
                        padding: '8px',
                    },
                }}
            />
        </FormControl>
    )
}
