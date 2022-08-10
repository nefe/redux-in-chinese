---
id: createstore
title: createStore
hide_title: true
description: 'API > createStore: creating a core Redux store'
---

&nbsp;

# `createStore(reducer, [preloadedState], [enhancer])`

创建一个包含程序完整 state 树的 Redux [store](Store.md) 。
应用中应有且仅有一个 store。

#### 参数

1. `reducer` _(Function)_: 一个返回下一个 [state 树](../understanding/thinking-in-redux/Glossary.md#state) 的 [reducing 函数](../understanding/thinking-in-redux/Glossary.md#reducer) ,给定当前 state 树和要处理的 [action](../understanding/thinking-in-redux/Glossary.md#action).

2. [`preloadedState`] _(any)_: 初始时的 state。你可以决定是否把服务端传来的 state 水合（hydrate）后传给它，或者从之前保存的用户会话中恢复一个传给它。如果你使用 [`combineReducers`](combineReducers.md) 创建 `reducer`，它必须是一个普通对象，与传入的 keys 保持同样的结构。否则，你可以自由传入任何 `reducer` 可理解的内容。

3. `enhancer` _(Function)_: Store enhancer。你可以选择指定它以使用第三方功能，如middleware、时间旅行、持久化来增强 store。Redux 中唯一内置的 store enhander 是 [`applyMiddleware()`](./applyMiddleware.md)。

#### 返回值

([_`Store`_](Store.md)): 保存了应用程序所有 state 的对象。改变 state 的惟一方法是 [dispatch action](Store.md#dispatchaction)。你也可以 [subscribe](Store.md#subscribelistener) state 的变化，然后更新 UI。

#### 示例

```js
import { createStore } from 'redux'

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([action.text])
    default:
      return state
  }
}

const store = createStore(todos, ['Use Redux'])

store.dispatch({
  type: 'ADD_TODO',
  text: 'Read the docs'
})

console.log(store.getState())
// [ 'Use Redux', 'Read the docs' ]
```

#### 小贴士

- 应用中不要创建多个 store！相反，使用 [`combineReducers`](combineReducers.md) 来把多个 reducer 创建成一个根 reducer。

- Redux state 通常是普通 JS 对象或者数组。

- 如果 state 是普通对象，永远不要修改它！不可变更新需要复制每个级别的数据，通常使用对象扩展运算符（`return { ...state, ...newData }`）。

- 对于服务端运行的同构应用，为每一个请求创建一个 store 实例，以此让 store 相隔离。dispatch 一系列请求数据的 action 到 store 实例上，等待请求完成后再在服务端渲染应用。

- 当 store 创建后，Redux 会 dispatch 一个 action 到 reducer 上，来用初始的 state 来填充 store。你不需要处理这个 action。但要记住，如果第一个参数也就是传入的 state 是 `undefined` 的话，reducer 应该返回初始的 state 值。

- 要使用多个 store enhancer 的时候，你可能需要使用 [compose](./compose.md)
