const gulp = require("gulp"),
      webpack = require("webpack"),
      webpackClientConfig = require("./webpack.config"),
      webpackBackendConfig = require("./webpack.config.backend"),
      path = require("path"),
      nodemon = require("nodemon"),
      commander = require("commander");

const webpackRunCallback = ({ callback }) => (err, stats) => {
  if (err) {
    callback();
    throw new Error(err);
  }

  if (stats) {
    console.log(stats.toString({ colors: true }));
  }

  callback();
}

const copyPublic = (done) => gulp
  .src("./public/**/*")
  .pipe(gulp.dest("./dist/public"));

const createWebpackRunner = ({ watchModeEnabled }) => function webpackRunner (done) {
  const callback = webpackRunCallback({ callback: done });
  const compiler = webpack([webpackClientConfig, webpackBackendConfig]);

  if (watchModeEnabled) {
    compiler.watch({
      aggregateTimeout: 300
    }, (err, stats) => {
      copyPublic();
      callback(err, stats);
    });
  } else {
    compiler.run(callback);
  }
}

const buildBundles = createWebpackRunner({ watchModeEnabled: false });
const watchAndBuildBundles = createWebpackRunner({ watchModeEnabled: true });

const startDevServer = (done) => {
  const options = new commander.Command();

  options
    .option("--inspect", "inspect mode")
    .option("--inspect-brk", "inspect break mode");

  options.parse(process.argv);

  let execMap = {};

  if (options.inspect) {
    execMap.js = "node --inspect";
  }

  if (options.inspectBrk) {
    execMap.js = "node --inspect-brk";
  }

  nodemon({
    script: "dist/server.js",
    execMap
  });

  nodemon
    .on('start', function () {
      console.log('App has started\n');
    })
    .on('quit', function () {
      console.log('App has quit\n');
      process.exit();
    })
    .on('restart', function (files) {
      console.log('App restarted due to: ', files);
    });

    done();
}

const develop = gulp.series(watchAndBuildBundles, startDevServer);

const build = gulp.series(buildBundles, copyPublic);

module.exports = Object.assign({}, exports, {
  copyPublic,
  build,
  develop
});
