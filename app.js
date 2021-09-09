const path = require('path');
const express = require('express');
const ejs = require('ejs');
const routes = require('./routes');

const app = express();

// 注册ejs扩展
// 当app.js被打包时，不能通过app.set('view engine', 'ejs')设置模板引擎，而需要require后先注册
// app.engine('.ejs', require('ejs').__express);
app.engine('.html', ejs.renderFile);

// 设置模板引擎的模板目录
app.set('views', path.resolve(__dirname, '../views'));
// app.set('view engine', 'ejs')
app.set('view engine', 'html');

// 将dist输出目录作为静态资源目录
app.use(express.static('dist'));

// 路由
routes(app);

module.exports = app;