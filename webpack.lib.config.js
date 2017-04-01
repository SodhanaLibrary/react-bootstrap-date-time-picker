var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require("webpack");

module.exports = {
  entry : {
    'react-bootstrap-date-time-picker':'./src/date-time-picker/DateTimePicker.js',
    'react-bootstrap-date-time-picker.min':'./src/date-time-picker/DateTimePicker.js'
  },

  output: {
    path: './lib',
    filename: '[name].js',
    library: 'react-bootstrap-date-time-picker',
    libraryTarget: 'umd'
  },

  devtool: "source-map",

  externals: [
    {
      'react': {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      }
    },
    {
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom'
      }
    },
    {
      'react-bootstrap': {
        commonjs2: 'react-bootstrap',
        commonjs: 'react-bootstrap',
        amd: 'react-bootstrap'
      }
    }
  ],

  module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				loader: 'babel',
				query: {
					presets: ['react','es2015','stage-2']
				}
			},
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style", "css!sass")
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style", "css!sass")
      }
	 ]
 },

 plugins: [
    new ExtractTextPlugin("./[name].css"),
    new webpack.optimize.UglifyJsPlugin({
     exclude:['react-bootstrap-date-time-picker.js'],
     minimize: true,
     compress: { warnings: false }
   })
 ]
};
