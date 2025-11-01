import { Divider, Grid, Skeleton, Typography } from "@mui/material";
import TableItems from "./TableItems";

export default function StockListing ({ stock }) {

    return (
        <>
            {stock?.length > 0 ? 
                stock?.map((department) => (
                    <Grid
                        key={department.dept_id}
                        container
                        spacing={2}
                        direction="column"
                        sx={{
                            padding: "20px",
                            backgroundColor:"secondary.main",
                            borderRadius: "12px",
                        }}
                    >
                        <Grid>
                            <Typography>
                                {department.dept_name}
                            </Typography>
                        </Grid>

                        <Grid>
                            <TableItems items={department.items} />
                        </Grid>
                    </Grid>
                ))
            : (
                <NoStock />
            )}
        </>
    )
}

function NoStock () {
    return (
        <Grid
            container
            spacing={2}
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{
                padding: "20px",
                backgroundColor:"secondary.main",
                borderRadius: "12px",
            }}
        >
            <Typography fontWeight={600}>
                No Data Available
            </Typography>
        </Grid>
    )
}

function StockListingSkeleton () {
    return (
        <Grid
            container
            spacing={2}
            sx={{
                padding: "20px",
                backgroundColor:"secondary.main",
                borderRadius: "12px",
            }}
            direction="column"
        >
            <Grid size={{ xs: 3 }}>
                <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
            </Grid>

            <Grid 
                container
                sx={{
                    borderRadius: "12px",
                    border: '1px solid',
                    borderColor: 'divider',
                    padding: '18px 12px'
                }}
            >

                <Skeleton variant="rounded" width="100%" height={40} />

                <Divider style={{ width: '100%', borderBottomWidth: '0.5px' }} orientation="horizontal" flexItem variant="fullWidth" component="div" role="presentation" />
                
                <Skeleton variant="rounded" width="100%" height={40} />
                <Skeleton variant="rounded" width="100%" height={40} />
            </Grid>
        </Grid>        
    )
}

export { StockListingSkeleton }
