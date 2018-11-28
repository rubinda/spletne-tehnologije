const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    plugins: [
        new CleanWebpackPlugin(['NWjs/dist', 'NWjs/package.json']),
    ],
    externals: {
        google: 'google', // or any other alias you want, can be a regex too! check Webpack's doc for more
    },
};
