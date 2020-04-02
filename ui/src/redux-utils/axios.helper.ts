import axios from 'axios';

export function axiosApi(url: string, options: any) {
  const modifiedOptions = options || {};
  const headers = modifiedOptions.headers || {};

  modifiedOptions.headers = headers;
  modifiedOptions.url = url;

  return axios
    .request(modifiedOptions)
    .then((response) => response.data)
    .then((data) => data)
    .catch((reason) => Promise.reject(reason));
}
