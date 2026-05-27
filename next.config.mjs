const nextConfig = () => {
  /**
   * @type {import('next').NextConfig}
   */
  return {
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
        },
        {
          protocol: 'https',
          hostname: 's.gravatar.com',
        },
        {
          protocol: 'https',
          hostname: 'cdn.auth0.com',
        },
      ],
      domains: ['s.gravatar.com', 'cdn.auth0.com', 'flagcdn.com'],
    },
    output: 'standalone',
  }
}

export default nextConfig
