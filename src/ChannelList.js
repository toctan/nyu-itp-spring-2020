import {
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  makeStyles
} from "@material-ui/core";
import { Link as RouterLink, useLocation } from "react-router-dom";
import React from "react";

import User from "./User";
import foursquare from "./APIClient";

const useStyles = makeStyles(theme => ({
  cardGrid: {
    paddingTop: theme.spacing(4),
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

export default function ChannelList({ action }) {
  const classes = useStyles();
  const location = useLocation();
  const { user } = React.useContext(User.Context);
  const [channels, setChannels] = React.useState([]);

  React.useEffect(() => {
    foursquare
      .get(`demo/marsbot/audio/channels/${action}`, {
        params: {
          userId: user.id
        }
      })
      .then(resp => setChannels(resp.data.response.channels));
  }, [action, user, location]);

  const renderChannel = (channel, index) => {
    return (
      // TODO: use channel.id for key
      <Grid item key={index} xs={12} sm={6} md={4}>
        <Card className={classes.channel}>
          <CardMedia
            className={classes.cardMedia}
            image={`https://source.unsplash.com/random?${index}`}
            title={channel.title}
            component={RouterLink}
            to={`/channel/${channel.id}`}
          />
          <CardContent className={classes.cardContent}>
            <Typography gutterBottom variant="h5" component="h2">
              {channel.title}
            </Typography>
            <Typography>{channel.description}</Typography>
          </CardContent>
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
