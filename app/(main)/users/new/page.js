import { Grid, Typography } from "@mui/material";

export default function NewUser() {
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
                sx={{
                    borderRadius: '12px',
                    backgroundColor: 'secondary.main'
                }}
            >
                <Typography variant="h6" fontWeight={600}>
                    Add New Employee
                </Typography>
            </Grid>
        </Grid>
    )
}
