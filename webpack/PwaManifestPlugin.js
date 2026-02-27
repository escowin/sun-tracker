/**
 * PWA Manifest plugin using webpack 5 processAssets hook.
 * Replaces webpack-pwa-manifest to fix DEP_WEBPACK_COMPILATION_ASSETS deprecation.
 * Uses compilation.hooks.processAssets + emitAsset instead of emit + compilation.assets.
 */
const path = require("path");
const { RawSource } = require("webpack-sources");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const { buildResources } = require("webpack-pwa-manifest/dist/injector");

const Compilation = require("webpack/lib/Compilation");

module.exports = class PwaManifestPlugin {
  constructor(options = {}) {
    this.pwaManifest = new WebpackPwaManifest(options);
  }

  apply(compiler) {
    compiler.hooks.compilation.tap("PwaManifestPlugin", (compilation) => {
      compilation.hooks.processAssets.tapAsync(
        {
          name: "PwaManifestPlugin",
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        (assets, callback) => {
          const publicPath =
            this.pwaManifest.options.publicPath ||
            compilation.options.output.publicPath ||
            "";

          buildResources(
            this.pwaManifest,
            publicPath,
            (err) => {
              if (err) {
                callback(err);
                return;
              }
              if (!this.pwaManifest.assets) {
                callback();
                return;
              }
              for (const asset of this.pwaManifest.assets) {
                const content =
                  typeof asset.source === "function"
                    ? asset.source()
                    : asset.source;
                const source = new RawSource(content);
                compilation.emitAsset(asset.output, source, {
                  size: typeof asset.size === "function" ? asset.size() : asset.size,
                });
              }
              callback();
            }
          );
        }
      );
    });
  }
};
