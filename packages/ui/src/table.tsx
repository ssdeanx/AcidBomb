'use client';

import * as React from 'react';
import {
  Table as MuiTable,
  TableBody as MuiTableBody,
  TableCell as MuiTableCell,
  TableContainer as MuiTableContainer,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
  TableSortLabel as MuiTableSortLabel,
  Paper as MuiPaper,
  Checkbox as MuiCheckbox,
  TableProps as MuiTableProps,
  TableBodyProps as MuiTableBodyProps,
  TableCellProps as MuiTableCellProps,
  TableContainerProps as MuiTableContainerProps,
  TableHeadProps as MuiTableHeadProps,
  TableRowProps as MuiTableRowProps,
  TableSortLabelProps as MuiTableSortLabelProps,
  CheckboxProps as MuiCheckboxProps,
  styled,
  alpha,
  useTheme,
  TableRow,
} from '@mui/material';

/**
 * Interface for column definition in the Table component.
 * Defines how each column should be rendered and sorted.
 * @template T - Type of data in each row.
 */
export interface TableColumn<T> {
  /** Unique identifier for the column. */
  id: keyof T;
  /** Header label for the column. */
  label: string;
  /** If true, the column is sortable. @default false */
  sortable?: boolean;
  /** Custom rendering function for the cell content. */
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  /** Custom props to pass to the underlying MuiTableCell component. */
  cellProps?: MuiTableCellProps;
  /** Custom props to pass to the underlying MuiTableSortLabel component. */
  sortLabelProps?: MuiTableSortLabelProps;
  /** Custom comparator function for sorting. */
  comparator?: (a: T[keyof T], b: T[keyof T]) => number;
}

/**
 * Interface for row selection actions.
 * Defines actions that can be performed on selected rows.
 */
export interface RowSelectionActions<T> {
  /** Label for the action. */
  label: string;
  /** Callback function triggered when the action is clicked. */
  onClick: (rows: T[]) => void;
  /** Icon element to display before the label (optional). */
  icon?: React.ReactElement;
}

/**
 * Props for the Table component.
 * @template T - Type of data in each row.
 */
export interface TableProps<T extends { id: React.Key }> extends Omit<MuiTableProps, 'columns'> {
  /**
   * Array of data to display in the table.
   * Each object represents a row.
   */
  data: T[];
  /**
   * Array of column definitions.
   * Defines how each column should be rendered and sorted.
   */
  columns: TableColumn<T>[];
  /**
   * If true, enables row selection.
   * @default false
   */
  rowSelection?: boolean;
  /**
   * Callback function triggered when row selection changes.
   * Receives an array of selected row IDs.
   */
  onRowSelectionChange?: (rowIds: React.Key[]) => void;
  /**
   * Array of row selection actions.
   * Defines actions that can be performed on selected rows.
   */
  rowSelectionActions?: RowSelectionActions<T>[];
  /**
   * Custom props to pass to the underlying MuiTableContainer component.
   */
  tableContainerProps?: MuiTableContainerProps;
  /**
   * Custom props to pass to the underlying MuiTableHead component.
   */
  tableHeadProps?: MuiTableHeadProps;
  /**
   * Custom props to pass to the underlying MuiTableBody component.
   */
  tableBodyProps?: MuiTableBodyProps;
  /**
   * Custom props to pass to the underlying MuiTableRow component.
   */
  tableRowProps?: MuiTableRowProps;
  /**
   * Custom props to pass to the underlying MuiCheckbox component.
   */
  checkboxProps?: MuiCheckboxProps;
   /**
   * Aria label for the select all checkbox.
   * @default 'select all'
   */
  selectAllAriaLabel?: string;
}

const StyledTableContainer = styled(MuiTableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
}));

const StyledTable = styled(MuiTable)(({ theme }) => ({
  borderCollapse: 'separate',
  borderSpacing: 0,
  'th, td': {
    border: `1px solid ${theme.palette.divider}`,
    '&:first-of-type': {
      borderLeft: 0,
    },
    '&:last-child': {
      borderRight: 0,
    },
  },
}));

const StyledTableCell = styled(MuiTableCell)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
}));

const StyledTableHead = styled(MuiTableHead)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
}));

const StyledTableSortLabel = styled(MuiTableSortLabel)(({ theme }) => ({
  '&:hover': {
    color: theme.palette.primary.main,
  },
  '&.Mui-active': {
    color: theme.palette.primary.main,
  },
}));

/**
 * A versatile Table component based on Material UI Table.
 * Supports sorting, row selection, custom rendering, and actions.
 *
 * @example Basic Usage
 * ```tsx
 * const columns = [
 *   { id: 'name', label: 'Name', sortable: true },
 *   { id: 'email', label: 'Email' },
 * ];
 *
 * const data = [
 *   { id: '1', name: 'John Doe', email: 'john@example.com' },
 *   { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
 * ];
 *
 * <Table columns={columns} data={data} />
 * ```
 *
 * @example With Row Selection
 * ```tsx
 * <Table
 *   columns={columns}
 *   data={data}
 *   rowSelection
 *   onRowSelectionChange={(ids) => console.log('Selected IDs:', ids)}
 *   rowSelectionActions={[
 *     { label: 'Delete', onClick: (rows) => console.log('Delete:', rows) },
 *   ]}
 * />
 * ```
 */
