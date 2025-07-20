const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const htmlPlugin = require("html-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
    new htmlPlugin({
      template: "./index.html", // gunakan file HTML sebagai template
      filename: "index.html", // nama file output di folder dist
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "./public", to: "public" }],
    }),
    new CompressionPlugin({
      test: /\.(js|css|jsx)(\?.*)?$/i,
      filename: "[path][base].gz",
      algorithm: "gzip",
      threshold: 8192,
      minRatio: 0.8,
      deleteOriginalAssets: false,
    }),
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    clean: true,
  },
});
