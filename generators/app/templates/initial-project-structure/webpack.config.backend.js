const webpack = require("webpack"),
      path = require("path"),
      nodeExternals = require('webpack-node-externals');


const nodeEnv = process.env.NODE_ENV || "development";

const checkNodeExternal = nodeExternals();

module.exports = {
  mode: nodeEnv,
  entry: {
    server: path.join(__dirname, "src/server.js")
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: `[name].js`,
    chunkFilename: `[name].js`
  },
  target: "node",
  externals: [(context, request, callback) => {
    if (/public\/bundle\/manifest\.json/.test(request)) {
      return callback(null, 'commonjs ' + request);
    }

    return checkNodeExternal(context, request, callback);
  }],
  resolve: {
    modules: [
      path.join(__dirname, "src"),
      path.join(__dirname, "lib")
    ],
    alias: {
      "@lib": path.join(__dirname, "lib/"),
      "@src": path.join(__dirname, "src/"),
    },
    extensions: [".mjs", ".js", ".jsx"]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: `"${nodeEnv}"`,
        browser: false
      }
    })
  ],
  module: {
    rules: [{
        type: 'javascript/auto',
        include: path.join(__dirname, "/node_modules"),
        test: /\.mjs$/,
        use: []
      }, {
          test: /\.(js|jsx)$/,
          loader: "babel-loader",
          include: [
            path.join(__dirname, "/src"),
            path.join(__dirname, "/lib")
          ],
          exclude: [path.join(__dirname, "node_modules")],
      }, {
        test: /\.json/,
        loader: "json-loader",
        include: [
          path.join(__dirname, "/src"),
          path.join(__dirname, "/lib"),
        ]
      }, {
        test: /\.(css|pcss)$/,
        use: [{
          loader: "isomorphic-style-loader"
        }, {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            modules: {
              localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
            }
          },
        }, {
          loader: 'postcss-loader'
        }],
      }, {
        test: /\.(png|jpg|gif|woff|woff2)$/,
        loader: "url-loader?limit=8192"
      }]
  }
};
