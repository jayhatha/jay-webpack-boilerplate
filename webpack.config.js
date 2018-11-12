// webpack v4

"use strict";

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WebpackBar = require("Webpackbar");
const devMode = process.env.NODE_ENV !== "production";
const loaders = ["style-loader", "css-loader", "sass-loader"];
module.exports = {
  entry: { index: "./src/index.js" },
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "./",
    filename: "[name].js"
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
        test: /\.s[c|a]ss$/,
        use: devMode
          ? loaders
          : [
            "style-loader",
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
              outputPath: "./fonts"
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [{
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "./img/",
            useRelativePath: process.env.NODE_ENV === "production"
          }
        }]
      }
    ]
  },
  devServer: {
    contentBase: ["./build", path.join(__dirname, "src")],
    watchContentBase: true,
    hot: true
  },
  plugins: [
    devMode ? new CleanWebpackPlugin([""]) : new CleanWebpackPlugin(["build"]),
    new MiniCssExtractPlugin({
      filename: "[name].css"
    }),
    new CopyWebpackPlugin([
      {
        from: "src/fonts",
        to: "./fonts/[name].[ext]",
        test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/
      }
    ]),
    new CopyWebpackPlugin([
      {
        from: "src/img",
        to: "./img/[name].[ext]",
        test: /\.(jpe?g|png|gif)$/
      }
    ]),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: "./src/index.html",
      filename: "index.html"
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new WebpackBar()
  ]
};
