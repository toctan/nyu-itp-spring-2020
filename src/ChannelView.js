import { Add, DeleteOutline, EditOutlined } from "@material-ui/icons";
import {
  Avatar,
  Backdrop,
  CircularProgress,
  Link,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import { Link as RouterLink, useLocation, useParams } from "react-router-dom";
import React from "react";

import qs from "qs";

import AudioList from "./AudioList";
import NoMatch404 from "./NoMatch";
import ListActionItem from "./ListActionItem";
import SubscribeIcon from "./SubscribeIcon";
import User from "./User";
import foursquare from "./APIClient";

export default function ChannelView() {
  let { id } = useParams();
  const location = useLocation();
  const { user } = React.useContext(User.Context);
  const [loading, setLoading] = React.useState(true);
  const [channel, setChannel] = React.useState(null);
  const [audios, setAudios] = React.useState([]);
  const subscribed =
    channel &&
    Boolean(channel.subscribers.filter((u) => u.id === user.id).length);

  React.useEffect(() => {
    foursquare
      .get("demo/marsbot/audio/channels/fetch", {
        params: {
          id,
        },
        ejectErrorAlert: true,
      })
      .then((resp) => {
        const channel = resp.data.response;
        channel.id = id;
        setChannel(channel);
      })
      .catch((error) => {})
      .then(() => setLoading(false));
  }, [id, user, location]);

  const handleRemoveAudio = (audioId) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this audio from this channel?"
      )
    )
      return;
    foursquare
      .post(
        "demo/marsbot/audio/channels/attach",
        qs.stringify({
          id,
          audioFileId: audioId,
          attached: false,
        })
      )
      .then((resp) => setAudios(audios.filter((a) => a.id !== audioId)));
  };

  if (loading)
    return (
      <Backdrop open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );

  if (!channel) return <NoMatch404 />;

  return (
    <AudioList
      audios={audios}
      header={
        <ListItem divider key="title">
          <Link href={user.profile} target="_blank" rel="noopener">
            <ListItemAvatar>
              <Avatar alt={user.name} src={user.picture} />
            </ListItemAvatar>
          </Link>
          <div>
            <ListItemText
              primary={channel.title}
              secondary={channel.description}
              primaryTypographyProps={{
                component: "h1",
                variant: "h6",
              }}
            />
            {user.id === channel.user.id && (
              <div>
                <ListActionItem edge="start" icon={Add} text="Add audio" />
                <ListActionItem
                  icon={EditOutlined}
                  text="Edit"
                  rootProps={{
                    component: RouterLink,
                    to: {
                      pathname: `/channel/${channel.id}/edit`,
                      state: { background: location, channel: channel },
                    },
                  }}
                />
                <ListActionItem
                  icon={DeleteOutline}
                  text="Delete"
                  rootProps={{
                    component: RouterLink,
                    to: {
                      pathname: `/channel/${channel.id}/delete`,
                      state: { background: location },
                    },
                  }}
                />
              </div>
            )}
          </div>

          <ListItemSecondaryAction>
            <SubscribeIcon channelId={id} subscribed={subscribed} />
          </ListItemSecondaryAction>
        </ListItem>
      }
      handleDelete={handleRemoveAudio}
    />
  );
}
