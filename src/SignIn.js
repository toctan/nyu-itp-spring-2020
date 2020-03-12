import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  makeStyles
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import React from "react";

import User from "./User";

const oauthStateKey = "foursquare_oauth_state";
const session = window.sessionStorage || window.localStorage;

function SignInButton(props) {
  const {
    REACT_APP_FOURSQUARE_OAUTH2_URL,
    REACT_APP_FOURSQUARE_CLIENT_ID
  } = process.env;

  const loc = window.location;
  const state = window.btoa(loc.pathname + loc.search + loc.hash);
  session.setItem(oauthStateKey, state);

  const params = {
    client_id: REACT_APP_FOURSQUARE_CLIENT_ID,
    redirect_uri: `${window.location.origin}/signin`,
    response_type: "code",
    state
  };
  const qs = Object.keys(params)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(params[key]))
    .join("&");
  const href = `${REACT_APP_FOURSQUARE_OAUTH2_URL}authenticate?${qs}`;

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      height="100vh"
      mt={-8}
    >
      <Button fullWidth variant="contained" color="primary" href={href}>
        Sign In with Foursquare
      </Button>
    </Box>
  );
}

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff"
  }
}));

function SignInCallback(props) {
  const classes = useStyles();
  const history = useHistory();
  const { code, state } = props;
  const { setUser } = React.useContext(User.Context);

  React.useEffect(() => {
    if (state !== session.getItem(oauthStateKey)) {
      history.push("/");
      return;
    }
    const from = window.atob(state);
    User.signIn(code)
      .then(user => {
        setUser(user);
        history.replace(from);
      })
      .catch(_ => history.push("/"));
  });

  return (
    <Backdrop open className={classes.backdrop}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

export default function SignIn(props) {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const state = params.get("state");

  return (
    <Container component="main" maxWidth="xs">
      {code ? <SignInCallback code={code} state={state} /> : <SignInButton />}
    </Container>
  );
}
