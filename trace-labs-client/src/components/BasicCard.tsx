import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

type BasicCardProps = {
    date: string;
    balance: string | number;
    address: string;
};

const BasicCard: React.FC<BasicCardProps> = ({ date, balance, address }) => {
    return (
        <Card sx={{ color: 'white', backgroundColor: '#0e66bd'}}>
            <CardContent>
                <Typography gutterBottom sx={{ color: 'black', fontSize: 14 }}>
                    {date}
                </Typography>
                <Typography sx={{ color: 'black', mb: 1.5 }}>
                    {balance} ETH
                </Typography>
                <Typography variant="body2">
                    {address}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default BasicCard;
