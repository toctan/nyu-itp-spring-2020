import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { useHistory, useLocation, useParams } from "react-router-dom";
import React from "react";

import qs from "qs";

import User from "./User";
import foursquare from "./APIClient";

export default function AudioAttach() {
  let { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const { user } = React.useContext(User.Context);
  const [channels, setChannels] = React.useState([]);

  React.useEffect(() => {
    foursquare
      .get(`demo/marsbot/audio/channels/fetchByOwner`, {
        params: {
          userId: user.id,
        },
      })
      .then((resp) => setChannels(resp.data.response.channels));
  }, [user]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const channelId = formData.get("channelId");
    const action = "demo/marsbot/audio/channels/attach";
    return foursquare
      .post(
        action,
        qs.stringify({
          id: channelId,
          audioFileId: id,
          attached: true,
        })
      )
      .then((response) => {
        history.push(`/channel/${channelId}`);
      });
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
      <form onSubmit={handleSubmit}>
        <DialogTitle id="form-dialog-title">Add to channels</DialogTitle>
        <DialogContent>
          <RadioGroup aria-label="channel" name="channelId">
            {channels.map((channel) => (
              <FormControlLabel
                key={channel.id}
                value={channel.id}
                control={<Radio required />}
                label={channel.title}
              />
            ))}
          </RadioGroup>
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
