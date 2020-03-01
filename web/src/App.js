import React from 'react';
import {Box, Button, Typography} from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import {getUser, logOut, UserContext} from './User';
import Nav from './Nav';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    getUser().then(user => this.setState({user: user}));
  }

  handleLogOut = () => {
    logOut();
    this.setState({user: null});
  }

  render() {
    const { user } = this.state;
    return (
      <React.Fragment>
        <CssBaseline />

        <UserContext.Provider value={user}>
          <Nav handleLogOut={this.handleLogOut} />
          <Container component="main" maxWidth="xs">
            <Box display="flex" flexDirection="column" justifyContent="center" height="100vh">
              {
                user ?
                  <Container component="main">
                    <Typography variant="h2">Signed In</Typography>
                  </Container>
                :
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  href="/login"
                >
                  Sign In with Foursquare
                </Button>
              }
            </Box>
          </Container>


        </UserContext.Provider>
      </React.Fragment>
    );
  }
}

export default App;
