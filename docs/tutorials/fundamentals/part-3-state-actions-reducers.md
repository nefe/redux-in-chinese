---
id: part-3-state-actions-reducers
title: 'Redux 深入浅出， 第三节: State， Actions， 和 Reducers'
sidebar_label: 'State， Actions 和 Reducers'
hide_title: false
description: 'The official Redux Fundamentals tutorial: learn how reducers update state in response to actions'
---

import { DetailedExplanation } from '../../components/DetailedExplanation'

# Redux 深入浅出， 第三节: State， Actions 和 Reducers

:::tip 你将学到

- 如何定义包含应用数据的 state
- 如何定义描述你的应用程序中发生事情的 action 对象
- 如何编写基于现有 state 和 action 计算更新状态的 reducer 函数

:::

:::info 预置知识

- 熟悉 Redux 的关键术语和概念，如 actions、reducers、 store 和 dispatching 。（有关这些术语的解释，请参阅 **[第 2 部分：Redux 概念和数据流。](./part-2-concepts-data-flow.md)** )

:::

## 简介

在[第 2 部分：Redux 概念和数据流](./part-2-concepts-data-flow.md)中，研究了 Redux 如何通过提供单一中心位置存放全局应用程序状态，来帮助我们构建可维护的应用程序。还讨论了 Redux 的核心概念，例如 dispatching action 对象和使用返回新状态值的 reducer 函数。

现在你已经对这部分有所了解，是时候将这些知识付诸实践了。我们将构建一个小型示例应用，来了解这些模块是如何协同工作。

:::注意

**示例应用程序并不是一个完整的项目。** 目的是帮助你学习 Redux API 的核心和使用模式，并使用一些很少的示例为你指明正确的方向。此外，我们构建的一些早期作品将在稍后更新，用来展示更好的工作方式。**请通读整个教程查看所有使用中的概念**。

:::

### 项目设置

对于本教程，我们创建了一个预配置的启动项目，该项目已经预设了 React，包括一些默认样式，并且有一个假 REST API，允许在应用程序中编写实际的 API 请求。将以此作为编写实际应用程序代码的基础。

首先，你可以打开并 fork CodeSandbox：

<iframe
  class="codesandbox"
  src="https://codesandbox.io/embed/github/reduxjs/redux-fundamentals-example-app/tree/master/?fontsize=14&hidenavigation=1&theme=dark&runonclick=1"
  title="redux-fundamentals-example-app"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

