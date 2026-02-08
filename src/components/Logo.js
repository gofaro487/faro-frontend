import React from 'react';
import { Box } from '@mui/material';
import FaroLogo from '../images/Faro svg.svg';

const Logo = ({ height = 40, width = 'auto', sx = {} }) => {
  return (
    <Box
      component="img"
      src={FaroLogo}
      alt="FARO Logo"
      sx={{
        height: height,
        width: width,
        objectFit: 'contain',
        filter: 'brightness(0) saturate(100%) invert(7%) sepia(85%) saturate(7439%) hue-rotate(241deg) brightness(92%) contrast(147%)',
        ...sx,
      }}
    />
  );
};

export default Logo;
