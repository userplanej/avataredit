import React from 'react';
import SearchIcon from '@mui/icons-material/Search';

const SearchInput = ({ placeholder, onChange, style }) => {
  return (
    <div style={style}>
      <input 
        placeholder={placeholder}
        className="search-input"
        onChange={onChange}
      />
      <SearchIcon sx={{ position: 'relative', right: '428px', top: '6px' }} />
    </div>
  );
}
 
export default SearchInput;