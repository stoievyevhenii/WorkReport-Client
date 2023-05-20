import { FC } from 'react';
import styles from "./EmptyState.module.scss";

interface IEmptyState { }

export const EmptyState: FC<IEmptyState> = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.title}>
                <p>Нет данных для отображения</p>
            </div>
        </div>
    )
}
