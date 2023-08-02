const path = require("path");
const webpack = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const WebpackPwaManifest = require("webpack-pwa-manifest");
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
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      dayjs: "dayjs",
    }),
    new BundleAnalyzerPlugin({
      // outputs `report.html` in `dist`. "disable" stops report generation
      analyzerMode: "disable",
    }),
    new WebpackPwaManifest({
      // `manifest.json` object key-values
      publicPath: "./",
      name: "Sun tracker",
      short_name: "sun-tracker",
      description: "tracks Sun activity with math formulas & data fetched from NASA's DONKI API",
      start_url: "../index.html",
      background_color:  "#860e0e",
      theme_color: "#860e0e", // nee bf9732
      fingerprints: false,
      inject: false,
      icons: [{
        src: path.resolve("assets/images/icons/icon-512x512.png"),
        sizes: [96, 128, 192, 256, 384, 512],
        destination: path.join("assets", "icons")
      }]
    })
  ],
  mode: "development", // webpack runs during development
  devServer: { static: "./" }, // non-webpack content loads from root in development environment
};
