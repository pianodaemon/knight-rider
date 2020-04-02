import { axiosApi } from 'src/redux-utils/axios.helper';

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

export function createObservation(
  observation_type_id: number | string,
  social_program_id: number | string,
): Promise<any> {
  return axiosApi(`http://54.251.129.178/api/v1/observations/`, {
    method: 'post',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: {
      observation_type_id,
      social_program_id,
    },
  });
}
