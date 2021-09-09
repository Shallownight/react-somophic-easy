/**
 * 新建一个服务，并使用webpack的watch功能监听server文件变化。
 * 在服务中使用webpack-dev-middleware，监听client文件变化。
 */
const path = require('path');
const express = require('express');
const webpack = require('./node_modules/webpack');
const webpackServerConfig = require('./build/webpack.server.config');
const webpackClientConfig = require('./build/webpack.client.config');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

// 作为监听端口的服务，数据请求将传递给app.js中的服务
const server = express();

let app;
let initialized;

const output = webpackServerConfig.output;
// output export 一个express服务
const outputPath = path.resolve(output.path, output.filename);

// http://fex.baidu.com/blog/2015/05/nodejs-hot-swapping/
function cleanCache(modulePath) {
    var module = require.cache[modulePath];

    // 删除module.parent中的引用，释放内存
    if (module.parent) {
        module.parent.children.splice(module.parent.children.indexOf(module), 1);
    }

    // 应该删掉该模块的cache，而非设置为null
    // require.cache[modulePath] = null;
    delete require.cache[modulePath];
}

webpack(webpackServerConfig).watch(300, function(err, stats) {
    if (err) {
        throw err;
    }

    if (stats.hasErrors() && !initialized) {
        throw new Error(stats.toSting());
    }

    if (initialized) {
        // 更新服务
        // 在node中require同一个文件时，第一次require会被node缓存，后续都会跳过，因此这里需要清理cache才能引入新的app服务
        cleanCache(outputPath);
        app = require(outputPath);
        console.log('app server updated');
    } else {
        app = require(outputPath);
        server.use((req, res, next) => {
            // app中的服务需要处理打到5000端口的请求
            app.handle(req, res, next);
        })

        // HMR配置
        // add hot-reload related code to entry chunks
        const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true&noInfo=true';
        Object.keys(webpackClientConfig.entry).forEach(function (name) {
            webpackClientConfig.entry[name].push(hotMiddlewareScript);
        });
        webpackClientConfig.mode = 'development';
        webpackClientConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

        const clientCompiler = webpack(webpackClientConfig);

        // 通过webpack-dev-middleware监听客户端变化，实时更新
        const devMiddleware = webpackDevMiddleware(clientCompiler, {
            publicPath: '/client',
            // html模板文件需要写在磁盘上，不然ssr读不到
            writeToDisk: function (filePath) {
                return /\.html?$/.test(filePath);
            },
        });

        const hotMiddleware = webpackHotMiddleware(clientCompiler, {
            log: false,
        })

        server.use(devMiddleware);
        // *** hotMiddleware 对webpack5的支持有问题，暂时先直接将hot-middle-ware中的process-update改一下：
        // ignoreUnaccepted: true => false
        server.use(hotMiddleware);

        const PORT = 5000;
        server.listen(PORT, () => {
            console.log(`http://localhost:${PORT}`);
        });

        initialized = true;
    }
});