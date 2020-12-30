import { axiosApi } from 'src/redux-utils/axios.helper';
import { getAppSettings } from 'src/shared/utils/app-settings.util';
import { SocialProgram } from '../state/social-programs.reducer';

export function getSocialPrograms(options: any): Promise<any> {
  const searchParams = new URLSearchParams({
    ...options,
    limit: Number.MAX_SAFE_INTEGER,
  });
  return axiosApi(
    `${getAppSettings().baseUrl}/programas_soc/?${searchParams}`,
    {
      method: 'get',
      headers: { accept: 'application/json' },
      withCredentials: true,
    },
    false,
  );
}

export function removeSocialProgram(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/programas_soc/${id}`, {
    method: 'delete',
    withCredentials: true,
  });
}

export function createSocialProgram(fields: SocialProgram): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/programas_soc/`, {
    method: 'post',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
    withCredentials: true,
  });
}

export function readSocialProgram(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/programas_soc/${id}`, {
    method: 'get',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
}

export function updateSocialProgram(id: number | string, fields: SocialProgram): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/programas_soc/${id}`, {
    method: 'put',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
    withCredentials: true,
  });
}
