/** @type {import('next').NextConfig} */
const serverUrl = new URL(process.env.NEXT_PUBLIC_API_URL2 || 'http://192.168.80.15:5000');
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    experimental: {
        serverActions: {
          bodySizeLimit: '10mb',
        },
    },
    images: {
        domains: [
          'backend-ticket-production-2756.up.railway.app',
          '192.168.80.15',
          // Add any other domains you're loading images from
        ],
      },
};

export default nextConfig;