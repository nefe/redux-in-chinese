---
id: part-6-async-logic
title: 'Redux 深入浅出，第六节：异步逻辑和数据获取'
sidebar_label: '异步逻辑和数据获取'
description: '官方 Redux 基础教程：学习如何在 Redux 中使用异步逻辑'
---

# Redux 深入浅出，第六节：异步逻辑和数据获取

:::tip 你将学到

- Redux 数据流如何处理异步数据
- 如何使用 Redux middleware 处理异步逻辑
- 处理异步请求 state 的模式

:::

:::info 预置知识

- 熟悉使用 AJAX 请求从服务器获取和更新数据
- 理解 JS 中的异步逻辑，包括 Promise

:::

## 简介

[第五节：视图和 React](./part-5-ui-and-react.md)，展示了如何使用 React-Redux 库使得 React 组件与 Redux store 能够交互，包括调用 `useSelector` 来读取 Redux state，调用 `useDispatch` 来访问 `dispatch` 函数，以及使用 `<Provider>` 组件包裹应用程序来让这些钩子函数可以访问 store。

到目前为止，我们所使用的数据都直接来自 React+Redux 客户端应用程序。但是，大多数实际应用程序需要通过调用 HTTP API 来获取并保存来自服务器的数据。

在本节中，我们将改写 todos 程序：通过 API 的方式获取并保存数据。

### REST API 和客户端示例

