const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");

const ENV = require('./env');
const PATHS = {
  src: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'www'),
};

process.env.BABEL_ENV = ENV;

const common = {
  entry: PATHS.src,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              camelCase: true,
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass!'
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
        include: PATHS.src,
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader?cacheDirectory',
        include: PATHS.src,
      }
    ]
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: PATHS.build,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['src', 'node_modules']  
  },
  plugins: [
    new HtmlWebPackPlugin({
      title: 'Open Air Market',
      template: 'public/index.html',
      favicon: 'public/icon.png'
    }),
  ],
};

if (ENV === 'development') {
  module.exports = merge(common, {
    devtool: 'cheap-source-map',
    devServer: {
      contentBase: PATHS.build,

      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,
      hot: true,
      inline: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',

      // Parse host and port from env so this is easy to customize.
      host: process.env.HOST,
      port: process.env.PORT,
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
    ],
  });
}
else {
  // config can be added here for minifying / etc
  module.exports = merge(common, {
    plugins: [
      new MinifyPlugin({}, {
        include: /bundle.js/,
      }),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      })
    ],
  });
}
