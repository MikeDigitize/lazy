const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
	.BundleAnalyzerPlugin;

module.exports = function(env, argv) {
	const webpackPlugins =
		argv.mode === 'production' ? [new BundleAnalyzerPlugin()] : [];
	return {
		entry: {
			'lazy.min': path.resolve(__dirname, 'js/lazy.js'),
			'lazy-scroll.min': path.resolve(__dirname, 'js/lazy-scroll.js'),
			'lazy-proximity.min': path.resolve(__dirname, 'js/lazy-proximity.js'),
			'lazy-all.min': [
				path.resolve(__dirname, 'js/lazy-scroll.js'),
				path.resolve(__dirname, 'js/lazy-proximity.js')
			]
		},
		output: {
			path: path.resolve(__dirname, 'js/min'),
			filename: '[name].js',
			libraryTarget: 'umd'
		},
		resolve: {
			modules: [path.join(__dirname, 'js'), 'node_modules'],
			extensions: ['.js']
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader'
					}
				}
			]
		},
		plugins: webpackPlugins
	};
};
