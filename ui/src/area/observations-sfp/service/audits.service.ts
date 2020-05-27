import { axiosApi } from 'src/redux-utils/axios.helper';
import { getAppSettings } from 'src/shared/utils/app-settings.util';
import { Audit } from '../state/audits.reducer';

export function getAudits(options: any): Promise<any> {
  const searchParams = new URLSearchParams({
    ...options,
    limit: Number.MAX_SAFE_INTEGER,
  });
  return axiosApi(
    `${getAppSettings().baseUrl}/audits/?${searchParams}`,
    {
      method: 'get',
      headers: { accept: 'application/json' },
    },
    false,
  );
}

export function removeAudit(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/audits/${id}`, {
    method: 'delete',
  });
}

export function createAudit(fields: Audit): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/audits/`, {
    method: 'post',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
  });
}

export function readAudit(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/audits/${id}`, {
    method: 'get',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
}

export function updateAudit(id: number | string, fields: Audit): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/audits/${id}`, {
    method: 'put',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
  });
}
