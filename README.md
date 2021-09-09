# react-isomophic-easy

> 简单的同构项目，用于理解客户端渲染

## 使用方法

安装npm包 - npm i

运行
1. npm run dll
2. npm run dev

## 教程
根据代码commit记录和博客进行理解：  

| commit hash |         blog         |
| ----------- | -------------------- |
| 0722007     | [同构01 - 基础服务端渲染](https://www.yuque.com/sbvv3s/wxzhm7/tec8wu) |
| 1b15552     | [同构02 - 使用模板引擎](https://www.yuque.com/sbvv3s/wxzhm7/lw56ul) |
| 7853abc     | [同构03 - React代码服务端渲染](https://www.yuque.com/sbvv3s/wxzhm7/eg0ilp) |
| c2d7b5a     | [同构04 - React.hydrate补水](https://www.yuque.com/sbvv3s/wxzhm7/uelq7t) |
| 9875404     | [同构05 - 多页构建](https://www.yuque.com/sbvv3s/wxzhm7/rgs9ng) |
| 0f6b760     | [同构06 - DLL动态链接库](https://www.yuque.com/sbvv3s/wxzhm7/msb6hi) |
| ——————      | [同构07 - 思路整理](https://www.yuque.com/sbvv3s/wxzhm7/hqq8ix) |
| 2daeeb3     | [同构08 - 服务端打包入口切换](https://www.yuque.com/sbvv3s/wxzhm7/drhd4y) |
| 706bcd4     | [同构09 - 创建开发服务并自动更新服务端代码](https://www.yuque.com/sbvv3s/wxzhm7/wfz9b2) |

## hacky
hotMiddleware 对webpack5的支持有问题，暂时先直接将hot-middle-ware中的process-update改一下：
ignoreUnaccepted: true => false