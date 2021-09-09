const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        vendors: ['react', 'react-dom']
    },
    output: {
        path: path.resolve(__dirname, '../dist/dll'),
        filename: '[name].js',
        library: '[name]'
    },
    plugins: [
        new webpack.DllPlugin({
            name: '[name]',
            path: path.resolve(__dirname, '../dist/dll/[name].manifest.json')
        })
    ]
}