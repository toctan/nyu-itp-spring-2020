import { CssBaseline } from "@material-ui/core";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation
} from "react-router-dom";
import React from "react";

import MarsbotHome from "./MarsbotHome";
import AudioUpload from "./AudioUpload";
import ChannelForm from "./ChannelForm";
import ChannelList from "./ChannelList";
import ChannelView from "./ChannelView";
import Nav from "./Nav";
import SignIn from "./SignIn";
import User from "./User";

function RouteSwitch() {
  const location = useLocation();
  const background = location.state && location.state.background;

  return (
    <>
      <Switch location={background || location}>
        <Route path="/signin">
          <SignIn />
        </Route>
        <Route path="/upload">
          <AudioUpload />
        </Route>
        <Route path="/channel/create">
          <MarsbotHome />
          <ChannelForm />
        </Route>
        <Route path="/channel/:id">
          <ChannelView />
        </Route>
        <Route path="/channels">
          <ChannelList action="fetchByOwner" />
        </Route>
        <Route path="/subscriptions">
          <ChannelList action="fetchSubscribed" />
        </Route>
        <Route path="/">
          <MarsbotHome />
        </Route>
      </Switch>

      {background && (
        <>
          <Route path="/channel/create">
            <ChannelForm />
          </Route>
          <Route path="/channel/:id/edit">
            <ChannelForm />
          </Route>
        </>
      )}
    </>
  );
}

export default function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("user_id") || "self";
    User.get(userId).then(setUser);
  }, []);

  return (
    <Router>
      <User.Context.Provider value={{ user, setUser }}>
        <CssBaseline />
        <Nav />
        {user ? <RouteSwitch /> : <SignIn />}
      </User.Context.Provider>
    </Router>
  );
}
