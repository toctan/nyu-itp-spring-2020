import {
  Box,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  makeStyles
} from "@material-ui/core";
import {
  PlayCircleOutline,
  PauseCircleOutline,
  DeleteOutline,
  Schedule
} from "@material-ui/icons";
import React from "react";
import Moment from "react-moment";
import qs from "qs";

import { UserContext } from "./User";
import CategoryIcon from "./CategoryIcon";
import foursquare from "./APIClient";

const useStyles = makeStyles(theme => ({
  gridItem: {
    [theme.breakpoints.up("sm")]: {
      height: `calc(100vh - ${theme.spacing(8)}px)`,
      overflowY: "auto"
    }
  },
  listActionIcon: {
    marginRight: theme.spacing(1)
  }
}));

export default function AudioList(props) {
  const classes = useStyles();
  const user = React.useContext(UserContext);
  const [audios, setAudios] = React.useState([]);
  const [playing, setPlaying] = React.useState(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("user_id") || user.id;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    foursquare
      .get("demo/marsbot/audio/snippetuser", {
        params: {
          userId: userId,
          tz: tz
        }
      })
      .then(resp => setAudios(resp.data.response.audio));
  }, [user]);

  const handleDelete = index => {
    const audio_id = audios[index].id;
    const nAudios = audios.slice(0, index).concat(audios.slice(index + 1));
    foursquare
      .post(
        "demo/marsbot/audio/delete",
        qs.stringify({
          audioFileId: audio_id
        })
      )
      .then(resp => setAudios(nAudios))
      .catch(error => console.log(error));
  };

  const handlePlay = src => {
    if (playing) {
      playing.pause();
      if (playing.src === src) return setPlaying(null);
    }
    const audio = new Audio(src);
    audio.onended = () => setPlaying(null);
    setPlaying(audio);
    return audio.play();
  };

  const ListActionItem = props => {
    return (
      <IconButton
        size="small"
        className={classes.listActionIcon}
        {...props.rootProps}
      >
        <props.icon fontSize="small" />
        <Box component="span" fontSize="body2.fontSize" ml={0.5}>
          {props.text}
        </Box>
      </IconButton>
    );
  };

  const renderAudio = (audio, index) => {
    const venue = audio.venues[0];
    let title = "Unknown Audio",
      subTitle,
      category;
    if (audio.isName) title = "Your Name";
    if (audio.isJingle) title = "Your Jingle";
    if (venue) {
      title = venue.name;
      subTitle = venue.location.formattedAddress.join(" ");
      category = venue.categories && venue.categories[0];
    }

    return (
      <React.Fragment key={audio.id}>
        <Divider />
        <ListItem>
          <ListItemAvatar>
            <CategoryIcon category={category} />
          </ListItemAvatar>
          <div>
            <ListItemText primary={title} secondary={subTitle} />
            <div>
              <ListActionItem
                icon={Schedule}
                text={
                  <Moment
                    parse="LLL"
                    format="L"
                    fromNowDuring={1000 * 60 * 60 * 24 * 7}
                    withTitle
                  >
                    {audio.createDate}
                  </Moment>
                }
              />
              <ListActionItem
                icon={PlayCircleOutline}
                text={audio.playCount || 0}
              />
              <ListActionItem
                icon={DeleteOutline}
                text="Delete"
                rootProps={{ onClick: () => handleDelete(index) }}
              />
            </div>
          </div>
          <ListItemSecondaryAction>
            <IconButton
              onClick={() => handlePlay(audio.url)}
              edge="end"
              aria-label="play"
            >
              {playing && playing.src === audio.url ? (
                <PauseCircleOutline fontSize="large" />
              ) : (
                <PlayCircleOutline fontSize="large" />
              )}
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </React.Fragment>
    );
  };

  return (
    <Grid container>
      <Grid item className={classes.gridItem} xs={12} sm={5} md={4}>
        <Paper>
          <List>
            <ListItem>
              <ListItemText
                primary="Jin's Marsbot Audios"
                primaryTypographyProps={{
                  component: "h1",
                  variant: "h6",
                  align: "center"
                }}
              />
            </ListItem>
            {audios.map(renderAudio)}
          </List>
        </Paper>
      </Grid>
      <Grid item xs sm md className={classes.gridItem}>
        {/* <AudioMap /> */}
      </Grid>
    </Grid>
  );
}
