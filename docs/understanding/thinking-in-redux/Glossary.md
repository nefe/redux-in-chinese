---
id: glossary
title: 词汇表
hide_title: false
---

# 词汇表

在这里做一个 Redux 的核心词汇以及类型签名的词汇表。其中类型使用 [Flow 标注](https://flowtype.org/docs/quick-reference.html) 来表示。

## State

```js
type State = any
```

_State_ (也称为 state tree) 是一个宽泛的概念，但是在 Redux API 中，通常是指一个唯一的 state 值，由 store 管理且由 [`getState()`](api/Store.md#getState) 方法获得。这个 state 表示一个 Redux 应用的全部状态，通常为一个多层嵌套的对象。

约定俗成，顶层 state 可以是一个对象，可以是像 Map 那样的键-值对集合，也可以是任意的数据类型。但是你应尽可能保证 state 是可序列化的，所以不要把什么数据都放进去，导致 state 不能很轻松地转换成 JSON。

## Action

```js
type Action = Object
```

_Action_ 是一个简单对象（纯对象），用来表示即将要改变 state 的倾向。它是将数据存入 store 的唯一途径。无论是从 UI 事件、网络回调，还是其他诸如 WebSocket 之类的数据源所获得的数据，最终都会被当作 action 被 dispatch。

Action 必须有一个 `type` 字段代表需要被执行的 action 类别。Type 可以被定义为常量并从其他 module 导入。比起用 [Symbols](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Symbol) 表示 `type`，最好用 string 类型来表示，因为 string 可以被序列化。

除了 `type` 字段，其他 action 对象的数据结构完全取决于你自己。感兴趣的话，推荐你参考 [Flux Standard Action](https://github.com/acdlite/flux-standard-action) ，了解 action 的数据结构应该怎么组织比较好。

还有就是请看后面的 [异步 action](#异步-action)。

## Reducer

```js
type Reducer<S, A> = (state: S, action: A) => S
```

_Reducer_ (也称为 _reducing function_) 是一个函数，接受两个参数：之前累积运算的结果和当前需要被被累积计算的值，返回的是一个新的累积计算结果。该函数把一个集合归并成一个单值。

Reducer 并不是 Redux 特有的函数 —— 它是函数式编程中的一个基本概念，甚至大部分的非函数式变成范式语言比如 JavaScript，都有一个内置的 reduce API。比如对于 JavaScript，有个 [`Array.prototype.reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) 的 API .

在 Redux 中，累计运算的结果就是 state 对象，将要累计运算的是 action。Reducer 由上次累积的结果 state 与当前被累积的 action 计算得到一个新 state。Reducer 必须是**纯函数**——即相同的输入只会返回相同的结果的函数。纯函数不能产生任何副作用。只有这样，才可能实现一些花里胡哨的特性，比如热重载和时间旅行（time travel）。

Reducer 是 Redux 之中最重要的概念。

**不要在 reducer 中调用 API 接口请求**

## dispatch function

```js
type BaseDispatch = (a: Action) => Action
type Dispatch = (a: Action | AsyncAction) => any
```

_dispatching 函数_ (或简言之 _dispatch function_) 是一个接收 action 或者[异步 action](#异步-action)作为参数的函数，该函数可以向 store 中 dispatch 若干个 action，即可以不 dispatch、dispatch 一个或多个 action。

我们要区分一般的 dispatch function 以及由 store 实例提供的没有 middleware 的 base [`dispatch`](api/Store.md#dispatch) function。

Base dispatch function **总是**同步地将 action 与上一次从 store 返回的 state 传递给 reducer，然后计算出新的 state。它要求 action 是一个可以被 reducer 消费的普通对象。

[Middleware](#middleware) 封装了 base dispatch function，使得 dispatch function 除了可以处理普通 action ，还可以处理 [异步 action](#异步-action)。 Middleware 可以改变、延迟、忽略、异步化 action，或者对 action 进行一些其他的修饰，再将 action 传递给下一个 middleware。获取更多信息请往后看。

## Action Creator

```js
type ActionCreator<A, P extends any[] = any[]> = (...args: P) => Action | AsyncAction
```

_Action Creator_ 很简单，就是一个创建 action 的函数。不要混淆 action 和 action creator 这两个概念。Action 是信息的一个载体，而 action creator 是一个创建 action 的工厂。

调用 action creator 只会生成 action，不会 dispatch。你需要调用 store 的 [`dispatch`](api/Store.md#dispatch) function 才会引起变化。有时我们讲 _绑定过的 action creator_，是指一个调用了 action creator 并立即将结果 dispatch 给一个特定的 store 实例的函数。

如果 action creator 需要读取当前的 state、调用 API 接口、或引起诸如路由变化等副作用，那么它应该返回一个[异步 action](#异步-action)而不是普通 action。

## 异步 Action

```js
type AsyncAction = any
```

_异步 action_ 是一个传递给 dispatching 函数的值，但是这个值还不能被 reducer 消费。在传递给 base [`dispatch()`](api/Store.md#dispatchaction) function 之前，[middleware](#middleware) 会把异步 action 转换成一个或一组 action。异步 action 可以有多种 type，取决于你所使用的 middleware。它通常是 Promise 或者 thunk 之类的异步原生数据类型，虽然不会立即把数据传递给 reducer，但是一旦操作完成就会触发 action 的 dispatch 事件。

## Middleware

```js
type MiddlewareAPI = { dispatch: Dispatch, getState: () => State }
type Middleware = (api: MiddlewareAPI) => (next: Dispatch) => Dispatch
```

Middleware 是一个高阶函数，它用来组合[dispatch function](#dispatching-function)并返回一个新的 dispatch function，通常将[异步 action](#异步-action) 转换成 action。

Middleware 利用复合函数使其可以组合其他函数，可用于记录 action 日志、产生其他诸如变化路由的副作用，或将异步的 API 调用变为一组同步的 action。

请见 [`applyMiddleware(...middlewares)`](./api/applyMiddleware.md) 获取 middleware 的详细内容。

## Store

```js
type Store = {
  dispatch: Dispatch
  getState: () => State
  subscribe: (listener: () => void) => () => void
  replaceReducer: (reducer: Reducer) => void
}
```

Store 就是存储着应用的 state tree 的对象。
因为它的构建发生于 reducer 层，所以一个 Redux 应用中应当只有一个 Store。

- [`dispatch(action)`](api/Store.md#dispatchaction) 是上述的 base dispatch function。
- [`getState()`](api/Store.md#getState) 返回当前 store 的 state。
- [`subscribe(listener)`](api/Store.md#subscribelistener) 注册一个 state 发生变化时的回调函数。
- [`replaceReducer(nextReducer)`](api/Store.md#replacereducernextreducer) 可用于热重载和代码分割。通常你不需要用到这个 API。

详见完整的 [store API 文档](api/Store.md#dispatchaction)。

## Store creator

```js
type StoreCreator = (reducer: Reducer, preloadedState: ?State) => Store
```

Store creator 是一个创建 Redux store 的函数。就像 dispatch function 那样，我们必须区分 base store creator 和 store creator，前者是从 Redux 包导出的 [`createStore(reducer, initialState)`](api/createStore.md)，后者是 store enhancer 返回的 store creator。

## Store enhancer

```js
type StoreEnhancer = (next: StoreCreator) => StoreCreator
```

Store enhancer 是一个构建 store creator 的高阶函数，返回一个新的，增强过的 store creator。和 middleware 类似，store enhancer 也允许你通过复合函数改变 store 接口。

Store enhancer 与 React 的高阶组件概念一致，高阶组件通常也被称为 “component enhancers”。

因为 store 并非实例，更像是一个保存着函数集合的普通对象，所以可以轻松地创建副本，也可以在不改变原先的 store 的条件下修改副本。在 [`compose`](api/compose.md) 文档中有一个示例演示了这种做法。

大多数时候你基本不用编写 store enhancer，但你可能会在 [developer tools](https://github.com/reduxjs/redux-devtools) 中用到。正因为 store enhancer，应用程序才有可能无察觉情况下实现“时间旅行 Time Travel”。有趣的是，[Redux middleware 的实现](api/applyMiddleware.md)本身就是一个 store enhancer。
