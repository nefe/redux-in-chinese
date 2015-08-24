# 词汇表

这是有关Redux中的一些核心概念的词汇表，以及他们的类型签名。这些类型使用了 [流标注法](http://flowtype.org/docs/quick-reference.html)进行记录。

## State

```js
type State = any;
```

*State* (也叫 *state tree*) 是一个宽泛的概念，但是在 Redux API 中它通常与被 store 所管理的，可以被 [`getState()`](api/Store.md#getState) 返回的，单独 state 值相关。 它表示了一个 Redux应用的全部状态，通常为一个多层嵌套的对象。

约定俗成，顶层 state 为一个对象，或几个像 Map 那样的键-值集合，当然是任意类型的话也成。当然，你仍然可以尽可能保持状态的串行化。不要把什么都放进去导致无法容易地转换成 JSON 。

## Action

```js
type Action = Object;
```

*Action* 是一个用以表示要改变的 state 的意图的普通对象。Action 是将数据拿到 store 里的唯一方法。无论是 UI 事件，网络回调，还是其他诸如 WebSocket 之类的其他源，任何数据都或多或少的被 dispatch 成 action 。

约定俗成，action 应该有一个 `type` 域指明了需要被演算的 action 类型。Type 可以被定义为常数从其他 module 中导入。比起用 [Symbols](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Symbol) 表示 `type` 使用 String 是更好的方法因为 string 是可被串行化的。

除了 `type`之外，action 对象的结构其实完全取决于你自己。如果你感兴趣的话，请参考 [Flux Standard Action](https://github.com/acdlite/flux-standard-action) 作为如何组织 actions 的建议。

还有就是请看后面的 [异步 action](#async-action) 。

## Reducer

```js
type Reducer<S, A> = (state: S, action: A) => S;
```

*Reducer* (也叫 *reducing function*) 是一个接受累积运算和一个值，返回新的累积函数的函数。用来把一个集合 reduce 到一个单独值。

Reducer 并不是 Redux 特有的——它是函数式编程中的一个基本概念。甚至大部分的非函数式语言比如 JavaScript，都有一个内建的 reduce API。在 JavaScript 中的话是 [`Array.prototype.reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce).

在 Redux 中，累计运算的结果是个 state 对象，被累积的值就是 action 。Reducer 由上一个 state 和一个 action 计算得到一个新 state 。它必须是 *纯函数* 也就是由完全相同的输入会返回完全相同的输出。它应该是没有副作用的。这使得一些很棒的功能诸如热重载和时间旅行成为可能。

Reducer 是 Redux 之中最重要的概念。

*不要在 reducer 中有 API 调用*

## dispatch function

```js
type BaseDispatch = (a: Action) => Action;
type Dispatch = (a: Action | AsyncAction) => any;
```

一个 *dispatching function* (或者简单点叫 *dispatch function*) 是一个接收一个 action 或者[异步 action](#async-action)的函数，它可以或不可以分发一个或多个 action 到 store。

我们必须搞清 dispatch function 和由没有中间件的 store 实例提供的 base [`dispatch`](api/Store.md#dispatch) function 其中的区别。

Base dispatch function *总是* 同步发 action 给 store 的 reducer，以及由 store 返回的上一个 state 计算出新 state。它期望 actions 会是一个准备好被 reducer 消费掉的普通对象。

[中间件](#middleware) 封装了base dispatch function。它允许了 dispatch function 处理 action 之外的 [异步 action](#async-action) 。中间件可以被变形，延迟，忽略，以及其他在将 action 或异步 action 传递给下一个中间件之前作出解释。获取更多信息请往后看。

## Action Creator

```js
type ActionCreator = (...args: any) => Action | AsyncAction;
```

*Action Creator* 很简单，就是一个创建 action 的函数。别把这两个概念搞混。Action 是一个信息的负载，而 action 创建者是一个创建 action 的工厂。

调用 action creator 只会生产出 action ，但不分发。你需要调用 store 的 [`dispatch`](api/Store.md#dispatch) function 才会真正引起变化。有时我们讲 *bound action creator* 意味着函数调用 action creator并立即将结果分发给一个特定的 store 实例。

如果 action 创建者需要读取当前状态、做出 API 调用、或引起诸如路由变位等副作用，应该返回一个 [异步 action](#async-action) 而不是 action 。

## 异步 Action

```js
type AsyncAction = any;
```

*异步 action* 是一个发给分发函数，但还没有准备好被 reducer 消费的值。它会在被发往 base [`dispatch()`](api/Store.md#dispatch) function 之前，被 [中间件](#middleware) 变为一个或一组 action 。异步 actions 可以有多个 type ，取决于使用的中间件。通常为 Promise 或者 thunk 之类的异步原生，虽然没有被马上传给 reducer ，但是操作一旦完成就会触发 action 分发。

## 中间件

```js
type MiddlewareAPI = { dispatch: Dispatch, getState: () => State };
type Middleware = (api: MiddlewareAPI) => (next: Dispatch) => Dispatch;
```

中间件是一个高阶函数，它将 [dispatch function](#dispatching-function) 组合并返回一个新的 dispatch function。它通常将 [异步 actions](#async-action) 变为 actions 。

中间件是使用了复合函数的可构建的。它可在 action 日志，表现副作用例如路由，或将异步 API 调用变为一组同步 actions。

请见 [`applyMiddleware(...middlewares)`](./api/applyMiddleware.md) 获取有关中间件的详细内容。

## Store

```js
type Store = {
  dispatch: Dispatch;
  getState: () => State;
  subscribe: (listener: () => void) => () => void;
  getReducer: () => Reducer;
  replaceReducer: (reducer: Reducer) => void;
};
```

Store 是一个承载有应用 state tree 的对象。
一个 Redux 应用中应当只有一个 Store ，因为构建发生于 reducer 级。

- [`dispatch(action)`](api/Store.md#dispatch) 是上面描述过的 base dispatch function 。
- [`getState()`](api/Store.md#getState) 返回当前 store 的 state。
- [`subscribe(listener)`](api/Store.md#subscribe) 注册 funtion 用于在 state 改变时调用。
- [`getReducer()`](api/Store.md#getReducer) 和 [`replaceReducer(nextReducer)`](api/Store.md#replaceReducer) 可被用于实现热重载荷代码分割。通常你用不上他们。

请见完整的 [store API reference](api/Store.md#dispatch) 获取更多细节。

## Store Creator

```js
type StoreCreator = (reducer: Reducer, initialState: ?State) => Store;
```

Store creator 是一个创建 Redux store 的函数。就像 dispatching function 那样，我们必须分清由 [`createStore(reducer, initialState)`](api/createStore.md) 从 Redux 包中导出的 base store creator ，和从 store enhancer 返回的 store creator 。

## Store enhancer

```js
type StoreEnhancer = (next: StoreCreator) => StoreCreator;
```

Store enhancer 是一个高阶函数将 store creator 组合，返回一个新的强化过的 store creator 。这与允许你使用可组合方式 变更 store 接口的中间件有点相似。

Store enhancer 是与 React 中概念非常相同的高阶 component ， 通常也会被叫做 “component enhancers” 。

因为 store 并非一个实例，而更像是几个函数的集合普通对象。复制可以被简单的创建或修改而不需变动原先的 store 。在 [`compose`](api/compose.md) 文档中有一个示例演示了这种做法。

大多数时候你不可能去写 store enhancer ，但你会用得着 [developer tools](https://github.com/gaearon/redux-devtools) 提供的。它使得app对其发生无察觉的时间旅行变得可能。搞笑的是，[Redux middleware implementation](api/applyMiddleware.md) 本身就是一个 store enhancer 。
