# API 文档

Redux 的 API 非常少。Redux 定义了一系列的约定（contract）来让你来实现（例如 [reducers](../Glossary.md#reducer)），同时提供少量辅助函数来把这些约定整合到一起。

这一章会介绍所有的 Redux API。记住，Redux 只关心如何管理 state。在实际的项目中，你还需要使用 UI 绑定库如 [react-redux](https://github.com/gaearon/react-redux)。

### 顶级暴露的方法

* [createStore(reducer, [preloadedState], [enhancer])](createStore.md)
* [combineReducers(reducers)](combineReducers.md)
* [applyMiddleware(...middlewares)](applyMiddleware.md)
* [bindActionCreators(actionCreators, dispatch)](bindActionCreators.md)
* [compose(...functions)](compose.md)

### Store API

* [Store](Store.md)
  * [getState()](Store.md#getState)
  * [dispatch(action)](Store.md#dispatch)
  * [subscribe(listener)](Store.md#subscribe)
  * [getReducer()](Store.md#getReducer)
  * [replaceReducer(nextReducer)](Store.md#replaceReducer)

### 引入

上面介绍的所有函数都是顶级暴露的方法。都可以这样引入：

#### ES6

```js
import { createStore } from 'redux';
```

#### ES5 (CommonJS)

```js
var createStore = require('redux').createStore;
```

#### ES5 (UMD build)

```js
var createStore = Redux.createStore;
```
