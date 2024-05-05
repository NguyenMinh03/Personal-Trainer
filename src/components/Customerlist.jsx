import React, { useEffect, useState, useCallback } from "react";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { Paper, Typography, TextField, Box } from '@mui/material';
import AddCustomer from "./AddCustomer";
import { getCustomers } from "./customerapi";
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import EditCustomer from "./EditCustomer";
import AddTraining from "./AddTraining";
function Customerlist() {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [pageSize] = useState(20);
    const [addTrainingOpen, setAddTrainingOpen] = useState(false);
    const colDefs = [
        
        {
            headerName: 'Action',
            cellRenderer: params => (
                <div style={{  alignItems: 'center', gap: '10px' }}>
                   <IconButton>
                   <EditCustomer data={params.data} updateCustomer={updateCustomer} />
                   </IconButton>
                   
                    <IconButton
                        onClick={() => deleteCustomer(params.data._links.customer.href)}
                        color="error"
                        aria-label="delete customer"
                        size="small">
                        <DeleteIcon />
                    </IconButton>

                </div>
            ),
            width: 300,
    
        },
    
        { headerName: 'First Name', field: 'firstname', sortable: true, filter: true },
        { headerName: 'Last Name', field: 'lastname', sortable: true, filter: true },
        { headerName: 'Email', field: 'email', sortable: true, filter: true },
        { headerName: 'Phone', field: 'phone', sortable: true, filter: true },
        { headerName: 'Address', field: 'streetaddress', sortable: true, filter: true },
        { headerName: 'Postcode', field: 'postcode', sortable: true, filter: true },
        { headerName: 'City', field: 'city', sortable: true, filter: true },
    ];

    const fetchCustomers = useCallback(() => {
        getCustomers()
            .then(data => {
                const allCustomers = data._embedded.customers;
                setCustomers(allCustomers);
            })
            .catch(err => console.error("Failed to fetch customers:", err));
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    useEffect(() => {
        if (search.length === 0) {
            fetchCustomers();
        } else {
            setCustomers(prevCustomers => prevCustomers.filter(customer =>
                customer.firstname?.toLowerCase().includes(search.toLowerCase()) ||
                customer.lastname?.toLowerCase().includes(search.toLowerCase())
            ));
        }
    }, [search, fetchCustomers]);
    const deleteCustomer = useCallback((url) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            fetch(url, { method: 'DELETE' })
            .then(response => {
                if (!response.ok)
                    throw new Error("Error in deletion: " + response.statusText);
                console.log("Customer deleted successfully.");
                fetchCustomers(); 
            })
            .catch(err => {
                console.error("Error during deletion:", err);
            });
        }
    }, [fetchCustomers]); 
    

    const addCustomer = useCallback((newCustomer) => {
        const apiUrl = 'https://customerrestservice-personaltraining.rahtiapp.fi/api/customers';
        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCustomer)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error when adding a customer: " + response.statusText);
            }
            return response.json();
        })
        .then(fetchCustomers) // Refresh customer list after adding
        .catch(err => console.error('Error adding customer:', err));
    }, [fetchCustomers]);

    const updateCustomer = (url, updatedCustomer) => {
        fetch(url, {
            method: 'PUT',
            headers: { 'content-type' : 'application/json' },
            body: JSON.stringify(updatedCustomer)
        })
        .then(response => {
            if (!response.ok)
                throw new Error("Error when updating customer");

            return response.json();
        })
        .then(() => fetchCustomers())
        .catch(err => console.error(err))
    }
    return (
        <Paper style={{ padding: '30px', width: '90vw', margin: 'auto', overflowX: 'auto' }}>
            <Typography variant="h5" style={{ marginBottom: '20px' }}>Customers</Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
                <TextField
                    label="Search by name"
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <AddCustomer addCustomer={addCustomer} />
            </Box>
            <div className="ag-theme-material" style={{ width: '100%', height: '70vh' }}>
                <AgGridReact
                    rowData={customers}
                    columnDefs={colDefs}
                    pagination={true}
                    paginationPageSize={pageSize}
                />
            </div>
        </Paper>
    );
}

export default Customerlist;
