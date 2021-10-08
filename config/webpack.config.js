// get webpack mode
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// include application environments
require('./helpers').includeEnvironments();

const {join} = require('path');

// webpack
const webpack = require('webpack');
// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const ManifestPlugin = require('webpack-manifest-plugin').WebpackManifestPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

// paths
const {
  clientIndex,
  clientBuildRoot,
  tsConfigJSON,
  publicUrlOrPath,
  htmlTemplate,
  publicRoot,
  eslintPath,
  root,
  serverRoot,
} = require('./paths');

// helpers
const {
  getFileNameTemplate,
  getChunkFileNameTemplate,
  getTypeScriptModuleAliases,
  getClientEnvironment,
} = require('./helpers');

// constants
const {moduleFileExtensions, PUBLIC_PATH_PATTERN} = require('./constants');

const getDevServerConfig = () => isDevelopment ? {
  devServer: {
    historyApiFallback: true,
    contentBase: clientBuildRoot,
    open: true,
    compress: true,
    hot: true,
    port: process.env.DEV_SERVER_PORT,
  },
} : {};

const getOptimizationConfig = () => isProduction ? {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        extractComments: false,
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          keep_classnames: isProduction,
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
      new CssMinimizerPlugin({
        parallel: true,
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: {removeAll: true},
            },
          ],
        },
      }),
    ],
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`,
    },
    splitChunks: {chunks: 'all'},
  },
} : {};

const getStyleLoaders = (cssOptions = {}, preProcessorModule) => {
  const loaders = [
    isDevelopment && require.resolve('style-loader'),
    isProduction && CssMinimizerPlugin.loader,
    isProduction && {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: '../../',
      },
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
  ].filter(Boolean);

  if (preProcessorModule) {
    loaders.push(
        preProcessorModule,
    );
  }

  return loaders;
};

module.exports = {
  mode: process.env.NODE_ENV,
  target: isDevelopment ? 'web' : 'browserslist',
  entry: [clientIndex],
  devtool: isDevelopment ? 'inline-source-map' : false,
  bail: isProduction,
  ...getDevServerConfig(),
  ...getOptimizationConfig(),
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.js'],
    alias: {
      ...getTypeScriptModuleAliases(tsConfigJSON, true),
    },
  },
  output: {
    filename: getFileNameTemplate(isDevelopment),
    path: clientBuildRoot,
    chunkFilename: getChunkFileNameTemplate(isDevelopment),
    publicPath: publicUrlOrPath,
  },
  module: {
    rules: [
      // babel react
      {
        test: /\.([jt])sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            babelrc: false,
            sourceMaps: true,
            inputSourceMap: true,
            presets: [
              '@babel/preset-env',
              '@babel/preset-typescript',
              '@babel/react',
            ],
            plugins: [
              ['@babel/plugin-proposal-decorators', {legacy: true}],
              ['@babel/plugin-proposal-class-properties'],
              '@babel/plugin-proposal-optional-chaining',
              // module-resolve
              [
                'module-resolver',
                {
                  root: ['./'],
                  alias: getTypeScriptModuleAliases(tsConfigJSON),
                },
              ],
              ['@babel/plugin-transform-runtime'],
              isDevelopment && require.resolve('react-refresh/babel'),
            ].filter(Boolean),
          },
        },
      },
      // styles
      {
        test: /\.css$/i,
        use: getStyleLoaders(),

      },
      // images loader
      {
        test: /\.(png|svg|jpe?g|gif|bmp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/media/images/[hash][ext][query]',
        },
      },
      // fonts loader
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/media/fonts/[hash][ext][query]',
        },
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      favicon: join(publicRoot, 'favicon.ico'),
      publicOrUrlPath: (publicUrlOrPath.charAt(publicUrlOrPath.length) === '\/' ?
          publicUrlOrPath.substring(0, publicUrlOrPath.length - 1) :
          publicUrlOrPath),
      inject: true,
      template: htmlTemplate,
      ...(isProduction ? {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      } : {}),
    }),
    new webpack.DefinePlugin(getClientEnvironment().stringified),
    isProduction &&
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    }),
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
      publicPath: (publicUrlOrPath.charAt(publicUrlOrPath.length - 1) === '\/' ? publicUrlOrPath : (publicUrlOrPath + '/')),
      generate: (seed, files, entrypoints) => {
        const manifestFiles = files.reduce((manifest, file) => {
          manifest[file.name] = file.path;
          return manifest;
        }, seed);
        const entrypointFiles = entrypoints.main.filter(
            (fileName) => !fileName.endsWith('.map'),
        );

        return {
          files: manifestFiles,
          entrypoints: entrypointFiles,
        };
      },
    }),
    new CopyPlugin({
      patterns: [
        {
          from: join(publicRoot, '*.+(png|jpg)').replace(/\\/g, '/'),
          noErrorOnMissing: true,
          to() {
            return join(clientBuildRoot, '[name][ext]').replace(/\\/g, '/');
          },
        },
        {
          from: join(publicRoot, '*.+(xml|txt|json)').replace(/\\/g, '/'),
          to() {
            return join(clientBuildRoot, '[name][ext]').replace(/\\/g, '/');
          },
          transform: {
            transformer(buffer) {
              let content = buffer.toString('utf-8');
              const replaceValue = publicUrlOrPath.charAt(publicUrlOrPath.length) === '\/' ?
                  publicUrlOrPath.substring(0, publicUrlOrPath.length - 1) :
                  publicUrlOrPath;
              while (content.match(PUBLIC_PATH_PATTERN)) {
                content = content.replace(PUBLIC_PATH_PATTERN, replaceValue);
              }
              return Buffer.from(content, 'utf-8');
            },
          },
        },
      ],
    }),
    ...(isDevelopment ? [
      new webpack.HotModuleReplacementPlugin(),
      new ReactRefreshPlugin(),
      new CaseSensitivePathsPlugin(),
      new ESLintPlugin({
        context: root,
        overrideConfigFile: eslintPath,
        extensions: moduleFileExtensions,
        formatter: 'codeframe',
        exclude: [serverRoot],
      }),
    ] : []),
  ].filter(Boolean),
};
