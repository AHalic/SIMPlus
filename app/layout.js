import Header from "@/components/Header";
import { Grid } from "@mui/material";
import { Roboto } from "next/font/google";
import Provider from "./providers";

const roboto = Roboto({
	subsets: ["latin"],
	weight: ["400", "600"]
})


export const metadata = {
	title: "SIMPlus",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${roboto.className}`}>
				<Provider>
					<Header />
					{children}
				</Provider>
			</body>
		</html>
	);
}
