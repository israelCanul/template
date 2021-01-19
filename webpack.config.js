var path = require("path");

module.exports = {
  entry: { index: "./index.js", getqr: "./getQR.js" },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: ["babel-loader"],
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "./public/js"),
    // publicPath: path.resolve(__dirname, "./public/js"),
    filename: "./js/[name].js",
  },
  devServer: {
    contentBase: path.resolve(__dirname, "./public"),
  },
};
