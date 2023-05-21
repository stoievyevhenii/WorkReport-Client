import { Avatar, Button, Card, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Input, Label, Spinner, TableCellActions, TableCellLayout, TableColumnDefinition, Toolbar, ToolbarButton, ToolbarDivider, createTableColumn } from '@fluentui/react-components';
import { AddRegular, ArrowClockwise48Regular, DeleteRegular, Dismiss24Regular, EditRegular } from '@fluentui/react-icons';
import { FC, useEffect, useState } from 'react';
import { DataTable, EmptyState, Field, MobileCard, Page } from '../../components/index';
import { Worker } from '../../global/index';
import useIsMobile from '../../hooks/useIsMobile';
import { deleteWorker, editWorker, getWorkers, getWorkersById, postWorker } from '../../store/api/index';
import styles from "./Workers.module.scss";

interface IWorker { }

export const Workers: FC<IWorker> = () => {
    const isMobile = useIsMobile();
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

    const _mobileDataPresent = (
        <div className={styles.card_block}>
            {
                workersList.map((item) => (
                    <MobileCard
                        header={`${item.name} ${item.lastName}`}
                        actions={
                            <>
                                <Button icon={<EditRegular />} onClick={() => _initEditObject(item.id)} />
                                <Button icon={<DeleteRegular />} onClick={() => _deleteData(item.id)} />
                            </>
                        }
                    />
                ))
            }
        </div>
    )

    const _desktopDataPresent = (
        <DataTable
            columns={columns}
            items={workersList}
        />
    )

    function renderBody() {
        return isMobile ? _mobileDataPresent : _desktopDataPresent
    }

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
                                        renderBody()
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
                                    <Card className={styles.card} appearance="outline">
                                        <Field
                                            label='Имя'
                                            input={<Input
                                                value={name}
                                                placeholder="..."
                                                id="worker-name"
                                                style={{ width: "100%" }}
                                                onChange={(e) => setName(e.target.value)} />}
                                        />
                                        <Field
                                            label='Фамилия'
                                            input={
                                                <Input
                                                    value={lastName}
                                                    placeholder="..."
                                                    style={{ width: "100%" }}
                                                    id="worker-lastName"
                                                    onChange={(e) => setLastName(e.target.value)} />
                                            }
                                        />
                                    </Card>
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
                    <Toolbar aria-label="Default">
                        <ToolbarButton aria-label="Add" appearance="primary" icon={<AddRegular />} onClick={() => { setOpen(true); setEditState(false); setName("") }}>Добавить</ToolbarButton>
                        <ToolbarDivider />
                        <ToolbarButton aria-label="Refresh" icon={<ArrowClockwise48Regular />} onClick={() => { _fetchData() }} />
                    </Toolbar>
                </>
            }
        />
    )
}
