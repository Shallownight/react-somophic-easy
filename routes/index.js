const pages = require('../build/pages').pagesList;
const React = require('react');
const ReactDOMServer = require('react-dom/server');

// 页面的名称 - 模块映射
const pageMap = pages.reduce((acc, page) => {
    acc[page] = require('./server/' + page);
    return acc
}, {});

function routes(app) {
    app.get('/:page.html', function(req, res, next) {
        const page = req.params.page;
        if (!pages.includes(page)) {
            res.render(page, {
                content: 404
            })
        }

        const contentHtml = ReactDOMServer.renderToString(
            // 在服务端运行 React
            React.createElement(pageMap[page])
        );

        res.render(page, {
            content: contentHtml
        })
    })
}

module.exports = routes;