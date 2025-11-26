"use client";

import { DescriptionOutlined } from "@mui/icons-material";
import { alpha, Button, Grid, Typography, useTheme } from "@mui/material";
import { useDropzone } from "react-dropzone";

export default function DropzoneField ({ onUpload }) {
    const {getRootProps, getInputProps, isDragActive, acceptedFiles, fileRejections} = useDropzone({accept: {'text/.xlsx': ['.xlsx']}, maxFiles: 1})
    const theme = useTheme();

    
    return (
        <Grid>
            <Grid 
                sx={{
                    border: `2px dashed`,
                    borderColor: "divider",
                    borderRadius: '12px',
                    color: "text.secondary",
                    backgroundColor: alpha(theme.palette.divider, 0.1),
                }}
            >
                <div style={{ padding: '64px 16px' }} {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Grid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                    >
                        {isDragActive ? (
                            <Typography sx={{ color:"divider", py: '16px' }}>Drop the file here</Typography> 
                        ) : (
                            <>
                                <DescriptionOutlined sx={{ color:"divider" }} fontSize="large" />
                                <Typography sx={{ color:"divider" }}>Drag and drop file here or click to select one</Typography>
                            </>
                        )}
                    </Grid>
                </div>
            </Grid>
            
            <Grid sx={{ marginY: '16px' }} container direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                {acceptedFiles.length > 0 && (
                    <>
                        <Grid width="fit-content">
                            <Typography variant="subtitle2" fontWeight={600}>
                                Accepted file:
                            </Typography>
                                {acceptedFiles.map(file => (
                                    <Typography variant="body2" color="text.secondary" key={file.path}>
                                        {file.path}
                                    </Typography>
                                ))}
                        </Grid>

                        <Grid>
                            <Button variant="contained" 
                                sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 600, paddingX: '32px' }}
                                onClick={() => onUpload(acceptedFiles[0])}
                            >
                                Parse File
                            </Button>
                        </Grid>
                    </>
                )}

                {fileRejections.map(({ file, errors }) => (
                    errors.map(e => (
                        <Typography variant="body2" color="error.main" key={e.code}>
                            {e.message}
                        </Typography>
                    ))
                ))}
            </Grid>
        </Grid>
    )
}
