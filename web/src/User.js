import React from 'react';
import Cookies from 'js-cookie';
import foursquare from './APIClient';

const UserContext = React.createContext(null);
const localStorageKey = 'current_user';
const tokenCookieKey = 'foursquare_oauth_token';

async function getUser() {
  if (!Cookies.get(tokenCookieKey)) return null;
  let data = window.localStorage.getItem(localStorageKey);
  if (data) return JSON.parse(data);

  const response = await foursquare.get('/users/self');
  const user = response.data.response.user;
  data = {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.contact.email,
    profile: user.canonicalUrl,
    picture: `${user.photo.prefix}100x100${user.photo.suffix}`,
  };
  window.localStorage.setItem(localStorageKey, JSON.stringify(data));
  return data;
};

function logOut() {
  Cookies.remove(tokenCookieKey);
  window.localStorage.clear();
}

export {getUser, logOut, UserContext};
