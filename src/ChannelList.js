import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  makeStyles
} from "@material-ui/core";
import { Link as RouterLink, useLocation } from "react-router-dom";
import React from "react";

import qs from "qs";

import User from "./User";
import foursquare from "./APIClient";

const useStyles = makeStyles(theme => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6)
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
  },
  channel: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardMedia: {
    paddingTop: "56.25%" // 16:9
  },
  cardContent: {
    flexGrow: 1
  }
}));

export default function ChannelList(props) {
  const classes = useStyles();
  const location = useLocation();
  const { user } = React.useContext(User.Context);
  const [channels, setChannels] = React.useState([]);

  React.useEffect(() => {
    foursquare
      .get("demo/marsbot/audio/channels/fetchByOwner", {
        params: {
          userId: user.id
        }
      })
      .then(resp => setChannels(resp.data.response.channels));
  }, [user]);

  const handleDelete = channelId => {
    if (!window.confirm("Are you sure you want to delete this channel?"))
      return;
    foursquare
      .post(
        "demo/marsbot/audio/channels/delete",
        qs.stringify({
          id: channelId
        })
      )
      .then(resp => setChannels(channels.filter(c => c.id !== channelId)));
  };

  const renderChannel = (channel, index) => {
    if (index + 1 === channels.length) channel.id = "5e8cf755bbfabd0006b0f2e2";
    return (
      // TODO: use channel.id for key
      <Grid item key={index} xs={12} sm={6} md={4}>
        <Card className={classes.channel}>
          <CardMedia
            className={classes.cardMedia}
            image={`https://source.unsplash.com/random?${index}`}
            title={channel.title}
          />
          <CardContent className={classes.cardContent}>
            <Typography gutterBottom variant="h5" component="h2">
              {channel.title}
            </Typography>
            <Typography>{channel.description}</Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              color="primary"
              component={RouterLink}
              to={{
                pathname: `/channel/${channel.id}/edit`,
                state: { background: location, channel: channel }
              }}
            >
              Edit
            </Button>
            <Button
              size="small"
              color="primary"
              onClick={() => handleDelete(channel.id)}
            >
              Delete
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );
  };

  return (
    <React.Fragment>
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          {channels.map(renderChannel)}
        </Grid>
      </Container>
    </React.Fragment>
  );
}
