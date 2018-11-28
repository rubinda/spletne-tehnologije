const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: `${__dirname}/NWjs/dist`,
        filename: 'bundle.js',
    },
    target: 'node',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Avocado template',
            template: 'src/index.html',
        }),
        new CopyWebpackPlugin([
            { from: 'data/avocado.csv', to: 'data/avocado.csv' },
            { from: 'package.json', to: '../package.json' },
        ]),
    ],
    externals: {
        google: 'google', // or any other alias you want, can be a regex too! check Webpack's doc for more
    },
};
