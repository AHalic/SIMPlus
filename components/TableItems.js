"use client";

import { Chip, Grid, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow } from "@mui/material";
import { useState } from "react";

export default function TableItems({ items }) {
    // TODO: make table generic
    return (
        <Grid 
            container
            sx={{
                borderRadius: "12px",
                border: '1px solid',
                borderColor: 'divider',
                padding: '18px 12px'
            }}
        >
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow 
                            sx={{   
                                '&:last-child th': {
                                    borderBottom: '0.5px solid',
                                    borderColor: 'divider'
                                }, 
                            }}
                        >
                            <TableCell> Name </TableCell>
                            <TableCell align="right">  </TableCell>
                            <TableCell align="right"> Price </TableCell>
                            <TableCell align="right"> SKU </TableCell>
                            <TableCell align="right"> Size </TableCell>
                            <TableCell align="right"> In Stock </TableCell>
                            <TableCell align="right"> Sold this week </TableCell>
                            <TableCell align="right"> Total sold </TableCell>
                        </TableRow>
                    </TableHead>


                    <TableBody>
                        {items.map((it) => (
                            <TableRow key={it.item_id}>
                                <TableCell component="th" scope="row">
                                    {it.item_name}
                                </TableCell>
                                <TableCell align="right"> 
                                    {it.amount < 5 && (
                                        <Chip label="Low" color="error" variant="outlined" />
                                    )}
                                </TableCell>
                                <TableCell align="right"> {it.cost} </TableCell>
                                <TableCell align="right"> {it.item_id} </TableCell>
                                <TableCell align="right"> {it.size} </TableCell>
                                <TableCell align="right"> {it.amount} </TableCell>
                                <TableCell align="right"> {it.sold_this_week} </TableCell>
                                <TableCell align="right"> {it.sold_total} </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>            
        </Grid>
    )
}

export function CompleteInsertTableItems({ items, header=[], properties=[] }) {
    const [page, setPage] = useState(0);

    return (
        <Grid 
            container
            sx={{
                borderRadius: "12px",
                border: '1px solid',
                borderColor: 'divider',
                padding: '18px 12px'
            }}
        >
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow 
                            sx={{   
                                '&:last-child th': {
                                    borderBottom: '0.5px solid',
                                    borderColor: 'divider'
                                }, 
                            }}
                        >
                            
                            {header.map((head, index) => (
                                <TableCell 
                                    key={index}
                                    align={index === 0 ? "left" : "right"}
                                >
                                    {head}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>


                    <TableBody>
                        {items.slice(page * 10, page * 10 + 10)
                            .map((it, index) => (
                                <TableRow key={index}>
                                    {properties.map((prop, propIndex) => (
                                        <TableCell 
                                            align={propIndex === 0 ? "left" : "right"}
                                            key={propIndex}
                                        >
                                            {it[prop]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                        ))}
                    </TableBody>

                    <TableFooter>
                        <TableRow align="right">
                            <TablePagination
                                rowsPerPageOptions={[10]}
                                colSpan={header.length}
                                count={items.length}
                                rowsPerPage={10}
                                page={page}
                                slotProps={{
                                    select: {
                                    inputProps: {
                                        'aria-label': 'rows per page',
                                    },
                                    native: true,
                                    },
                                }}
                                onPageChange={(event, newPage) => setPage(newPage)}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>            
        </Grid>
    )
}
