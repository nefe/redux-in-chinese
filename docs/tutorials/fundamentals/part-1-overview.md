---
id: part-1-overview
title: 'Redux 深入浅出, 第一节: Redux 概览'
sidebar_label: 'Redux 概览'
hide_title: false
description: 'The official Fundamentals tutorial for Redux: learn the fundamentals of using Redux'
---

import { DetailedExplanation } from '../../components/DetailedExplanation'

# Redux 深入浅出, 第一节：Redux 概览

:::tip 您将学到

- Redux 是什么以及您为什么要使用 Redux 
- 构成 Redux 应用的基本部分

:::

## 简介

欢迎来到 Redux 深入浅出教程！**该教程会向您介绍使用 Redux 的核心概念、原则和模式**。当您学完后，您应该了解了构成一个 Redux 应用的不同部分、使用 Redux 时的数据流以及我们用于构建 Redux 应用的标准推荐模式。

在本教程的第一节，我们将简要介绍一个可工作的 Redux 应用的最小示例，以了解构成 Redux 应用的基本部分，在[第二节：Redux 概念与数据流](./part-2-concepts-data-flow.md)里我们会再来探讨这些构成部分的细节以及数据是怎样在 Redux 应用里流动的。

在[第三节: State, Actions, and Reducers](./part-3-state-actions-reducers.md)里，我们将利用已学知识构建一个小型的示例应用，演示这些构成部分是怎样组合在一起的，并在实践中讨论 Redux 的工作原理。在我们亲手敲完这个应用的代码后，我们应该确切知道该应用是怎样工作的。接着我们将讨论一些 Redux 标准模式和抽象的典型用法。最后，我们将看到示例里的初级（lower-level）用法如何转换为我们建议在实际应用程序中使用的高级（higher-level）模式。


### 如何阅读本教程


**本教程会教您 “Redux 的工作原理”**，以及 _为什么_ 有这些模式的存在。温馨提示 - 学习概念不同于在实际应用程序中将其付诸实践。

**初始代码会没有我们在实际应用中推荐的写法那么简洁**，但是不用语法糖（long-hand）的写法是学习的最佳方式。当您理解了所有部分是如何组合在一起的，我们再来用 Redux Toolkit 去简化代码。**Redux Toolkit 是我们推荐的在生产应用中使用 Redux 的方式**，建立在我们将在教程中介绍的所有概念之上。一旦您理解了教程中涵盖的核心概念，您会知道怎样更有效地使用 Redux Toolkit。

:::info

如果您想了解有关如何使用 Redux 编写实际应用程序的更多信息，请参阅：

- [**本教程中 “现代化的 Redux” 章节**](./part-8-modern-redux.md)，会演示怎样把前几个章节里示例的初级（low-level）用法转换为我们推荐的实际应用中的现代化模式（modern patterns）用法
- [**"Redux 循序渐进"**](../essentials/part-1-overview-concepts.md)，会教您在实际应用中“如何正确地使用 Redux”，利用我们推荐的模式和最佳实践。
:::

我们尽量让教程对初学者友好，但为了我们能专注于讲解 Redux 本身，我们假定您已经有了一些预备知识。**本教程假设您：**

:::important 必备能力

