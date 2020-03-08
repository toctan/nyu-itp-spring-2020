import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from '@material-ui/core';
import {
  Link as RouterLink,
  useHistory
} from "react-router-dom";
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';

import { UserContext, logOut } from './User';


export default function Nav(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const user = React.useContext(UserContext);
  const history = useHistory();

  const handleLogOut = () => {
    logOut();
    history.push('/');
    props.setUser(null);
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
                <Link component={RouterLink} to="/" underline="none" color="inherit">Marsbot Audio</Link>
              </Typography>
            </Box>

            {user && (
              <div>
                <Avatar
                  alt={user.name}
                  src={user.picture}
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={e => setAnchorEl(e.currentTarget)}
                />
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem component={Link} href={user.profile} color="inherit">Profile</MenuItem>
                  <MenuItem component={Link} href="https://foursquare.com/settings" color="inherit">Settings</MenuItem>
                  <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
                </Menu>
              </div>
            )}

          </Toolbar>
        </AppBar>
        <Toolbar />
      </>
    );
}
