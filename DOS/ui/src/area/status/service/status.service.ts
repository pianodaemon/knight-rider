import { axiosApi } from 'src/redux-utils/axios.helper';
import { getAppSettings } from 'src/shared/utils/app-settings.util';
import { Status } from '../state/status.reducer';

export function getStatuses(options: any): Promise<any> {
  const searchParams = new URLSearchParams({
    ...options,
    limit: Number.MAX_SAFE_INTEGER,
  });
  return axiosApi(
    `${getAppSettings().baseUrl}/estatus/?${searchParams}`,
    {
      method: 'get',
      headers: { accept: 'application/json' },
      withCredentials: true,
    },
    false,
  );
}

export function removeStatus(org_fiscal_id: number, pre_ires: string, id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/estatus/${org_fiscal_id}/${pre_ires}/${id}`, {
    method: 'delete',
    withCredentials: true,
  });
}

export function createStatus(fields: Status): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/estatus/`, {
    method: 'post',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
    withCredentials: true,
  });
}

export function readStatus(org_fiscal_id: number, pre_ires: string, id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/estatus/${org_fiscal_id}/${pre_ires}/${id}`, {
    method: 'get',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
}

export function updateStatus(org_fiscal_id: number, pre_ires: string, id: number | string, title: string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/estatus/${org_fiscal_id}/${pre_ires}/${id}`, {
    method: 'put',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: { title },
    withCredentials: true,
  });
}
