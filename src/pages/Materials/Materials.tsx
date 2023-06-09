import {
  Avatar,
  Badge,
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
  Label,
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
  ArrowClockwise48Regular,
  DeleteRegular,
  Dismiss24Regular,
  EditRegular,
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
import { Material, MaterialRequest, UnitMeasurement } from '../../global/index';
import useIsMobile from '../../hooks/useIsMobile';
import {
  deleteMaterials,
  editMaterial,
  getMaterials,
  getMaterialsById,
  getUnitMeasurement,
  postMaterials,
} from '../../store/api/index';
import styles from './Materials.module.scss';

export const Materials: FC = () => {
  const [count, setCount] = useState(0);
  const [description, setDescription] = useState('');
  const [editState, setEditState] = useState(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(0);
  const [open, setOpen] = useState(false);
  const [unitMeasurement, setUnitMeasurement] = useState(0);
  const isMobile = useIsMobile();
  const [unitMeasurementList, setUnitMeasurementList] = useState<
    UnitMeasurement[]
  >([
    {
      value: 0,
      description: '',
    },
  ]);
  const [materialsList, setMaterialsList] = useState<Material[]>([
    {
      id: 0,
      name: '',
      description: '',
      count: 0,
      unit: '',
    },
  ]);

  const _recordActions = (item: Material): ReactElement => {
    return (
      <>
        <Button
          icon={<EditRegular />}
          onClick={() => _initEditObject(item.id)}
        />
        <Button icon={<DeleteRegular />} onClick={() => _deleteData(item.id)} />
      </>
    );
  };
  const columns: TableColumnDefinition<Material>[] = [
    createTableColumn<Material>({
      columnId: 'name',
      renderHeaderCell: () => {
        return 'Позиция';
      },
      renderCell: (item) => {
        return (
          <TableCellLayout media={<Avatar color="colorful" name={item.name} />}>
            {item.name}
          </TableCellLayout>
        );
      },
    }),
    createTableColumn<Material>({
      columnId: 'description',
      compare: (a, b) => {
        return a.description.localeCompare(b.description);
      },
      renderHeaderCell: () => {
        return 'Описание';
      },
      renderCell: (item) => {
        return item.description;
      },
    }),
    createTableColumn<Material>({
      columnId: 'count',
      compare: (a, b) => {
        return a.count.toString().localeCompare(b.count.toString());
      },
      renderHeaderCell: () => {
        return 'К-во';
      },
      renderCell: (item) => {
        return (
          <Badge
            appearance="tint"
            shape="rounded"
            color={item.count > 0 ? 'success' : 'danger'}
          >
            {item.count}
          </Badge>
        );
      },
    }),
    createTableColumn<Material>({
      columnId: 'unit',
      renderHeaderCell: () => {
        return 'Единицы измерения';
      },
      renderCell: (item) => {
        return item.unit;
      },
    }),
    createTableColumn<Material>({
      columnId: 'actions',
      renderHeaderCell: () => {
        return '';
      },
      renderCell: (item) => {
        return <TableCellActions>{_recordActions(item)}</TableCellActions>;
      },
    }),
  ];

  const _fetchUnitMeasurement = async () => {
    await getUnitMeasurement().then((data) => {
      setUnitMeasurementList(data);
    });
  };

  const _fetchData = async () => {
    setLoading(true);
    await getMaterials()
      .then((data) => {
        setMaterialsList(data);
      })
      .finally(() => setLoading(false));
  };

  const _deleteData = async (id: number) => {
    try {
      await deleteMaterials([id]);
    } catch (error) {
      console.log(error);
    }

    await _fetchData();
  };

  const _addNewMaterial = async () => {
    await postMaterials(name, description, count, unitMeasurement);
    setOpen(false);
    await _fetchData();
  };

  const _editExistingMaterial = async () => {
    setLoading(true);
    const materialItem: MaterialRequest = {
      id: selectedRecord,
      name: name,
      description: description,
      count: count,
      unit: unitMeasurement,
    };

    await editMaterial(materialItem);
    await _fetchData();
  };

  const _parseSelectedMaterials = async (id: number) => {
    await getMaterialsById(id).then((data) => {
      setName(data[0].name);
      setDescription(data[0].description);
      setCount(data[0].count);
      setUnitMeasurement(Number(data[0].unit));
    });
  };

  const _initEditObject = async (id: number) => {
    await _parseSelectedMaterials(id);
    setSelectedRecord(id);
    setOpen(true);
    setEditState(true);
  };

  function _analyzeCount(count: number) {
    return (
      <Badge
        appearance="tint"
        shape="rounded"
        color={count > 0 ? 'success' : 'danger'}
      >
        {count}
      </Badge>
    );
  }

  useEffect(() => {
    const getData = async () => {
      await _fetchData();
      await _fetchUnitMeasurement();
    };

    getData();
  }, []);

  const _mobileDataPresent = (
    <CardWrapper>
      {materialsList.map((item, index) => (
        <MobileCard
          key={index}
          header={item.name}
          description={<Caption1>{item.description}</Caption1>}
          mainContent={
            <>
              Осталось - <b>{_analyzeCount(item.count)}</b> {item.unit}
            </>
          }
          actions={_recordActions(item)}
        />
      ))}
    </CardWrapper>
  );

  const _desktopDataPresent = (
    <DataTable columns={columns} items={materialsList} />
  );

  function renderBody() {
    return isMobile ? _mobileDataPresent : _desktopDataPresent;
  }

  return (
    <Page
      title="Материалы"
      content={
        <>
          {isLoading ? (
            <Spinner labelPosition="below" label="Обновление данных..." />
          ) : (
            <>{materialsList.length > 0 ? renderBody() : <EmptyState />}</>
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
                        icon={<Dismiss24Regular />}
                      />
                    </DialogTrigger>
                  }
                >
                  {editState ? 'Редактировать' : 'Добавить'}
                </DialogTitle>
                <DialogContent>
                  <Card className={styles.card} appearance="outline">
                    <div className={styles.input_block}>
                      <Field
                        label="Название"
                        input={
                          <Input
                            placeholder="..."
                            id="worker-name"
                            value={name}
                            style={{ width: '100%' }}
                            onChange={(e) => setName(e.target.value)}
                          />
                        }
                      />
                    </div>
                    <div className={styles.input_block}>
                      <Field
                        label="Описание"
                        input={
                          <Input
                            placeholder="..."
                            style={{ width: '100%' }}
                            value={description}
                            id="worker-description"
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        }
                      />
                      <Label htmlFor="worker-description"></Label>
                    </div>
                    <div className={styles.wrapper_horizontal}>
                      <div className={styles.input_block}>
                        <Label htmlFor="worker-count">К-во</Label>
                        <Input
                          value={String(count)}
                          placeholder="..."
                          id="worker-count"
                          onChange={(e) => setCount(Number(e.target.value))}
                          type="number"
                        />
                      </div>
                      <div className={styles.input_block}>
                        <Label htmlFor="worker-count">Единица</Label>
                        <Select
                          onChange={(e) =>
                            setUnitMeasurement(Number(e.target.value))
                          }
                        >
                          <option value="">...</option>
                          {unitMeasurementList.map((item) => (
                            <option
                              key={item.value}
                              value={item.value}
                              selected={item.value === unitMeasurement}
                            >
                              {item.description}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  </Card>
                </DialogContent>
                <DialogActions fluid>
                  {editState ? (
                    <Button
                      appearance="primary"
                      onClick={() => _editExistingMaterial()}
                    >
                      Редактировать
                    </Button>
                  ) : (
                    <Button
                      appearance="primary"
                      onClick={() => _addNewMaterial()}
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
        <Toolbar aria-label="Default">
          <ToolbarButton
            aria-label="Add"
            appearance="primary"
            icon={<AddRegular />}
            onClick={() => {
              setOpen(true);
              setEditState(false);
              setName('');
            }}
          >
            Добавить
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton
            aria-label="Refresh"
            icon={<ArrowClockwise48Regular />}
            onClick={() => {
              _fetchData();
            }}
          />
        </Toolbar>
      }
    />
  );
};
