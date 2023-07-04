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
     * On blur function triggered when input loses focus
     */
    onBlur,
    /**
     * Input type (email, password...)
     */
    type,
    /**
     * Boolean to disable input
     */
    disabled,
    /**
     * String to set a name to autocomplete similar inputs
     */
    autoComplete,
    /**
     * Boolean to set the width of input to max
     */
    fullWidth, 
    /**
     * Boolean to make the input required or not
     */
    required,
    /**
     * Add an icon at the start of input
     */
    startAdornment, 
    /**
     * Add an icon at the end of input
     */
    endAdornment, 
    /**
     * Add more style properties
     */
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
      disabled={disabled}
      placeholder={placeholder}
      onChange={onChange}
      onBlur={onBlur}
      startAdornment={startAdornment}
      endAdornment={endAdornment}
      sx={sx}
    />
  );
}
 
export default CustomInput;