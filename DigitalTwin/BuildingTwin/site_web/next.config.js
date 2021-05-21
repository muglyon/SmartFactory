const withCSS = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')

module.exports = withCSS(withSass({
    webpack: (config, { isServer }) => {
      config.module.rules.push({
        test: /\.svg$/,
        issuer: {
          test: /\.(js|ts)x?$/,
        },
        use: ['@svgr/webpack'],
      });

      // Fixes npm packages that depend on `fs` module
      if (!isServer) {
        config.node = {
          fs: 'empty',
          dns: 'empty',
          net: 'empty',
          tls: 'empty'
        }
      }
      return config
    },
    api : {
      bodyParser: true      
    }
  }));