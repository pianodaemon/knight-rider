import { useRef, useEffect } from 'react';
import { TokenStorage } from '../utils/token-storage.util';

export const useRefreshToken = (fn: Function) => {
  const cb = useRef(fn);
  cb.current = fn;

  if (TokenStorage.isAuthenticated()) {
    const { exp } = TokenStorage.getTokenClaims();
  }
  
  useEffect(() => {
    const onUnload = (e: any) => cb.current(e);
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  });
}
