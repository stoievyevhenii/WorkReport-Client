import React, { FC } from 'react';
import styles from './EmptyState.module.scss';

export const EmptyState: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <p>Нет данных для отображения</p>
      </div>
    </div>
  );
};
