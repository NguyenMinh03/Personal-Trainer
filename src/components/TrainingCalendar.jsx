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
        fetch('https://customerrestservice-personaltraining.rahtiapp.fi/gettrainings', { method: 'GET' })
            .then(response => response.json())
            .then(responseData => {
                setTrainings(responseData);
            })
            .catch(error => console.error("Fetch Error:", error));
    };

    const events = trainings.map(training => {
        return {
            title: `${training.activity} / ${training.customer.firstname} ${training.customer.lastname}`,
            start: new Date(training.date),
            end: new Date(new Date(training.date).getTime() + training.duration * 60000),
            allDay: false 
        };
    });

    return (
        <div style={{ height: 700 }}>
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
