import React from 'react';
import {Box, Button} from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import {getUser, logOut, UserContext} from './User';
import Nav from './Nav';
import AudioList from './AudioList';
import AudioUpload from './AudioUpload';


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
      <Router>
        <React.Fragment>
          <CssBaseline />

          <UserContext.Provider value={user}>
            <Nav handleLogOut={this.handleLogOut} />
            {
              user ?
                <Switch>
                  <Route path="/upload">
                    <AudioUpload />
                  </Route>
                  <Route path="/">
                    <AudioList />
                  </Route>
                </Switch> :
                <Container component="main" maxWidth="xs">
                  <Box display="flex"
                       flexDirection="column"
                       justifyContent="center"
                       height="100vh">
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      href="/login"
                    >
                      Sign In with Foursquare
                    </Button>
                  </Box>
                </Container>
            }
          </UserContext.Provider>
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
