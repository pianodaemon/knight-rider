import axios from 'axios';

export function axiosApi(url: string, options: any, onlyData: boolean = true) {
  const modifiedOptions = options || {};
  const headers = modifiedOptions.headers || {};

  modifiedOptions.headers = headers;
  modifiedOptions.url = url;

  return axios
    .request(modifiedOptions)
    .then((response) => (onlyData ? response.data : response))
    .then((data) => data)
    .catch((reason) => Promise.reject(reason));
}
