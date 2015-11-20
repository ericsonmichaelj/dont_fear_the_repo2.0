import { argv }      from 'yargs';
import config        from '../config';
import webpackConfig from '../webpack.config';

const KARMA_ENTRY_FILE = 'karma.entry.js';

function makeDefaultConfig () {
  const karma = {
    files : [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      './tests/**/*.js', //Note in gage
      './' + KARMA_ENTRY_FILE
    ],
    singleRun  : !argv.watch, //Changed in gage
    frameworks : ['mocha', 'sinon-chai', 'chai-as-promised', 'chai'], //changed in gage
    preprocessors : { //changed in gage
      [KARMA_ENTRY_FILE] : ['webpack'],
      [`${config.get('dir_test')}/**/*.js`] : ['webpack']
    },
    reporters : ['spec'], 
    browsers : ['PhantomJS'],
    webpack : {
      devtool : 'inline-source-map',
      resolve : webpackConfig.resolve,
      plugins : webpackConfig.plugins
        .filter(plugin => !plugin.__KARMA_IGNORE__),
      module  : {
        loaders : webpackConfig.module.loaders
      },
      sassLoader : webpackConfig.sassLoader
    },
    webpackMiddleware : {
      noInfo : true
    },
    coverageReporter : {
      reporters : config.get('coverage_reporters')
    },
    plugins : [
      require('karma-webpack'),
      require('karma-mocha'),
      require('karma-chai'),
      require('karma-chai-as-promised'),
      require('karma-sinon-chai'),
      require('karma-coverage'),
      require('karma-phantomjs-launcher'),
      require('karma-spec-reporter')
    ]
  };

  if (config.get('coverage_enabled')) {
    karma.reporters.push('coverage');
    karma.webpack.module.preLoaders = [{
      test    : /\.(js|jsx)$/,
      include : /src/,
      loader  : 'isparta'
    }];
  } //Note in gage

  return karma; //not in gage
}

export default (karmaConfig) => karmaConfig.set(makeDefaultConfig());
