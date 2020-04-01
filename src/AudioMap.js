import {
  Card,
  CardMedia,
  Container,
  Grow,
  List,
  Popper,
  makeStyles,
} from "@material-ui/core";
import { LocationOn } from "@material-ui/icons";
import { usePopupState, bindPopper } from "material-ui-popup-state/hooks";
import GoogleMapReact from "google-map-react";
import React from "react";

import AudioItem from "./AudioItem";

const useStyles = makeStyles((theme) => ({
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
        {...bindPopper(popupState)}
        placement="top"
        container={() => document.getElementsByClassName("gm-style")[0]}
        transition
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} timeout={300}>
            <Container
              maxWidth="xs"
              disableGutters
              onMouseEnter={() => setHovering(audio.id)}
              onMouseLeave={() => setHovering(null)}
            >
              <Card>
                <CardMedia
                  className={classes.cardMedia}
                  height="160"
                  component="img"
                  image={photoSrc}
                  title={venue.name}
                />
                <List disablePadding>
                  <AudioItem
                    audio={audio}
                    divider={false}
                    {...audioItemProps}
                  />
                </List>
              </Card>
            </Container>
          </Grow>
        )}
      </Popper>
    </>
  );
}

export default function AudioMap(props) {
  const { audios, hovering, setHovering, audioItemProps } = props;
  // TODO: calculate center & zoom from audio venue locations
  const defaultProps = {
    center: { lat: 40.7484, lng: -73.9857 },
    zoom: 13,
  };

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
    >
      {audios.map(renderMarker)}
    </GoogleMapReact>
  );
}
