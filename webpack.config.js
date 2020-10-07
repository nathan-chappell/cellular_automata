const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    contentBase: "./dist",
    host: "0.0.0.0",
    port: "9999",
    clientLogLevel: "error",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new ESLintWebpackPlugin({
      context: "./src/index.tsx",
      formatter: "stylish",
      outputReport: {
        formatter: "unix",
        filePath: "../.eslint_report",
      },
    }),
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        files: './src/**/*.{ts,tsx,js,jsx}',
      },
      formatter: 'codeframe',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
      },
    ],
  },
};
