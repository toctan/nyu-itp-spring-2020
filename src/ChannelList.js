import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import Typography from "@material-ui/core/Typography";

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

export default function ChannelList() {
  const classes = useStyles();
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

  const handleDelete = channel_id => {
    if (!window.confirm("Are you sure you want to delete this channel?"))
      return;
    foursquare
      .post(
        "demo/marsbot/channel/delete",
        qs.stringify({
          id: channel_id
        })
      )
      .then(resp => setChannels(channels.filter(c => c.id !== channel_id)));
  };

  const renderChannel = (channel, index) => (
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
          <Button size="small" color="primary">
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

  return (
    <React.Fragment>
      <div className={classes.heroContent}>
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h3"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            My Channels
          </Typography>
        </Container>
      </div>

      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          {channels.map(renderChannel)}
        </Grid>
      </Container>
    </React.Fragment>
  );
}
