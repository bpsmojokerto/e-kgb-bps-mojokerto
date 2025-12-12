const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Mengubah path cache directory
      webpackConfig.cache = {
        type: 'filesystem',
        cacheDirectory: path.resolve(__dirname, 'node_modules/.cache/webpack')
      };

      // Mengubah path output
      webpackConfig.output = {
        ...webpackConfig.output,
        path: path.resolve(__dirname, 'build')
      };

      // Mengubah path include untuk module rules
      if (webpackConfig.module && webpackConfig.module.rules) {
        webpackConfig.module.rules.forEach(rule => {
          if (rule.oneOf) {
            rule.oneOf.forEach(oneOfRule => {
              if (oneOfRule.include) {
                oneOfRule.include = path.resolve(__dirname, 'src');
              }
            });
          }
        });
      }

      return webpackConfig;
    }
  }
}; 