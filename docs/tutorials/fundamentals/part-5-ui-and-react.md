---
id: part-5-ui-react
title: 'Redux 深入浅出，第 5 节：UI 和 React'
sidebar_label: 'UI 和 React'
description: '官方 Redux 基础教程：学习如何将 Redux 与 React 一起使用'
---

import { DetailedExplanation } from '../../components/DetailedExplanation'

# Redux 深入浅出，第 5 节：UI 和 React

:::tip 你将学到

- Redux store 如何与 UI 一起工作
- 如何在 React 中使用 Redux

:::

## 简介

[第 4 节：Store](./part-4-store.md) 介绍了如何创建 Redux store、dispatch action 以及读取当前 state。还研究了 store 内部工作机制，enhancers 和 middleware 是如何使我们能够自定义 store，以及如何添加 Redux DevTools 让我们在 dispatch action 时可以查看应用程序内部的变化。

在本节中，我们将为 todo 应用程序添加用户界面。除了介绍 Redux 如何与 UI 层一起工作外，还会专门介绍 Redux 如何与 React 一起工作。

## 集成 Redux 和 UI

Redux 是一个独立的 JS 库。正如前文所述，即使没有设置用户界面，也可以创建和使用 Redux store。这也意味着 **Redux 可以和任何 UI 框架一起使用**（甚至不使用 _任何_ UI 框架），并且同时支持在客户端和服务器上使用。你可以使用 React、Vue、Angular、Ember、jQuery 或 vanilla JavaScript 编写 Redux 应用程序。

