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
  Select,
  Spinner,
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
import { DataTable, Field, MobileCard, Page } from '../../components/index';
import { User, UserAddRequest, UserType } from '../../global';
import useIsMobile from '../../hooks/useIsMobile';
import {
  blockUser,
  deleteUser,
  getUserById,
  getUserTypes,
  getUsers,
  postUser,
  putUser,
  unblockUser,
} from '../../store/api';
import styles from './Users.module.scss';

export const Users: FC = () => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState<boolean>();
  const [editState, setEditState] = useState(false);
  const [userTypesList, setUserTypesList] = useState<UserType[]>([
    {
      id: 0,
      name: '',
      description: '',
    },
  ]);
  const [usersList, setUsersList] = useState<User[]>([
    {
      id: 0,
      login: '',
      firstName: '',
      lastName: '',
      isLocked: false,
      userType: '',
    },
  ]);
  const [userRequest, setUserRequest] = useState<UserAddRequest>({
    id: 0,
    login: '',
    password: '',
    firstName: '',
    lastName: '',
    userTypeID: 1,
  });

  const _recordActions = (item: User): ReactElement => {
    return (
      <>
        <Button
          icon={<EditRegular />}
          onClick={() => _initEditObject(item.id)}
        />
        <Button icon={<DeleteRegular />} onClick={() => _deleteData(item.id)} />
        {item.isLocked === true ? (
          <Button
            icon={<LockOpenRegular />}
            onClick={() => _unblockUser(item.id)}
          />
        ) : (
          <Button
            icon={<LockClosedRegular />}
            onClick={() => _blockUser(item.id)}
          />
        )}
      </>
    );
  };

  const columns: TableColumnDefinition<User>[] = [
    createTableColumn<User>({
      columnId: 'status',
      compare: (a, b) => {
        return String(a.isLocked).localeCompare(String(b.isLocked));
      },
      renderHeaderCell: () => {
        return 'Статус';
      },
      renderCell: (item) => {
        return _analyzeStatus(item.isLocked);
      },
    }),
    createTableColumn<User>({
      columnId: 'login',
      compare: (a, b) => {
        return a.login.localeCompare(b.login);
      },
      renderHeaderCell: () => {
        return 'Логин';
      },
      renderCell: (item) => {
        return (
          <TableCellLayout
            media={<Avatar color="colorful" name={item.login} />}
          >
            {item.login}
          </TableCellLayout>
        );
      },
    }),
    createTableColumn<User>({
      columnId: 'firstName',
      compare: (a, b) => {
        return a.firstName.localeCompare(b.firstName);
      },
      renderHeaderCell: () => {
        return 'Имя';
      },
      renderCell: (item) => {
        return item.firstName;
      },
    }),
    createTableColumn<User>({
      columnId: 'lastName',
      compare: (a, b) => {
        return a.lastName.localeCompare(b.lastName);
      },
      renderHeaderCell: () => {
        return 'Фамилия';
      },
      renderCell: (item) => {
        return item.lastName;
      },
    }),
    createTableColumn<User>({
      columnId: 'role',
      compare: (a, b) => {
        return a.userType.localeCompare(b.userType);
      },
      renderHeaderCell: () => {
        return 'Права доступа';
      },
      renderCell: (item) => {
        return item.userType;
      },
    }),
    createTableColumn<User>({
      columnId: 'actions',
      renderHeaderCell: () => {
        return '';
      },
      renderCell: (item: User) => {
        return <TableCellActions>{_recordActions(item)}</TableCellActions>;
      },
    }),
  ];

  const _fetchData = async () => {
    setLoading(true);
    await getUsers()
      .then((data) => {
        setUsersList(data);
      })
      .finally(() => {
        setLoading(false);
        setOpen(false);
        setEditState(false);
      });
  };

  const _fetchUserTypes = async () => {
    await getUserTypes().then((data) => {
      setUserTypesList(data);
    });
  };

  const _deleteData = async (id: number) => {
    await deleteUser(id);
    await _fetchData();
  };

  const _addNewUser = async () => {
    await postUser(userRequest);
    await _fetchData();
    setOpen(false);
  };

  const _editExistingUser = async () => {
    setLoading(true);
    await putUser(userRequest);
    await _fetchData();
  };

  const _parseSelectedUser = async (id: number) => {
    await getUserById(id).then((data) => {
      setUserRequest(data);
    });
  };

  const _blockUser = async (id: number) => {
    await blockUser(id);
    await _fetchData();
  };

  const _unblockUser = async (id: number) => {
    await unblockUser(id);
    await _fetchData();
  };

  const _initEditObject = async (id: number) => {
    await _parseSelectedUser(id);
    setOpen(true);
    setEditState(true);
  };

  function _analyzeStatus(status: boolean): ReactElement {
    return (
      <Badge
        appearance="tint"
        shape="rounded"
        color={status === true ? 'danger' : 'success'}
      >
        {status === true ? 'Заблокирован' : 'Активен'}
      </Badge>
    );
  }

  useEffect(() => {
    const getData = async () => {
      await _fetchData();
      await _fetchUserTypes();
    };

    getData();
  }, []);

  const _addUserBlock = (
    <Card className={styles.card} appearance="outline">
      <Field
        label="Логин"
        input={
          <Input
            value={userRequest.login}
            style={{ width: '100%' }}
            onChange={(e) =>
              setUserRequest({
                ...userRequest,
                login: e.target.value,
              })
            }
          />
        }
      />

      {editState ? (
        <></>
      ) : (
        <Field
          label="Пароль"
          input={
            <Input
              value={userRequest.password}
              style={{ width: '100%' }}
              type="password"
              onChange={(e) =>
                setUserRequest({
                  ...userRequest,
                  password: e.target.value,
                })
              }
            />
          }
        />
      )}

      <Field
        label="Имя"
        input={
          <Input
            style={{ width: '100%' }}
            value={userRequest.firstName}
            onChange={(e) =>
              setUserRequest({
                ...userRequest,
                firstName: e.target.value,
              })
            }
          />
        }
      />
      <Field
        label="Фамилия"
        input={
          <Input
            style={{ width: '100%' }}
            value={userRequest.lastName}
            onChange={(e) =>
              setUserRequest({
                ...userRequest,
                lastName: e.target.value,
              })
            }
          />
        }
      />
      <Field
        label="Роль"
        input={
          <Select
            onChange={(e) =>
              setUserRequest({
                ...userRequest,
                userTypeID: Number(e.target.value),
              })
            }
            style={{ width: '100%' }}
          >
            <option value="">Роль в системе</option>
            {userTypesList.map((item) => (
              <option
                key={item.id}
                value={item.id}
                selected={userRequest.userTypeID === item.id}
              >
                {item.name}
              </option>
            ))}
          </Select>
        }
      />
    </Card>
  );

  const _desktopDataPresent = <DataTable columns={columns} items={usersList} />;

  const _mobileDataPresent = (
    <div className={styles.card_block}>
      {usersList.map((item, index) => (
        <MobileCard
          key={index}
          description={<>{item.userType}</>}
          header={`${item.firstName} ${item.lastName}`}
          headerActions={_analyzeStatus(item.isLocked)}
          actions={_recordActions(item)}
        />
      ))}
    </div>
  );

  const renderBody = isMobile ? _mobileDataPresent : _desktopDataPresent;

  return (
    <Page
      title="Пользователи"
      content={
        <>
          {isLoading ? <Spinner label="Обновление данных..." /> : renderBody}
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
                <DialogContent>{_addUserBlock}</DialogContent>
                <DialogActions fluid>
                  {editState ? (
                    <Button
                      appearance="primary"
                      onClick={() => _editExistingUser()}
                    >
                      Редактировать
                    </Button>
                  ) : (
                    <Button appearance="primary" onClick={() => _addNewUser()}>
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
        <Toolbar aria-label="Default">
          <ToolbarButton
            aria-label="Add"
            appearance="primary"
            icon={<AddRegular />}
            onClick={() => {
              setEditState(false);
              setOpen(true);
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
      }
    />
  );
};
