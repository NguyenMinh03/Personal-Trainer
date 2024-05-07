import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export default function AddTraining({ customerId, firstName, lastName }) {
    const [open, setOpen] = useState(false);
    const [activities, setActivities] = useState([]);
    const [training, setTraining] = useState({
        date: '',
        duration: '',
        activity: '',
        customer: `${firstName} ${lastName}`
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        // Store the date as is without converting it immediately
        setTraining(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        fetchTrainings();
    }, []);

    const fetchTrainings = () => {
        fetch('https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const activities = data._embedded.trainings.map(item => item.activity);
                const uniqueActivities = Array.from(new Set(activities));
                setActivities(uniqueActivities);
            })
            .catch(error => {
                console.error('Error fetching activities:', error);
                alert("Failed to fetch activities.");
            });
    };

    const addTraining = () => {
        // Convert date to UTC only when sending the data
        const formattedDate = dayjs(training.date).utc().format();
        const body = JSON.stringify({
            ...training,
            date: formattedDate, // use the formatted date here
            customer: `https://customerrestservice-personaltraining.rahtiapp.fi/api/customers/${customerId}`
        });

        fetch("https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log("Training added successfully");
            handleClose();
        })
        .catch(error => {
            console.error("Error adding training:", error);
            alert("Error adding training. Please try again.");
        });
    };

    return (
        <>
            <Button variant="outlined" onClick={handleClickOpen}>
                Add Training
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Training Information {firstName} {lastName}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        fullWidth
                        variant="standard"
                        type="datetime-local"
                        name="date"
                        value={training.date}
                        onChange={handleChange}
                    />
                    <TextField
                        required
                        margin="dense"
                        fullWidth
                        variant="standard"
                        type="number"
                        name="duration"
                        label="Duration (minutes)"
                        value={training.duration}
                        onChange={handleChange}
                    />
                    <FormControl fullWidth required margin="dense" variant="standard">
                        <InputLabel id="activity-label">Activity</InputLabel>
                        <Select
                            labelId="activity-label"
                            name="activity"
                            value={training.activity}
                            onChange={handleChange}
                            label="Activity"
                        >
                            {activities.map((activity, index) => (
                                <MenuItem key={index} value={activity}>
                                    {activity}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        required
                        margin="dense"
                        fullWidth
                        variant="standard"
                        name="customer"
                        label="Customer"
                        value={training.customer}
                        onChange={handleChange}
                        disabled
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={addTraining} type="submit">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
