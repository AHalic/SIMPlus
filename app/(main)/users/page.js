"use client";

import { StockListingSkeleton } from "@/components/StockListing";
import { CompleteInsertTableItems } from "@/components/TableItems";
import { Add, ManageAccounts } from "@mui/icons-material";
import { Alert, Button, Grid, IconButton, Snackbar, Typography } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UsersListPage() {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        axios.get('/api/employee')
            .then(response => {
                setEmployees(response.data.employees);
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
                console.error("There was an error fetching the employees!", error);
                setIsErrorSnackbarOpen(error.response?.data?.error || error.message || 'Something went wrong');
            });
    }, []);


    return (
        <Grid 
            container
            paddingX="32px"
            spacing={2}
            justifyContent="center"
        >
            <Grid
                size={{ xs: 12, xl: 10 }}
                container
                direction="column"
                spacing={2}
                sx={{
                    backgroundColor: 'secondary.main',
                    width: '100%',
                    borderRadius: '12px',
                    padding: '16px',
                }}
            >
                {/* title */}
                <Grid direction="row" container justifyContent="space-between" alignItems="center">
                    <Grid>
                        <Typography variant="h6" fontWeight={600}>
                            Users Management
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            View and manage employee profiles
                        </Typography>
                    </Grid>

                    <Grid>
                        <Link href="/users/new" passHref>
                            <Button variant="contained" color="success" startIcon={<Add />}>
                                Add New User
                            </Button>
                        </Link>
                    </Grid>
                </Grid>

                {isLoading ? (
                    <StockListingSkeleton showTitle={false} />
                ) : (
                    <CompleteInsertTableItems
                        header={["", "NAME", "EMAIL", "ROLE", "DEPARTMENT"]}
                        properties={["icon", "name", "email", "role", "dept_name"]}
                        items={employees.map(emp => ({
                            ...emp,
                            icon: (
                                <Link href={`/users/${emp._id}`} passHref>
                                    <IconButton color="primary">
                                        <ManageAccounts />
                                    </IconButton>
                                </Link>
                            ),
                            name: `${emp.first_name} ${emp.last_name}`,
                        }))}
                    />
                )}
            </Grid>

            <Snackbar
                open={!!isErrorSnackbarOpen}
                autoHideDuration={1200}
                onClose={() => setIsErrorSnackbarOpen(undefined)}
            >
                <Alert
                    onClose={() => setIsErrorSnackbarOpen(undefined)}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {isErrorSnackbarOpen}
                </Alert>
            </Snackbar>   
        </Grid>
    );
}
