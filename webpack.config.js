const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");

const ENV = require('./env');
const PATHS = {
  src: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'www'),
};

process.env.BABEL_ENV = ENV;

const common = {
  entry: PATHS.src,
  output: {
    path: PATHS.build,
    filename: 'bundle.js',
  },
  module: {
    loaders: [
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
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['src', 'node_modules']  
  },
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
      new HtmlWebPackPlugin({
        template: "./www/index.html",
      }),
      new webpack.HotModuleReplacementPlugin(),
    ],
  });
}
else {
  // config can be added here for minifying / etc
  module.exports = merge(common, {
  plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      })
    ],
    });
}
