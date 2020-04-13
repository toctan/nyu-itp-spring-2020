import {
  DeleteOutline,
  PauseCircleOutline,
  PlayCircleOutline,
  Schedule,
} from "@material-ui/icons";
import {
  IconButton,
  Link,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import Moment from "react-moment";
import React from "react";

import CategoryIcon from "./CategoryIcon";
import ListActionItem from "./ListActionItem";

const useStyles = makeStyles((theme) => ({
  listItemBody: {
    minWidth: 0,
  },
}));

export default function AudioItem(props) {
  const classes = useStyles();
  const {
    audio,
    action,
    playing,
    handlePlay,
    handleDelete,
    divider = true,
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
        underline="none"
        target="_blank"
        rel="noopener"
        href={`https://foursquare.com/v/${venue.id}`}
      >
        {venue.name}
      </Link>
    );
    subTitle = venue.location.formattedAddress[0];
    category = venue.categories && venue.categories[0];
  }

  const PlayIcon =
    playing && playing.src === audio.url
      ? PauseCircleOutline
      : PlayCircleOutline;

  return (
    <ListItem divider={divider}>
      <ListItemAvatar>
        <CategoryIcon category={category} />
      </ListItemAvatar>
      <div className={classes.listItemBody}>
        <ListItemText
          primary={title}
          primaryTypographyProps={{
            component: "h2",
            noWrap: true,
            title: venue && venue.name,
          }}
          secondary={subTitle}
          secondaryTypographyProps={{ noWrap: true, title: subTitle }}
        />
        <div>
          <ListActionItem
            edge="start"
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
            icon={PlayIcon}
            text={audio.playCount || 0}
            onClick={() => handlePlay(audio.url)}
          />
          {handleDelete && (
            <ListActionItem
              icon={DeleteOutline}
              text="Delete"
              onClick={() => handleDelete(audio.id)}
            />
          )}
        </div>
      </div>
      <ListItemSecondaryAction>
        {action ? (
          action(audio)
        ) : (
          <IconButton
            onClick={() => handlePlay(audio.url)}
            edge="end"
            aria-label="play"
          >
            <PlayIcon fontSize="large" />
          </IconButton>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );
}
