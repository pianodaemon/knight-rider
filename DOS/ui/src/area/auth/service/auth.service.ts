import { axiosApi } from 'src/redux-utils/axios.helper';
import { getAppSettings } from 'src/shared/utils/app-settings.util';

type Credentials = {
  username: string,
  password: string,
};

export function login(credentials: Credentials): Promise<any> {
  const ENDPOINT = `${getAppSettings().authUrl}/sso/token-auth`;
  return axiosApi(
    ENDPOINT,
    {
      method: 'post',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: credentials,
    },
    false
  );
}

export function logout(): Promise<any> {
  const ENDPOINT = `${getAppSettings().authUrl}/sso/logout`;
  return axiosApi(
    ENDPOINT,
    {
      method: 'get',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    },
    false
  );
}

export function refreshToken(userID: string): Promise<any> {
  const ENDPOINT = `${getAppSettings().authUrl}/sso/${userID}/refresh-token-auth`;
  return axiosApi(
    ENDPOINT,
    {
      method: 'post',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    },
    false
  );
}
