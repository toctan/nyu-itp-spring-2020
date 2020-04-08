import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import React from "react";

import User from "./User";
import foursquare from "./APIClient";

export default function AudioAttach() {
  const history = useHistory();
  const location = useLocation();
  const { user } = React.useContext(User.Context);
  const [channels, setChannels] = React.useState([]);
  const [checked, setChecked] = React.useState(new Set());

  React.useEffect(() => {
    foursquare
      .get(`demo/marsbot/audio/channels/fetchByOwner`, {
        params: {
          userId: user.id
        }
      })
      .then(resp => setChannels(resp.data.response.channels));
  }, [user]);

  const handleSubmit = event => {
    event.preventDefault();
    let action = "demo/marsbot/audio/channels/attach";
    return foursquare.post(action).then(response => {
      history.push("/channels");
    });
  };

  const handleToggle = channelId => {
    const newChecked = new Set(checked);
    if (newChecked.has(channelId)) newChecked.delete(channelId);
    else newChecked.add(channelId);
    setChecked(newChecked);
  };

  const handleClose = () => {
    const background = location.state && location.state.background;
    if (background) history.goBack();
    else history.push("/");
  };

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Add to channels</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <List disablePadding={true}>
            {channels.map((channel, index) => {
              channel.id = index; // FIXME
              const labelId = `checkbox-list-label-${channel.id}`;

              return (
                <ListItem
                  disableGutters
                  key={channel.id}
                  role={undefined}
                  dense
                  button
                  onClick={() => handleToggle(channel.id)}
                >
                  <ListItemIcon>
                    <Checkbox
                      name="channelId"
                      edge="start"
                      checked={checked.has(channel.id)}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={channel.title} />
                </ListItem>
              );
            })}
          </List>
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
