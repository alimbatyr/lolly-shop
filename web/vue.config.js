module.exports = {
  lintOnSave: false,

  devServer: {
    proxy: {
      '^/api': {
        target: 'http://lolly_api:3000',
        changeOrigin: true,
      },
    },
  },

  transpileDependencies: ['vuetify'],
};
