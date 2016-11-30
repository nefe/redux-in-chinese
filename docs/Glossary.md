# 词汇表

这是 Redux 的核心概念词汇表以及这些核心概念的类型签名。这些类型使用了[流标注法](http://flowtype.org/docs/quick-reference.html)进行记录。

## State

```js
type State = any
```

*State* (也称为 *state tree*) 是一个宽泛的概念，但是在 Redux API 中，通常是指一个唯一的 state 值，由 store 管理且由 [`getState()`](api/Store.md#getState) 方法获得。它表示了 Redux 应用的全部状态，通常为一个多层嵌套的对象。

约定俗成，顶层 state 或为一个对象，或像 Map 那样的键-值集合，也可以是任意的数据类型。然而你应尽可能确保 state 可以被序列化，而且不要把什么数据都放进去，导致无法轻松地把 state 转换成 JSON。

## Action

```js
type Action = Object
```

*Action* 是一个普通对象，用来表示即将改变 state 的意图。它是将数据放入 store 的唯一途径。无论是从 UI 事件、网络回调，还是其他诸如 WebSocket 之类的数据源所获得的数据，最终都会被 dispatch 成 action。

约定俗成，action 必须拥有一个 `type` 域，它指明了需要被执行的 action type。Type 可以被定义为常量，然后从其他 module 导入。比起用 [Symbols](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Symbol) 表示 `type`，使用 String 是更好的方法，因为 string 可以被序列化。

除了 `type` 之外，action 对象的结构其实完全取决于你自己。如果你感兴趣的话，请参考 [Flux Standard Action](https://github.com/acdlite/flux-standard-action) ，了解如何构建 action。

还有就是请看后面的 [异步 action](#async-action)。

## Reducer

```js
type Reducer<S, A> = (state: S, action: A) => S
```

*Reducer* (也称为 *reducing function*) 函数接受两个参数：之前累积运算的结果和当前被累积的值，返回的是一个新的累积结果。该函数把一个集合归并成一个单值。

Reducer 并不是 Redux 特有的函数 —— 它是函数式编程中的一个基本概念，甚至大部分的非函数式语言比如 JavaScript，都有一个内置的 reduce API。对于 JavaScript，这个 API 是 [`Array.prototype.reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce).

在 Redux 中，累计运算的结果是 state 对象，而被累积的值是 action。Reducer 由上次累积的结果 state 与当前被累积的 action 计算得到一个新 state。这些 Reducer 必须是**纯函数**，而且当输入相同时返回的结果也会相同。它们不应该产生任何副作用。正因如此，才使得诸如热重载和时间旅行这些很棒的功能成为可能。

Reducer 是 Redux 之中最重要的概念。

**不要在 reducer 中有 API 调用**

## dispatch 函数

```js
type BaseDispatch = (a: Action) => Action
type Dispatch = (a: Action | AsyncAction) => any
```

*dispatching function* (或简言之 *dispatch function*) 是一个接收 action 或者[异步 action](#async-action)的函数，该函数要么往 store 分发一个或多个 action，要么不分发任何 action。

我们必须分清一般的 dispatch function 以及由 store 实例提供的没有 middleware 的 base [`dispatch`](api/Store.md#dispatch) function 之间的区别。

Base dispatch function **总是**同步地把 action 与上一次从 store 返回的 state 发往 reducer，然后计算出新的 state。它期望 action 会是一个可以被 reducer 消费的普通对象。

[Middleware](#middleware) 封装了 base dispatch function，允许 dispatch function 处理 action 之外的[异步 action](#async-action)。 Middleware 可以改变、延迟、忽略 action 或异步 action，也可以在传递给下一个 middleware 之前对它们进行解释。获取更多信息请往后看。

## Action Creator

```js
type ActionCreator = (...args: any) => Action | AsyncAction
```

*Action Creator* 很简单，就是一个创建 action 的函数。不要混淆 action 和 action creator 这两个概念。Action 是一个信息的负载，而 action creator 是一个创建 action 的工厂。

调用 action creator 只会生产 action，但不分发。你需要调用 store 的 [`dispatch`](api/Store.md#dispatch) function 才会引起变化。有时我们讲 *bound action creator*，是指一个函数调用了 action creator 并立即将结果分发给一个特定的 store 实例。

如果 action creator 需要读取当前的 state、调用 API、或引起诸如路由变化等副作用，那么它应该返回一个[异步 action](#async-action)而不是 action。

## 异步 Action

```js
type AsyncAction = any
```

*异步 action* 是一个发给 dispatching 函数的值，但是这个值还不能被 reducer 消费。在发往 base [`dispatch()`](api/Store.md#dispatch) function 之前，[middleware](#middleware) 会把异步 action 转换成一个或一组 action。异步 action 可以有多种 type，这取决于你所使用的 middleware。它通常是 Promise 或者 thunk 之类的异步原生数据类型，虽然不会立即把数据传递给 reducer，但是一旦操作完成就会触发 action 的分发事件。

##  Middleware

```js
type MiddlewareAPI = { dispatch: Dispatch, getState: () => State }
type Middleware = (api: MiddlewareAPI) => (next: Dispatch) => Dispatch
```

Middleware 是一个组合 [dispatch function](#dispatching-function) 的高阶函数，返回一个新的 dispatch function，通常将[异步 actions](#async-action) 转换成 action。

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

Store 维持着应用的 state tree 对象。
因为应用的构建发生于 reducer，所以一个 Redux 应用中应当只有一个 Store。

- [`dispatch(action)`](api/Store.md#dispatch) 是上述的 base dispatch function。
- [`getState()`](api/Store.md#getState) 返回当前 store 的 state。
- [`subscribe(listener)`](api/Store.md#subscribe) 注册一个 state 发生变化时的回调函数。
- [`replaceReducer(nextReducer)`](api/Store.md#replaceReducer) 可用于热重载和代码分割。通常你不需要用到这个 API。

详见完整的 [store API reference](api/Store.md#dispatch)。

## Store Creator

```js
type StoreCreator = (reducer: Reducer, initialState: ?State) => Store
```

Store creator 是一个创建 Redux store 的函数。就像 dispatching function 那样，我们必须分清通过 [`createStore(reducer, initialState)`](api/createStore.md) 由 Redux 导出的 base store creator 与从 store enhancer 返回的 store creator 之间的区别。

## Store enhancer

```js
type StoreEnhancer = (next: StoreCreator) => StoreCreator
```

Store enhancer 是一个组合 store creator 的高阶函数，返回一个新的强化过的 store creator。这与 middleware 相似，它也允许你通过复合函数改变 store 接口。

Store enhancer 与 React 的高阶 component 概念一致，通常也会称为 “component enhancers”。

因为 store 并非实例，更像是一个函数集合的普通对象，所以可以轻松地创建副本，也可以在不改变原先的 store 的条件下修改副本。在 [`compose`](api/compose.md) 文档中有一个示例演示了这种做法。

大多数时候你基本不用编写 store enhancer，但你可能会在 [developer tools](https://github.com/gaearon/redux-devtools) 中用到。正因为 store enhancer，应用程序才有可能察觉不到“时间旅行”。有趣的是，[Redux middleware 本身的实现](api/applyMiddleware.md)就是一个 store enhancer。
