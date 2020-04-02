/* eslint-disable @typescript-eslint/no-use-before-define */
// /* eslint-disable prettier/prettier */
/* eslint-disable */
let sagaMiddlewareInstance: any = void 0;
const sagaToMerge: any = [];

function merge() {
  if (!sagaMiddlewareInstance) {
    return;
  }

  if (sagaToMerge.length) {
    sagaToMerge.forEach((saga: any) => {
      sagaMiddlewareInstance.run(saga);
    });
    sagaToMerge.length = 0;
  }
}

export function initMergeSaga(sagaMiddleware: any) {
  sagaMiddlewareInstance = sagaMiddleware;
  merge();
}

export function mergeSaga(saga: any) {
  if (saga) {
    sagaToMerge.push(saga);
    merge();
  }
}

export const testPort = {
  sagaToMerge,
};
