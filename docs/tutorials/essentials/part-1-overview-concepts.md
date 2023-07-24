---
id: part-1-overview-concepts
title: 'Redux 基础教程，第一节：Redux 概述和概念'
sidebar_label: '基础概念'
hide_title: false
description: 'The official Essentials tutorial for Redux: learn how to use Redux, the right way'
---

import { DetailedExplanation } from '../../components/DetailedExplanation'

# 第 1 节：Redux 概述和概念

:::tip 你将学到什么

- Redux 是什么，为什么需要使用它
- Redux 的关键术语和概念
- Redux 如何处理数据流

:::

## 简介

欢迎来到 Redux 基础教程! **本教程将向你介绍 Redux 并教你如何正确得使用我们最新推荐的工具和最佳实践**。当你完成时，你应该能够通过已学到的工具和模式开始构建你自己的 Redux 应用程序。

在教程的第 1 节，会包含使用 Redux 需要了解的关键术语和概念，然后在[第 2 节: Redux 应用骨架](./part-2-app-structure.md) 我们将尝试一个基本的 React + Redux 应用程序，以了解各个部分如何组合在一起。

从[第 3 节：Redux 数据流基础](./part-3-data-flow.md) 开始，我们将使用这些知识来构建一个具有一些实际功能的小型社交媒体供稿应用程序，了解这些内容在实践中的实际工作方式，并讨论使用 Redux 的一些重要模式和指南。

### 如何阅读本教程

本节将重点向你展示**如何**以正确的方式使用 Redux，并介绍恰到好处的概念，以便你了解如何正确构建 Redux 应用程序。

我们试图让这些解释对初学者友好，但你还是需要：

:::important 前置知识

