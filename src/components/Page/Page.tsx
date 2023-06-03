import { Title1 } from '@fluentui/react-components';
import React, { FC, ReactElement } from 'react';
import styles from './Page.module.scss';

interface IPage {
  content: ReactElement;
  filter?: ReactElement;
  hideBackgound?: boolean;
  title?: string;
}

export const Page: FC<IPage> = ({ title, content, filter, hideBackgound }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Title1>{title}</Title1>
      </div>
      {filter && <div className={`${styles.filter}`}>{filter}</div>}
      <div className={!hideBackgound ? styles.content : ''}>{content}</div>
    </div>
  );
};
