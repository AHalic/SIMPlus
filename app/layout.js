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
					{children}
				</Provider>
			</body>
		</html>
	);
}
