const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: path.resolve(__dirname, 'js/lazy-scroll.js'),
    output: {
        path: path.resolve(__dirname, 'js'),
        filename: 'lazy-scroll.min.js',
        libraryTarget: 'umd'
    },
    resolve: {
        modules: [
            path.join(__dirname, 'js'),
            'node_modules'
        ],
        extensions: ['.js']
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ],
    watch: true
};