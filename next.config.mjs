/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/generate-uuid',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
