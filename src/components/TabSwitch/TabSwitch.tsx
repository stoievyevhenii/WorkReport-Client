import React, { FC, useState } from 'react';
import Store from '../../store/globalData/GlobalStore';
import styles from './TabSwitch.module.scss';

export const TabSwitch: FC = () => {
  const [selectedDay, setSelectedDay] = useState('Добавить');
  const days: string[] = ['Добавить', 'Отнять'];

  return (
    <div className={styles.wrapper}>
      {days.map((item) => (
        <button
          onClick={() => {
            setSelectedDay(item);
            Store.update_adjus_sum_state(item === 'Добавить' ? true : false);
          }}
          key={item}
          className={`
                        ${styles.day}
                        ${selectedDay === item ? styles.selected : ''}
                        ${
                          selectedDay === 'Добавить'
                            ? styles.left
                            : styles.right
                        }
                        `}
        >
          {item}
        </button>
      ))}
    </div>
  );
};
