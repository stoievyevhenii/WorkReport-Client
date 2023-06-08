import { Button } from '@fluentui/react-components';
import React, { FC } from 'react';
import styles from './Header.module.scss';

function LogOut() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  window.location.reload();
}

export const Header: FC = () => {
  return (
    <div className={styles.header}>
      <Button onClick={() => LogOut()}>Выйти</Button>
    </div>
  );
};
