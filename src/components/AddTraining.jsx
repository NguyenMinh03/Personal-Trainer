import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function AddTraining({ addTraining, customerData }) {
  const [open, setOpen] = useState(false);
  const [training, setTraining] = useState({
    date: '',
    duration: '',
    activity: '',
    customerName: customerData ? `${customerData.firstname} ${customerData.lastname}` : ''
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    addTraining(training);
    handleClose();
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add Training
      </Button>
      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Training</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Date"
            type="datetime-local"
            value={training.date}
            onChange={e => setTraining({ ...training, date: e.target.value })}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="Duration (minutes)"
            type="number"
            value={training.duration}
            onChange={e => setTraining({ ...training, duration: e.target.value })}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Activity"
            value={training.activity}
            onChange={e => setTraining({ ...training, activity: e.target.value })}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Customer Name"
            value={training.customerName}
            onChange={e => setTraining({ ...training, customerName: e.target.value })}
            fullWidth
            disabled // This field is pre-filled and not intended to be edited
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
