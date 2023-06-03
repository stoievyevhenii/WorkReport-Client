import { Caption1, Card, CardHeader, Text } from '@fluentui/react-components';
import {
  OpenRegular,
  ToolboxRegular,
  VehicleCarProfileLtrRegular,
} from '@fluentui/react-icons';
import React, { FC, ReactElement, useState } from 'react';
import { Page } from '../../components';
import { RenderMaterialModal } from './RenderMaterialModal/RenderMaterialModal';
import { RenderTripModal } from './RenderTripModal/RenderTripModal';
import styles from './Reports.module.scss';

interface IReportCard {
  title: string;
  description: string;
  icon: ReactElement;
  showOpenIcon?: boolean;
  actions: () => void;
}

export const Reports: FC = () => {
  const [openTrip, setOpenTrip] = useState(false);
  const [openMaterial, setOpenMaterial] = useState(false);

  const reports: IReportCard[] = [
    {
      actions: () => setOpenTrip(true),
      description:
        'Сформировать отчёт с группоровкой по работникам и заказчикам',
      icon: <VehicleCarProfileLtrRegular className={styles.card_icon} />,
      showOpenIcon: true,
      title: 'Поездки',
    },
    {
      actions: () => setOpenMaterial(true),
      description:
        'Сформировать отчёт по использованым материалам за выбранный отрезок времени',
      icon: <ToolboxRegular className={styles.card_icon} />,
      showOpenIcon: true,
      title: 'Материалы',
    },
  ];

  return (
    <Page
      title="Отчёты"
      hideBackgound
      content={
        <>
          <div className={styles.wrapper}>
            {reports.map((record, index) => (
              <Card key={index} onClick={record.actions}>
                <CardHeader
                  header={<Text weight="semibold">{record.title}</Text>}
                  description={<Caption1>{record.description}</Caption1>}
                  image={record.icon}
                  action={record.showOpenIcon ? <OpenRegular /> : <></>}
                />
              </Card>
            ))}
          </div>

          <RenderTripModal
            isOpen={openTrip}
            onOpenChange={(event, data) => setOpenTrip(data.open)}
          />
          <RenderMaterialModal
            isOpen={openMaterial}
            onOpenChange={(event, data) => setOpenMaterial(data.open)}
          />
        </>
      }
    />
  );
};
