import React, { FC, ReactElement } from 'react';
import styles from './CardWrapper.module.scss';

interface ICardWrapper {
  children: ReactElement[];
}

export const CardWrapper: FC<ICardWrapper> = ({ children }) => {
  return <div className={styles.card_block}>{children}</div>;
};
