import { axiosApi } from 'src/redux-utils/axios.helper';
import { getAppSettings } from 'src/shared/utils/app-settings.util';

export function getCatalog(): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/obs_sfp/catalog`, {
    method: 'get',
    headers: { accept: 'application/json' },
  });
}

export function getAuditCatalog(): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/audits/catalog`, {
    method: 'get',
    headers: { accept: 'application/json' },
  });
}
