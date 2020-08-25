import { axiosApi } from 'src/redux-utils/axios.helper';
import { getAppSettings } from 'src/shared/utils/app-settings.util';
import { ResultsReportCYTG } from '../state/results-report-cytg.reducer';

const PREFIX = 'obs_ires_cytg';

export function getResultReportsCYTG(options: any): Promise<any> {
  const ENDPOINT = `${getAppSettings().baseUrl}/${PREFIX}`;
  const searchParams = new URLSearchParams({
    ...options,
    limit: Number.MAX_SAFE_INTEGER,
  });
  return axiosApi(
    `${ENDPOINT}/?${searchParams}`,
    {
      method: 'get',
      headers: { accept: 'application/json' },
      withCredentials: true,
    },
    false
  );
}

export function createResultsReportCYTG(
  fields: ResultsReportCYTG
): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/${PREFIX}`, {
    method: 'post',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
    withCredentials: true,
  });
}

export function readResultsReportCYTG(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/${PREFIX}/${id}`, {
    method: 'get',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
}

export function updateResultsReportCYTG(
  id: number | string,
  fields: ResultsReportCYTG
): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/${PREFIX}/${id}`, {
    method: 'put',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: fields,
    withCredentials: true,
  });
}

export function deletResultsReportCYTG(id: number | string): Promise<any> {
  return axiosApi(`${getAppSettings().baseUrl}/${PREFIX}/${id}`, {
    method: 'delete',
    withCredentials: true,
  });
}
