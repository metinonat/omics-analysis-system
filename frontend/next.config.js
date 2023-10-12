/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DRAWER_WIDTH: process.env.DRAWER_WIDTH,
    API_URL: "http://omics-backend:8080",
  },
};

module.exports = nextConfig;
