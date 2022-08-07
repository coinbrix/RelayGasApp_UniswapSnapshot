const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const resolve = require('path').resolve;
const path = require('path');

const config = {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: __dirname + '/src/index.jsx',
    output: {
        path: resolve(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: resolve('/public/')
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9000,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "index.html"),
        }),
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.css', '.scss', '.sass']
    },
    module: {
        rules: [
            {
                test: /\.?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.?jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/,
                use: {
                    loader: 'style-loader!css-loader'
                }
            },
            {
                test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
                use: {
                    loader: 'url-loader?limit=100000'
                }

            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "sass-loader"
                    }
                ]
            }
        ]
    }
};
module.exports = config;
