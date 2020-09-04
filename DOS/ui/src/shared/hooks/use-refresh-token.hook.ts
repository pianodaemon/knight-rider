import { useEffect, useRef } from 'react';
import { TokenStorage } from '../utils/token-storage.util';
import { REFRESH_THRESHOLD_MS, REFRESH_TIMEOUT_MS } from '../constants/time.constants';

type RefreshOrLogout = (isAuthenticated: boolean, canRefresh: boolean) => any

/**
 * This hook aims to help run Actions (Redux) either on Refresh Token or Logout (revoke) workflows
 *
 * @param RefreshOrLogout
 */
export const useRefreshToken = (fn: RefreshOrLogout, dependencyList?: any[]): void => {
  const dl: any[] = dependencyList || [];
  const cb = useRef(fn);
  cb.current = fn;
  const isAuthenticated: boolean = TokenStorage.isAuthenticated();
  const expirationTime: number = (Number(isAuthenticated ? TokenStorage.getTokenClaims()?.exp || 0 : 0) * 1000) - new Date().getTime();
  const canRefresh: boolean = expirationTime <= REFRESH_THRESHOLD_MS && expirationTime > REFRESH_TIMEOUT_MS;
  useEffect(() => {
    const [refreshing] = dl || [];
    if (!refreshing) {
      const asyncFn = () => cb.current(canRefresh, isAuthenticated);
      const timerId = window.setTimeout(asyncFn, expirationTime);
      return () => window.clearTimeout(timerId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dl.length ? dl : undefined);
}
