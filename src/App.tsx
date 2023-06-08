import React from 'react';
import styles from './App.module.scss';

import { observer } from 'mobx-react';
import { useTokenIsValid } from './hooks/useTokenIsValid';
import { Login, MainPage } from './pages/index';

export const App = observer(() => {
  const _ = useTokenIsValid();

  return (
    <div className={styles.wrapper}>
      {localStorage.getItem('role') ? <MainPage /> : <Login />}
    </div>
  );
});

export default App;
