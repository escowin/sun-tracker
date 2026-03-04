const path = require("path");
const webpack = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const PwaManifestPlugin = require("./webpack/PwaManifestPlugin");

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
      // {
      //   // preprocesses css stylesheets
      //   test: /\.css$/i,
      //   use: ["style-loader", "css-loader"],
      // },
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
      analyzerMode: "disable",
    }),
    new PwaManifestPlugin({
      // `manifest.json` object key-values
      publicPath: "./",
      name: "Sun tracker",
      short_name: "Sun",
      description:
        "PWA that tracks Sun activity with math & fetched NASA API data",
      start_url: "../index.html",
      background_color: "#783c00", // dark
      theme_color: "#ffb000", // light
      fingerprints: false,
      inject: false,
      icons: [
        {
          src: path.resolve("src/img/icons/icon-512x512.png"),
          sizes: [96, 128, 144, 192, 256, 384, 512],
          destination: path.join("assets", "icons"),
          purpose: "any"
        },
      ],
      screenshots: [
        {
          src: "../assets/img/display-l.png",
          sizes: "2736x1824",
          type: "image/png",
          form_factor: "wide",
          label: "Desktop view"
        },
        {
          src: "../assets/img/display-s.png",
          sizes: "1290x2796",
          type: "image/png",
          form_factor: "narrow",
          label: "Mobile view"
        },
      ],
    }),
  ],
  mode: "development",
  devServer: { static: "./" }, // non-webpack content loads from root in development environment
};
