import React, { FC } from 'react';
import styles from './Header.module.scss';
import RenderAppIdentic from './RenderAppIdentic/RenderAppIdentic';
import { RenderProfileContent } from './RenderProfileContent/RenderProfileContent';

export const Header: FC = () => {
  return (
    <div className={styles.header}>
      <RenderAppIdentic />
      <RenderProfileContent />
    </div>
  );
};
