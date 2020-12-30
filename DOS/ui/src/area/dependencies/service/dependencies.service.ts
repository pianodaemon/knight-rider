import { axiosApi } from 'src/redux-utils/axios.helper';
import { getAppSettings } from 'src/shared/utils/app-settings.util';
import { Dependency } from '../state/dependencies.reducer';

export function getDependencies(options: any): Promise<any> {
  const searchParams = new URLSearchParams({
    ...options,
    limit: Number.MAX_SAFE_INTEGER,
  });
  return axiosApi(
    `${getAppSettings().baseUrl}/dependencias/?${searchParams}`,
    {
      method: 'get',
      headers: { accept: 'application/json' },
      withCredentials: true,
    },
    false,
  );
}

export function removeDependency(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/dependencias/${id}`, {
    method: 'delete',
    withCredentials: true,
  });
}

export function createDependency(fields: Dependency): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/dependencias/`, {
    method: 'post',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
    withCredentials: true,
  });
}

export function readDependency(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/dependencias/${id}`, {
    method: 'get',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
}

export function updateDependency(id: number | string, fields: Dependency): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/dependencias/${id}`, {
    method: 'put',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
    withCredentials: true,
  });
}
