const path = require('path');

module.exports = {
    mode: 'development',
  target: 'node', // Set target to node to build for Node.js
  entry: './bin/www', // Entry point of your app
  output: {
    filename: 'bundle.js', // Output filename
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Use babel-loader to transpile JavaScript files
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/, // Use style-loader and css-loader to handle CSS files
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  externals: [require('webpack-node-externals')()], // Exclude node_modules from the bundle
};
