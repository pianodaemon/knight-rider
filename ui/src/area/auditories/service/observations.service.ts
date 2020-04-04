import { axiosApi } from 'src/redux-utils/axios.helper';
import { Observation } from '../state/observations.reducer';

export function getObservations(): Promise<any> {
  return axiosApi('http://54.251.129.178/api/v1/observations/?limit=1000', {
    method: 'get',
    headers: { accept: 'application/json' },
  });
}

export function removeObservation(id: number | string): Promise<any> {
  return axiosApi(`http://54.251.129.178/api/v1/observations/${id}`, {
    method: 'delete',
  });
}

export function createObservation(fields: Observation): Promise<any> {
  return axiosApi(`http://54.251.129.178/api/v1/observations/`, {
    method: 'post',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
  });
}
