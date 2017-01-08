# Redux 常见问题：创建 Store

## 目录

- [可以创建多个 store 吗，应该这么做吗？能在组件中直接引用 store 并使用吗？](#store-setup-multiple-stores)
- [在 store enhancer 中可以存在多个 middleware 链吗？ 在 middleware 方法中，next 和 dispatch 之间区别是什么？](#store-setup-middleware-chains)
- [怎样只订阅 state 的一部分变更？如何将分发的 action 作为订阅的一部分？](#store-setup-subscriptions)

## 创建 Store

<a id="store-setup-multiple-stores"></a>
### 可以创建多个 store 吗，应该这么做吗？能在组件中直接引用 store 并使用吗？

Flux 原始模型中一个应用有多个 “store”，每个都维护了不同维度的数据。这样导致了类似于一个 store “等待” 另一 store 操作的问题。Redux 中将 reducer 分解成多个小而美的 reducer，进而切分数据域，避免了这种情况的发生。

正如上述问题所述，“可能” 在一个页面中创建多个独立的 Redux store，但是预设模式中只会有一个 store。仅维持单个 store 不仅可以使用 Redux DevTools，还能简化数据的持久化及深加工、精简订阅的逻辑处理。

在 Redux 中使用多个 store 的理由可能包括：

* 对应用进行性能分析时，解决由于过于频繁更新部分 state 引起的性能问题。
* 在更大的应用中 Redux 只是作为一个组件，这种情况下，你也许更倾向于为每个根组件创建单独的 store。

然而，创建新的 store 不应成为你的第一反应，特别是当你从 Flux 背景迁移而来。首先尝试组合 reducer，只有当它无法解决你的问题时才使用多个 store。

类似的，虽然你 *能* 直接导入并获取 store 实例，但这并非 Redux 的推荐方式。当你创建 store 实例并从组件导出，它将变成一个单例。这意味着将很难把 Redux 应用封装成一个应用的子组件，除非这是必要的，或者为了实现服务端渲染需要为每一个请求创建单独的 store 实例。

借助 [React Redux](https://github.com/rackt/react-redux)，由 `connect()` 生成的包装类实际上会检索存在的 `props.store`，但还是推荐将根组件包装在 `<Provider store={store}>` 中，这样传递 store 的任务都交由 React Redux 处理。这种方式，我们不用考虑 store 模块的导入、 Redux 应用的封装，后期支持服务器渲染也将变得更为简便。

#### 补充资料

**文档**

- [API: Store](/docs/api/Store.md)

**讨论**

- [#1346: Is it bad practice to just have a 'stores' directory？](https://github.com/reactjs/redux/issues/1436)
- [Stack Overflow: Redux multiple stores, why not？](http://stackoverflow.com/questions/33619775/redux-multiple-stores-why-not)
- [Stack Overflow: Accessing Redux state in an action creator](http://stackoverflow.com/questions/35667249/accessing-redux-state-in-an-action-creator)
- [Gist: Breaking out of Redux paradigm to isolate apps](https://gist.github.com/gaearon/eeee2f619620ab7b55673a4ee2bf8400)

<a id="store-setup-middleware-chains"></a>
### 在 store enhancer 中可以存在多个 middleware 链吗？ 在 middleware 方法中，`next` 和 `dispatch` 之间区别是什么？

Redux middleware 就像一个链表。每个 middleware 方法既能调用 `next(action)` 传递 action 到下一个 middleware，也可以调用 `dispatch(action)` 重新开始处理，或者什么都不做而仅仅终止 action 的处理进程。

创建 store 时， `applyMiddleware` 方法的入参定义了 middleware 链。定义多个链将无法正常执行，因为它们的 `dispatch` 引用显然是不一样的，而且不同的链也无法有效连接到一起。

#### 补充资料

**文档**

- [Advanced: Middleware](/docs/advanced/Middleware.md)
- [API: applyMiddleware](/docs/api/applyMiddleware.md)

**讨论**

- [#1051: Shortcomings of the current applyMiddleware and composing createStore](https://github.com/reactjs/redux/issues/1051)
- [Understanding Redux Middleware](https://medium.com/@meagle/understanding-87566abcfb7a)
- [Exploring Redux Middleware](http://blog.krawaller.se/posts/exploring-redux-middleware/)

<a id="store-setup-subscriptions"></a>
### 怎样只订阅 state 的一部分变更？如何将分发的 action 作为订阅的一部分？

Redux 提供了独立的 `store.subscribe` 方法用于通知监听器 store 的变更信息。监听器的回调方法并没有把当前的 state 作为入参，它仅仅代表了 *有些数据* 被更新。订阅者的逻辑中调用 `getState()` 获取当前的 state 值。

这个 API 是没有依赖及副作用的底层接口，可以用于创建高阶订阅者逻辑。类似 React Redux 的 UI 绑定能为所有连接的组件都创建订阅。也可以用于编写智能的新旧 state 比对方法，从而在某些内容变化时执行额外的逻辑处理。示例 [redux-watch](https://github.com/jprichardson/redux-watch) 和 [redux-subscribe](https://github.com/ashaffer/redux-subscribe) 提供不同的方式用于指定订阅及处理变更。

新的 state 没有传递给监听者，目的是简化 store enhancer 的实现，比如 Redux DevTools。此外，订阅者旨在响应 state 值本身，而非 action。当 action 很重要且需要特殊处理时，使用 middleware。

#### 补充资料

**文档**

- [Basics: Store](/docs/basics/Store.md)
- [API: Store](/docs/api/Store.md)

**讨论**

- [#303: subscribe API with state as an argument](https://github.com/reactjs/redux/issues/303)
- [#580: Is it possible to get action and state in store.subscribe？](https://github.com/reactjs/redux/issues/580)
- [#922: Proposal: add subscribe to middleware API](https://github.com/reactjs/redux/issues/922)
- [#1057: subscribe listener can get action param？](https://github.com/reactjs/redux/issues/1057)
- [#1300: Redux is great but major feature is missing](https://github.com/reactjs/redux/issues/1300)

**库**

- [Redux Addons Catalog: Store Change Subscriptions](https://github.com/markerikson/redux-ecosystem-links/blob/master/store.md#store-change-subscriptions)
