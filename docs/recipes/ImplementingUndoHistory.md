# 实现撤销历史

在应用中构建撤销和重做功能往往需要开发者刻意地付出一些精力。对于经典的 MVC 框架来说，这不是一个简单的问题，因为你需要克隆所有相关的 model 来追踪每一个历史状态。此外，你需要考虑整个撤销堆栈，因为用户的初始更改也是可撤销的。

这意味着在 MVC 应用中实现撤销和重做功能时，你不得不使用一些类似于 [Command](https://en.wikipedia.org/wiki/Command_pattern) 的特殊的数据修改模式来重写你的应用代码。

然而你可以用 Redux 轻而易举地实现撤销历史，因为以下三个原因：

* 不存在多个模型的问题，你需要关心的只是 state 的子树。
* state 是不可变数据，所有修改被描述成独立的 action，而这些 action 与预期的撤销堆栈模型很接近了。
* reducer 的签名 `(state, action) => state` 可以自然地实现 “reducer enhancers” 或者 “higher order reducers”。它们在你为 reducer 添加额外的功能时保持着这个签名。撤销历史就是一个典型的应用场景。

在动手之前，确认你已经阅读过[基础教程](../basics/README.md)并且良好掌握了 [reducer 合成](../basics/Reducers.md)。本文中的代码会构建于[基础教程](../basics/README.md)的示例之上。

文章的第一部分，我们将会解释实现撤销和重做功能所用到的基础概念。

在第二部分中，我们会展示如何使用 [Redux Undo](https://github.com/omnidan/redux-undo) 库来无缝地实现撤销和重做。

[![demo of todos-with-undo](http://i.imgur.com/lvDFHkH.gif)](https://twitter.com/dan_abramov/status/647038407286390784)


## 理解撤销历史

### 设计状态结构

撤销历史也是应用 state 的一部分，我们没有必要以不同的方式实现它。当你实现撤销和重做这个功能时，无论 state 如何随着时间不断变化，你都需要追踪 state 在不同时刻的**历史记录**。

例如，一个计数器应用的 state 结构看起来可能是这样：

```js
{
  counter: 10
}
```

如果我们希望在这样一个应用中实现撤销和重做的话，我们必须保存更多的 state 以解决下面几个问题：

* 撤销或重做留下了哪些信息？
* 当前的状态是什么？
* 撤销堆栈中过去（和未来）的状态是什么？

为此我们对 state 结构做了以下修改以便解决上述问题：

```js
{
  counter: {
    past: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
    present: 10,
    future: []
  }
}
```

现在，如果按下“撤销”，我们希望恢复到过去的状态：

```js
{
  counter: {
    past: [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ],
    present: 9,
    future: [ 10 ]
  }
}
```

再按一次：

```js
{
  counter: {
    past: [ 0, 1, 2, 3, 4, 5, 6, 7 ],
    present: 8,
    future: [ 9, 10 ]
  }
}
```

当我们按下“重做”，我们希望往未来的状态移动一步：

```js
{
  counter: {
    past: [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ],
    present: 9,
    future: [ 10 ]
  }
}
```

最终，当处于撤销堆栈中时，用户发起了一个操作（例如，减少计数），那么我们将会丢弃所有未来的信息：

```js
{
  counter: {
    past: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
    present: 8,
    future: []
  }
}
```

有趣的一点是，我们在撤销堆栈中保存的是数字、字符串、数组或是对象都不重要，因为整个结构始终保持一致：

```js
{
  counter: {
    past: [ 0, 1, 2 ],
    present: 3,
    future: [ 4 ]
  }
}
```

```js
{
  todos: {
    past: [
      [],
      [ { text: 'Use Redux' } ],
      [ { text: 'Use Redux', complete: true } ]
    ],
    present: [ { text: 'Use Redux', complete: true }, { text: 'Implement Undo' } ],
    future: [
      [ { text: 'Use Redux', complete: true }, { text: 'Implement Undo', complete: true } ]
    ]
  }
}
```

它看起来通常都是这样：

```js
{
  past: Array<T>,
  present: T,
  future: Array<T>
}
```

我们可以在顶层保存单一的历史记录：

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

也可以分离历史记录，这样我们可以独立地执行撤销和重做操作：

```js
{
  counterA: {
    past: [ 1, 0 ],
    present: 2,
    future: []
  },
  counterB: {
    past: [ 0 ],
    present: 1,
    future: []
  }
}
```

接下来我们将会看到如何合适地分离撤销和重做。

### 设计算法

无论何种特定的数据类型，重做历史记录的 state 结构始终一致：

```js
{
  past: Array<T>,
  present: T,
  future: Array<T>
}
```

让我们讨论一下如何通过算法来操作上文所述的 state 结构。我们可以定义两个 action 来操作该 state：`UNDO` 和 `REDO`。在 reducer 中，我们希望以如下步骤处理这两个 action：

#### 处理 Undo

* 移除 `past` 中的**最后一个**元素。
* 将上一步移除的元素赋予 `present`。
* 将原来的 `present` 插入到 `future` 的**最前面**。

#### 处理 Redo

* 移除 `future` 中的**第一个**元素。
* 将上一步移除的元素赋予 `present`。
* 将原来的 `present` 追加到 `past` 的**最后面**。

#### 处理其他 Action

* 将当前的 `present` 追加到 `past` 的**最后面**。
* 将处理完 action 所产生的新的 state 赋予 `present`。
* 清空 `future`。

### 第一次尝试: 编写 Reducer

```js
const initialState = {
  past: [],
  present: null, // (?) 我们如何初始化当前状态?
  future: []
}

function undoable(state = initialState, action) {
  const { past, present, future } = state;

  switch (action.type) {
    case 'UNDO':
      const previous = past[past.length - 1]
      const newPast = past.slice(0, past.length - 1)
      return {
        past: newPast,
        present: previous,
        future: [ present, ...future ]
      }
    case 'REDO':
      const next = future[0]
      const newFuture = future.slice(1)
      return {
        past: [ ...past, present ],
        present: next,
        future: newFuture
      }
    default:
      // (?) 我们如何处理其他 action？
      return state
  }
}
```

这个实现是无法使用的，因为它忽略了下面三个重要的问题：

* 我们从何处获取初始的 `present` 状态？我们无法预先知道它。
* 当处理完外部的 action 后，我们在哪里完成将 `present` 保存到 `past` 的工作？
* 我们如何将 `present` 状态的控制委托给一个自定义的 reducer？

看起来 reducer 并不是正确的抽象方式，但是我们已经非常接近了。

### 初识 Reducer Enhancers

你可能已经熟悉 [higher order function](https://en.wikipedia.org/wiki/Higher-order_function) 了。如果你使用过 React，也应该熟悉 [higher order component](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750)。我们把这种模式加工一下，将其运用到 reducers。

**reducer enhancer**（或者 **higher order reducer**）作为一个函数，接收 reducer 作为参数并返回一个新的 reducer，这个新的 reducer 可以处理新的 action，或者维护更多的 state，亦或者将它无法处理的 action 委托给原始的 reducer 处理。这不是什么新模式，[`combineReducers()`](../api/combineReducers.md)也是 reducer enhancer，因为它同样接收多个 reducer 并返回一个新的 reducer。

这是一个没有任何功能的 reducer enhancer 示例：

```js
function doNothingWith(reducer) {
  return function (state, action) {
    // 仅仅调用传入的 reducer
    return reducer(state, action)
  };
}
```

一个组合其他 reducer 的 reducer enhancer 看起来类似于这样：

```js
function combineReducers(reducers) {
  return function (state = {}, action) {
    return Object.keys(reducers).reduce((nextState, key) => {
      // 调用每一个 reducer 并将其管理的部分 state 传给它
      nextState[key] = reducers[key](state[key], action)
      return nextState
    }, {})
  }
}
```

### 第二次尝试: 编写 Reducer Enhancer

现在我们对 reducer enhancer 有了更深的了解，我们可以明确所谓的`可撤销`到底是什么：

```js
function undoable(reducer) {
  // 以一个空的 action 调用 reducer 来产生初始的 state
  const initialState = {
    past: [],
    present: reducer(undefined, {}),
    future: []
  }

  // 返回一个可以执行撤销和重做的新的reducer
  return function (state = initialState, action) {
    const { past, present, future } = state;

    switch (action.type) {
      case 'UNDO':
        const previous = past[past.length - 1]
        const newPast = past.slice(0, past.length - 1)
        return {
          past: newPast,
          present: previous,
          future: [ present, ...future ]
        }
      case 'REDO':
        const next = future[0]
        const newFuture = future.slice(1)
        return {
          past: [ ...past, present ],
          present: next,
          future: newFuture
        }
      default:
        // 将其他 action 委托给原始的 reducer 处理
        const newPresent = reducer(present, action);
        if (present === newPresent) {
          return state
        }
        return {
          past: [ ...past, present ],
          present: newPresent,
          future: []
        }
    }
  }
}
```

我们现在可以将任意的 reducer 封装到`可撤销`的 reducer enhancer，从而处理 `UNDO` 和 `REDO` 这两个 action。

```js
// 这是一个 reducer。
function todos(state = [], action) {
  /* ... */
}

// 处理完成之后仍然是一个 reducer！
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

还有一个重要注意点：你需要记住当你恢复一个 state 时，必须把 `.present` 追加到当前的 state 上。你也不能忘了通过检查 `.past.length` 和 `.future.length` 确定撤销和重做按钮是否可用。

你可能听说过 Redux 受 [Elm 架构](https://github.com/evancz/elm-architecture-tutorial/) 影响颇深，所以不必惊讶于这个示例与 [elm-undo-redo package](http://package.elm-lang.org/packages/TheSeamau5/elm-undo-redo/2.0.0) 如此相似。

## 使用 Redux Undo

以上这些信息都非常有用，但是有没有一个库能帮助我们实现`可撤销`功能，而不是由我们自己编写呢？当然有！来看看 [Redux Undo](https://github.com/omnidan/redux-undo)，它可以为你的 Redux 状态树中的任何部分提供撤销和重做功能。

在这个部分中，你会学到如何让 [示例：Todo List](../basics/ExampleTodoList.md) 拥有可撤销的功能。你可以在 [`todos-with-undo`](https://github.com/reactjs/redux/tree/master/examples/todos-with-undo)找到完整的源码。

### 安装

首先，你必须先执行

```
npm install --save redux-undo
```

这一步会安装一个提供`可撤销`功能的 reducer enhancer 的库。

### 封装 Reducer

你需要通过 `undoable` 函数强化你的 reducer。例如，如果之前导出的是 todos reducer，那么现在你需要把这个 reducer 传给 `undoable()` 然后把计算结果导出：

#### `reducers/todos.js`

```js
import undoable, { distinctState } from 'redux-undo'

/* ... */

const todos = (state = [], action) => {
  /* ... */
}

const undoableTodos = undoable(todos, {
  filter: distinctState()
})

export default undoableTodos
```

这里的 `distinctState()` 过滤器会忽略那些没有引起 state 变化的 actions，可撤销的 reducer 还可以通过[其他选择](https://github.com/omnidan/redux-undo#configuration)进行配置，例如为撤销和重做的 action 设置 action type。

值得注意的是虽然这与调用 `combineReducers()` 的结果别无二致，但是现在的 `todos` reducer 可以传递给 Redux Undo 增强的 reducer。

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

你可以在 reducer 合并层次中的任何层级对一个或多个 reducer 执行 `undoable`。我们只对 `todos` reducer 进行封装而不是整个顶层的 reducer，这样 `visibilityFilter` 引起的变化才不会影响撤销历史。

### 更新 Selectors

现在 `todos` 相关的 state 看起来应该像这样：

```js
{
  visibilityFilter: 'SHOW_ALL',
  todos: {
    past: [
      [],
      [ { text: 'Use Redux' } ],
      [ { text: 'Use Redux', complete: true } ]
    ],
    present: [ { text: 'Use Redux', complete: true }, { text: 'Implement Undo' } ],
    future: [
      [ { text: 'Use Redux', complete: true }, { text: 'Implement Undo', complete: true } ]
    ]
  }
}
```

这意味着你必须通过 `state.todos.present` 访问 state 而不是原来的 `state.todos`：

#### `containers/VisibleTodoList.js`

```js
const mapStateToProps = (state) => {
  return {
    todos: getVisibleTodos(state.todos.present, state.visibilityFilter)
  }
}
```

### 添加按钮

现在只剩下给撤销和重做的 action 添加按钮。

首先，为这些按钮创建一个名为 `UndoRedo` 的容器组件。由于展示部分非常简单，我们不再需要把它们分离到单独的文件去：

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

你需要使用 [React Redux](https://github.com/reactjs/react-redux) 的 connect 函数生成容器组件，然后检查 `state.todos.past.length` 和 `state.todos.future.length` 来判断是否启用撤销和重做按钮。你不再需要给撤销和重做编写 action creators 了，因为 Redux Undo 已经提供了这些 action creators：

#### `containers/UndoRedo.js`

```js
/* ... */

import { ActionCreators as UndoActionCreators } from 'redux-undo'
import { connect } from 'react-redux'

/* ... */

const mapStateToProps = (state) => {
  return {
    canUndo: state.todos.past.length > 0,
    canRedo: state.todos.future.length > 0
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onUndo: () => dispatch(UndoActionCreators.undo()),
    onRedo: () => dispatch(UndoActionCreators.redo())
  }
}

UndoRedo = connect(
  mapStateToProps,
  mapDispatchToProps
)(UndoRedo)

export default UndoRedo
```

现在把这个 `UndoRedo` 组件添加到 `App` 组件：

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

就是这样！在[示例文件夹](https://github.com/reactjs/redux/tree/master/examples/todos-with-undo)下执行 `npm install` 和 `npm start` 试试看吧！
