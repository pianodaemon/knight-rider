// /* eslint-disable prettier/prettier */
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import { createRootReducer } from './reducers';
import { initMergeSaga } from './redux-utils/merge-saga';
import { initMergeSliceReducer } from './redux-utils/merge-slice-reducer';

export function configureStore(initialState: any, history: any) {
    const sagaMiddleware = createSagaMiddleware();
    const middlewares: Array<any> = [routerMiddleware(history), sagaMiddleware];

    const enhancers = [applyMiddleware(...middlewares)];


    const composeEnhancers =
        process.env.NODE_ENV !== 'production' &&
            typeof window === 'object' &&
            (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
            ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true })
            : compose;

    const store: any = createStore(
        createRootReducer([]),
        initialState,
        composeEnhancers(...enhancers),
    );

    // Extensions
    store.asyncReducers = {};
    store.sagaMiddleware = sagaMiddleware;

    // Make reducers hot reloadable see http://mxs.is/googmo
    if (module.hot) {
        module.hot.accept('./reducers', () => {
            import('./reducers').then((reducerModule) => {
                const newCreateRootReducer = reducerModule.createRootReducer;
                const newRootReducer = newCreateRootReducer(store.asyncReducers);

                store.replaceReducer(newRootReducer);
            });
        });
    }

    initMergeSaga(sagaMiddleware);
    initMergeSliceReducer(store, createRootReducer);

    return store;
}
