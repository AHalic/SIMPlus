"use client";

import StockListing, { StockListingSkeleton } from "@/components/StockListing";
import { StyledSelect, StyledInput } from "@/components/StyledInputs";
import { Search } from "@mui/icons-material";
import { Grid } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";



export default function Home() {
	const [departments, setDepartments] = useState([])
	const [filterSelected, setFilterSelected] = useState({dept_id: "", id: ""})
	const [stock, setStock] = useState([])
	const [loadingStock, setLoadingStock] = useState(true)


	// fetch departments
	useEffect(()=> {
		axios.get('/api/department')
			.then((response) => {
				setDepartments(response.data.departments)
			})
			.catch((error) => {
				console.log(error)
			})
	}, [])


	// fetch stock
	useEffect(() => {
		setLoadingStock(true)
		
		axios.get('/api/stock', {params: filterSelected})
		.then((response) => {
				setLoadingStock(false)
				console.log(response.data)
				setStock(response.data.stock)
			})
			.catch((error) => {
				console.log(error)
				setLoadingStock(false)
			})
	}, [filterSelected])


    return (
		<Grid 
			container
			direction="column"
			padding="40px 36px"
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
					<StyledSelect 
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
					<StyledInput 
						label="Search By SKU"
						endAdornment={
							<Search sx={{ color: "divider" }} />
						}
						value={filterSelected.id}
					/>
				</Grid>
			</Grid>


			{loadingStock ? (
				<StockListingSkeleton />
			) : (
				<StockListing stock={stock} />
			)}
			
		</Grid>
    );
}
