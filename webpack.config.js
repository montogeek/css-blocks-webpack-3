const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CssBlocks = require("@css-blocks/jsx");
const CssBlocksPlugin = require("@css-blocks/webpack").CssBlocksPlugin;

const paths = {
  appIndexJs: './src/index.jsx'
};

const jsxCompilationOptions = {
  compilationOptions: {},
  optimization: {
    rewriteIdents: true,
    mergeDeclarations: true,
    removeUnusedStyles: true,
    conflictResolution: true,
    enabled: process.env.NODE_ENV === "production",
  },
  aliases: {}
};

const CssBlockRewriter = new CssBlocks.Rewriter(jsxCompilationOptions);
const CssBlockAnalyzer = new CssBlocks.Analyzer(paths.appIndexJs, jsxCompilationOptions);

const config = {
  entry: [ './src/index.jsx' ],
  // mode: 'development',
  module: {
    rules: [
      // {
      //   test: /\.css$/,
      //   use: ['style-loader', 'css-loader']
      // },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              presets: [require.resolve('babel-preset-react-app')],
              cacheDirectory: true,
              compact: true
            }
          },

          // Run the css-blocks plugin in its own dedicated loader because the react-app preset
          // steps on our transforms' feet. This way, we are guaranteed a clean pass before any
          // other transforms are done.
          {
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [
                require('@css-blocks/jsx/dist/src/transformer/babel').makePlugin({ rewriter: CssBlockRewriter })
              ],
              cacheDirectory: false,
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

module.exports = config;
