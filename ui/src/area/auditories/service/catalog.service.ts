import { axiosApi } from 'src/redux-utils/axios.helper';
import { getAppSettings } from 'src/shared/utils/app-settings.util';

export function getCatalog(): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/observations/catalog`, {
    method: 'get',
    headers: { accept: 'application/json' },
  });
}
