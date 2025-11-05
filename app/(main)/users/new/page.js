"use client";

import { OutlinedInput, OutlinedSelect } from "@/components/OtulinedInput";
import { RoleEnum } from "@/models/Enum.js";
import { Alert, Button, Grid, Snackbar, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";


const defaultValues = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    dept_id: "",
    role: ""
}

export default function NewUser() {
    const [departments, setDepartments] = useState([])
    const [isSubmitLoading, setIsSubmitLoading] = useState(false)
    const [isSuccessSnackbarOpen, setIsSuccessSnackbarOpenSnackbar] = useState(false)
    const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState()

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues
    })


    const onSubmit = async (data) => {
        setIsSubmitLoading(true)
        
        await axios.post('/api/employee', data)
            .then((response) => {
                    setIsSubmitLoading(false)
                    setIsSuccessSnackbarOpenSnackbar(true)
                    reset(defaultValues)
                })
                .catch((error) => {
                    setIsErrorSnackbarOpen(error.response?.data?.error || error.message || 'Something went wrong')
                    setIsSubmitLoading(false)
                    console.log(error)
                })        
    }

    const onCancel = () => {
        reset(defaultValues)
    }

    useEffect(()=> {
        axios.get('/api/department')
            .then((response) => {
                const transformedDept = response.data.departments?.map((i) => (
                    {value: i._id, label: i.dept_name}
                ))

                setDepartments(transformedDept)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])



    return (
        <Grid 
			container
			direction="column"
            justifyContent="center"
            alignItems="center"
			padding="32px 52px"
			spacing={2}
		>
            <Grid
                container
                padding="52px 64px"
                size={{ xs: 10, xl: 6 }}
                direction="column"
                spacing={3}
                sx={{
                    borderRadius: '12px',
                    backgroundColor: 'secondary.main'
                }}
            >
                <Grid>
                    <Typography variant="h5" fontWeight={600}>
                        Add New Employee
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        Fill in the details below to create a new employee profile.
                    </Typography>
                </Grid>


                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid 
                        container
                        direction="column"
                        spacing={1}
                    >
                        {/* Form inputs */}
                        <Grid container spacing={4} direction="column">
                            {/* first last name inputs */}
                            <Grid container spacing={6}>
                                <Grid size={{ xs: 6 }}>
                                    <Controller
                                        name={`first_name`}
                                        control={control}
                                        rules={{ 
                                            required: "Field required", 
                                            maxLength: { value: 16, message: "Name has to be at most 16 characters" }, 
                                            minLength: { value: 2, message: "Name has to be at least 2 characters" }
                                        }}
                                        render={({ field : { onChange, onBlur, value, ref } }) => (
                                            <OutlinedInput 
                                                error={!!errors.first_name}
                                                helperText={errors.first_name?.message}
                                                fullWidth
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                value={value}
                                                inputRef={ref}
                                                label="First Name" 
                                                lightLabel 
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 6 }}>
                                    <Controller
                                        name="last_name"
                                        control={control}
                                        rules={{ 
                                            required: "Field required", 
                                            maxLength: { value: 16, message: "Name has to be at most 16 characters" }, 
                                            minLength: { value: 2, message: "Name has to be at least 2 characters" }
                                        }}
                                        render={({ field : { onChange, onBlur, value, ref } }) => (
                                            <OutlinedInput 
                                                error={!!errors.last_name}
                                                helperText={errors.last_name?.message}
                                                fullWidth
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                value={value}
                                                inputRef={ref}
                                                label="Last Name" 
                                                lightLabel 
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>

                            {/* email - password inputs */}
                            <Grid container spacing={6}>
                                <Grid size={{ xs: 6 }}>
                                    <Controller
                                        name="email"
                                        control={control}
                                        rules={{ 
                                            required: "Field required",
                                        }}                                        
                                        render={({ field : { onChange, onBlur, value, ref } }) => (
                                            <OutlinedInput
                                                type="email" 
                                                error={!!errors.email}
                                                helperText={errors.email?.message}
                                                fullWidth
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                value={value}
                                                inputRef={ref}
                                                label="Email" 
                                                lightLabel 
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 6 }}>
                                    <Controller
                                        name={`password`}
                                        control={control}
                                        rules={{ 
                                            required: "Field required", 
                                            maxLength: { value: 20, message: "Password has to be at most 20 characters" }, 
                                            minLength: { value: 8, message: "Password has to be at least 8 characters" },
                                            validate: {
                                                checkFormat: async (password) => {
                                                    //  at least a letter, a special character and a number;
                                                    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;

                                                    if (!regex.test(password)) return "Password has to have at least a letter, a special character and a number"
                                                },
                                            }                                            
                                        }}
                                        render={({ field : { onChange, onBlur, value, ref } }) => (
                                            <OutlinedInput 
                                                error={!!errors.password}
                                                helperText={errors.password?.message}
                                                fullWidth
                                                onChange={onChange}
                                                type="password"
                                                onBlur={onBlur}
                                                value={value}
                                                inputRef={ref}
                                                label="Password" 
                                                lightLabel 
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>

                            {/* department - role inputs */}
                            <Grid container spacing={6}>
                                <Grid size={{ xs: 6 }}>
                                    <Controller
                                        name={`dept_id`}
                                        control={control}
                                        rules={{ 
                                            required: "Field required",
                                        }}
                                        render={({ field : { onChange, onBlur, value, ref } }) => (
                                            <OutlinedSelect 
                                                error={!!errors.dept_id}
                                                helperText={errors.dept_id?.message}
                                                fullWidth
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                value={value}
                                                inputRef={ref}
                                                label="Department" 
                                                lightLabel
                                                options={departments}
                                                variant="outlined" 
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 6 }}>
                                    <Controller
                                        name={`role`}
                                        control={control}
                                        rules={{ 
                                            required: "Field required",
                                        }}
                                        render={({ field : { onChange, onBlur, value, ref } }) => (
                                            <OutlinedSelect 
                                                error={!!errors.role}
                                                helperText={errors.role?.message}
                                                fullWidth
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                value={value}
                                                inputRef={ref}
                                                label="Role" 
                                                lightLabel
                                                options={RoleEnum.map((i) => ({value: i, label: i}))}
                                                variant="outlined" 
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>                            
                        </Grid>

                        {/* Form button */}
                        <Grid container direction="row" alignItems="end" justifyContent="end" spacing={6}>
                            <Grid size={{ xs: 3 }} >
                                <Button 
                                    variant="contained"
                                    onClick={onCancel}
                                    fullWidth
                                    sx={{ backgroundColor: 'divider', textTransform: 'none'}}
                                    disabled={isSubmitLoading}
                                >
                                    Reset form
                                </Button>
                            </Grid>

                            <Grid size={{ xs: 3 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    sx={{ backgroundColor: 'success.main', textTransform: 'none' }}
                                    disabled={isSubmitLoading}
                                >
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </Grid>


            {/* Success Snackbar */}
            <Snackbar
                open={isSuccessSnackbarOpen}
                autoHideDuration={1200}
                onClose={() => setIsSuccessSnackbarOpenSnackbar(false)}
            >
                <Alert
                    onClose={() => setIsSuccessSnackbarOpenSnackbar(false)}
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
