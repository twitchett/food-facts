const path = require('path')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const webpack = require('webpack')
require('babel-polyfill')

const plugins = [
  new HtmlWebpackPlugin({
    title: 'Lolz',
    template: './src/index.html',
  }),
  new ScriptExtHtmlWebpackPlugin({
    defaultAttribute: 'defer',
  }),
  // new ExtractTextPlugin({
  //   filename: './[name].[hash].css',
  //   allChunks: true,
  // }),
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: "[name].css",
    chunkFilename: "[id].css"
  }),
  new webpack.optimize.ModuleConcatenationPlugin(),
];

module.exports = () => ({
  entry: [
    'babel-polyfill',
    './src/index.js',
    './styles/app.css',
  ],
  devtool: 'source-map',
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, './'),
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, './'),
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
        // produciton usage
        // use: [
        //   {
        //     loader: MiniCssExtractPlugin.loader,
        //     // options: {
        //     //   // you can specify a publicPath here
        //     //   // by default it use publicPath in webpackOptions.output
        //     //   publicPath: '../'
        //     // }
        //   },
        //   'css-loader'
        // ]
      },
    ],
  },
  plugins,
  devServer: {
    publicPath: '/',
    open: true,
    port: 3000
  },
});
