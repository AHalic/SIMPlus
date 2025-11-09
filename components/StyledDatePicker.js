import React from "react";
import { FormControl } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { styled } from "@mui/material/styles";

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  width: '100%',
  
    '& .MuiPickersInputBase-sectionsContainer': {
        padding: '8px 8px !important',
        backgroundColor: theme.palette.background?.default,
        borderRadius: '12px',
        fontSize: '0.8rem',
        color: theme.palette.text?.primary,
        border: `2px solid ${theme.palette.background?.default}`,
    },

  '& .MuiPickersOutlinedInput-root': {
    height: '100%',
    backgroundColor: theme.palette.background?.default,
    borderRadius: '12px',
    
    '& fieldset': {
      borderRadius: '12px',
      border: `2px solid ${theme.palette.background?.default}`,
    },
    
    '&:hover fieldset': {
      border: `2px solid ${theme.palette.background?.default}`,
    },
    
    '&.Mui-focused:not(.Mui-error) fieldset': {
      border: `2px solid ${theme.palette.background?.default}`,
    },
    
    '&.Mui-error fieldset': {
      border: `2px solid ${theme.palette.error.main}`,
    },
  },
  
  '& .MuiInputLabel-root': {
    transform: 'translate(14px, 10px) scale(1)',
    
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.75)',
    },
  },
  
  '& .MuiIconButton-root': {
    color: theme.palette.divider,
  },
}));

const StyledDatePickerComponent = ({ label, value, onChange, error, helperText, ...props }) => {
  return (
    <FormControl variant="outlined" fullWidth error={error}>
      <StyledDatePicker
        label={label}
        value={value}
        onChange={onChange}
        slotProps={{
          textField: {
            error: error,
            helperText: helperText || ' ',
            fullWidth: true,
          },
        }}
        {...props}
      />
    </FormControl>
  );
};

export default StyledDatePickerComponent;
