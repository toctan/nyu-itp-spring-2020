import Cookies from "js-cookie";
import React from "react";
import axios from "axios";

import qs from "qs";

import foursquare, { tokenCookieKey } from "./APIClient";

export default class User {
  static Context = React.createContext({
    user: null,
    setUser: () => {},
  });

  constructor(data) {
    Object.assign(this, data);
  }

  static async get(userId) {
    if (!Cookies.get(tokenCookieKey)) return null;
    const localStorageKey = `/user/${userId}`;
    let data = window.localStorage.getItem(localStorageKey);
    if (data) return new User(JSON.parse(data));

    const response = await foursquare.get(`/users/${userId}`);
    const user = response.data.response.user;
    data = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.contact.email,
      profile: user.canonicalUrl,
      picture: `${user.photo.prefix}100x100${user.photo.suffix}`,
    };
    window.localStorage.setItem(localStorageKey, JSON.stringify(data));
    return new User(data);
  }

  static async signIn(code) {
    const response = await axios.post(
      "/api/oauth2/access_token",
      qs.stringify({
        client_id: process.env.REACT_APP_FOURSQUARE_CLIENT_ID,
        grant_type: "authorization_code",
        redirect_uri: `${window.location.origin}/signin`,
        code: code,
      })
    );
    const { access_token } = response.data;
    Cookies.set(tokenCookieKey, access_token, { expires: 31 });
    return User.get("self");
  }

  static signOut() {
    window.localStorage.clear();
    Cookies.remove(tokenCookieKey);
  }
}
