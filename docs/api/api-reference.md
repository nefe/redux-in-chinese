---
id: api-reference
title: API 参考
hide_title: false
---

# API 参考

Redux 的 API 非常少。Redux定义了一系列的约定（contract）来供你实现（例如 [reducers](../understanding/thinking-in-redux/Glossary.md#reducer)），同时提供了少量的辅助函数来把这些约定整合到一起。

这一章节会介绍所有的 Redux API。记住，Redux 只关心如何管理 state。在实际的项目中，你还需要使用 UI 绑定库如 [react-redux](https://github.com/gaearon/react-redux)。

### 顶级暴露的方法

- [createStore(reducer, [preloadedState], [enhancer])](createStore.md)
- [combineReducers(reducers)](combineReducers.md)
- [applyMiddleware(...middlewares)](applyMiddleware.md)
- [bindActionCreators(actionCreators, dispatch)](bindActionCreators.md)
- [compose(...functions)](compose.md)

### Store API

- [Store](Store.md)
  - [getState()](Store.md#getState)
  - [dispatch(action)](Store.md#dispatchaction)
  - [subscribe(listener)](Store.md#subscribelistener)
  - [replaceReducer(nextReducer)](Store.md#replacereducernextreducer)

### 引入

上面介绍的所有函数都是顶级暴露的方法。都可以这样引入：

#### ES6

```js
import { createStore } from 'redux'
```

#### ES5 (CommonJS)

```js
var createStore = require('redux').createStore
```

#### ES5 (UMD build)

```js
var createStore = Redux.createStore
```