export const Table = React.forwardRef<HTMLTableElement, TableProps<any>>(
  <T extends { id: React.Key }>(
    {
      data,
      columns,
      rowSelection = false,
      onRowSelectionChange,
      rowSelectionActions,
      tableContainerProps,
      tableHeadProps,
      tableBodyProps,
      tableRowProps,
      checkboxProps,
      selectAllAriaLabel = 'select all',
      ...props
    }: TableProps<T>,
    ref: React.ForwardedRef<HTMLTableElement>
  ) => {
    const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = React.useState<string | null>(null);
    const [selected, setSelected] = React.useState<React.Key[]>([]);
    const theme = useTheme();

    const handleRequestSort = (
      event: React.MouseEvent<unknown>,
      property: string
    ) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        const newSelected = data.map((n) => n.id);
        setSelected(newSelected);
        onRowSelectionChange?.(newSelected);
        return;
      }
      setSelected([]);
      onRowSelectionChange?.([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: React.Key) => {
      const selectedIndex = selected.indexOf(id);
      let newSelected: React.Key[] = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }

      setSelected(newSelected);
      onRowSelectionChange?.(newSelected);
    };

    const isSelected = (id: React.Key) => selected.indexOf(id) !== -1;

    const EnhancedTableHead = () => (
      <StyledTableHead {...tableHeadProps}>
        <TableRow {...tableRowProps}>
          {rowSelection && (
            <StyledTableCell padding="checkbox">
              <MuiCheckbox
                color="primary"
                indeterminate={selected.length > 0 && selected.length < data.length}
                checked={data.length > 0 && selected.length === data.length}
                onChange={handleSelectAllClick}
                inputProps={{
                  'aria-label': selectAllAriaLabel,
                }}
                {...checkboxProps}
              />
            </StyledTableCell>
          )}
          {columns.map((column) => (
            <StyledTableCell
              key={String(column.id)}
              align="left"
              padding="normal"
              sortDirection={orderBy === column.id ? order : false}
              {...column.cellProps}
            >
              {column.sortable ? (
                <StyledTableSortLabel
                  active={orderBy === column.id}
                  direction={orderBy === column.id ? order : 'asc'}
                  onClick={(event) => handleRequestSort(event, String(column.id))}
                  {...column.sortLabelProps}
                >
                  {column.label}
                </StyledTableSortLabel>
              ) : (
                column.label
              )}
            </StyledTableCell>
          ))}
        </TableRow>
      </StyledTableHead>
    );

    const sortedData = React.useMemo(() => {
      if (!orderBy) {
        return data;
      }

      const sortColumn = columns.find((column) => column.id === orderBy);
      if (!sortColumn || !sortColumn.sortable) {
        return data;
      }

      const comparator = sortColumn.comparator || ((a: any, b: any) => {
        const aValue = a[orderBy as keyof T];
        const bValue = b[orderBy as keyof T];

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return order === 'asc' ? -1 : 1;
        if (bValue == null) return order === 'asc' ? 1 : -1;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return order === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return order === 'asc' ? aValue - bValue : bValue - aValue;
        }

        // Add date comparison
        if (aValue instanceof Date && bValue instanceof Date) {
          return order === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
        }

        return 0;
      });

      return [...data].sort((a, b) => comparator(a[orderBy as keyof T], b[orderBy as keyof T]));
    }, [data, order, orderBy, columns]);

    return (
      <StyledTableContainer component={MuiPaper} {...tableContainerProps}>
        <StyledTable
          ref={ref}
          aria-label="enhanced table"
          {...props}
          sx={{
            borderCollapse: 'separate',
            borderSpacing: 0,
            'th, td': {
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              '&:first-of-type': {
                borderLeft: 0,
              },
              '&:last-child': {
                borderRight: 0,
              },
            },
          }}
        >
          <EnhancedTableHead />
          <MuiTableBody {...tableBodyProps}>
            {sortedData.map((row) => {
              const isItemSelected = isSelected(row.id);
              const labelId = `enhanced-table-checkbox-${row.id}`;

              return (
                <TableRow
                  hover
                  onClick={(event) => handleClick(event, row.id)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                  selected={isItemSelected}
                  {...tableRowProps}
                >
                  {rowSelection && (
                    <StyledTableCell padding="checkbox">
                      <MuiCheckbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                        {...checkboxProps}
                      />
                    </StyledTableCell>
                  )}
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <StyledTableCell
                        key={`${row.id}-${String(column.id)}`}
                        align="left"
                        {...column.cellProps}
                      >
                        {column.render ? column.render(value, row) : String(value ?? '')}
                      </StyledTableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </MuiTableBody>
        </StyledTable>
      </StyledTableContainer>
    );
  }
);

Table.displayName = 'Table';
