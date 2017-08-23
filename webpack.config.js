const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: path.resolve(__dirname, 'js/lazy.js'),
  output: {
    path: path.resolve(__dirname, 'js'),
    filename: 'lazy.min.js'
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
            loader : 'babel-loader',
            options: {
                presets: [ 
                    ['env']
                ]
            }
        }            
    	}]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin()
	],
	watch: true
};