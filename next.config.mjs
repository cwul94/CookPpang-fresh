/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'codingapple-cdn.b-cdn.net',
                port: '',
                pathname: '/wp-content/uploads/2023/01/*'
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'phinf.pstatic.net',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'ssl.pstatic.net',
                port: '',
            },
            {
                protocol: 'http',
                hostname: 'k.kakaocdn.net',
                port: '',
            },
        ],
    },
};

export default nextConfig;
