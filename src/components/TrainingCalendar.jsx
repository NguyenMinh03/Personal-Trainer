import React, { useState, useEffect } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = dayjsLocalizer(dayjs);

export default function TrainingCalendar() {
    const [trainings, setTrainings] = useState([]);

    useEffect(() => {
        getTrainings();
    }, []);

    const getTrainings = () => {
        fetch('https://customerrestservice-personaltraining.rahtiapp.fi/gettrainings')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(responseData => {
                if (!Array.isArray(responseData)) {
                    throw new Error('Data format is incorrect, expected an array of trainings');
                }
                setTrainings(responseData);
            })
            .catch(error => console.error("Fetch Error:", error));
    };

    const events = trainings.map(training => {
        if (!training.customer) {
            console.error('Customer details are missing in training data');
            return null;
        }
        return {
            title: `${training.activity} / ${training.customer.firstname} ${training.customer.lastname}`,
            start: new Date(training.date),
            end: new Date(new Date(training.date).getTime() + (training.duration || 0) * 60000),
            allDay: false 
        };
    }).filter(event => event !== null);

    return (
        <div style={{width:1500, height: 800 }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
            />
        </div>
    );
}
