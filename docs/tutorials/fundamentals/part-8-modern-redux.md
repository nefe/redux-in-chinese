---
id: part-8-modern-redux
title: 'Redux 深入浅出，第 8 节：使用 Redux Toolkit 的现代 Redux'
sidebar_label: '使用 Redux Toolkit 的现代 Redux'
description: 'Redux 官方基础教程：学习编写 Redux 逻辑的现代方法'
---

import { DetailedExplanation } from '../../components/DetailedExplanation'

# Redux 深入浅出，第 8 节：使用 Redux Toolkit 的现代 Redux

:::tip 你将学到

- 如何使用 Redux Toolkit 来简化 Redux 逻辑
- 学习和使用 Redux 的后续步骤

:::

恭喜你进入本教程的最后一部分！在此之前，我们还有一个主题要讨论。

如果你想回顾截止目前为止所涵盖的内容，请查看以下摘要：

:::info 提示

<DetailedExplanation title="回顾：你的所学">

- [第 1 节：Redux 概览](./part-1-overview.md)：
  - Redux 是什么，何时/为什么使用它，以及 Redux 应用程序的基本部分
- [第 2 节：概念与数据流](./part-2-concepts-data-flow.md)：
  - Redux 如何使用“单向数据流”模式
- [第 3 节：State，Actions 和 Reducers](./part-3-state-actions-reducers.md)：
  - Redux state 由普通的 JS 对象组成
  - Actions 是描述应用程序中“发生了什么”事件的对象
  - Reducers 根据当前的 state 和 action，计算出一个新的 state
  - Reducers 必须遵循“不可变更新”和“无副作用”等规则
- [第 4 节：Store](./part-4-store.md)：
  - `createStore` API 使用根 reducer 函数创建 Redux store
  - 可以使用 enhancers 和 middleware 来自定义 store
  - Redux DevTools 扩展使你可以查看 state 的变化
- [第 5 节：UI 和 React](./part-5-ui-and-react.md)：
  - Redux 独立于任何 UI，但经常与 React 一起使用
  - React-Redux 提供 API 使得 React 组件能够与 Redux store 进行交互
  - `useSelector` 从 Redux state 中读取值并订阅更新
  - `useDispatch` 使得组件能够 dispatch actions
  - 使用 `<Provider>` 包裹应用程序，使得组件能够访问 store
- [第 6 节：异步逻辑和数据获取](./part-6-async-logic.md)：
  - Redux middleware 支持编写具有副作用的逻辑
  - Middleware 向 Redux 数据流添加了一个额外的步骤，以启用异步逻辑
  - Redux “thunk” 函数是编写基本异步逻辑的标准方式
- [第 7 节：标准 Redux 模式](./part-7-standard-patterns.md)：
  - Action creators 封装了 action 对象和 thunk
  - 记忆化 selectors 用于优化转换数据的计算
  - 应该通过 loading state 枚举值来跟踪请求状态
  - 归一化 state 使通过 ID 查找 items 更容易

</DetailedExplanation>

:::

如你所见，Redux 涉及编写一些冗长的代码，例如不可变更新、action types 和 action creators，以及归一化 state。虽然这些模式有充分的存在理由，但是“手动”编写这些代码可能是比较困难的。此外，设置 Redux store 的过程需要几个步骤，我们必须提出自己的逻辑来处理诸如在 thunk 中 dispatch “loading” action 或处理归一化数据等事情。最后，很多时候用户不确定编写 Redux 逻辑的“正确方法”是什么。

