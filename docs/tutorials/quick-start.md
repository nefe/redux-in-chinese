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

本页将聚焦于如何通过 Redux Toolkit 和你将使用的主要 APIs 来设置一个 Redux 应用。了解 Redux 是什么，它是如何工作的以及如何使用 Redux Toolkit 的完整示例的说明，[请参阅“教程索引”页面中链接的教程](./tutorials-index.md).

本教程，我们假设你正在使用 Redux Toolkit 和 React , 但是你也可以使用其他 UI 层。 这些示例是基于[典型的 Create-React-App 文件夹结构](https://create-react-app.dev/docs/folder-structure)所有应用的代码都在 `src` 中，但这些模式可以适应您正在使用的任何项目或文件夹设置。

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

一旦 store 创建后，我们可以使它变得为我们的 React 组件可用，将它传递给包裹了我们的应用的 React-Redux `<Provider>` 定义在 `src/index.js`。引入 我们刚刚创建的 Redux store ，传递给包裹你的`<App>`的 `<Provider>`， 并且传递给 store 的 prop。

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

### Add Slice Reducers to the Store

Next, we need to import the reducer function from the counter slice and add it to our store. By defining a field inside the `reducer` parameter, we tell the store to use this slice reducer function to handle all updates to that state.

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

### Use Redux State and Actions in React Components

Now we can use the React-Redux hooks to let React components interact with the Redux store. We can read data from the store with `useSelector`, and dispatch actions using `useDispatch`. Create a `src/features/counter/Counter.js` file with a `<Counter>` component inside, then import that component into `App.js` and render it inside of `<App>`.

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

- The corresponding Redux action will be dispatched to the store
- The counter slice reducer will see the actions and update its state
- The `<Counter>` component will see the new state value from the store and re-render itself with the new data

## What You've Learned

That was a brief overview of how to set up and use Redux Toolkit with React. Recapping the details:

:::tip Summary

- **Create a Redux store with `configureStore`**
  - `configureStore` accepts a `reducer` function as a named argument
  - `configureStore` automatically sets up the store with good default settings
- **Provide the Redux store to the React application components**
  - Put a React-Redux `<Provider>` component around your `<App />`
  - Pass the Redux store as `<Provider store={store}>`
- **Create a Redux "slice" reducer with `createSlice`**
  - Call `createSlice` with a string name, an initial state, and named reducer functions
  - Reducer functions may "mutate" the state using Immer
  - Export the generated slice reducer and action creators
- **Use the React-Redux `useSelector/useDispatch` hooks in React components**
  - Read data from the store with the `useSelector` hook
  - Get the `dispatch` function with the `useDispatch` hook, and dispatch actions as needed

:::

### Full Counter App Example

Here's the complete counter application as a running CodeSandbox:

<iframe
  class="codesandbox"
  src="https://codesandbox.io/embed/github/reduxjs/redux-essentials-counter-example/tree/master/?fontsize=14&hidenavigation=1&module=%2Fsrc%2Ffeatures%2Fcounter%2FcounterSlice.js&theme=dark&runonclick=1"
  title="redux-essentials-example"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

## What's Next?

We recommend going through [**the "Redux Essentials" and "Redux Fundamentals" tutorials in the Redux core docs**](./tutorials-index.md), which will give you a complete understanding of how Redux works, what Redux Toolkit does, and how to use it correctly.
