// webpack v4

"use strict";

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const devMode = process.env.NODE_ENV !== "production";
const CopyWebpackPlugin = require("copy-webpack-plugin");
const html = ["index"];
const htmlFiles = html.map(
  (entryName) =>
    new HtmlWebpackPlugin({
      inject: true,
      chunks: [entryName],
      filename: `${entryName}.html`,
      template: `./src/${entryName}.html`
    })
);
const loaders = ["style-loader", "css-loader", "sass-loader"];

module.exports = {
  entry: {
    index: "./src/js/index.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.scss$/,
        use:
          devMode ? loaders : ["style-loader",
            MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader",
            "sass-loader"
          ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "./fonts/"
            }
          }
        ]
      }
    ]
  },
  devServer: {
    contentBase: ["./dist", path.join(__dirname, "src")],
    watchContentBase: true,
    hot: true
  },
  plugins: [
    devMode ? new CleanWebpackPlugin([""]) : new CleanWebpackPlugin(["dist"]),
    new MiniCssExtractPlugin({
      filename: "css/[name].css"
    }),
    new CopyWebpackPlugin([
      {
        from: "src/fonts",
        to: "./fonts/[name].[ext]",
        test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/
      }
    ]),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ].concat(htmlFiles),
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "scripts/[name].js"
  }
};
