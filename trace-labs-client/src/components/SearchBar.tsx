import WalletIcon from '@mui/icons-material/Wallet';
import WidgetsIcon from '@mui/icons-material/Widgets';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import React, { useState } from 'react';
import { fetchTransactions } from '../api/AxiosApi.ts';
import type {AxiosError} from "axios";

interface Props {
    setResults: (results: any) => void;
    setLoading: (loading: boolean) => void;
}
const SearchBar: React.FC<Props> = ({ setResults, setLoading }) => {
    const [wallet, setWallet] = useState('');
    const [block, setBlock] = useState('');
    const [walletError, setWalletError] = useState(false);
    const [blockError, setBlockError] = useState(false);


    const handleSearch = async () => {
        let valid = true;


        if (wallet.trim() === '') {
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

        if (!valid) return;

        setLoading(true);

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
        setLoading(false);
    };

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

    <Button variant="contained" onClick={handleSearch}>Search</Button>
        </Box>
);
};

export default SearchBar;
