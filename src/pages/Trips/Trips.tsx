import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, Avatar, Body1, Button, Caption1, Card, CardFooter, CardHeader, CardPreview, Checkbox, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Input, Select, SpinButton, Spinner, TableCellActions, TableCellLayout, TableColumnDefinition, Textarea, Toolbar, ToolbarButton, ToolbarDivider, createTableColumn } from '@fluentui/react-components';
import { AddRegular, ArrowClockwise48Regular, ArrowDownloadRegular, DeleteRegular, Dismiss24Regular, EditRegular, FilterRegular, } from '@fluentui/react-icons';
import moment from 'moment';
import { FC, useEffect, useState } from 'react';
import { DataTable, EmptyState, Field, MobileCard, Page, TripDetails } from '../../components/index';
import { Customer, Material, Trip, Worker, WorkersTripRequest } from '../../global/index';
import useIsMobile from '../../hooks/useIsMobile';
import { deleteTrip, getCustomers, getMaterials, getTrips, getWorkers, postTrip } from '../../store/api/index';
import styles from "./Trips.module.scss";

interface ITrips { }

export const Trips: FC<ITrips> = () => {
    const workersInitialState = [{
        id: 0,
        name: "",
        lastName: ""
    }]

    const tripsInitialState = [{
        id: 0,
        description: "",
        startDate: "",
        endDate: "",
        workersTrip: [{
            id: 0,
            worker: {
                id: 5,
                lastName: "",
                name: ""
            },
            spentDays: 0
        }],
        customer: {
            id: 0,
            name: "",
        },
        usedMaterials: [{
            id: 0,
            usedCount: 0,
            material: {
                id: 0,
                name: "",
                description: "",
                count: 0,
                unit: ""
            }
        }]
    }]

    const customerInitialState = [{
        id: 0,
        name: "",
    }]

    const materialInitialState = [{
        id: 0,
        name: "",
        description: "",
        count: 0,
        unit: ""
    }]

    const [isLoading, setLoading] = useState<boolean>(true);
    const [open, setOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<number>(0)
    const [selectedStartDate, setSelectedStartDate] = useState<string>("");
    const [selectedEndDate, setSelectedEndDate] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [customerId, setCustomerId] = useState<number>(0);
    const [workersIds, setWorkersIds] = useState<WorkersTripRequest[]>([]);
    const [tripsList, setTripsList] = useState<Trip[]>(tripsInitialState)
    const [workersList, setWorkersList] = useState<Worker[]>(workersInitialState)
    const [сustomersList, setCustomersList] = useState<Customer[]>(customerInitialState)
    const [materialsList, setMaterialsList] = useState<Material[]>(materialInitialState)
    const [materialsFieldsCount, setMaterialsFieldsCount] = useState(1)
    const [workersCount, setWorkersCount] = useState(1)
    const isMobile = useIsMobile();

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
                        onClick={() => _initEditObject(item.id)}
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
                return (moment(item.startDate)).format('DD-MM-YYYY');
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
                return (moment(item.endDate)).format('DD-MM-YYYY');
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

    const _fetchMaterials = async () => {
        await getMaterials().then((data) => {
            setMaterialsList(data)
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
            await _fetchData();
            setLoading(false);
            setWorkersIds([])
        }
    }

    const _workersWasSelected = (workerId: number) => {
        const index = workersIds.findIndex((record) => record.workerId === workerId);

        if (index !== -1) {
            setWorkersIds([
                ...workersIds.slice(0, index),
                ...workersIds.slice(index + 1)
            ]);
        } else {
            var worker: WorkersTripRequest = {
                workerId: workerId,
                spentDays: 1
            }

            setWorkersIds((oldArray) => [...oldArray, worker])
        }
    }

    function _workersIsSelected(id: number): boolean {
        const index = workersIds.findIndex((record) => record.workerId === id);
        return index !== -1
    }

    const _initEditObject = async (id: number) => {
        setDetailsOpen(true)
        setSelectedRecord(id)
    }

    const TotalInfoBlock = (
        <Card className={styles.card} appearance="outline">
            <Field
                label='Заказчики'
                input={
                    <Select onChange={(e) => setCustomerId(Number(e.target.value))} style={{ width: "100%" }}>
                        <option value="">Выберите заказчика</option>
                        {сustomersList.map((item) =>
                            <option key={item.id} value={item.id}>{item.name}</option>
                        )}
                    </Select>
                }
            />
            <Field
                label='Дата начала'
                input={<Input type='date' style={{ width: "100%" }} onChange={(e) => setSelectedStartDate(e.target.value)} />}
            />
            <Field
                label='Дата конца'
                input={<Input type='date' style={{ width: "100%" }} onChange={(e) => setSelectedEndDate(e.target.value)} />}
            />
            <Field
                label='Описание'
                input={<Textarea resize="vertical" style={{ width: "100%" }} onChange={(e) => setDescription(e.target.value)} />}
            />
        </Card>
    )

    const WorkersBlock = (
        <Card className={styles.card} appearance="outline">
            {Array(workersCount).fill(0).map(() => (
                <div className={styles.material_block}>
                    <div className={styles.material_input}>
                        <Select style={{ width: "100%" }} onChange={(event, data) => console.log(data.value)}>
                            <option value="">Работник</option>
                            {workersList.map((item) =>
                                <option
                                    key={item.id}
                                    value={item.id}>
                                    {item.name} {item.lastName}
                                </option>
                            )}
                        </Select>
                    </div>
                    <div className={styles.material_count}>
                        <SpinButton min={0} placeholder='Проработал дней' />
                    </div>
                </div>
            ))
            }
            <Button icon={<AddRegular />} appearance="primary" onClick={() => setWorkersCount(workersCount + 1)} />
        </Card >
    )

    const MaterialsBlock = (
        <Card className={styles.card} appearance="outline">
            {Array(materialsFieldsCount).fill(0).map(() => (
                <div className={styles.material_block}>
                    <div className={styles.material_input}>
                        <Select style={{ width: "100%" }}>
                            <option value="">Выберите материалы</option>
                            {materialsList.map((item) =>
                                <option key={item.id} value={item.id}>{item.name},{item.description}</option>
                            )}
                        </Select>
                    </div>
                    <div className={styles.material_count}>
                        <SpinButton defaultValue={0} min={0} />
                    </div>
                </div>
            ))}
            <Button icon={<AddRegular />} appearance="primary" onClick={() => setMaterialsFieldsCount(materialsFieldsCount + 1)} />
        </Card>
    )

    const _mobileDataPresent = (
        <div className={styles.card_block}>
            {
                tripsList.map((item) => (
                    <MobileCard
                        onClick={() => _initEditObject(item.id)}
                        header={item.customer.name}
                        description={<Caption1>{(moment(item.startDate)).format('DD-MM-YYYY')} - {(moment(item.endDate)).format('DD-MM-YYYY')}</Caption1>}
                        mainContent={item.description}
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
            items={tripsList}
        />
    )

    function renderBody() {
        return isMobile ? _mobileDataPresent : _desktopDataPresent
    }


    useEffect(() => {
        const getData = async () => {
            await _fetchData()
            await _fetchWorkers()
            await _fetchCustomers()
            await _fetchMaterials()
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
                            <Spinner labelPosition="below" label="Обновление данных..." />
                            :
                            <>
                                {
                                    tripsList.length > 0
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
                                        </DialogTrigger>}>Добавить поездку
                                </DialogTitle>
                                <DialogContent>
                                    <Accordion multiple defaultOpenItems="">
                                        <AccordionItem value="TotalInfo">
                                            <AccordionHeader size="extra-large">Общая информация</AccordionHeader>
                                            <AccordionPanel>
                                                {TotalInfoBlock}
                                            </AccordionPanel>
                                        </AccordionItem>
                                        <AccordionItem value="Workers">
                                            <AccordionHeader size="extra-large">Работники</AccordionHeader>
                                            <AccordionPanel>
                                                {WorkersBlock}
                                            </AccordionPanel>
                                        </AccordionItem>
                                        <AccordionItem value="Materials">
                                            <AccordionHeader size="extra-large">Материалы</AccordionHeader>
                                            <AccordionPanel>
                                                {MaterialsBlock}
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
                                        <TripDetails
                                            item={tripsList.find(obj => obj.id === selectedRecord)}
                                        />
                                    </div>
                                </DialogContent>
                            </DialogBody>
                        </DialogSurface>
                    </Dialog>
                </>
            }
            filter={
                <Toolbar aria-label="Default">
                    <ToolbarButton aria-label="Add" appearance="primary" icon={<AddRegular />} onClick={() => setOpen(true)}>Добавить</ToolbarButton>
                    <ToolbarDivider />
                    <ToolbarButton aria-label="Refresh" icon={<ArrowClockwise48Regular />} onClick={() => { _fetchData() }} />
                    <ToolbarButton aria-label="Filter" icon={<FilterRegular />} />
                    <ToolbarButton aria-label="Download" icon={<ArrowDownloadRegular />} />
                </Toolbar>
            }
        />
    )
}
