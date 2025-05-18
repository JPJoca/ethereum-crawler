import DataTable, { type Data } from './components/DataTable';
import SearchBar from './components/SearchBar';
import { useState } from "react";
import { CircularProgress, Box } from '@mui/material';

function App() {
    const [results, setResults] = useState<{ blocks: Data[] } | null>(null);
    const [loading, setLoading] = useState(false);

    return (
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
            <SearchBar setResults={setResults} setLoading={setLoading} />

            {loading && <CircularProgress />}

            {!loading && results && <DataTable data={results.blocks} />}
        </Box>
    );
}

export default App;
