React Redux
=========================

> 译者注：本库并不是 Redux 内置，需要单独安装。因为一般会和 Redux 一起使用，所以放到一起翻译

[Redux](https://github.com/reactjs/redux) 官方提供的 React 绑定库。
具有高效且灵活的特性。

[![build status](https://img.shields.io/travis/reactjs/react-redux/master.svg?style=flat-square)](https://travis-ci.org/reactjs/react-redux) [![npm version](https://img.shields.io/npm/v/react-redux.svg?style=flat-square)](https://www.npmjs.com/package/react-redux)
[![npm downloads](https://img.shields.io/npm/dm/react-redux.svg?style=flat-square)](https://www.npmjs.com/package/react-redux)
[![redux channel on slack](https://img.shields.io/badge/slack-redux@reactiflux-61DAFB.svg?style=flat-square)](http://www.reactiflux.com)


## 安装

React Redux 依赖 **React 0.14 或更新版本。**

```
npm install --save react-redux
```

你需要使用 [npm](http://npmjs.com/) 作为包管理工具，配合 [Webpack](http://webpack.github.io) 或 [Browserify](http://browserify.org/) 作为模块打包工具来加载 [CommonJS 模块](http://webpack.github.io/docs/commonjs.html)。

如果你不想使用 [npm](http://npmjs.com/) 和模块打包工具，只想打包一个 [UMD](https://github.com/umdjs/umd) 文件来提供 `ReactRedux` 全局变量，那么可以使用 [cdnjs](https://cdnjs.com/libraries/react-redux) 上打包好的版本。但对于非常正式的项目**并不**建议这么做，因为和 Redux 一起工作的大部分库都只有 [npm](http://npmjs.com/) 才能提供。

## React Native

从 React Native 0.18 发布之后，4.x 版本的 React Redux 能搭配 React Native 一起开发。如果你在使用 4.x 版本的 React Redux 和 React Native 一起开发遇到问题时，请先运行 `npm ls react` 确保你的 `node_modules` 中没有 React 的复制品。我们建议你使用  `npm@3.x` 来更好地规避这类问题。

如果你使用的是旧版本的 React Native 遇到[这个问题](https://github.com/facebook/react-native/issues/2985)，你可能需要继续使用 [React Redux 3.x 和对应文档](https://github.com/reactjs/react-redux/tree/v3.1.0)去解决。

## 文档

- [Redux：搭配 React](http://cn.redux.js.org/docs/basics/UsageWithReact.html)
- [API](api.md#api)
  - [`<Provider store>`](api.md#provider-store)
  - [`connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])`](api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)
- [排错](troubleshooting.md#troubleshooting)

## 它是如何工作的？

我们在 [readthesource 中的一段](https://www.youtube.com/watch?v=VJ38wSFbM3A)有深入讨论到。  
尽情享用吧！
