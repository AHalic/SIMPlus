import { ExpandMore } from "@mui/icons-material";
import { alpha, FormControl, FormHelperText, InputLabel, MenuItem, OutlinedInput, Select, styled } from "@mui/material";

const StyledOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
    height: '100%',

    '& .MuiSelect-select': {
        borderRadius: '12px !important',
    },

    '& .MuiOutlinedInput-notchedOutline': {
        borderRadius: '12px',
        border: `2px solid ${theme.palette.background?.default}`,
    },

    '& .MuiOutlinedInput-input': {
        padding: '6px 16px!important',
        backgroundColor: theme.palette.background?.default,
        borderRadius: '12px',
        fontSize: '0.8rem',
        color: theme.palette.text?.primary,
        
        alignText: 'center',
        border: `2px solid ${theme.palette.background?.default}`,
    },
    
    '&.MuiOutlinedInput-root': {
        backgroundColor: theme.palette.background?.default,
        borderRadius: '12px',
        '&:hover fieldset': {
          border: `2px solid ${theme.palette.background?.default}`,

        },
        '&.Mui-focused fieldset': {
          border: `2px solid ${theme.palette.background?.default}`,
        },
        '&.Mui-error fieldset': {
          border: `2px solid ${theme.palette.error.main}`,
        },
        '&.Mui-disabled fieldset': {
            border: `2px solid ${alpha(theme.palette.action.disabledBackground, 0.05)}`,
        },
    },
}));  


const StyledSelect = ({ label, options, helperText, error, ...props }) => {
    return (
        <FormControl variant="outlined" fullWidth error={error}>
            <InputLabel
                variant="outlined"
                id={`select-${label}-label`}
                sx={{
                    transform: 'translate(14px, 10px) scale(1)',
                    '&.MuiInputLabel-shrink': {
                        transform: 'translate(14px, -9px) scale(0.75)',
                    },
                }}
            >
                {label}
            </InputLabel>

            <Select
                fullWidth
                variant="outlined"
                style={{ borderRadius: '12px'}}
                labelId={`select-${label}-label`}
                id={`select-${label}`}
                name={`select-${label}`}
                label={label}
                IconComponent={ExpandMore}
                input={
                    <StyledOutlinedInput label={label} error={error}/>
                }
                {...props}
            >
                {options.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>

            <FormHelperText>
                {helperText || ' '}
            </FormHelperText>
        </FormControl>
    )
}


const StyledInput = ({ label, value, helperText, error, ...props }) => {
    return (
        <FormControl variant="outlined" fullWidth error={error}>
            <InputLabel
                variant="outlined"
                id={`input-${label}-label`}
                sx={{
                    transform: 'translate(14px, 10px) scale(1)',
                    '&.MuiInputLabel-shrink': {
                        transform: 'translate(14px, -9px) scale(0.75)',
                    },
                }}
            >
                {label}
            </InputLabel>

            <StyledOutlinedInput
                fullWidth
                variant="outlined"
                sx={{
                    '& .MuiOutlinedInput-input': {
                        padding: '8px 16px!important',
                    },
                }}
                id={`input-${label}`}
                name={`input-${label}`}
                label={label}
                value={value}
                {...props}
            />

            <FormHelperText>
                {helperText || ' '}
            </FormHelperText>
        </FormControl>
    )
}

export { StyledInput, StyledSelect };
