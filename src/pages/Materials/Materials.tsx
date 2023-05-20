import { Avatar, Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Input, Label, Select, Spinner, TableCellActions, TableCellLayout, TableColumnDefinition, createTableColumn } from '@fluentui/react-components';
import { AddRegular, ArrowClockwise48Regular, DeleteRegular, Dismiss24Regular, EditRegular } from '@fluentui/react-icons';
import { FC, useEffect, useState } from 'react';
import { DataTable, EmptyState, Page } from '../../components/index';
import { Material, MaterialRequest, UnitMeasurement } from '../../global/index';
import { deleteMaterials, editMaterial, getMaterials, getMaterialsById, getUnitMeasurement, postMaterials } from '../../store/api/index';
import styles from "./Materials.module.scss";

interface IMaterials { }

export const Materials: FC<IMaterials> = () => {
    const [count, setCount] = useState(0)
    const [description, setDescription] = useState("")
    const [editState, setEditState] = useState(false)
    const [isLoading, setLoading] = useState<boolean>(true);
    const [name, setName] = useState("")
    const [selectedRecord, setSelectedRecord] = useState(0)
    const [open, setOpen] = useState(false);
    const [unitMeasurement, setUnitMeasurement] = useState(0);
    const [unitMeasurementList, setUnitMeasurementList] = useState<UnitMeasurement[]>([{
        value: 0,
        description: ""
    }])
    const [materialsList, setMaterialsList] = useState<Material[]>([{
        id: 0,
        name: "",
        description: "",
        count: 0,
        unit: ""
    }])
    const columns: TableColumnDefinition<Material>[] = [
        createTableColumn<Material>({
            columnId: "name",
            renderHeaderCell: () => {
                return "Позиция";
            },
            renderCell: (item) => {
                return (
                    <TableCellLayout
                        media={<Avatar color="colorful" name={item.name} />}>{item.name}
                    </TableCellLayout>
                );
            },
        }),
        createTableColumn<Material>({
            columnId: "description",
            compare: (a, b) => {
                return a.description.localeCompare(b.description);
            },
            renderHeaderCell: () => {
                return "Описание";
            },
            renderCell: (item) => {
                return item.description;
            },
        }),
        createTableColumn<Material>({
            columnId: "count",
            compare: (a, b) => {
                return a.count.toString().localeCompare(b.count.toString());
            },
            renderHeaderCell: () => {
                return "К-во";
            },
            renderCell: (item) => {
                return item.count;
            },
        }),
        createTableColumn<Material>({
            columnId: "unit",
            renderHeaderCell: () => {
                return "Единицы измерения";
            },
            renderCell: (item) => {
                return item.unit;
            },
        }),
        createTableColumn<Material>({
            columnId: "actions",
            renderHeaderCell: () => {
                return "";
            },
            renderCell: (item) => {
                return (
                    <TableCellActions>
                        <Button icon={<EditRegular />} appearance="subtle" onClick={() => _initEditObject(item.id)} />
                        <Button icon={<DeleteRegular />} appearance="subtle" onClick={() => _deleteData(item.id)} />
                    </TableCellActions>
                );
            },
        }),
    ];

    const _fetchUnitMeasurement = async () => {
        await getUnitMeasurement().then((data) => {
            setUnitMeasurementList(data)
        })
    }

    const _reloadData = async () => {
        setLoading(true)
        await getMaterials().then((data) => {
            setMaterialsList(data)
        }).finally(() => setLoading(false))
    }

    const _deleteData = async (id: number) => {
        try {
            await deleteMaterials([id])
        } catch (error) {

        }

        await _reloadData()
    }

    const _addNewMaterial = async () => {
        await postMaterials(name, description, count, unitMeasurement)
        setOpen(false)
        await _reloadData()
    }

    const _editExistingMaterial = async () => {
        setLoading(true)
        var materialItem: MaterialRequest = {
            id: selectedRecord,
            name: name,
            description: description,
            count: count,
            unit: unitMeasurement
        }

        await editMaterial(materialItem)
        await _reloadData()
    }

    const _parseSelectedMaterials = async (id: number) => {
        await getMaterialsById(id).then((data) => {
            setName(data[0].name)
            setDescription(data[0].description)
            setCount(data[0].count)
            setUnitMeasurement(Number(data[0].unit))
        })
    }

    const _initEditObject = async (id: number) => {
        _parseSelectedMaterials(id);
        setSelectedRecord(id)
        setOpen(true);
        setEditState(true);
    }

    useEffect(() => {
        const getData = async () => {
            await _reloadData()
            await _fetchUnitMeasurement()
        }

        getData()
    }, [])

    return (
        <Page
            title='Материалы'
            content={
                <>
                    {
                        isLoading
                            ?
                            <Spinner labelPosition="below" label="Обновление данных..." />
                            :
                            <>
                                {
                                    materialsList.length > 0
                                        ?
                                        <DataTable
                                            columns={columns}
                                            items={materialsList}
                                        />
                                        :
                                        <EmptyState />
                                }
                            </>
                    }
                    <Dialog open={open} onOpenChange={(event, data) => setOpen(data.open)}>
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
                                    }>
                                    {editState ? "Редактировать" : "Добавить"}
                                </DialogTitle>
                                <DialogContent>
                                    <div className={styles.dialog_content}>
                                        <div className={styles.input_block}>
                                            <Label htmlFor="worker-name">Название</Label>
                                            <Input
                                                placeholder="..."
                                                id="worker-name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)} />
                                        </div>
                                        <div className={styles.input_block}>
                                            <Label htmlFor="worker-description">Описание</Label>
                                            <Input
                                                placeholder="..."
                                                value={description}
                                                id="worker-description"
                                                onChange={(e) => setDescription(e.target.value)} />
                                        </div>
                                        <div className={styles.wrapper_horizontal}>
                                            <div className={styles.input_block}>
                                                <Label htmlFor="worker-count">К-во</Label>
                                                <Input
                                                    value={String(count)}
                                                    placeholder="..."
                                                    id="worker-count"
                                                    onChange={(e) => setCount(Number(e.target.value))} type='number' />
                                            </div>
                                            <div className={styles.input_block}>
                                                <Label htmlFor="worker-count">Единица измерения</Label>
                                                <Select onChange={(e) => setUnitMeasurement(Number(e.target.value))}>
                                                    <option value="">...</option>
                                                    {unitMeasurementList.map((item) =>
                                                        <option
                                                            key={item.value}
                                                            value={item.value}
                                                            selected={item.value === unitMeasurement}>
                                                            {item.description}
                                                        </option>
                                                    )}
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </DialogContent>
                                <DialogActions>
                                    {editState
                                        ? <Button appearance="primary" onClick={() => _editExistingMaterial()}>Редактировать</Button>
                                        : <Button appearance="primary" onClick={() => _addNewMaterial()}>Добавить</Button>}
                                </DialogActions>
                            </DialogBody>
                        </DialogSurface>
                    </Dialog>
                </>
            }
            filter={
                <>
                    <Button
                        appearance="primary"
                        icon={<AddRegular />}
                        onClick={() => { setOpen(true); setEditState(false) }}>
                        Добавить
                    </Button>
                    <Button
                        appearance="transparent"
                        icon={<ArrowClockwise48Regular />}
                        onClick={() => { _reloadData() }}>
                        Обновить
                    </Button>
                </>
            }
        />
    )
}
