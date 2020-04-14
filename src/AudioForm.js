import { useHistory, useLocation } from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
import React from "react";

import AudioRecorder from "./AudioRecorder";
import FoursquareSuggest from "./FoursquareSuggest";
import ResponsiveDialog from "./ResponsiveDialog";
import foursquare from "./APIClient";

export default function AudioUpload() {
  const history = useHistory();
  const location = useLocation();
  const background = location.state && location.state.background;
  const [file, setFile] = React.useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    if (!file) return alert("No audio file selected.");
    const ext = file.name.split(".").pop();
    formData.append("ext", ext);
    formData.append("file", file);

    return foursquare
      .post("demo/marsbot/audio/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        history.push(background || "/");
      });
  };

  return (
    <ResponsiveDialog
      keepMounted
      handleSubmit={handleSubmit}
      closeURL="/"
      fullWidth
      maxWidth="xs"
      title="Upload an audio"
      content={
        <>
          <FoursquareSuggest />

          <FormControl fullWidth margin="normal">
            <AudioRecorder file={file} setFile={setFile} />
          </FormControl>
        </>
      }
    />
  );
}
