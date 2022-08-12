---
id: part-2-concepts-data-flow
title: 'Redux 深入浅出，第二节：概念与数据流'
sidebar_label: 'Redux 概念与数据流'
hide_title: false
description: 'The official Redux Fundamentals tutorial: learn key Redux terms and how data flows in a Redux app'
---

import { DetailedExplanation } from '../../components/DetailedExplanation'

# Redux 深入浅出，第二节：概念与数据流

:::tip 你将学到

- 使用 Redux 的关键术语和概念
- 数据如何流经 Redux 应用

:::

## 简介

在[第一节：Redux 概览](./part-1-overview.md)中，我们讨论了 Redux 是什么，为什么你可能想要使用它，并列出了通常与 Redux 一起使用的其他 Redux 相关库。我们还看到了一个小例子，说明了一个工作的 Redux 应用程序是什么样子的，以及构成该应用程序的各部分。最后，我们简要提到了 Redux 中使用的一些术语和概念。

在本节中，我们将更详细地介绍这些术语和概念，并更多地讨论数据如何流经 Redux 应用程序。

## 背景知识

在我们深入研究一些实际代码之前，让我们谈谈使用 Redux 需要了解的一些术语和概念。

### State 管理

让我们从一个小的 React 计数器组件开始。它跟踪组件 state 中的数字，并在单击按钮时递增该数字：

```jsx
function Counter() {
  // State: 计数器值
  const [counter, setCounter] = useState(0)

  // Action: 发生某些事情时导致状态更新的代码
  const increment = () => {
    setCounter(prevCounter => prevCounter + 1)
  }

  // View: 定义UI
  return (
    <div>
      Value: {counter} <button onClick={increment}>Increment</button>
    </div>
  )
}
```

它是一个独立的应用程序，具有以下部分：

- **state**，驱动我们应用程序的来源；
- **view**， 基于当前状态的 UI 声明性描述
- **actions**， 基于用户交互在应用中发生的事件，并触发状态更新

这是“单向数据流”的一个小例子：

- State 描述了应用程序在特定时间点的状况
- 基于 state 来渲染 UI
- 发生某些事情时（例如用户单击按钮），state 会根据发生的事情进行更新
- 基于新的 state 重新渲染 UI

![One-way data flow](/img/tutorials/essentials/one-way-data-flow.png)

然而，当我们有**多个组件需要共享和使用相同 state**时，可能会变得很复杂，尤其是当这些组件位于应用程序的不同部分时。有时这可以通过 ["提升 state "](https://reactjs.org/docs/lifting-state-up.html) 到父组件来解决，但这并不总是有效。

解决这个问题的一种方法是从组件中提取共享 state，并将其放入组件树之外的一个集中位置。这样，我们的组件树就变成了一个大” view “，任何组件都可以访问 state 或触发 action，无论它们在树中的哪个位置！

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

**如果想要不可变的方式来更新，代码必需先 _复制_ 原来的 object/array，然后更新它的复制体**。

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

## Redux 术语

在我们继续之前，你需要熟悉一些重要的 Redux 术语：

### Actions

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

### Reducers

**reducer** 是一个函数，接收当前的 `state` 和一个 `action` 对象，必要时决定如何更新状态，并返回新状态。函数签名是：`(state, action) => newState`。 **你可以将 reducer 视为一个事件监听器，它根据接收到的 action（事件）类型处理事件。**

:::info

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
  { type: 'counter/incremented' },
  { type: 'counter/incremented' },
  { type: 'counter/incremented' }
]

const initialState = { value: 0 }

const finalResult = actions.reduce(counterReducer, initialState)
console.log(finalResult)
// {value: 3}
```

我们可以说 **Redux reducer 将一组操作（随着时间的推移）减少到单个状态**。不同之处在于，使用 `Array.reduce()` 时它会一次性发生，而使用 Redux 时，它会在你正在运行的应用程序的整个生命周期内发生。

</DetailedExplanation>

### Store

当前 Redux 应用的状态存在于一个名为 **store** 的对象中。

store 是通过传入一个 reducer 来创建的，并且有一个名为 `getState` 的方法，它返回当前状态值：

```js
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({ reducer: counterReducer })

console.log(store.getState())
// {value: 0}
```

### Dispatch

Redux store 有一个方法叫 `dispatch`。**更新 state 的唯一方法是调用 `store.dispatch()` 并传入一个 action 对象**。 store 将执行所有 reducer 函数并计算出更新后的 state，调用 `getState()` 可以获取新 state。

```js
store.dispatch({ type: 'counter/incremented' })

