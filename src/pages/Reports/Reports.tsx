import {
  Caption1,
  Card,
  CardHeader,
  Subtitle2,
  Text,
} from '@fluentui/react-components';
import {
  OpenRegular,
  PeopleQueueRegular,
  ToolboxRegular,
} from '@fluentui/react-icons';
import React, { FC, ReactElement, useState } from 'react';
import { Page, Subtitle } from '../../components';
import { RenderMaterialsModal } from './RenderMaterialsModal/RenderMaterialsModal';
import { RenderWorkersModal } from './RenderWorkersModal/RenderWorkersModal';
import styles from './Reports.module.scss';

interface IReportCard {
  title: string;
  description: string;
  icon: ReactElement;
  showOpenIcon?: boolean;
  actions: () => void;
}

interface IReportGroup {
  name: string;
  items: IReportCard[];
}

export const Reports: FC = () => {
  const [openWorkersReport, setOpenWorkersReport] = useState(false);
  const [openMaterialsReport, setOpenMaterialsReport] = useState(false);

  const tripReports: IReportCard[] = [
    {
      actions: () => setOpenWorkersReport(true),
      description: 'Сформировать отчёт по работникам',
      icon: <PeopleQueueRegular className={styles.card_icon} />,
      showOpenIcon: true,
      title: 'Работники',
    },
    {
      actions: () => setOpenMaterialsReport(true),
      description: 'Сформировать отчёт по материалам',
      icon: <ToolboxRegular className={styles.card_icon} />,
      showOpenIcon: true,
      title: 'Материалы',
    },
  ];

  const reportsGroups: IReportGroup[] = [
    { name: 'Поездки', items: tripReports },
  ];

  return (
    <Page
      title="Отчёты"
      hideBackgound
      content={
        <>
          {reportsGroups.map((record, index) => (
            <div key={index}>
              <Subtitle text={record.name} showLine />
              <div className={styles.wrapper}>
                {record.items.map((item, index) => (
                  <Card key={index} onClick={item.actions}>
                    <CardHeader
                      header={<Text weight="semibold">{item.title}</Text>}
                      description={<Caption1>{item.description}</Caption1>}
                      image={item.icon}
                      action={item.showOpenIcon ? <OpenRegular /> : <></>}
                    />
                  </Card>
                ))}
              </div>
            </div>
          ))}

          <RenderWorkersModal
            isOpen={openWorkersReport}
            onOpenChange={(event, data) => setOpenWorkersReport(data.open)}
          />
          <RenderMaterialsModal
            isOpen={openMaterialsReport}
            onOpenChange={(event, data) => setOpenMaterialsReport(data.open)}
          />
        </>
      }
    />
  );
};