import {
    useFluent,
    useScrollbarWidth,
} from "@fluentui/react-components";
import {
    DataGrid,
    DataGridBody,
    DataGridCell,
    DataGridHeader,
    DataGridHeaderCell,
    DataGridRow,
} from "@fluentui/react-data-grid-react-window";
import { FC } from "react";

interface IDataTable {
    columns?: any;
    items?: any;
    onRowClick?: any;
}

export const DataTable: FC<IDataTable> = ({ items, onRowClick, columns }) => {
    const { targetDocument } = useFluent();
    const scrollbarWidth = useScrollbarWidth({ targetDocument });

    return (
        <DataGrid
            columns={columns}
            noNativeElements
            items={items}
            size="small"
            sortable>
            <DataGridHeader style={{ paddingRight: scrollbarWidth }}>
                <DataGridRow>
                    {({ renderHeaderCell }) => (
                        <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                    )}
                </DataGridRow>
            </DataGridHeader>
            <DataGridBody itemSize={35} height={650}>
                {({ item, rowId }, style) => (
                    <DataGridRow key={rowId} style={style}>
                        {({ renderCell }) => (
                            <DataGridCell onClick={onRowClick}>{renderCell(item)}</DataGridCell>
                        )}
                    </DataGridRow>
                )}
            </DataGridBody>
        </DataGrid>
    );
};