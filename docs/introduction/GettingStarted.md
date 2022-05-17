---
id: getting-started
title: '入门 Redux'
description: '简介 > 入门: 从这里开始学习和使用 Redux'
hide_title: false
---

# 入门 Redux

Redux 是 JavaScript 应用的状态容器，提供可预测的状态管理。

可以让你开发出行为稳定可预测的应用，运行于不同的环境（客户端、服务器、原生应用），并且易于测试。不仅于此，它还提供超爽的开发体验，比如有一个[时间旅行调试器可以编辑后实时预览](https://github.com/reduxjs/redux-devtools)。

Redux 除了和 React 一起用外，还支持其它界面库。它体小精悍（只有2kB，包括依赖），却有很强大的插件扩展生态。

## 安装

### Redux Toolkit

[**Redux Toolkit**](https://redux-toolkit.js.org) 是我们官方推荐的编写 Redux 逻辑的方法。它包含了 Redux 核心，并包含我们认为对于构建 Redux 应用必不可少的软件包和功能。Redux Toolkit 建立在我们建议的最佳实践中，简化了大多数 Redux 任务，防止了常见错误，并使编写 Redux 应用程序更加容易。

RTK 包含了有助于简化许多常见场景的工具，包括 [配置 Store](https://redux-toolkit.js.org/api/configureStore)，
[创建 reducer 并编写 immutable 更新逻辑](https://redux-toolkit.js.org/api/createreducer)，
甚至还包含 [一次性创建整个 State 的 “切面”](https://redux-toolkit.js.org/api/createslice)。

无论你是一个完全的新手想要开发第一个 Redux 应用，还是经验老到的老手想要简化已有应用，**[Redux Toolkit](https://redux-toolkit.js.org/)** 都能帮你写出更好的 Redux 代码.

Redux Toolkit 提供 NPM 软件包，安装方式如下：

```bash
# NPM
npm install @reduxjs/toolkit

# Yarn
yarn add @reduxjs/toolkit
```

### 创建一个 React Redux 应用

官方推荐的创建 React Redux 新应用的方式是使用 [官方 Redux+JS 模版](https://github.com/reduxjs/cra-template-redux)，它基于 [Create React App](https://github.com/facebook/create-react-app)，它利用了 **[Redux Toolkit](https://redux-toolkit.js.org/)** 和 Redux 与 React 组件的集成.

```sh
npx create-react-app my-app --template redux
```

### Redux 核心库

Redux 核心库同样有 NPM 软件包，安装方式如下：

```bash
# NPM
npm install redux

# Yarn
yarn add redux
```

还有一个使用方式是通过预编译的 UMD 包，定义了 `window.Redux` 这个全局变量。UMD 包可以通过 [`<script>` tag](https://unpkg.com/redux/dist/redux.js) 直接使用。

想要获取更多信息，查看 [安装](Installation.md).

## 基础示例

应用的整体全局状态以对象树的方式存放于单个 _store_。
唯一改变状态树（state tree）的方法是创建 _action_，一个描述发生了什么的对象，并将其 _dispatch_ 给 store。
要指定状态树如何响应 action 来进行更新，你可以编写纯 _reducer_ 函数，这些函数根据旧 state 和 action 来计算新 state。

```js
import { createStore } from 'redux'

/**
 * This is a reducer - a function that takes a current state value and an
 * action object describing "what happened", and returns a new state value.
 * A reducer's function signature is: (state, action) => newState
 *
 * The Redux state should contain only plain JS objects, arrays, and primitives.
 * The root state value is usually an object.  It's important that you should
 * not mutate the state object, but return a new object if the state changes.
 *
 * You can use any conditional logic you want in a reducer. In this example,
 * we use a switch statement, but it's not required.
 */
function counterReducer(state = { value: 0 }, action) {
  switch (action.type) {
    case 'counter/incremented':
      return { value: state.value + 1 }
    case 'counter/decremented':
      return { value: state.value - 1 }
    default:
      return state
  }
}

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
let store = createStore(counterReducer)

// You can use subscribe() to update the UI in response to state changes.
// Normally you'd use a view binding library (e.g. React Redux) rather than subscribe() directly.
// There may be additional use cases where it's helpful to subscribe as well.

store.subscribe(() => console.log(store.getState()))

// The only way to mutate the internal state is to dispatch an action.
// The actions can be serialized, logged or stored and later replayed.
store.dispatch({ type: 'counter/incremented' })
// {value: 1}
store.dispatch({ type: 'counter/incremented' })
// {value: 2}
store.dispatch({ type: 'counter/decremented' })
// {value: 1}
```

你需要使用 _action_ 这个普通对象来描述发生了什么，而不是直接改变 state。然后，编写一个名为 _reducer_ 的特殊函数，来决定如何基于 action 来更新整个应用的状态树。

在典型的Redux应用程序中，只有一个 store 以及一个根 reducer 函数。随着应用程序的增长，您可以将根 reducer 拆分为较小的 reducer，分别在状态树的不同部分上进行操作。这就像在 React 应用程序中只有一个根组件一样，但是它是由许多小组件组成的。

对于简单的计数器应用来说，这种架构看起来过度设计，但是这种模式的优点在于它可以很好地扩展到大型和复杂的应用程序。还可以基于此设计出功能非常强大的开发者工具，因为可以跟踪每个 action 以及状态变更。你可以记录用户会话并仅通过重播每个 action 来重现它们。

### Redux Toolkit 示例

Redux Toolkit 简化了编写 Redux 逻辑和设置 store 的过程。 使用 Redux Toolkit，相同的逻辑如下所示：

```js
import { createSlice, configureStore } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0
  },
  reducers: {
    incremented: state => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
    },
    decremented: state => {
      state.value -= 1
    }
  }
})

export const { incremented, decremented } = counterSlice.actions

const store = configureStore({
  reducer: counterSlice.reducer
})

// Can still subscribe to the store
store.subscribe(() => console.log(store.getState()))

// Still pass action objects to `dispatch`, but they're created for us
store.dispatch(incremented())
// {value: 1}
store.dispatch(incremented())
// {value: 2}
store.dispatch(decremented())
// {value: 1}
```

Redux Toolkit 使我们可以编写更精短的代码，更易于阅读，同时仍然遵循同样的 Redux 规范和数据流。

## 学习 Redux

我们有多种资源可帮助您学习Redux。

### Redux 基础教程

[**Redux 基础教程**](../tutorials/essentials/part-1-overview-concepts.md) 是一个“自上而下”的教程，使用推荐的最新 API 和最佳实践来教“如何以正确的方式使用 Redux”。建议从那里开始。

### Redux 进阶教程

[**Redux 进阶教程**](../tutorials/fundamentals/part-1-overview.md) 是一个“自下而上”的教程，该教程从最初的原理开始，没有任何抽象地讲授“Redux 工作原理”，以及 Redux 标准规范存在背后的原因。

### 附加教程

- Redux 仓库包含几个示例项目，展示了如何使用 Redux 的各个方面。几乎所有示例都具有对应的 CodeSandbox 案例。这是你可以在线使用的交互式代码平台。请参阅 **[案例页面](./Examples.md)**
- Redux 作者 Dan Abramov 的 **免费 ["Redux 入门" 视频系列](https://app.egghead.io/playlists/fundamentals-of-redux-course-from-dan-abramov-bd5cc867)** 和 **[Building React Applications with Idiomatic Redux](https://egghead.io/courses/building-react-applications-with-idiomatic-redux)** Egghead.io 上的视频教程
- Redux 维护者 Mark Erikson 的 **["Redux Fundamentals" 大会演讲](https://blog.isquaredsoftware.com/2018/03/presentation-reactathon-redux-fundamentals/)** and [**"Redux Fundamentals" 工作坊 PPT**](https://blog.isquaredsoftware.com/2018/06/redux-fundamentals-workshop-slides/)
- Dave Ceddia 的文章 [**面向初学者的完整 React Redux 教程**](https://daveceddia.com/redux-tutorial/)

### 其他资源

- **[Redux FAQ](../FAQ.md)** 包含了使用 Redux 的很多常见问题，**["技巧" 文档章节](../recipes/README.md)** 讲述了如何处理衍生数据、测试、组织 reducer 逻辑，和减少样板代码。
- Redux 维护者 Mark Erikson's **["Practical Redux" 系列教程](https://blog.isquaredsoftware.com/series/practical-redux/)** 演示了 React Redux 实际开发中用到的中级和高级技术，（也可以在 **[Educative.io 找到可交互的课程](https://www.educative.io/collection/5687753853370368/5707702298738688)**）。
- **[React/Redux 链接列表](https://github.com/markerikson/react-redux-links)** 对一系列链接做了分类，包括： [reducers and selectors](https://github.com/markerikson/react-redux-links/blob/master/redux-reducers-selectors.md)、[管理副作用](https://github.com/markerikson/react-redux-links/blob/master/redux-side-effects.md)、[Redux 架构和最佳实践](https://github.com/markerikson/react-redux-links/blob/master/redux-architecture.md) 等等。
- 我们的社区已经创建了数千个与 Redux 相关的库、插件和工具。 **["生态" 文档页面](./Ecosystem.md)** 列出了我们的推荐，这里还有一个更完整的列表：**[Redux addons catalog](https://github.com/markerikson/redux-ecosystem-links)**。

## 帮助和讨论

The **[#redux channel](https://discord.gg/0ZcbPKXt5bZ6au5t)** of the **[Reactiflux Discord community](https://www.reactiflux.com)** is our official resource for all questions related to learning and using Redux. Reactiflux is a great place to hang out, ask questions, and learn - come join us!

You can also ask questions on [Stack Overflow](https://stackoverflow.com) using the **[#redux tag](https://stackoverflow.com/questions/tagged/redux)**.

If you have a bug report or need to leave other feedback, [please file an issue on the Github repo](https://github.com/reduxjs/redux)

## 你需要使用 Redux 吗？

虽然 Redux 是一个很有价值的管理状态工具，但还是要考虑下它是否适合你的场景。**不要仅仅因为有人说过应该使用 Redux 而使用 - 应该花一些时间来了解使用它的潜在好处和取舍**。

当遇到如下问题时，建议开始使用 Redux：

- 你有很多数据随时间而变化
- 你希望状态有一个唯一确定的来源（single source of truth）
- 你发现将所有状态放在顶层组件中管理已不可维护

> **有关如何使用Redux的更多想法，请参见：**
>
> - **[Redux FAQ: 为什么要用 Redux？](../faq/General.md#when-should-i-use-redux)**
> - **[You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)**
>
> - **[Redux 之道，Part 1 - 实现和目的](https://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-1/)**
>
> - **[Redux 之道，Part 2 - 实践和原理](https://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-2/)**
> - **[Redux 常见问题](../FAQ.md)**
