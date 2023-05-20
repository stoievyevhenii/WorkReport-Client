import { Avatar, Button, Spinner, TableCellLayout, TableColumnDefinition, Toolbar, ToolbarButton, ToolbarDivider, createTableColumn } from '@fluentui/react-components';
import { AddRegular, ArrowClockwise48Regular } from '@fluentui/react-icons';
import React, { FC, useEffect, useState } from 'react';
import { DataTable, Page } from '../../components/index';
import { users } from '../../routes/api';
import { axiosConfig } from '../../store/api/axios.config';

type Item = {
    login: string;
    firstName: string;
    lastName: string;
    isLocked: boolean;
};

interface IUser { }

export const Users: FC<IUser> = () => {
    const [isLoading, setLoading] = useState<boolean>();
    const [usersList, setUsersList] = useState<Item[]>([{
        login: "",
        firstName: "",
        lastName: "",
        isLocked: false
    }])

    useEffect(() => {
        setLoading(true)
        axiosConfig.get(users()).then((result) => {
            setUsersList(result.data.values)
        }).finally(() => setLoading(false))
    }, [])

    const columns: TableColumnDefinition<Item>[] = [
        createTableColumn<Item>({
            columnId: "login",
            compare: (a, b) => {
                return a.login.localeCompare(b.login);
            },
            renderHeaderCell: () => {
                return "Логин";
            },
            renderCell: (item) => {
                return (
                    <TableCellLayout
                        media={<Avatar color="colorful" name={item.login} />}>{item.login}
                    </TableCellLayout>
                );
            },
        }),
        createTableColumn<Item>({
            columnId: "firstName",
            compare: (a, b) => {
                return a.firstName.localeCompare(b.firstName);
            },
            renderHeaderCell: () => {
                return "Имя";
            },
            renderCell: (item) => {
                return item.firstName;
            },
        }),
        createTableColumn<Item>({
            columnId: "lastName",
            compare: (a, b) => {
                return a.lastName.localeCompare(b.lastName);
            },
            renderHeaderCell: () => {
                return "Фамилия";
            },
            renderCell: (item) => {
                return item.lastName;
            },
        }),
    ];


    return (
        <Page
            title='Пользователи'
            content={
                <>
                    {
                        isLoading
                            ?
                            <Spinner />
                            :
                            <DataTable
                                columns={columns}
                                items={usersList}
                            />
                    }
                </>
            }
            filter={
                <Toolbar aria-label="Default">
                    <ToolbarButton aria-label="Add" appearance="primary" icon={<AddRegular />} onClick={() => { }}>Добавить</ToolbarButton>
                    <ToolbarDivider />
                    <ToolbarButton aria-label="Refresh" icon={<ArrowClockwise48Regular />} onClick={() => { }} />
                </Toolbar>
            }
        />
    )
}
