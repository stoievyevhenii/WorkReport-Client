import { Subtitle2 } from '@fluentui/react-components';
import React, { FC } from 'react';
import styles from './Subtitle.module.scss';

interface ISubtitle {
  text: string;
  showLine?: boolean;
}

export const Subtitle: FC<ISubtitle> = ({ text, showLine }) => {
  return (
    <div className={styles.wrapper}>
      <Subtitle2>{text}</Subtitle2>

      {showLine && <div className={styles.line} />}
    </div>
  );
};
