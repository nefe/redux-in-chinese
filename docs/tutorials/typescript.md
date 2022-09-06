---
id: typescript-quick-start
title: TypeScript 快速开始
sidebar_label: TypeScript 快速开始
---

# Redux Toolkit TypeScript 快速开始

:::tip 你将学到什么

- 如何通过 TypeScript 设置和使用 Redux Toolkit 和 React-Redux

:::

:::info 先决条件

- React [Hooks]相关知识(https://reactjs.org/docs/hooks-intro.html)
- 理解 [Redux 术语和概念](https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow)
- 了解 TypeScript 语法和概念

:::

## 介绍

欢迎来到 Redux Toolkit TypeScript 快速入门教程！ **本教程将简要展示如何将 TypeScript 与 Redux Toolkit 一起使用**。

本页重点介绍如何设置 TypeScript 相关的方面。 了解 Redux 是什么、它是如何工作的以及如何使用 Redux Toolkit 的完整示例, [请参阅“教程索引”页面中链接的教程。](./tutorials-index.md).

Redux Toolkit 已经用 TypeScript 编写，所以它的 TS 类型定义是内置的。

[React Redux](https://react-redux.js.org) 在 NPM 上有一个单独的 [`@types/react-redux` 类型定义包](https://npm.im/@types/react-redux)有它的类型定义。除了引入类型库函数之外，这些类型还导出了一些帮助器，以便更轻松地在 Redux 存储 store 和 React 组件之间编写类型安全的接口。

从 React Redux v7.2.3, `react-redux` 包依赖于`@types/react-redux`, 因此类型定义将与库一起自动安装。 除非，你需要自己手动安装它们（通常是 `npm install @types/react-redux` ）。

[Create-React-App 的 Redux+TS 模板](https://github.com/reduxjs/cra-template-redux-typescript) 附带了已配置的这些模式的工作示例。

## 启动项目

### 定义根 State 和 Dispatch 类型

[Redux Toolkit's `configureStore` API](https://redux-toolkit.js.org/api/configureStore) 不需要任何额外的类型。 但是，您需要提取 `RootState` 类型和 `Dispatch` 类型。以便可以根据需要引用它们。从 store 本身推断这些类型，意味着它们会随着您添加更多状态切片或修改中间件设置而正确更新。

因为有了这些是类型定义，可以安全地直接从你的 store 设置文件（例如 `app/store.ts`）导出它们，然后将它们直接导入其他文件。

```ts title="app/store.ts"
import { configureStore } from '@reduxjs/toolkit'
// ...

const store = configureStore({
  reducer: {
    posts: postsReducer,
    comments: commentsReducer,
    users: usersReducer
  }
})

// highlight-start
// 从 store 本身推断出 `RootState` 和 `AppDispatch` 类型
export type RootState = ReturnType<typeof store.getState>
// 推断出类型: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
// highlight-end
```

### 定义 Hooks 类型

虽然可以将 `RootState` 和 `AppDispatch` 类型导入每个组件, **最好创建类型版本的 `useDispatch` 和 `useSelector` 钩子以便在您的应用程序中使用** 有几个重要的原因：

- 对于`useSelector`，它节省了你每次输入`(state: RootState)`的需要
- 对于 useDispatch，默认的 Dispatch 类型不知道 thunk。为了正确调度 thunk，您需要使用 store 中包含 thunk 中间件类型的特定自定义 `AppDispatch` 类型，并将其与 `useDispatch` 一起使用。添加一个预先输入的 `useDispatch` 钩子可以防止你忘记在需要的地方导入 `AppDispatch`。

由于这些是实际变量，而不是类型，因此将它们定义在单独的文件中很重要，例如 `app/hooks.ts`，而不是 store 设置文件。这允许您将它们导入到需要使用挂钩的任何组件文件中，并避免潜在的循环导入依赖问题。

```ts title="app/hooks.ts"
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// highlight-start
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
// highlight-end
```

## 应用程序中使用

### 定义 slice state 和 action 类型

每个 slice 文件都应该为其初始 state 定义一个类型，以便`createSlice` 可以在每种情况下正确推断`state` 的类型 reducer。

所有生成的动作都应该使用 Redux Toolkit 中的 `PayloadAction<T>` 类型定义，该类型将 `action.payload` 字段的类型作为其通用参数。

您可以从此处的 store 文件中安全地导入 `RootState` 类型。这是一个循环导入，但 TypeScript 编译器可以正确处理类型。 这对于编写选择器函数等用例可能是必需的。

```ts title="features/counter/counterSlice.ts"
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

// highlight-start
// 为 slice state 定义一个类型
interface CounterState {
  value: number
}

// 使用该类型定义初始 state
const initialState: CounterState = {
  value: 0
}
// highlight-end

export const counterSlice = createSlice({
  name: 'counter',
  // `createSlice` 将从 `initialState` 参数推断 state 类型
  initialState,
  reducers: {
    increment: state => {
      state.value += 1
    },
    decrement: state => {
      state.value -= 1
    },
    // highlight-start
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
      // highlight-end
      state.value += action.payload
    }
  }
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.counter.value

export default counterSlice.reducer
```

生成的 action creator 将根据你为 reducer 提供的 `PayloadAction<T>` 类型来校验 `payload` 参数类型的正确性。例如，`incrementByAmount` 需要一个“数字”作为其参数。

在某些情况下，[TypeScript 可能会对初始 state 进行不必要的类型收束](https://github.com/reduxjs/redux-toolkit/pull/827). 如果发生这种情况，你可以通过使用 `as` 转换初始 state 来解决它，而不是声明变量的类型：

```ts
// 解决方法：强制转换 state 而不是声明变量类型
const initialState = {
  value: 0
} as CounterState
```

### Use Typed Hooks in Components

In component files, import the pre-typed hooks instead of the standard hooks from React-Redux.

```tsx title="features/counter/Counter.tsx"
import React from 'react'

// highlight-next-line
import { useAppSelector, useAppDispatch } from 'app/hooks'

import { decrement, increment } from './counterSlice'

export function Counter() {
  // highlight-start
  // `state` 参数已正确推断为 `RootState` 类型
  const count = useAppSelector(state => state.counter.value)
  const dispatch = useAppDispatch()
  // highlight-end

  // omit rendering logic
}
```

### Full Counter App Example

Here's the complete TS counter application as a running CodeSandbox:

<iframe
  class="codesandbox"
  src="https://codesandbox.io/embed/github/reduxjs/redux/tree/master/examples/counter-ts/?fontsize=14&hidenavigation=1&module=%2Fsrc%2Ffeatures%2Fcounter%2FcounterSlice.ts&theme=dark&runonclick=1"
  title="redux-counter-ts-example"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

## What's Next?

See [the "Usage with TypeScript" page](../usage/UsageWithTypescript.md) for extended details on how to use Redux Toolkit's APIs with TypeScript.
