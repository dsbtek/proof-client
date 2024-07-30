/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "1000mb",
    },
  },
  images: {
    remotePatterns: [
      { hostname: "proof-drug-tutorial.s3.amazonaws.com" },
      { hostname: "proofapp--c.na89.content.force.com" },
      { hostname: "proofapp.file.force.com" },
      { hostname: "proofapp.my.salesforce.com" },
      { hostname: "rt-mobiletrekvideos.s3.amazonaws.com" },
      { hostname: "rtlmo--c.na160.content.force.com" },
      { hostname: "rtlmo.file.force.com" },
    ],
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }
    return config;
  },
};
export default nextConfig;
