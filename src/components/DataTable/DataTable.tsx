import {
  TableColumnDefinition,
  useFluent,
  useScrollbarWidth,
} from '@fluentui/react-components';
import {
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
} from '@fluentui/react-data-grid-react-window';
import React, { FC } from 'react';
import { Customer, Material, Trip, User, Worker } from '../../global/index';

interface IDataTable {
  columns:
    | TableColumnDefinition<Worker>[]
    | TableColumnDefinition<Trip>[]
    | TableColumnDefinition<Material>[]
    | TableColumnDefinition<User>[]
    | TableColumnDefinition<Customer>[];
  items: Trip[] | Worker[] | User[] | Material[] | Customer[];
  onRowClick?: () => void;
}

export const DataTable: FC<IDataTable> = ({ items, onRowClick, columns }) => {
  const { targetDocument } = useFluent();
  const scrollbarWidth = useScrollbarWidth({ targetDocument });

  return (
    <DataGrid
      columns={columns}
      items={items}
      resizableColumns
      size="small"
      sortable
      columnSizingOptions={{
        name: {
          minWidth: 80,
          defaultWidth: 400,
        },
        status: {
          minWidth: 100,
          defaultWidth: 100,
        },
      }}
    >
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
              <DataGridCell onClick={onRowClick}>
                {renderCell(item)}
              </DataGridCell>
            )}
          </DataGridRow>
        )}
      </DataGridBody>
    </DataGrid>
  );
};
