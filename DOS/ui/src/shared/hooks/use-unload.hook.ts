import { useRef, useEffect } from 'react';

export const useUnload = (fn: Function) => {
  const cb = useRef(fn);
  cb.current = fn;
  useEffect(() => {
    const onUnload = (e: any) => cb.current(e);
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  });
}

/* 
Usage:

useUnload((e: any) => {
  e.preventDefault();
  const confirmMsg = '';
  e.returnValue = confirmMsg;
  return confirmMsg;
});
*/
