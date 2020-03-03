import { Box, Container, Typography } from '@material-ui/core';
import React from 'react';

class AudioUpload extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container component="main" maxWidth="xs">
        <Box mt={8} align="center">
          <Typography component="h1" variant="h4">
            Upload
          </Typography>
        </Box>
      </Container>
    );
  }
}

export default AudioUpload;