这就是为什么 Redux 团队创建了 [**Redux Toolkit**：官方的、预设最佳实践的、功能齐备的工具集，用于高效的 Redux 开发](https://redux-toolkit.js.org)。

Redux Toolkit 包含了对于构建 Redux 应用程序至关重要的包和函数。它构建在我们建议的最佳实践中，简化了大多数 Redux 任务，避免了常见错误，使得编写 Redux 应用程序更容易了。

因此，**Redux Toolkit 是编写 Redux 应用程序逻辑的标准方式**。到目前为止，虽然你在本教程中“手写”的 Redux 逻辑是实际可行的代码，但是**你不应该手动编写 Redux 逻辑**——我们在本教程中介绍这些方法，是为了帮助你理解 Redux 是 _如何_ 工作的。但是，**对于实际应用程序，你应该使用 Redux Toolkit 来编写 Redux 逻辑。**

当你使用 Redux Toolkit 时，到目前为止介绍的所有概念（actions、reducers、store setup、action creators、thunk 等）仍然存在，但是**Redux Toolkit 提供了更简单的方法来编写代码**。

:::tip 提示

Redux Toolkit _仅_ 涵盖了 Redux 逻辑——仍然需要使用 React-Redux 使得 React 组件与 Redux store 进行交互，包括 `useSelector` 和 `useDispatch`。

:::

那么，让我们看看如何通过 Redux Toolkit 来简化 todo 应用程序中已经编写的代码。我们主要将重写 slice 文件，但要保持所有 UI 代码相同。

在继续前，**先将 Redux Toolkit 包添加到应用程序**：

```bash
npm install @reduxjs/toolkit
```

## 设置 Store

Redux store 已经经历了几次设置逻辑的迭代。目前，它看起来像这样：

```js title="src/rootReducer.js"
import { combineReducers } from 'redux'

import todosReducer from './features/todos/todosSlice'
import filtersReducer from './features/filters/filtersSlice'

const rootReducer = combineReducers({
  // 定义一个名为 `todos` 的顶级 state 字段，值为 `todosReducer`
  todos: todosReducer,
  filters: filtersReducer
})

export default rootReducer
```

```js title="src/store.js"
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducer'

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))

const store = createStore(rootReducer, composedEnhancer)
export default store
```

请注意，设置过程需要几个步骤。我们必须：

- 将 slice reducers 组合在一起形成根 reducer
- 将根 reducer 导入到 store 文件中
- 导入 thunk middleware、`applyMiddleware` 和 `composeWithDevTools` API
- 使用 middleware 和 devtools 创建 store enhancer
- 使用根 reducer 创建 store

如果我们可以减少这里的步骤数，那就太好了。

### 使用 `configureStore`

**Redux Toolkit 的 `configureStore` API，可简化 store 的设置过程**。`configureStore` 包裹了 Redux 核心 `createStore` API，并自动为我们处理大部分 store 设置逻辑。事实上，我们可以有效地将其缩减为一步：

```js title="src/store.js"
// highlight-next-line
import { configureStore } from '@reduxjs/toolkit'

import todosReducer from './features/todos/todosSlice'
import filtersReducer from './features/filters/filtersSlice'

// highlight-start
const store = configureStore({
  reducer: {
    // 定义一个名为 `todos` 的顶级 state 字段，值为 `todosReducer`
    todos: todosReducer,
    filters: filtersReducer
  }
})
// highlight-end

export default store
```

`configureStore` 为我们完成了所有工作：

- 将 `todosReducer` 和 `filtersReducer` 组合到根 reducer 函数中，它将处理看起来像 `{todos, filters}` 的根 state
- 使用根 reducer 创建了 Redux store
- 自动添加了 “thunk” middleware
- 自动添加更多 middleware 来检查常见错误，例如意外改变（mutate）state
- 自动设置 Redux DevTools 扩展连接

我们可以通过打开并使用 todo 应用程序来确认它是否有效。所有的现有功能代码都可以正常工作！Dispatch actions、dispatch thunks、读取 UI 中的 state 以及查看 DevTools 中的 action 历史记录，所有这些部分都必须正常工作。我们所做的只是改写了 store 的设置代码。

来看下如果我们不小心改变了一些 state 会发生什么。比如在 “todos loading” reducer 里直接修改 state 字段，而不是拷贝副本呢？

```js title="src/features/todos/todosSlice"
export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    // 省略其他 cases
    case 'todos/todosLoading': {
      // ❌ 警告：仅示例 - 不要在普通 reducer 中执行此操作！
      state.status = 'loading'
      return state
    }
    default:
      return state
  }
}
```

整个应用程序崩溃了！发生了什么？

![Immutability check middleware error](/img/tutorials/fundamentals/immutable-error.png)

**这个报错是件_好事_——我们在应用程序中发现了一个错误！**`configureStore` 特别添加了一个额外的 middleware，当它检测到 state 发生意外突变时会自动抛出错误（仅在开发模式下）。这有助于捕获编码时可能犯的错误。

### 包清理

Redux Toolkit 已经包含了我们正在使用的几个包，例如 `redux`、`redux-thunk` 和 `reselect`，并重新导出了这些 API。所以，我们可以稍微清理一下项目。

首先，我们可以将 `createSelector` 导入切换为来自 `'@reduxjs/toolkit'` 而不是 `'reselect'`。然后，我们可以删除在 `package.json` 中列出的单独包：

```js
npm uninstall redux redux-thunk reselect
```

需要明确的是，**我们仍在使用这些软件包，并需要安装它们**。但是，由于 Redux Toolkit 依赖于它们，所以它们会在安装 `@reduxjs/toolkit` 时自动被安装，因此我们不需要在 `package.json` 文件中专门列出其他包。

## 编写 Slices

随着我们不断向应用程序添加新功能，slice 文件变得更大更复杂了。特别是 `todosReducer` 变得更难阅读，因为扩展所有的嵌套对象都是为了不可变更新，而且我们已经编写了多个 action creator 函数。

**Redux Toolkit 的 `createSlice` API，将帮助我们简化 Redux reducer 逻辑和 actions**。`createSlice` 为我们做了几件重要的事情：

- 可以将 case reducer 编写为对象内部的函数，而不必编写 `switch/case` 语句
- reducer 将能够编写更短的不可变更新逻辑
- 所有 action creators 将根据我们提供的 reducer 函数自动生成

### 使用 `createSlice`

`createSlice` 接收一个包含三个主要选项字段的对象：

- `name`：一个字符串，将用作生成的 action types 的前缀
- `initialState`：reducer 的初始 state
- `reducers`：一个对象，其中键是字符串，值是处理特定 actions 的 “case reducer” 函数

让我们先看一个独立的小示例。

```js title="createSlice  example"
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  entities: [],
  status: null
}

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoAdded(state, action) {
      // ✅ “突变”（mutate）代码在 createSlice 中是可以的！
      state.entities.push(action.payload)
    },
    todoToggled(state, action) {
      const todo = state.entities.find(todo => todo.id === action.payload)
      todo.completed = !todo.completed
    },
    todosLoading(state, action) {
      return {
        ...state,
        status: 'loading'
      }
    }
  }
})

export const { todoAdded, todoToggled, todosLoading } = todosSlice.actions

export default todosSlice.reducer
```

在此示例中可以看到几件事：

- 我们在 `reducers` 对象中编写 case reducer 函数，并赋予它们高可读性的名称
- **`createSlice` 会自动生成对应于每个 case reducer 函数的 action creators**
- createSlice 在默认情况下自动返回现有 state
- **`createSlice` 允许我们安全地“改变”（mutate）state！**
- 但是，如果愿意，我们也可以像以前一样拷贝不可变副本

生成的 action creators 将作为 `slice.actions.todoAdded` 提供，我们通常像之前编写的 action creators 一样单独解构和导出它们。完整的 reducer 函数可以作为 `slice.reducer` 使用，和之前一样，我们通常会 `export default slice.reducer`。

那么这些自动生成的 action 对象是什么样的呢？让我们调用并打印其中一个 action 来看下：

```js
console.log(todoToggled(42))
// {type: 'todos/todoToggled', payload: 42}
```

`createSlice` 通过将 slice 的`name` 字段与 reducer 函数的 `todoToggled` 名称相结合，为我们生成了 action type 字符串。默认情况下，action creator 接收一个参数，并将其作为 “action.payload” 放入 action 对象中。

在生成的 reducer 函数内部，`createSlice` 将检查 dispatch action 的 `action.type` 是否与它生成的名称之一相匹配。如果匹配成功，它将运行那个 case reducer 函数。这和使用 `switch/case` 语句编写的模式完全相同，但 `createSlice` 会自动为我们完成。

更详细地讨论“突变（mutation）”也是有意义的。

### 使用 Immer 进行不可变更新

早些时候，我们谈到了“突变”（修改现有对象/数组值）和“不可变性”（将值视为无法更改的东西）。

:::warning 警告

在 Redux 中，**reducer _绝对_ 不允许改变原始/当前 state 值！**

```js
// ❌ 非法的——默认情况下，这将改变 state！
state.value = 123
```

:::

那么如果我们不能改变原始值，要如何返回一个更新后的 state 呢？

:::tip 提示

**reducers 只能复制原始值，然后改变副本。**

```js
// 安全的，因为复制了副本
return {
  ...state,
  value: 123
}
```

:::

正如你在本教程中所看到的，我们可以使用 JavaScript 的数组/对象扩展运算符以及其他返回原始值副本的函数，手动编写不可变更新的逻辑。然而，这是困难的，也容易导致在 reducer 中意外地改变（mutate）state，是 Redux 用户最常犯的一个错误。

**这就是 Redux Toolkit 的 `createSlice` 函数让你以更简单的方式编写不可变更新的原因！**

`createSlice` 在内部使用了一个名为 [Immer](https://immerjs.github.io/immer/) 的库。Immer 使用称为 Proxy 的特殊 JS 工具来包装你提供的数据，并允许你编写代码来“更改”包装后的数据。但是，**Immer 会跟踪所有更改，然后使用更改列表返回一个安全不可变更新的值**，看起来就像手动编写了所有不可变更新逻辑一样。

所以不需要这样编写：

```js
function handwrittenReducer(state, action) {
  return {
    ...state,
    first: {
      ...state.first,
      second: {
        ...state.first.second,
        [action.someId]: {
          ...state.first.second[action.someId],
          fourth: action.someValue
        }
      }
    }
  }
}
```

可以这样写：

```js
function reducerWithImmer(state, action) {
  state.first.second[action.someId].fourth = action.someValue
}
```

可读性好太多了！

但是，谨记以下 _非常_ 重要的内容：

:::warning 警告

**你 _只能_ 在 Redux Toolkit 的 `createSlice` 和 `createReducer` 中编写“突变”（mutation）逻辑，因为它们在内部使用了 Immer！如果你在没有 Immer 的 reducer 中编写“突变”逻辑，它 _将_ 改变（mutate）state 并导致错误！**

:::

Immer 仍然允许我们手动编写不可变的更新，并在需要时自己返回新值。你甚至可以混搭。例如，使用 `array.filter()` 从数组中删除一项通常会更容易，因此你可以调用并将结果分配给 `state` 来“改变”（mutate）它：

```js
// 可以在 Immer 中混合“突变”和“不可变更新”代码：
state.todos = state.todos.filter(todo => todo.id !== action.payload)
```

### 改造 Todos Reducer

让我们使用 `createSlice` 来开始改造 todos slice 文件。首先从 switch 语句中挑选几个特定的 case 来展示这个过程是如何工作的。

```js title="src/features/todos/todosSlice.js"
// highlight-next-line
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  status: 'idle',
  entities: {}
}

// highlight-start
const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoAdded(state, action) {
      const todo = action.payload
      state.entities[todo.id] = todo
    },
    todoToggled(state, action) {
      const todoId = action.payload
      const todo = state.entities[todoId]
      todo.completed = !todo.completed
    }
  }
})

export const { todoAdded, todoToggled } = todosSlice.actions

export default todosSlice.reducer
// highlight-end
```

示例应用程序中的 todos reducer 仍然使用嵌套在父对象中的归一化 state，因此这里的代码与我们刚刚看到的 `createSlice` 示例有点不同。还记得我们之前是如何不得不[编写大量嵌套扩展运算符来切换 todo 的吗？](./part-7-standard-patterns.md#normalized-state)现在，代码变得更短且更易于阅读。

让我们在这个 reducer 中再添加几个 case。

```js title="src/features/todos/todosSlice.js"
const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoAdded(state, action) {
      const todo = action.payload
      state.entities[todo.id] = todo
    },
    todoToggled(state, action) {
      const todoId = action.payload
      const todo = state.entities[todoId]
      todo.completed = !todo.completed
    },
    // highlight-start
    todoColorSelected: {
      reducer(state, action) {
        const { color, todoId } = action.payload
        state.entities[todoId].color = color
      },
      prepare(todoId, color) {
        return {
          payload: { todoId, color }
        }
      }
    },
    todoDeleted(state, action) {
      delete state.entities[action.payload]
    }
    // highlight-end
  }
})

export const { todoAdded, todoToggled, todoColorSelected, todoDeleted } =
  todosSlice.actions

export default todosSlice.reducer
```

`todoAdded` 和 `todoToggled` 的 action creators 只需要接受一个参数，例如整个 todo 对象或 todo ID。但是，如果我们需要传入多个参数，或者处理一些“准备”逻辑，比如生成一个唯一的 ID，该怎么办？

`createSlice` 允许我们通过向 reducer 添加“准备回调”函数来处理这些情况。我们可以传递一个具有名为 `reducer` 和 `prepare` 这两个函数的对象。当我们调用生成的 action creator 时，“准备回调”函数会使用传入的任何参数被调用。然后它应该创建并返回一个具有 payload 字段（或者，可选的 meta 和 error 字段）的对象，符合 [Flux Standard Action 约定](./part-7-standard-patterns.md#flux-standard-actions)。

在这里，我们使用了一个“准备回调”来让 `todoColorSelected` action creator 接收 `todoId` 和 `color` 参数，并将它们作为一个对象放在 `action.payload` 中。

同时，在 `todoDeleted` reducer 中，我们可以使用 JS 的 `delete` 操作符从归一化 state 中删除某项。

我们可以使用相同的模式去重写 `todosSlice.js` 和 `filtersSlice.js` 中其余的 reducer。

以下是将所有 slices 改写后的样子：

<iframe
  class="codesandbox"
  src="https://codesandbox.io/embed/github/reduxjs/redux-fundamentals-example-app/tree/checkpoint-9-createSlice/?fontsize=14&hidenavigation=1&theme=dark&module=%2Fsrc%2Ffeatures%2Ftodos%2FtodosSlice.js&runonclick=1"
  title="redux-fundamentals-example-app"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

## 编写 Thunks

我们已经了解了如何[编写能够 dispatch “loading”、“request succeeded” 和 “request failed” 这几个 actions 对应的 thunk](./part-7-standard-patterns.md#loading-state-enum-values)。我们必须编写 action creators、action types、_以及_ reducers 来处理这些情况。

因为这种模式很常见，**Redux Toolkit 提供的 `createAsyncThunk` API 可以为我们生成这些 thunks**。它还为那些不同的请求状态 actions 生成 action types 和 action creators，并根据生成的 `Promise` 自动 dispatch 这些 actions。

:::tip 提示

Redux Toolkit 有一个新的 [**RTK Query 数据获取 API**](https://redux-toolkit.js.org/rtk-query/overview)。RTK Query 是专门为 Redux 应用程序构建的数据获取和缓存解决方案，并且**可以去除编写 _任何_ thunk 或 reducer 来管理数据获取的必要**。我们鼓励你尝试一下，看看它是否有助于简化你的应用程序中的数据获取代码！

我们将很快更新 Redux 教程，以包含有关使用 RTK Query 的部分。在此之前，请参阅 [Redux Toolkit 文档中的 RTK 查询部分](https://redux-toolkit.js.org/rtk-query/overview)。

:::

### 使用 `createAsyncThunk`

让我们通过使用 `createAsyncThunk` 生成一个 thunk 来替换 `fetchTodos` thunk。

`createAsyncThunk` 接收两个参数：

- 一个字符串，用作生成的 action types 的前缀
- 一个 payload creator 回调函数，应该返回一个 `Promise`。这通常使用 `async/await` 语法编写，因为 `async` 函数会自动返回一个 Promise。

```js title="src/features/todos/todosSlice.js"
// highlight-next-line
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// 省略 imports 和 state

// highlight-start
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await client.get('/fakeApi/todos')
  return response.todos
})
// highlight-end

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // 省略 reducer cases
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTodos.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        const newEntities = {}
        action.payload.forEach(todo => {
          newEntities[todo.id] = todo
        })
        state.entities = newEntities
        state.status = 'idle'
      })
  }
})

// 省略 exports
```

我们传递 `'todos/fetchTodos'` 作为字符串前缀，以及一个调用 API 并返回包含获取数据的 promise 的 payload creator 函数。在内部，`createAsyncThunk` 将生成三个 action creators 和 action types，以及一个在调用时自动 dispatch 这些 actions 的 thunk 函数。在这种情况下，action creators 和它们 types 是：

- `fetchTodos.pending`：`todos/fetchTodos/pending`
- `fetchTodos.fulfilled`：`todos/fetchTodos/fulfilled`
- `fetchTodos.rejected`：`todos/fetchTodos/rejected`

但是，这些 action creators 和 types 是在 `createSlice` 调用 _之外_ 定义的。我们无法在 `createSlice.reducers` 中处理它们，因为它们也会生成新的 action types。我们需要一种方法来让 `createSlice` 调用，用于监听在别处定义的 _其他_ action types。

**`createSlice` 还接收一个叫 `extraReducers` 的选项，可以让同一个 slice reducer 监听其他 action types**。这个字段应该是一个带有 `builder` 参数的回调函数，我们可以调用 `builder.addCase(actionCreator, caseReducer)` 来监听其他 actions。

所以，这里我们调用了 `builder.addCase(fetchTodos.pending, caseReducer)`。当该 action 被 dispatch 时，我们将运行设置 `state.status = 'loading'` 的 reducer，和之前在 switch 语句中编写该逻辑时做的一样。我们可以对 fetchTodos.fulfilled 做同样的事情，并处理我们从 API 接收到的数据。

再举个例子，让我们来改造 `saveNewTodo`。此 thunk 将新 todo 对象的 text 作为其参数，并将其保存到服务器。该如何处理？

```js title="src/features/todos/todosSlice.js"
// 省略 imports

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await client.get('/fakeApi/todos')
  return response.todos
})

// highlight-start
export const saveNewTodo = createAsyncThunk('todos/saveNewTodo', async text => {
  const initialTodo = { text }
  const response = await client.post('/fakeApi/todos', { todo: initialTodo })
  return response.todo
})
// highlight-end

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // 省略 case reducers
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTodos.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        const newEntities = {}
        action.payload.forEach(todo => {
          newEntities[todo.id] = todo
        })
        state.entities = newEntities
        state.status = 'idle'
      })
      // highlight-start
      .addCase(saveNewTodo.fulfilled, (state, action) => {
        const todo = action.payload
        state.entities[todo.id] = todo
      })
    // highlight-end
  }
})

// 省略 exports 和 selectors
```

`saveNewTodo` 的过程和 `fetchTodos` 相同。我们调用 `createAsyncThunk`，并传入 action 前缀和 payload creator。在 payload creator 中，我们进行异步 API 调用，并返回一个结果值。

在这种情况下，当我们调用 `dispatch(saveNewTodo(text))` 时，`text` 值将作为其第一个参数传递给 payload creator。

虽然我们不会在这里更详细地介绍 `createAsyncThunk`，但还是有一些其他的便条供你参考：

- dispatch 时只能将一个参数传递给 thunk。如果需要传递多个值，请将它们传递到一个对象中
- payload creator 将接收一个对象作为其第二个参数，其中包含 `{getState，dispatch}` 和一些其他有用值
- thunk 在运行 payload creator 之前会 dispatch `pending` action，然后根据返回的 `Promise` 是成功还是失败来 dispatch `fulfilled` 或 `rejected`

## 归一化 State

我们之前看到了如何通过将 items 保存在由它的 ID 作为键的对象中来“归一化” state。这使我们能够通过 ID 查找任何的 items，而无需遍历整个数组。但是，手动编写更新归一化 state 的逻辑是冗长而乏味的。使用 Immer 编写“突变”（mutate）更新代码会更简单，但仍然可能存在很多重复的工作——我们可能会在应用程序中加载许多不同类型的 items，并且每次都必须重复相同的 reducer 逻辑。

**Redux Toolkit 包含 `createEntityAdapter` API，该 API 为具有归一化 state 的典型数据更新操作预先构建了 reducer**。包括从 slice 中添加、更新和删除 items。**`createEntityAdapter` 还会生成一些用于从 store 中读取值的记忆化 selectors**。

### 使用 `createEntityAdapter`

让我们用 `createEntityAdapter` 替换我们归一化的实体 reducer 逻辑。

调用 `createEntityAdapter` 会为我们返回一个“适配器”对象，其中包含几个预置的 reducer 函数，包括：

- `addOne` / `addMany`：向 state 添加新 items
- `upsertOne` / `upsertMany`：添加新 items 或更新现有 items
- `updateOne` / `updateMany`：通过提供部分值更新现有 items
- `removeOne` / `removeMany`：根据 ID 删除 items
- `setAll`：替换所有现有 items

我们可以将这些函数用作 case reducers，或用作 `createSlice` 内部的“突变助手”（mutating helpers）。

该适配器还包含：

- `getInitialState`：返回一个类似于 `{ ids: [], entities: {} }` 的对象，用于存储 item 的标准化 state 以及包含所有 item ID 的数组
- `getSelectors`：生成一组标准的 selector 函数

让我们看看如何在 todos slice 中使用它们：

```js title="src/features/todos/todosSlice.js"
// highlight-start
import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter
} from '@reduxjs/toolkit'
// omit some imports

// highlight-start
const todosAdapter = createEntityAdapter()

const initialState = todosAdapter.getInitialState({
  status: 'idle'
})
// highlight-end

// omit thunks

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // 省略一些 reducers
    // highlight-start
    // 使用适配器 reducer 函数按 ID 删除 todo
    todoDeleted: todosAdapter.removeOne,
    // highlight-end
    completedTodosCleared(state, action) {
      const completedIds = Object.values(state.entities)
        .filter(todo => todo.completed)
        .map(todo => todo.id)
      // highlight-start
      // 使用适配器函数作为“突变”更新助手
      todosAdapter.removeMany(state, completedIds)
      // highlight-end
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTodos.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        todosAdapter.setAll(state, action.payload)
        state.status = 'idle'
      })
      // highlight-start
      // 使用另一个适配器函数作为 reducer 来添加 todo
      .addCase(saveNewTodo.fulfilled, todosAdapter.addOne)
    // highlight-end
  }
})

// 省略 selectors
```

不同的适配器 reducer 根据函数采用不同的值，都在 `action.payload` 中。add 和 upsert 函数采用单个 item 或 item 数组，remove 函数采用单个 ID 或 ID 数组，依此类推。

`getInitialState` 允许我们传入额外的 state 字段。所以我们传入了一个 status 字段，用来提供 `{ids,entities,status}` 最终的 todos slice state，就像我们之前所做的一样。

同样，我们也可以替换一些 todos selector 函数。`getSelectors` 适配器函数将生成 selector，例如 `selectAll` 会返回一个包含所有 items 的数组，`selectById` 会返回一个 item。但是，由于 `getSelectors` 不知道数据在整个 Redux state 树中的位置，所以我们需要传入一个小的 selector 来将这个 slice 从整个 state 树中返回。让我们来改用这些。由于这将是最后一次重大更改，我们将涵盖整个 todos slice 文件，来看下使用 Redux Toolkit 的代码最终版：

```js title="src/features/todos/todosSlice.js"
import {
  createSlice,
  createSelector,
  createAsyncThunk,
  createEntityAdapter
} from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { StatusFilters } from '../filters/filtersSlice'

const todosAdapter = createEntityAdapter()

const initialState = todosAdapter.getInitialState({
  status: 'idle'
})

// Thunk 函数
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await client.get('/fakeApi/todos')
  return response.todos
})

export const saveNewTodo = createAsyncThunk('todos/saveNewTodo', async text => {
  const initialTodo = { text }
  const response = await client.post('/fakeApi/todos', { todo: initialTodo })
  return response.todo
})

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoToggled(state, action) {
      const todoId = action.payload
      const todo = state.entities[todoId]
      todo.completed = !todo.completed
    },
    todoColorSelected: {
      reducer(state, action) {
        const { color, todoId } = action.payload
        state.entities[todoId].color = color
      },
      prepare(todoId, color) {
        return {
          payload: { todoId, color }
        }
      }
    },
    todoDeleted: todosAdapter.removeOne,
    allTodosCompleted(state, action) {
      Object.values(state.entities).forEach(todo => {
        todo.completed = true
      })
    },
    completedTodosCleared(state, action) {
      const completedIds = Object.values(state.entities)
        .filter(todo => todo.completed)
        .map(todo => todo.id)
      todosAdapter.removeMany(state, completedIds)
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTodos.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        todosAdapter.setAll(state, action.payload)
        state.status = 'idle'
      })
      .addCase(saveNewTodo.fulfilled, todosAdapter.addOne)
  }
})

export const {
  allTodosCompleted,
  completedTodosCleared,
  todoAdded,
  todoColorSelected,
  todoDeleted,
  todoToggled
} = todosSlice.actions

export default todosSlice.reducer

// highlight-start
export const { selectAll: selectTodos, selectById: selectTodoById } =
  todosAdapter.getSelectors(state => state.todos)
// highlight-end

export const selectTodoIds = createSelector(
  // 首先，传递一个或多个 input selector 函数：
  selectTodos,
  // 然后，一个 output selector 接收所有输入结果作为参数
  // 并返回最终结果
  todos => todos.map(todo => todo.id)
)

export const selectFilteredTodos = createSelector(
  // 第一个 input selector：所有 todos
  selectTodos,
  // 第二个 input selector：所有 filter 值
  state => state.filters,
  // Output selector: 接收两个值
  (todos, filters) => {
    const { status, colors } = filters
    const showAllCompletions = status === StatusFilters.All
    if (showAllCompletions && colors.length === 0) {
      return todos
    }

    const completedStatus = status === StatusFilters.Completed
    // 根据 filter 条件返回未完成或已完成的 todos
    return todos.filter(todo => {
      const statusMatches =
        showAllCompletions || todo.completed === completedStatus
      const colorMatches = colors.length === 0 || colors.includes(todo.color)
      return statusMatches && colorMatches
    })
  }
)

export const selectFilteredTodoIds = createSelector(
  // 传入记忆化 selector
  selectFilteredTodos,
  // 并在 output selector 中导出数据
  filteredTodos => filteredTodos.map(todo => todo.id)
)
```

我们调用 `todosAdapter.getSelectors`，并传入内容为 `state => state.todos` 的 selector 来返回这个 slice state。适配器生成一个 `selectAll` selector，它像往常一样取到 _全部的_ Redux state 树，并循环遍历 `state.todos.entities` 和 `state.todos.ids` 以提供完整的 todo 对象数组。由于 `selectAll` 没有告诉我们选择的 _内容_，我们可以使用 ES6 解构语法将函数重命名为 `selectTodos`。同样，我们可以将 `selectById` 重命名为 `selectTodoById`。

请注意，其他 selectors 仍然使用 `selectTodos` 作为输入。这是因为它始终返回一个 todo 对象数组，无论我们是将数组保存为整个 `state.todos`，将其保存为嵌套数组，还是将其存储为归一化对象并转换为数组。尽管存储数据的方式已经做了以上更改，由于 selectors 的使用，我们不需要改动其他代码了，并且记忆化 selectors 通过避免不必要的重渲染也提升了 UI 性能。

## 你的所学

**恭喜你已经完成了 Redux 基础教程！**

你现在应该对 Redux 是什么、它是如何工作的以及如何正确使用它有了深入的了解：

- 管理全局应用程序的 state
- 将应用程序的 state 保存为普通的 JS 数据
- 在应用程序中编写用于描述“发生了什么”的 action 对象
- 使用 reducer 函数，它会根据当前 state 和 action，创建并返回一个不可变的新 state
- 使用 `useSelector` 读取 React 组件中的 Redux state
- 使用 `useDispatch` 从 React 组件 dispatch actions

此外，你还了解了 **Redux Toolkit 是如何简化编写 Redux 逻辑的**，以及为什么 **Redux Toolkit 是编写真实 Redux 应用程序的标准方法**。通过如何“手动”编写 Redux 代码，你应该清楚 Redux Toolkit API（比如 `createSlice`）为你做了什么，这样你就不必自己编写该代码了。

:::info 提示

有关 Redux Toolkit 的更多信息，包括使用指南和 API 参考，请参阅：

- Redux Toolkit 的文档路径在 **https://redux-toolkit.js.org**

:::

最后来看一下包含了所有改造为使用 Redux Toolkit 代码后的 todo 应用程序：

<iframe
  class="codesandbox"
  src="https://codesandbox.io/embed/github/reduxjs/redux-fundamentals-example-app/tree/checkpoint-10-finalCode/?fontsize=14&hidenavigation=1&theme=dark&module=%2Fsrc%2Ffeatures%2Ftodos%2FtodosSlice.js&runonclick=1"
  title="redux-fundamentals-example-app"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

我们最后再来回顾下本节学到的关键点：

:::tip 总结

- **Redux Toolkit (RTK) 是编写 Redux 逻辑的标准方式**
  - RTK 包含用于简化大多数 Redux 代码的 API
  - RTK 围绕 Redux 核心，并包含其他有用的包
- **`configureStore` 用来设置一个具有良好默认值的 Redux store**
  - 自动组合 slice reducers 来创建根 reducer
  - 自动设置 Redux DevTools 扩展和调试 middleware
- **`createSlice` 简化了 Redux actions 和 reducers 的编写**
  - 根据 slice/reducer 名称自动生成 action creators
  - Reducers 可以使用 Immer 在 `createSlice` 中“改变”（mutate）state
- **`createAsyncThunk` 为异步调用生成 thunk **
  - 自动生成一个 thunk + `pending/fulfilled/rejected` action creators
  - dispatch thunk 运行 payload creator 并 dispatch actions
  - 可以在 `createSlice.extraReducers` 中处理 thunk actions
- **`createEntityAdapter` 为标准化 state 提供了 reducers + selectors**
  - 包括用于常见任务的 reducer 功能，例如添加/更新/删除 items
  - 为 `selectAll` 和 `selectById` 生成记忆化 selectors

:::

## 学习和使用 Redux 的后续步骤

既然你已经完成了本教程，我们还有一些建议可帮助你了解有关 Redux 的更多信息。

这个“基础”教程专注于 Redux 的低级层面：手动编写 action types 和不可变更新，Redux store 和 middleware 如何工作，以及为什么我们使用 action creators 和归一化 state 等模式。此外，todo 示例应用程序相当小，并不意味着是构建完整应用程序的现实例子。

而 [**Redux 基础教程**](../essentials/part-1-overview-concepts.md) 是专门教你**如何构建“真实世界”类型的应用程序**。它通过 Redux Toolkit 来聚焦于如何以正确的方式使用 Redux，并讨论你将在大型应用程序中看到的更现实的模式。它涵盖了许多与本“基础”教程相同的主题，例如为什么 reducer 需要使用不可变更新，但重点是构建一个真实工作中的应用程序。**我们强烈建议你在下一步阅读 Redux 基础教程。**

同时，我们在本教程中介绍的概念应该足以让你开始使用 React 和 Redux 构建自己的应用程序。现在就是你自己来尝试进行项目以巩固这些概念，并了解它们在实践中如何工作的好时机。如果你不确定要构建什么样的项目，请参阅此[应用程序项目创意列表](https://github.com/florinpop17/app-ideas)来获得一些灵感。

[使用 Redux](../../usage/index.md) 章节包含许多重要概念的信息，例如[如何构建 reducer](../../usage/structuring-reducers/StructuringReducers.md) 和 [**样式指南页面**](../../style-guide/style-guide.md) 包含我们推荐的模式和最佳实践的重要信息。

如果你想了解更多关于 Redux 存在的原因、它试图解决的问题以及它的用途，请参阅 Redux 维护者 Mark Erikson 在 [Redux 之道，第 1 节：实施和意图](https://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-1/)和 [Redux 之道，第 2 节：实践与哲学](https://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-2/)上的帖子。

如果你正在寻求有关 Redux 问题的帮助，请加入 [Discord 上 Reactiflux 服务器中的 `#redux` 频道](https://www.reactiflux.com)。

**感谢你阅读本教程，我们希望你喜欢使用 Redux 来构建应用程序！**
