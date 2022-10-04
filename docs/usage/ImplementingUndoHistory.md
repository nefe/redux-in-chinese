---
id: implementing-undo-history
title: Implementing Undo History
sidebar_label: 实现历史撤销重做
---

# 实现历史撤销重做

:::important 预置知识

- 完成了 [“Redux 基础” 教程](../tutorials/fundamentals/part-1-overview.md)
- 理解了 [“reducer 组合”](../tutorials/fundamentals/part-3-state-actions-reducers.md#splitting-reducers)

:::

传统上，在应用程序中构建撤销和重做功能需要开发人员故意设计。对于经典的 MVC 框架来说，这不是一个容易的问题，因为你需要通过克隆所有相关的模型来跟踪每个过去的状态。此外，你需要注意撤消堆栈，因为用户发起的更改应该是可撤消的。

这意味着在 MVC 应用程序中实现 Undo 和 Redo 通常会迫使你重写应用程序的某些部分，以使用特定的数据变化的模式 ，如 [Command](https://en.wikipedia.org/wiki/Command_pattern).

然而，对于 Redux，实现撤销历史记录是一件轻而易举的事。这有三个原因：

- 没有多个数据模型，只有一个状态子树需要跟踪。
- 状态已经是 immutable 的，mutation 已经被描述为离散的动作，这接近于撤销堆栈的真实模型。
- Reducer `(state, action) => state` 签名使得实现通用的“reducer 增强器”或“高阶 reducer”变得很自然。它们是在保留其签名的同时，使用一些附加功能来增强 reducer 的函数。撤销历史就是这样一种情况。

在本秘诀的第一部分，我们将解释使撤销和重做能够以通用方式实现的基本概念。

在第二部分中，我们会展示怎么使用 [Redux Undo](https://github.com/omnidan/redux-undo) 这个提供了此功能现成的包。

[![todos-with-undo 的 demo](https://i.imgur.com/lvDFHkH.gif)](https://twitter.com/dan_abramov/status/647038407286390784)

## 理解历史撤销重做

### State 形状设计

撤销历史记录也是应用程序 state 的一部分，我们不能以不同的方式来处理它。无论 state 的类型随时间而变化，当实现 Undo 和 Redo 时，都希望在不同的时间点跟踪此状态的*历史*。

例如，计数器应用程序的 state 形状可能如下所示：

```js
{
  counter: 10
}
```

如果想在这样的应用程序中实现撤销和重做，我们需要存储更多的状态，回答以下问题：

- 还有什么要撤消或重做的吗？
- 当前 state 是怎样的？
- 撤销重做堆栈中的过去（和未来）状态是什么？

我们可以改变 state 来回答这些问题：

```js
{
  counter: {
    past: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    present: 10,
    future: []
  }
}
```

现在，如果用户按“撤消”，我们希望回到过去：

```js
{
  counter: {
    past: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    present: 9,
    future: [10]
  }
}
```

未来一步：

```js
{
  counter: {
    past: [0, 1, 2, 3, 4, 5, 6, 7],
    present: 8,
    future: [9, 10]
  }
}
```

当用户按下“重做”时，我们希望回到未来一步：

```js
{
  counter: {
    past: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    present: 9,
    future: [10]
  }
}
```

最后，如果用户在我们处于撤消堆栈的中间状态时执行操作（例如减少 reducer），我们将放弃现有的未来：

```js
{
  counter: {
    past: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    present: 8,
    future: []
  }
}
```

有趣的是，我们是否要保留数字、字符串、数组或对象的撤消堆栈并不重要。结构将始终相同：

```js
{
  counter: {
    past: [0, 1, 2],
    present: 3,
    future: [4]
  }
}
```

```js
{
  todos: {
    past: [
      [],
      [{ text: 'Use Redux' }],
      [{ text: 'Use Redux', complete: true }]
    ],
    present: [
      { text: 'Use Redux', complete: true },
      { text: 'Implement Undo' }
    ],
    future: [
      [
        { text: 'Use Redux', complete: true },
        { text: 'Implement Undo', complete: true }
      ]
    ]
  }
}
```

总之，长这样：

```js
{
  past: Array<T>,
  present: T,
  future: Array<T>
}
```

是否保留一段顶级最顶层的历史也取决于我们自己：

```js
{
  past: [
    { counterA: 1, counterB: 1 },
    { counterA: 1, counterB: 0 },
    { counterA: 0, counterB: 0 }
  ],
  present: { counterA: 2, counterB: 1 },
  future: []
}
```

或许多细粒度历史记录，以便用户可以独立撤消和重做其中的操作：

```js
{
  counterA: {
    past: [1, 0],
    present: 2,
    future: []
  },
  counterB: {
    past: [0],
    present: 1,
    future: []
  }
}
```

接下来看我们的方法怎么让我们选择撤销重做的粒度

### 算法设计

无论特定的数据类型如何，撤消历史状态的形状都是相同的：

```js
{
  past: Array<T>,
  present: T,
  future: Array<T>
}
```

让我们讨论一下操作上述状态形状的算法。我们可以定义两个操作来操作此状态：`UNDO` 和 `REDO`。在我们的 reducer 中，我们将执行以下步骤来处理这些操作：

#### 处理撤销

- 从 `past` 移除*最后一个*元素。
- 把`present` 设为上一步一处的元素。
- 把老的 `present` 状态插入到 `future` _开头_。

#### 处理重做

- 从 `future` 中移除*第一个*元素。
- 把 e `present` 设为前一步移出的那个元素。
- Insert the old 把老的 `present` 状态插入到 `past` 的*末尾*。

#### 处理其他 action

- 把 `present` 插入到 `past` 的末尾。
- 把 `present` 设为执行 action 后的新 state。
- 清空 `future`。

### 第一次尝试：编写 Reducer

```js
const initialState = {
  past: [],
  present: null, // (?) 怎么初始化当前的状态？
  future: []
}

function undoable(state = initialState, action) {
  const { past, present, future } = state

  switch (action.type) {
    case 'UNDO':
      const previous = past[past.length - 1]
      const newPast = past.slice(0, past.length - 1)
      return {
        past: newPast,
        present: previous,
        future: [present, ...future]
      }
    case 'REDO':
      const next = future[0]
      const newFuture = future.slice(1)
      return {
        past: [...past, present],
        present: next,
        future: newFuture
      }
    default:
      // (?)怎么处理其他 action？
      return state
  }
}
```

此实现行不通，因为它忽略了三个重要问题：

- 我们从哪里得到初始的 `present` state？我们似乎事先不知道。
- 对于将 `present` 保存为 `past` 的外部 action，我们在哪里做出响应？
- 我们如何实际将对 `present` state 的控制委托给定制的 reducer？

看起来 reducer 不是正确的抽象，但非常接近。

### 了解 Reducer 的增强功能

您可能熟悉[高阶函数](https://en.wikipedia.org/wiki/Higher-order_function)。如果使用 React，您可能熟悉[高阶组件](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750）。下面是应用于 reducer 的同一模式的变体。

_reducer 增强器_ （或者说*高阶 reducer*）是一个接受 reducer 的函数，并返回一个新的能够处理新 action 的 reducer，将其不能理解的 action 的控制权委托给内部 reducer。从技术上讲，这不是一个新模式，[`combineReducers（）`]（../api/combineReducters.md）也是一个 reducer 增强器，因为它接受 reducer 并返回一个新的 reducer。

一个不做任何事情的 reducer 增强器长这样：

```js
function doNothingWith(reducer) {
  return function (state, action) {
    // 仅仅调用传入的 reducer
    return reducer(state, action)
  }
}
```

结合其他 reducer 的 reducer 增强器可能长这样：

```js
function combineReducers(reducers) {
  return function (state = {}, action) {
    return Object.keys(reducers).reduce((nextState, key) => {
      // 用它管理的状态部分调用每个 reducer
      nextState[key] = reducers[key](state[key], action)
      return nextState
    }, {})
  }
}
```

### 第二次尝试： 写一个 Reducer 增强器

现在我们对 reducer 增强剂有了更深的了解，我们可以看到这正是 `undoable` 的原因：

```js
function undoable(reducer) {
  // 使用空操作调用 reducer 以填充初始状态
  const initialState = {
    past: [],
    present: reducer(undefined, {}),
    future: []
  }

  // 返回处理撤消和重做的还原程序
  return function (state = initialState, action) {
    const { past, present, future } = state

    switch (action.type) {
      case 'UNDO':
        const previous = past[past.length - 1]
        const newPast = past.slice(0, past.length - 1)
        return {
          past: newPast,
          present: previous,
          future: [present, ...future]
        }
      case 'REDO':
        const next = future[0]
        const newFuture = future.slice(1)
        return {
          past: [...past, present],
          present: next,
          future: newFuture
        }
      default:
        // 代理传给 reducer 的 action
        const newPresent = reducer(present, action)
        if (present === newPresent) {
          return state
        }
        return {
          past: [...past, present],
          present: newPresent,
          future: []
        }
    }
  }
}
```

现在，我们可以将任何 reducer 包装到 `undoable` reducer 增强器中，教它对 `UNDO` 和 `REDO` action 做出响应。

```js
// 这是个 reducer
function todos(state = [], action) {
  /* ... */
}

// 这也是个 reducer！
const undoableTodos = undoable(todos)

import { createStore } from 'redux'
const store = createStore(undoableTodos)

store.dispatch({
  type: 'ADD_TODO',
  text: 'Use Redux'
})

store.dispatch({
  type: 'ADD_TODO',
  text: 'Implement Undo'
})

store.dispatch({
  type: 'UNDO'
})
```

有一个重要的问题：记得在检索当前 state 的时候附加上 `.present`。你也可能分别检查 `.past.length` 和 `.future.length` 来决定启用或禁用撤销重做的按钮。

你可能听说过 Redux 受到 [Elm Architecture](https://github.com/evancz/elm-architecture-tutorial/) 的影响。这个例子与 [elm-undo-redo 包](https://package.elm-lang.org/packages/TheSeamau5/elm-undo-redo/2.0.0)非常相似，这并不奇怪。

## 使用 Redux Undo

这都是非常有用的信息，但我们不能直接删除一个库并使用它，而不是自己实现 `undoable` 吗？当然，我们可以！去看 [Redux Undo](https://github.com/omnidan/redux-undo)，这是一个给你的 Redux 树中任意部分提供撤销重做功能的库。

在这个部分，你将学习如何使一个小的 “todo list” 应用逻辑支持撤销重做。你可以在 Redux 附带的 [`todos with undo`示例中找到完整源代码](https://github.com/reduxjs/redux/tree/master/examples/todos-with-undo).

### 安装

首先，你要执行：

```sh
npm install redux-undo
```

This installs the package that provides the `undoable` reducer enhancer.

### Wrapping the Reducer

You will need to wrap the reducer you wish to enhance with `undoable` function. For example, if you exported a `todos` reducer from a dedicated file, you will want to change it to export the result of calling `undoable()` with the reducer you wrote:

#### `reducers/todos.js`

```js
import undoable from 'redux-undo'

/* ... */

const todos = (state = [], action) => {
  /* ... */
}

const undoableTodos = undoable(todos)

export default undoableTodos
```

There are [many other options](https://github.com/omnidan/redux-undo#configuration) to configure your undoable reducer, like setting the action type for Undo and Redo actions.

Note that your `combineReducers()` call will stay exactly as it was, but the `todos` reducer will now refer to the reducer enhanced with Redux Undo:

#### `reducers/index.js`

```js
import { combineReducers } from 'redux'
import todos from './todos'
import visibilityFilter from './visibilityFilter'

const todoApp = combineReducers({
  todos,
  visibilityFilter
})

export default todoApp
```

You may wrap one or more reducers in `undoable` at any level of the reducer composition hierarchy. We choose to wrap `todos` instead of the top-level combined reducer so that changes to `visibilityFilter` are not reflected in the undo history.

### Updating the Selectors

Now the `todos` part of the state looks like this:

```js
{
  visibilityFilter: 'SHOW_ALL',
  todos: {
    past: [
      [],
      [{ text: 'Use Redux' }],
      [{ text: 'Use Redux', complete: true }]
    ],
    present: [
      { text: 'Use Redux', complete: true },
      { text: 'Implement Undo' }
    ],
    future: [
      [
        { text: 'Use Redux', complete: true },
        { text: 'Implement Undo', complete: true }
      ]
    ]
  }
}
```

This means you need to access your state with `state.todos.present` instead of
just `state.todos`:

#### `containers/VisibleTodoList.js`

```js
const mapStateToProps = state => {
  return {
    todos: getVisibleTodos(state.todos.present, state.visibilityFilter)
  }
}
```

### Adding the Buttons

Now all you need to do is add the buttons for the Undo and Redo actions.

First, create a new container component called `UndoRedo` for these buttons. We won't bother to split the presentational part into a separate file because it is very small:

#### `containers/UndoRedo.js`

```js
import React from 'react'

/* ... */

let UndoRedo = ({ canUndo, canRedo, onUndo, onRedo }) => (
  <p>
    <button onClick={onUndo} disabled={!canUndo}>
      Undo
    </button>
    <button onClick={onRedo} disabled={!canRedo}>
      Redo
    </button>
  </p>
)
```

You will use `connect()` from [React Redux](https://github.com/reduxjs/react-redux) to generate a container component. To determine whether to enable Undo and Redo buttons, you can check `state.todos.past.length` and `state.todos.future.length`. You won't need to write action creators for performing undo and redo because Redux Undo already provides them:

#### `containers/UndoRedo.js`

```js
/* ... */

import { ActionCreators as UndoActionCreators } from 'redux-undo'
import { connect } from 'react-redux'

/* ... */

const mapStateToProps = state => {
  return {
    canUndo: state.todos.past.length > 0,
    canRedo: state.todos.future.length > 0
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onUndo: () => dispatch(UndoActionCreators.undo()),
    onRedo: () => dispatch(UndoActionCreators.redo())
  }
}

UndoRedo = connect(mapStateToProps, mapDispatchToProps)(UndoRedo)

export default UndoRedo
```

Now you can add `UndoRedo` component to the `App` component:

#### `components/App.js`

```js
import React from 'react'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'
import UndoRedo from '../containers/UndoRedo'

const App = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
    <UndoRedo />
  </div>
)

export default App
```

This is it! Run `npm install` and `npm start` in the [example folder](https://github.com/reduxjs/redux/tree/master/examples/todos-with-undo) and try it out!
