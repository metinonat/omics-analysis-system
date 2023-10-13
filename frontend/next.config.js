/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DRAWER_WIDTH: process.env.DRAWER_WIDTH,
    API_URL: "http://localhost:8080",
  },
};

module.exports = nextConfig;
