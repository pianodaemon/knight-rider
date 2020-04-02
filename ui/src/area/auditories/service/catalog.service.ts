import { axiosApi } from 'src/redux-utils/axios.helper';

export function getCatalog(): Promise<any> {
  return axiosApi('http://54.251.129.178/api/v1/observations/catalog', {
    method: 'get',
    headers: { accept: 'application/json' },
  });
}
