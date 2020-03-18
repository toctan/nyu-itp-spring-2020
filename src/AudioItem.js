import {
  Box,
  IconButton,
  Link,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles
} from '@material-ui/core';
import {
  DeleteOutline,
  PauseCircleOutline,
  PlayCircleOutline,
  Schedule
} from "@material-ui/icons";
import Moment from "react-moment";
import React from "react";

import CategoryIcon from "./CategoryIcon";

const useStyles = makeStyles(theme => ({
  listActionIcon: {
    marginRight: theme.spacing(1)
  },
}));

export default function AudioItem(props) {
  const classes = useStyles();
  const {
    audio,
    playing,
    handlePlay,
    handleDelete,
    divider = true
  } = props;
  const venue = audio.venues[0];
  let title = "Unknown Audio",
      subTitle,
      category;
  if (audio.isName) title = "Your Name";
  if (audio.isJingle) title = "Your Jingle";
  if (venue) {
    title = (
      <Link
        color="inherit"
        target="_blank"
        href={`https://foursquare.com/v/${venue.id}`}
      >
        {venue.name}
      </Link>
    );
    subTitle = venue.location.formattedAddress[0];
    category = venue.categories && venue.categories[0];
  }

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

  return (
    <ListItem divider={divider}>
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
            rootProps={{ onClick: () => handleDelete(audio.id) }}
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
  );
}
