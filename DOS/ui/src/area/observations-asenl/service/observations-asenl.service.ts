import { axiosApi } from 'src/redux-utils/axios.helper';
import { getAppSettings } from 'src/shared/utils/app-settings.util';
import { ObservationASENL } from '../state/observations-asenl.reducer';

const PREFIX = 'obs_pre_asenl';

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
    },
    false
  );
}

export function createObservationASENL(fields: ObservationASENL): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/${PREFIX}`, {
    method: 'post',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
  });
}

export function readObservationASENL(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/${PREFIX}/${id}`, {
    method: 'get',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
}

export function updateObservationASENL(
  id: number | string,
  fields: ObservationASENL
): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/${PREFIX}/${id}`, {
    method: 'put',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
  });
}

export function deleteObservationASENL(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/${PREFIX}/${id}`, {
    method: 'delete',
  });
}