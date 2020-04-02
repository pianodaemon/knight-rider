import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { createMuiTheme, Theme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core';
import App from './App';
import { configureStore } from './store';
import * as serviceWorker from './serviceWorker';

const initialState: any = {};
const store: any = configureStore(initialState, {});
const theme: Theme = createMuiTheme();

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
