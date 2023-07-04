import React from 'react';
import Box from '@mui/material/Box';

const CommonButton = (props) => {
  const { text, style, onClick, width, height, color } = props;

  const defaultStyle = {
    width: width ? width : '80px',
    height: height ? height : '40px',
    margin: '15px',
    borderRadius: '10px',
    boxShadow: '4px 6px 6px 0 rgba(0, 0, 0, 0.03)',
    backgroundColor: '#f9f8fa',
    display: 'grid',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: color ? color : null
  }

  return (
    <Box sx={style ? style : defaultStyle} onClick={onClick}>
      {text}
    </Box>
  );
}
 
export default CommonButton;