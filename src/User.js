import React from "react";
import Cookies from "js-cookie";
import foursquare from "./APIClient";

const UserContext = React.createContext(null);
const tokenCookieKey = "foursquare_oauth_token";

async function getUser(userId) {
  if (!Cookies.get(tokenCookieKey)) return null;
  userId = userId || "self";
  const localStorageKey = `/user/${userId}`;
  let data = window.localStorage.getItem(localStorageKey);
  if (data) return JSON.parse(data);

  const response = await foursquare.get(`/users/${userId}`);
  const user = response.data.response.user;
  data = {
    id: user.id,
    firstName: user.firstName,
    name: `${user.firstName} ${user.lastName}`,
    email: user.contact.email,
    profile: user.canonicalUrl,
    picture: `${user.photo.prefix}100x100${user.photo.suffix}`
  };
  window.localStorage.setItem(localStorageKey, JSON.stringify(data));
  return data;
}

function logOut() {
  Cookies.remove(tokenCookieKey);
  window.localStorage.clear();
}

export { getUser, logOut, UserContext };
