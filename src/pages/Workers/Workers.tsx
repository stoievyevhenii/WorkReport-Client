import {
  Avatar,
  Badge,
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
  Spinner,
  Switch,
  TableCellActions,
  TableCellLayout,
  TableColumnDefinition,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  createTableColumn,
} from '@fluentui/react-components';
import {
  AddRegular,
  ArrowClockwiseRegular,
  DismissRegular,
  EditRegular,
  LockClosedRegular,
  LockOpenRegular,
} from '@fluentui/react-icons';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import {
  CardWrapper,
  DataTable,
  EmptyState,
  Field,
  MobileCard,
  Page,
} from '../../components/index';
import { Worker } from '../../global/index';
import useIsMobile from '../../hooks/useIsMobile';
import {
  blockWorker,
  editWorker,
  getWorkers,
  getWorkersById,
  postWorker,
  unblockWorker,
} from '../../store/api/index';
import styles from './Workers.module.scss';

export const Workers: FC = () => {
  const workerDataInit = {
    id: 0,
    name: '',
    lastName: '',
    isActive: true,
  };

  const [editState, setEditState] = useState(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const [workerData, setWorkerData] = useState<Worker>(workerDataInit);
  const [workersList, setWorkersList] = useState<Worker[]>([
    {
      id: 0,
      name: '',
      lastName: '',
      isActive: true,
    },
  ]);

  const _fetchData = async () => {
    setLoading(true);
    await getWorkers()
      .then((data) => {
        setWorkersList(data);
      })
      .finally(() => setLoading(false));
  };

  const _addNewWorker = async () => {
    await postWorker(workerData.name, workerData.lastName);
    setOpen(false);
    await _fetchData();
  };

  const _parseSelectedWorker = async (id: number) => {
    await getWorkersById(id).then((data) => {
      setWorkerData({
        id: data[0].id,
        name: data[0].name,
        lastName: data[0].lastName,
        isActive: data[0].isActive,
      });
    });
  };

  const _editExistingWorker = async () => {
    await editWorker(workerData);
    setOpen(false);
    await _fetchData();
  };

  const _initEditObject = async (id: number) => {
    _parseSelectedWorker(id);
    setOpen(true);
    setEditState(true);
  };

  function _analyzeStatus(status: boolean): ReactElement {
    return (
      <Badge
        appearance="tint"
        shape="rounded"
        color={status === true ? 'success' : 'danger'}
      >
        {status === true ? 'Активен' : 'Заблокирован'}
      </Badge>
    );
  }

  const _blockWorker = async (id: number) => {
    await blockWorker(id);
    await _fetchData();
  };

  const _unblockWorker = async (id: number) => {
    await unblockWorker(id);
    await _fetchData();
  };

  const _recordActions = (item: Worker): ReactElement => {
    return (
      <>
        <Button
          icon={<EditRegular />}
          onClick={() => _initEditObject(item.id)}
        />
        {item.isActive === true ? (
          <Button
            icon={<LockClosedRegular />}
            onClick={() => _blockWorker(item.id)}
          />
        ) : (
          <Button
            icon={<LockOpenRegular />}
            onClick={() => _unblockWorker(item.id)}
          />
        )}
      </>
    );
  };

  const columns: TableColumnDefinition<Worker>[] = [
    createTableColumn<Worker>({
      columnId: 'status',
      compare: (a, b) => {
        return String(a.isActive).localeCompare(String(b.isActive));
      },
      renderHeaderCell: () => {
        return 'Статус';
      },
      renderCell: (item) => {
        return _analyzeStatus(item.isActive);
      },
    }),
    createTableColumn<Worker>({
      columnId: 'login',
      renderHeaderCell: () => {
        return 'Имя';
      },
      renderCell: (item) => {
        return (
          <TableCellLayout media={<Avatar color="colorful" name={item.name} />}>
            {item.name}
          </TableCellLayout>
        );
      },
    }),
    createTableColumn<Worker>({
      columnId: 'lastName',
      renderHeaderCell: () => {
        return 'Фамилия';
      },
      renderCell: (item) => {
        return item.lastName;
      },
    }),
    createTableColumn<Worker>({
      columnId: 'actions',
      renderHeaderCell: () => {
        return '';
      },
      renderCell: (item) => {
        return <TableCellActions>{_recordActions(item)}</TableCellActions>;
      },
    }),
  ];

  useEffect(() => {
    const getData = async () => {
      await _fetchData();
    };

    getData();
  }, []);

  const _mobileDataPresent = (
    <CardWrapper>
      {workersList.map((item, index) => (
        <MobileCard
          key={index}
          header={`${item.name} ${item.lastName}`}
          headerActions={_analyzeStatus(item.isActive)}
          actions={_recordActions(item)}
        />
      ))}
    </CardWrapper>
  );

  const _desktopDataPresent = (
    <DataTable columns={columns} items={workersList} />
  );

  function renderBody() {
    return isMobile ? _mobileDataPresent : _desktopDataPresent;
  }

  return (
    <Page
      title="Работники"
      content={
        <>
          {isLoading ? (
            <Spinner label="Обновление данных..." />
          ) : (
            <>{workersList.length > 0 ? renderBody() : <EmptyState />}</>
          )}
          <Dialog
            open={open}
            onOpenChange={(event, data) => setOpen(data.open)}
          >
            <DialogSurface>
              <DialogBody>
                <DialogTitle
                  action={
                    <DialogTrigger action="close">
                      <Button
                        appearance="subtle"
                        aria-label="close"
                        icon={<DismissRegular />}
                      />
                    </DialogTrigger>
                  }
                >
                  {editState ? 'Редактировать' : 'Добавить'}
                </DialogTitle>
                <DialogContent>
                  <Card appearance="outline">
                    <Field
                      label="Имя"
                      input={
                        <Input
                          value={workerData.name}
                          placeholder="..."
                          id="worker-name"
                          style={{ width: '100%' }}
                          onChange={(e) =>
                            setWorkerData({
                              ...workerData,
                              name: e.target.value,
                            })
                          }
                        />
                      }
                    />
                    <Field
                      label="Фамилия"
                      input={
                        <Input
                          value={workerData.lastName}
                          placeholder="..."
                          style={{ width: '100%' }}
                          id="worker-lastName"
                          onChange={(e) =>
                            setWorkerData({
                              ...workerData,
                              lastName: e.target.value,
                            })
                          }
                        />
                      }
                    />
                    {editState && (
                      <Field
                        label="Активен"
                        input={
                          <Switch
                            checked={workerData.isActive}
                            onChange={(e) =>
                              setWorkerData({
                                ...workerData,
                                isActive: e.currentTarget.checked,
                              })
                            }
                          />
                        }
                      />
                    )}
                  </Card>
                </DialogContent>
                <DialogActions fluid>
                  {editState ? (
                    <Button
                      appearance="primary"
                      onClick={() => _editExistingWorker()}
                    >
                      Редактировать
                    </Button>
                  ) : (
                    <Button
                      appearance="primary"
                      onClick={() => _addNewWorker()}
                    >
                      Добавить
                    </Button>
                  )}
                </DialogActions>
              </DialogBody>
            </DialogSurface>
          </Dialog>
        </>
      }
      filter={
        <>
          <Toolbar aria-label="Default">
            <ToolbarButton
              aria-label="Add"
              appearance="primary"
              icon={<AddRegular />}
              onClick={() => {
                setOpen(true);
                setEditState(false);
                setWorkerData(workerDataInit);
              }}
            >
              Добавить
            </ToolbarButton>
            <ToolbarDivider />
            <ToolbarButton
              aria-label="Refresh"
              icon={<ArrowClockwiseRegular />}
              onClick={() => {
                _fetchData();
              }}
            />
          </Toolbar>
        </>
      }
    />
  );
};
