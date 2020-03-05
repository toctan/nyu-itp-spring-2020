import { Box, Container, Divider, Typography } from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone';
import React from 'react';

import FoursquareSuggest from './FoursquareSuggest';


export default function AudioUpload() {
  const [files, setFiles] = React.useState([]);

  return (
    <Container component="main" maxWidth="xs">
      <Box mt={8}>
        <Typography component="h1" variant="h5">
          Attach to a venue
        </Typography>
        <FoursquareSuggest />

        <Divider variant="middle" />
        <Typography component="h1" variant="h5" gutterBottom >
          Upload
        </Typography>

        <DropzoneArea
          dropzoneText={"Drag 'n' drop, or click to select"}
          onChange={setFiles}
          acceptedFiles={['audio/*']}
          filesLimit={1}
        />

      </Box>
    </Container>
  );
};
