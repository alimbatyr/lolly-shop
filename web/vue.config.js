module.exports = {
  lintOnSave: false,

  devServer: {
    proxy: {
      '^/api': {
        target: 'http://zher_api:3000',
        changeOrigin: true,
      },
    },
  },

  transpileDependencies: ['vuetify'],
};
