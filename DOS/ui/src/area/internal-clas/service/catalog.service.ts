import { axiosApi } from 'src/redux-utils/axios.helper';
import { getAppSettings } from 'src/shared/utils/app-settings.util';

export function getInternalClasCatalog(options: any): Promise<any> {
  const searchParams = new URLSearchParams({
    ...options,
  });
  const params = searchParams.toString() ? `?${searchParams}` : '';
  return axiosApi(`${getAppSettings().baseUrl}/clasifs_internas/catalog${params}`, {
    method: 'get',
    headers: { accept: 'application/json' },
    withCredentials: true,
  });
}
