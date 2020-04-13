import {
  Card,
  CardMedia,
  Grow,
  Link,
  List,
  Popper,
  makeStyles,
} from "@material-ui/core";
import { LocationOn } from "@material-ui/icons";
import { usePopupState, bindPopper } from "material-ui-popup-state/hooks";
import GoogleMapReact from "google-map-react";
import React from "react";

import AudioItem from "./AudioItem";
import findZoomAndCenter from "./utils";

const useStyles = makeStyles((theme) => ({
  popper: {
    zIndex: theme.zIndex.tooltip,
  },
  card: {
    width: theme.spacing(45),
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  markerIcon: {
    fontSize: theme.typography.h3.fontSize,
    transform: "translate(-50%, -100%)",
    "&.active": {
      color: theme.palette.primary.main,
    },
  },
}));

function Marker(props) {
  const classes = useStyles();
  const popupState = usePopupState({ variant: "popper" });
  const anchorRef = React.useRef(null);
  const { audio, hovering, setHovering, audioItemProps } = props;
  const isActive = audio.id === hovering;

  let photoSrc;
  const venue = audio.venues[0];
  // ["venues"][0]["photos"]["groups"][0]["items"][0]["prefix"]
  if (venue.photos) {
    const pItem = venue.photos.groups[0].items[0];
    photoSrc = `${pItem.prefix}${pItem.width}x${pItem.height}${pItem.suffix}`;
  }

  React.useEffect(() => {
    if (isActive) popupState.open(anchorRef.current);
    else popupState.close();
  }, [isActive, popupState]);

  return (
    <>
      <LocationOn
        className={`${classes.markerIcon}${isActive ? " active" : ""}`}
        ref={anchorRef}
        color="secondary"
        onMouseEnter={() => setHovering(audio.id)}
        onMouseLeave={() => setHovering(null)}
      />

      <Popper
        placement="top"
        transition
        className={classes.popper}
        container={() => document.fullscreenElement || document.body}
        {...bindPopper(popupState)}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} timeout={300}>
            <Card
              className={classes.card}
              onMouseEnter={() => setHovering(audio.id)}
              onMouseLeave={() => setHovering(null)}
            >
              <Link
                target="_blank"
                rel="noopener"
                href={`https://foursquare.com/v/${venue.id}`}
              >
                <CardMedia
                  className={classes.cardMedia}
                  image={photoSrc}
                  title={venue.name}
                />
              </Link>
              <List disablePadding>
                <AudioItem audio={audio} divider={false} {...audioItemProps} />
              </List>
            </Card>
          </Grow>
        )}
      </Popper>
    </>
  );
}

export default function AudioMap(props) {
  const { audios, hovering, setHovering, audioItemProps } = props;
  const defaultProps = {
    center: { lat: 40.7484, lng: -73.9857 },
    zoom: 13,
  };
  const { center, zoom } = findZoomAndCenter(
    {
      size: {
        width: (window.innerWidth / 3) * 2,
        height: window.innerHeight - 64,
      },
      ...defaultProps,
    },
    audios.map((audio) => {
      const location = audio.venues[0].location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    })
  );

  const renderMarker = (audio, index) => {
    const location = audio.venues[0].location;
    return (
      <Marker
        key={audio.id}
        lat={location.lat}
        lng={location.lng}
        audio={audio}
        hovering={hovering}
        setHovering={setHovering}
        audioItemProps={audioItemProps}
      />
    );
  };

  return (
    <GoogleMapReact
      bootstrapURLKeys={{
        key: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
        language: "en",
      }}
      defaultCenter={defaultProps.center}
      defaultZoom={defaultProps.zoom}
      center={center}
      zoom={zoom - 0.2}
    >
      {audios.map(renderMarker)}
    </GoogleMapReact>
  );
}
