'use client';

import * as React from 'react';
import {
  Table as MuiTable,
  TableProps as MuiTableProps,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Box,
  styled,
  alpha,
} from '@mui/material';
import { Delete as DeleteIcon, FilterList as FilterListIcon } from '@mui/icons-material';

export interface TableColumn<T> {
  id: keyof T;
  label: string;
  numeric?: boolean;
  width?: string | number;
  align?: 'left' | 'right' | 'center';
  format?: (value: any) => string | number;
}

export interface TableProps<T extends Record<string, any>> extends Omit<MuiTableProps, 'children'> {
  /**
   * Array of data to display in the table
   */
  data: T[];

  /**
   * Array of column definitions
   */
  columns: TableColumn<T>[];

  /**
   * Enable row selection
   * @default false
   */
  selectable?: boolean;

  /**
   * Enable sorting
   * @default true
   */
  sortable?: boolean;

  /**
   * Enable pagination
   * @default true
   */
  pagination?: boolean;

  /**
   * Default rows per page
   * @default 5
   */
  defaultRowsPerPage?: number;

  /**
   * Available rows per page options
   * @default [5, 10, 25]
   */
  rowsPerPageOptions?: number[];

  /**
   * Callback when rows are selected
   */
  onSelectionChange?: (selectedIds: string[]) => void;
}

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
}));

const StyledToolbar = styled(Toolbar)<{ numSelected: number }>(({ theme, numSelected }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(1),
  ...(numSelected > 0 && {
    backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
  }),
}));

export const table = React.forwardRef(<T extends Record<string, any>>(
  {
    data,
    columns,
    selectable = false,
    sortable = true,
    pagination = true,
    defaultRowsPerPage = 5,
    rowsPerPageOptions = [5, 10, 25],
    onSelectionChange,
    ...props
  }: TableProps<T>,
  ref: React.ForwardedRef<HTMLTableElement>
) => {
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(defaultRowsPerPage);
  const [orderBy, setOrderBy] = React.useState<keyof T | null>(null);
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');

  // ... implement sorting, pagination, and selection logic here

  return (
    <Paper elevation={0}>
      {selectable && (
        <StyledToolbar numSelected={selected.length}>
          {selected.length > 0 ? (
            <Typography color="inherit" variant="subtitle1">
              {selected.length} selected
            </Typography>
          ) : (
            <Typography variant="h6">
              Data Table
            </Typography>
          )}
          {selected.length > 0 && (
            <IconButton>
              <DeleteIcon />
            </IconButton>
          )}
        </StyledToolbar>
      )}

      <StyledTableContainer>
        <MuiTable ref={ref} {...props}>
          {/* ... implement table header and body here */}
        </MuiTable>
      </StyledTableContainer>

      {pagination && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      )}
    </Paper>
  );
});

table.displayName = 'table';
