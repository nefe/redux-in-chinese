---
id: quick-start
title: 快速开始
sidebar_label: 快速开始
---

# Redux Toolkit 快速开始

:::tip 你将学习到什么

- 如何通过 React-Redux 设置和使用 Redux Toolkit

:::

:::info 先决条件

- 熟悉 [ES6 语法和特性](https://www.taniarascia.com/es6-syntax-and-feature-overview/)
- React 术语知识: [JSX](https://reactjs.org/docs/introducing-jsx.html), [State](https://reactjs.org/docs/state-and-lifecycle.html), [Function Components, Props](https://reactjs.org/docs/components-and-props.html), and [Hooks](https://reactjs.org/docs/hooks-intro.html)
- 理解[Redux 术语和概念](https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow)

:::

## 介绍

欢迎来到 Redux Toolkit 快速开始教程! **本教程会向你简要介绍 Redux Tookit 并且教你如何开始正确使用它**

### 如何阅读该教程

本页将聚焦于如何通过 Redux Toolkit 以及你将使用到的主要 APIs 来设置一个 Redux 应用。了解 Redux 是什么，它是如何工作的以及如何使用 Redux Toolkit 的完整示例的说明，[请参阅“教程索引”页面中链接的教程](./tutorials-index.md).

对于本教程，我们假设您将 Redux Toolkit 与 React 一起使用，但您也可以将其与其他 UI 层一起使用。 这些示例是基于[典型的 Create-React-App 文件夹结构](https://create-react-app.dev/docs/folder-structure)所有应用的代码都在 `src` 中，但这些模式可以适应您正在使用的任何项目或文件夹设置。

[Create-React-App 的 Redux+JS 模版](https://github.com/reduxjs/cra-template-redux)已经配置了相同的项目设置。

## 使用总结

### 安装 Redux Toolkit 和 React-Redux

添加 Redux Toolkit 和 React-Redux 依赖包到你的项目中：

```sh
npm install @reduxjs/toolkit react-redux
```

### 创建一个 Redux Store

创建一个名为 `src/app/store.js` 文件。从 Redux Toolkit 引入 `configureStore` API。我们从创建一个空的 Redux store 开始，并且导出它:

```js title="app/store.js"
import { configureStore } from '@reduxjs/toolkit'

export default configureStore({
  reducer: {}
})
```

创建完 Redux store，也自动配置了 Redux DevTools 插件，以便你可以在开发时进行检查 store 。

### 为 React 提供 Redux Store

一旦 store 创建后，我们可以使它为我们的 React 组件可用，将 React-Redux `<Provider>` 放置在 `src/index.js` 中的应用周围。引入 我们刚刚创建的 Redux store ，在你的 <App> 周围放置一个 <Provider>，并将 store 作为 prop 传递：

```js title="index.js"
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
// highlight-start
import store from './app/store'
import { Provider } from 'react-redux'
// highlight-end

ReactDOM.render(
  // highlight-next-line
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

### 创建一个 Redux 状态切片

添加一个名为 `src/features/counter/counterSlice.js` 的文件。在该文件中从 Redux Toolkit 引入 `createSlice` API。

创建切片需要一个字符串名称来标识切片、一个初始状态值以及一个或多个定义了该如何更新 state reducer 函数。一旦一个 slice 被创建，我们可以导出生成的 Redux action creators 和整个切片的 reducer 函数。

Redux 要求[我们通过创建数据副本和更新数据副本来不可变地写入所有状态更新](https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow#immutability)。然而，Redux Toolkit `createSlice` 和 `createReducer` 在内部使用 Immer 允许我们[编写“可变”的更新逻辑，变成正确的不可变更新](https://redux.js.org/tutorials/fundamentals/part-8-modern-redux#immutable-updates-with-immer)。

```js title="features/counter/counterSlice.js"
import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0
  },
  reducers: {
    increment: state => {
      // Redux Toolkit 允许我们在 reducers 写 "可变" 逻辑。它
      // 并不少真正的改变 state 值，因为它使用了 Immer 库
      // 可以检测到一个草稿 state 的变化并且生产一个全新的
      // 不可变 state 是基于这些变化
      state.value += 1
    },
    decrement: state => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    }
  }
})
// 每个场景下的 reducer 函数 生成对应的 Action creators
export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default counterSlice.reducer
```

### 将 Slice Reducers 添加到 Store

下一步，我们需要从计数切片中引入 reducer 函数，并将它添加到我们的 store 中。通过在 reducer 参数中定义一个字段，我们告诉 store 使用这个 slice reducer 函数来处理对该状态的所有更新。

```js title="app/store.js"
import { configureStore } from '@reduxjs/toolkit'
// highlight-next-line
import counterReducer from '../features/counter/counterSlice'

export default configureStore({
  reducer: {
    // highlight-next-line
    counter: counterReducer
  }
})
```

### 在 React 组件中使用 Redux 状态和操作

现在我们可以使用 React-Redux 钩子让 React 组件与 Redux store 交互。我们可以使用 `useSelector` 从 store 中读取数据，
使用 `useDispatch` 派发动作。创建一个包含 `<Counter>` 组件的 `src/features/counter/Counter.js` 文件，然后将该组件导入 `App.js` 并在 `<App>` 中渲染它。

```jsx title="features/counter/Counter.js"
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from './counterSlice'
import styles from './Counter.module.css'

export function Counter() {
  const count = useSelector(state => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  )
}
```

Now, any time you click the "Increment" and "Decrement" buttons:
现在，每当你点击”递增“和“递减”按钮。

- 对应的 Redux action 会被派发到 store

* 计数器切片对应的 reducer 将看到动作并更新其状态
* `<Counter>`组件将从 store 中看到新的状态，并使用新数据重新渲染组件。

## 你学到了什么

这是关于如何通过 React 设置和使用 Redux Toolkit 的简要概述。 回顾细节：

:::tip Summary

- **使用`configureStore`创建一个 Redux store**
  - `configureStore` 接受 `reducer` 函数作为命名参数
  - `configureStore` 使用的好用的默认设置自动设置 store
- **为 React 应用程序组件提供 Redux store**
  - 在你的 `<App />` 周围放置一个 React-Redux `<Provider>` 组件
  * 传递 Redux store 如 `<Provider store={store}>`
- **使用 `createSlice` 创建一个 Redux "slice" reducer**
  - 使用字符串名称、一个初始状态和命名的 reducer 函数调用“createSlice”
  * Reducer 函数可以使用 Immer 来“改变”状态
  * 导出生成的 slice reducer 和 action creators
- **在 React 组件中使用 React-Redux `useSelector/useDispatch` 钩子**
  - 使用 `useSelector` 钩子从 store 中读取数据
  * 使用 `useDispatch` 钩子获取 `dispatch` 函数，并根据需要派发 actions

:::

### 完整的计数器应用示例

这里有运行在 CodeSandbox 完整的计数器应用程序

<iframe
  class="codesandbox"
  src="https://codesandbox.io/embed/github/reduxjs/redux-essentials-counter-example/tree/master/?fontsize=14&hidenavigation=1&module=%2Fsrc%2Ffeatures%2Fcounter%2FcounterSlice.js&theme=dark&runonclick=1"
  title="redux-essentials-example"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

## 下一步是什么

我们建议阅读 [**Redux 核心文档中的“Redux 要点”和“Redux 基础知识”教程**](./tutorials-index.md), 这将使您全面了解 Redux 的工作原理、Redux Toolkit 的作用以及如何正确使用它。
