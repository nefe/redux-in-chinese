---
id: part-4-store
title: 'Redux 深入浅出, 第四节: Store'
sidebar_label: 'Store'
hide_title: false
description: 'The official Redux Fundamentals tutorial: 学习怎样创建和使用 Redux store'
---

import { DetailedExplanation } from '../../components/DetailedExplanation'

# Redux 深入浅出, 第四节: Store

:::tip 你将学到

- 如何创建 Redux store
- 如何使用 store 来更新 state 并监听更新
- 如何配置 store 来拓展其功能
- 如何设置 Redux DevTools Extension 来调试应用程序

:::

## 简介

在[第 3 节: State，Actions 和 Reducers](./part-3-state-actions-reducers.md)中, 开始编写 todo 示例程序。我们列出了业务需求，定义了让应用运行所需的 **state** 结构，创建了一系列描述匹配用户交互时“发生了什么”的 action type。还编写了 **reducer** 函数来更新 `state.todos` 和 `state.filters`，并了解了如何使用 Redux `combineReducers` 函数来为每个功能创建一个基于 "slice reducers" 的“根 reducer”。

是时候将这些部分整合在一起了，其中包含 Redux 应用程序的核心部分：**store**

## Redux Store

Redux **store** 汇集了构成应用程序的 state、actions 和 reducers。store 有以下几个职责:

- 在内部保存当前应用程序 state
- 通过 [`store.getState()`](../../api/Store.md#getState) 访问当前 state;
- 通过 [`store.dispatch(action)`](../../api/Store.md#dispatch) 更新状态;
- 通过 [`store.subscribe(listener)`](../../api/Store.md#subscribe) 注册监听器回调;
- 通过 [`store.subscribe(listener)`](../../api/Store.md#subscribe) 返回的 `unsubscribe` 函数注销监听器。

重要的是要注意 **Redux 应用程序中只有一个 store**。当你想要拆分数据处理逻辑时，你将使用 [reducer composition](./part-3-state-actions-reducers.md#splitting-reducers) 并创建多个可以组合在一起 reducer，而不是创建单独的 store。

### 创建 Store

**每个 Redux store 都有一个根 reducer 函数**. 在上一节中，我们 [使用 `combineReducers` 创建了一个根 reducer 函数](./part-3-state-actions-reducers.md#combinereducers)。在我们的示例应用程序中，该根 reducer 当前在 `src/reducer.js` 中定义。让我们导入根 reducer 并创建第一个 store。

Redux 核心库有一个[** `createStore` **](../../api/createStore.md) API 可以创建 store。新建一个名为 `store.js` 的文件，并导入 `createStore` 和根 reducer。然后，调用 `createStore` 并传入根 reducer ：

```js title="src/store.js"
import { createStore } from 'redux'
import rootReducer from './reducer'

// highlight-next-line
const store = createStore(rootReducer)

export default store
```

### 加载初始 State

`createStore` 也可以接受 `preloadedState` 值作为其第二个参数。你可以使用它在创建 store 时添加初始数据，例如包含在从服务器接收到的 HTML 页面中的值，或保存在 `localStorage` 中并在用户再次访问该页面时读回的值，如下所示：

```js title="storeStatePersistenceExample.js"
import { createStore } from 'redux'
import rootReducer from './reducer'

// highlight-start
let preloadedState
const persistedTodosString = localStorage.getItem('todos')

if (persistedTodosString) {
  preloadedState = {
    todos: JSON.parse(persistedTodosString)
  }
}

const store = createStore(rootReducer, preloadedState)
// highlight-end
```

## Dispatching Actions

现在我们已经创建了一个 store，来验证下程序是否有效！即使没有任何 UI，我们也可以测试更新逻辑。

:::tip

在运行此代码之前，请尝试返回 `src/features/todos/todosSlice.js`，并从 `initialState` 中删除所有示例 todo 对象，使其成为一个空数组。这使得该示例的输出更加易读。

:::

```js title="src/index.js"
// 省略现有的 React 导入

import store from './store'

// 打印 Initial state
// highlight-next-line
console.log('Initial state: ', store.getState())
// {todos: [....], filters: {status, colors}}

// 每次状态变化时，记录一下
// 请注意，subscribe() 返回一个用于解绑侦听器的函数
// highlight-start
const unsubscribe = store.subscribe(() =>
  console.log('State after dispatch: ', store.getState())
)
// highlight-end

// dispatch 一些 actions

// highlight-next-line
store.dispatch({ type: 'todos/todoAdded', payload: 'Learn about actions' })
store.dispatch({ type: 'todos/todoAdded', payload: 'Learn about reducers' })
store.dispatch({ type: 'todos/todoAdded', payload: 'Learn about stores' })

store.dispatch({ type: 'todos/todoToggled', payload: 0 })
store.dispatch({ type: 'todos/todoToggled', payload: 1 })

store.dispatch({ type: 'filters/statusFilterChanged', payload: 'Active' })

store.dispatch({
  type: 'filters/colorFilterChanged',
  payload: { color: 'red', changeType: 'added' }
})

// 停止监听 state 的更新
// highlight-next-line
unsubscribe()

// 再 dispatch 一个 action，看看发生了什么

store.dispatch({ type: 'todos/todoAdded', payload: 'Try creating a store' })

// 省略现有的 React 渲染逻辑
```

请记住，每次我们调用 `store.dispatch(action)` 时：

- store 调用 `rootReducer(state, action)`
  - 该根 reducer 可能会在其内部调用其他的 slice reducers，就像 `todosReducer(state.todos, action)`
- store 将*新的* state 保存在里面
- store 调用所有的监听器订阅回调
- 监听器现在通过调用 `store.getState()` 来访问 `store` 并读取最新的 state

如果我们查看该示例的控制台日志输出，你可以看到 Redux 状态在每个 action 被 dispatch 时如何变化：

![dispatching actions 后记录 Redux 状态](/img/tutorials/fundamentals/initial-state-updates.png)

请注意，我们的应用程序 _没有_ 记录上次 action 的任何内容。那是因为我们在调用 `unsubscribe()` 时删除了监听器回调，所以在 dispatch action 后没有任何其他运行。

我们甚至在开始编写 UI 之前就指定了应用程序的行为。这有助于让我们相信该应用程序将按预期工作。

:::info

如果你愿意，你现在可以尝试为 reducer 编写测试。因为他们都是[普通函数](../../understanding/thinking-in-redux/ThreePrinciples.md#changes-are-made-with-pure-functions)，所以测试起来应该很简单。使用示例 `state` 和 `action` 调用它们，获取结果并检查它是否符合预期：

```js title="todosSlice.spec.js"
import todosReducer from './todosSlice'

test('Toggles a todo based on id', () => {
  const initialState = [{ id: 0, text: 'Test text', completed: false }]

  const action = { type: 'todos/todoToggled', payload: 0 }
  const result = todosReducer(initialState, action)
  expect(result[0].completed).toBe(true)
})
```

:::

## Redux Store 内部

查看 Redux Store 内部实现对于学习 store 有所帮助。这是一个关于 Redux Store 实现的简化示例，大约 25 行代码：

```js title="miniReduxStoreExample.js"
function createStore(reducer, preloadedState) {
  let state = preloadedState
  const listeners = []

  function getState() {
    return state
  }

  function subscribe(listener) {
    listeners.push(listener)
    return function unsubscribe() {
      const index = listeners.indexOf(listener)
      listeners.splice(index, 1)
    }
  }

  function dispatch(action) {
    state = reducer(state, action)
    listeners.forEach(listener => listener())
  }

  dispatch({ type: '@@redux/INIT' })

  return { dispatch, subscribe, getState }
}
```

这个小版本的 Redux store 运行良好，你可以使用这个自己编写的 `createStore` 函数替换实际的 Redux `createStore` 函数（实际的 Redux 存储实现更长，更复杂，但是其中大部分是评论信息、警告信息和一些极端情况的处理）。

如你所见，这里的实际逻辑相当短：

- store 内部有当前的 `state` 值和 `reducer` 函数
- `getState` 返回当前 state 值
- `subscribe` 保存一个监听回调数组并返回一个函数来移除新的回调
- `dispatch` 调用 reducer，保存 state，并运行监听器
- store 在启动时 dispatch 一个 action 来初始化 reducers 的 state
- store API 是一个对象，里面有 `{dispatch, subscribe, getState}`

特别强调其中之一：注意 `getState` 只返回当前的 `state` 值。这意味着**默认情况下，没有什么可以阻止你意外改变当前 state 值！** 此代码将运行没有任何错误，但它是不正确的：

```js
const state = store.getState()
// ❌ 不要这样做 - 它改变了当前 state！
state.filters.status = 'Active'
```

换句话说：

- 当你调用 `getState()` 时，Redux store 不会产生 `state` 值的额外副本。它与根 reducer 函数返回的引用完全相同。
- Redux store 对于意外更改没有做任何防护，我们可以在 reducer 内部或者 store 外部改变状态，所以必须小心避免意外更改。

无意中发生变动的一个常见原因是对数组进行排序。[**调用 `array.sort()` 实际上会改变现有数组**](https://doesitmutate.xyz/sort/)。如果我们调用 `const sortedTodos = state.todos.sort()`，我们最终会无意中改变真实的 store 状态。
:::tip

在[第 8 节: Modern Redux](./part-8-modern-redux.md), 我们将看到 Redux Toolkit 如何避免 reducer 中的变动，以及检测并警告 reducer 之外无意中发生的变动。
:::

## 配置 Store

我们可以将 `rootReducer` 和 `preloadedState` 作为参数传递给 `createStore`。然而，`createStore` 也可以多带一个参数，用于自定义 store 的能力并新增功能。

Redux store 是使用一种叫做 **store enhancer** 的东西来定制的。store enhancer 就像一个特殊版本的“ createStore ”，它添加了另一个包裹原始 Redux store 的层。然后，增强的 store 可以通过提供其自定义 store 的 `dispatch`、`getState` 和 `subscribe` 函数而不是原始版本来改变 store 的行为方式。

在本教程中，不会详细介绍“ store enhancers ”的实际工作原理——我们将重点介绍如何使用它们。

### 使用 Enhancers 创建 Store

我们的项目在 `src/exampleAddons/enhancers.js` 文件中有两个小示例 `store enhancers` 可用：

- `sayHiOnDispatch`: enhancer，每次 dispatched 一个 action 时总是将`'Hi'！`记录到控制台
- `includeMeaningOfLife`: enhancer 总是将字段 `meaningOfLife: 42` 添加到 `getState()` 返回值中

让我们从使用 `sayHiOnDispatch` 开始。 首先，我们将其导入，并将其传递给`createStore`：

```js title="src/store.js"
import { createStore } from 'redux'
import rootReducer from './reducer'
import { sayHiOnDispatch } from './exampleAddons/enhancers'

const store = createStore(rootReducer, undefined, sayHiOnDispatch)

export default store
```

这里没有 `preloadedState` 值，所以我们将传递 `undefined` 作为第二个参数。

接下来，尝试下 dispatch 一个 action：

```js title="src/index.js"
import store from './store'

// highlight-start
console.log('Dispatching action')
store.dispatch({ type: 'todos/todoAdded', payload: 'Learn about actions' })
console.log('Dispatch complete')
// highlight-end
```

现在看看控制台。你应该会看到在其他两个日志语句之间记录的 “`Hi！`”：

![sayHi store enhancer 日志](/img/tutorials/fundamentals/sayhi-enhancer-logging.png)

`sayHiOnDispatch` enhancer 用自己的专用版本 `dispatch` 包装了原始的 `store.dispatch` 函数。 当我们调用 `store.dispatch()` 时，我们实际上是从 `sayHiOnDispatch` 调用包装函数，它调用原始函数然后打印 'Hi'。

现在，我们尝试添加第二个 enhancer。我们可以从同一个文件中导入 “includeMeaningOfLife”…… 但是有一个问题。**`createStore` 只接受一个 enhancer 作为它的第三个参数！** 我们如何同时传递 _两个_ enhancer？

我们真正需要的是使用某种方法将 `sayHiOnDispatch` enhancer 和 `includeMeaningOfLife` enhancer 合并为一个组合 enhancer，然后将其传递。

幸运的是，**Redux 核心包含一个[ `compose` 函数](../../api/compose.md)，可用于将多个 enhancer 合并在一起**。 让我们在这里使用它：

```js title="src/store.js"
// highlight-next-line
import { createStore, compose } from 'redux'
import rootReducer from './reducer'
import {
  sayHiOnDispatch,
  includeMeaningOfLife
} from './exampleAddons/enhancers'

// highlight-next-line
const composedEnhancer = compose(sayHiOnDispatch, includeMeaningOfLife)

// highlight-next-line
const store = createStore(rootReducer, undefined, composedEnhancer)

export default store
```

我们可以看看使用这个 store 会发生什么：

```js title="src/index.js"
import store from './store'

store.dispatch({ type: 'todos/todoAdded', payload: 'Learn about actions' })
// log: 'Hi!'

console.log('State after dispatch: ', store.getState())
// log: {todos: [...], filters: {status, colors}, meaningOfLife: 42}
```

记录的输出如下所示：

![meaningOfLife store enhancer 日志记录](/img/tutorials/fundamentals/meaningOfLife-enhancer-logging.png)

因此，我们可以看到两个 enhancer 同时修改了 store 的行为。`sayHiOnDispatch` 改变了 `dispatch` 的工作方式，而 `includeMeaningOfLife` 改变了 `getState` 的工作方式。

Store enhancers 是一种非常强大的修改 store 的方法，几乎所有的 Redux 应用程序在设置 store 时都会包含至少一个 enhancer。

:::tip

如果你没有任何要传入的 `preloadedState`，则可以将 `enhancer` 作为第二个参数传递：

```js
const store = createStore(rootReducer, storeEnhancer)
```

:::

## Middleware

Enhancers 非常强大，因为其可以覆盖或替换 store 的任何方法：`dispatch`、`getState` 和 `subscribe`。

但是，很多时候，我们只需要自定义 `dispatch` 的行为方式。 如果有一种方法可以在 `dispatch` 运行时添加一些自定义行为，那就太好了。

Redux 使用一种称为 **middleware** 的特殊插件来让我们自定义 `dispatch` 函数。

如果你曾经使用过 Express 或 Koa 之类的库，那么你可能已经熟悉添加 middleware 来自定义行为的想法。在这些框架中，middleware 是你可以放置在接收请求和生成响应之间的一些代码。例如，Express 或 Koa middleware 可能会添加 CORS 标头、日志记录、压缩等。middleware 的最大特点是它可以组合成一个链。你可以在单个项目中使用多个独立的第三方 middleware。

Redux middleware 解决了与 Express 或 Koa middleware 不同的问题，但在概念上是以相似的方式。**Redux middleware 在 dispatch action 和到达 reducer 之间提供第三方扩展点。** 人们使用 Redux middleware 进行日志记录、崩溃报告、异步 API 通信、路由等。

首先，我们将了解如何将 middleware 添加到 store 中，然后将展示如何编写自己的 middleware。

### 使用 Middleware

你可以使用 store enhancers 自定义 Redux store。Redux Middleware 实际上是在 Redux 内置的一个非常特殊的 store enhancer 之上实现的，称为 **`applyMiddleware`**。

由于我们已经知道如何将 enhancers 添加到 store，现在应该能够做到这一点。我们将从 `applyMiddleware` 本身开始，将添加三个已包含在此项目中的示例 middleware。

```js title="src/store.js"
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducer'
import { print1, print2, print3 } from './exampleAddons/middleware'

const middlewareEnhancer = applyMiddleware(print1, print2, print3)

// 将 enhancer 为第二参数，因为没有 preloadedState
const store = createStore(rootReducer, middlewareEnhancer)

export default store
```

正如他们的名字一样，当 dispatch 一个 action 时，这些 middleware 中的每一个都会打印一个数字。

如果现在发送会发生什么呢？

```js title="src/index.js"
import store from './store'

store.dispatch({ type: 'todos/todoAdded', payload: 'Learn about actions' })
// log: '1'
// log: '2'
// log: '3'
```

我们可以在控制台中看到输出：

![输出 middleware 日志](/img/tutorials/fundamentals/print-middleware-logging.png)

那么这是如何工作的呢？

**Middleware 围绕 store 的 `dispatch` 方法形成管线**。当我们调用 store.dispatch(action) 时，_实际上_ 调用了管线中的第一个 Middleware。 然后，该 Middleware 可以在看到该操作时做任何它想做的事情。通常，Middleware 会检查 action 是否是它关心的特定 type，就像 reducer 一样。如果它是匹配到的 type，Middleware 可能会运行一些自定义逻辑。否则，它将 dispatch 传递给管线中的下一个 Middleware。

_不像_ reducer，**middleware 内部可能有副作用**，包括超时和其他异步逻辑。

在这种情况下，action 通过：

1. `print1` middleware（我们将其视为 `store.dispatch`）
2. `print2` middleware
3. `print3` middleware
4. 原来的 `store.dispatch`
5. `store` 中的根 reducer

而且由于这些都是函数调用，它们都从该调用堆栈中 _返回_。因此，`print1` middleware 是第一个运行的，也是最后一个完成的。

### 编写自定义 Middleware

我们也可以编写自己的 Middleware。你可能不需要一直这样做，但自定义 Middleware 是向 Redux 应用程序添加特定行为的好方法。

**Redux middleware 被编写为一系列的三个嵌套函数**。让我们看看这种模式是什么样子的。我们将首先尝试使用 `function` 关键字编写这个 middleware，以便更清楚发生了什么

```js
// 使用 ES5 function 来编写 Middleware

// 外层 function:
function exampleMiddleware(storeAPI) {
  return function wrapDispatch(next) {
    return function handleAction(action) {
      // 在这里做任何事情：用 next(action) 向前传递 action，
      // 或者使用 storeAPI.dispatch(action) 重启管线
      // 这里也可以使用 storeAPI.getState()

      return next(action)
    }
  }
}
```

让我们分解这三个函数的作用以及它们的参数是什么。

- `exampleMiddleware`：外层函数其实就是 “middleware” 本身。它将被 `applyMiddleware` 调用，并接收包含 store 的 `{dispatch, getState}` 函数的 `storeAPI` 对象。这些是相同的 `dispatch` 和 `getState` 函数，它们实际上是 store 的一部分。如果你调用这个 `dispatch` 函数，它会将 action 发送到 middleware 管线的 _start_。这只会被调用一次。
- `wrapDispatch`：中间函数接收一个名为 `next` 的函数作为其参数。这个函数实际上是管线中的 _next middleware_。如果这个 middleware 是序列中的最后一个，那么 `next` 实际上是原始的 `store.dispatch` 函数。调用 `next(action)` 会将 action 传递给管线中的 _next_ middleware。这也只调用一次
- `handleAction`：最后，内部函数接收当前的 `action` 作为其参数，并在 _每次_ dispatch action 时调用。

:::tip

你可以为这些 middleware 函数指定任何你想要的名称，使用这些名称有助于记住每个函数的作用：

- Outer: `someCustomMiddleware` (或任何你的 middleware )
- Middle: `wrapDispatch`
- Inner: `handleAction`

:::

因为这些是普通函数，我们也可以使用 ES6 箭头函数来编写它们。这让我们可以把它们写得更短，因为箭头函数不必有一个 `return` 语句，但如果你还不熟悉箭头函数和隐式返回，它也可能会有点难以阅读。

这是与上面相同的示例，使用箭头函数：

```js
const anotherExampleMiddleware = storeAPI => next => action => {
  // 当每个 action 都被 dispatch 时，在这里做一些事情

  return next(action)
}
```

我们仍然将这三个函数嵌套在一起，并返回每个函数。隐式返回使这更短。

### 你的第一个自定义 Middleware

假设我们想向的应用程序添加一些日志记录。我们希望在 dispatch 每个 action 时在控制台中看到它的内容，并且能够看到在 reducer 处理完 action 之后的 state。

:::info

这些示例 middleware 并不是实际 todo 应用程序的特定部分，但你可以尝试将它们添加到项目中，看看使用它们时会发生什么。

:::

我们可以编写一个小型 middleware，将这些信息记录到控制台：

```js
const loggerMiddleware = storeAPI => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', storeAPI.getState())
  return result
}
```

每当 dispatch 一个 action 时：

- `handleAction` 函数的第一部分运行，我们打印 `'dispatching'`
- 我们将 action 传递给 `next` 部分，它可能是另一个 middleware 或真正的 `store.dispatch`
- 最终 reducer 运行并更新 state，并且 `next` 函数返回
- 我们现在可以调用 `storeAPI.getState()` 并查看新 state 是什么
- 最后，我们返回来自 `next` middleware 的任何 `result` 值

任何 middleware 都可以返回任何值，并且当你调用 store.dispatch() 时，管线中第一个 middleware 的返回值实际上是返回的。例如：

```js
const alwaysReturnHelloMiddleware = storeAPI => next => action {
  const originalResult = next(action);
  // 忽略原始结果，返回其他内容
  return 'Hello!'
}

const middlewareEnhancer = applyMiddleware(alwaysReturnHelloMiddleware)
const store = createStore(rootReducer, middlewareEnhancer)

const dispatchResult = store.dispatch({type: 'some/action'})
console.log(dispatchResult)
// log: 'Hello!'
```

让我们再试一个例子。Middleware 通常会寻找一个特定的 action，然后在该 action 被 dispatch 时做一些事情。Middleware 也有能力在里面运行异步逻辑。我们可以编写一个 middleware，当它匹配到某个 action 时，它会延迟打印一些东西：

```js
const delayedMessageMiddleware = storeAPI => next => action => {
  if (action.type === 'todos/todoAdded') {
    setTimeout(() => {
      console.log('Added a new todo: ', action.payload)
    }, 1000)
  }

  return next(action)
}
```

该 middleware 将寻找 “todo added” 的 action。每次匹配到一个，它都会设置一个 1 秒的计时器，然后将 action 的有效负载打印到控制台。

### Middleware 用例

所以我们可以用中间件做很多事！

当一个 middleware 遇到 dispatch 一个 action 时，它可以做到任何想做的事：

- 将某些内容记录到控制台
- 设置定时
- 进行异步 API 调用
- 修改 action
- 暂停 action，甚至完全停止

以及你能想到的任何其他事情。

特别的是，**middleware _旨在_ 包含具有副作用的逻辑**。此外，**middleware 可以修改 `dispatch` 来接受 _不是_ 普通 action 对象**的东西。我们将在 [第六节：异步逻辑](./part-6-async-logic.md) 中详细讨论这两个方面。

## Redux DevTools

最后，配置 store 还有一件非常重要的事情。

**Redux 专门设计用于更容易理解你的 state 何时、何地、为何以及如何随时间变化**。作为其中的一部分，Redux 的构建是为了支持使用一个插件 **Redux DevTools**，它向你显示 dispatch 了哪些 action 的历史记录，这些操作包含什么，以及在每个 dispatch action 之后 state 如何变化。

Redux DevTools UI 可作为 [Chrome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) 和 [Firefox](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/）的拓展使用。如果你尚未将其添加到浏览器中，请尽快添加拓展。

安装后，打开浏览器的 DevTools 窗口。你现在应该在那里看到一个新的 “Redux” 选项卡。它还没有做任何事情 —— 必须先设置其与 Redux store 连通。

### 将 DevTools 添加到 Store

安装扩展后，我们需要配置 store，以便 DevTools 可以看到里面发生了什么。DevTools 需要添加特定的 store enhancer 才能实现这一点。

[Redux DevTools Extension docs](https://github.com/reduxjs/redux-devtools/tree/main/extension) 有一些关于如何设置 store 的说明，只是列出的步骤有点复杂。但是，有一个名为 “redux-devtools-extension” 的 NPM 包可以处理复杂的部分。该包导出了一个专门的 `composeWithDevTools` 函数，我们可以使用它来代替原始的 Redux `compose` 函数。

看起来是这样的：

```js title="src/store.js"
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducer'
import { print1, print2, print3 } from './exampleAddons/middleware'

const composedEnhancer = composeWithDevTools(
  // 示例：在此处添加你实际要使用的任何 middleware
  applyMiddleware(print1, print2, print3)
  // 其他 store enhancers（如果有）
)

const store = createStore(rootReducer, composedEnhancer)
export default store
```

确保 `index.js` 在导入 store 后仍在 dispatch action。现在，在浏览器的 DevTools 窗口中打开 Redux DevTools 选项卡。你应该会看到如下所示的内容：

![Redux DevTools Extension: action tab](/img/tutorials/fundamentals/devtools-action-tab.png)

左侧有一个已 dispatch 的 action 列表。如果我们单击其中一个，右窗格会显示几个选项卡：

- 该操作对象的内容 （The contents of that action object）
- 在 reducer 运行后，整个 Redux 状态 （The entire Redux state as it looked after the reducer ran）
- 前一个 state 和这个 state 之间的差异 （The diff between the previous state and this state）
- 如果启用，函数堆栈跟踪会返回到首先调用 `store.dispatch()` 的代码行 （If enabled, the function stack trace leading back to the line of code that called `store.dispatch()` in the first place）

这是我们发送 “add todo” action 后 state 和 diff 选项卡的样子：

![Redux DevTools Extension: state tab](/img/tutorials/fundamentals/devtools-state-tab.png)

![Redux DevTools Extension: diff tab](/img/tutorials/fundamentals/devtools-diff-tab.png)

这些是非常强大的工具，可以帮助我们 dispatch 应用程序并准确了解内部发生的事情。

## 你学到了

如你所见，store 是每个 Redux 应用程序的核心部分。Stores 通过运行 reducer 包含 state 和句柄 action，并且可以添加其他自定义 action。

让我们看看示例应用程序现在的样子：

<iframe
  class="codesandbox"
  src="https://codesandbox.io/embed/github/reduxjs/redux-fundamentals-example-app/tree/checkpoint-2-storeSetup/?fontsize=14&hidenavigation=1&theme=dark&module=%2Fsrc%2Fstore.js&runonclick=1"
  title="redux-fundamentals-example-app"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

提醒一下，这就是我们在本节中介绍的内容：

:::tip 总结

- **Redux 应用程序始终只有一个 store**
  - 使用 Redux `createStore` API 创建 store
  - 每个 store 都有一个独立的根 reducer 方法
- **Stores 主要有三种方法**
  - `getState` 返回当前 state
  - `dispatch` 向 reducer 发送一个 action 来更新 state
  - `subscribe` 接受一个监听器回调，该回调在每次 dispatch action 时运行
- **Store enhancers 让我们能够在创建 store 时进行自定义操作**
  - Enhancers 包装了 store 并且可以覆盖它的方法
  - `createStore` 接受一个 enhancer 作为参数
  - 可以使用 `compose` API 将多个 enhancers 合并在一起
- **Middleware 是自定义 store 的主要方式**
  - 使用 `applyMiddleware` enhancer 添加 middleware
  - Middleware 被写成三个相互嵌套的函数
  - 每次 dispatch action 时都会运行 middleware
  - Middleware 内部可能有副作用
- **Redux DevTools 可让你查看应用程序随时间发生的变化**
  - DevTools 扩展可以安装在你的浏览器中
  - Store 需要添加 DevTools enhancer，使用 `composeWithDevTools`
  - DevTools 显示已 dispatch action 和 state 随时间的变化

:::

## 下一步

我们现在有一个可以运行的 Redux store，它可以运行我们的 reducer 并在我们 dispatch action 时更新 state。

但是，每个应用程序都需要一个用户界面来显示数据并让用户做一些有用的事情。 在 [第五节：UI 和 React](./part-5-ui-and-react.md) 中，我们将了解 Redux store 如何与 UI 一起工作，并具体了解 Redux 如何与 React 一起工作。