- 熟悉 [HTML & CSS](https://internetingishard.com/).
- 熟悉 [ES6 syntax and features](https://www.taniarascia.com/es6-syntax-and-feature-overview/)
- 了解 React 术语: [JSX](https://reactjs.org/docs/introducing-jsx.html), [State](https://reactjs.org/docs/state-and-lifecycle.html), [Function Components, Props](https://reactjs.org/docs/components-and-props.html), and [Hooks](https://reactjs.org/docs/hooks-intro.html)
- 了解 [JavaScript Promise 异步处理](https://javascript.info/promise-basics) 和 [发送 AJAX 请求](https://javascript.info/fetch)

:::

**如果你对这些主题还不熟悉，我们鼓励你先花一些时间熟悉它们，然后再回来学习 Redux**。当你准备好时，我们会在这里等你！

你应该确保在浏览器中安装了 React 和 Redux DevTools 扩展：

- React DevTools 扩展：
  - [React DevTools Extension for Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
  - [React DevTools Extension for Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

## Redux 是什么？

首先理解 “Redux” 是什么。它有什么作用？它帮助我解决什么问题？我为什么要使用它？

**Redux 是一个使用叫做 “action” 的事件来管理和更新应用状态的模式和工具库** 它以集中式 Store（centralized store）的方式对整个应用中使用的状态进行集中管理，其规则确保状态只能以可预测的方式更新。

### 为什么要使用 Redux？

Redux 帮你管理“全局”状态 - 应用程序中的很多组件都需要的状态。

**Redux 提供的模式和工具使你更容易理解应用程序中的状态何时、何地、为什么、state 如何被更新，以及当这些更改发生时你的应用程序逻辑将如何表现**. Redux 指导你编写可预测和可测试的代码，这有助于你确信你的应用程序将按预期工作。

### 我什么时候应该使用 Redux？

Redux 可帮助你处理共享状态的管理，但与任何工具一样，它也需要权衡利弊。使用 Redux 有更多的概念需要学习，还有更多的代码需要编写，需要添加了一些额外代码，并要求你遵循某些限制。这是短期和长期生产力之间的权衡。

在以下情况下使用 Redux：

- 应用中有很多 state 在多个组件中需要使用
- 应用 state 会随着时间的推移而频繁更新
- 更新 state 的逻辑很复杂
- 中型和大型代码量的应用，很多人协同开发

**并非所有应用程序都需要 Redux。 花一些时间思考你正在构建的应用程序类型，并决定哪些工具最能帮助解决你正在处理的问题。**

:::info 想了解更多？

如果你不确定 Redux 是否适合你的应用程序，这些资源提供了更多指导：

- **[When (and when not) to reach for Redux](https://changelog.com/posts/when-and-when-not-to-reach-for-redux)**
- **[The Tao of Redux, Part 1 - Implementation and Intent](https://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-1/)**
- **[Redux FAQ: When should I use Redux?](../../faq/General.md#when-should-i-use-redux)**
- **[You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)**

:::

### Redux 库和工具

Redux 是一个小型的独立 JS 库。 但是，它通常与其他几个包一起使用：

#### React-Redux

Redux 可以集成到任何的 UI 框架中，其中最常见的是 React 。[**React-Redux**](https://react-redux.js.org/) 是我们的官方包，它可以让 React 组件访问 state 片段和 dispatch actions 更新 store，从而同 Redux 集成起来。

#### Redux Toolkit

[**Redux Toolkit**](https://redux-toolkit.js.org) 是我们推荐的编写 Redux 逻辑的方法。 它包含我们认为对于构建 Redux 应用程序必不可少的包和函数。 Redux Toolkit 构建是我们建议的最佳实践中，简化了大多数 Redux 任务，预防了常见错误，并使编写 Redux 应用程序变得更加容易。

#### Redux DevTools 扩展

[**Redux DevTools 扩展**](https://github.com/zalmoxisus/redux-devtools-extension) 可以显示 Redux 存储中状态随时间变化的历史记录。这允许你有效地调试应用程序，包括使用强大的技术，如“时间旅行调试”。

## Redux 术语和概念

在我们深入研究一些实际代码之前，让我们先谈谈使用 Redux 需要了解的一些术语和概念。

### State 管理

让我们从一个小的 React 计数器组件开始。 它跟踪组件状态中的数字，并在单击按钮时增加数字：

```jsx
function Counter() {
  // State: counter 值
  const [counter, setCounter] = useState(0)

  // Action: 当事件发生后，触发状态更新的代码
  const increment = () => {
    setCounter(prevCounter => prevCounter + 1)
  }

  // View: 视图定义
  return (
    <div>
      Value: {counter} <button onClick={increment}>Increment</button>
    </div>
  )
}
```

这是一个包含以下部分的自包含应用程序：

- **state**：驱动应用的真实数据源头
- **view**：基于当前状态的视图声明性描述
- **actions**：根据用户输入在应用程序中发生的事件，并触发状态更新

接下来简要介绍 **"单向数据流（one-way data flow）"**:

- 用 state 来描述应用程序在特定时间点的状况
- 基于 state 来渲染出 View
- 当发生某些事情时（例如用户单击按钮），state 会根据发生的事情进行更新，生成新的 state
- 基于新的 state 重新渲染 View

![单向数据流](/img/tutorials/essentials/one-way-data-flow.png)

然而，当我们有**多个组件需要共享和使用相同 state**时，可能会变得很复杂，尤其是当这些组件位于应用程序的不同部分时。有时这可以通过 ["提升 state"](https://reactjs.org/docs/lifting-state-up.html) 到父组件来解决，但这并不总是有效。

解决这个问题的一种方法是从组件中提取共享 state，并将其放入组件树之外的一个集中位置。这样，我们的组件树就变成了一个大“view”，任何组件都可以访问 state 或触发 action，无论它们在树中的哪个位置！

通过定义和分离 state 管理中涉及的概念并强制执行维护 view 和 state 之间独立性的规则，代码变得更结构化和易于维护。

这就是 Redux 背后的基本思想：应用中使用集中式的全局状态来管理，并明确更新状态的模式，以便让代码具有可预测性。

### 不可变性 Immutability

"Mutable" 意为 "可改变的"，而 "immutable" 意为永不可改变。

JavaScript 的对象（object）和数组（array）默认都是 mutable 的。如果我创建一个对象，我可以更改其字段的内容。如果我创建一个数组，我也可以更改内容：

```js
const obj = { a: 1, b: 2 }
// 对外仍然还是那个对象，但它的内容已经变了
obj.b = 3

const arr = ['a', 'b']
// 同样的，数组的内容改变了
arr.push('c')
arr[1] = 'd'
```

这就是 _改变_ 对象或数组的例子。内存中还是原来对象或数组的引用，但里面的内容变化了。

**如果想要不可变的方式来更新，代码必需先*复制*原来的 object/array，然后更新它的复制体**。

JavaScript array/object 的展开运算符（spread operator）可以实现这个目的：

```js
const obj = {
  a: {
    // 为了安全的更新 obj.a.c，需要先复制一份
    c: 3
  },
  b: 2
}

const obj2 = {
  // obj 的备份
  ...obj,
  // 覆盖 a
  a: {
    // obj.a 的备份
    ...obj.a,
    // 覆盖 c
    c: 42
  }
}

const arr = ['a', 'b']
// 创建 arr 的备份，并把 c 拼接到最后。
const arr2 = arr.concat('c')

// 或者，可以对原来的数组创建复制体
const arr3 = arr.slice()
// 修改复制体
arr3.push('c')
```

**Redux 期望所有状态更新都是使用不可变的方式**。 稍后会说明为什么这很重要，以及编写不可变更新逻辑的一些更简单的方法

:::info 想了解更多？

想了解 JavaScript 中的 immutability 如何工作，查看:

- [JavaScript “引用” 的可视化教程](https://daveceddia.com/javascript-references/)
- [Immutability in React and Redux：完整教程](https://daveceddia.com/react-redux-immutability-guide/)

:::

### 术语

在我们继续之前，你需要熟悉一些重要的 Redux 术语：

#### Action

**action** 是一个具有 `type` 字段的普通 JavaScript 对象。**你可以将 action 视为描述应用程序中发生了什么的事件**.

`type` 字段是一个字符串，给这个 action 一个描述性的名字，比如`"todos/todoAdded"`。我们通常把那个类型的字符串写成“域/事件名称”，其中第一部分是这个 action 所属的特征或类别，第二部分是发生的具体事情。

action 对象可以有其他字段，其中包含有关发生的事情的附加信息。按照惯例，我们将该信息放在名为 `payload` 的字段中。

一个典型的 action 对象可能如下所示：

```js
const addTodoAction = {
  type: 'todos/todoAdded',
  payload: 'Buy milk'
}
```

#### Action Creator

**action creator** 是一个创建并返回一个 action 对象的函数。它的作用是让你不必每次都手动编写 action 对象：

```js
const addTodo = text => {
  return {
    type: 'todos/todoAdded',
    payload: text
  }
}
```

#### Reducer

**reducer** 是一个函数，接收当前的 `state` 和一个 `action` 对象，必要时决定如何更新状态，并返回新状态。函数签名是：`(state, action) => newState`。 **你可以将 reducer 视为一个事件监听器，它根据接收到的 action（事件）类型处理事件。**

:::info 说明

"Reducer" 函数的名字来源是因为它和 [`Array.reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) 函数使用的回调函数很类似。

:::

Reducer 必需符合以下规则：

- 仅使用 `state` 和 `action` 参数计算新的状态值
- 禁止直接修改 `state`。必须通过复制现有的 `state` 并对复制的值进行更改的方式来做 _不可变更新（immutable updates）_。
- 禁止任何异步逻辑、依赖随机值或导致其他“副作用”的代码

稍后我们将更多地讨论 reducer 的规则，包括为什么它们很重要以及如何正确地遵循它们。

reducer 函数内部的逻辑通常遵循以下步骤：

- 检查 reducer 是否关心这个 action
  - 如果是，则复制 state，使用新值更新 state 副本，然后返回新 state
- 否则，返回原来的 state 不变

下面是 reducer 的小例子，展示了每个 reducer 应该遵循的步骤：

```js
const initialState = { value: 0 }

function counterReducer(state = initialState, action) {
  // 检查 reducer 是否关心这个 action
  if (action.type === 'counter/increment') {
    // 如果是，复制 `state`
    return {
      ...state,
      // 使用新值更新 state 副本
      value: state.value + 1
    }
  }
  // 返回原来的 state 不变
  return state
}
```

Reducer 可以在内部使用任何类型的逻辑来决定新状态应该是什么，如 `if/else`、`switch`、循环等等。

<DetailedExplanation title="细节说明：Reducer 名字的来历" >

[`Array.reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) 方法处理数组的方式是，一次处理数组中的每一项，并返回一个最终结果。你可以将其视为“将数组减少到一个值”。

`Array.reduce()` 将回调函数作为参数，该函数将为数组中的每一项调用一次。它需要两个参数：

- `previousResult`，回调函数上次返回的值
- `currentItem`，数组中的当前项

回调函数第一次运行时，没有可用的 `previousResult`，因此我们还需要传入一个初始值，该值将用作第一个 `previousResult`。

reduce 处理数组相加的代码如下：

```js
const numbers = [2, 5, 8]

const addNumbers = (previousResult, currentItem) => {
  console.log({ previousResult, currentItem })
  return previousResult + currentItem
}

const initialValue = 0

const total = numbers.reduce(addNumbers, initialValue)
// {previousResult: 0, currentItem: 2}
// {previousResult: 2, currentItem: 5}
// {previousResult: 7, currentItem: 8}

console.log(total)
// 15
```

请注意，这个 `addNumbers` 就是 “reduce 回调函数”，它本身不需要跟踪任何东西。它接受 `previousResult` 和 `currentItem` 参数，用它们做一些事情，并返回一个新的结果值。

**Redux reducer 函数与这个“reduce 回调函数”函数的想法完全相同！** 它接受上一个结果（`state`）和当前项（`action` 对象），根据这些参数计算出一个新 state，并返回该新 state。

如果我们要创建一个 Redux 操作数组，调用 `reduce()`，并传入一个 reducer 函数，我们会以同样的方式得到最终结果：

```js
const actions = [
  { type: 'counter/increment' },
  { type: 'counter/increment' },
  { type: 'counter/increment' }
]

const initialState = { value: 0 }

const finalResult = actions.reduce(counterReducer, initialState)
console.log(finalResult)
// {value: 3}
```

我们可以说 **Redux reducer 将一组 actions（随着时间的推移）转化为单个 state**。不同之处在于，使用 `Array.reduce()` 时它会一次性发生，而使用 Redux 时，它会在你正在运行的应用程序的整个生命周期内发生。
</DetailedExplanation>

#### Store

当前 Redux 应用的 state 存在于一个名为 **store** 的对象中。

store 是通过传入一个 reducer 来创建的，并且有一个名为 `getState` 的方法，它返回当前状态值：

```js
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({ reducer: counterReducer })

console.log(store.getState())
// {value: 0}
```

#### Dispatch

Redux store 有一个方法叫 `dispatch`。**更新 state 的唯一方法是调用 `store.dispatch()` 并传入一个 action 对象**。 store 将执行所有 reducer 函数并计算出更新后的 state，调用 `getState()` 可以获取新 state。

```js
store.dispatch({ type: 'counter/increment' })

console.log(store.getState())
// {value: 1}
```

**dispatch 一个 action 可以形象的理解为 "触发一个事件"**。发生了一些事情，我们希望 store 知道这件事。 Reducer 就像事件监听器一样，当它们收到关注的 action 后，它就会更新 state 作为响应。

我们通常调用 action creator 来调用 action：

```js
const increment = () => {
  return {
    type: 'counter/increment'
  }
}

store.dispatch(increment())

console.log(store.getState())
// {value: 2}
```

#### Selector

**Selector** 函数可以从 store 状态树中提取指定的片段。随着应用变得越来越大，会遇到应用程序的不同部分需要读取相同的数据，selector 可以避免重复这样的读取逻辑：

```js
const selectCounterValue = state => state.value

const currentValue = selectCounterValue(store.getState())
console.log(currentValue)
// 2
```

### Redux 数据流

早些时候，我们谈到了“单向数据流”，它描述了更新应用程序的以下步骤序列：

- State 描述了应用程序在特定时间点的状况
- 基于 state 来渲染视图
- 当发生某些事情时（例如用户单击按钮），state 会根据发生的事情进行更新
- 基于新的 state 重新渲染视图

具体来说，对于 Redux，我们可以将这些步骤分解为更详细的内容：

- 初始启动：
  - 使用最顶层的 root reducer 函数创建 Redux store
  - store 调用一次 root reducer，并将返回值保存为它的初始 `state`
  - 当视图 首次渲染时，视图组件访问 Redux store 的当前 state，并使用该数据来决定要呈现的内容。同时监听 store 的更新，以便他们可以知道 state 是否已更改。
- 更新环节：
  - 应用程序中发生了某些事情，例如用户单击按钮
  - dispatch 一个 action 到 Redux store，例如 `dispatch({type: 'counter/increment'})`
  - store 用之前的 `state` 和当前的 `action` 再次运行 reducer 函数，并将返回值保存为新的 `state`
  - store 通知所有订阅过的视图，通知它们 store 发生更新
  - 每个订阅过 store 数据的视图 组件都会检查它们需要的 state 部分是否被更新。
  - 发现数据被更新的每个组件都强制使用新数据重新渲染，紧接着更新网页

动画的方式来表达数据流更新：

![数据流更新动画](/img/tutorials/essentials/ReduxDataFlowDiagram.gif)

## 你学到了

Redux 确实有许多新的术语和概念需要记住。提醒一下，这是我们刚刚介绍的内容：

:::tip 总结

- **Redux 是一个管理全局应用状态的库**
  - Redux 通常与 React-Redux 库一起使用，把 Redux 和 React 集成在一起
  - Redux Toolkit 是编写 Redux 逻辑的推荐方式
- **Redux 使用 "单向数据流"**
  - State 描述了应用程序在某个时间点的状态，视图基于该 state 渲染
  - 当应用程序中发生某些事情时：
    - 视图 dispatch 一个 action
    - store 调用 reducer，随后根据发生的事情来更新 state
    - store 将 state 发生了变化的情况通知 UI
  - 视图基于新 state 重新渲染
- **Redux 有这几种类型的代码**
  - _Action_ 是有 `type` 字段的纯对象，描述发生了什么
  - _Reducer_ 是纯函数，基于先前的 state 和 action 来计算新的 state
  - 每当 dispatch 一个 action 后，_store_ 就会调用 root reducer

:::

## 下一步

我们已经看到了 Redux 应用程序的每个单独部分。接下来，继续阅读 [第 2 部分：Redux 应用程序结构](./part-2-app-structure.md)，我们将在其中查看一个完整的工作示例，以了解各个部分如何组合在一起。
