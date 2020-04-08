import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import React from "react";
import TextField from "@material-ui/core/TextField";

import foursquare from "./APIClient";

export default function ChannelForm() {
  const history = useHistory();
  const location = useLocation();
  const editing = location.state && location.state.channel;
  const [channel, setChannel] = React.useState(
    editing || {
      title: "",
      description: ""
    }
  );

  const handleSubmit = event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    let action = "demo/marsbot/audio/channels/";
    action += editing ? "update" : "add";
    return foursquare.post(action, formData).then(response => {
      history.push("/channels");
    });
  };

  const handleClose = () => {
    const background = location.state && location.state.background;
    if (background) history.goBack();
    else history.push("/");
  };

  const handleChange = event => {
    const input = event.target;
    setChannel({ ...channel, [input.name]: input.value });
  };

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {editing ? "Edit" : "Create a new channel"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <input name="id" type="hidden" value={channel.id} />
        <DialogContent>
          <TextField
            name="title"
            value={channel.title}
            onChange={handleChange}
            label="Title"
            autoFocus
            required
            variant="outlined"
            fullWidth
          />
          <TextField
            name="description"
            value={channel.description}
            onChange={handleChange}
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
          <Button color="primary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
