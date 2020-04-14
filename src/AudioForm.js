import { useHistory, useLocation } from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
import React from "react";

import AudioRecorder from "./AudioRecorder";
import ResponsiveDialog from "./ResponsiveDialog";
import foursquare from "./APIClient";

export default function AudioForm({
  title,
  extraInputs,
  recorderMargin = "normal",
  ...props
}) {
  const history = useHistory();
  const location = useLocation();
  const background = location.state && location.state.background;
  const [file, setFile] = React.useState(props.file || null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!file) return alert("No audio file selected or recorded.");

    const formData = new FormData(event.target);
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
      title={title}
      content={
        <>
          {extraInputs}

          <FormControl fullWidth margin={recorderMargin}>
            <AudioRecorder file={file} setFile={setFile} />
          </FormControl>
        </>
      }
    />
  );
}
