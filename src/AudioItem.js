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
  const { audio, playing, handlePlay, handleDelete, divider = true } = props;
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
            icon={PlayCircleOutline}
            text={audio.playCount || 0}
          />
          <ListActionItem
            icon={DeleteOutline}
            text="Delete"
            onClick={() => handleDelete(audio.id)}
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
