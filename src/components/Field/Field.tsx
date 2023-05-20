import React, { FC } from 'react';
import styles from "./Field.module.scss";

interface IField {
    label?: string;
    input?: any;
}

export const Field: FC<IField> = ({ label, input }) => {
    return (
        <div className={styles.field}>
            <div className={styles.label}>{label}</div>
            <div className={styles.field}>{input}</div>
        </div>
    )
}
