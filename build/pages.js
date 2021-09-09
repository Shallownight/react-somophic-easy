const fs = require('fs');
const path = require('path');

// 因为服务端构建时要用到pagesList，因此不能通过__dirname来获取路径（被打包后路径会更改）
// const pagesList = fs.readdirSync(path.resolve(__dirname, '../src'));
const pagesList = ['ImageGallery', 'TodoList'];

function getPageConfig() {
    const pagesConfig = [];
    pagesList.forEach(pageName => {
        pagesConfig.push({
            name: pageName,
            template: `views/template.html`,
            filename: `../views/${pageName}.html`,
            entry: `routes/client/${pageName}.js`,
        });
    })
    return pagesConfig;
}

const pagesConfigList = getPageConfig();

module.exports = {
    pagesList,
    pagesConfigList
};
