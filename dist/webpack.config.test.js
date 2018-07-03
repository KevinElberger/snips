'use strict';

const path = require('path');

module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, '../')
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue']
  }
};