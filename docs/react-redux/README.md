React Redux
=========================

> 译者注：本库并不是 Redux 内置，需要单独安装。因为一般会和 Redux 一起使用，所以放到一起翻译

[Redux](https://github.com/rackt/redux) 官方提供的 React 绑定库。  
具有高效且灵活的特性。

## 安装

React Redux 依赖 **React 0.14 或更新版本。**

```
npm install --save react-redux
```

你需要使用 [npm](http://npmjs.com/) 作为包管理工具，配合 [Webpack](http://webpack.github.io) 或 [Browserify](http://browserify.org/) 作为模块打包工具来加载 [CommonJS 模块](http://webpack.github.io/docs/commonjs.html)。

如果你不想使用 [npm](http://npmjs.com/) 和模块打包工具，只想打包一个 [UMD](https://github.com/umdjs/umd) 文件来提供 `ReactRedux` 全局变量，那么可以使用 [cdnjs](https://cdnjs.com/libraries/react-redux) 上打包好的版本。但对于非常正式的项目并不建议这么做，因为和 Redux 一起工作的大部分库都只有 [npm](http://npmjs.com/) 才能提供。

## React Native

在 [React Native 支持 React 0.14](https://github.com/facebook/react-native/issues/2985) 前，你需要使用 [React Redux 3.x 分支和对应文档](https://github.com/rackt/react-redux/tree/v3.1.0).

## 文档

- [快速入门](quick-start.md#quick-start)
- [API](api.md#api)
  - [`<Provider store>`](api.md#provider-store)
  - [`connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])`](api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)
- [排错](troubleshooting.md#troubleshooting)
