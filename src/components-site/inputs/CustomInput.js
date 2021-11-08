import React from 'react';
import FilledInput from '@mui/material/FilledInput';

/**
 * MUI Input with style customized.
 * 
 * @param {object} props Input properties
 * @returns Input customized
 */
const CustomInput = (props) => {
  const { 
    /**
     * Input ID
     */
    id,
    /**
     * Input
     */
    value,
    /**
     * Input name
     */
    name,
    /**
     * Input placeholder displayed
     */
    placeholder, 
    /**
     * On change function triggered when input value is changing
     */
    onChange, 
    /**
     * Input type (email, password...)
     */
    type,
    /**
     * 
     */
    autoComplete,
    fullWidth, 
    required,
    startAdornment, 
    endAdornment, 
    sx 
  } = props;
  
  return (
    <FilledInput
      id={id}
      value={value}
      name={name}
      autoComplete={autoComplete}
      fullWidth={fullWidth}
      required={required}
      type={type}
      disableUnderline
      placeholder={placeholder}
      onChange={onChange}
      startAdornment={startAdornment}
      endAdornment={endAdornment}
      sx={{
        border: 'solid 2px #f9f8fa',
        borderRadius: '5px',
        boxShadow: '3px 3px 6px 0 rgba(0, 0, 0, 0.02)',
        backgroundColor: '#fff',
        ':focus-within': {
          backgroundColor: '#fff',
          border: '2px solid #e8dff4'
        },
        '.MuiFilledInput-input': {
          padding: '13px'
        },
        ...sx
      }}
    />
  );
}
 
export default CustomInput;