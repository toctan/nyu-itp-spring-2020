import { Box, Container, Typography, makeStyles } from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import React from "react";
import Grid from "@material-ui/core/Grid";

import FoursquareSuggest from "./FoursquareSuggest";
import foursquare from "./APIClient";
import AudioRecord from "./AudioRecord";
const useStyles = makeStyles((theme) => ({
  dropzone: {
    textAlign: "center",
    "& p": {
      color: theme.palette.text.secondary,
      fontSize: "1rem",
      marginTop: "15%",
    },
    "& .MuiChip-root": {
      maxWidth: "50%",
      marginTop: theme.spacing(2),
    },
  },
}));

export default function AudioUpload() {
  const [files, setFiles] = React.useState([]);
  const classes = useStyles();
  const history = useHistory();
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    if (files instanceof Blob) {
      formData.append("ext", "mp3");
      formData.append("file", files);
    } else {
      if (!files.length) return alert("No audio file selected.");
      const ext = files[0].name.split(".").pop();
      formData.append("ext", ext);
      formData.append("file", files[0]);
    }

    const action = formData.get("action");
    if (action) {
      formData.append(action, 1);
      formData.delete("action");
      formData.delete("venueId");
    } else if (!formData.get("venueId")) {
      return alert("Please select an action or a venue to attach.");
    }

    return foursquare
      .post("demo/marsbot/audio/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        history.push("/");
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box mt={8}>
        <Typography component="h1" variant="h5">
          Upload an audio
        </Typography>
        <form onSubmit={handleSubmit}>
          <FoursquareSuggest />
          <RadioGroup name="action" row>
            <FormControlLabel
              value="setName"
              control={<Radio color="primary" />}
              label="Set name"
            />
            <FormControlLabel
              value="setJingle"
              control={<Radio color="primary" />}
              label="Set jingle"
            />
          </RadioGroup>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <DropzoneArea
                  dropzoneText={"Drag 'n' drop, or click to select"}
                  onChange={setFiles}
                  acceptedFiles={["audio/*"]}
                  dropzoneClass={classes.dropzone}
                  useChipsForPreview
                  filesLimit={1}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <AudioRecord setFiles={setFiles} />
            </Grid>
          </Grid>
          <FormControl fullWidth margin="normal">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth={true}
            >
              Submit
            </Button>
          </FormControl>
        </form>
      </Box>
    </Container>
  );
}
