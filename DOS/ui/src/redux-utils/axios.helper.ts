import axios from 'axios';
import Cookies from 'universal-cookie';

export function axiosApi(url: string, options: any, onlyData: boolean = true) {
  const modifiedOptions = options || {};
  const headers = modifiedOptions.headers || {};

  modifiedOptions.headers = headers;
  modifiedOptions.url = url;

  setRequestInterceptors();

  return axios
    .request(modifiedOptions)
    .then((response) => (onlyData ? response.data : response))
    .then((data) => data)
    .catch((reason) => Promise.reject(reason));
}

function setRequestInterceptors(): void {
  axios.interceptors.request.use(
    config => {
      if (config.withCredentials) {
        const cookies = new Cookies();
        const token = cookies.get('token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
      return config;
    },
    error => { Promise.reject(error) }
  );
}
