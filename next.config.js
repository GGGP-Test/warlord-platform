/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' for server-side deployment
  // Use 'standalone' for optimized Docker deployment
  output: 'standalone',
  
  images: {
    unoptimized: true,
  },
  
  // Default .next directory for server deployment
  // distDir: 'out' is only for static exports
};

module.exports = nextConfig;
