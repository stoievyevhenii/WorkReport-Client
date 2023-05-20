import { Avatar, Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Input, Label, Spinner, TableCellActions, TableCellLayout, TableColumnDefinition, createTableColumn } from '@fluentui/react-components';
import { AddRegular, ArrowClockwise48Regular, DeleteRegular, Dismiss24Regular, EditRegular } from '@fluentui/react-icons';
import { FC, useEffect, useState } from 'react';
import { DataTable, EmptyState, Page } from '../../components/index';
import { Worker } from '../../global/index';
import { deleteWorker, editWorker, getWorkers, getWorkersById, postWorker } from '../../store/api/index';
import styles from "./Workers.module.scss";

interface IWorker { }

export const Workers: FC<IWorker> = () => {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [editState, setEditState] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(0)
    const [workersList, setWorkersList] = useState<Worker[]>([{
        id: 0,
        name: "",
        lastName: ""
    }])

    const columns: TableColumnDefinition<Worker>[] = [
        createTableColumn<Worker>({
            columnId: "login",
            renderHeaderCell: () => {
                return "Имя";
            },
            renderCell: (item) => {
                return (
                    <TableCellLayout
                        media={<Avatar color="colorful" name={item.name} />}>{item.name}
                    </TableCellLayout>
                );
            },
        }),
        createTableColumn<Worker>({
            columnId: "lastName",
            renderHeaderCell: () => {
                return "Фамилия";
            },
            renderCell: (item) => {
                return item.lastName;
            },
        }),
        createTableColumn<Worker>({
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

    const _fetchData = async () => {
        setLoading(true)
        await getWorkers().then((data) => {
            setWorkersList(data)
        }).finally(() => setLoading(false))
    }

    const _deleteData = async (id: number) => {
        await deleteWorker([id]).finally(() => _fetchData())
    }

    const _addNewWorker = async () => {
        await postWorker(name, lastName)
        setOpen(false)
        await _fetchData()
    }

    const _parseSelectedWorker = async (id: number) => {
        await getWorkersById(id).then((data) => {
            setLastName(data[0].lastName)
            setName(data[0].name)
        })
    }

    const _editExistingWorker = async () => {
        var workerItem: Worker = {
            id: selectedRecord,
            name: name,
            lastName: lastName
        }

        await editWorker(workerItem)
        setOpen(false)
        await _fetchData()
    }

    const _initEditObject = async (id: number) => {
        _parseSelectedWorker(id);
        setSelectedRecord(id)
        setOpen(true);
        setEditState(true);
    }

    useEffect(() => {
        const getData = async () => {
            await _fetchData()
        }

        getData()
    }, [])

    return (
        <Page
            title='Работники'
            content={
                <>
                    {
                        isLoading
                            ?
                            <Spinner />
                            :
                            <>
                                {
                                    workersList.length > 0
                                        ?
                                        <DataTable
                                            columns={columns}
                                            items={workersList}
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
                                            <Label htmlFor="worker-name">Имя</Label>
                                            <Input
                                                value={name}
                                                placeholder="..."
                                                id="worker-name"
                                                onChange={(e) => setName(e.target.value)} />
                                        </div>
                                        <div className={styles.input_block}>
                                            <Label htmlFor="worker-name">Фамилия</Label>
                                            <Input
                                                value={lastName}
                                                placeholder="..."
                                                id="worker-lastName"
                                                onChange={(e) => setLastName(e.target.value)} />
                                        </div>
                                    </div>
                                </DialogContent>
                                <DialogActions>
                                    {editState
                                        ? <Button appearance="primary" onClick={() => _editExistingWorker()}>Редактировать</Button>
                                        : <Button appearance="primary" onClick={() => _addNewWorker()}>Добавить</Button>}
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
                        onClick={() => { _fetchData() }}>
                        Обновить
                    </Button>
                </>
            }
        />
    )
}