console.log(store.getState())
// {value: 1}
```

**dispatch 一个 action 可以形象的理解为 "触发一个事件"**。发生了一些事情，我们希望 store 知道这件事。 Reducer 就像事件监听器一样，当它们收到关注的 action 后，它就会更新 state 作为响应。

### Selectors

**Selector** 函数可以从 store 状态树中提取指定的片段。随着应用变得越来越大，会遇到应用程序的不同部分需要读取相同的数据，selector 可以避免重复这样的读取逻辑：

```js
const selectCounterValue = state => state.value

const currentValue = selectCounterValue(store.getState())
console.log(currentValue)
// 2
```

## 核心概念和原则

总的来说，我们可以用三个核心概念来总结 Redux 设计背后的意图：

### 单一数据源

应用程序的**全局状态**作为对象存储在单个 **store** 中。任何给定的数据片段都应仅存在于一个位置，而不是在许多位置重复。

这样，随着事物的变化，可以更轻松地调试和检查应用的状态，并集中需要与整个应用程序交互的逻辑。

:::tip

这并 _不_ 意味着应用中的 _所有_ 状态都必须放进 Redux store 管理！你应该根据需要的位置来决定一段状态是属于 Redux 还是属于你的 UI 组件。

:::

### State 是只读的

更改状态的唯一方法是 dispatch 一个 **action**，这是一个描述所发生事件的对象。

这样，UI 就不会意外覆盖数据，并且更容易跟踪发生状态更新的原因。由于 actions 是普通的 JS 对象，因此可以记录、序列化、存储这些操作，并在以后重放这些操作以进行调试或测试。

### 使用 Reducer 纯函数进行更改

若要指定如何基于 action 更新状态树，请编写 **reducer** 函数。Reducers 是纯函数，它们采用旧 state 和 action，并返回新 state。与任何其他函数一样，你可以将 Reducer 拆分为较小的函数以帮助完成工作，或者为常见任务编写可重用的 Reducer。

## Redux 数据流

早些时候，我们谈到了“单向数据流”，它描述了更新应用程序的以下步骤序列：

- State 描述了应用程序在特定时间点的状况
- 基于 state 来渲染 UI
- 当发生某些事情时（例如用户单击按钮），state 会根据发生的事情进行更新
- 基于新的 state 重新渲染 UI

具体来说，对于 Redux，我们可以将这些步骤分解为更详细的内容：

- 初始启动：
  - 使用最顶层的 root reducer 函数创建 Redux store
  - store 调用一次 root reducer，并将返回值保存为它的初始 `state`
  - 当 UI 首次渲染时，UI 组件访问 Redux store 的当前 state，并使用该数据来决定要呈现的内容。同时监听 store 的更新，以便他们可以知道 state 是否已更改。
- 更新环节：
  - 应用程序中发生了某些事情，例如用户单击按钮
  - dispatch 一个 action 到 Redux store，例如 `dispatch({type: 'counter/increment'})`
  - store 用之前的 `state` 和当前的 `action` 再次运行 reducer 函数，并将返回值保存为新的 `state`
  - store 通知所有订阅过的 UI，通知它们 store 发生更新
  - 每个订阅过 store 数据的 UI 组件都会检查它们需要的 state 部分是否被更新。
  - 发现数据被更新的每个组件都强制使用新数据重新渲染，紧接着更新网页

动画的方式来表达数据流更新：

![Redux data flow diagram](/img/tutorials/essentials/ReduxDataFlowDiagram.gif)

## 你学到了

:::tip 总结

- **Redux 的意图可以总结为三个原则**
  - 全局应用状态保存在单个 store 中
  - store 中的 state 是只读的
  - Reducer 函数用于更新状态以响应 actions
- **Redux 使用“单向数据流”**
  - State 描述了应用程序在某个时间点的状态，UI 基于该状态渲染
  - 当应用程序中发生某些事情时：
    - UI dispatch 一个 action
    - store 调用 reducer，随后根据发生的事情来更新 state
    - store 通知 UI state 发生了变化
  - UI 基于新 state 重新渲染

:::

## 下一步

你现在应该熟悉描述 Redux 应用不同部分的关键概念和术语了。

现在，让我们跟着[第三节：State, Actions, adn Reducers](./part-3-state-actions-reducers.md)创建一个新应用吧，你将明白各部分是如何组合在一起工作的。