- 熟悉 [HTML & CSS](https://internetingishard.com/).
- 熟悉 [ES6 syntax and features](https://www.taniarascia.com/es6-syntax-and-feature-overview/)
- 了解 [the array and object spread operators](https://javascript.info/rest-parameters-spread#spread-syntax)
- 理解 React 的一些术语: [JSX](https://reactjs.org/docs/introducing-jsx.html), [State](https://reactjs.org/docs/state-and-lifecycle.html), [Function Components, Props](https://reactjs.org/docs/components-and-props.html), [Hooks](https://reactjs.org/docs/hooks-intro.html)
- 了解 [asynchronous JavaScript](https://javascript.info/promise-basics) 和 [making AJAX requests](https://javascript.info/fetch)

:::

**如果您对这些前置知识还搞不太明白，我们建议您先花一些时间学习它们，学会后再来学 Redux**。您若不离不弃，Redux 必生死相依~

最后，您应该确保您的浏览器里安装了 React 和 Redux DevTools 的插件：

- React DevTools Extension:
  - [React DevTools Extension for Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
  - [React DevTools Extension for Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
- Redux DevTools Extension:
  - [Redux DevTools Extension for Chrome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)
  - [Redux DevTools Extension for Firefox](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

## 什么是 Redux ？

在一开始解决这个问题有助于我们理解 "Redux"。Redux 做了什么事？它帮助我们解决了什么问题？为什么我要用它？

**Redux 是一个使用叫作 "actions" 的事件去管理和更新应用状态的模式和工具库。** 它以集中式 Store（centralized store）的方式对整个应用中使用的状态进行集中管理，其规则确保状态只能以可预测的方式更新。

### 我为什么要用 Redux ？

Redux 帮助您管理“全局”状态 - 那些应用程序的许多部分都需要的状态。

**Redux 提供的模式和工具使您更容易理解应用程序中的状态何时、何地、为什么以及如何更新，以及当这些更改发生时您的应用程序逻辑将如何表现**。 Redux 指导您编写可预测和可测试的代码，这有助于让您确信您的应用程序将按预期工作。

### 我什么时候应该用 Redux ？

Redux 可帮助您处理共享状态的管理，但与任何工具一样，它也有权衡。有更多的概念需要学习，还有更多的代码需要编写。它还为您的代码添加了一些额外代码，并要求您遵循某些限制。这是短期和长期生产力之间的权衡。

Redux 在以下情况下更有用：

- 在应用的大量地方，都存在大量的状态
- 应用状态会随着时间的推移而频繁更新
- 更新该状态的逻辑可能很复杂
- 中型和大型代码量的应用，很多人协同开发

**并非所有应用程序都需要 Redux。 花一些时间思考您正在构建的应用程序类型，并决定哪些工具最能帮助解决您正在处理的问题。**

:::info 想了解更多？

如果您不确定 Redux 是否适合您的应用程序，这些资源提供了更多指导：

- **[When (and when not) to reach for Redux](https://changelog.com/posts/when-and-when-not-to-reach-for-redux)**
- **[The Tao of Redux, Part 1 - Implementation and Intent](https://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-1/)**
- **[Redux FAQ: When should I use Redux?](../../faq/General.md#when-should-i-use-redux)**
- **[You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)**

:::

### Redux 库和工具

Redux 是一个小型的独立 JS 库。 但是，它通常与其他几个包一起使用：

#### React-Redux

Redux 可以结合任何 UI 框架一起使用，最常与 React。[**React-Redux**](https://react-redux.js.org/)是我们的官方库。它让 React 组件与 Redux 有了交互，可以从 store 读取一些 state，可以通过 dispatch actions 来更新 store。

#### Redux Toolkit

[**Redux Toolkit**](https://redux-toolkit.js.org) 是我们推荐的编写 Redux 逻辑的方法。 它包含我们认为对于构建 Redux 应用程序必不可少的包和函数。 Redux Toolkit 构建在我们建议的最佳实践中，简化了大多数 Redux 任务，防止了常见错误，并使编写 Redux 应用程序变得更加容易。

#### Redux DevTools 拓展

[**Redux DevTools Extension**](https://github.com/zalmoxisus/redux-devtools-extension) 可以显示 Redux 存储中状态随时间变化的历史记录。这允许您有效地调试应用程序，包括使用强大的技术，如“时间旅行调试”。

## Redux 基础

现在您已经知道了 Redux 是什么，让我们简要介绍一下构成 Redux 应用的各部分及其工作原理。


:::info

本页描述的剩余部分仅关注 Redux 核心库（redux package）。我们将在学习本教程的其余部分时讨论其他与 Redux 相关的包。

:::

### The Redux Store

所有 Redux 应用的中心都是 **store** 。"store" 是保存应用程序的全局 **state** 的容器。

store 是一个 JavaScript 对象，具有一些特殊的功能和能力，使其与普通的全局对象不同：

- 切勿直接修改（modify）或更改（change）保存在 Redux 存储中的状态
- 相反，导致状态更新的唯一方法是创建一个描述“应用程序中发生的某些事情”的普通 **action** 对象，然后将该 action **dispatch** 到 store 以告诉它发生了什么。
- 当一个 action 被 dispatch 后，store 会调用根 **reducer** 方法，让其根据 action 和旧 state 计算出新 state
- 最后，store 会通知 **订阅者(subscribers)** 状态已更新，以便可以使用新数据更新 UI。


### Redux 核心示例应用

让我们看一个 Redux 应用的最小工作示例 - 一个小型计数器应用程序：

<iframe
  class="codesandbox"
  src="https://codesandbox.io/embed/dank-architecture-lr7k1?fontsize=14&hidenavigation=1&theme=dark&runonclick=1"
  title="redux-fundamentals-core-example"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

因为 Redux 是一个无任何依赖的独立的 js 库，所以我们这个示例里只用了一个 script 标签去加载 Redux 库，用了基础的 JS、HTML 去写 UI。但在实践中，Redux 通常是通过[ npm 包的方式引入](../../introduction/Installation.md)的，UI 通常是通过像 [React](https://reactjs.org) 这类的库去创建的。

:::info

[第五节: UI 和 React](./part-5-ui-and-react.md) 将演示怎样结合 React 和 Redux 一起使用.

:::

接下来我们将此示例代码拆开为单独的部分，分别看看发生了什么。

#### State, Actions, and Reducers

我们首先定义一个初始 **state** 值来描述应用程序：

```js
// Define an initial state value for the app
const initialState = {
  value: 0
}
```

对于此应用，我们将使用计数器的当前值跟踪（track）单个数字。

Redux 应用程序通常将 JS 对象作为状态（state）的根（root），该对象中可以包含其他值。

接着，我们定义一个 **reducer** 方法。 接收俩参数， 当前的 `state` 和一个描述发生了什么的 `action` 对象。 当 Redux 应用启动时，我们还没有任何状态，所以我们提供一个 `initialState` 作为该 reducer 的默认值。

```js
// Create a "reducer" function that determines what the new state
// should be when something happens in the app
function counterReducer(state = initialState, action) {
  // Reducers usually look at the type of action that happened
  // to decide how to update the state
  switch (action.type) {
    case 'counter/incremented':
      return { ...state, value: state.value + 1 }
    case 'counter/decremented':
      return { ...state, value: state.value - 1 }
    default:
      // If the reducer doesn't care about this action type,
      // return the existing state unchanged
      return state
  }
}
```

Action 始终具有 `type` 字段，该字段的值是您提供的字符串，充当 action 的唯一名称。`type` 的值应该是一个好理解的名称，以便任何看过这段代码的人都明白它的含义。在这种情况下，我们使用单词 "counter" 作为我们 `type` 值的前半部分，后半部分是一个“发生了什么”的描述。在这种情况下，我们的 "counter" 是“递增的（incremented）”，所以我们将 `type` 编写为 `'counter/incremented'`。

根据 Action 的 type，我们要么需要返回一个全新的对象作为新的 `state` 的结果，要么返回现有的 `state` 对象（如果没有任何变化）。请注意，我们通过复制现有 state 并更新副本的方式来 _不可变地_（_immutably_）更新状态，而不是直接修改原始对象。


#### Store

现在我们有了一个 reducer 函数，我们可以通过调用 Redux 库 `createStore` API 来创建一个 **store** 实例。

```js
// Create a new Redux store with the `createStore` function,
// and use the `counterReducer` for the update logic
const store = Redux.createStore(counterReducer)
```

我们将 reducer 函数传递给 "createStore"，它使用 reducer 函数生成初始状态，并计算任何未来的更新。

#### UI

在任何应用程序中，用户界面都将在屏幕上显示现有状态。当用户执行某些操作时，应用将更新其数据，然后使用这些值重绘 UI。

```js
// Our "user interface" is some text in a single HTML element
const valueEl = document.getElementById('value')

// Whenever the store state changes, update the UI by
// reading the latest store state and showing new data
function render() {
  const state = store.getState()
  valueEl.innerHTML = state.value.toString()
}

// Update the UI with the initial data
render()
// And subscribe to redraw whenever the data changes in the future
store.subscribe(render)
```

在这个小示例中，我们仅使用一些基本的 HTML 元素作为 UI，其中一个 `div` 内显示当前值。

我们编写了一个 render 函数，该函数知道使用 `store.getState()` 方法从 Redux store 中获取最新状态，然后获取该值并更新 UI 以显示它。

Redux store 允许我们调用 `store.subscribe()` 方法，并传递一个订阅者回调函数，该函数将在每次更新 store 时调用。因此，我们可以将 `render` 函数作为订阅者传递，并且知道每次 store 更新时，我们都可以使用最新值更新 UI。

Redux 本身是一个独立的库，可以在任何地方使用。这也意味着它可以与任何 UI 层（layer）一起使用。

#### Dispatching Actions

最后，我们需要通过创建描述所发生情况的 **action** 对象，并将其 **dispatching** 到 store 来响应用户输入。当我们调用 `store.dispatch(action)` 时，store 运行 reducer ，计算更新的状态，并执行订阅者来更新UI。

```js
// Handle user inputs by "dispatching" action objects,
// which should describe "what happened" in the app
document.getElementById('increment').addEventListener('click', function () {
  store.dispatch({ type: 'counter/incremented' })
})

document.getElementById('decrement').addEventListener('click', function () {
  store.dispatch({ type: 'counter/decremented' })
})

document
  .getElementById('incrementIfOdd')
  .addEventListener('click', function () {
    // We can write logic to decide what to do based on the state
    if (store.getState().value % 2 !== 0) {
      store.dispatch({ type: 'counter/incremented' })
    }
  })

document
  .getElementById('incrementAsync')
  .addEventListener('click', function () {
    // We can also write async logic that interacts with the store
    setTimeout(function () {
      store.dispatch({ type: 'counter/incremented' })
    }, 1000)
  })
```

这里，我们 dispatch 了一些 action，这些 action 会让 reducer 根据当前计数器的值做加 1 或减 1 操作。

我们也可以写一些逻辑来决定什么时候 dispatch action。比如 if 语句，比如异步任务结束后。

### 数据流

我们可以使用一张 gif 图来图解 Redux 应用中的数据流。它描绘了：

- actions 会在用户交互如点击时被 dispatch
- store 通过执行 reducer 方法计算出一个新的 state
- UI 读取最新的 state 来展示最新的值

(如果上述各个部分还不太清楚，请不要担心！在学习本教程的其余部分时，请将此图片记在脑海中，您将看到这些部分如何组合在一起。)

![Redux data flow diagram](/img/tutorials/essentials/ReduxDataFlowDiagram.gif)

## 您学到了

这个计数器示例很小，但它确实展示了真正的 Redux 应用程序的所有工作部分。**我们在之后的章节讨论的所有东西都是基于这些基础部分扩展的**

考虑到这一点，让我们回顾一下到目前为止我们学到的东西：

:::tip 总结

- **Redux 是一个用于管理应用程序中全局状态的库**
  - Redux 通常与 React-Redux 库一起使用，用于将 Redux 和 React 集成在一起
  - Redux Toolkit 是编写 Redux 逻辑的推荐方式
- **Redux 使用多种类型的代码**
  - _Actions_ 是一个有 `type` 字段的普通对象，描述应用程序中“发生了什么”
  - _Reducers_ 是基于旧 state 和 action 计算出新 state 的方法
  - 每当一个 action 被 _dispatch_ 时，Redux _store_ 都会执行根（root）reducer

:::

## 下一步

现在您已经知道了构成 Redux 应用的各个基本部分是什么，接着看[第二节：Redux 概念与数据流](./part-2-concepts-data-flow.md)，我们将更详细地了解 Redux 应用中的数据流。