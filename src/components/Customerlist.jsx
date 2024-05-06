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
    const [gridApi, setGridApi] = useState(null);
    const onGridReady = (params) => {
        setGridApi(params.api);
      };
    const colDefs = [
        
        {
            headerName: 'Action',
            cellRenderer: params => (
                <div style={{  alignItems: 'center', gap: '10px' }}>
                   <IconButton>
                   <EditCustomer data={params.data} updateCustomer={updateCustomer} />
                   </IconButton>
                   
                    <IconButton
                        
                        color="error"
                        aria-label="delete customer"
                        size="small">
                        <DeleteIcon className="deleteButton" onClick={() => confirmDelete(params.data)}/>
                    </IconButton>
                    
                </div>
            ),
            width: 150,
            suppressMenu: true,
        suppressColumnsToolPanel: true
    
        },
        {
            headerName: "Add Training",
            width: 200,
            suppressMenu: true,
        suppressColumnsToolPanel: true,
            cellRenderer: (params) => (
              <div>
                <AddTraining customerId={params.data.id} firstName={params.data.firstname} lastName={params.data.lastname} /> 
              </div>
            ),
          },
        { headerName: 'First Name', field: 'firstname', sortable: true, filter: true },
        { headerName: 'Last Name', field: 'lastname', sortable: true, filter: true },
        { headerName: 'Email', field: 'email', sortable: true, filter: true },
        { headerName: 'Phone', field: 'phone', sortable: true, filter: true },
        { headerName: 'Address', field: 'streetaddress', sortable: true, filter: true },
        { headerName: 'Postcode', field: 'postcode', sortable: true, filter: true },
        { headerName: 'City', field: 'city', sortable: true, filter: true },
    ];
    const onExportClick = useCallback(() => {
        gridApi.exportDataAsCsv({
            columnKeys: ['firstname', 'lastname', 'email', 'phone', 'streetaddress', 'postcode', 'city'], // Specify fields to export
            fileName: 'customers.csv'
        });
    }, [gridApi]);
    
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
useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("https://customerrestservice-personaltraining.rahtiapp.fi/api/customers")
      .then((response) => response.json())
      .then((data) => {
        const customersWithId = data._embedded.customers.map((customer) => ({
          ...customer,
          id: extractIdFromHref(customer._links.self.href),
        }));
        setCustomers(customersWithId);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

    const confirmDelete = (data) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
        if (confirmDelete) {
          handleDelete(data);
        }
      };
    
    const handleDelete = (data) => {
        const id = extractIdFromHref(data._links.self.href); 
        fetch(`https://customerrestservice-personaltraining.rahtiapp.fi/api/customers/${id}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (response.ok) {
              // Delete the customer from the local state
              setCustomers((prevCustomers) =>
                prevCustomers.filter((customer) => customer.id !== id)
              );
              // Fetch the updated list of customers
              fetchData();
            } else {
              throw new Error("Failed to delete customer");
            }
          })
          .catch((error) => console.error("Error deleting customer:", error));
      };
    
      const extractIdFromHref = (href) => {
        const parts = href.split("/");
        return parts[parts.length - 1];
      };
    
    

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
                 <div>
                <Button onClick={onExportClick} variant="contained" color="primary" sx={{ marginRight: 2 }}>
                    Export CSV
                </Button>
                <AddCustomer addCustomer={addCustomer} />
            </div>
                
            </Box>
            <div className="ag-theme-material" style={{ width: '100%', height: '70vh' }}>
                <AgGridReact
                rowSelection="single"
                animateRows={true}
                    rowData={customers}
                    columnDefs={colDefs}
                    pagination={true}
                    paginationPageSize={pageSize}
                    onGridReady={params => setGridApi(params.api)}
                />
            </div>
        </Paper>
    );
}

export default Customerlist;
