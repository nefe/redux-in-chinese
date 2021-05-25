---
id: installation
title: 安装
description: '简介 > 安装: Redux 和关联组件库的安装指引'
hide_title: false
---

# 安装

## Redux Toolkit

Redux Toolkit 包含了 Redux 核心，以及我们认为对于构建 Redux 应用程序必不可少的其他关键软件包（例如 Redux Thunk 和 Reselect）。

它提供了 NPM 软件包，安装方式如下：

```bash
# NPM
npm install @reduxjs/toolkit

# Yarn
yarn add @reduxjs/toolkit
```

它还支持 UMD 包的方式使用，可以通过 [unpkg 上的 `dist` 文件夹](https://unpkg.com/@reduxjs/toolkit/dist/) 来加载。UMD 包让你可以通过 `window.RTK` 全局变量来使用 Redux Toolkit。

## Redux 核心

安装稳定版：

```bash
# NPM
npm install redux

# Yarn
yarn add redux
```

如果不是，则可以[通过 unpkg 访问这些文件](https://unpkg.com/redux/)，下载它们或将包管理器指向它们。

最常见的是，人们将 Redux 用作 [CommonJS](http://www.commonjs.org/) 模块的集合。这些模块是在 [Webpack](https://webpack.js.org/)
、[Browserify](http://browserify.org/) 或 Node 环境中导入 `redux` 时获得的。如果你追求最新技术并使用 [Rollup](https://rollupjs.org)，我们也支持。

如果你不想使用模块打包器，也可以。`redux` npm 包已经在 [`dist` 文件夹](https://unpkg.com/redux/dist/)下包含了预编译的生产和开发环境的 [UMD](https://github.com/umdjs/umd) 文件。没有模块打包器一样可以使用，因此与许多流行的 JavaScript 模块加载器和环境兼容。比如，你可以在页面上通过 [`<script>` 标签](https://unpkg.com/redux/dist/redux.js) 来使用 UMD 包，或者[让 Bower 来安装它](https://github.com/reduxjs/redux/pull/1181#issuecomment-167361975)。UMD 包可以让你使用 `window.Redux` 全局变量来访问 Redux。

Redux 源码是基于 ES2015 编写，但我们已经预编译到 ES5 形式的 CommonJS and UMD 包。所以可以在[任意现代浏览器](https://caniuse.com/#feat=es5)下使用。并不一定需要 Babel 或者模块打包器才能[使用 Redux](https://redux.js.org/introduction/examples#counter-vanilla).

## 配套工具

最可能的是，你还需要搭配使用 [React 绑定](https://github.com/reduxjs/react-redux) 和 [开发者工具](https://github.com/reduxjs/redux-devtools).

```bash
npm install react-redux
npm install --save-dev redux-devtools
```

请注意，与 Redux 不同，Redux 生态系统中的许多软件包都不提供 UMD 包，因此我们建议使用 CommonJS 或模块打包器，例如 [Webpack](https://webpack.js.org/) 或 [Browserify](http://browserify.org/)，以获得最舒适的开发经验。

### 创建一个 React Redux 应用

官方推荐的创建 React Redux 新应用的方式是使用 [官方 Redux+JS 模版](https://github.com/reduxjs/cra-template-redux)，它基于 [Create React App](https://github.com/facebook/create-react-app)，它利用了 **[Redux Toolkit](https://redux-toolkit.js.org/)** 和 Redux 与 React 组件的集成.

```sh
npx create-react-app my-app --template redux
```
