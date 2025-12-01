import { ExpandMore } from "@mui/icons-material";
import { FormControl, FormHelperText, MenuItem, Select, TextField, Typography } from "@mui/material";

function OutlinedInput({label, lightLabel=false, ...props}) {

    return (
        <FormControl fullWidth 
            sx={{                    
                ':hover': {
                    borderColor: "divider"
                }
            }}
        >
            <Typography sx={{ color: lightLabel ? 'text.secondary' : 'text.primary' }} fontWeight={lightLabel ? 400 : 600}>
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


function OutlinedSelect({label, options, helperText, error, lightLabel=false, ...props}) {
    return (
        <FormControl fullWidth error={error}
            sx={{                    
                ':hover': {
                    borderColor: "divider"
                }
            }}
        >
            <Typography sx={{ color: lightLabel ? 'text.secondary' : 'text.primary' }} fontWeight={lightLabel ? 400 : 600}>
                {label}
            </Typography>

            <Select
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

                    '&.MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                            border: '2px solid',
                            borderColor: 'divider'
                        },
                        '&.Mui-focused fieldset': {
                            border: '2px solid',
                            borderColor: 'divider'
                        },
                        '&.Mui-error fieldset': {
                            border: '2px solid',
                            borderColor: 'error.main'
                        },

                        '&.Mui-disabled': {
                            '&:hover fieldset': {
                                border: '1px solid',
                                borderColor: 'divider'
                            },
                        }
                    },                    
                }}
                IconComponent={ExpandMore}
                {...props}
            >
                {options.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>

            <FormHelperText>
                {helperText}
            </FormHelperText>    
        </FormControl>
    )
}


export { OutlinedInput, OutlinedSelect }
