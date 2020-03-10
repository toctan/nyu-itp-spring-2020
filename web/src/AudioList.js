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

import { UserContext } from "./User";
import AudioItem from "./AudioItem";
import AudioMap from "./AudioMap";
import foursquare from "./APIClient";

const useStyles = makeStyles(theme => ({
  gridItem: {
    [theme.breakpoints.up("sm")]: {
      height: `calc(100vh - ${theme.spacing(8)}px)`,
      overflowY: "auto"
    }
  }
}));

export default function AudioList(props) {
  const classes = useStyles();
  const user = React.useContext(UserContext);
  const [audios, setAudios] = React.useState([]);
  const [playing, setPlaying] = React.useState(null);
  const [hovering, setHovering] = React.useState(null);
  const [filter, setFilter] = React.useState(false);

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

  const handleDelete = index => {
    if (!window.confirm("Are you sure you want to delete this audio?")) return;
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

  const audioItems = audios
    .filter(a => !filter || a.venues[0])
    .map((audio, index) => (
      <AudioItem
        key={audio.id}
        audio={audio}
        playing={playing}
        handleDelete={() => handleDelete(index)}
        handlePlay={handlePlay}
        setHovering={setHovering}
      />
    ));

  return (
    <Grid container>
      <Grid item className={classes.gridItem} xs={12} sm={5} md={4}>
        <Paper>
          <List>
            <ListItem key="title">
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
                    checked={filter}
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
          hovering={hovering}
          setHovering={setHovering}
          audios={audios.filter(a => a.venues[0])}
          items={audioItems.filter((a, i) => audios[i].venues[0])}
        />
      </Grid>
    </Grid>
  );
}
