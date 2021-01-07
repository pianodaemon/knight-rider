import { axiosApi } from 'src/redux-utils/axios.helper';
import { getAppSettings } from 'src/shared/utils/app-settings.util';
import { Action } from '../state/actions.reducer';

export function getActions(options: any): Promise<any> {
  const searchParams = new URLSearchParams({
    ...options,
    limit: Number.MAX_SAFE_INTEGER,
  });
  return axiosApi(
    `${getAppSettings().baseUrl}/acciones/?${searchParams}`,
    {
      method: 'get',
      headers: { accept: 'application/json' },
      withCredentials: true,
    },
    false,
  );
}

export function removeAction(org_fiscal_id: number, id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/acciones/${org_fiscal_id}/${id}`, {
    method: 'delete',
    withCredentials: true,
  });
}

export function createAction(fields: Action): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/acciones/`, {
    method: 'post',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
    withCredentials: true,
  });
}

export function readAction(org_fiscal_id: number, id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/acciones/${org_fiscal_id}/${id}`, {
    method: 'get',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
}

export function updateAction(org_fiscal_id: number | string, id: number | string, title: string, description: string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/acciones/${org_fiscal_id}/${id}`, {
    method: 'put',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: { title, description },
    withCredentials: true,
  });
}
