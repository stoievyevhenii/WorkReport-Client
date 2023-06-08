import { Title1 } from '@fluentui/react-components';
import React, { FC, ReactElement } from 'react';

import useIsMobile from '../../hooks/useIsMobile';
import styles from './Page.module.scss';

interface IPage {
  content: ReactElement;
  filter?: ReactElement;
  hideBackgound?: boolean;
  title: string;
}

export const Page: FC<IPage> = ({ title, content, filter, hideBackgound }) => {
  const isMobile = useIsMobile();

  return (
    <div className={styles.wrapper}>
      {!isMobile && (
        <div className={styles.header}>
          <Title1>{title}</Title1>
        </div>
      )}
      {filter && <div className={`${styles.filter}`}>{filter}</div>}
      <div className={`${!hideBackgound && !isMobile ? styles.content : ''}`}>
        {content}
      </div>
    </div>
  );
};
