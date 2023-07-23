---
id: why-rtk-is-redux-today
title: 为什么 Redux Toolkit 是如今使用 Redux 的方式
description: '简介 > 为什么 RTK 是如今使用 Redux 的方式: 
详细介绍 RTK 如何替代 Redux 核心功能'
---

## 什么是 Redux Toolkit?

[**Redux Toolkit**](https://redux-toolkit.js.org) (也称为 **"RTK"** ) 是我们官方推荐的编写 Redux 逻辑的方法。`@reduxjs/toolkit` 包封装了核心的 `redux` 包，包含我们认为构建 Redux 应用所必须的 API 方法和常用依赖。 Redux Toolkit 集成了我们建议的最佳实践，简化了大部分 Redux 任务，阻止了常见错误，并让编写 Redux 应用程序变得更容易。

**如果今天你要写任何的 Redux 逻辑，你都应该使用 Redux Toolkit 来编写代码**

RTK 包括一些实用程序，可以帮助简化许多常见的用例，包括 [配置 Redux store](https://redux-toolkit.js.org/api/configureStore)、
[创建 reducer 函数并使用不可变更新逻辑](https://redux-toolkit.js.org/api/createreducer)
和 [一次性创建状态的某个"片段"（slice）](https://redux-toolkit.js.org/api/createslice)。

无论你是刚接触 Redux 的新用户正在设计你的第一个项目，还是已有经验的用户想简化一个现有的应用，**[Redux Toolkit](https://redux-toolkit.js.org/)** 都能够帮助你写出更好的 Redux 代码。

## Redux Toolkit 与 Redux 核心包有什么区别

### "Redux"是什么?

第一个需要问的问题是："Redux 是什么？"

Redux 实际上是:

- 包含全局状态的单一仓库
- 当应用中发生某些事情时，分发普通对象(plain object) 动作(action)给仓库
- Pure reducer 函数查看这些动作(action)并且返回不可更新的状态。

虽然并非必须，[你的 Redux 代码通常还包括](../tutorials/fundamentals/part-7-standard-patterns.md):

- 创建动作对象的 action creator 函数
- 启用副作用(side effect)能力的中间件
- 包含有副作用的同步或异步逻辑的 thunk 函数
- 能够按照 ID 查找元素的标准化状态
- 使用 Reselect 库优化创建的选择器函数
- 使用 Redux DevTools Extension 来查看动作历史记录和修改状态
- 使用 TypeScript 给动作、状态和其他的函数进行类型定义

此外，Redux 通常与 React-Redux 库一起使用让 React 组件可以访问 Redux store。

### Redux 核心包做了什么?

Redux 核心包是一个非常小、有意避免主观立场的库。它提供了一些小的 API 原语:

- `createStore` 实际创建一个 Redux 存储实例
- `combineReducers` 将多个 reducer 函数合并成为一个更大的 reducer
- `applyMiddleware` 将多个中间件组合成一个 store 增强器
- `compose` 将多个 store 增强器合并成一个单一的 store 增强器

除此以外，你应用中的所有其他与 Redux 相关的逻辑全需要你自己撰写。

好消息是，这意味着 Redux 能够以许多不同的方式使用。坏消息是，Redux 核心包不提供任何辅助函数来帮助你撰写任何代码。

例如，reducer 函数只不过是一个普通的函数。在 Redux Toolkit 之前，你通常会使用 switch 语句和手动更新 state 来编写 reducer。你通常还需要手写动作创建器函数和动作类型变量:

```js title="传统的手写 Redux 用法"
const ADD_TODO = 'ADD_TODO'
const TODO_TOGGLED = 'TODO_TOGGLED'

export const addTodo = text => ({
  type: ADD_TODO,
  payload: { text, id: nanoid() }
})

export const todoToggled = id => ({
  type: TODO_TOGGLED,
  payload: id
})

export const todosReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_TODO:
      return state.concat({
        id: action.payload.id,
        text: action.payload.text,
        completed: false
      })
    case TODO_TOGGLED:
      return state.map(todo => {
        if (todo.id !== action.payload.id) return todo

        return {
          ...todo,
          completed: !todo.completed
        }
      })
    default:
      return state
  }
}
```

这些代码不依赖于 Redux 库的任何 API。但是这样需要写很多样板代码。不可变更新需要很多手工编写的对象展开和数组操作，这很容易出错然后意外的修改状态（这是Redux bug 的首要原因）。将一个功能的代码分散到多个文件也很常见，虽然不是必须的。例如 `actions/todos.js`、 `constants/todos.js` 和 `reducers/todos.js`.

此外，配置 store 通常需要一系列步骤来添加常用的中间件，例如 thunk 和启用 Redux DevTools Extension 支持，尽管这些都是几乎每个 Redux 应用程序中使用的标准工具。

### Redux Toolkit 做了哪些事?

虽然这些确实是 Redux 文档中最早展示的模式，但不幸的是它们需要大量冗长重复的代码。这些样板模板代码在实现 Redux 功能上并不必要。最重要的是，这些样板代码会提供更多犯错的机会。

**我们特意创建 Redux Toolkit 来消除手写 Redux 逻辑中的「样板代码」，防止常见错误，并提供简化标准 Redux 任务的 API。**

Redux Toolkit 以两个关键的 API 开始，这简化了在每个 Redux 应用中常见的操作：

- `configureStore` 通过单个函数调用设置一个配置完善的 Redux store，包括合并 reducer、添加 thunk 中间件以及设置 Redux DevTools 集成。与 `createStore` 相比更容易配置，因为它接受命名选项参数。
- `createSlice` 让你使用 [Immer 库](https://immerjs.github.io/immer/) 来编写 reducer，可以使用 "mutating" JS 语法，比如 `state.value = 123`，不需要使用拓展运算符。 内部基于你的 reducer 名称生成 action type 字符串。最后，它在 TypeScript 中表现的很好。

这意味着您需要编写的代码可以大大简化。例如，相同的任务 reducer 可以如下：

```js title="features/todos/todosSlice.js"
import { createSlice } from '@reduxjs/toolkit'

const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    todoAdded(state, action) {
      state.push({
        id: action.payload.id,
        text: action.payload.text,
        completed: false
      })
    },
    todoToggled(state, action) {
      const todo = state.find(todo => todo.id === action.payload)
      todo.completed = !todo.completed
    }
  }
})

export const { todoAdded, todoToggled } = todosSlice.actions
export default todosSlice.reducer
```

所有的 action creators 和 action types 都自动生成了，reducer 代码也更短更易懂。在每个 case 中更清楚地展示了实际更新了哪些内容，整体逻辑也更为清晰。

使用 `configureStore`，可以将store的设置简化为：

```js title="app/store.js"
import { configureStore } from '@reduxjs/toolkit'
import todosReducer from '../features/todos/todosSlice'
import filtersReducer from '../features/filters/filtersSlice'

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    filters: filtersReducer
  }
})
```

注意，**此 `configureStore` 即可自动完成过去手动完成的常规配置工作**:

- slice reducers 自动传递给 `combineReducers()`
- 自动添加了 `redux-thunk` 中间件
- 添加了 Dev-mode 中间件来捕获意外的变更
- 自动设置了 Redux DevTools Extension
- 中间件和 DevTools 增强器被组合在一起添加到了 store 中

同时，**`configureStore` 提供了可选项，使用户能够修改这些默认行为** (如关闭 thunk 并添加 saga，或在生产环境中禁用 DevTools)，

另外，Redux Toolkit 还包括其他用于完成常见 Redux 任务的 API:

- `createAsyncThunk`: 抽象"异步请求前后分发 action"的模式
- `createEntityAdapter`: 提供预构建的 reducer 和 selector 用于管理规范化状态（normalized state）的 CRUD 操作
- `createSelector`: 重新导出标准的 Reselect API 用于构建 Memoized 选择器
- `createListenerMiddleware`: 一个副作用中间件，用于响应分发 action 时之行某些逻辑

最后，RTK 包还包含"RTK Query"，一个为 Redux 应用提供的完整的数据获取和缓存解决方案，作为独立的可选 `@reduxjs/toolkit/query` 入口。它允许你定义端点（REST，GraphQL或任何异步函数）并生成 reducer 和中间件来完整管理数据获取，加载状态更新和结果缓存。它还会自动生成 React hooks，可用于组件获取数据，比如 `const { data, isFetching} = useGetPokemonQuery('pikachu')`

这些 API 都是可选的，且每个 API 都是为特定的使用情况设计的，**你可以根据自己的需要在应用程序中自由选择使用哪些 API**。 但是，为了更好的完成这些任务，我们强烈建议您使用所有 API。

请注意，**Redux Toolkit 仍旧是 "Redux"！** 它仍然有一个单一的 store，使用分发动作对象进行更新，且具有变更状态的 reducer，此外还可以编写 thunk 来处理异步逻辑，管理规范化的状态，用 TypeScript 类型化代码，使用 DevTools。**只不过对于相同的结果你需要写更少的代码！**

## 为什么我们推荐使用 Redux Toolkit

作为 Redux 的维护者，我们的立场是：

:::提示

**我们认为所有使用 Redux 的开发者都应该使用 Redux Toolkit 来编写代码，因为它能简化你的代码的同时消除许多常见的 Redux 问题和 Bug！**

:::

早期 Redux 模式中的"样板代码"和复杂性从来就不是 Redux 不可或缺的一部分。这些模式存在的原因是：

- 早期"Flux 架构"也使用了这些相同的方法
- 早期的 Redux 文档中显示了像动作类型常量之类的东西，以便将代码根据类型划分到不同的文件中
- 由于 JavaScript 本质上是 mutable 语言，所以编写 immutable 的更新需要手动进行对象拓展和数组更新
- Redux 初始构建只花了几个星期的时间，故意设计为仅仅是一组基本的 API

此外，Redux 社区采用的一些特定方法会增加额外的样板代码：

- 推崇使用 `redux-saga` 中间件作为处理副作用的惯用方法
- 坚持手动书写 TypeScript 类型来为 Redux 操作对象添加类型，创建联合类型来在类型级别限制可以分发的动作

多年来，我们看到人们究竟如何在实际情况中使用 Redux。我们看到社区为生成操作类型、creators、异步逻辑、副作用和数据获取等任务编写了数百个插件库。我们还看到一直给我们的用户带来痛苦的问题，比如意外的改变状态，仅为让一个简单的状态更新而写了数十行代码、并且很难追踪代码库如何融合在一起。我们帮助过成千上万的用户在试图学习和使用 Redux 时感到困惑，难以理解所有部分如何契合，并且被需要编写的额外代码数量和必要理解的概念所困扰。我们**知道**我们的用户面临的问题。

**我们特别为解决这些问题设计了 Redux Toolkit！**

- Redux Toolkit 通过单一清晰的函数调用简化 store 设置，同时保留完全配置 store 选项的能力（如果需要的话）
- Redux Toolkit 消除意外的 mutations，这一直是 Redux bug 的首要原因
- Redux Toolkit 消除了手写任何 action creator 或 action type 的需求
- Redux Toolkit 消除了编写容易出错的手动不可变更新逻辑的需求
- Redux Toolkit 让你可以把 Redux 相关的代码全部放在一个文件中，而不是分布在多个独立文件中
- Redux Toolkit 提供优秀的 TypeScript 支持，其 API 被设计成可以给你很好的类型安全性，同时减少你代码中需要定义的类型数量
- RTK Query 可以消除编写任何 thunk、reducer、action creator 或者 副作用钩子来管理数据获取和跟踪加载状态的需求

正因为如此:

:::提示

**我们特别建议我们的用户使用 Redux Toolkit (`@reduxjs/toolkit` 包)，不建议在新的 Redux 代码中使用旧的 `Redux` 核心包！**

:::

即使对于现有的项目，我们也建议至少把 `createStore`替换为 `configureStore` 因为开发模式的中间件也将帮助您捕捉现有代码库中的意外变异和可序列化错误。我们还鼓励您将使用频率较高的（以及今后您编写的）reducer 切换到 `createSlice` - 代码更短更易懂，安全性提高也会帮助您将来节省时间和精力。

**`redux` 核心包仍然可以工作，但是今天来看我们认为它已经过时了**. 它的所有 API 也都从`@reduxjs/toolkit` 中进行了重新导出，并且 `configureStore` 函数可以完成 `createStore` 的所有工作，但是有着更好的默认行为和可配置性。

理解基础概念能够帮助你理解 Redux Toolkit 为你做了什么。这就是为什么 ["Redux 基础" 教程 没有任何抽象的展示了 Redux 的工作原理](../tutorials/fundamentals/part-1-overview.md). 但是，它展示的这些例子只能作为学习工具，并以展示 Redux Toolkit 如何简化旧的手写 Redux 代码来结束。

如果你目前正在使用且只是使用了 `redux` 包，你的代码仍然可以工作 **但是，我们强烈推荐你切换到 `@reduxjs/toolkit`，并更新你的代码来使用 Redux Toolkit 的 API**

## 更多信息

查看以下文档页面和博客文章了解更多细节

- [Redux 必备: Redux 应用结构](../tutorials/essentials/part-2-app-structure.md)
- [Redux 基础: 使用 Redux Toolkit 的现代 Redux](../tutorials/fundamentals/part-8-modern-redux.md)
- [Redux 风格指南: 最佳实践和建议](../style-guide/style-guide.md)
- [Mark Erikson: Redux Toolkit 1.0 公告和开发历史](https://blog.isquaredsoftware.com/2019/10/redux-toolkit-1.0/)
