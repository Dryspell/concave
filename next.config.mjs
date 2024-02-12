/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "uncommon-lobster-459.convex.cloud",
			},
		],
	},
};

export default nextConfig;
