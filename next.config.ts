import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [new URL('https://www.ku.ac.th/**')]
    }
}

export default nextConfig
