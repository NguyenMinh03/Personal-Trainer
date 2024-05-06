import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import React, { useState } from "react";

export default function AddTraining({ customerId, firstName, lastName }) {
    const [open, setOpen] = useState(false);
    const [training, setTraining] = useState({
      date: "",
      duration: "",
      activity: "",
      customer: `${firstName} ${lastName}` // Now using names instead of a URL
    });

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const handleChange = (event) => {
      setTraining({ ...training, [event.target.name]: event.target.value });
    };

    const addTraining = () => {
      fetch(
        "https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({...training, customer: `https://customerrestservice-personaltraining.rahtiapp.fi/api/customers/${customerId}`}),
        }
      )
        .then((response) => {
          if (response.ok) {
            console.log("Training added successfully");
            handleClose();
          } else {
            alert("Failed to add training. Please try again.");
          }
        })
        .catch((error) => {
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
            <TextField
              required
              margin="dense"
              fullWidth
              variant="standard"
              name="activity"
              label="Activity"
              value={training.activity}
              onChange={handleChange}
            />
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
