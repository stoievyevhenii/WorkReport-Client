import React, { FC, ReactElement } from 'react';
import useIsMobile from '../../hooks/useIsMobile';
import styles from './Field.module.scss';

interface IField {
  label?: string;
  input?: ReactElement;
  vertical?: boolean;
}

export const Field: FC<IField> = ({ label, input, vertical }) => {
  const isMobile = useIsMobile();

  return (
    <div
      className={`
        ${vertical ? styles.field_mobile : styles.field}
        ${isMobile ? styles.field_mobile : styles.field}
      `}
    >
      <div className={styles.label}>{label}</div>
      <div className={styles.field}>{input}</div>
    </div>
  );
};
