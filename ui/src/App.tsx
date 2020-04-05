import React from 'react';
import { SnackbarContainer } from './area/main/views/snackbar-notifier.container';
import { AppBarComponent } from './area/main/views/appbar.component';

function App() {
  return (
    <div className="App">
      <AppBarComponent />
      <SnackbarContainer />
    </div>
  );
}

export default App;
