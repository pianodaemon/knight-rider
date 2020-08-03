import { axiosApi } from 'src/redux-utils/axios.helper';
import { getAppSettings } from 'src/shared/utils/app-settings.util';

type Credentials = {
  username: string,
  password: string,
};

export function login(credentials: Credentials): Promise<any> {
  const ENDPOINT = `${getAppSettings().auth}/`;
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

// @todo refreshToken - get new token
// @todo logout - revoke Token