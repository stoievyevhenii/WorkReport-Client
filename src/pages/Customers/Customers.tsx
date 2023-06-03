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
  DeleteRegular,
  DismissRegular,
  EditRegular,
  LockClosedRegular,
  LockOpenRegular,
} from '@fluentui/react-icons';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import {
  DataTable,
  EmptyState,
  Field,
  MobileCard,
  Page,
} from '../../components/index';
import { Customer } from '../../global/index';
import useIsMobile from '../../hooks/useIsMobile';
import {
  blockCustomer,
  deleteCustomers,
  editCustomer,
  getCustomers,
  getCustomersById,
  postCustomers,
  unblockCustomer,
} from '../../store/api/index';
import styles from './Customers.module.scss';

export const Customers: FC = () => {
  const customerDataInit = {
    id: 0,
    name: '',
    isActive: true,
  };

  const [customerData, setCustomerData] = useState<Customer>(customerDataInit);
  const [editState, setEditState] = useState(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const [сustomersList, setCustomersList] = useState<Customer[]>([
    {
      id: 0,
      name: '',
      isActive: true,
    },
  ]);

  const _fetchData = async () => {
    setLoading(true);
    await getCustomers()
      .then((data) => {
        setCustomersList(data);
      })
      .finally(() => setLoading(false));
  };

  const _addNewCustomer = async () => {
    await postCustomers(customerData.name);
    setOpen(false);
    setCustomerData(customerDataInit);
    await _fetchData();
  };

  const _parseSelectedCustomer = async (id: number) => {
    await getCustomersById(id).then((data) => {
      setCustomerData({
        id: data[0].id,
        name: data[0].name,
        isActive: data[0].isActive,
      });
    });
  };

  const _editExistingCustomer = async () => {
    await editCustomer(customerData);
    setOpen(false);
    setEditState(false);
    await _fetchData();
  };

  const _initEditObject = async (id: number) => {
    _parseSelectedCustomer(id);
    setOpen(true);
    setEditState(true);
  };

  const _blockCustomer = async (id: number) => {
    await blockCustomer(id);
    await _fetchData();
  };

  const _unblockCustomer = async (id: number) => {
    await unblockCustomer(id);
    await _fetchData();
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

  const _recordActions = (item: Customer): ReactElement => {
    return (
      <>
        <Button
          icon={<EditRegular />}
          onClick={() => _initEditObject(item.id)}
        />
        {item.isActive === true ? (
          <Button
            icon={<LockClosedRegular />}
            onClick={() => _blockCustomer(item.id)}
          />
        ) : (
          <Button
            icon={<LockOpenRegular />}
            onClick={() => _unblockCustomer(item.id)}
          />
        )}
      </>
    );
  };

  const columns: TableColumnDefinition<Customer>[] = [
    createTableColumn<Customer>({
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
    createTableColumn<Customer>({
      columnId: 'name',
      renderHeaderCell: () => {
        return 'Название';
      },
      renderCell: (item) => {
        return (
          <TableCellLayout media={<Avatar color="colorful" name={item.name} />}>
            {item.name}
          </TableCellLayout>
        );
      },
    }),
    createTableColumn<Customer>({
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
    <div className={styles.card_block}>
      {сustomersList.map((item, index) => (
        <MobileCard
          key={index}
          header={item.name}
          headerActions={_analyzeStatus(item.isActive)}
          actions={_recordActions(item)}
        />
      ))}
    </div>
  );

  const _desktopDataPresent = (
    <DataTable columns={columns} items={сustomersList} />
  );

  function renderBody() {
    return isMobile ? _mobileDataPresent : _desktopDataPresent;
  }

  return (
    <Page
      title="Заказчики"
      content={
        <>
          {isLoading ? (
            <Spinner label="Обновление данных..." />
          ) : (
            <>{сustomersList.length > 0 ? renderBody() : <EmptyState />}</>
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
                  <Card className={styles.card} appearance="outline">
                    <Field
                      label="Название"
                      input={
                        <Input
                          placeholder="..."
                          id="customer-name"
                          value={customerData.name}
                          style={{ width: '100%' }}
                          onChange={(e) =>
                            setCustomerData({
                              ...customerData,
                              name: e.target.value,
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
                            checked={customerData.isActive}
                            onChange={(e) =>
                              setCustomerData({
                                ...customerData,
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
                      onClick={() => _editExistingCustomer()}
                    >
                      Редактировать
                    </Button>
                  ) : (
                    <Button
                      appearance="primary"
                      onClick={() => _addNewCustomer()}
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
                setCustomerData({ isActive: true, id: 0, name: '' });
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
