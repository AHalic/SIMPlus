"use client";

import { getCookies } from "@/app/actions";
import { OutlinedInput, OutlinedSelect } from "@/components/OtulinedInput";
import { RoleEnum } from "@/models/Enum.js";
import { Alert, Button, Grid, Snackbar, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { use, useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";


export default function UserProfile({ params }) {
    const id = use(params).id ? use(params).id[0] : null

    const [defaultValues, setDefaultValues] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        dept_id: "",
        role: ""
    })
    const [departments, setDepartments] = useState([])
    const [isSubmitLoading, setIsSubmitLoading] = useState(false)
    const [isSuccessSnackbarOpen, setIsSuccessSnackbarOpen] = useState(false)
    const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState()

    const router = useRouter()

    const [cookies, setCookies] = useState();
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        startTransition(async () => {
            const cookie = await getCookies()
            setCookies(cookie)
        })
    }, [])

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
                    setIsSuccessSnackbarOpen(true)
                    reset(defaultValues)
                    router.push(`/users/${response.data._id}`)
                })
                .catch((error) => {
                    setIsErrorSnackbarOpen(error.response?.data?.error || error.message || 'Something went wrong')
                    setIsSubmitLoading(false)
                    console.log(error)
                })        
    }

    const onUpdate = async (data) => {
        setIsSubmitLoading(true)
        
        const formattedData = {
            email: data.email,
            dept_id: data.dept_id,
            role: data.role,
            password: data.password,
        }

        await axios.put(`/api/employee/${id}`, formattedData)
            .then((response) => {
                    setIsSubmitLoading(false)
                    setIsSuccessSnackbarOpen(true)
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

    useEffect(() => {
        if (id != null && id !== 'new') {
            axios.get(`/api/employee/${id}`)
                .then((response) => {
                    const empData = response.data.employee
                    setDefaultValues({
                        ...empData,
                    })
                    reset({
                        ...empData,
                    })
                })
                .catch((error) => {
                    console.log(error)
                    setIsErrorSnackbarOpen(error.response?.data?.error || error.message || 'Something went wrong when getting User data')
                })
        }
    }, [id])



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
                justifyContent="center"
                spacing={3}
                sx={{
                    borderRadius: '12px',
                    backgroundColor: 'secondary.main'
                }}
            >
                <Grid>
                    <Typography variant="h5" fontWeight={600}>
                        {id === 'new' ? 'Add New Employee' : 'Edit Employee'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        {id === 'new' ? 
                            'Fill in the details below to create a new employee profile.' 
                            : 'Update the details below to edit the employee profile.'}
                    </Typography>
                </Grid>

                <form onSubmit={handleSubmit(id === 'new' ? onSubmit : onUpdate)}>
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
                                                disabled={id !== 'new'}
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
                                                disabled={id !== 'new'}
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
                                            validate: (password) => {
                                                if (id !== 'new' && (!password || password.length === 0)) return true

                                                if (!password) return "Field required"
                                                if (password.length < 8) return "Password has to be at least 8 characters"
                                                if (password.length > 20) return "Password has to be at most 20 characters"

                                                const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/
                                                if (!regex.test(password)) return "Password has to have at least a letter, a special character and a number"

                                                return true
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
                                                disabled={cookies?.role !== 'Manager'}
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
                                                disabled={cookies?.role !== 'Manager'}
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
                onClose={() => setIsSuccessSnackbarOpen(false)}
            >
                <Alert
                    onClose={() => setIsSuccessSnackbarOpen(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {id !== 'new' ? "Employee updated!" : "Employee created!"}
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
