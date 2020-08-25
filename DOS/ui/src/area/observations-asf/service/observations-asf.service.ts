import { axiosApi } from 'src/redux-utils/axios.helper';
import { getAppSettings } from 'src/shared/utils/app-settings.util';
import { ObservationASF } from '../state/observations-asf.reducer';

const PREFIX = 'obs_pre_asf';

export function getObservations(options: any): Promise<any> {
  const ENDPOINT = `${getAppSettings().baseUrl}/${PREFIX}`;
  const searchParams = new URLSearchParams({
    ...options,
    limit: Number.MAX_SAFE_INTEGER,
  });
  return axiosApi(
    `${ENDPOINT}/?${searchParams}`,
    {
      method: 'get',
      headers: { accept: 'application/json' },
      withCredentials: true,
    },
    false
  );
}

export function createObservationASF(fields: ObservationASF): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/${PREFIX}`, {
    method: 'post',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
    withCredentials: true,
  });
}

export function readObservationASF(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/${PREFIX}/${id}`, {
    method: 'get',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
}

export function updateObservationASF(
  id: number | string,
  fields: ObservationASF
): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/${PREFIX}/${id}`, {
    method: 'put',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
    withCredentials: true,
  });
}

export function deleteObservationASF(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/${PREFIX}/${id}`, {
    method: 'delete',
    withCredentials: true,
  });
}