import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { DeleteOutline, EditOutlined } from "@material-ui/icons";
import { Link as RouterLink, useLocation, useParams } from "react-router-dom";
import React from "react";

import ListActionItem from "./ListActionItem";
import User from "./User";
import foursquare from "./APIClient";

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(8),
  },
  card: {
    position: "relative",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  subscribe: {
    position: "absolute",
    top: "5%",
    right: "5%",
  },
}));

export default function ChannelList({ action }) {
  const classes = useStyles();
  const location = useLocation();
  const { user } = React.useContext(User.Context);
  let { userId = user.id } = useParams();
  const [channels, setChannels] = React.useState([]);

  React.useEffect(() => {
    foursquare
      .get(`demo/marsbot/audio/channels/${action}`, {
        params: {
          userId,
        },
      })
      .then((resp) => setChannels(resp.channels));
  }, [action, user, location]);

  const renderChannel = (channel, index) => {
    return (
      <Grid item key={channel.id} xs={12} sm={6} md={4}>
        <Card className={classes.card}>
          <CardMedia
            className={classes.cardMedia}
            image={`https://source.unsplash.com/random?${index}&id=${channel.id}`}
            title={channel.title}
            component={RouterLink}
            to={`/channel/${channel.id}`}
          />
          <CardContent className={classes.cardContent}>
            <Typography gutterBottom variant="h5" component="h2">
              {channel.title}
            </Typography>
            <Typography>{channel.description}</Typography>

            {/* <SubscribeIcon */}
            {/*   channelId={channel.id} */}
            {/*   subscribed={true} // TODO: use channel.subscribed */}
            {/*   className={classes.subscribe} */}
            {/* /> */}
          </CardContent>
          <CardActions>
            {/* <ListActionItem icon={FavoriteBorder} text="Subscribe" /> */}

            <ListActionItem
              icon={EditOutlined}
              edge="start"
              text="Edit"
              component={RouterLink}
              to={{
                pathname: `/channel/${channel.id}/edit`,
                state: { background: location, channel: channel },
              }}
            />
            <ListActionItem
              icon={DeleteOutline}
              text="Delete"
              component={RouterLink}
              to={{
                pathname: `/channel/${channel.id}/delete`,
                state: { background: location },
              }}
            />
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
