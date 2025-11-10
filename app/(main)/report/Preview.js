"use client";
import { DescriptionOutlined } from "@mui/icons-material";
import { alpha, Box, Container, Divider, Grid, Typography, useTheme } from "@mui/material";

export default function Preview({ data }) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                backgroundColor: 'secondary.main',
                width: '100%',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}
        >
            <Grid>
                <Typography variant="h6" fontWeight={600}>
                    Report Preview
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Your generated report will appear here
                </Typography>
            </Grid>

            <Box
                sx={{
                    backgroundColor: alpha(theme.palette.divider, 0.1),
                    borderRadius: '8px',
                    padding: '24px',
                    border: '2px dashed',
                    borderColor: 'divider',
                }}
            >
                {data ? (
                    <>
                        <Box width="fit-content" marginBottom="12px">
                            <Typography variant="body1" fontWeight={600}>
                                Sales Report
                            </Typography>
                            <Typography variant="body1" sx={{color:"text.secondary"}}>
                                Period: {(new Date(data?.start_date)).toLocaleDateString()} - {(new Date(data?.end_date)).toLocaleDateString()}
                                &nbsp; | Department: {data?.dept_name}
                            </Typography>                 
                            <Divider 
                                sx={{ 
                                    borderColor: alpha(theme.palette.divider, 0.2),
                                    marginTop: '12px'
                                }} 
                            />
                        </Box>

                        <Grid container sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Typography variant="body1" sx={{color:"text.secondary"}} fontWeight={600}>
                                Revenue Summary:
                            </Typography>
                            
                            <Grid
                                size={{ xs: 6, md: 3 }}
                                sx={{
                                    backgroundColor: 'secondary.main',
                                }}
                                padding="20px"
                                borderRadius="8px"
                                alignItems="flex-start"
                            >
                                <Typography variant="body2" sx={{ textTransform: 'uppercase' }} color="text.secondary">
                                    Total Revenue:
                                </Typography>
                                <Typography variant="h6" fontWeight={600}>
                                    ${data?.total_sale.toFixed(2)}
                                </Typography>
                            </Grid>

                            <Typography variant="body1" sx={{color:"text.secondary"}} fontWeight={600}>
                                Performance Metrics:
                            </Typography>

                            <Container maxWidth="100%" disableGutters sx={{ display: 'flex', flexDirection: 'row', gap: '16px', padding: 0, margin: 0 }}>
                                <Grid 
                                    size={{ xs: 6, md: 3 }}
                                    sx={{
                                        backgroundColor: 'secondary.main',
                                    }}
                                    padding="20px"
                                    borderRadius="8px"
                                >
                                    <Typography variant="body2" sx={{ textTransform: 'uppercase' }} color="text.secondary">
                                        Total Orders:
                                    </Typography>
                                    <Typography variant="h6" fontWeight={600}>
                                        {data?.total_transactions}
                                    </Typography>
                                </Grid>

                                <Grid 
                                    size={{ xs: 6, md: 3 }}
                                    sx={{
                                        backgroundColor: 'secondary.main',
                                        maxHeight: 'fit-content'
                                    }}
                                    padding="20px"
                                    borderRadius="8px"
                                >
                                    <Typography variant="body2" sx={{ textTransform: 'uppercase' }} color="text.secondary">
                                        Avg Order Value:
                                    </Typography>
                                    <Typography variant="h6" fontWeight={600}>
                                        ${data?.avg_transaction}
                                    </Typography>
                                </Grid>
                            </Container>

                            <Box>
                                <Typography variant="body1" sx={{color:"text.secondary"}} fontWeight={600}>
                                    Top Product:
                                </Typography>
                                <Typography variant="body1" sx={{color:"text.secondary"}}>
                                    {data?.top_product}
                                </Typography>        
                            </Box>
                        </Grid>
                    </>
                ) : (
                    <Grid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        sx={{ height: '100%' }}
                    >
                        <DescriptionOutlined sx={{ color:"divider" }} fontSize="large" />
                        <Box alignItems="center" textAlign="center">
                            <Typography variant="body1" sx={{ color:"divider" }} fontWeight={600}>
                                No preview available
                            </Typography>
                            <Typography variant="body1" sx={{ color:"divider" }}>
                                Generate the report to see a preview
                            </Typography>
                        </Box>
                    </Grid>
                )}
            </Box>
        </Box>
    )
}
