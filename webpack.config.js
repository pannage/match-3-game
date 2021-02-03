const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.jsx',
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'index_bundle.js',
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            // {
            //     test: /\.mp3$/,
            //     // include: SRC,
            //     loader: 'file-loader'
            // },
            {
                test: /\.(mp3)$/,
                use: 'file-loader',
                // use: [
                //   {
                //     loader: 'file-loader',
                //     // options: { name: './src/sounds/[name].[ext]' },
                //   },
            },
            {
                test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
                use: 'file-loader',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        new CopyPlugin({
            patterns: [
                { from: './src/images', to: './images' },
                { from: './src/sounds', to: './sounds' },
            ],
        }),
    ],
};
