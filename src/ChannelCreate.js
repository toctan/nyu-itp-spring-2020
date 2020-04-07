import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import React from "react";
import TextField from "@material-ui/core/TextField";

import foursquare from "./APIClient";

export default function ChannelCreateDialog(props) {
  const history = useHistory();
  const { open, handleClose } = props;

  const handleSubmit = event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    return foursquare
      .post("demo/marsbot/audio/channels/add", formData)
      .then(response => {
        const channel = response.data.response;
        history.push(`/channel/${channel.id}`);
      });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Create a new channel</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            name="title"
            label="Title"
            autoFocus
            required
            variant="outlined"
            fullWidth
          />
          <TextField
            name="description"
            label="Description"
            variant="outlined"
            margin="normal"
            fullWidth
            multiline
            rows={4}
            rowsMax={10}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" color="primary">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
