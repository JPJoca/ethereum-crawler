import axios, {AxiosError} from 'axios';


const BASE_URL = "http://localhost:8080"
export const fetchTransactions = async (walletAddress: string, startBlock: string) => {
    try {
        const response = await axios.get(BASE_URL+'/api/transactions', {
            params: {
                address: walletAddress,
                start_block: startBlock
            }
        });

        const data = response.data;
        console.log('Broj transakcija:', data.number_of_transactions);
        console.log('Transakcije:', data.blocks);

        return data;
    } catch (error) {
        const err = error as AxiosError;

        if (err.response) {
            console.error('Greška sa servera:', err.response.data);
        } else {
            console.error('Greška:', err.message);
        }

        return null;
    }
};