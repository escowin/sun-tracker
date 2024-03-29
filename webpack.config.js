const path = require("path");
const webpack = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const WebpackPwaManifest = require("webpack-pwa-manifest");

module.exports = {
  // PWA configuraton settings
  entry: {
    app: "./src/js/script.js",
  },
  output: {
    // saves bundle file to `dist/`
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        // preprocesses css stylesheets
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        // pre-processes image files using regex to search for `.jpg` extension
        test: /\.jpg$/i,
        type: "asset/resource", // Use asset/resource to handle images in CSS
        generator: {
          filename: "assets/img/[name][ext]",
        },
        exclude: [/node_modules/, /assets\/css/], // Exclude images from being processed in the CSS folder
      },
      {
        // optimizes images
        loader: "image-webpack-loader",
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
      // "static" generates `report.html`. "disable" stops report generation
      analyzerMode: "static",
    }),
    new WebpackPwaManifest({
      // `manifest.json` object key-values
      publicPath: "./",
      name: "Sun tracker",
      short_name: "Sun",
      description:
        "PWA that tracks Sun activity with math & fetched NASA API data",
      start_url: "../index.html",
      background_color: "#440f0f",
      theme_color: "#860e0e", // nee bf9732
      fingerprints: false,
      inject: false,
      icons: [
        {
          src: path.resolve("src/img/icons/icon-512x512.png"),
          sizes: [96, 128, 192, 256, 384, 512],
          destination: path.join("assets", "icons"),
          purpose: "any maskable"
        },
      ],
    }),
  ],
  mode: "development", // webpack runs during development
  devServer: { static: "./" }, // non-webpack content loads from root in development environment
};
