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
     * Max number of characters
     */
    maxLength,
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
      inputProps={{ maxLength: maxLength }}
      variant="filled"
      disableUnderline
      sx={{ 
        color: '#fff',
        border: 'solid 2px #3c4045',
        width: "100%", 
        borderRadius: '6px', 
        backgroundColor: '#202427', 
        p: 1,
        ':focus-within': {
          backgroundColor: '#202427',
          border: '2px solid #e8dff4'
        },
        ...sx
      }}
    />
  );
}
 
export default MultilineInput;