const fs = require('fs');
const os = require('os');
const path = require('path');
const esbuild = require('esbuild');

const chromiumCandidates = [
  process.env.CHROME_BIN,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
];

for (const candidate of chromiumCandidates) {
  if (candidate && fs.existsSync(candidate)) {
    process.env.CHROME_BIN = candidate;
    break;
  }
}

const bundlePath = path.join(os.tmpdir(), 'karma-react-bundle.js');
esbuild.buildSync({
  entryPoints: ['src/tests-karma/index.spec.js'],
  bundle: true,
  format: 'iife',
  target: 'es2019',
  jsx: 'automatic',
  sourcemap: 'inline',
  loader: {
    '.js': 'jsx',
    '.jsx': 'jsx',
    '.css': 'css',
    '.woff': 'dataurl',
    '.woff2': 'dataurl',
    '.ttf': 'dataurl',
  },
  define: {
    'process.env.NODE_ENV': '"test"',
  },
  outfile: bundlePath,
});

/**
 * Configuración de Karma + Jasmine para los tests solicitados por la cátedra.
 * Usa esbuild para compilar previamente las suites a un bundle IIFE.
 */
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      { pattern: bundlePath, watched: false, nocache: true },
    ],
    preprocessors: {},
    reporters: ['progress'],
    browsers: ['ChromeHeadless'],
    singleRun: true,
    client: {
      jasmine: {
        random: false,
      },
    },
  });
};
