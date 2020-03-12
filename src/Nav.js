import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography
} from "@material-ui/core";
import { PlaylistAdd } from "@material-ui/icons";
import { Link as RouterLink, useHistory } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import {
  usePopupState,
  bindMenu,
  bindTrigger
} from "material-ui-popup-state/hooks";
import React from "react";

import User from "./User";

export default function Nav(props) {
  const popupState = usePopupState({ variant: "popper", popupId: "demoMenu" });
  const { user, setUser } = React.useContext(User.Context);
  const history = useHistory();

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

          <Box flexGrow={1} ml={2}>
            <Typography variant="h6" color="inherit" noWrap>
              <Link
                component={RouterLink}
                to="/"
                underline="none"
                color="inherit"
              >
                Marsbot Audio
              </Link>
            </Typography>
          </Box>

          {user && (
            <>
              <Link component={RouterLink} to="/upload" color="inherit">
                <Tooltip title="Upload a new marsbotaudio" aria-label="upload">
                  <IconButton color="inherit">
                    <PlaylistAdd fontSize="large" />
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
