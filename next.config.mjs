/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.logo.dev" },
    ],
    // Next's default is "attachment", which stops our own logo assets from
    // rendering inline via the image optimizer (forces a download instead).
    contentDispositionType: "inline",
  },
};

export default nextConfig;
