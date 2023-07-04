import React from 'react';
import { Box, Button } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import SelectInput from './SelectInput';

/**
 * Component use to sort data:
 * - Select input to choose what data is used to sort
 * - Button to choose asc or desc
 */
const SortInput = (props) => {
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
     * List of select input's items
     * Ex: [{ value: 1, label: 'item 1' }, { value: 2, label: 'item 2' }]
     */
    items,
    /**
     * Current value of select input
     */
    value,
    /**
     * Action triggered when changing select input's value
     */
    onChange,
    /**
     * Action triggered when clicking on sort order button
     */
    onClickButton,
    /**
     * Boolean to specify if the order is ASC or DESC
     */
    isSortAsc
  } = props;

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ mr: 1 }}>
        <SelectInput 
          items={items}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          noEmptyValue
        />
      </Box>
      
      <Button variant="contained" color="secondary" endIcon={isSortAsc ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />} onClick={onClickButton}>
        Sort
      </Button>
    </Box>
  );
}
 
export default SortInput;