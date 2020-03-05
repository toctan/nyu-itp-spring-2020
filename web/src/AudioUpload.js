import { Box, Container, Typography } from '@material-ui/core';
import React from 'react';

import FoursquareSuggest from './FoursquareSuggest';


export default function AudioUpload() {
  return (
    <Container component="main" maxWidth="xs">
      <Box mt={8}>
        <Typography component="h1" variant="h5">
          Attach to a venue
        </Typography>
        <FoursquareSuggest />
      </Box>
    </Container>
  );
};
