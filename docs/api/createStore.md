# `createStore(reducer, [preloadedState], enhancer)`

创建一个 Redux [store](Store.md) 来以存放应用中所有的 state。  
应用中应有且仅有一个 store。

#### 参数

1. `reducer` *(Function)*: 接收两个参数，分别是当前的 state 树和要处理的 [action](../Glossary.md#action)，返回新的 [state 树](../Glossary.md#state)。

2. [`preloadedState`] *(any)*: 初始时的 state。
在同构应用中，你可以决定是否把服务端传来的 state 水合（hydrate）后传给它，或者从之前保存的用户会话中恢复一个传给它。如果你使用 [`combineReducers`](combineReducers.md) 创建 `reducer`，它必须是一个普通对象，与传入的 keys 保持同样的结构。否则，你可以自由传入任何 `reducer` 可理解的内容。

3. `enhancer` *(Function)*: Store enhancer 是一个组合 store creator 的高阶函数，返回一个新的强化过的 store creator。这与 middleware 相似，它也允许你通过复合函数改变 store 接口。

#### 返回值

([*`Store`*](Store.md)): 保存了应用所有 state 的对象。改变 state 的惟一方法是 [dispatch](Store.md#dispatch) action。你也可以 [subscribe 监听](Store.md#subscribe) state 的变化，然后更新 UI。

#### 示例

```js
import { createStore } from 'redux'

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([ action.text ])
    default:
      return state
  }
}

let store = createStore(todos, [ 'Use Redux' ])

store.dispatch({
  type: 'ADD_TODO',
  text: 'Read the docs'
})

console.log(store.getState())
// [ 'Use Redux', 'Read the docs' ]
```

#### 小贴士

* 应用中不要创建多个 store！相反，使用 [`combineReducers`](combineReducers.md) 来把多个 reducer 创建成一个根 reducer。

* 你可以决定 state 的格式。你可以使用普通对象或者 [Immutable](http://facebook.github.io/immutable-js/) 这类的实现。如果你不知道如何做，刚开始可以使用普通对象。

* 如果 state 是普通对象，永远不要修改它！比如，reducer 里不要使用 `Object.assign(state, newData)`，应该使用 `Object.assign({}, state, newData)`。这样才不会覆盖旧的 `state`。如果可以的话，也可以使用 [对象拓展操作符（object spread spread operator](https://github.com/sebmarkbage/ecmascript-rest-spread) 特性中的 `return { ...state, ...newData }`。

* 对于服务端运行的同构应用，为每一个请求创建一个 store 实例，以此让 store 相隔离。dispatch 一系列请求数据的 action 到 store 实例上，等待请求完成后再在服务端渲染应用。

* 当 store 创建后，Redux 会 dispatch 一个 action 到 reducer 上，来用初始的 state 来填充 store。你不需要处理这个 action。但要记住，如果第一个参数也就是传入的 state 如果是 `undefined` 的话，reducer 应该返回初始的 state 值。

* 要使用多个 store 增强器的时候，你可能需要使用 [compose](./compose.md)
