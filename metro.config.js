const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable symlinks support
config.resolver.symlinks = false;

// Enhanced resolver configuration for better module resolution
config.resolver.assetExts.push(
  // Adds support for additional assets
  'bin'
);

// Improve caching and bundling performance
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

module.exports = config;