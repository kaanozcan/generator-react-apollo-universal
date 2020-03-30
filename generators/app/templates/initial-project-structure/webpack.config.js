const webpack = require("webpack"),
      path = require("path"),
      ManifestPlugin = require('webpack-manifest-plugin'),
      BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


const nodeEnv = process.env.NODE_ENV || "development";
const analyzeBundle = process.env.ANALYZE_BUNDLE;

const plugins = [
  new ManifestPlugin(),
  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: `"${nodeEnv}"`,
      browser: true
    }
  }),
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
];

if (analyzeBundle) {
  plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: "bundle-report.html"
    })
  );
}

module.exports = {
  mode: nodeEnv,
  entry: {
    bundle: path.join(__dirname, "src/scripts/client.js")
  },
  output: {
    path: path.join(__dirname, "dist/public/bundle"),
    filename: `[name]-[contenthash].js`,
    chunkFilename: `[name]-[contenthash].js`
  },
  devtool: (nodeEnv === "production") ? false : "source-map",
  target: "web",
  optimization: {
    usedExports: true,
    minimize: (nodeEnv === "production"),
    splitChunks: {
      name: true,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all",
          priority: 1
        }
      }
    }
  },
  resolve: {
    modules: [
      path.join(__dirname, "src"),
      path.join(__dirname, "lib"),
      path.join(__dirname, "node_modules")
    ],
    alias: {
      "@lib": path.join(__dirname, "lib/"),
      "@src": path.join(__dirname, "src/"),
    },
    extensions: [".mjs", ".js", ".jsx"]
  },
  plugins,
  module: {
    rules: [{
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
            },
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
