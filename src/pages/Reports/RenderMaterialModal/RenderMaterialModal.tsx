import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Input,
  Select,
} from '@fluentui/react-components';
import { Dismiss24Regular } from '@fluentui/react-icons';
import React, { FC, useState } from 'react';
import { Field } from '../../../components';
import styles from './RenderMaterialModal.module.scss';

interface IRenderTripModal {
  isOpen: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOpenChange: (event: any, data: any) => void;
}

interface ISelectMode {
  key: number;
  label: string;
}

export const RenderMaterialModal: FC<IRenderTripModal> = ({
  isOpen,
  onOpenChange,
}) => {
  const [reportByMonth, setReportByMonth] = useState(true);
  const modesArray: ISelectMode[] = [
    {
      key: 1,
      label: 'Отчёт за месяц',
    },
    {
      key: 2,
      label: 'Отчёт за отрезок времени',
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle
            action={
              <DialogTrigger action="close">
                <Button
                  appearance="subtle"
                  aria-label="close"
                  icon={<Dismiss24Regular />}
                />
              </DialogTrigger>
            }
          >
            Сформировать отчёт
          </DialogTitle>
          <DialogContent className={styles.dialog_content}>
            <Field
              label="Формат отчёта"
              input={
                <Select
                  onChange={(e) => {
                    Number(e.target.value) === 1
                      ? setReportByMonth(true)
                      : setReportByMonth(false);
                  }}
                  style={{ width: '100%' }}
                >
                  {modesArray.map((item, index) => {
                    return (
                      <option key={index} value={item.key}>
                        {item.label}
                      </option>
                    );
                  })}
                </Select>
              }
            />
            {!reportByMonth && (
              <>
                <Field
                  label="Начиная с"
                  input={
                    <Input
                      type="date"
                      style={{ width: '100%' }}
                      onChange={(e) => console.log(e.target.value)}
                    />
                  }
                />
                <Field
                  label="Заканчивая"
                  input={
                    <Input
                      type="date"
                      style={{ width: '100%' }}
                      onChange={(e) => console.log(e.target.value)}
                    />
                  }
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button appearance="primary">Сформировать</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
