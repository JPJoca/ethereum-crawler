import DataTable from './components/DataTable';
import SearchBar from './components/SearchBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import React, { useState } from "react";
import { CircularProgress, Box } from '@mui/material';
import type { Data, EthBalanceResponse } from './models';
import BasicCard from "./components/BasicCard.tsx";

function CustomTabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function App() {
    const [results, setResults] = useState<{ blocks: Data[] } | null>(null);
    const [cardResoults, setcardResoults] = useState<EthBalanceResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'start',
                    padding: 4,
                    gap: 4
                }}
            >
                <SearchBar setResults={setResults} setLoading={setLoading} setCardResoults={setcardResoults} />


                <Box sx={{ maxWidth: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'gray' ,width: 1025, mx: 'auto'}}>
                        <Tabs  value={tabIndex} onChange={handleChange} aria-label="tabs">
                            <Tab sx={{color:'white'}} label="Transactions" {...a11yProps(0)} />
                            <Tab sx={{color:'white'}}  label="Balance" {...a11yProps(1)} />
                        </Tabs>
                    </Box>

                    <CustomTabPanel value={tabIndex} index={0}>
                        {loading && <CircularProgress />}
                        {!loading && results && <DataTable data={results.blocks} />}
                    </CustomTabPanel>

                    <CustomTabPanel value={tabIndex} index={1}>
                        {loading && <CircularProgress />}
                        {!loading && cardResoults && (
                            <BasicCard
                                date={cardResoults.date}
                                balance={cardResoults.balance}
                                address={cardResoults.address}
                            />
                        )}
                    </CustomTabPanel>
                </Box>
            </Box>
        </LocalizationProvider>
    );
}

export default App;
