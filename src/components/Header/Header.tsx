import React, { FC } from 'react';
import styles from './Header.module.scss';
import { RenderProfileContent } from './RenderProfileContent/RenderProfileContent';

export const Header: FC = () => {
  return (
    <div className={styles.header}>
      <RenderProfileContent />
    </div>
  );
};
