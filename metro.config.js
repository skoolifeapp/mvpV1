const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configuration pour les builds natifs
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Optimisations pour la production
config.transformer.minifierConfig = {
  mangle: {
    keep_fnames: true,
  },
};

module.exports = config;