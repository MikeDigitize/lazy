const path = require('path');
const webpack = require('webpack');

const webpackPlugins = [];

if(process.env.NODE_ENV === 'production') {
    webpackPlugins.push(
        new webpack.optimize.UglifyJsPlugin()
    );
}

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
    plugins: webpackPlugins,
    watch: true
};