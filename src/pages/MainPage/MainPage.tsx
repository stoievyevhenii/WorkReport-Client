import {
  SelectTabData,
  SelectTabEvent,
  TabValue,
} from '@fluentui/react-components';
import {
  MoneyFilled,
  MoneyRegular,
  PeopleQueueFilled,
  PeopleQueueRegular,
  PersonFilled,
  PersonRegular,
  ToolboxFilled,
  ToolboxRegular,
  VehicleCarProfileLtrFilled,
  VehicleCarProfileLtrRegular,
  bundleIcon,
} from '@fluentui/react-icons';
import React, { FC, useState } from 'react';

import { AdaptiveLayout, Header, Sidebar } from '../../components/index';
import { TabGroup } from '../../global/index';
import { Customers, Materials, Trips, Users, Workers } from '../index';
import styles from './MainPage.module.scss';

export const MainPage: FC = () => {
  const [selectedValue, setSelectedValue] = useState<TabValue>('trips');
  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value);
  };

  const MoneyIcon = bundleIcon(MoneyFilled, MoneyRegular);
  const WorkersIcon = bundleIcon(PeopleQueueFilled, PeopleQueueRegular);
  const UsersIcon = bundleIcon(PersonFilled, PersonRegular);
  const ToolBoxIcon = bundleIcon(ToolboxFilled, ToolboxRegular);
  const CarIcon = bundleIcon(
    VehicleCarProfileLtrFilled,
    VehicleCarProfileLtrRegular
  );

  const configGroup: TabGroup = {
    name: 'Конфигурации',
    items: [
      { text: 'Заказчики', value: 'customers', icon: <MoneyIcon /> },
      { text: 'Работники', value: 'workers', icon: <WorkersIcon /> },
      { text: 'Пользователи', value: 'users', icon: <UsersIcon /> },
    ],
  };

  const reportsGroup: TabGroup = {
    name: 'Отчёты',
    items: [
      { text: 'Поездки', value: 'trips', icon: <CarIcon /> },
      { text: 'Материалы', value: 'materials', icon: <ToolBoxIcon /> },
    ],
  };

  return (
    <>
      <Header />
      <Sidebar
        group={[reportsGroup, configGroup]}
        selectedValue={selectedValue}
        onTabSelect={onTabSelect}
      />

      <AdaptiveLayout
        defaultView={
          <div className={`${styles.content} ${styles.default}`}>
            {selectedValue === 'customers' && <Customers />}
            {selectedValue === 'materials' && <Materials />}
            {selectedValue === 'trips' && <Trips />}
            {selectedValue === 'users' && <Users />}
            {selectedValue === 'workers' && <Workers />}
          </div>
        }
        mobileView={
          <div className={`${styles.content} ${styles.mobile_content}`}>
            {selectedValue === 'customers' && <Customers />}
            {selectedValue === 'materials' && <Materials />}
            {selectedValue === 'trips' && <Trips />}
            {selectedValue === 'users' && <Users />}
            {selectedValue === 'workers' && <Workers />}
          </div>
        }
      />
    </>
  );
};
