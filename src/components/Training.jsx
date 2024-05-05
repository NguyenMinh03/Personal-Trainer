import React, { useEffect, useState } from 'react';
import { getTraining } from './trainingapi';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { Paper, Typography, Box } from '@mui/material';

function TrainingList() {
    const [trainings, setTrainings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTrainingData = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await getTraining();
                const trainingData = data._embedded.trainings;
                const trainingsWithCustomer = await Promise.all(trainingData.map(async (training) => {
                    try {
                        const resp = await fetch(training._links.customer.href);
                        const customerData = await resp.json();
                        return {
                            ...training,
                            customerName: `${customerData.firstname} ${customerData.lastname}`
                        };
                    } catch (error) {
                        console.error('Failed to fetch customer data', error);
                        throw new Error('Failed to fetch customer data');
                    }
                }));
                setTrainings(trainingsWithCustomer);
            } catch (error) {
                console.error('Error fetching trainings:', error);
                setError('Failed to fetch trainings');
            } finally {
                setLoading(false);
            }
        };

        fetchTrainingData();
    }, []);

    const colDefs = [
        {
            headerName: "Date", 
            field: "date", 
            cellRenderer: ({ value }) => {
                const date = new Date(value);
                return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            }
        },
        { headerName: "Duration (mins)", field: "duration" },
        { headerName: "Activity", field: "activity" },
        { headerName: "Customer", field: "customerName" }
    ];

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <Paper style={{ padding: '30px', width: '60vw', margin: 'auto', overflowX: 'auto' }}>
            <Typography variant="h5" style={{ marginBottom: '20px' }}>Training Sessions</Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
                <div className="ag-theme-material" style={{ height: 'calc(100vh - 64px)', width: '100%' }}>
                    <AgGridReact 
                        rowData={trainings}
                        columnDefs={colDefs}
                        domLayout='autoHeight'
                    />
                </div>
            </Box>
        </Paper>
    );
}

export default TrainingList;
