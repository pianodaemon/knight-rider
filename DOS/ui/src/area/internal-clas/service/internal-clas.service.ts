import { axiosApi } from 'src/redux-utils/axios.helper';
import { getAppSettings } from 'src/shared/utils/app-settings.util';
import { InternalClas } from '../state/internal-clas.reducer';

export function getInternalClas(options: any): Promise<any> {
  const searchParams = new URLSearchParams({
    ...options,
    limit: Number.MAX_SAFE_INTEGER,
  });
  return axiosApi(
    `${getAppSettings().baseUrl}/clasifs_internas/?${searchParams}`,
    {
      method: 'get',
      headers: { accept: 'application/json' },
      withCredentials: true,
    },
    false,
  );
}

export function removeInternalClas(org_fiscal_id: number | string, direccion_id: number | string, id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/clasifs_internas/${org_fiscal_id}/${direccion_id}/${id}`, {
    method: 'delete',
    withCredentials: true,
  });
}

export function createInternalClas(fields: InternalClas): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/clasifs_internas/`, {
    method: 'post',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
    withCredentials: true,
  });
}

export function readInternalClas(org_fiscal_id: number | string, direccion_id: number | string, id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/clasifs_internas/${org_fiscal_id}/${direccion_id}/${id}`, {
    method: 'get',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
}

export function updateInternalClas(org_fiscal_id: number | string, direccion_id: number | string, id: number | string, title: string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/clasifs_internas/${org_fiscal_id}/${direccion_id}/${id}`, {
    method: 'put',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: { title },
    withCredentials: true,
  });
}
