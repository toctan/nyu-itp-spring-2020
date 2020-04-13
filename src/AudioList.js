import { Grid, List, Paper, makeStyles } from "@material-ui/core";
import React from "react";

import AudioItem from "./AudioItem";
import AudioMap from "./AudioMap";

const useStyles = makeStyles((theme) => ({
  gridItem: {
    [theme.breakpoints.up("sm")]: {
      height: `calc(100vh - ${theme.spacing(8)}px)`,
      overflowY: "auto",
    },
  },
  activeListItem: {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function AudioList(props) {
  const classes = useStyles();
  const scrollRef = React.useRef(null);
  const [playing, setPlaying] = React.useState(null);
  const [hovering, setHovering] = React.useState(null);
  const [scrollTo, setScrollTo] = React.useState(null);
  const { audios, header, handleDelete, action, withMap = true } = props;

  React.useEffect(() => {
    const element = scrollRef && scrollRef.current;
    element &&
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }, [scrollTo]);

  const handlePlay = (src) => {
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
    action,
    playing,
    handlePlay,
    handleDelete,
  };

  const audioList = (
    <List disablePadding>
      {header}
      {audios.map((audio, index) => (
        <div
          key={audio.id}
          ref={scrollTo === audio.id ? scrollRef : null}
          onMouseEnter={() => setHovering(audio.id)}
          onMouseLeave={() => setHovering(null)}
          className={hovering === audio.id ? classes.activeListItem : ""}
        >
          <AudioItem audio={audio} {...audioItemProps} />
        </div>
      ))}
    </List>
  );
  if (!withMap) return audioList;

  return (
    <Grid container>
      <Grid item className={classes.gridItem} xs={12} sm={5} md={4}>
        <Paper>{audioList}</Paper>
      </Grid>
      <Grid item xs sm md className={classes.gridItem}>
        <AudioMap
          audios={audios.filter((a) => a.venues[0])}
          hovering={hovering}
          setHovering={(a) => {
            setHovering(a);
            setScrollTo(a);
          }}
          audioItemProps={audioItemProps}
        />
      </Grid>
    </Grid>
  );
}
