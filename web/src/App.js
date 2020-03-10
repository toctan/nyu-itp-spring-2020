import React from "react";
import { Box, Button } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { getUser, UserContext } from "./User";
import Nav from "./Nav";
import AudioList from "./AudioList";
import AudioUpload from "./AudioUpload";

export default function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("_user_id");
    getUser(userId).then(setUser);
  }, []);

  return (
    <Router>
      <CssBaseline />

      <UserContext.Provider value={user}>
        <Nav setUser={setUser} />
        {user ? (
          <Switch>
            <Route path="/upload">
              <AudioUpload />
            </Route>
            <Route path="/">
              <AudioList />
            </Route>
          </Switch>
        ) : (
          <Container component="main" maxWidth="xs">
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              height="100vh"
            >
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                href={`${process.env.REACT_APP_BACKEND_URL || ""}/login`}
              >
                Sign In with Foursquare
              </Button>
            </Box>
          </Container>
        )}
      </UserContext.Provider>
    </Router>
  );
}
