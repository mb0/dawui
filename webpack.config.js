const path = require("path")

module.exports = {
	entry: {
		main: './src/main.ts',
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].bundle.js',
	},
	module: {
		rules: [{
			test: /\.ts$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
		}],
	},
	resolve: {
		extensions: ['.ts', '.js'],
		modules: [
			'src',
			'node_modules',
		]
	},
	devtool: 'cheap-module-source-map',
	stats: {assets:true, modules:false, children:false},
	optimization: {
		splitChunks: {
			usedExports: true,
			cacheGroups: {
				defaultVendors: {
					test: /[\\/]node_modules[\\/]@?(codemirror|lezer)/,
					name: 'vendor',
					chunks: 'initial',
				}
			},
		}
	},
}
