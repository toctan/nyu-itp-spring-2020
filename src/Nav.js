import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Slide,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
  useScrollTrigger,
} from "@material-ui/core";
import {
  PlaylistAdd,
  Publish,
  Apps,
  Subscriptions,
  MoreVert,
} from "@material-ui/icons";
import { Link as RouterLink, useHistory, useLocation } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  usePopupState,
  bindMenu,
  bindTrigger,
} from "material-ui-popup-state/hooks";
import React from "react";

import User from "./User";

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const NavTabs = withStyles((theme) => ({
  indicator: {
    backgroundColor: "white",
    height: "4px",
  },
}))(Tabs);

const NavTabItem = withStyles((theme) => ({
  root: {
    // textTransform: "none",
    opacity: 1,
    minWidth: 0, // theme.spacing(10),
    minHeight: theme.spacing(8),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}))((props) => <Tab disableRipple {...props} />);

const useStyles = makeStyles((theme) => ({
  logo: {
    marginLeft: theme.spacing(1.5),
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  appbar: {
    "& + *": {
      marginTop: theme.spacing(8),
    },
  },
}));

export default function Nav(props) {
  const popupState = usePopupState({ variant: "popper", popupId: "demoMenu" });
  const { user, setUser } = React.useContext(User.Context);
  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();

  const background = { background: location };
  const tabs = user
    ? [
        [`/user/${user.id}/channels`, <Apps />, null, "My channels"],
        ["/subscriptions", <Subscriptions />, null, "Subscribed channels"],
        [
          "/channel/create",
          <PlaylistAdd />,
          background,
          "Create a new channel",
        ],
        ["/upload", <Publish />, null, "Upload an audio"],
      ]
    : [];
  const path = window.location.pathname;
  const active = tabs.filter((t) => t[0] === path).length ? path : false;

  const handleLogOut = () => {
    User.signOut();
    setUser(null);
    history.push("/");
  };

  return (
    <HideOnScroll>
      <AppBar className={classes.appbar}>
        <Toolbar>
          <IconButton
            component={RouterLink}
            to="/"
            edge="start"
            color="inherit"
          >
            <Avatar src="https://pbs.twimg.com/media/EN4Hl-jUwAAy0T5.jpg" />
            <Typography variant="h6" component="h1" className={classes.logo}>
              Marsbot Audio
            </Typography>
          </IconButton>

          <Box display="flex" alignItems="center" flexGrow={1}></Box>

          {user && (
            <>
              <NavTabs variant="fullWidth" value={active}>
                {tabs.map((t) => {
                  const [path, icon, state, title] = t;
                  return (
                    <NavTabItem
                      component={RouterLink}
                      key={path}
                      to={{
                        pathname: path,
                        state: state,
                      }}
                      value={path}
                      label={
                        <Tooltip title={title} aria-label={title}>
                          <IconButton color="inherit">{icon}</IconButton>
                        </Tooltip>
                      }
                    />
                  );
                })}
              </NavTabs>

              <IconButton
                edge="end"
                color="inherit"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                {...bindTrigger(popupState)}
              >
                {/* <Avatar alt={user.name} src={user.picture} /> */}
                <MoreVert />
              </IconButton>
              <Menu id="menu-appbar" {...bindMenu(popupState)}>
                <MenuItem component={Link} href={user.profile} color="inherit">
                  {`${user.firstName}'s Profile`}
                </MenuItem>
                <MenuItem
                  component={Link}
                  href="https://foursquare.com/settings"
                  color="inherit"
                >
                  Settings
                </MenuItem>
                <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
}