**Redux 是专门为 [React](https://reactjs.org)** 设计的。React 允许你将 UI 描述为 state 函数，然后 Redux 控制并更新 state 以响应 action。

我们将在本教程中使用 React 来构建 todo 应用程序，并介绍如何将 React 与 Redux 一起使用的基础知识。

我们先来快速地看一下 Redux 是如何与 UI 层交互的。

### Redux 和 UI 的基本集成

将 Redux 与任何 UI 层一起使用都需要这几个步骤：

1. 创建 Redux store
2. 订阅（subscribe）更新
3. 在订阅回调内部：
   1. 获取当前 store 的 state
   2. 提取当前 UI 需要的数据
   3. 使用这些数据更新 UI
4. 如有必要，使用初始 state 渲染 UI
5. 通过 dispatch action 来响应 UI 的输入操作

先来回顾[在第 1 节中看到的计数器应用程序示例](./part-1-overview.md)，看看它是如何遵循这些步骤的：

```js
// 1) 使用 `createStore` 函数创建 Redux store
const store = Redux.createStore(counterReducer)

// 2) 订阅更新（以便将来数据更改时能够重绘）
store.subscribe(render)

// 我们的“用户界面”是单个 HTML 元素中的一些文本
const valueEl = document.getElementById('value')

// 3) 当订阅回调函数运行时：
function render() {
  // 3.1) 获取当前 store 的 state
  const state = store.getState()
  // 3.2) 提取你想要的数据
  const newValue = state.value.toString()

  // 3.3) 使用新值更新 UI
  valueEl.innerHTML = newValue
}

// 4) 使用初始 state 渲染 UI
render()

// 5) 基于 UI 输入 dispatch action
document.getElementById('increment').addEventListener('click', function () {
  store.dispatch({ type: 'counter/incremented' })
})
```

无论使用什么 UI 层，**Redux 都以相同的方式与每个 UI 一起工作**。出于性能的考虑，实际实现通常会更复杂，但都遵循相同的步骤。

由于 Redux 是一个单独的库，因此有不同的绑定库可以帮助你将 Redux 与给定的 UI 框架一起使用。这些 UI 绑定库会处理订阅 store 的详细信息，并在 state 更改时有效地更新 UI，因此你不必自己编写这部分代码。

## Redux 结合 React 使用

官方的 [**React-Redux UI 绑定库**](https://react-redux.js.org)是一个独立于 Redux 核心的包。你还需要安装：

```sh
npm install react-redux
```

（如果不使用 npm，可以从 unpkg 获取最新的 UMD 构建（无论是[开发](https://unpkg.com/react-redux@latest/dist/react-redux.js)还是[生产](https://unpkg.com/react-redux@latest/dist/react-redux.min.js)）。如果是通过 `<script>` 标签引入的，UMD 构建会导出一个名为 `window.ReactRedux` 的全局变量。）

本教程将会介绍 Redux 结合 React 使用所需的最重要的模式和示例，以及它们在 todo 应用程序中是如何工作的。

:::info 提示

关于 Redux 结合 React 使用的完整指南以及 React-Redux API 的参考文档，请参阅 **React-Redux 官方文档：https://react-redux.js.org**。

:::

### 设计组件树

类似根据需求[设计 state 结构](./part-3-state-actions-reducers.md#designing-the-state-structure)，我们可以设计整个 UI 组件集以及它们在应用程序中的相互关系。

根据[应用程序的业务需求列表](./part-3-state-actions-reducers.md#defining-requirements)，我们至少需要这些组件：

- **`<App>`**：渲染所有内容的根组件
  - **`<Header>`**：包含 new todo 的文本输入框和 complete all todos 的复选框
  - **`<TodoList>`**：基于过滤结果的所有当前可见 todo 列表
    - **`<TodoListItem>`**：单个 todo 列表项，包含可单击切换完成状态的复选框，以及颜色类别 selector
  - **`<Footer>`**：显示未完成状态的数量，以及可以根据已完成状态和颜色类别过滤列表的控件

 除了这个基本的组件结构之外，也可以通过多种不同方式来划分组件。例如，`<Footer>` 组件 _可以_ 是一个较大的组件，也可以内部包含多个小组件，比如 `<CompletedTodos>`、`<StatusFilter>` 和 `<ColorFilters>`。并没有唯一正确的方法来划分，你会发现根据实际情况来选择编写较大组件还是拆分成多个小组件可能会更好。

我们先从简单的小组件列表开始。我们假设[你已经熟悉 React](https://reactjs.org)，**所以会跳过编写布局代码的细节，并专注于如何在 React 组件中使用 React-Redux 库**。

在开始添加任何的 Redux 相关逻辑之前，这个应用程序的初始 UI 如下所示：

<iframe
  class="codesandbox"
  src="https://codesandbox.io/embed/github/reduxjs/redux-fundamentals-example-app/tree/checkpoint-3-initialUI/?fontsize=14&hidenavigation=1&theme=dark&view=preview&runonclick=1"
  title="redux-fundamentals-example-app"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

### 使用 `useSelector` 从 Store 中读取 State

为了显示 todo 列表，我们首先创建 `<TodoList>` 组件，该组件可以从 store 中读取 todo 列表，然后遍历它们，并为每个 todo 项对映一个 `<TodoListItem>` 组件。

你应该熟悉[类似 `useState` 的 React hook](https://reactjs.org/docs/hooks-state.html)，在 React 函数组件中可以通过调用它们来访问 React state 值。React 还支持编写[自定义 hook](https://reactjs.org/docs/hooks-custom.html)，这使我们可以提取可重用的 hook，以在 React 的内置 hook 之上添加自定义行为。

 和许多其他库一样，React-Redux 也有[它的自定义 hook](https://react-redux.js.org/api/hooks)，你可以直接在组件中使用它们。React-Redux hook 使 React 组件能够通过读取 state 以及 dispatch action 来和 Redux store 进行交互。

我们将看到的第一个 React-Redux hook 是 [**`useSelector`**](https://react-redux.js.org/api/hooks#useselector)，它**使得 React 组件可以从 Redux store 中读取数据**。

`useSelector` 接收一个 **selector** 函数。**selector 函数接收 Redux store 的 state 作为其参数，然后从 state 中取值并返回**。

例如，在 todo 应用程序中，Redux state 将 todos 数组保存为 `state.todos`。我们可以编写一个 selector 函数来返回它：

```js
const selectTodos = state => state.todos
```

也可以获取到当前被标记为 completed 的 todo 列表：

```js
const selectTotalCompletedTodos = state => {
  const completedTodos = state.todos.filter(todo => todo.completed)
  return completedTodos.length
}
```

因此，**selector 函数可以直接返回 Redux state，也可以基于该 state 返回 _派生_ 值**。

为了在 `<TodoList>` 组件中读取 todos 数组，首先需要从 `react-redux` 库中引入 `useSelector` hook，然后使用 selector 函数作为参数调用它：

```jsx title="src/features/todos/TodoList.js"
import React from 'react'
// highlight-next-line
import { useSelector } from 'react-redux'
import TodoListItem from './TodoListItem'

// highlight-next-line
const selectTodos = state => state.todos

const TodoList = () => {
  // highlight-next-line
  const todos = useSelector(selectTodos)

  // `todos` 是一个数组，我们可以遍历它
  const renderedListItems = todos.map(todo => {
    return <TodoListItem key={todo.id} todo={todo} />
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}

export default TodoList
```

`<TodoList>` 组件第一次渲染时，`useSelector` hook 会调用 `selectTodos` 并传入 _全部的_ Redux state 对象。无论 selectTodos 返回什么，useSelector 都会把它返回给组件。因此，组件中的 `const todos` 最终会和 Redux store state 中的 `state.todos` 数组保持一致。

假设我们 dispatch `{type: 'todos/todoAdded'}` 这个 action，将会发生什么？Redux state 会被 reducer 更新，但是组件没有感知到变化并用新值重新渲染。

虽然 _可以_ 调用 `store.subscribe()` 来监听每个组件中 store 的变化，但是这样会变得重复且难以控制。

幸运的是，**`useSelector` 会自动订阅 Redux store！**这样，任何时候 dispatch action，它都会立即再次调用对应的 selector 函数。**如果 selector 返回的值与上次运行时相比发生了变化，`useSelector` 将强制组件使用新值重新渲染**。我们仅需要在组件中调用一次 `useSelector()` 即可。

但是，要谨记下面这个要点：

:::caution 警告

**`useSelector` 使用严格的 `===` 来比较结果，因此只要 selector 函数返回的结果是新地址引用，组件就会重新渲染！**这意味着如果在 selector 中创建并返回新地址引用，那么每次 dispatch action 后组件都会被重新渲染，即使数据值确实没有改变。

:::

例如，将此 selector 传递给 `useSelector` 会导致组件 _总是_ 被重新渲染，因为 `array.map()` 永远返回一个新的数组引用：

```js
// 不好的示例：总是返回一个新的引用
const selectTodoDescriptions = state => {
  // 这会创建一个新的数组引用！
  return state.todos.map(todo => todo.text)
}
```

:::tip 提示

我们会在本节后面部分介绍解决此问题的一种方法。还会在[第 7 节：标准 Redux 模式](./part-7-standard-patterns.md)中讨论如何使用“记忆（memoized）”selector 函数来提高性能并避免不必要的重新渲染。

:::

还值得注意的是，我们可以像下面这样直接在 `useSelector` 里写 selector 函数，而不必把它写成单独的变量：

```js
const todos = useSelector(state => state.todos)
```

### 使用 `useDispatch` 来 Dispatch Action

我们已经知道如何在组件中读取 Redux store 的值。那么，组件怎么向 store  dispatch action 呢？已知在 React 之外可以调用 `store.dispatch(action)`，但是在组件文件中无法访问 store，因此我们需要一些方法来访问组件内部的 `dispatch` 函数。

React-Redux 的 [**`useDispatch` hook 函数**](https://react-redux.js.org/api/hooks#usedispatch)会返回 store 的 `dispatch` 方法。（事实上这个 hook 的内部实现真的是 `return store.dispatch`。）

因此，我们可以在任何需要 dispatch action 的组件中使用 `const dispatch = useDispatch()`，然后根据需要调用 `dispatch(someAction)`。

我们先在 `<Header>` 组件中试一下。首先需要让用户输入一些文本作为新的 todo 项，然后 dispatch 一个包含该文本的 `{type: 'todos/todoAdded'}` action。

我们将编写一个典型的 React 表单组件，它使用[“受控组件（controlled inputs）”](https://reactjs.org/docs/forms.html#controlled-components)来让用户输入文本。然后，当用户按下 Enter 键时，就 dispatch action。

```jsx title="src/features/header/Header.js"
import React, { useState } from 'react'
// highlight-next-line
import { useDispatch } from 'react-redux'

const Header = () => {
  const [text, setText] = useState('')
  // highlight-next-line
  const dispatch = useDispatch()

  const handleChange = e => setText(e.target.value)

  const handleKeyDown = e => {
    const trimmedText = e.target.value.trim()
    // 如果用户按下 Enter 键：
    if (e.key === 'Enter' && trimmedText) {
      // highlight-start
      // 使用这个文本来 dispatch "todo added" action
      dispatch({ type: 'todos/todoAdded', payload: trimmedText })
      // highlight-end
      // 清空文本输入框
      setText('')
    }
  }

  return (
    <input
      type="text"
      placeholder="What needs to be done?"
      autoFocus={true}
      value={text}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  )
}

export default Header
```

### 使用 `Provider` 透传 Store

现在组件可以从 store 中读取 state，并 dispatch action 到 store。但是仍少了点什么。比如 React-Redux  hook 在哪里以及如何找到正确的 Redux store？hook 仅仅是一个 JS 函数，它并不能从 store.js 中自动导入 store。

我们必须明地确告诉 React-Redux 当前组件需要的 store。为此，我们**使用  `<Provider>` 组件包裹 `<App>` 组件，并将 Redux store 作为 prop 传递给 `<Provider>` 组件**。之后，应用程序中的每个组件都可以在需要时能够访问到 Redux store。

我们把以上逻辑加到 `index.js` 文件中：

```jsx title="src/index.js"
import React from 'react'
import ReactDOM from 'react-dom'
// highlight-next-line
import { Provider } from 'react-redux'

import App from './App'
import store from './store'

ReactDOM.render(
  // highlight-start
  // 使用 `<Provider>` 组件包裹 `<App>` 组件
  // 并把 Redux store 作为 prop 传入
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  // highlight-end
  document.getElementById('root')
)
```

以下涵盖了将 React-Redux 与 React 结合使用的关键部分：

- 使用 `useSelector` hook 函数来读取 React 组件中的数据
- 使用 `useDispatch` hook 函数在组件中 dispatch action
- 使用 `<Provider store={store}>` 组件包裹 `<App>` 组件，这样其他组件都能够和 store 进行交互

我们现在能够与应用程序进行实际交互了！这是到目前为止的 UI：

<iframe
  class="codesandbox"
  src="https://codesandbox.io/embed/github/reduxjs/redux-fundamentals-example-app/tree/checkpoint-4-initialHooks/?fontsize=14&hidenavigation=1&theme=dark&runonclick=1"
  title="redux-fundamentals-example-app"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

接下来，让我们看看在 todo 应用程序中使用它们的其他几种方式。

## React-Redux 模式

### 全局 State，组件 State，表单

你可能想知道，“是否总是必须将应用程序所有的 state 都放到 Redux store 里？”

答案是**否定的。整个应用程序所需的全局 state 应该放在 Redux store 中。只在一个组件内使用的 state 应该放在组件 state 中。**

之前编写的 `<Header>` 组件就是一个很好的例子。我们虽然 _可以_ 将当前输入的文本字符串保存在 Redux store 里，然后通过在输入框的 `onChange` 事件里 dispatch action 并将其保存在 reducer 中。但是这样做并没有带来任何好处，因为 `<Header>` 组件是唯一使用该文本字符串的地方。

因此，在 `<Header>` 组件中使用 `useState` hook 函数会更好。

类似地，如果我们有一个名为 `isDropdownOpen` 的布尔值，应用程序中的其他组件不会用到它——那么它应该只存在于该组件。

:::tip 提示

**在 React + Redux 应用程序中，全局 state 应该放在 Redux store 中，本地 state 应该留在 React 组件中。**

如果你不确定哪些数据应该放入 Redux，这里有一些常用的经验法则可以参考：

- 应用程序的其他部分是否关心这些数据？
- 是否需要基于这些原始数据创建派生数据？
- 是否使用相同的数据来驱动多个组件？
- 是否有将此 state 恢复到特定时间点（即时间旅行调试）的需求？
- 是否需要缓存数据（比如它已经存在，则直接使用 state 中的值而不重新请求）？
- 是否希望在热重载 UI 组件时（可能会丢失内部 state） 仍能保持数据一致性？

:::

这也是一个如何在 Redux 中设计表单 state 很好的例子。**大多数表单 state 可能不应该保存在 Redux 中。** 而是应该在编辑表单时将数据保存在表单组件里，然后在用户完成时 dispatch action 以更新 store。

### 在组件中使用多个 Selectors

目前只有 `<TodoList>` 组件从 store 中读取数据。如果 `<Footer>` 组件也从 store 中获取数据会是什么样。

`<Footer>` 组件需要获取如下三个信息：

- 有多少已完成的 todo
- 当前 “status” 的 filter 值
- 当前选定的 “color” 类别 filters 列表

组件中如何读取这些值？

**我们可以在一个组件中多次使用 `useSelector`**。**并且每次调用 `useSelector` 都应该总是返回尽可能少的 state**。——事实上，这样做是明智的。

前面我们已经看到了如何编写一个 selector 来获取已完成的 todo。由于这个组件需要用到的 status filter 值和 color filters 值都存放在 `state.filters` slice 中，我们可以读取整个 `state.filters` 对象。

正如前文所述，我们可以将所有输入处理直接放入 `<Footer>`，或者将其拆分成多个独立组件，比如 `<StatusFilter>`。为了解释起来更简洁，我们将跳过编写输入处理的具体细节，并假设已经包含多个独立的小组件，这些组件通过 prop 已传入一些给定数据和 change 事件处理器回调函数。

鉴于上述假设，组件的 React-Redux 部分可能如下所示：

```jsx title="src/features/footer/Footer.js"
import React from 'react'
// highlight-next-line
import { useSelector } from 'react-redux'

import { availableColors, capitalize } from '../filters/colors'
import { StatusFilters } from '../filters/filtersSlice'

// 省略其他页脚组件

const Footer = () => {
  // highlight-start
  const todosRemaining = useSelector(state => {
    const uncompletedTodos = state.todos.filter(todo => !todo.completed)
    return uncompletedTodos.length
  })

  const { status, colors } = useSelector(state => state.filters)
  // highlight-end

  // 省略 onChange 回调函数

  return (
    <footer className="footer">
      <div className="actions">
        <h5>Actions</h5>
        <button className="button">Mark All Completed</button>
        <button className="button">Clear Completed</button>
      </div>

      <RemainingTodos count={todosRemaining} />
      <StatusFilter value={status} onChange={onStatusChange} />
      <ColorFilters value={colors} onChange={onColorChange} />
    </footer>
  )
}

export default Footer
```

### 通过 ID 选择列表项中的数据

目前，`<Todo List>` 会读取整个 `state.todos` 数组，并将实际的 todo 对象作为 prop 传递给每个 `<Todo List Item>` 组件。

虽然可行，但存在潜在的性能问题。

- 更改一个 todo 对象意味着同时创建 todo 和 state.todos 数组的副本，每个副本都是内存中的一个新引用
- 当 `useSelector` 接收到一个新的引用时，它会强制重新渲染组件
- 因此，无论何时 _任何_ todo 对象被更新（比如点击它来切换完成状态），整个 `<TodoList>` 父组件都会重新渲染
- [因为 React 会默认递归地重新渲染所有子组件](https://blog.isquaredsoftware.com/2020/05/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior/#standard-render-behavior)，意味着 _所有的_ `<TodoListItem>` 组件都会被重新渲染，即使大部分组件实际上根本没有变化！

重新渲染组件也不坏——这就是 React 判断它是否需要更新 DOM 的方式。但如果列表很庞大，在实际上没有任何变化的情况下重新渲染大量组件可能会变得很慢。

 有几种方法可以解决这个问题。一种是[使用 `React.memo()` 包装所有的 `<TodoListItem>` 组件](https://reactjs.org/docs/react-api.html#reactmemo)，这样它们只会在 props 变化时才会重新渲染。这通常是提高性能的好办法，但它要求子组件直到发生变化前都始终接收相同的 props。由于每个 `<TodoListItem>` 组件都接收一个 todo 项作为 prop，因此只有其中一个组件会真正获得改变的 prop 并重新渲染。 

另一种方法是让 `<TodoList>` 组件仅从 store 中读取一组 todo ID，并将这些 ID 作为 props 传递给 `<TodoListItem>` 组件。然后，每个 `<TodoListItem>` 组件可以通过该 ID 来找到正确的 todo 对象。

让我们来试一下。

```jsx title="src/features/todos/TodoList.js"
import React from 'react'
import { useSelector } from 'react-redux'
import TodoListItem from './TodoListItem'

// highlight-next-line
const selectTodoIds = state => state.todos.map(todo => todo.id)

const TodoList = () => {
  // highlight-next-line
  const todoIds = useSelector(selectTodoIds)

  const renderedListItems = todoIds.map(todoId => {
    // highlight-next-line
    return <TodoListItem key={todoId} id={todoId} />
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}
```

这次，我们只从 `<TodoList>` 组件的 store 中选择一个 todo ID 数组，并将每个 `todoId` 作为 `id` 属性传递给 `<TodoListItem>` 组件。

然后，在 `<TodoListItem>` 组件中，我们可以通过该 ID 值获取到 todo 项。还可以根据 todo 的 ID 进行 dispatch action 来更新 `<TodoListItem>` 组件。

```jsx title="src/features/todos/TodoListItem.js"
import React from 'react'
// highlight-next-line
import { useSelector, useDispatch } from 'react-redux'

import { availableColors, capitalize } from '../filters/colors'

// highlight-start
const selectTodoById = (state, todoId) => {
  return state.todos.find(todo => todo.id === todoId)
}
// highlight-end

// 仅解构 `props.id`，因为我们只需要 ID 值
const TodoListItem = ({ id }) => {
  // 使用 state 和 ID 值调用 `selectTodoById`
  // highlight-next-line
  const todo = useSelector(state => selectTodoById(state, id))
  const { text, completed, color } = todo

  // highlight-next-line
  const dispatch = useDispatch()

  // highlight-start
  const handleCompletedChanged = () => {
    dispatch({ type: 'todos/todoToggled', payload: todo.id })
  }
  // highlight-end

  // 省略其他 change 事件处理器
  // 省略其他列表项呈现逻辑和内容

  return (
    <li>
      <div className="view">{/* 省略其他渲染输出 */}</div>
    </li>
  )
}

export default TodoListItem
```

 不过，这有一个问题。之前说过**在 selector 中返回新的数组引用会导致组件每次都重新渲染**，现在我们尝试在 `<TodoList>` 中返回一个新的 IDs 数组。那么，即使我们切换 todo，IDs 数组的 _内容_ 应该是相同的，因为我们没有添加或删除任何内容。但是，由于包含这些 ID 的数组是一个新的引用，所以 `<TodoList>` 也会重新渲染即使它确实没有必要。

一种解决方案是更改 `useSelector` 判断值是否变更的方式。`useSelector` 可以将比较函数作为它的第二个参数。比较函数接收旧值和新值作为参数，内部会判断两个值是否相同，相同则返回 “true”，那么组件也就不会被重新渲染。

React-Redux 有一个 `shallowEqual` 比较函数，我们可以使用它来检查数组 _内部每一项_ 是否仍然相同。来试一下：

```jsx title="src/features/todos/TodoList.js"
import React from 'react'
// highlight-next-line
import { useSelector, shallowEqual } from 'react-redux'
import TodoListItem from './TodoListItem'

// highlight-next-line
const selectTodoIds = state => state.todos.map(todo => todo.id)

const TodoList = () => {
  // highlight-next-line
  const todoIds = useSelector(selectTodoIds, shallowEqual)

  const renderedListItems = todoIds.map(todoId => {
    return <TodoListItem key={todoId} id={todoId} />
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}
```

现在，如果我们切换 todo，ID 列表将被视为没有变化，`<TodoList>` 也不会被重新渲染。一个 `<TodoListItem>` 组件将获得一个更新的 todo 对象并重新渲染，但其余的组件因为 todo 没有变化所以不会被重新渲染。

如前所述，还可以使用一种称为["记忆（memoized）selector"](part-7-standard-patterns.md) 的特殊 selector 函数来改进组件渲染，我们会在另一章节介绍。

## 你的所学

我们现在已经实现了一个可运作的 todo 应用程序！应用程序创建了 store，并使用 `<Provider>` 将 store 传递给 React UI 层，然后通过 `useSelector`、 `useDispatch` 和 React 组件中的 store 进行交互。

:::info 提示

你可以尝试自己实现其余缺少的 UI 功能！这是需要添加的内容列表：

- 在 `<TodoListItem>` 组件中，使用 `useDispatch` hook 来 dispatch 用于更改颜色类别和删除 todo 的 action
- 在 `<Footer>` 中，使用 `useDispatch` hook 来 dispatch 用于标记 todos 为已完成、清除已完成的状态以及更改 filter 值的 action

我们会在[第 7 节：标准 Redux 模式](./part-7-standard-patterns.md)中实现 filters。

:::

我们来看下应用程序目前的样子，涵盖了跳过的组件和部分：

<iframe
  class="codesandbox"
  src="https://codesandbox.io/embed/github/reduxjs/redux-fundamentals-example-app/tree/checkpoint-5-uiAllActions/?fontsize=14&hidenavigation=1&theme=dark&runonclick=1"
  title="redux-fundamentals-example-app"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

:::tip 总结

- **Redux  stores 可以和任何 UI 层一起使用**
  - UI 代码始终订阅 store 以获取最新的 state，并自行重绘
- **React-Redux 是 React 的官方 Redux UI 绑定库**
  - React-Redux 作为单独的 `react-redux` 包安装
- **`useSelector` hook 使得 React 组件能够从 store 中读取数据**
  - selector 函数将整个 store `state` 作为参数，并根据该 state 返回一个值
  - `useSelector` 调用它的 selector 函数并返回 selector 返回的结果
  - `useSelector` 订阅 store，并在每次 dispatch action 时重新运行 selector
  - 每当 selector 结果发生变化时，`useSelector` 将强制组件使用新数据重新渲染
- **`useDispatch` hook 使得 React 组件能够向 store dispatch action**
  - `useDispatch` 返回实际的 `store.dispatch` 函数
  - 你可以根据需要在组件内部调用 `dispatch(action)`
- **`<Provider>` 组件使其他 React 组件可以和 store 进行交互**
  - 使用 `<Provider store={store}>` 组件包裹 `<App>`

:::

## 下一步

目前 UI 已正常运作，接下来要让 Redux 应用程序能够与服务器通信。在[第 6 节：异步逻辑](./part-6-async-logic.md)中，我们将讨论超时、AJAX 调用等异步逻辑如何适应 Redux 数据流。
