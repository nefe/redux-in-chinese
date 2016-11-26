# Store

Store 就是用来维持应用所有的 [state 树](../Glossary.md#state) 的一个对象。
改变 store 内 state 的惟一途径是对它 dispatch 一个 [action](../Glossary.md#action)。

Store 不是类。它只是有几个方法的对象。
要创建它，只需要把根部的 [reducing 函数](../Glossary.md#reducer) 传递给 [`createStore`](createStore.md)。

>##### Flux 用户使用注意

>如果你以前使用 Flux，那么你只需要注意一个重要的区别。Redux 没有 Dispatcher 且不支持多个 store。相反，只有一个单一的 store 和一个根级的 reduce 函数（reducer）。随着应用不断变大，你应该把根级的 reducer 拆成多个小的 reducers，分别独立地操作 state 树的不同部分，而不是添加新的 stores。这就像一个 React 应用只有一个根级的组件，这个根组件又由很多小组件构成。

### Store 方法

- [`getState()`](#getState)
- [`dispatch(action)`](#dispatch)
- [`subscribe(listener)`](#subscribe)
- [`replaceReducer(nextReducer)`](#replaceReducer)

## Store 方法

### <a id='getState'></a>[`getState()`](#getState)

返回应用当前的 state 树。  
它与 store 的最后一个 reducer 返回值相同。

#### 返回值

*(any)*: 应用当前的 state 树。

<hr>

### <a id='dispatch'></a>[`dispatch(action)`](#dispatch)

分发 action。这是触发 state 变化的惟一途径。

会使用当前 [`getState()`](#getState) 的结果和传入的 `action` 以同步方式的调用 store 的 reduce 函数。返回值会被作为下一个 state。从现在开始，这就成为了 [`getState()`](#getState) 的返回值，同时变化监听器(change listener)会被触发。

>##### Flux 用户使用注意
>当你在 [reducer](../Glossary.md#reducer) 内部调用 `dispatch` 时，将会抛出错误提示“Reducers may not dispatch actions.（Reducer 内不能 dispatch action）”。这就相当于 Flux 里的 “Cannot dispatch in a middle of dispatch（dispatch 过程中不能再 dispatch）”，但并不会引起对应的错误。在 Flux 里，当 Store 处理 action 和触发 update 事件时，dispatch 是禁止的。这个限制并不好，因为他限制了不能在生命周期回调里 dispatch action，还有其它一些本来很正常的地方。

>在 Redux 里，只会在根 reducer 返回新 state 结束后再会调用事件监听器，因此，你可以在事件监听器里再做 dispatch。惟一使你不能在 reducer 中途 dispatch 的原因是要确保 reducer 没有副作用。如果 action 处理会产生副作用，正确的做法是使用异步 [action 创建函数](../Glossary.md#action-creator)。

#### 参数

1. `action` (*Object*<sup>†</sup>): 描述应用变化的普通对象。Action 是把数据传入 store 的惟一途径，所以任何数据，无论来自 UI 事件，网络回调或者是其它资源如 WebSockets，最终都应该以 action 的形式被 dispatch。按照约定，action 具有 `type` 字段来表示它的类型。type 也可被定义为常量或者是从其它模块引入。最好使用字符串，而不是 [Symbols](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Symbol) 作为 action，因为字符串是可以被序列化的。除了 `type` 字段外，action 对象的结构完全取决于你。参照 [Flux 标准 Action](https://github.com/acdlite/flux-standard-action) 获取如何组织 action 的建议。

#### 返回值

(Object<sup>†</sup>): 要 dispatch 的 action。

#### 注意

<sup>†</sup> 使用 [`createStore`](createStore.md) 创建的 “纯正” store 只支持普通对象类型的 action，而且会立即传到 reducer 来执行。

但是，如果你用 [`applyMiddleware`](applyMiddleware.md) 来套住 [`createStore`](createStore.md) 时，middleware 可以修改 action 的执行，并支持执行 dispatch [intent（意图）](../Glossary.md#intent)。Intent 一般是异步操作如 Promise、Observable 或者 Thunk。

Middleware 是由社区创建，并不会同 Redux 一起发行。你需要手动安装 [redux-thunk](https://github.com/gaearon/redux-thunk) 或者 [redux-promise](https://github.com/acdlite/redux-promise) 库。你也可以创建自己的 middleware。

想学习如何描述异步 API 调用？看一下 action 创建函数里当前的 state，执行一个有副作用的操作，或者以链式操作执行它们，参照 [`applyMiddleware`](applyMiddleware.md) 中的示例。

#### 示例

```js
import { createStore } from 'redux'
let store = createStore(todos, [ 'Use Redux' ])

function addTodo(text) {
  return {
    type: 'ADD_TODO',
    text
  }
}

store.dispatch(addTodo('Read the docs'))
store.dispatch(addTodo('Read about the middleware'))
```

<hr>

### <a id='subscribe'></a>[`subscribe(listener)`](#subscribe)

添加一个变化监听器。每当 dispatch action 的时候就会执行，state 树中的一部分可能已经变化。你可以在回调函数里调用 [`getState()`](#getState) 来拿到当前 state。

你可以在变化监听器里面进行 [`dispatch()`](#dispatch)，但你需要注意下面的事项：

1. 监听器调用 [`dispatch()`](#dispatch) 仅仅应当发生在响应用户的 actions 或者特殊的条件限制下（比如： 在 store 有一个特殊的字段时 dispatch action）。虽然没有任何条件去调用 [`dispatch()`](#dispatch) 在技术上是可行的，但是随着每次 [`dispatch()`](#dispatch) 改变 store 可能会导致陷入无穷的循环。
2. 订阅器（subscriptions） 在每次 [`dispatch()`](#dispatch) 调用之前都会保存一份快照。当你在正在调用监听器（listener）的时候订阅(subscribe)或者去掉订阅（unsubscribe），对当前的 [`dispatch()`](#dispatch) 不会有任何影响。但是对于下一次的 [`dispatch()`](#dispatch)，无论嵌套与否，都会使用订阅列表里最近的一次快照。
3. 订阅器不应该注意到所有 state 的变化，在订阅器被调用之前，往往由于嵌套的 [`dispatch()`](#dispatch) 导致 state 发生多次的改变。保证所有的监听器都注册在 [`dispatch()`](#dispatch) 启动之前，这样，在调用监听器的时候就会传入监听器所存在时间里最新的一次 state。

这是一个底层 API。多数情况下，你不会直接使用它，会使用一些 React（或其它库）的绑定。如果你想让回调函数执行的时候使用当前的 state，你可以 [把 store 转换成一个 Observable 或者写一个定制的 `observeStore` 工具](https://github.com/rackt/redux/issues/303#issuecomment-125184409)。

如果需要解绑这个变化监听器，执行 `subscribe` 返回的函数即可。

#### 参数

1. `listener` (*Function*): 每当 dispatch action 的时候都会执行的回调。state 树中的一部分可能已经变化。你可以在回调函数里调用 [`getState()`](#getState) 来拿到当前 state。store 的 reducer 应该是纯函数，因此你可能需要对 state 树中的引用做深度比较来确定它的值是否有变化。

##### 返回值

(*Function*): 一个可以解绑变化监听器的函数。

##### 示例

```js
function select(state) {
  return state.some.deep.property
}

let currentValue
function handleChange() {
  let previousValue = currentValue
  currentValue = select(store.getState())

  if (previousValue !== currentValue) {
    console.log('Some deep nested property changed from', previousValue, 'to', currentValue)
  }
}

let unsubscribe = store.subscribe(handleChange)
unsubscribe()
```

<hr>

### <a id='replaceReducer'></a>[`replaceReducer(nextReducer)`](#replaceReducer)

替换 store 当前用来计算 state 的 reducer。

这是一个高级 API。只有在你需要实现代码分隔，而且需要立即加载一些 reducer 的时候才可能会用到它。在实现 Redux 热加载机制的时候也可能会用到。

#### 参数

1. `reducer` (*Function*) store 会使用的下一个 reducer。
