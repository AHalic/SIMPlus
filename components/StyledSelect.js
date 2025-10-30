import { ExpandMore } from "@mui/icons-material";
import { FormControl, FormHelperText, InputLabel, MenuItem, OutlinedInput, Select, styled } from "@mui/material";

const SelectInput = styled(OutlinedInput)(({ theme }) => ({
    height: '100%',

    '& .MuiSelect-select': {
        borderRadius: '12px !important',
    },

    '& .MuiOutlinedInput-notchedOutline': {
        border: `2px solid ${theme.palette.background?.default}`,
    },

    '& .MuiOutlinedInput-input': {
        padding: '6px 16px!important',
        backgroundColor: theme.palette.background?.default,
        fontSize: '0.8rem',
        color: theme.palette.text?.primary,
        
        alignText: 'center',
        border: `2px solid ${theme.palette.background?.default}`,
    },
    
    '&.MuiOutlinedInput-root': {
        '&:hover fieldset': {
          border: `2px solid ${theme.palette.secondary.main}`,
        },
        '&.Mui-focused fieldset': {
          border: `2px solid ${theme.palette.secondary.main}`,
        },
        '&.Mui-error fieldset': {
          border: `2px solid ${theme.palette.error.main}`,
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
                    <SelectInput label={label} error={error}/>
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
                {helperText}
            </FormHelperText>
        </FormControl>
    )
}


export default StyledSelect;
