import { Avatar, Button, Card, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Input, Label, Spinner, TableCellActions, TableCellLayout, TableColumnDefinition, Toolbar, ToolbarButton, ToolbarDivider, createTableColumn } from '@fluentui/react-components';
import { AddRegular, ArrowClockwise48Regular, DeleteRegular, Dismiss24Regular, EditRegular } from '@fluentui/react-icons';
import { FC, useEffect, useState } from 'react';
import { DataTable, EmptyState, Field, MobileCard, Page } from '../../components/index';
import { Customer } from '../../global/index';
import useIsMobile from '../../hooks/useIsMobile';
import { deleteCustomers, editCustomer, getCustomers, getCustomersById, postCustomers } from '../../store/api/index';
import styles from "./Customers.module.scss";

interface ICustomers { }

export const Customers: FC<ICustomers> = () => {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [editState, setEditState] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(0)
    const isMobile = useIsMobile();
    const [сustomersList, setCustomersList] = useState<Customer[]>([{
        id: 0,
        name: "",
    }])

    const columns: TableColumnDefinition<Customer>[] = [
        createTableColumn<Customer>({
            columnId: "name",
            renderHeaderCell: () => {
                return "Название";
            },
            renderCell: (item) => {
                return (
                    <TableCellLayout
                        media={<Avatar color="colorful" name={item.name} />}>{item.name}
                    </TableCellLayout>
                );
            },
        }),
        createTableColumn<Customer>({
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
        await getCustomers().then((data) => {
            setCustomersList(data)
        }).finally(() => setLoading(false))
    }

    const _deleteData = async (id: number) => {
        await deleteCustomers([id])
        await _fetchData()
    }

    const _addNewCustomer = async () => {
        await postCustomers(name)
        setOpen(false)
        await _fetchData()
    }

    const _parseSelectedCustomer = async (id: number) => {
        await getCustomersById(id).then((data) => {
            setName(data[0].name)
        })
    }

    const _editExistingCustomer = async () => {
        var customerItem: Customer = {
            id: selectedRecord,
            name: name,
        }

        await editCustomer(customerItem)
        setOpen(false)
        setEditState(false)
        await _fetchData()
    }

    const _initEditObject = async (id: number) => {
        _parseSelectedCustomer(id);
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
                сustomersList.map((item) => (
                    <MobileCard
                        header={item.name}
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
            items={сustomersList}
        />
    )

    function renderBody() {
        return isMobile ? _mobileDataPresent : _desktopDataPresent
    }

    return (
        <Page
            title='Заказчики'
            content={
                <>
                    {
                        isLoading
                            ?
                            <Spinner />
                            :
                            <>

                                {
                                    сustomersList.length > 0
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
                                    }
                                >
                                    {editState ? "Редактировать" : "Добавить"}
                                </DialogTitle>
                                <DialogContent>
                                    <Card className={styles.card} appearance="outline">
                                        <Field
                                            label='Название'
                                            input={
                                                <Input
                                                    placeholder="..."
                                                    id="customer-name"
                                                    value={name}
                                                    style={{ width: "100%" }}
                                                    onChange={(e) => setName(e.target.value)} />
                                            }
                                        />
                                    </Card>
                                </DialogContent>
                                <DialogActions>
                                    {editState
                                        ? <Button appearance="primary" onClick={() => _editExistingCustomer()}>Редактировать</Button>
                                        : <Button appearance="primary" onClick={() => _addNewCustomer()}>Добавить</Button>
                                    }
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
