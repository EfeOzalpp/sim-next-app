import "@ant-design/v5-patch-for-react-19";
import "antd/dist/reset.css";

import { auth } from "@/server/auth/config";

import "./globals.css";

import NavBar from "@/components/NavBar";
import Welcome from "@/components/Welcome";

export default async function RootLayout({ children }) {
	const session = await auth();

	return (
		<html>
			<body>
				<NavBar />
				<div style={{ margin: "1rem" }}>{session ? children : <Welcome />}</div>
			</body>
		</html>
	);
}
