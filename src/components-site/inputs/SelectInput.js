import React from 'react';
import { MenuItem, Select } from '@mui/material';

/**
 * MUI Select Input with style customized.
 * 
 * @param {object} props Select input properties 
 * @returns Select Input customized
 */
const SelectInput = (props) => {
  const {
    /**
     * Select input ID
     */
    id,
    /**
     * Select input name
     */
    name,
    /**
     * Select input value
     */
    value,
    /**
     * Array of values to display
     * eg [{ value: 1, label: 'One' }, { value: 2, label: 'Two' }]
     */
    items,
    /**
     * Action triggered when changing value
     */
    onChange,
    /**
     * Add CSS styles using MUI system
     */
    sx
  } = props;

  return (
    <Select
      id={id}
      name={name}
      onChange={onChange}
      value={value}
      variant="filled"
      disableUnderline
      fullWidth
      sx={{
        borderRadius: '5px',
        ':focus-within': {
          backgroundColor: '#fff',
          border: '2px solid #e8dff4'
        },
        '.MuiFilledInput-input': {
          padding: '13px'
        },
        ...sx
      }}
    >
      <MenuItem value="">
        -
      </MenuItem>
      {items && items.map((item, index) => <MenuItem key={index} value={item.value}>{item.label}</MenuItem>)}
    </Select>
  );
}
 
export default SelectInput;