const path = require('path');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.config');
const pagesConfigList = require('./pages').pagesConfigList;

const multiPageEntry = {};
pagesConfigList.forEach(pageConfig => {
    multiPageEntry[pageConfig.name] = [path.resolve(__dirname, '../' + pageConfig.entry)];
});

function getHtmlWebpackPlugins() {
    const htmlPlugins = [];
    pagesConfigList.forEach((pageConfig) => {
        const htmlWebpackPluginConfig = {
            filename: pageConfig.filename,
            // 为了让ssr能够将内容插入到content，这里必须要用自定义模板，并暴露出content的入口，但是ejs模板中的content等内容会被解析并报错
            // 因此在必须使用content等变量的时候，需要令webpack不认识（不解析）<% %>这种语法，直接输出
            // https://github.com/jantimon/html-webpack-plugin/issues/664
            template: '!!raw-loader!' + path.resolve(__dirname, '../' + pageConfig.template),
            chunks: [pageConfig.name],
            // todo: delete (方便调试)
            minify: false
        }
        htmlPlugins.push(new HtmlWebpackPlugin(htmlWebpackPluginConfig));
    })
    return htmlPlugins;
}

module.exports = merge(baseWebpackConfig, {
    entry: multiPageEntry,
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../dist/client')
    },
    plugins: [
        new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, '../dist/dll/vendors.manifest.json')
        }),
        ...getHtmlWebpackPlugins()
    ]
})