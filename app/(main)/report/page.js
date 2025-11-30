"use client";

import StyledDatePickerComponent from "@/components/StyledDatePicker";
import { Alert, Box, Button, Grid, Snackbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { FilledSelect } from "@/components/FilledInputs";
import StyledCheckbox from "@/components/StyledCheckbox";
import { PeriodEnum } from "@/models/Enum";
import Preview from "./Preview";


const defaultValues = {
    start_date: null,
    end_date: null,
    dept_id: "",
    period_slice: "",
    include_best_worst_seller: true,
    include_revenue: true,
    include_forecast: false,
    send_to_email: false,
}

export default function Report() {
    const [departments, setDepartments] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState(false)

    const [previewData, setPreviewData] = useState(null)

    const onReset = () => {
        reset(defaultValues)
    }

    const onSubmit = async (data) => {
        setIsLoading(true)

        const formatedData = {
            ...data,
            start_date: data.start_date ? (new Date(data.start_date)).toISOString() : null,
            end_date: data.end_date ? (new Date(data.end_date)).toISOString() : null,
            dept_name: departments.find((dept) => dept.value === data.dept_id)?.label || "",
        }

        // first generate preview
        await axios.get('/api/report', { params: formatedData })
        .then((res) => {
            setIsLoading(false)
            setPreviewData(res.data)
        })
        .catch((error) => {
            setIsLoading(false)
            console.log(error)
            setIsErrorSnackbarOpen(error.response?.data?.error || error.message || 'Something went wrong');
        })


        // then generate full report
        try {
            const res = await axios.post('/api/report/download', formatedData, { responseType: 'blob' });

            const contentType = (res.headers['content-type'] || '').toLowerCase();
            
            if (contentType.includes('application/json')) {
                const text = await res.data.text();
                const json = JSON.parse(text);
                setIsErrorSnackbarOpen(json.error || json.message || 'Something went wrong');
            } else {
                const url = window.URL.createObjectURL(res.data);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'report.xlsx');
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            const blob = error?.response?.data;
            if (blob && typeof blob.text === 'function') {
                try {
                    const text = await blob.text();
                    const json = JSON.parse(text);
                    setIsErrorSnackbarOpen(json.error || json.message || error.message || 'Something went wrong');
                } catch (parseErr) {
                    setIsErrorSnackbarOpen(error.message || 'Something went wrong');
                }
            } else {
                setIsErrorSnackbarOpen(error.response?.data?.error || error.message || 'Something went wrong');
            }
        }
    }

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues
    })


    useEffect(()=> {
        axios.get('/api/department')
            .then((response) => {
                const transformedDept = response.data.departments?.map((i) => (
                    {value: i._id, label: i.dept_name}
                ))

                setDepartments([{value: "", label: "All Departments"}, ...transformedDept])
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    return (
        <Grid 
            container
            paddingX="32px"
            spacing={2}
            justifyContent="center"
        >
            <Grid
                container
                size={{ xs: 12, xl: 10 }}
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
                        Sales Report
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Select the time period and department to generate your sales report 
                    </Typography>
                </Grid>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>

                        {/* base params */}
                        <Grid spacing={2} container direction="row" alignItems="center">
                            <Grid size={3}>
                                <Controller 
                                    name={`start_date`}
                                    control={control}
                                    rules={{ 
                                        required: "Field required",
                                        validate: (value) => {
                                            const today = new Date();
                                            const selectedDate = new Date(value);
                                            if (selectedDate > today) {
                                                return "Start date cannot be in the future";
                                            }
                                            return true;
                                        }
                                    }}
                                    render={({ field : { onChange, onBlur, value, ref } }) => (
                                        <StyledDatePickerComponent
                                            error={!!errors.start_date}
                                            helperText={errors.start_date?.message}
                                            label="Start Date"
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            value={value}
                                            inputRef={ref}
                                            disableFuture
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid size={3}>
                                <Controller
                                    name={`end_date`}
                                    control={control}
                                    rules={{ 
                                        required: "Field required",
                                        validate: (value) => {
                                            const today = new Date();
                                            const selectedDate = new Date(value);
                                            if (selectedDate > today) {
                                                return "End date cannot be in the future";
                                            }

                                            const startDate = new Date(control._formValues.start_date);
                                            const endDate = new Date(value);
                                            if (startDate && endDate < startDate) {
                                                return "End date cannot be before start date";
                                            }
                                            return true;
                                        }
                                    }}
                                    render={({ field : { onChange, onBlur, value, ref } }) => (
                                        <StyledDatePickerComponent
                                            error={!!errors.end_date}
                                            helperText={errors.end_date?.message}
                                            label="End Date"
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            value={value}
                                            inputRef={ref}
                                            name="end_date"
                                            disableFuture
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid size={3}>
                                <Controller
                                    name={`dept_id`}
                                    control={control}
                                    render={({ field : { onChange, onBlur, value, ref } }) => (
                                        <FilledSelect
                                            error={!!errors.dept_id}
                                            helperText={errors.dept_id?.message}
                                            fullWidth
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            value={value}
                                            inputRef={ref}
                                            label="Filter By Department"
                                            options={departments}
                                        />
                                    )}
                                />
                            </Grid>

                           <Grid size={3}>
                                <Controller 
                                    name={`period_slice`}
                                    control={control}
                                    rules={{
                                        required: "Field required",
                                    }}
                                    render={({ field : { onChange, onBlur, value, ref } }) => (
                                        <FilledSelect
                                            error={!!errors.period_slice}
                                            helperText={errors.period_slice?.message}
                                            label="Slices Period"
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            value={value}
                                            inputRef={ref}
                                            options={PeriodEnum.map((period) => (
                                                { value: period, label: period }
                                            ))}
                                        />
                                    )}
                                />    
                           </Grid>

                        </Grid>

                        {/* report type selection */}                        
                        <Grid>
                            <Typography variant="body1" fontWeight={500}>
                                Select types of report
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>

                            <Grid container direction="row" spacing={2}>
                                <Grid size={3}>
                                    <Controller
                                        name={`include_best_worst_seller`}
                                        control={control}
                                        render={({ field : { onChange, onBlur, value, ref } }) => (
                                            <StyledCheckbox
                                                label="Include Best Worse/Seller"
                                                onChange={(e) => {
                                                    onChange(e)
                                                }}
                                                onBlur={onBlur}
                                                checked={value}
                                                inputRef={ref}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>

                            <Box>
                                <Controller
                                    name={`include_revenue`}
                                    control={control}
                                    render={({ field : { onChange, onBlur, value, ref } }) => (
                                        <StyledCheckbox
                                            label="Include Revenue"
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            checked={value}
                                            inputRef={ref}
                                        />
                                    )}
                                />
                            </Box>

                            <Grid container direction="row" spacing={2}>
                                <Grid size={3}>
                                    <Controller
                                        name={`include_forecast`}
                                        control={control}
                                        render={({ field : { onChange, onBlur, value, ref } }) => (
                                            <StyledCheckbox
                                                label="Include Forecast Revenue"
                                                onChange={(e) => {
                                                    onChange(e)
                                                }}
                                                onBlur={onBlur}
                                                checked={value}
                                                inputRef={ref}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>

                            <Box>
                                <Controller
                                    name={`send_to_email`}
                                    control={control}
                                    render={({ field : { onChange, onBlur, value, ref } }) => (
                                        <StyledCheckbox
                                            label="Send report to Email"
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            checked={value}
                                            inputRef={ref}
                                        />
                                    )}
                                />
                            </Box>
                            </Box>
                        </Grid>

                        <Grid container direction="row" spacing={2} justifyContent="flex-end" alignItems="end">
                            <Grid size={3}>
                                <Button
                                    variant="contained"
                                    type="button"
                                    fullWidth
                                    sx={{ backgroundColor: "divider", textTransform: 'none', borderRadius: '8px', fontWeight: 600 }}
                                    onClick={onReset}
                                >
                                    Reset
                                </Button>
                            </Grid>
                            
                            <Grid size={3}>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    fullWidth
                                    sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 600 }}
                                >
                                    Generate Report
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </form>

            </Grid>

            <Preview data={previewData} isLoading={isLoading} />

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
    )
}
