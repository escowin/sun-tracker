const path = require("path");
const webpack = require("webpack")

module.exports = { // PWA configuraton settings
    entry: './assets/js/script.js',
    output: { // saves bundle file to `dist/`
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.bundle.js'
    },
    mode: "development", // webpack runs during development
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: 'jquery',
            moment: "moment"
        })
    ],
}