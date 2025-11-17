"use client";

import StockListing, { StockListingSkeleton } from "@/components/StockListing";
import { FilledSelect, FilledInput } from "@/components/FilledInputs";
import { Search } from "@mui/icons-material";
import { Alert, darken, Grid, IconButton, Snackbar, useTheme } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";



export default function Home() {
	const [departments, setDepartments] = useState([])
	const [filterSelected, setFilterSelected] = useState({dept_id: "", id: ""})
	const [skuType, setSkuType] = useState("")
	const [stock, setStock] = useState([])
	const [loadingStock, setLoadingStock] = useState(true)
	const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState()

	const theme = useTheme()


	// fetch departments
	useEffect(()=> {
		axios.get('/api/department')
			.then((response) => {
				setDepartments(response.data.departments)
			})
			.catch((error) => {
				console.log(error)
				setIsErrorSnackbarOpen(error.response?.data?.error || error.message || 'Failed to fetch departments')
			})
	}, [])


	// fetch stock
	useEffect(() => {
		setLoadingStock(true)
		
		axios.get('/api/stock', {params: filterSelected})
		.then((response) => {
				setLoadingStock(false)
				setStock(response.data.stock)
			})
			.catch((error) => {
				console.log(error)
				setLoadingStock(false)
				setIsErrorSnackbarOpen(error.response?.data?.error || error.message || 'Failed to fetch stock')
			})
	}, [filterSelected])


    return (
		<Grid 
			container
			direction="column"
			padding="16px 36px"
			spacing={2}
		>
			{/* Search bar */}
			<Grid 
				container
				spacing={2}
				sx={{ 
					padding: "20px",
					backgroundColor:"secondary.main",
					borderRadius: "12px",
				}}
			>
				<Grid size={{ xs:4 }}>
					<FilledSelect 
						label="Filter By Department" 
						options={[
							{value: "", label: "All"},
							...departments?.map((i) => (
								{value: i._id, label: i.dept_name}
							))
						]
						}
						onChange={(e) => {
							setFilterSelected(prev => ({...prev, dept_id: e.target.value}))}
						}
						value={filterSelected.dept_id}
					/>
				</Grid>

				<Grid size={{ xs:8 }}>
					<FilledInput 
						label="Search By SKU"
						endAdornment={
							<IconButton
								onClick={(e) => setFilterSelected(prev => ({...prev, id: skuType}))}
								sx={{ 
									borderRadius: "12px",
									marginRight: '-14px',
									backgroundColor: darken(theme.palette.background.default, 0.05),
								}}
							>
								<Search sx={{ color: "divider" }} />
							</IconButton>
						}
						value={skuType}
						onChange={(e) => setSkuType(e.target.value)}
					/>
				</Grid>
			</Grid>


			{loadingStock ? (
				<StockListingSkeleton />
			) : (
				<StockListing stock={stock} />
			)}
			

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
    );
}
