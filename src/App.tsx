import React from 'react';
import styles from "./App.module.scss";

import { Login, MainPage } from "./pages/index";

function App() {
  return (
    <div className={styles.wrapper}>
      {/* <MainPage />
      <Login /> */}

      {sessionStorage.getItem("role")
        ?
        <MainPage />
        :
        <Login />
      }

    </div>
  );
}

export default App;
