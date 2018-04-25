import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import CssBlocks from '@css-blocks/jsx';
import { CssBlocksPlugin } from '@css-blocks/webpack';

const paths = {
  appIndexJs: './src/index.js'
};

const jsxCompilationOptions = {
  compilationOptions: {
    sourceType: 'module',
    plugins: [
      'jsx',
      'flow',
      'decorators',
      'classProperties',
      'exportExtensions',
      'asyncGenerators',
      'functionBind',
      'functionSent',
      'dynamicImport'
    ]
  },
  optimization: {
    enabled: true,
    rewriteIdents: true,
    removeUnusedStyles: true,
    mergeDeclarations: true
  }
};

const CssBlockRewriter = new CssBlocks.Rewriter();
const CssBlockAnalyzer = new CssBlocks.Analyzer(paths.appIndexJs, jsxCompilationOptions.compilationOptions);

const config = {
  entry: './src/index.js',
  // mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [
                'transform-react-jsx',
                require('@css-blocks/jsx/dist/src/transformer/babel').makePlugin({
                  rewriter: CssBlockRewriter
                })
              ],
              cacheDirectory: true,
              compact: true,
              parserOpts: {
                plugins: ['jsx']
              }
            }
          },

          // The JSX Webpack Loader halts loader execution until after all blocks have
          // been compiled and template analyses has been run. StyleMapping data stored
          // in shared `rewriter` object.
          {
            loader: require.resolve('@css-blocks/webpack/dist/src/loader'),
            options: {
              analyzer: CssBlockAnalyzer,
              rewriter: CssBlockRewriter
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CssBlocksPlugin({
      analyzer: CssBlockAnalyzer,
      outputCssFile: 'blocks.css',
      name: 'css-blocks',
      compilationOptions: jsxCompilationOptions.compilationOptions,
      optimization: jsxCompilationOptions.optimization
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};

export default config;