也可以[从这个 Github repo 克隆这个项目](https://github.com/reduxjs/redux-fundamentals-example-app)。克隆 repo 后，可以运行 `npm install` 和 `npm start`。

如果你想查看最终版本，可以查看[分支 **`tutorial-steps`**](https://github.com/reduxjs/redux-fundamentals-example-app/tree/tutorial-steps)，或[查看此 CodeSandbox 中的最终版本](https://codesandbox.io/s/github/reduxjs/redux-fundamentals-example-app/tree/tutorial-steps)。

#### 创建一个新的 Redux + React 项目

完成本教程后，你可能想要尝试进行自己的项目。**我们建议使用[Create-React-App 的 Redux 模版](https://github.com/reduxjs/cra-template-redux)作为创建新的 Redux + React 项目的最快方式**。 它附带 Redux Toolkit 和 React-Redux，使用[你在第 1 部分中看到的 “ 计数器 ” 应用程序示例的最新版本](./part-1-overview.md)。你可以直接开始编写实际的应用程序代码，无需添加 Redux 包和设置 Store。

如果想了解如何将 Redux 添加到项目中的具体细节，请参阅以下说明：

<DetailedExplanation title="详解：将 Redux 添加到 React 项目">

CRA 的 Redux 模板附带 Redux Toolkit 和已配置的 React-Redux。如果想从头开始设置新项目，请按照以下步骤操作：

- 添加 `@reduxjs/toolkit` 和 `react-redux` 包
- 使用 RTK 的 API 创建 Redux 存储 `configureStore`，并传入至少一个 reducer 函数
- 将 Redux Store 导入应用程序的入口文件（例如 `src/index.js`)
- 用 React-Redux 中的组件 `<Provider>` 包装你的根 React 组件，例如：

```jsx
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

</DetailedExplanation>

#### 探究初始项目

这个初始项目基于[标准的 Create-React-App](https://create-react-app.dev/docs/getting-started) 项目模版，并进行了一些修改。

初始项目包含的内容：

- `/src`
  - `index.js`: 应用程序的入口文件。呈现 `<App>` 组件。
  - `App.js`: 主要的应用程序组件。
  - `index.css`: 完整应用程序的样式。
  - `/api`
    - `client.js`: 一个小型的 AJAX 请求客户端，可以发出 GET 和 POST 请求。
    - `server.js`: 为数据提供一个虚假的 REST API。稍后会从这些假端点获取数据。
  - `/exampleAddons`: 包含一些额外的 Redux 插件，将在教程后面使用它们，并展示它们是如何工作的。

运行程序，你将会看到一条欢迎消息，但应用程序的其余部分是空的。

有了这个，让我们开始吧！

## 启动 Todo 示例应用程序

示例应用程序是一个小型“待办事项”应用程序。可能之前你已经看过 todo 应用程序示例 - 它展示了在一个正常的应用程序中如何执行诸如跟踪项目列表、处理用户输入以及在数据更改时更新 UI 等所有事情。

### 定义要求

首先弄清楚这个应用程序的初始业务需求：

- UI 应包括三个主要部分：
  - 一个输入框，让用户输入新待办事项的文本
  - 所有现有待办事项的列表
  - 页脚部分，显示未完成的待办事项数量，并显示过滤选项
- 待办事项列表项应该有一个复选框来切换“完成”状态。还应该能够为预定义的颜色列表添加颜色编码的类别标签，并删除待办事项。
- 计数器应该复数活动待办事项的数量：“0 items”、“1 items”、“3 items”等
- 应该有按钮将所有待办事项标记为已完成，并通过删除它们来清除所有已完成的待办事项
- 应该有两种方法可以过滤列表中显示的待办事项：
  - 待办事项可基于 All 、 Active 和 Completed 进行过滤
  - 基于选择一种或多种颜色进行过滤，并显示标签与这些颜色匹配的任何待办事项

稍后将添加更多需求。

最终目标是一个应该如下所示的应用程序：

![Example todo app screenshot](/img/tutorials/fundamentals/todos-app-screenshot.png)

### 设计 State

React 和 Redux 的核心原则之一是 **UI 应该基于 state**。因此，设计应用程序的一种方法是首先考虑描述应用程序工作所需的所有状态。尝试使用尽可能少的 state 来描述 UI，这样需要跟踪和更新的数据更少。

从概念上讲，此应用程序有两个主要功能：

- 当前待办事项的实际列表
- 当前的过滤选项

还需要跟踪用户在“添加待办事项”输入框中输入的数据，但这并不重要，稍后会处理。

对于每个待办事项，我们需要存储一些信息：

- 用户输入的文本
- 表示是否完成的布尔值
- 唯一的 ID 值
- 颜色类别（如果已选择）

过滤行为可能可以用一些枚举值来描述：

- 已完成状态：“全部（All）”、“活动（Active）” 和 “已完成（Completed）”
- 颜色：” Red “、“ Yellow ”、“ Green ”、“ Blue ”、“ Orange ”、“ Purple ”

查看这些值，可以说待办事项是 “app state”（ 应用程序使用的核心数据 ），而过滤值是 “ UI state ”（ 描述应用程序当前正在执行的操作的状态 ）。考虑这些不同种类的类别有助于理解不同的状态是如何被使用的。

### 设计 State 结构

使用 Redux，**我们的应用程序状态始终保存在普通 JavaScript 对象和数组**中. 这意味着你不能将其他东西放入 Redux 状态 - 不要有类实例、内置 JS 类型（如 ’Map‘、’Set‘、‘Promise’、‘Date’、函数或任何其他非普通 JS 数据）

**Redux 根结点 state 通常作为一个普通 JS 对象**，其中嵌套了其他数据。

基于这些信息，现在应该能够描述需要在 Redux 状态中拥有值的种类：

- 首先，需要一个待办事项对象数组。每个项目都应具有以下字段：
  - `id`: 唯一编号
  - `text`: 用户输入的文本
  - `completed`: 一个布尔值
  - `color`: 可选的颜色类别
- 然后，需要描述的过滤选项：
  - 当前“已完成”过滤器值
  - 当前选定颜色类别的数组

因此，以下是应用程序状态的示例：

```js
const todoAppState = {
  todos: [
    { id: 0, text: 'Learn React', completed: true },
    { id: 1, text: 'Learn Redux', completed: false, color: 'purple' },
    { id: 2, text: 'Build something fun!', completed: false, color: 'blue' }
  ],
  filters: {
    status: 'Active',
    colors: ['red', 'blue']
  }
}
```

需要注意的是**在 Redux 之外有其他状态值也是可以的！**到目前为止，这个示例足够小，我们确实将所有状态都保存在 Redux 中，但是正如稍后将看到的，某些数据是不需要保存在 Redux 中（例如“这个下拉列表是否打开？”或“表单输入的当前值”）。

### 设计 Actions

**Actions** 是具有 `type` 字段的普通 JavaScript 对象。如前所述，**你可以将 actions 视为描述应用程序中所发生的事情**。

以下是列出的一些 actions 列表，他们描述所发生的事情：

- 根据用户输入的文本添加新的待办事项条目
- 切换待办事项的完成状态
- 为待办事项选择颜色类别
- 删除待办事项
- 将所有待办事项标记为已完成
- 清除所有已完成的待办事项
- 选择不同的 “已完成” 过滤器值
- 添加新的滤色器
- 移除滤色器

我们通常会将描述该领域正在发生的事情所需的任何额外数据放入 `action.payload` 中；这可以是一个数字、一个字符串或一个内部包含多个字段的对象。

Redux store 并不关心该 `action.type` 字段的实际文本是什么。但是，你的代码将查看 `action.type` 以判断是否需要更新。此外，你会在调试时经常查看 Redux DevTools 拓展中的 actions 类型字符串，以了解你的应用程序中发生了什么。因此，请选择能够清楚地描述正在发生事情的 actions 类型 - 当你稍后查看它们时会更容易理解它们！

基于可能发生的事情列表，可以创建应用程序将使用的 actions 列表：

- `{type: 'todos/todoAdded', payload: todoText}`
- `{type: 'todos/todoToggled', payload: todoId}`
- `{type: 'todos/colorSelected, payload: {todoId, color}}`
- `{type: 'todos/todoDeleted', payload: todoId}`
- `{type: 'todos/allCompleted'}`
- `{type: 'todos/completedCleared'}`
- `{type: 'filters/statusFilterChanged', payload: filterValue}`
- `{type: 'filters/colorFilterChanged', payload: {color, changeType}}`

actions 主要有一个额外的数据，所以可以直接把它放在 `action.payload` 字段中。我们可以将滤色器 action 拆分为两个 actions ，一个用于 “ 添加 ”，一个用于 “ 移除 ”；也可以作为一个 action 执行，其中包含一个额外的字段，可以将对象作为一个 action payload 用于区分。

像 state 数据一样，**actions 应该包含描述所发生情况所需的最少信息**.

## 编写 Reducers

现在明白了 state 结构和 action 是什么样的，可以开始编写第一个 reducer。

**Reducers** 是接收当前的 `state` 和 `action` 作为参数并返回新的 `state` 结果的函数。也就是， **`(state, action) => newState`**.

### 创建根 Reducer

**Redux 应用程序实际上只有一个 reducer 函数：** 将“ root reducer ”传递给 `createStore` 函数。那个根 reducer 函数负责处理所有被 dispatching 的 actions，并计算每次所有的新 state 结果。

让我们首先在 `src` 文件夹中创建一个 `reducer.js` 文件， 同级是 `index.js` 和 `App.js`.

每个 reducer 都需要一些初始状态，所以将添加一些模拟的 todo 条目来帮助我们开始。然后，可以为 reducer 函数内部的逻辑写一个大纲：

```js title="src/reducer.js"
const initialState = {
  todos: [
    { id: 0, text: 'Learn React', completed: true },
    { id: 1, text: 'Learn Redux', completed: false, color: 'purple' },
    { id: 2, text: 'Build something fun!', completed: false, color: 'blue' }
  ],
  filters: {
    status: 'All',
    colors: []
  }
}

// 使用 initialState 作为默认值
export default function appReducer(state = initialState, action) {
  // reducer 通常会根据 action type 字段来决定发生什么
  switch (action.type) {
    // 根据不同 type 的 action 在这里做一些事情
    default:
      // 如果这个 reducer 不关心这个 action type，会返回原本的state
      return state
  }
}
```

Reducers 在初始化时如果未传值其值为 `undefined`，可以提供一个默认参数，以便后续代码可以使用。**Reducers 通常使用 ES6 默认参数语法来提供初始状态：`(state = initialState, action)`**。

接下来，添加处理 `'todos/todoAdded'` action 的逻辑。

首先需要根据当前 action 的类型是否与该特定字符串匹配。然后，需要返回一个包含所有状态的新对象，即使是那些没有改变的字段。

```js title="src/reducer.js"
function nextTodoId(todos) {
  const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
  return maxId + 1
}

// 使用初始化状态值作为默认值
export default function appReducer(state = initialState, action) {
  // reducer 通常会查看 action type 字段来决定发生什么
  switch (action.type) {
    // 根据不同 type 的 action ，进入不同的操作
    // highlight-start
    case 'todos/todoAdded': {
      // 需要返回一个新的 state 对象
      return {
        // 具有所有现有 state 数据
        ...state,
        // 但有一个用于 `todos` 字段的新数组
        todos: [
          // 所有旧待办事项
          ...state.todos,
          // 新的对象
          {
            // 在此示例中使用自动递增的数字 ID
            id: nextTodoId(state.todos),
            text: action.payload,
            completed: false
          }
        ]
      }
    }
    // highlight-end
    default:
      // 如果这个 reducer 不关心这个 action type，会返回原本的state
      return state
  }
}
```

将一个待办事项添加到 state 中需要做大量的工作。为什么所有这些额外的工作都是必要的？

### Reducers 规则

我们之前说过 **reducer 必须始终遵循一些特殊规则**：

- 应该只根据 `state` 和 `action` 参数计算新的状态值
- 不允许修改现有的 `state`。相反，必须通过复制现有值并对复制的值进行更改来进行 immutable updates 。
- 不能做任何异步逻辑或包含"副作用"

:::tip

**“ 副作用 ” 是在从函数返回值之外可以看到的状态或行为的任何变化**。一些常见的副作用是:

- 将值记录到控制台
- 保存文件
- 设置异步计时器
- 发出 AJAX HTTP 请求
- 修改存在于函数之外的某些状态，或改变函数的参数
- 生成随机数或唯一随机 ID（例如 `Math.random()` 或 `Date.now()`）

:::

任何遵循这些规则的函数也被称为 **" 纯 " 函数**（普通函数）。

但为什么这些规则很重要？有几个不同的原因：

- Redux 的目标之一是让你的代码可预测。如果仅根据输入参数计算函数的输出，则更容易理解该代码的工作原理并对其进行测试。
- 另一方面，如果一个函数依赖于自身外部的变量，或者行为随机，你永远不知道运行它时会发生什么。
- 如果一个函数修改了其他值，包括它的参数，这可能会改变应用程序的工作方式。这可能是常见的错误来源，例如 “ 我更新了状态，但现在我的 UI 没有在应该更新的时候更新！”
- 一些 Redux DevTools 功能依赖于让你的 reducer 正确地遵循这些规则

关于 “ immutable updates（不可变更新）” 的规则尤为重要，值得进一步讨论。

### Reducers 和 Immutable Updates

早些时候，我们谈到了 " mutation " (修改现有的对象/数组值) 和 " immutability " (无法更改).

:::警告

在 Redux 中，**我们的 reducer 永远不允许改变原始/当前状态值！**

```js
// ❌ 非法 - 默认情况下，这会改变状态！
state.value = 123
```

:::

在 Redux 中不能改变状态有几个原因：

- 会导致错误，例如 UI 无法正确更新显示最新值
- 这使得更难理解为什么以及如何更新状态
- 使编写测试变得更加困难
- 破坏了正确使用“时间旅行调试”的能力
- 违背了 Redux 的预期精神和使用模式

如果不能改变原始 state ，那么如何返回一个更新的 state 呢？

:::tip

**Reducers 只能 _复制_ 原始值，并只能改变这些副本。**

```js
// ✅ 做了复制，所以是安全的
return {
  ...state,
  value: 123
}
```

:::

我们可以[手动编写 immutable updates](./part-2-concepts-data-flow.md#immutability)，通过使用 JavaScript 的数组/对象扩展运算符和其他返回原始值副本的函数。

当数据嵌套时，这变得更加困难。**Immutable Updates 的一个关键规则是，你必须复制需要更新的每一层嵌套**。

但是，如果你认为“以这种方式手动编写 immutable updates 看起来很难记住和正确执行” ......啊对对对！:)

手工编写不可变的更新逻辑很困难，并且**在 reducer 中意外改变状态是 Redux 用户最常犯的一个错误**。

:::tip

**在实际应用程序中，你不必手动编写这些复杂的嵌套 Immutable Updates**。 在 [第 8 部分：使用 Redux Toolkit 的现代 Redux 中](./part-8-modern-redux.md)，你将学习如何使用 Redux Toolkit 来简化在 reducer 中编写 Immutable Updates 逻辑的过程。
:::

### 处理附加 Actions

考虑到这一点，我们来给更多的 case 添加 reducer 逻辑。首先，根据 ID 切换待办事项的“已完成”字段:

```js title="src/reducer.js"
export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case 'todos/todoAdded': {
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: nextTodoId(state.todos),
            text: action.payload,
            completed: false
          }
        ]
      }
    }
    // highlight-start
    case 'todos/todoToggled': {
      return {
        // 再次复制整个 state 对象
        ...state,
        // 这一次，我们需要复制旧的 todos 数组
        todos: state.todos.map(todo => {
          // 如果这不是我们要找的待办事项，别管它
          if (todo.id !== action.payload) {
            return todo
          }

          // 我们发现必须改变的待办事项。返回副本：
          return {
            ...todo,
            // 变更完成的标志
            completed: !todo.completed
          }
        })
      }
    }
    // highlight-end
    default:
      return state
  }
}
```

由于一直关注 todos 状态，添加一个案例来处理 “ visibility selection changed （可见性选择更改）” 操作：

```js title="src/reducer.js"
export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case 'todos/todoAdded': {
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: nextTodoId(state.todos),
            text: action.payload,
            completed: false
          }
        ]
      }
    }
    case 'todos/todoToggled': {
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id !== action.payload) {
            return todo
          }

          return {
            ...todo,
            completed: !todo.completed
          }
        })
      }
    }
    // highlight-start
    case 'filters/statusFilterChanged': {
      return {
        // 复制整个 state
        ...state,
        // 覆盖过滤器的值
        filters: {
          // 复制其他过滤器字段
          ...state.filters,
          // 并将状态字段替换为新值
          status: action.payload
        }
      }
    }
    // highlight-end
    default:
      return state
  }
}
```

只处理了 3 个动作，但已经有点长了。如果尝试处理这个 reducer 函数中的每一个 action，那么将很难阅读所有内容。

这就是为什么 **reducer 通常被拆分为多个较小的 reducer 函数**的原因 - 以便更容易理解和维护 reducer 逻辑。

## 拆分 Reducers

作为其中的一部分，**Redux reducer 通常根据更新的 Redux state 部分进行拆分**。我们的 todo 应用 state 当前有两个顶级部分：`state.todos` 和 `state.filters`。因此，可以将大的根 reducer 函数拆分为两个较小的 reducer - `todosReducer` 和 `filtersReducer`。

那么，这些拆分的 reducer 函数应该放在哪里呢？

**建议根据 " features "** - （与应用程序的特定概念或区域相关的代码）来组织 Redux 应用程序文件夹和文件。**特定功能的 Redux 代码通常编写为单个文件，称为 “ slice ” 文件**，其中包含所有 reducer 逻辑和所有与应用程序状态部分相关的操作代码。

因此，**Redux 应用程序状态的特定部分的 redux 应用 state 称为“ slice reducer ”**。通常，一些 actions 对象将与特定的 slice reducer 密切相关，因此 action type 字符串应该以该功能的名称（像 `'todos'`）开头，并描述发生的事件 (像 `'todoAdded'`)， 连接在一起成为一个字符串 (`'todos/todoAdded'`)。

在项目中，新建一个 `features` 文件夹，然后在里面创建一个 `todos` 文件夹。新建一个名为 `todosSlice.js` 的文件，然后将与 todo 相关的初始状态复制粘贴到该文件中：

```js title="src/features/todos/todosSlice.js"
const initialState = [
  { id: 0, text: 'Learn React', completed: true },
  { id: 1, text: 'Learn Redux', completed: false, color: 'purple' },
  { id: 2, text: 'Build something fun!', completed: false, color: 'blue' }
]

function nextTodoId(todos) {
  const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
  return maxId + 1
}

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state
  }
}
```

复制更新 todos 的逻辑。但是，这里有一个重要的区别。**这个文件只需要更新 todos 相关的状态——不再嵌套了！** 这是我们拆分 redux 的另一个原因。由于 todos 状态本身就是一个数组，因此不必在此处复制外部根 state 对象。这让 reducer 更容易阅读。

这称为 **reducer composition**，它是构建 Redux 应用程序的基本模式。

这是处理完这些操作后更新的 reducer：

```js title="src/features/todos/todosSlice.js"
export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    // highlight-start
    case 'todos/todoAdded': {
      // 可以只返回新的 todos 数组 - 周围没有额外的对象
      return [
        ...state,
        {
          id: nextTodoId(state),
          text: action.payload,
          completed: false
        }
      ]
    }
    case 'todos/todoToggled': {
      return state.map(todo => {
        if (todo.id !== action.payload) {
          return todo
        }

        return {
          ...todo,
          completed: !todo.completed
        }
      })
    }
    //highlight-end
    default:
      return state
  }
}
```

这比较短，更容易阅读。

现在我们可以对可见性逻辑做同样的事情。创建 `src/features/filters/filtersSlice.js`，然后将所有与 redux 相关的代码移到那里：

```js title="src/features/filters/filtersSlice.js"
const initialState = {
  status: 'All',
  colors: []
}

export default function filtersReducer(state = initialState, action) {
  switch (action.type) {
    // highlight-start
    case 'filters/statusFilterChanged': {
      return {
        // 同样，要复制的嵌套层次少了一层
        ...state,
        status: action.payload
      }
    }
    // highlight-end
    default:
      return state
  }
}
```

依旧需要复制包含过滤器状态的对象，但由于嵌套较少，因此更容易阅读正在发生的事情。

:::info

为了使这个页面更短，将跳过展示其他 reducer 更新逻辑的操作。

根据[上述要求](#defining-requirements)，**尝试自己编写**。

如果遇到困难，请参阅[本页末尾的 CodeSandbox](#what-youve-learned)， 了解这些 reducer 的完整实现。

:::

## 组合 Reducers

现在有两个独立的 slice 文件，每个文件都有自己的 slice reducer 函数。但是，Redux 存储在创建时需要 _一个_ 根 reducer 函数。那么，如何才能在不将所有代码放在一个大函数中的情况下重新使用根 redux 呢？

由于 reducers 是一个普通的 JS 函数，我们可以将 slice reducer 重新导入 `reducer.js`，并编写一个新的根 reducer，它唯一的工作就是调用其他两个函数。

```js title="src/reducer.js"
import todosReducer from './features/todos/todosSlice'
import filtersReducer from './features/filters/filtersSlice'

export default function rootReducer(state = {}, action) {
  // 返回一个新的根 state 对象
  return {
    // `state.todos` 的值是 todos reducer 返回的值
    todos: todosReducer(state.todos, action),
    // 对于这两个reducer，我们只传入它们的状态 slice
    filters: filtersReducer(state.filters, action)
  }
}
```

**请注意，这些 reducer 中的每一个都在管理自己的全局状态部分。每个 reducer 的 state 参数都是不同的，并且对应于它管理的 state 部分。**

这使我们能够根据功能和 slices 状态拆分逻辑，以保持可维护性。

### `combineReducers`（组合 Reducers ）

新的根 reducer 对每个 slice 都做同样的事情：调用 slice reducer，传入属于该 reducer 的 state slice，并将结果分配回根 state 对象。如果要添加更多 slice ，则重复该模式。

Redux 核心库包含一个名为 [`combineReducers`](../../api/combineReducers.md) 的实用程序，它为我们执行相同的样板步骤。我们可以用 `combineReducers` 生成的较短的 `rootReducer` 替换手写的 `rootReducer`。

**现在我们需要 `combineReducers`， 是时候实际安装 Redux 核心库了**：

```js
npm install redux
```

完成后，可以导入并使用 `combineReducers` ：

```js title="src/reducer.js"
// highlight-next-line
import { combineReducers } from 'redux'

import todosReducer from './features/todos/todosSlice'
import filtersReducer from './features/filters/filtersSlice'

const rootReducer = combineReducers({
  // 定义一个名为`todos`的顶级状态字段，由`todosReducer`处理
  todos: todosReducer,
  filters: filtersReducer
})

export default rootReducer
```

`combineReducers` 接受一个对象，其中键名将成为根 state 对象中的键，值是描述如何更新 Redux 状态的 slice reducer 函数。

**记住，你给 `combineReducers` 的键名决定了你的状态对象的键名是什么！**

## 你学到了

**State，Actions，和 Reducers 是 Redux 的构建模块**。每个 Redux 应用都有 state 值，创建 actions 来描述发生的事情，并使用 reducer 函数根据之前的 state 和 action 计算新的状态值。

到目前为止，这是我们应用程序的内容：

<iframe 
  class="codesandbox"
  src="https://codesandbox.io/embed/github/reduxjs/redux-fundamentals-example-app/tree/checkpoint-1-combinedReducers/?fontsize=14&hidenavigation=1&module=%2Fsrc%2Freducer.js&theme=dark&runonclick=1"
  title="redux-fundamentals-example-app"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

:::tip 总结

- **Redux 应用程序使用普通的 JS 对象、数组和 primitives 作为状态值**
  - 根状态值应该是一个普通的 JS 对象
  - 状态应该包含使应用程序工作所需的最少数据量
  - 类、Promises、函数和其他非普通值不应进入 Redux 状态
  - redux 不得创建随机值，例如 `Math.random()` 或 `Date.now()`
  - 可以将其他不在 Redux 存储中的状态值（如本地组件状态）与 Redux 并排放置
- **actions 是带有 `type` 并且描述发生了什么的普通对象**
  - 该 `type` 字段应该是一个可读的字符串，通常写成 `'feature/eventName'`
  - 动作可能包含其他值，这些值通常存储在 `action.payload` 字段中
  - 操作应该包含描述发生的事情所需的最少数据量
- **Reducers 是看起来像的函数 `(state, action) => newState`**
  - Reducers 必须始终遵循特殊规则：
    - 仅根据 `state` 和 `action` 参数计算新状态
    - 永远不要改变现有的 `state` - 总是返回一个副本
    - 不要有像 AJAX 调用或异步逻辑这样的“副作用”
- **Reducers 应该被拆分以使它们更易于阅读**
  - Reducer 通常根据顶级状态键或状态“ slices ”进行拆分
  - Reducers 通常写在“ slice ”文件中，组织成“ feature ”文件夹
  - Reducers 可以与 Redux `combineReducers` 函数结合使用
  - 用于 `combineReducers` 定义顶级状态对象键的键名

:::

## 下一步

现在有一些 reducer 逻辑可以更新状态，但是这些 reducer 不会自己做任何事情。它们需要放在 Redux 存储中，当发生某些事情时，可以通过操作调用 reducer 代码。

在[第 4 部分：store](./part-4-store.md)中, 我们将看到如何创建 Redux 存储并运行 reducer 逻辑。
