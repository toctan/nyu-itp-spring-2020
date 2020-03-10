import { Box, Container, Divider, Typography } from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone';
import React from 'react';
import Button from '@material-ui/core/Button';
import foursquare from './APIClient';
import FoursquareSuggest from './FoursquareSuggest';
import { useHistory } from "react-router-dom";

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function AudioUpload() {
  const [files, setFiles] = React.useState([]);
  const [value, setValue] = React.useState([]);
  const history = useHistory();
  const classes = useStyles();

  const handleUpload = (files, value) => {
    const file = files[0];
    const ext = file.name.split('.').pop();
    const formData = new FormData();
    formData.append("ext", ext)
    formData.append("file", file)
    if (value === "setJingle") {
      formData.append("setJingle", 1)
    }
    else if (value === "setName") {
      formData.append("setName", 1)
    }
    foursquare.post('demo/marsbot/audio/upload', formData,
      {
        headers: {'Content-Type': 'multipart/form-data'}
      }).then(response => { 
        history.push('/');
      })
      .catch(error => {
          console.log(error.response)
      });
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box mt={8}>
        <FormControl component="fieldset">
          <FormLabel component="legend"> Primary action </FormLabel>
          <RadioGroup name="customized-radios" value={value} onChange={handleChange} row>
            <FormControlLabel value="setName" control={<Radio color="primary" />} label="Set name"/>
            <FormControlLabel value="setJingle" control={<Radio color="primary" />} label="Set jingle"/>
          </RadioGroup>
        </FormControl>

        <Typography component="h1" variant= 'h5'>
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
        <Button type="submit" variant="contained" color="primary" fullWidth className={classes.submit} onClick = {() => files[0] ? handleUpload(files, value) : alert("No uploaded files")}>
          Submit
        </Button>
      </Box>
    </Container>
  );
};
