"use client";

import DropzoneField from "@/components/Dropzone";
import { CompleteInsertTableItems } from "@/components/TableItems";
import { Alert, Button, Grid, Snackbar, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import readXlsxFile from "read-excel-file";

const schema = {
    name: {
        column: 'name',
        type: String,
        required: true
    },
    item_id: {
        column: 'item_id',
        type: String,
        required: true
    },
    amount: {
        column: 'amount',
        type: Number,
        required: true
    },
    cost: {
        column: 'cost',
        type: Number,
        required: true
    },
    color: {
        column: 'color',
        type: String,
        required: false
    },
    size: {
        column: 'size',
        type: String,
        required: false
    },
    type: {
        column: 'type',
        type: String,
        required: false
    },
    dept_id: {
        column: 'dept_id',
        type: String,
        required: true,
    },
    dept_name: {
        column: 'dept_name',
        type: String,
        required: true,
    },
}

export default function MassItemAddition() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(false);
    const [isSuccessSnackbarOpen, setIsSuccessSnackbarOpen] = useState(false);
    const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState(false);

    const parseFile = (file) => {
        readXlsxFile(file, { 
            schema,
            transformData(data) {
                const keys = Object.keys(schema);

                // remove rows that have required cells empty
                return data.filter((row, i) => {
                    if (i === 0) return true; // skip header row

                    return row.reduce((acc, r, key) => {
                        if (!acc) return false;

                        if (schema[keys[key]].required) {
                            return r !== null && r !== undefined && r !== '';
                        }
                        return true;
                    }, true)
                });
            }
        }).then(({ rows, errors }) => {
            if (errors.length > 0) {
                console.error("Errors parsing file:", errors);
                return;
            }
            console.log("Parsed rows:", rows);
            setItems(rows);
        })
    }
    
    const onSubmit = () => {
        setLoading(true);

        axios.post('/api/items/bulk-insert', { items })
            .then(res => {
                setLoading(false);
                setIsSuccessSnackbarOpen(true);
            }
            ).catch(err => {
                setLoading(false);
                setIsErrorSnackbarOpen(err.response?.data?.error || "An error occurred while adding items.");
                console.error("Error adding items:", err);
            }
        )
    }


    return (
        <Grid
            container
            paddingX="32px"
            spacing={2}
        >
            <Grid
                container
                direction="column"
                spacing={1}
                sx={{
                    backgroundColor: 'secondary.main',
                    width: '100%',
                    borderRadius: '12px',
                    padding: '16px',
                }}
            >
                {/* title */}
                <Grid>
                    <Typography variant="h6" fontWeight={600}>
                        Mass Item Addition
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Upload a file containing all items to be added to the stock
                    </Typography>
                </Grid>

                <DropzoneField onUpload={(file) => parseFile(file)} />
            </Grid>


            <Grid
                container
                direction="column"
                spacing={1}
                sx={{
                    backgroundColor: 'secondary.main',
                    width: '100%',
                    borderRadius: '12px',
                    padding: '16px',
                }}
            >
                <Grid>
                    <Typography variant="h6" fontWeight={600}>
                        Items List
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Items parsed from file will be listed here
                    </Typography>
                </Grid>

                {items.length > 0 && (
                    <Grid>
                        <CompleteInsertTableItems items={items} />

                        <Button
                            variant="contained"
                            sx={{ mt: '16px', textTransform: 'none', borderRadius: '8px', fontWeight: 600, paddingX: '36px', backgroundColor: 'success.main' }}
                            onClick={onSubmit}
                            disabled={loading}
                        >
                            Add Items to Stock
                        </Button>
                    </Grid>
                )}
            </Grid>

            {/* Success Snackbar */}
            <Snackbar
                open={isSuccessSnackbarOpen}
                autoHideDuration={1200}
                onClose={() => setIsSuccessSnackbarOpen(false)}
            >
                <Alert
                    onClose={() => setIsSuccessSnackbarOpen(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Employee created!
                </Alert>
            </Snackbar>

            {/* Failure Snackbar */}
            <Snackbar
                open={!!isErrorSnackbarOpen}
                autoHideDuration={1500}
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
    )
}
