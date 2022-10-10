---
id: store-setup
title: Store Setup
sidebar_label: Store Setup
---

# Redux 常见问答：Store 设置

## 目录

- [Redux 常见问答：Store 设置](#redux-faq-store-setup)
  - [目录](#table-of-contents)
  - [Store 设置](#store-setup)
    - [可以或者应该创建多个 stores 吗？可以直接导入 stores，并在组件中使用它吗？](#can-or-should-i-create-multiple-stores-can-i-import-my-store-directly-and-use-it-in-components-myself)
      - [更多信息](#further-information)
    - [Store enhancer 中可以有多个 middleware 链吗？Middleware 函数中的 `next` 和 `dispatch` 有什么区别？](#is-it-ok-to-have-more-than-one-middleware-chain-in-my-store-enhancer-what-is-the-difference-between-next-and-dispatch-in-a-middleware-function)
      - [更多信息](#further-information-1)
    - [如何只订阅 state 的一部分？可以将 dispatch action 作为订阅的一部分吗？](#how-do-i-subscribe-to-only-a-portion-of-the-state-can-i-get-the-dispatched-action-as-part-of-the-subscription)
      - [更多信息](#further-information-2)

## Store 设置

### 可以或者应该创建多个 stores 吗？可以直接导入 stores，并在组件中使用它吗？

最初的 Flux 模式就是在一个应用程序中有多个 “stores”，每个 store 都保存着不同区域的域数据。这可能会引入一些问题，例如需要让一个 store “`等待`”另一个 store 进行更新。这在 Redux 中不是必需的，因为数据域之间的分离已经通过将单个 reducer 拆分为更小的 reducer 来实现。

与其他几个问题一样，在一个页面中创建多个不同的 Redux stores 是 _有可能的_，但预期的模式是只有一个 store。使用同一个 store，不但可以使用 Redux DevTools，保存和补充数据也变得更简单，同时简化了订阅逻辑。

在 Redux 中使用多个 stores 的一些正当理由可能包括：

- 当通过分析应用程序确认，以解决由于 state 的某些部分更新过于频繁而导致的性能问题。
- 将 Redux 应用程序隔离为更大应用程序中的组件，在这种情况下，你可能希望为每个根组件实例创建一个 store。

但是，创建新 stores 不应该是你的第一直觉，尤其是如果你接触过 Flux。请先尝试 reducer 组合，如果它仍不能解决你的问题，再使用多个 stores。

同样，虽然你 _可以_ 通过直接导入来引用 store 实例，但这不是 Redux 中推荐的模式。如果你创建一个 store 实例并从一个模块中导出它，它将成为一个单例。这意味着将 Redux 应用程序隔离为更大应用程序的组件（如果有必要）或启用服务端渲染将会更加困难，因为你希望在服务器上为每个请求创建单独的 store 实例。

使用 [React Redux](https://github.com/reduxjs/react-redux)，由 `connect()` 函数生成的包装类实际上会查找 `props.store`（如果存在），但最好将根组件包裹在 `<Provider store={store}>` 里，让 React Redux 将 store 传递下去。这样组件就不必担心导入 store 模块，并且隔离 Redux 应用程序或启用服务端渲染在以后也更容易做到。

#### 更多信息

**文档**

- [API: Store](../api/Store.md)

**讨论**

- [#1346：只有一个 “stores” 目录是不好的做法吗？](https://github.com/reduxjs/redux/issues/1436)
- [Stack Overflow：Redux 为什么不用多个 store 呢？](https://stackoverflow.com/questions/33619775/redux-multiple-stores-why-not)
- [Stack Overflow：在 action creator 中访问 Redux state](https://stackoverflow.com/questions/35667249/accessing-redux-state-in-an-action-creator)
- [要点：打破 Redux 范式以隔离应用程序](https://gist.github.com/gaearon/eeee2f619620ab7b55673a4ee2bf8400)

### Store enhancer 中可以有多个 middleware 链吗？Middleware 函数中的 `next` 和 `dispatch` 有什么区别？

Redux middleware 就像一个链表。每个 middleware 函数可以调用 `next(action)` 将一个 action 传递给下一个 middleware，调用 `dispatch(action)` 以在列表的开头重新开始处理，或者根本不做任何事情来停止待进一步处理的 action。

这个 middleware 链由传递给创建 store 时使用的 applyMiddleware 函数的参数定义。定义多个链将无法正常工作，因为它们具有明显不同的 `dispatch` 引用，并且不同的链将被有效地断开连接。

#### 更多信息

**文档**

- [Redux 深入浅出：Store——Middleware](../tutorials/fundamentals/part-4-store.md#middleware)
- [API：applyMiddleware](../api/applyMiddleware.md)

**讨论**

- [#1051：目前 applyMiddleware 和组合 createStore 的不足](https://github.com/reduxjs/redux/issues/1051)
- [理解 Redux Middleware](https://medium.com/@meagle/understanding-87566abcfb7a)
- [探索 Redux Middleware](https://blog.krawaller.se/posts/exploring-redux-middleware/)

### 如何只订阅 state 的一部分？可以将 dispatch action 作为订阅的一部分吗？

Redux 提供了一个单一的 `store.subscribe` 方法来通知监听器 store 已经更新。侦听器回调不接收当前 state 作为参数——它只是表明 _某些内容_ 已更改。然后订阅者逻辑可以调用 `getState()` 来获取当前 state 值。

此 API 旨在作为没有依赖关系或复杂性的低级原语，可用于构建更高级别的订阅逻辑。诸如 React Redux 之类的 UI 绑定库可以为每个连接的（connected）组件创建订阅。还可以编写可以智能地比较旧 state 与新 state 的函数，并在某些部分发生更改时执行附加逻辑。示例包括 [redux-watch](https://github.com/jprichardson/redux-watch)、[redux-subscribe](https://github.com/ashaffer/redux-subscribe) 和 [redux-subscriber](https://github.com/ivantsov/redux-subscriber)，它提供了不同的方法来指定订阅和处理更改。

新 state 不会传递给侦听器，以简化实现 store enhancers（例如 Redux DevTools）。此外，订阅者旨在对 state 值本身做出反应，而不是对 action 做出反应。如果 action 很重要并且需要专门处理，则可以使用 middleware。

#### 更多信息

**文档**

- [Redux 深入浅出：Store](../tutorials/fundamentals/part-4-store.md)
- [API：Store](../api/Store.md)

**讨论**

- [#303：以 state 为参数的订阅 API](https://github.com/reduxjs/redux/issues/303)
- [#580：是否可以在 store.subscribe 中获取 action 和 state？](https://github.com/reduxjs/redux/issues/580)
- [#922：提案：middleware API 新增提供 subscribe 方法](https://github.com/reduxjs/redux/issues/922)
- [#1057：订阅监听器可以获得 action 参数吗？](https://github.com/reduxjs/redux/issues/1057)
- [#1300：Redux 很棒，但缺少主要功能](https://github.com/reduxjs/redux/issues/1300)

**相关库**

- [Redux 插件目录：Store Change Subscriptions](https://github.com/markerikson/redux-ecosystem-links/blob/master/store.md#store-change-subscriptions)
