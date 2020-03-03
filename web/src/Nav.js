import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import {UserContext} from './User';


const styles = theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
});

class Nav extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
    };
  }

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const user = this.context;

    const handleMenu = event => {
      this.setState({anchorEl: event.currentTarget});
    };

    const handleClose = () => {
      this.setState({anchorEl: null});
    };

    return (
      <>
        <AppBar>
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>

            <Box flexGrow={1}>
              <Typography variant="h6" className={classes.title} color="inherit" noWrap>
                Marsbot Audio
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
                  onClick={handleMenu}
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
                  onClose={handleClose}
                >
                  <MenuItem component={Link} href={user.profile} color='inherit'>Profile</MenuItem>
                  <MenuItem component={Link} href={'https://foursquare.com/settings'} color='inherit'>Settings</MenuItem>
                  <MenuItem onClick={this.props.handleLogOut}>Log Out</MenuItem>
                </Menu>
              </div>
            )}

          </Toolbar>
        </AppBar>
        <Toolbar />
      </>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Nav);
