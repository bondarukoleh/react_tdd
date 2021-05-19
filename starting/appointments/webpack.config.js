const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "main.js"
  },
  resolve: {extensions: ['.ts', '.js', '.css', '.tsx']},
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/, '/server/'],
        loader: 'babel-loader'
      },
      {
        test: /\.ts/,
        use: "ts-loader",
        exclude: [/node_modules/, '/server/'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: [/node_modules/, '/server/'],
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `${__dirname}/src/index.html`,
      filename: 'index.html',
      inject: 'body'
    })
  ],
  devServer: {
    contentBase: "./dist",
    port: 4500
  },
  devtool: 'eval-source-map'
};
