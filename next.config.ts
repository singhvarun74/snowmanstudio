import type {NextConfig} from 'next';

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const repoName = process.env.REPO_NAME || 'snowmanstudio'; // Updated repository name

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // Enable static HTML export
  basePath: isGithubActions ? `/${repoName}` : '', // Set basePath for GitHub Pages
  assetPrefix: isGithubActions ? `/${repoName}/` : '', // Set assetPrefix for GitHub Pages

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Required for static export if using next/image without a custom loader
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
