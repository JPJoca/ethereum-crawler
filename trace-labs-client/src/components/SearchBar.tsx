import WalletIcon from '@mui/icons-material/Wallet';
import WidgetsIcon from '@mui/icons-material/Widgets';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import React, {useEffect, useState} from 'react';
import {fetchTransactions, fetchValue} from '../api/AxiosApi.ts';
import type {AxiosError} from "axios";
import DateRangeIcon from '@mui/icons-material/DateRange';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type {Data, EthBalanceResponse} from '../models';
interface Props {
    setResults: (results: { blocks: Data[] } | null) => void;
    setLoading: (loading: boolean) => void;
    setCardResoults: (res: EthBalanceResponse | null) => void;
}
const SearchBar: React.FC<Props> = ({ setResults, setLoading, setCardResoults }) => {
    const [wallet, setWallet] = useState('');
    const [block, setBlock] = useState('');
    const [walletError, setWalletError] = useState(false);
    const [blockError, setBlockError] = useState(false);
    const [date, setDate] = useState<Date | null>(null);
    const [dateError, setDateError] = useState(false);

    const isValidEthereumAddress = (addr: string): boolean => {
        return /^0x[a-fA-F0-9]{40}$/.test(addr);
    };
    const handleSearch = async () => {
        let valid = true;


        if (!isValidEthereumAddress(wallet)) {
            setWalletError(true);
            return;
        } else {
            setWalletError(false);
        }

        const finalBlock = block.trim() === '' ? '0' : block.trim();
        if (!/^\d+$/.test(finalBlock)) {
            setBlockError(true);
            valid = false;
        } else {
            setBlockError(false);
        }

        if (date && block.trim() !== '') {
            setDateError(true);
            valid = false;
        } else {
            setDateError(false);
        }


        if (!valid) return;

        setLoading(true);

        if(!date) {
            try {
                const result = await fetchTransactions(wallet, finalBlock);
                setResults(result);
            } catch (error) {
                const err = error as AxiosError;

                if (err.response) {
                    console.error('Greška sa servera:', err.response.data);
                } else if (err.request) {
                    console.error('Greška u zahtevu:', err.message);
                } else {
                    console.error('Greška:', err.message);
                }
            }
        }else{
            try {
                const dateStart = new Date(date);
                dateStart.setUTCHours(0, 0, 0, 0);
                const result = await fetchValue(wallet, dateStart.toISOString());
                setCardResoults(result);
            } catch (error) {
                const err = error as AxiosError;

                if (err.response) {
                    console.error('Greška sa servera:', err.response.data);
                } else if (err.request) {
                    console.error('Greška u zahtevu:', err.message);
                } else {
                    console.error('Greška:', err.message);
                }
            }

        }
        setLoading(false);
    };
    useEffect(() => {
        const trimmed = block.trim();
        const isBlockFilled = /^\d+$/.test(trimmed) && trimmed !== '0';
        setDateError(Boolean(date && isBlockFilled));
    }, [date, block]);


    return (
        <Box
            sx={{
        p: 3,
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            width: "fit-content",
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: '#4a4a4a',
            flexWrap: 'wrap'
    }}
>
    <TextField
        id="input-wallet"
    label="Wallet"
    variant="standard"
    onChange={(e) => setWallet(e.target.value)}
    error={walletError}
    helperText={walletError ? 'Wallet must not be empty.' : ''}
    slotProps={{
        input: {
            startAdornment: (
                <InputAdornment position="start">
                    <WalletIcon />
                    </InputAdornment>
            )
        }
    }}
    />

    <TextField
    id="input-block"
    label="From block"
    variant="standard"
    onChange={(e) => setBlock(e.target.value)}
    error={blockError}
    helperText={blockError ? 'Block must be a number or empty.' : ''}
    slotProps={{
        input: {
            startAdornment: (
                <InputAdornment position="start">
                    <WidgetsIcon />
                    </InputAdornment>
            )
        }
    }}
    />

    <DatePicker
        label="Select date"
        value={date}
        onChange={(newDate) => setDate(newDate)}
        slotProps={{
            textField: {
                variant: 'standard',
                error: dateError,
                helperText: dateError ? 'Date and block can’t be filled at the same time.' : '',
                InputProps: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <DateRangeIcon />
                        </InputAdornment>
                    ),
                },
            },
        }}
    />

    <Button variant="contained" onClick={handleSearch}>Search</Button>
        </Box>
);
};

export default SearchBar;
