const path = require('path');

const rootPath = (s) => path.resolve(__dirname, s);

const CircularDependencyPlugin = require('circular-dependency-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { HotModuleReplacementPlugin } = require('webpack');

module.exports = (env, options) => {
	const isDev = options.mode !== 'production';

	return {
		devtool: 'source-map',
		mode: 'development',
		entry: './src/index.ts',
		output: {
			path: rootPath('dist'),
			publicPath: '/',
			pathinfo: false, // increase build performance
			chunkFilename: isDev ? 'scripts/[name].js' : 'scripts/[name].[chunkhash].js',
			filename: isDev ? 'scripts/[name].js' : 'scripts/[name].[chunkhash].js',
		},
		resolve: {
			modules: ['node_modules', 'src'],
			extensions: ['.ts', '.mjs', '.js'],
			symlinks: false, // increase build performance
		},
		devServer: {
			hot: true,
		},
		module: {
			rules: [
				{
					test: /\.ts$/,
					use: [
						{
							loader: 'swc-loader',
							options: {
								jsc: {
									externalHelpers: true,

									parser: {
										syntax: 'typescript',
										tsx: false,
										decorators: true,
										dynamicImport: false,
									},
								},
								env: {
									targets: {
										chrome: '79',
									},
									mode: 'entry',
									coreJs: 3,
								},
							},
						},
					],
				},
			],
		},
		plugins: [
			new CircularDependencyPlugin(),
			new DuplicatePackageCheckerPlugin(),
			new HtmlWebpackPlugin({
				template: './src/index.html',
				filename: 'index.html',
				scriptLoading: 'defer',
			}),
			new ForkTsCheckerWebpackPlugin({
				eslint: {
					files: 'src/**/*.ts',
				},
			}),
			new HotModuleReplacementPlugin({}),
			new CleanWebpackPlugin(),
		],
	};
};
