import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function StyledCheckbox({label, ...props}) {
  return (
    <FormGroup>
      <FormControlLabel 
        control={<Checkbox {...props} />}
        style={{ width: 'fit-content' }}
        label={label}
      />
    </FormGroup>
  );
}
