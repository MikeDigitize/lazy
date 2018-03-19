const path = require('path');
const webpack = require('webpack');
const isProduction = process.env.NODE_ENV === 'production';
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
	.BundleAnalyzerPlugin;

const webpackPlugins = isProduction
	? [
			// Production plugins
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': '"production"'
			}),
			new webpack.optimize.UglifyJsPlugin(),
			new webpack.optimize.ModuleConcatenationPlugin(),
			new BundleAnalyzerPlugin()
	  ]
	: [
			// Development plugins
	  ];

module.exports = {
	entry: {
		'lazy.min': path.resolve(__dirname, 'js/lazy.js'),
		'lazy-scroll.min': path.resolve(__dirname, 'js/lazy-scroll.js'),
		'lazy-proximity.min': path.resolve(__dirname, 'js/lazy-proximity.js')
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
	plugins: webpackPlugins,
	watch: !isProduction
};
