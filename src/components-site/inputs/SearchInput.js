import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

import CustomInput from './CustomInput';

/**
 * Search input component
 * 
 * @param {string} placeholder Text displayed when there's no value
 * @param {function} onChange Action triggered when changing value
 * @param {boolean} fullWidth If input will have full width or not
 * @param {object} sx CSS styles to apply
 * @returns Search input component
 */
const SearchInput = ({ placeholder, onChange, fullWidth, sx }) => {
  return (
    <CustomInput
      placeholder={placeholder}
      onChange={onChange}
      fullWidth={fullWidth}
      id="custom-input"
      startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>}
      sx={{ marginBottom: '24px', backgroundColor: '#f9f8fa', '.MuiFilledInput-input': { padding: '8px' }, ...sx }}
    />
  );
}
 
export default SearchInput;