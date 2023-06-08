// const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WebpackMessages = require('webpack-messages');
const TerserJSPlugin = require('terser-webpack-plugin');

module.exports = () => {
    return {
        mode: 'development',
        entry: {
            'assets/css/backend.min': './webpack/backend-styles.scss',
            'assets/css/frontend.min': './webpack/frontend-styles.scss',
            'assets/js/backend-bundle.min': './webpack/backend-scripts.js',
            'assets/js/frontend-bundle.min': './webpack/frontend-scripts.js'
        },
        output: {
            // main output path in assets folder
            path: path.resolve(__dirname, ''),
            // output path based on the entries' filename
            filename: '[name].js',
        },
        stats: 'errors-warnings',
        performance: {
            // disable warnings hint
            hints: false,
        },
        optimization: {
            // js and css minimizer
            minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
        },
        devtool: 'none',
        resolve: {
            alias: {
                jquery: path.join(__dirname, 'node_modules/jquery/src/jquery')
            },
            extensions: ['.js', '.scss'],
        },
        plugins: [
            new WebpackMessages({
                name: 'prox',
                logger: str => console.log(`>> ${str}`),
            }),
            new MiniCssExtractPlugin({
                filename: "[name].css"
            }),
            new webpack.ProvidePlugin({
                jQuery: 'jquery',
                $: 'jquery',
                jquery: 'jquery'
              })
        ],
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                    ],
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                          loader: 'css-loader',
                          options: {
                            url: false,
                          },
                        },
                        {
                          loader: 'postcss-loader', // Run post css actions
                          options: {
                            plugins: function() { // post css plugins, can be exported to postcss.config.js
                              return [
                                // require('precss'),
                                require('autoprefixer'),
                              ];
                            },
                          },
                        },
                        {
                          loader: 'sass-loader',
                          options: {
                            sourceMap: false,
                            includePaths: ['./'],
                          },
                        },
                    ],
                },
                {
                    test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
                    use: [
                        {
                            loader: 'url-loader?limit=100000',
                            options: {
                                name: '[path][name].[ext]',
                            }
                        }
                    ],
                }
            ]
        },
        // webpack dev server config
        devServer: {
            contentBase: './dist',
            compress: true,
            port: 3000,
        },
    }
}