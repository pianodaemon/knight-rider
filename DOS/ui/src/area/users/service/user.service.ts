import { axiosApi } from 'src/redux-utils/axios.helper';
import { getAppSettings } from 'src/shared/utils/app-settings.util';
import { User } from '../state/users.reducer';

export function getUsers(options: any): Promise<any> {
  const searchParams = new URLSearchParams({
    ...options,
    limit: Number.MAX_SAFE_INTEGER,
  });
  return axiosApi(
    `${getAppSettings().baseUrl}/users/?${searchParams}`,
    {
      method: 'get',
      headers: { accept: 'application/json' },
    },
    false
  );
}

export function removeUser(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/users/${id}`, {
    method: 'delete',
  });
}

export function createUser(fields: User): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/users/`, {
    method: 'post',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
  });
}

export function readUser(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/users/${id}`, {
    method: 'get',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
}

export function updateUser(id: number | string, fields: User): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/users/${id}`, {
    method: 'put',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
  });
}
