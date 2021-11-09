import React from 'react';
import { FilledInput } from '@mui/material';

/**
 * Multiline input
 * 
 * @param {object} props Properties of the input 
 * @returns 
 */
const MultilineInput = (props) => {
  const {
    /**
     * Input ID
     */
    id,
    /**
     * Input name
     */
    name,
    /**
     * Text displayed as placeholder
     */
    placeholder,
    /**
     * Minimum rows, define the min height of the input
     */
    minRows,
    /**
     * Maximum rows, define the max height of the input
     */
    maxRows,
    /**
     * Input value
     */
    value,
    /**
     * Action triggered when changing input's value
     */
    onChange,
    /**
     * Additional CSS styles to apply
     */
    sx
  } = props;
  
  return (
    <FilledInput
      id={id}
      name={name}
      placeholder={placeholder}
      multiline
      minRows={minRows}
      maxRows={maxRows}
      value={value}
      onChange={onChange}
      variant="filled"
      disableUnderline
      sx={{ 
        width: "100%", 
        borderRadius: '6px', 
        backgroundColor: '#fff', 
        p: 1,
        ':focus-within': {
          backgroundColor: '#fff',
          border: '2px solid #e8dff4'
        },
        ...sx
      }}
    />
  );
}
 
export default MultilineInput;