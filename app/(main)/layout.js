import Header from "@/components/Header";
import { Grid } from "@mui/material";

export const metadata = {
	title: "SIMPlus - Stock Control",
};

export default function RootLayout({ children }) {
	return (
        <Grid>
            <Header />
            {children}
        </Grid>
	);
}
