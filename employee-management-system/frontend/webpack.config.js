const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // Main entry point for your frontend code
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory for the bundled files
    filename: 'bundle.js', // Name of the output bundle
    publicPath: '/', // For routing to work correctly
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Transpile JavaScript files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/, // Process CSS files
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i, // Load images
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i, // Load fonts
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Use your existing index.html file as a template
      favicon: './public/favicon.ico', // Include favicon
    }),
  ],
  devServer: {
    static: path.join(__dirname, 'dist'), // Serve files from the dist directory
    historyApiFallback: true, // Support React Router (SPA routing)
    open: true, // Automatically open the app in the browser
    port: 3000, // Development server port
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Resolve these file extensions
  },
  mode: 'development', // Default mode for development
};