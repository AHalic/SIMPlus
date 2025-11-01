"use client";

import CustomInput from "@/components/Input";
import { Button, Grid, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";

export default function NewUser() {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = (data) => {
        // TODO: handle submit
    }

    const onCancel = () => {
        // TODO: handle cancel
        // navigate back or reset form
    }


    return (
        <Grid 
			container
			direction="column"
			padding="36px 52px"
			spacing={2}
		>
            <Grid
                container
                padding="28px"
                direction="column"
                sx={{
                    borderRadius: '12px',
                    backgroundColor: 'secondary.main'
                }}
            >
                <Typography variant="h6" fontWeight={600}>
                    Add New Employee
                </Typography>


                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid 
                        container
                        direction="column"
                        spacing={4}
                    >
                        {/* Form inputs */}
                        <Grid container spacing={3} direction="column">
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 6 }}>
                                    <Controller
                                        name={`first_name`}
                                        control={control}
                                        rules={{ 
                                            required: "Field required", 
                                            maxLength: { value: 16, message: "Name has to be at most 16 characters" }, 
                                            minLength: { value: 5, message: "Name has to be at least 5 characters" }
                                        }}
                                        render={({ field : { onChange, onBlur, value, ref } }) => (
                                            <CustomInput 
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
                                            minLength: { value: 5, message: "Name has to be at least 5 characters" }
                                        }}
                                        render={({ field : { onChange, onBlur, value, ref } }) => (
                                            <CustomInput 
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

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 6 }}>
                                    <Controller
                                        name={`password`}
                                        control={control}
                                        rules={{ 
                                            // TODO: validate format
                                            required: "Field required", 
                                            maxLength: { value: 20, message: "Password has to be at most 20 characters" }, 
                                            minLength: { value: 8, message: "Password has to be at least 8 characters" }
                                        }}
                                        render={({ field : { onChange, onBlur, value, ref } }) => (
                                            <CustomInput 
                                                error={!!errors.password}
                                                helperText={errors.password?.message}
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
                                        name="email"
                                        control={control}
                                        rules={{ 
                                            // TODO: validate format
                                            required: "Field required",
                                        }}                                        
                                        render={({ field : { onChange, onBlur, value, ref } }) => (
                                            <CustomInput 
                                                error={!!errors.email}
                                                helperText={errors.email?.message}
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

                            {/* TODO: add inputs for role and dpt  */}
                        </Grid>

                        {/* Form button */}
                        <Grid container direction="row" justifyContent="end" spacing={3}>
                            <Grid size={{ xs: 3 }} >
                                <Button variant="contained" onClick={onCancel} fullWidth sx={{ backgroundColor: 'divider'}}>
                                    Cancel
                                </Button>
                            </Grid>

                            <Grid size={{ xs: 3 }}>
                                <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: 'success.main'}}>
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    )
}
