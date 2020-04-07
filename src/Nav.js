import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Toolbar,
  Tooltip
} from "@material-ui/core";
import { PlaylistAdd, Publish } from "@material-ui/icons";
import { Link as RouterLink, useHistory, useLocation } from "react-router-dom";
import {
  usePopupState,
  bindMenu,
  bindTrigger
} from "material-ui-popup-state/hooks";
import MenuIcon from "@material-ui/icons/Menu";
import React from "react";

import User from "./User";

export default function Nav(props) {
  const popupState = usePopupState({ variant: "popper", popupId: "demoMenu" });
  const { user, setUser } = React.useContext(User.Context);
  const history = useHistory();
  const location = useLocation();

  const tabs = {
    "/channels": "Channels",
    "/subscriptions": "Subscriptions"
  };
  const path = window.location.pathname;
  const active = tabs[path] ? path : false;

  const handleLogOut = () => {
    User.signOut();
    setUser(null);
    history.push("/");
  };

  return (
    <>
      <AppBar>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>

          <Box display="flex" alignItems="center" flexGrow={1}>
            <Box
              fontSize="h6.fontSize"
              fontWeight="fontWeightMedium"
              color="inherit"
              /* ml={1} */
              mr={2}
            >
              <Link
                component={RouterLink}
                to="/"
                underline="none"
                color="inherit"
              >
                Marsbot Audio
              </Link>
            </Box>
            <Tabs value={active}>
              {Object.entries(tabs).map(t => (
                <Tab
                  component={RouterLink}
                  key={t[0]}
                  to={t[0]}
                  value={t[0]}
                  label={t[1]}
                />
              ))}
            </Tabs>
          </Box>

          {user && (
            <>
              <Tooltip
                title="Create a new channel"
                aria-label="create new channel"
              >
                <IconButton
                  color="inherit"
                  component={RouterLink}
                  to={{
                    pathname: "/channel/create",
                    state: { background: location }
                  }}
                >
                  <PlaylistAdd fontSize="large" />
                </IconButton>
              </Tooltip>

              <Link component={RouterLink} to="/upload" color="inherit">
                <Tooltip title="Upload a new marsbotaudio" aria-label="upload">
                  <IconButton color="inherit">
                    <Publish fontSize="large" />
                  </IconButton>
                </Tooltip>
              </Link>
              <Box ml={1}>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  {...bindTrigger(popupState)}
                >
                  <Avatar alt={user.name} src={user.picture} />
                </IconButton>
                <Menu id="menu-appbar" {...bindMenu(popupState)}>
                  <MenuItem
                    component={Link}
                    href={user.profile}
                    color="inherit"
                  >
                    Profile
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
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}
