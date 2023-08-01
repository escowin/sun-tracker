const path = require("path");
const webpack = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
// to-do: css stylesheets & background image

module.exports = {
  // PWA configuraton settings
  entry: "./assets/js/script.js",
  output: {
    // saves bundle file to `dist/`
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        // pre-processes image files using regex to search for `.jpg` extension
        test: /\.jpg$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              esModule: false,
              name(file) {
                return "[path][name].[ext]";
              },
              publicPath: function (url) {
                return url.replace("../", "/assets/");
              },
            },
          },
          {
            // optimizes images
            loader: "image-webpack-loader",
          },
        ],
      },
    ],
  },
  mode: "development", // webpack runs during development
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      moment: "moment",
    }),
    new BundleAnalyzerPlugin({
      // outputs `report.html` in `dist`. "disable" stops report generation
      // note : moment.js takes up 679.35KB/1.04MB        
      analyzerMode: "static",
    }),
  ],
};
