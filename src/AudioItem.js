import {
  DeleteOutline,
  MoreVert,
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
  Menu,
  MenuItem,
} from "@material-ui/core";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  usePopupState,
  bindMenu,
  bindHover,
} from "material-ui-popup-state/hooks";
import Moment from "react-moment";
import React from "react";

import CategoryIcon from "./CategoryIcon";
import ListActionItem from "./ListActionItem";

export default function AudioItem(props) {
  const location = useLocation();
  const { audio, playing, handlePlay, handleDelete, divider = true } = props;
  const popupState = usePopupState({
    variant: "popover",
    popupId: "audio-item-more-actions",
  });
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

          {/* <ListActionItem */}
          {/*   icon={Add} */}
          {/*   text="Add to channels" */}
          {/*   rootProps={{ */}
          {/*     component: RouterLink, */}
          {/*     to: { */}
          {/*       pathname: `/audio/${audio.id}/attach`, */}
          {/*       state: { background: location } */}
          {/*     } */}
          {/*   }} */}
          {/* /> */}

          <ListActionItem icon={MoreVert} rootProps={bindHover(popupState)} />
          <Menu {...bindMenu(popupState)}>
            {/* <MenuItem onClick={() => handleDelete(audio.id)}>Delete</MenuItem> */}
            <MenuItem
              component={RouterLink}
              to={{
                pathname: `/audio/${audio.id}/attach`,
                state: { background: location },
              }}
            >
              Add to channels
            </MenuItem>
          </Menu>
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