为了保持示例项目独立但具真实性，初始项目已经预置了一个虚拟的内存 REST API（使用 [Mirage.js 模拟 API 工具](https://miragejs.com/) 进行配置）。它使用 `/fakeApi` 作为基本 URL，并支持 `/fakeApi/todos` 常用的 HTTP 方法如： `GET/POST/PUT/DELETE`，它们定义在 `src/api/server.js`。

该项目还包括一个小型 HTTP API 客户端对象，它公开了 client.get() 和 client.post() 方法，类似于流行的 HTTP 库，如 axios。 它定义在 `src/api/client.js`。

在本节中，我们将使用 `client` 对象对虚拟 REST API 进行 HTTP 调用。

## Redux Middleware 和副作用

Redux store 本身无法处理异步逻辑。它只会同步地 dispatch action，并通过调用根 reducer 函数来更新 state，然后通知视图更新。任何异步都必须在 store 之外发生。

之前提过 Redux reducer 绝对不能包含“副作用”。 **“副作用”是指除函数返回值之外的任何变更，包括 state 的更改或者其他行为**。一些常见的副作用是：

- 在控制台打印日志
- 保存文件
- 设置异步定时器
- 发送 AJAX HTTP 请求
- 修改存在于函数之外的某些 state，或改变函数的参数
- 生成随机数或唯一随机 ID（例如 `Math.random()` 或 `Date.now()`）

但是事实上应用程序都需要在 _某处_ 做这些事情。所以如果不能把副作用放在 reducer 中，那可以放在哪里呢？

**Redux middleware 就是用来放这些副作用逻辑代码的地方**。

正如[第四节](./part-4-store.md#middleware-use-cases)介绍的，当 Redux middleware 执行 dispatch action 时，它可以做 _任何事情_：记录某些内容、修改 action、延迟 action，进行异步调用等。此外，由于 middleware 围绕真正的 `store.dispatch` 函数形成了一个管道，这也意味着我们实际上可以将一些 _不是_ 普通 action 对象的东西传递给 `dispatch`，只要 middleware 截获该值并且不让它到达 reducer。

Middleware 也可以访问 `dispatch` 和 `getState`。这意味着你可以在 middleware 中编写一些异步逻辑，并且仍然能够通过 dispatch action 与 Redux store 进行交互。

### 使用 Middleware 启用异步逻辑

下面是几个示例，用来说明 middleware 如何使我们能够编写与 Redux store 交互的异步逻辑。

一个契机是编写 middleware 来查找特定的 action type，并在执行这些 action 时运行异步逻辑，例如以下示例：

```js
import { client } from '../api/client'

const delayedActionMiddleware = storeAPI => next => action => {
  if (action.type === 'todos/todoAdded') {
    setTimeout(() => {
      // 将这个 action 延迟1秒执行
      next(action)
    }, 1000)
    return
  }

  return next(action)
}

const fetchTodosMiddleware = storeAPI => next => action => {
  if (action.type === 'todos/fetchTodos') {
    // 发送 API 从服务器获取 todos
    client.get('todos').then(todos => {
      // 使用获取到的 todos 数据来 dispatch 一个 action
      storeAPI.dispatch({ type: 'todos/todosLoaded', payload: todos })
    })
  }

  return next(action)
}
```

:::info 提示

有关 Redux 为什么以及如何使用 middleware 处理异步逻辑的更多详细信息，请参阅 Redux 创建者 Dan Abramov 在 StackOverflow 上的回答：

- [如何 dispatch 延迟 action？](https://stackoverflow.com/questions/35411423/how-to-dispatch-a-redux-action-with-a-timeout/35415559#35415559)
- [为什么我们需要 middleware 来实现异步流？](https://stackoverflow.com/questions/34570758/why-do-we-need-middleware-for-async-flow-in-redux/34599594#34599594)

:::

### 编写异步函数 Middleware

最后一节中的两个 middleware 都非常具体，只做了一件事。如果有办法可以提前编写 _任何_ 异步逻辑，不但与 middleware 本身分开，而且仍然可以访问 `dispatch` 和 `getState` 来和 store 进行交互，那就太好了。

**假设我们实现这样的 middleware，它可以传递 _函数_ 给 `dispatch`，而不是 action 对象呢**？可以让这个 middleware 判断 action 是否为函数，如果是函数，就立即调用。这样就可以在 middleware 定义之外的其他函数中编写异步逻辑了。

middleware 看起来像这样：

```js title="异步函数 middleware 示例"
const asyncFunctionMiddleware = storeAPI => next => action => {
  // 如果 action 实际上是一个函数...
  if (typeof action === 'function') {
    // 调用该函数并传入 `dispatch` 和 `getState` 作为参数
    return action(storeAPI.dispatch, storeAPI.getState)
  }

  // 否则，它就是一个普通 action，那就继续执行
  return next(action)
}
```

然后就可以像这样使用该 middleware：

```js
const middlewareEnhancer = applyMiddleware(asyncFunctionMiddleware)
const store = createStore(rootReducer, middlewareEnhancer)

// 编写一个接收 `dispatch` 和 `getState` 作为参数的函数
const fetchSomeData = (dispatch, getState) => {
  // 发送一个异步 HTTP 请求
  client.get('todos').then(todos => {
    // 使用获取的 todos 来 dispatch action
    dispatch({ type: 'todos/todosLoaded', payload: todos })
    // 在 dispatch 后检查更新后的 store
    const allTodos = getState().todos
    console.log('Number of todos after loading: ', allTodos.length)
  })
}

// 向 `dispatch` 传入 _函数_ 
store.dispatch(fetchSomeData)
// 打印日志：'加载完成后 todos 的数量：###'
```

再次注意，**这个异步函数 middleware 使得我们可以给 `dispatch` 传入 _函数_ ！** 在该函数中，可以编写一些异步逻辑（比如 HTTP 请求），然后在请求完成后 dispatch 一个普通的 action。

## Redux 异步数据流

那么 middleware 和异步逻辑如何影响 Redux 应用程序的整体数据流呢？

就像普通 action 一样，首先需要在应用程序中处理用户事件，比如点击按钮。然后，调用 `dispatch()`，并传入 _一些内容_，无论是普通的 action 对象、函数，还是 middleware 可以找到的其他值。

一旦 dispatch 的值到达 middleware，它就可以进行异步调用，然后在异步调用完成时 dispatch 一个正真的 action 对象。

前面，我们看了[Redux 同步数据流程图](./part-2-concepts-data-flow.md#redux-application-data-flow)。当我们向 Redux 应用程序添加异步逻辑时，额外添加了 middleware 步骤，可以在其中运行 AJAX 请求等逻辑，然后 dispatch action。这使得异步数据流看起来像这样：

![Redux 异步数据流程图](/img/tutorials/essentials/ReduxAsyncDataFlowDiagram.gif)

## 使用 Redux Thunk Middleware

实际上，Redux 已经有了异步函数 middleware 的正式版本，称为 [**Redux “Thunk” middleware**](https://github.com/reduxjs/redux-thunk)。 thunk middleware 允许我们编写以 `dispatch` 和 `getState` 作为参数的函数。 thunk 函数可以包含我们想要的任何异步逻辑，并且该逻辑可以根据需要 dispatch action 以及读取 store state。

**将异步逻辑写成 thunk 函数允许我们在不知道使用的 Redux store 的情况下能够重用该逻辑。**

:::info 提示

“thunk” 是一个编程术语，意思是["一段执行延迟工作的代码"](https://en.wikipedia.org/wiki/Thunk)。有关如何使用 thunk 的更多详细信息，请参阅 thunk 使用指南页面：

- [使用指南：使用 Thunk 编写异步逻辑](../../usage/writing-logic-thunks.mdx)

以及这些帖子：

- [什么是 thunk？](https://daveceddia.com/what-is-a-thunk/)
- [Redux 中的 thunk：基础知识](https://medium.com/fullstack-academy/thunks-in-redux-the-basics-85e538a3fe60)

:::

### 配置 Store

Redux thunk middleware 在 NPM 上作为一个名为 redux-thunk 的包提供。需要安装该软件包后才能在应用程序中使用：

```bash
npm install redux-thunk
```

安装后，我们可以更新 todo 应用程序中的 Redux store 来使用该 middleware：

```js title="src/store.js"
import { createStore, applyMiddleware } from 'redux'
// highlight-next-line
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducer'

// highlight-next-line
const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))

// store 现在就可以在 `dispatch` 中接收 thunk 函数了
const store = createStore(rootReducer, composedEnhancer)
export default store
```

### 从服务器获取 Todos

目前我们的 todo 条目只能存在于客户端的浏览器中。我们需要一种在应用启动时从服务器加载 todos 列表的方法。

首先编写一个 thunk 函数，该函数向 `/fakeApi/todos` 端点进行 AJAX 请求获取到一个 todo 对象数组，然后 dispatch 包含该数组作为 payload 的 action。因为这部分内容和 todos 功能相关，所以我们在 `todosSlice.js` 文件中编写 thunk 函数：

```js title="src/features/todos/todosSlice.js"
import { client } from '../../api/client'

const initialState = []

export default function todosReducer(state = initialState, action) {
  // 省略 reducer 逻辑
}

// Thunk 函数
// highlight-start
export async function fetchTodos(dispatch, getState) {
  const response = await client.get('/fakeApi/todos')
  dispatch({ type: 'todos/todosLoaded', payload: response.todos })
}
// highlight-end
```

我们只需要在应用程序第一次加载时调用这个 API。以下是 _可以_ 放这个 thunk 函数的地方：

- 在`<App>` 组件的 `useEffect` 钩子函数中
- 在 `<TodoList>` 组件的 `useEffect` 钩子函数中
- 直接放在 `index.js` 导入 store 之后的地方

现在，尝试将其直接放在 `index.js` 中：

```js title="src/index.js"
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import './index.css'
import App from './App'

import './api/server'

// highlight-start
import store from './store'
import { fetchTodos } from './features/todos/todosSlice'

store.dispatch(fetchTodos)
// highlight-end

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
```

重新加载页面后，虽然 UI 没有变化，但如果我们打开 Redux DevTools，就可以看到一个 `'todos/todosLoaded'` action 被 dispatch 了，并且它包含一些由虚拟服务器 API 生成的 todo 对象：

![Devtools - todosLoaded action contents](/img/tutorials/fundamentals/devtools-todosLoaded-action.png)

请注意，即使我们已经 dispatch 了一个 action，state 仍没有任何改变。 **我们需要在 todos reducer 中处理这个 action 来更新 state。**

让我们在 reducer 中添加一个 case，来将这些数据载入 store。因为我们需要从服务器获取数据，并完全替换现有的 todos，所以可以返回 `action.payload` 数组，使其成为新的 todos `state` 值：

```js title="src/features/todos/todosSlice.js"
import { client } from '../../api/client'

const initialState = []

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    // 省略其他 reducer cases
    // highlight-start
    case 'todos/todosLoaded': {
      // 通过返回的新值完全替换现有 state
      return action.payload
    }
    // highlight-end
    default:
      return state
  }
}

export async function fetchTodos(dispatch, getState) {
  const response = await client.get('/fakeApi/todos')
  dispatch({ type: 'todos/todosLoaded', payload: response.todos })
}
```

由于 dispatch action 会立即更新 store，所以我们也可以在 dispatch 后调用 thunk 中的 getState 来读取更新后的 state 值。例如，我们可以在 dispatch `'todos/todosLoaded'` 操作前后将 todos 总数打印到控制台：

```js
export async function fetchTodos(dispatch, getState) {
  const response = await client.get('/fakeApi/todos')

  // highlight-next-line
  const stateBefore = getState()
  console.log('Todos before dispatch: ', stateBefore.todos.length)

  dispatch({ type: 'todos/todosLoaded', payload: response.todos })

  // highlight-next-line
  const stateAfter = getState()
  console.log('Todos after dispatch: ', stateAfter.todos.length)
}
```

### 保存 Todo 条目

每次创建新的 todo 条目后，都需要更新服务器的数据。我们应该使用初始数据对服务器进行 API 调用，等待服务器返回新保存的 todo 条目副本，_然后_ 使用那些 todo 条目来 dispatch action，而不是立即 dispatch `'todos/todoAdded'` action。

但是，尝试将此逻辑编写为 thunk 函数，将会遇到一个问题：由于我们将 thunk 编写成 `todosSlice.js` 文件中的独立函数，所以进行 API 调用的代码不知道新的 todo 文本应该是什么：

```js title="src/features/todos/todosSlice.js"
async function saveNewTodo(dispatch, getState) {
  // ❌ 我们需要有新的 todo 文本，但它来自哪里？
  // highlight-next-line
  const initialTodo = { text }
  const response = await client.post('/fakeApi/todos', { todo: initialTodo })
  dispatch({ type: 'todos/todoAdded', payload: response.todo })
}
```

我们需要实现一个接受 `text` 作为参数的函数，接着创建实际的 thunk 函数，以便它可以使用 `text` 值进行 API 调用。然后，外部函数应该返回 thunk 函数，以便可以传递给组件中的 `dispatch`。

```js title="src/features/todos/todosSlice.js"
// 编写一个接收 `text` 参数的同步外部函数：
export function saveNewTodo(text) {
  // 然后创建并返回异步 thunk 函数：
  return async function saveNewTodoThunk(dispatch, getState) {
    // ✅ 现在可以使用文本值并将其发送到服务器了
    const initialTodo = { text }
    const response = await client.post('/fakeApi/todos', { todo: initialTodo })
    dispatch({ type: 'todos/todoAdded', payload: response.todo })
  }
}
```

现在我们可以在 `<Header>` 组件中使用它：

```js title="src/features/header/Header.js"
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

// highlight-next-line
import { saveNewTodo } from '../todos/todosSlice'

const Header = () => {
  const [text, setText] = useState('')
  const dispatch = useDispatch()

  const handleChange = e => setText(e.target.value)

  const handleKeyDown = e => {
    // 如果用户按下 Enter 键：
    const trimmedText = text.trim()
    if (e.which === 13 && trimmedText) {
      // highlight-start
      // 使用用户编写的文本创建 thunk 函数
      const saveNewTodoThunk = saveNewTodo(trimmedText)
      // 然后 dispatch thunk 函数本身
      dispatch(saveNewTodoThunk)
      // highlight-end
      setText('')
    }
  }

  // omit rendering output
}
```

因为我们将立即传递 thunk 函数给组件中的 `dispatch`，所以可以跳过创建临时变量的步骤。相反，我们可以调用 `saveNewTodo(text)`，并将生成的 thunk 函数直接传递给 `dispatch`：

```js title="src/features/header/Header.js"
const handleKeyDown = e => {
  // 如果用户按下 Enter 键：
  const trimmedText = text.trim()
  if (e.which === 13 && trimmedText) {
    // highlight-start
    // 创建 thunk 函数并立即 dispatch
    dispatch(saveNewTodo(trimmedText))
    // highlight-end
    setText('')
  }
}
```

现在组件实际上并不知道它甚至在 dispatch 一个 thunk 函数 - `saveNewTodo` 函数正在封装实际发生的事情。 `<Header>` 组件只知道它需要在用户按下回车键时 dispatch _一些值_。

编写预备传递给`dispatch`内容的函数，这一模式称为**action creator 模式**，我们将在[下一节](./part-7-standard-patterns.md)详细讨论。

现在可以看到更新后的 `'todos/todoAdded'` action 被 dispatch 了：

![Devtools - async todoAdded action contents](/img/tutorials/fundamentals/devtools-async-todoAdded-action.png)

这里最后需要做的事情是更新 todos reducer。当我们向 `/fakeApi/todos` 发出 POST 请求时，服务器将返回一个全新的 todo 对象（包括一个新的 ID 值）。这意味着 reducer 不必计算新的 ID，或填充其他字段 - 它只需要创建一个包含新 todo 条目的新 `state` 数组：

```js title="src/features/todos/todosSlice.js"
const initialState = []

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    // highlight-start
    case 'todos/todoAdded': {
      // 返回一个新的 todos state 数组，最后带有新的 todo 条目
      return [...state, action.payload]
    }
    // highlight-end
    // 省略其他 case
    default:
      return state
  }
}
```

现在添加一个新的 todo 将会正常工作：

![Devtools - async todoAdded state diff](/img/tutorials/fundamentals/devtools-async-todoAdded-diff.png)

:::tip 提示

Thunk 函数可用于处理异步 _和_ 同步逻辑。 Thunks 提供了一种方法来编写任何需要访问 `dispatch` 和 `getState` 的可重用逻辑。

:::

## 你的所学

现在我们已经成功地更新了 todo 应用程序，因此可以使用 thunk 函数对虚拟服务器 API 进行 AJAX 调用，来获取 todo 列表并保存新的 todo 条目。

在这个过程中，我们看到了如何使用 Redux middleware 进行异步调用，并在异步调用完成后通过 dispatch action 来和 store 进行交互的。

这是当前应用程序的展示：

<iframe
  class="codesandbox"
  src="https://codesandbox.io/embed/github/reduxjs/redux-fundamentals-example-app/tree/checkpoint-6-asyncThunks/?fontsize=14&hidenavigation=1&theme=dark&runonclick=1"
  title="redux-fundamentals-example-app"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

:::tip 总结

- **Redux middleware 旨在支持编写具有副作用的逻辑**
  - “副作用”是指更改函数外部 state 或行为的代码，例如 AJAX 调用、修改函数参数或生成随机值
- **middleware 为标准 Redux 数据流增加了一个额外的步骤**
  - middleware 可以拦截传递给 `dispatch` 的其他值
  - middleware 可以访问 `dispatch` 和 `getState`，因此它们可以作为异步逻辑的一部分 dispatch 更多 action
- **Redux “Thunk” middleware 使得可以传递函数给 `dispatch`**
  - “Thunk” 函数让我们可以提前编写异步逻辑，而不需要知道当前使用的 Redux store
  - Redux thunk 函数接收 `dispatch` 和 `getState` 作为参数，并且可以 dispatch 诸如“此数据是从 API 响应中接收到的”之类的 action

:::

## 下一步

目前为止已经涵盖了如何使用 Redux 的所有核心部分！你已经了解如何：

- 编写基于 dispatch action 来更新 state 的 reducer
- 使用 reducer、enhancer 和 middleware 创建及配置 Redux store
- 使用 middleware 编写 dispatch action 的异步逻辑

在[第 7 部分：标准 Redux 模式](./part-7-standard-patterns.md)中，我们将了解现实中 Redux 应用程序常用的几种代码模式，以使代码随着应用程序的扩张能够更加一致并更具扩展性。
