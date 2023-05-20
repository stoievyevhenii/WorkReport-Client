import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, Avatar, Button, Checkbox, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Field, Input, Select, SelectTabData, SelectTabEvent, Spinner, Tab, TabList, TabValue, TableCellActions, TableCellLayout, TableColumnDefinition, Textarea, createTableColumn, makeStyles } from '@fluentui/react-components';
import { AddRegular, ArrowClockwise48Regular, ArrowDownloadRegular, DeleteRegular, Dismiss24Regular, EditRegular, FilterRegular } from '@fluentui/react-icons';
import React, { FC, memo, useEffect, useState } from 'react';
import { DataTable, EmptyState, Page } from '../../components/index';
import { Customer, Trip, Worker, WorkerTrip } from '../../global/index';
import { deleteTrip, getCustomers, getTrips, getWorkers, postTrip } from '../../store/api/index';
import styles from "./Trips.module.scss";

interface ITrips { }

export const Trips: FC<ITrips> = () => {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [open, setOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(0)
    const [selectedStartDate, setSelectedStartDate] = useState<string>("");
    const [selectedEndDate, setSelectedEndDate] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [customerId, setCustomerId] = useState<number>(0);
    const [workersIds, setWorkersIds] = useState<WorkerTrip[]>([]);
    const [tripsList, setTripsList] = useState<Trip[]>([{
        id: 0,
        description: "",
        startDate: "",
        endDate: "",
        workers: [{
            id: 0,
            name: "",
            lastName: "",
        }],
        customer: {
            id: 0,
            name: "",
        },
    }])
    const [workersList, setWorkersList] = useState<Worker[]>([{
        id: 0,
        name: "",
        lastName: ""
    }])
    const [сustomersList, setCustomersList] = useState<Customer[]>([{
        id: 0,
        name: "",
    }])

    const columns: TableColumnDefinition<Trip>[] = [
        createTableColumn<Trip>({
            columnId: "customer",
            compare: (a, b) => {
                return a.customer.name.localeCompare(b.customer.name);
            },
            renderHeaderCell: () => {
                return "Заказчик";
            },
            renderCell: (item) => {
                return (
                    <TableCellLayout
                        media={<Avatar color="colorful" name={item.customer.name} />}>{item.customer.name}
                    </TableCellLayout>
                );
            },
        }),
        createTableColumn<Trip>({
            columnId: "startDate",
            compare: (a, b) => {
                return a.startDate.localeCompare(b.startDate);
            },
            renderHeaderCell: () => {
                return "Начало";
            },
            renderCell: (item) => {
                return item.startDate;
            },
        }),
        createTableColumn<Trip>({
            columnId: "endDate",
            compare: (a, b) => {
                return a.endDate.localeCompare(b.endDate);
            },
            renderHeaderCell: () => {
                return "Конец";
            },
            renderCell: (item) => {
                return item.endDate;
            },
        }),
        createTableColumn<Trip>({
            columnId: "description",
            renderHeaderCell: () => {
                return "Описание работ";
            },
            renderCell: (item) => {
                return item.description;
            },
        }),
        createTableColumn<Trip>({
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

    const _fetchWorkers = async () => {
        await getWorkers().then((data) => {
            setWorkersList(data)
        })
    }

    const _fetchCustomers = async () => {
        await getCustomers().then((data) => {
            setCustomersList(data)
        })
    }

    const _fetchData = async () => {
        setLoading(true)
        await getTrips().then((data) => {
            setTripsList(data)
        }).finally(() => setLoading(false))
    }

    const _deleteData = async (id: number) => {
        await deleteTrip([id])
        await _fetchData()
    }

    const _addNewTrip = async () => {
        setLoading(true)
        setOpen(false)
        try {
            await postTrip(
                description,
                customerId,
                selectedStartDate,
                selectedEndDate,
                workersIds
            );
            await _fetchData();
        } finally {
            setLoading(false);
        }
    };

    const _workersWasSelected = (workerId: number) => {
        const index = workersIds.findIndex((record) => record.workerId === workerId);

        if (index !== -1) {
            setWorkersIds([
                ...workersIds.slice(0, index),
                ...workersIds.slice(index + 1)
            ]);
        } else {

            var worker: WorkerTrip = {
                workerId: workerId,
                spentDays: 1
            }

            setWorkersIds((oldArray) => [...oldArray, worker])
        }
    }

    const _initEditObject = async (id: number) => {
        setSelectedRecord(id)
    }

    useEffect(() => {
        const getData = async () => {
            await _fetchData()
            await _fetchWorkers()
            await _fetchCustomers()
        }

        getData()
    }, [])

    return (
        <Page
            title='Поездки'
            content={
                <>
                    {
                        isLoading
                            ?
                            <Spinner />
                            :
                            <>
                                {
                                    tripsList.length > 0
                                        ?
                                        <DataTable
                                            columns={columns}
                                            items={tripsList}
                                            onRowClick={() => setDetailsOpen(true)}
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
                                    Добавить поездку
                                </DialogTitle>
                                <DialogContent>
                                    <Accordion multiple defaultOpenItems="TotalInfo">
                                        <AccordionItem value="TotalInfo">
                                            <AccordionHeader size="extra-large">Общая информация</AccordionHeader>
                                            <AccordionPanel>
                                                <div className={styles.dialog_content}>
                                                    <div className={styles.input_block}>
                                                        <label id="customers">Заказчики</label>
                                                        <Select onChange={(e) => setCustomerId(Number(e.target.value))}>
                                                            <option value="">Выберите заказчика</option>
                                                            {сustomersList.map((item) =>
                                                                <option key={item.id} value={item.id}>{item.name}</option>
                                                            )}
                                                        </Select>
                                                    </div>
                                                    <div className={styles.input_block}>
                                                        <label id="startDate">Дата начала</label>
                                                        <Input type='date' onChange={(e) => setSelectedStartDate(e.target.value)} />
                                                    </div>
                                                    <div className={styles.input_block}>
                                                        <label id="startDate">Дата конца</label>
                                                        <Input type='date' onChange={(e) => setSelectedEndDate(e.target.value)} />
                                                    </div>
                                                    <div className={styles.input_block}>
                                                        <Field label="Описание работ">
                                                            <Textarea resize="vertical" onChange={(e) => setDescription(e.target.value)} />
                                                        </Field>
                                                    </div>
                                                </div>
                                            </AccordionPanel>
                                        </AccordionItem>
                                        <AccordionItem value="Workers">
                                            <AccordionHeader size="extra-large">Работники</AccordionHeader>
                                            <AccordionPanel>
                                                <div className={styles.dialog_content}>
                                                    <div className={styles.input_block}>
                                                        {workersList.map((item) =>
                                                            <Checkbox
                                                                key={item.id}
                                                                onChange={() => { _workersWasSelected(item.id) }}
                                                                label={`${item.name} ${item.lastName}`}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </AccordionPanel>
                                        </AccordionItem>
                                        <AccordionItem value="Materials">
                                            <AccordionHeader size="extra-large">Материалы</AccordionHeader>
                                            <AccordionPanel>
                                                <div className={styles.dialog_content}>
                                                    <table className={styles.propsTable}>
                                                        <tbody>
                                                            <tr>
                                                                <td>Time</td>
                                                                <td>6:45 AM</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Temperature</td>
                                                                <td>68F / 20C</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Forecast</td>
                                                                <td>Overcast</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Visibility</td>
                                                                <td>0.5 miles, 1800 ft runway visual range</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </AccordionPanel>
                                        </AccordionItem>
                                    </Accordion>
                                </DialogContent>
                                <DialogActions>
                                    {(workersIds.length !== 0 && customerId !== 0 && selectedStartDate !== "" && selectedEndDate !== ""
                                        ? <Button appearance="primary" onClick={() => _addNewTrip()}>Добавить</Button>
                                        : <Button appearance="primary" disabled>Добавить</Button>
                                    )}
                                </DialogActions>
                            </DialogBody>
                        </DialogSurface>
                    </Dialog>

                    <Dialog open={detailsOpen} onOpenChange={(event, data) => setDetailsOpen(data.open)}>
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
                                    Детали поездки
                                </DialogTitle>
                                <DialogContent>
                                    <div className={styles.dialog_content}>

                                    </div>
                                </DialogContent>
                            </DialogBody>
                        </DialogSurface>
                    </Dialog>
                </>
            }
            filter={
                <>
                    <Button appearance="primary" icon={<AddRegular />} onClick={() => setOpen(true)}>
                        Добавить
                    </Button>
                    <Button
                        appearance="transparent"
                        icon={<ArrowClockwise48Regular />}
                        onClick={() => { _fetchData() }}>
                        Обновить
                    </Button>
                    <Button appearance="transparent" icon={<FilterRegular />}>
                        Фильтр
                    </Button>
                    <Button appearance="transparent" icon={<ArrowDownloadRegular />}>
                        Скачать отчёт
                    </Button>
                </>

            }
        />
    )
}
