import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	turbopack: {},
	webpack(config, { dev }) {
		if (!dev) {
			config.devtool = "source-map"; // Enable source maps in production build
		}
		return config;
	},
};

export default nextConfig;
