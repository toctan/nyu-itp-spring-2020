import axios from "axios";
import Cookies from "js-cookie";

export const tokenCookieKey = "foursquare_oauth_token";

const foursquare = axios.create({
  baseURL: "https://api.foursquare.com/v2/"
});

foursquare.interceptors.request.use(config => {
  config.params = config.params || {};
  config.params.oauth_token = Cookies.get(tokenCookieKey);
  config.params.v = process.env.REACT_APP_FOURSQUARE_API_VERSION;
  return config;
});

foursquare.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

export default foursquare;
