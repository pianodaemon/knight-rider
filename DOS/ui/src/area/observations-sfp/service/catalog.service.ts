import { axiosApi } from 'src/redux-utils/axios.helper';
import { getAppSettings } from 'src/shared/utils/app-settings.util';

export function getCatalog(options: any): Promise<any> {
  const searchParams = new URLSearchParams({
    ...options,
  });
  const params = searchParams.toString() ? `?${searchParams}` : '';
  return axiosApi(`${getAppSettings().baseUrl}/obs_sfp/catalog${params}`, {
    method: 'get',
    headers: { accept: 'application/json' },
    withCredentials: true,
  });
}

export function getAuditCatalog(): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/audits/catalog`, {
    method: 'get',
    headers: { accept: 'application/json' },
    withCredentials: true,
  });
}
