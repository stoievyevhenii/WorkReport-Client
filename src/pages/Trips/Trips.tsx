import {
  Avatar,
  Body1,
  Button,
  Caption1,
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
  Spinner,
  TableCellActions,
  TableCellLayout,
  TableColumnDefinition,
  Textarea,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  createTableColumn,
} from '@fluentui/react-components';
import {
  AddRegular,
  ArrowClockwiseRegular,
  DeleteRegular,
  DismissRegular,
  EditRegular,
} from '@fluentui/react-icons';
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';
import {
  CardWrapper,
  DataTable,
  EmptyState,
  Field,
  MobileCard,
  Page,
  TripDetails,
} from '../../components/index';
import {
  Customer,
  Material,
  Trip,
  UsedMaterialRequest,
  Worker,
  WorkersTripRequest,
} from '../../global/index';
import useIsMobile from '../../hooks/useIsMobile';
import {
  deleteTrip,
  getCustomers,
  getMaterials,
  getTrips,
  getWorkers,
  postTrip,
} from '../../store/api/index';

import styles from './Trips.module.scss';

export interface FieldRow {
  key: number;
  recordId?: number;
  count?: number;
}

export const Trips: FC = () => {
  const workersInitialState = [
    {
      id: 0,
      name: '',
      lastName: '',
      isActive: true,
    },
  ];

  const tripsInitialState = [
    {
      id: 0,
      description: '',
      startDate: '',
      dateOfCreation: '',
      endDate: '',
      workersTrip: [
        {
          id: 0,
          worker: {
            id: 5,
            lastName: '',
            name: '',
            isActive: true,
          },
          spentDays: 0,
        },
      ],
      customer: {
        id: 0,
        name: '',
        isActive: true,
      },
      usedMaterials: [
        {
          id: 0,
          usedCount: 0,
          material: {
            id: 0,
            name: '',
            description: '',
            count: 0,
            unit: '',
          },
        },
      ],
    },
  ];

  const customerInitialState = [
    {
      id: 0,
      name: '',
      isActive: true,
    },
  ];

  const materialInitialState = [
    {
      id: 0,
      name: '',
      description: '',
      count: 0,
      unit: '',
    },
  ];

  const [customerId, setCustomerId] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [materialsInTrip, setMaterialsInTrip] = useState<FieldRow[]>([
    { key: 1 },
  ]);
  const [materialsList, setMaterialsList] =
    useState<Material[]>(materialInitialState);
  const [open, setOpen] = useState(false);
  const [selectedEndDate, setSelectedEndDate] = useState<string>('');
  const [selectedRecord, setSelectedRecord] = useState<number>(0);
  const [selectedStartDate, setSelectedStartDate] = useState<string>('');
  const [tripsList, setTripsList] = useState<Trip[]>(tripsInitialState);
  const [workersInTrip, setWorkersInTrip] = useState<FieldRow[]>([{ key: 1 }]);
  const [workersList, setWorkersList] = useState<Worker[]>(workersInitialState);
  const [сustomersList, setCustomersList] =
    useState<Customer[]>(customerInitialState);
  const isMobile = useIsMobile();

  const columns: TableColumnDefinition<Trip>[] = [
    createTableColumn<Trip>({
      columnId: 'customer',
      compare: (a: Trip, b: Trip) => {
        return a.customer.name.localeCompare(b.customer.name);
      },
      renderHeaderCell: () => {
        return 'Заказчик';
      },
      renderCell: (item: Trip) => {
        return (
          <TableCellLayout
            onClick={() => _initEditObject(item.id)}
            media={<Avatar color="colorful" name={item.customer.name} />}
          >
            {item.customer.name}
          </TableCellLayout>
        );
      },
    }),
    createTableColumn<Trip>({
      columnId: 'dateOfCreation',
      compare: (a: Trip, b: Trip) => {
        return a.dateOfCreation.localeCompare(b.dateOfCreation);
      },
      renderHeaderCell: () => {
        return 'Дата добавления';
      },
      renderCell: (item: Trip) => {
        return moment(item.dateOfCreation).format('DD-MM-YYYY');
      },
    }),
    createTableColumn<Trip>({
      columnId: 'startDate',
      compare: (a: Trip, b: Trip) => {
        return a.startDate.localeCompare(b.startDate);
      },
      renderHeaderCell: () => {
        return 'Начало';
      },
      renderCell: (item: Trip) => {
        return moment(item.startDate).format('DD-MM-YYYY');
      },
    }),
    createTableColumn<Trip>({
      columnId: 'endDate',
      compare: (a: Trip, b: Trip) => {
        return a.endDate.localeCompare(b.endDate);
      },
      renderHeaderCell: () => {
        return 'Конец';
      },
      renderCell: (item: Trip) => {
        return moment(item.endDate).format('DD-MM-YYYY');
      },
    }),
    createTableColumn<Trip>({
      columnId: 'description',
      renderHeaderCell: () => {
        return 'Описание работ';
      },
      renderCell: (item: Trip) => {
        return item.description;
      },
    }),
    createTableColumn<Trip>({
      columnId: 'actions',
      renderHeaderCell: () => {
        return '';
      },
      renderCell: (item: Trip) => {
        return (
          <TableCellActions>
            <Button
              icon={<EditRegular />}
              appearance="subtle"
              onClick={() => _initEditObject(item.id)}
            />
            <Button
              icon={<DeleteRegular />}
              appearance="subtle"
              onClick={() => _deleteData(item.id)}
            />
          </TableCellActions>
        );
      },
    }),
  ];

  const _fetchWorkers = async () => {
    await getWorkers().then((data) => {
      setWorkersList(data);
    });
  };

  const _fetchMaterials = async () => {
    await getMaterials().then((data) => {
      setMaterialsList(data);
    });
  };

  const _fetchCustomers = async () => {
    await getCustomers().then((data) => {
      setCustomersList(data);
    });
  };

  const _fetchData = async () => {
    setLoading(true);
    await getTrips()
      .then((data) => {
        setTripsList(data);
      })
      .finally(() => setLoading(false));
  };

  const _deleteData = async (id: number) => {
    await deleteTrip([id]);
    await _fetchData();
  };

  const _addNewTrip = async () => {
    setLoading(true);
    setOpen(false);

    const workersInTripArray: WorkersTripRequest[] = [];
    workersInTrip.map((item) =>
      workersInTripArray.push({
        workerId: item.recordId !== null ? item.recordId : 0,
        spentDays: item.count,
      })
    );

    const usedMaterialsArray: UsedMaterialRequest[] = [];
    materialsInTrip.map((item) =>
      usedMaterialsArray.push({
        materialId: item.recordId,
        usedCount: item.count,
      })
    );

    try {
      await postTrip(
        description,
        customerId,
        selectedStartDate,
        selectedEndDate,
        workersInTripArray,
        usedMaterialsArray
      );
      await _fetchData();
    } finally {
      await _fetchData();
      setLoading(false);
    }
  };

  const _deleteWorkerField = (fieldIndex: number) => {
    const newItems = workersInTrip.filter((item) => item.key !== fieldIndex);
    setWorkersInTrip(newItems);
  };

  const _updateWorkersList = (
    key: number,
    value: number,
    fieldName: string
  ) => {
    const newItems = workersInTrip.map((item) => {
      if (item.key === key) {
        if (fieldName === 'recordId') {
          return { ...item, recordId: value };
        }
        if (fieldName === 'count') {
          return { ...item, count: value };
        }
      }
      return item;
    });

    setWorkersInTrip(newItems);
  };

  const _deleteMaterialField = (fieldIndex: number) => {
    const newItems = materialsInTrip.filter((item) => item.key !== fieldIndex);
    setMaterialsInTrip(newItems);
  };

  const _updateMaterialsList = (
    key: number,
    value: number,
    fieldName: string
  ) => {
    const newItems = materialsInTrip.map((item) => {
      if (item.key === key) {
        if (fieldName === 'recordId') {
          return { ...item, recordId: value };
        }
        if (fieldName === 'count') {
          return { ...item, count: value };
        }
      }
      return item;
    });

    setMaterialsInTrip(newItems);
  };

  const _initEditObject = async (id: number) => {
    setDetailsOpen(true);
    setSelectedRecord(id);
  };

  const _totalInfoBlock = (
    <Card className={styles.card} appearance="outline">
      <Field
        label="Заказчики"
        input={
          <Select
            onChange={(e) => setCustomerId(Number(e.target.value))}
            style={{ width: '100%' }}
          >
            <option value="">Выберите заказчика</option>
            {сustomersList.map((item) => {
              if (item.isActive) {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              }
            })}
          </Select>
        }
      />
      <Field
        label="Дата начала"
        input={
          <Input
            type="date"
            style={{ width: '100%' }}
            onChange={(e) => setSelectedStartDate(e.target.value)}
          />
        }
      />
      <Field
        label="Дата конца"
        input={
          <Input
            type="date"
            style={{ width: '100%' }}
            onChange={(e) => setSelectedEndDate(e.target.value)}
          />
        }
      />
      <Field
        label="Описание"
        input={
          <Textarea
            resize="vertical"
            style={{ width: '100%' }}
            onChange={(e) => setDescription(e.target.value)}
          />
        }
      />
    </Card>
  );

  const _workersBlock = (
    <div className={styles.card_wrapper}>
      {workersInTrip.map((element, index) => (
        <Card appearance="outline" key={index}>
          <div
            className={`${
              isMobile ? styles.item_block_mobile : styles.item_block
            }`}
          >
            <div className={styles.item_value}>
              <Field
                vertical
                label="Имя"
                input={
                  <Select
                    style={{ width: '100%' }}
                    onChange={(event, data) =>
                      _updateWorkersList(
                        element.key,
                        Number(data.value),
                        'recordId'
                      )
                    }
                  >
                    <option value="">Не выбрано</option>
                    {workersList.map((item) => {
                      if (item.isActive) {
                        return (
                          <option
                            key={item.id}
                            value={item.id}
                            selected={element.recordId === item.id}
                          >
                            {item.name} {item.lastName}
                          </option>
                        );
                      }
                    })}
                  </Select>
                }
              />
            </div>
            <div className={styles.item_number_value}>
              <Field
                label="Работал дней"
                vertical
                input={
                  <Input
                    type="number"
                    placeholder="..."
                    style={{ width: '100%' }}
                    value={String(element.count)}
                    onChange={(event, data) =>
                      _updateWorkersList(
                        element.key,
                        Number(data.value),
                        'count'
                      )
                    }
                  />
                }
              />
            </div>
            <div className={styles.item_action}>
              {isMobile ? (
                <Button
                  style={{ width: '100%' }}
                  className={styles.danger_button}
                  icon={<DeleteRegular />}
                  onClick={() => _deleteWorkerField(element.key)}
                >
                  Удалить
                </Button>
              ) : (
                <Button
                  icon={<DeleteRegular />}
                  style={{ width: '100%' }}
                  className={styles.danger_button}
                  onClick={() => _deleteWorkerField(element.key)}
                />
              )}
            </div>
          </div>
        </Card>
      ))}
      <div className={styles.card_wrapper_actions}>
        <Button
          icon={<AddRegular />}
          disabled={
            workersInTrip.length ===
            workersList.filter((item) => item.isActive === true).length
          }
          appearance="primary"
          onClick={() =>
            setWorkersInTrip([
              ...workersInTrip,
              { key: workersInTrip.length + 1 },
            ])
          }
        />
        {workersInTrip.length ===
        workersList.filter((item) => item.isActive === true).length ? (
          <Caption1 style={{ color: '#d13438' }}>
            Выбрано максимально к-во доступных работников
          </Caption1>
        ) : (
          <></>
        )}
      </div>
    </div>
  );

  const _materialsBlock = (
    <div className={styles.card_wrapper}>
      {materialsInTrip.map((element, index) => (
        <Card appearance="outline" key={index}>
          <div
            className={`${
              isMobile ? styles.item_block_mobile : styles.item_block
            }`}
          >
            <div className={styles.item_value}>
              <Field
                label="Материал"
                vertical
                input={
                  <Select
                    style={{ width: '100%' }}
                    onChange={(event, data) =>
                      _updateMaterialsList(
                        element.key,
                        Number(data.value),
                        'recordId'
                      )
                    }
                  >
                    <option value="">Выберите материалы</option>
                    {materialsList.map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                        selected={element.recordId === item.id}
                      >
                        {item.name},{item.description}
                      </option>
                    ))}
                  </Select>
                }
              />
            </div>
            <div className={styles.item_number_value}>
              <Field
                label="Использовано"
                vertical
                input={
                  <Input
                    type="number"
                    style={{ width: '100%' }}
                    placeholder="..."
                    value={String(element.count)}
                    onChange={(event, data) =>
                      _updateMaterialsList(
                        element.key,
                        Number(data.value),
                        'count'
                      )
                    }
                  />
                }
              />
            </div>
            <div className={styles.item_action}>
              {isMobile ? (
                <Button
                  className={styles.danger_button}
                  style={{ width: '100%' }}
                  icon={<DeleteRegular />}
                  onClick={() => _deleteMaterialField(element.key)}
                >
                  Удалить
                </Button>
              ) : (
                <Button
                  icon={<DeleteRegular />}
                  style={{ width: '100%' }}
                  className={styles.danger_button}
                  onClick={() => _deleteMaterialField(element.key)}
                />
              )}
            </div>
          </div>
        </Card>
      ))}
      <div className={styles.card_wrapper_actions}>
        <Button
          icon={<AddRegular />}
          appearance="primary"
          disabled={materialsInTrip.length === materialsList.length}
          onClick={() =>
            setMaterialsInTrip([
              ...materialsInTrip,
              { key: materialsInTrip.length + 1 },
            ])
          }
        />
        {materialsInTrip.length === materialsList.length ? (
          <Caption1 style={{ color: '#d13438' }}>
            Выбрано максимально к-во доступных материалов
          </Caption1>
        ) : (
          <></>
        )}
      </div>
    </div>
  );

  const _mobileDataPresent = (
    <CardWrapper>
      {tripsList.map((item, index) => (
        <MobileCard
          onClick={() => _initEditObject(item.id)}
          header={item.customer.name}
          key={index}
          description={
            <div className={styles.header_wrapper}>
              <Caption1>
                {moment(item.startDate).format('DD-MM-YYYY')} -{' '}
                {moment(item.endDate).format('DD-MM-YYYY')}
              </Caption1>
              <Caption1 className={styles.caption}>
                Дата добавления:{' '}
                {moment(item.dateOfCreation).format('DD-MM-YYYY')}
              </Caption1>
            </div>
          }
          mainContent={<Body1>{item.description}</Body1>}
          actions={
            <>
              <Button
                icon={<EditRegular />}
                onClick={() => _initEditObject(item.id)}
              />
              <Button
                icon={<DeleteRegular />}
                onClick={() => _deleteData(item.id)}
              />
            </>
          }
        />
      ))}
    </CardWrapper>
  );

  const _desktopDataPresent = <DataTable columns={columns} items={tripsList} />;

  const modalBlocks = [
    { title: 'Общая информация', block: _totalInfoBlock },
    { title: 'Работники', block: _workersBlock },
    { title: 'Материалы', block: _materialsBlock },
  ];

  function renderBody() {
    return isMobile ? _mobileDataPresent : _desktopDataPresent;
  }

  useEffect(() => {
    const getData = async () => {
      await _fetchData();
      await _fetchWorkers();
      await _fetchCustomers();
      await _fetchMaterials();
    };

    getData();
  }, []);

  return (
    <Page
      title="Поездки"
      content={
        <>
          {isLoading ? (
            <Spinner labelPosition="below" label="Обновление данных..." />
          ) : (
            <>{tripsList.length > 0 ? renderBody() : <EmptyState />}</>
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
                  Добавить поездку
                </DialogTitle>
                <DialogContent>
                  {modalBlocks.map((item, index) => (
                    <div key={index}>
                      <p>
                        <b>{item.title}</b>
                      </p>
                      {item.block}
                    </div>
                  ))}
                </DialogContent>
                <DialogActions fluid>
                  {materialsInTrip.length !== 0 &&
                  customerId !== 0 &&
                  workersInTrip.length !== 0 &&
                  selectedStartDate !== '' &&
                  selectedEndDate !== '' ? (
                    <Button appearance="primary" onClick={() => _addNewTrip()}>
                      Добавить
                    </Button>
                  ) : (
                    <Button appearance="primary" disabled>
                      Добавить
                    </Button>
                  )}
                </DialogActions>
              </DialogBody>
            </DialogSurface>
          </Dialog>

          <Dialog
            open={detailsOpen}
            onOpenChange={(event, data) => setDetailsOpen(data.open)}
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
                  Детали поездки
                </DialogTitle>
                <DialogContent>
                  <TripDetails
                    item={tripsList.find((obj) => obj.id === selectedRecord)}
                  />
                </DialogContent>
              </DialogBody>
            </DialogSurface>
          </Dialog>
        </>
      }
      filter={
        <Toolbar aria-label="Default">
          <ToolbarButton
            aria-label="Add"
            appearance="primary"
            icon={<AddRegular />}
            onClick={() => setOpen(true)}
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
      }
    />
  );
};
