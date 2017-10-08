const path = require('path');
const webpack = require('webpack');
const webpackPlugins = [];
let watch = true;

if(process.env.NODE_ENV === 'production') {
    webpackPlugins.push(
        new webpack.optimize.UglifyJsPlugin()
    );
    watch = false;
}

module.exports = {
    entry: {
        'lazy.min': path.resolve(__dirname, 'js/lazy.js'),
        'lazy-scroll.min': path.resolve(__dirname, 'js/lazy-scroll.js'),
        'lazy-proximity.min': path.resolve(__dirname, 'js/lazy-proximity.js')
    },
    output: {
        path: path.resolve(__dirname, 'js'),
        filename: '[name].js',
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
    watch
};
