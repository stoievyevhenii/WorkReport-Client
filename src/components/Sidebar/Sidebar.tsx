import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  SelectTabData,
  SelectTabEvent,
  Subtitle2,
  Tab,
  TabList,
  TabValue,
} from '@fluentui/react-components';
import { NavigationRegular } from '@fluentui/react-icons';
import React, { FC, useState } from 'react';
import { AdaptiveLayout } from '../../components/index';
import { TabGroup } from '../../global/TabGroup/TabGroup';
import { TabItem } from '../../global/TabItem/TabItem';
import styles from './Sidebar.module.scss';

interface ISidebar {
  group: TabGroup[];
  selectedValue: TabValue;
  onTabSelect: (event: SelectTabEvent, data: SelectTabData) => void;
}

export const Sidebar: FC<ISidebar> = ({
  group,
  selectedValue,
  onTabSelect,
}) => {
  const [open, setOpen] = useState(false);

  function RenderContent(content: ISidebar) {
    return (
      <TabList
        defaultSelectedValue={content.group[0].items[0].value}
        vertical
        selectedValue={content.selectedValue}
        onTabSelect={content.onTabSelect}
      >
        {content.group.map(({ name, items }: TabGroup) => (
          <>
            <Subtitle2 className={styles.group}>{name}</Subtitle2>
            {items.map(({ text, value, icon }: TabItem, index) => {
              return (
                <Tab
                  key={index}
                  id={value}
                  icon={icon}
                  value={value}
                  onClick={() => setOpen(false)}
                >
                  {text}
                </Tab>
              );
            })}
          </>
        ))}
      </TabList>
    );
  }

  return (
    <>
      <AdaptiveLayout
        defaultView={
          <div className={`${styles.sidebar} ${styles.desktop}`}>
            <div className={styles.root}>
              {RenderContent({ group, selectedValue, onTabSelect })}
            </div>
          </div>
        }
        mobileView={
          <div className={`${styles.sidebar} ${styles.mobile}`}>
            <div className={styles.root}>
              <Dialog
                open={open}
                onOpenChange={(event, data) => setOpen(data.open)}
              >
                <DialogTrigger disableButtonEnhancement>
                  <Button icon={<NavigationRegular />} />
                </DialogTrigger>
                <DialogSurface>
                  <DialogBody>
                    <DialogTitle>Навигация</DialogTitle>
                    <DialogContent>
                      {RenderContent({ group, selectedValue, onTabSelect })}
                    </DialogContent>
                  </DialogBody>
                </DialogSurface>
              </Dialog>
            </div>
          </div>
        }
      />
    </>
  );
};
