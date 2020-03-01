import axios from 'axios';
import Cookies from 'js-cookie';


const foursquare = axios.create({
  baseURL: 'https://api.foursquare.com/v2/',
});

foursquare.interceptors.request.use(config => {
  config.params = config.params || {};
  config.params.oauth_token = Cookies.get('foursquare_oauth_token');
  config.params.v = '20200301';
  return config;
});

export default foursquare;
