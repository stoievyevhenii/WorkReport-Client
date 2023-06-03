import React from 'react';
import styles from './App.module.scss';

import { useTokenIsValid } from './hooks/useTokenIsValid';
import { Login, MainPage } from './pages/index';

function App() {
  const tokenIsValid = useTokenIsValid();

  return (
    <div className={styles.wrapper}>
      {localStorage.getItem('role') ? <MainPage /> : <Login />}
    </div>
  );
}

export default App;
