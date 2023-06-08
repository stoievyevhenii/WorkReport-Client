import {
  Button,
  Card,
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
import { ReportRequest } from '../../../global';
import { getMaterialsReport } from '../../../store/api';
import styles from './RenderMaterialsModal.module.scss';

interface IRenderMaterialsModal {
  isOpen: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOpenChange: (event: any, data: any) => void;
}

interface ISelectMode {
  key: number;
  label: string;
}

export const RenderMaterialsModal: FC<IRenderMaterialsModal> = ({
  isOpen,
  onOpenChange,
}) => {
  const date = new Date();
  const [reportByMonth, setReportByMonth] = useState(true);
  const [reportRequest, setReportRequest] = useState<ReportRequest>({
    StartDate: new Date(date.setMonth(date.getMonth() - 1)).toJSON(),
    EndDate: new Date().toJSON(),
    reportType: 0,
  });

  const modesArray: ISelectMode[] = [
    {
      key: 1,
      label: 'Отчёт за месяц',
    },
    {
      key: 2,
      label: 'Выбрать даты',
    },
  ];

  const groupBy: ISelectMode[] = [
    {
      key: 0,
      label: 'Общее к-во времени',
    },
    {
      key: 1,
      label: 'Расход по заказчикам',
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
            <Card appearance="outline">
              <Field
                label="Группировать"
                input={
                  <Select
                    onChange={(e) =>
                      setReportRequest({
                        ...reportRequest,
                        reportType: Number(e.target.value),
                      })
                    }
                    style={{ width: '100%' }}
                  >
                    {groupBy.map((item, index) => {
                      return (
                        <option key={index} value={item.key}>
                          {item.label}
                        </option>
                      );
                    })}
                  </Select>
                }
              />
              <Field
                label="Формат"
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
                        onChange={(e) =>
                          setReportRequest({
                            ...reportRequest,
                            StartDate: e.target.value,
                          })
                        }
                      />
                    }
                  />
                  <Field
                    label="Заканчивая"
                    input={
                      <Input
                        type="date"
                        style={{ width: '100%' }}
                        onChange={(e) =>
                          setReportRequest({
                            ...reportRequest,
                            EndDate: e.target.value,
                          })
                        }
                      />
                    }
                  />
                </>
              )}
            </Card>
          </DialogContent>
          <DialogActions fluid>
            <Button
              appearance="primary"
              onClick={() => getMaterialsReport(reportRequest)}
            >
              Сформировать
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
