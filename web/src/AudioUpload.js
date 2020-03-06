import { Box, Container, Divider, Typography } from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone';
import React from 'react';
import Button from '@material-ui/core/Button';
import foursquare from './APIClient';

import FoursquareSuggest from './FoursquareSuggest';

export default function AudioUpload() {
  const [files, setFiles] = React.useState([]);
  const handleUpload = (files) => {
    foursquare.post('demo/marsbot/audio/upload', {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      params: {
        file: files,
      }
    }).then(function () {
        console.log('SUCCESS!!');
      })
      .catch(function () {
        console.log('FAILURE!!');
      });
  };

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
        <Button size='large' variant="contained" color="primary" onClick = {() => handleUpload(files)}>
          Submit
        </Button>
      </Box>
    </Container>
  );
};
