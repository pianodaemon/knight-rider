import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { createMuiTheme, Theme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core';
import App from './App';
import { configureStore } from './store';
import * as serviceWorker from './serviceWorker';
import { setAppSettings } from './shared/utils/app-settings.util';

const initialState: any = {};
const store: any = configureStore(initialState, {});
const theme: Theme = createMuiTheme();
const appSettings = {
  auth:
    process.env.NODE_ENV === 'production'
      ? `${process.env.REACT_APP_HOST_API}`
      : 'http://localhost:10090/v1/sso/token-auth', // @todo this should be fetch from docker image container env vars
  baseUrl:
    process.env.NODE_ENV === 'production'
      ? `${process.env.REACT_APP_HOST_API}`
      : 'http://localhost:8080/api/v1', // @todo this should be fetch from docker image container env vars
};

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-console
  console.log(process.env);
}

setAppSettings(Object.freeze(appSettings));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
