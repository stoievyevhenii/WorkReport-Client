import { Title1 } from '@fluentui/react-components';
import React, { FC, ReactElement } from 'react';
import styles from './Page.module.scss';

interface IPage {
  title?: string;
  content: ReactElement;
  filter?: ReactElement;
}

export const Page: FC<IPage> = ({ title, content, filter }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Title1>{title}</Title1>
      </div>
      {filter && <div className={`${styles.filter}`}>{filter}</div>}
      <div className={styles.content}>{content}</div>
    </div>
  );
};
