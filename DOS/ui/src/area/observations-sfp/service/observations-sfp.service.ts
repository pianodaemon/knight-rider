import { axiosApi } from 'src/redux-utils/axios.helper';
import { getAppSettings } from 'src/shared/utils/app-settings.util';
import { ObservationSFP } from '../state/observations-sfp.reducer';

export function getObservations(options: any): Promise<any> {
  const searchParams = new URLSearchParams({
    ...options,
    limit: Number.MAX_SAFE_INTEGER,
  });
  return axiosApi(
    `${getAppSettings().baseUrl}/obs_sfp/?${searchParams}`,
    {
      method: 'get',
      headers: { accept: 'application/json' },
      withCredentials: true,
    },
    false
  );
}

export function createObservationSFP(fields: ObservationSFP): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/obs_sfp/`, {
    method: 'post',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
    withCredentials: true,
  });
}

export function readObservationSFP(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/obs_sfp/${id}`, {
    method: 'get',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
}

export function updateObservationSFP(
  id: number | string,
  fields: ObservationSFP
): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/obs_sfp/${id}`, {
    method: 'put',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
    withCredentials: true,
  });
}

export function deleteObservationSFP(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/obs_sfp/${id}`, {
    method: 'delete',
    withCredentials: true,
  });
}