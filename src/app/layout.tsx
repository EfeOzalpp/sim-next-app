import "antd/dist/reset.css";
import { Metadata } from "next";

import { auth } from "@/authentication";

import "./globals.css";
import { ConfigProvider } from "antd";

import NavBar from "@/components/layout/NavBar";

// Global metadata for the application
export const metadata: Metadata = {
	title: "SIM App",
	description: "System for Information Management",
};

// Root layout component that wraps every page and provides global styles and configuration
export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const session = await auth();

	return (
		<html lang="en">
			<body>
				<ConfigProvider
					wave={{ disabled: true }}
					// Ant Design theme configuration
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
					<div style={{ margin: "1rem" }}>{children}</div>
				</ConfigProvider>
			</body>
		</html>
	);
}
