import React from 'react';
import { SnackbarContainer } from './area/main/views/snackbar-notifier.container';
import { AppBarContainer } from './area/main/views/appbar.container';

function App() {
  return (
    <div className="App">
      <AppBarContainer />
      <SnackbarContainer />
    </div>
  );
}

export default App;
