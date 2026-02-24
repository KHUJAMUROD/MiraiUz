/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    'front-ielts.cloudpub.ru'
  ],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
