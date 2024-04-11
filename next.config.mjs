/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                // hostname: '',
                hostname: 'www.themealdb.com',
                // port: '',
                // pathname: '/images/media/meals/**'
            },
        ],
    },
};

export default nextConfig;
