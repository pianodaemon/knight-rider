import { axiosApi } from 'src/redux-utils/axios.helper';
import { getAppSettings } from 'src/shared/utils/app-settings.util';

export function getCatalog(): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/observations/catalog`, {
    method: 'get',
    headers: { accept: 'application/json' },
    withCredentials: true,
  });
}

export function getAuditCatalog(options: any): Promise<any> {
  const searchParams = new URLSearchParams({
    ...options,
  });
  const params = searchParams.toString() ? `?${searchParams}` : '';
  return axiosApi(`${getAppSettings().baseUrl}/audits/catalog${params}`, {
    method: 'get',
    headers: { accept: 'application/json' },
    withCredentials: true,
  });
}
