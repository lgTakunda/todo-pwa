const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = (env, argv) => ({
  entry: "./src/index.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      manifest: "./public/manifest.json",
    }),
    new WorkboxPlugin.InjectManifest({
      swSrc: "./src/sw.js",
      swDest: "sw.js",
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      exclude: [/\.map$/, /manifest\.json$/],
    }),
  ],
  devServer: {
    port: 3000,
    historyApiFallback: true,
    proxy: {
      "/todos": "http://localhost:3001",
      "/auth": "http://localhost:3001",
    },
    hot: true, // Ensure HMR is enabled
    client: {
      reconnect: true, // Auto-reconnect on disconnect
      webSocketURL: "ws://localhost:3000/ws", // Explicit WS URL
      logging: "warn", // Reduce console spam (warn only)
      overlay: false, // Disable overlay for errors (less intrusive)
    },
  },
});
