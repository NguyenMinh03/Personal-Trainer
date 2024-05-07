// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Customerlist from './components/Customerlist';
import Training from './components/Training';
import TrainingCalendar from './components/TrainingCalendar';

function App() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsDrawerOpen(open);
    };

    return (
        <Router>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Personal Trainer
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                anchor="left"
                open={isDrawerOpen}
                onClose={toggleDrawer(false)}
            >
                <Box
                    sx={{ width: 250 }}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/customers">
                                <ListItemText primary="Customers" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/trainings">
                                <ListItemText primary="Trainings" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/calendar">
                                <ListItemText primary="Training Calendar" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ paddingTop: 8, paddingLeft: 3 }}>
                <Routes>
                    <Route path="/customers" element={<Customerlist />} />
                    <Route path="/trainings" element={<Training />} />
                    <Route path="/calendar" element={<TrainingCalendar />} />
                </Routes>
            </Box>
        </Router>
    );
}

export default App;
