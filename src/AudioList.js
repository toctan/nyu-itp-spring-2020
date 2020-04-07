import {
  Grid,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Switch,
  Tooltip,
  makeStyles
} from "@material-ui/core";
import React from "react";

import qs from "qs";

import AudioItem from "./AudioItem";
import AudioMap from "./AudioMap";
import User from "./User";
import foursquare from "./APIClient";

const useStyles = makeStyles(theme => ({
  gridItem: {
    [theme.breakpoints.up("sm")]: {
      height: `calc(100vh - ${theme.spacing(8)}px)`,
      overflowY: "auto"
    }
  },
  activeListItem: {
    backgroundColor: theme.palette.action.hover
  }
}));

export default function AudioList(props) {
  const classes = useStyles();
  const scrollRef = React.useRef(null);
  const { user } = React.useContext(User.Context);
  const [audios, setAudios] = React.useState([]);
  const [playing, setPlaying] = React.useState(null);
  const [hovering, setHovering] = React.useState(null);
  const [scrollTo, setScrollTo] = React.useState(null);

  const params = new URLSearchParams(window.location.search);
  const filter = params.get("filter");
  const [filterOn, setFilter] = React.useState(filter === "on");

  React.useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    foursquare
      .get("demo/marsbot/audio/snippetuser", {
        params: {
          userId: user.id,
          tz: tz
        }
      })
      .then(resp => setAudios(resp.data.response.audio));
  }, [user]);

  React.useEffect(() => {
    const element = scrollRef && scrollRef.current;
    element &&
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
  }, [scrollTo]);

  const handleDelete = audioId => {
    if (!window.confirm("Are you sure you want to delete this audio?")) return;
    foursquare
      .post(
        "demo/marsbot/audio/delete",
        qs.stringify({
          audioFileId: audioId
        })
      )
      .then(resp => setAudios(audios.filter(a => a.id !== audioId)))
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

  const audioItemProps = {
    playing,
    handlePlay,
    handleDelete
  };

  const audioItems = audios
    .filter(a => !filterOn || a.venues[0])
    .map((audio, index) => (
      <div
        key={audio.id}
        ref={scrollTo === audio.id ? scrollRef : null}
        onMouseEnter={() => setHovering(audio.id)}
        onMouseLeave={() => setHovering(null)}
        className={hovering === audio.id ? classes.activeListItem : ""}
      >
        <AudioItem audio={audio} {...audioItemProps} />
      </div>
    ));

  return (
    <Grid container>
      <Grid item className={classes.gridItem} xs={12} sm={5} md={4}>
        <Paper>
          <List disablePadding>
            <ListItem divider key="title">
              <ListItemText
                primary={`${user.firstName}'s Marsbot Audios`}
                primaryTypographyProps={{
                  component: "h1",
                  variant: "h6",
                  align: "center"
                }}
              />
              <ListItemSecondaryAction>
                <Tooltip title="Toggle venue audios only" aria-label="filter">
                  <Switch
                    checked={filterOn}
                    onChange={e => {
                      setFilter(e.target.checked);
                    }}
                    color="secondary"
                    size="small"
                  />
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
            {audioItems}
          </List>
        </Paper>
      </Grid>
      <Grid item xs sm md className={classes.gridItem}>
        <AudioMap
          audios={audios.filter(a => a.venues[0])}
          hovering={hovering}
          setHovering={a => {
            setHovering(a);
            setScrollTo(a);
          }}
          audioItemProps={audioItemProps}
        />
      </Grid>
    </Grid>
  );
}
