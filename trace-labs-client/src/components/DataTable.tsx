import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TablePagination, Paper, TextField, Box, TableSortLabel
} from '@mui/material';

export interface Data {
    blockHash: string;
    blockNumber: string;
    from: string;
    to: string;
    value: string;
    ethUsed: string;
}

interface Props {
    data: Data[];
}

type Order = 'asc' | 'desc';

const DataTable: React.FC<Props> = ({ data }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filters, setFilters] = useState({
        blockNumber: '',
        from: '',
        to: '',
        value: '',
    });

    const [orderBy, setOrderBy] = useState<keyof Data>('blockNumber');
    const [order, setOrder] = useState<Order>('asc');

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSort = (property: keyof Data) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const filteredData = data.filter(row =>
        row.blockNumber.includes(filters.blockNumber) &&
        row.from.toLowerCase().includes(filters.from.toLowerCase()) &&
        row.to.toLowerCase().includes(filters.to.toLowerCase()) &&
        row.value.includes(filters.value)
    );

    const sortedData = filteredData.sort((a, b) => {
        const aVal = a[orderBy];
        const bVal = b[orderBy];
        if (typeof aVal === 'string' && typeof bVal === 'string') {
            return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        return 0;
    });

    const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', p: 2, backgroundColor: '#4a4a4a' }}>
            <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
                <TextField
                    label="Block Number"
                    name="blockNumber"
                    value={filters.blockNumber}
                    onChange={handleFilterChange}
                    size="small"
                    sx={{ input: { color: 'white' }, label: { color: 'white' } }}
                />
                <TextField
                    label="From"
                    name="from"
                    value={filters.from}
                    onChange={handleFilterChange}
                    size="small"
                    sx={{ input: { color: 'white' }, label: { color: 'white' } }}
                />
                <TextField
                    label="To"
                    name="to"
                    value={filters.to}
                    onChange={handleFilterChange}
                    size="small"
                    sx={{ input: { color: 'white' }, label: { color: 'white' } }}
                />
                <TextField
                    label="Value"
                    name="value"
                    value={filters.value}
                    onChange={handleFilterChange}
                    size="small"
                    sx={{ input: { color: 'white' }, label: { color: 'white' } }}
                />
            </Box>

            <TableContainer>
                <Table stickyHeader sx={{ backgroundColor: '#131313' }}>
                    <TableHead>
                        <TableRow>
                            {[
                                { id: 'blockNumber', label: 'Block #' },
                                { id: 'from', label: 'From' },
                                { id: 'to', label: 'To' },
                                { id: 'value', label: 'Value' },
                                { id: 'ethUsed', label: 'ETH Used' },
                                { id: 'blockHash', label: 'Block Hash' },
                            ].map((column) => (
                                <TableCell
                                    key={column.id}
                                    sx={{ color: 'white', backgroundColor: '#0e66bd' }}
                                    sortDirection={orderBy === column.id ? order : false}
                                >
                                    <TableSortLabel
                                        active={orderBy === column.id}
                                        direction={orderBy === column.id ? order : 'asc'}
                                        onClick={() => handleSort(column.id as keyof Data)}
                                        sx={{ color: 'white', '&.Mui-active': { color: 'white' } }}
                                    >
                                        {column.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row, index) => (
                            <TableRow
                                key={index}
                                hover
                                sx={{
                                    backgroundColor: index % 2 === 0 ? '#4a4a4a' : '#303030',
                                    '&:hover': { backgroundColor: '#333333' }
                                }}
                            >
                                <TableCell sx={{ color: 'white' }}>{row.blockNumber}</TableCell>
                                <TableCell sx={{ color: 'white' }}>{row.from}</TableCell>
                                <TableCell sx={{ color: 'white' }}>{row.to}</TableCell>
                                <TableCell sx={{ color: 'white' }}>{row.value}</TableCell>
                                <TableCell sx={{ color: 'white' }}>{row.ethUsed}</TableCell>
                                <TableCell sx={{ color: 'white' }}>{row.blockHash}</TableCell>
                            </TableRow>
                        ))}
                        {paginatedData.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ color: 'white' }}>
                                    No matching records
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={filteredData.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                sx={{ color: 'white' }}
            />
        </Paper>
    );
};

export default DataTable;
