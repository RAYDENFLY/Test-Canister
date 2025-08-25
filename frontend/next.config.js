/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  webpack: (config, { isServer }) => {
    // Enable WebAssembly support for packages that ship .wasm files (argon2-browser)
    config.experiments = {
      ...(config.experiments || {}),
      asyncWebAssembly: true,
    };

    // Treat .wasm files as async WebAssembly modules
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    // Prevent bundling Node built-ins that some browser-targeted packages reference at build time
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs: false,
      path: false,
      os: false,
    };

    // Alias argon2-browser to a lightweight shim during builds to avoid bundling WASM
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'argon2-browser': require('path').resolve(__dirname, 'src/lib/argon2-shim.ts'),
    };

    return config;
  },
};

module.exports = nextConfig;

