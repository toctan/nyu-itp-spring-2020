import { CssBaseline } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React from "react";

import User from "./User";
import AudioList from "./AudioList";
import AudioUpload from "./AudioUpload";
import ChannelList from "./ChannelList";
import Nav from "./Nav";
import SignIn from "./SignIn";

export default function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("user_id") || "self";
    User.get(userId).then(setUser);
  }, []);

  const PrivateRoute = ({ children, ...rest }) => (
    <Route
      {...rest}
      render={({ location }) => (user ? children : <SignIn />)}
    />
  );

  return (
    <User.Context.Provider value={{ user, setUser }}>
      <Router>
        <CssBaseline />
        <Nav />

        <Switch>
          <Route path="/signin">
            <SignIn />
          </Route>
          <PrivateRoute path="/upload">
            <AudioUpload />
          </PrivateRoute>
          <PrivateRoute path="/channels">
            <ChannelList />
          </PrivateRoute>
          <PrivateRoute path="/">
            <AudioList />
          </PrivateRoute>
        </Switch>
      </Router>
    </User.Context.Provider>
  );
}
