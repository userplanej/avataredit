import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

import CustomInput from './CustomInput';

/**
 * Search input component
 * 
 * @param {string} placeholder Text displayed when there's no value
 * @param {function} onChange Action triggered when changing value
 * @returns Search input component
 */
const SearchInput = ({ placeholder, onChange }) => {
  return (
    <CustomInput
      placeholder={placeholder}
      onChange={onChange}
      id="custom-input"
      startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>}
      sx={{ marginBottom: '24px' }}
    />
  );
}
 
export default SearchInput;