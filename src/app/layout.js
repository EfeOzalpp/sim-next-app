import "antd/dist/reset.css";

import { auth } from "@/authentication";

import "./globals.css";
import { ConfigProvider } from "antd";

import NavBar from "@/components/layout/NavBar";
import Welcome from "@/components/layout/Welcome";

export default async function RootLayout({ children }) {
	const session = await auth();

	return (
		<html>
			<body>
				<ConfigProvider
					theme={{
						token: {
							borderRadius: 5,
							colorPrimary: "#f26419",
							colorBorder: "#222222",
							lineWidth: 2,
						},
						components: {
							Button: {
								boxShadow: "none",
								boxShadowSecondary: "none",
								boxShadowTertiary: "none",
							},
							Input: {
								boxShadow: "none",
							},
							Select: {
								boxShadow: "none",
							},
							Card: {
								colorBorderSecondary: "#222222",
							},
						},
					}}
				>
					<NavBar session={session} />
					<div style={{ margin: "1rem" }}>{session ? children : <Welcome />}</div>
				</ConfigProvider>
			</body>
		</html>
	);
}
