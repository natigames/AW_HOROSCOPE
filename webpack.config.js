const path = require('path');
var webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  entry: './js/index.js',
  output: {
    path: path.resolve(__dirname, './dist/js'),
    filename: 'horoscope.js',
  },
  plugins: [
    new VueLoaderPlugin(),
	new webpack.ProvidePlugin({
		'$': 'jquery',
		jQuery: 'jquery',
		Popper: ["popper.js", "default"],
	}),
  ],
  mode: "production",
  //mode: "development",
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
	  {
		test: /\.css$/,
		use: [
			'style-loader',
			'css-loader',
		],
	  },
	  {
		  test: /\.(scss)$/,
		  use: [
			  {loader: 'style-loader'},
			  {loader: 'css-loader'},
			  {loader: 'sass-loader'},
		  ],
	  },
    ]
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
	  //min vue does not provide vue browser tools
      //'vue$': 'vue/dist/vue.js',
      'vue$': 'vue/dist/vue.min.js',
	  'jquery': 'jquery/dist/jquery.min.js',
	  'popper.js': 'popper/dist/popper.min.js',
    }
  },
  /*performance: {
    hints: false
  },*/
  //devtool: '#eval-source-map',
};
