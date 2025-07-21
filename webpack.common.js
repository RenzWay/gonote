const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  entry: path.resolve(__dirname, "./src/script/main.js"),
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "./dist"),
    clean: true,
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-react", { runtime: "automatic" }],
              ["@babel/preset-env"],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./index.html"),
      filename: "index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "./public"),
          to: "./public",
          noErrorOnMissing: true,
        },
      ],
    }),
    new webpack.DefinePlugin({
      "process.env.FIREBASE_API_KEY": JSON.stringify(
        process.env.FIREBASE_API_KEY
      ),
      "process.env.FIREBASE_AUTH_DOMAIN": JSON.stringify(
        process.env.FIREBASE_AUTH_DOMAIN
      ),
      "process.env.FIREBASE_PROJECT_ID": JSON.stringify(
        process.env.FIREBASE_PROJECT_ID
      ),
      "process.env.FIREBASE_STORAGE_BUCKET": JSON.stringify(
        process.env.FIREBASE_STORAGE_BUCKET
      ),
      "process.env.FIREBASE_MESSAGING_SENDER_ID": JSON.stringify(
        process.env.FIREBASE_MESSAGING_SENDER_ID
      ),
      "process.env.FIREBASE_APP_ID": JSON.stringify(
        process.env.FIREBASE_APP_ID
      ),
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
};
