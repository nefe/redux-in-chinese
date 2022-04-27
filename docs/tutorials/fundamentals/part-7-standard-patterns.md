---
id: part-7-standard-patterns
title: 'Redux 深入浅出, 第 7 节: 标准 Redux 模式'
sidebar_label: '标准 Redux 模式'
hide_title: false
description: 'The official Fundamentals tutorial for Redux: learn the standard patterns used in real-world Redux apps'
---

import { DetailedExplanation } from '../../components/DetailedExplanation'

# Redux 深入浅出, 第 7 节: 标准 Redux 模式

:::tip 你将学到

- 实际应用 Redux 时的标准模式，以及为什么这些模式会存在
  - 使用 Action creators 封装 action 对象
  - 记忆化 selectors 以提高性能
  - 通过加载枚举值跟踪请求状态
  - 规范化状态以管理项目集合
  - 与 promises 和 thunks 一起工作

:::

:::info 前提

- 理解了之前所有小节的内容

:::

在[第 6 节：异步逻辑和数据请求](./part-6-async-logic.md)，我们看见了怎样使用 Redux 中间件编写异步逻辑来与 store 进行交互。我们使用 Redux "thunk" 中间件来编写可以包含可重用异步逻辑的函数，而无需提前知道他们将要与哪些 Redux store 进行通信。

到目前为止，我们已经介绍了 Redux 实际工作原理的基础知识。但是，现实世界的 Redux 应用程序在这些基础知识的基础上使用了一些额外的模式。

重要的是要注意，**这些模式都不是使用 Redux 所必需的！** 但是，这些模式中的每一个都存在很好的理由，并且您将在几乎每个 Redux 代码库中看到部分或全部模式。

在本节中，我们将重做现有的待办事项应用代码以使用其中一些模式，并讨论为什么它们在 Redux 应用中常用。然后在[**第 8 节**](./part-8-modern-redux.md)，我们将讨论“现代化 Redux”，包括怎样使用我们的官方 [Redux Toolkit](https://redux-toolkit.js.org) 库简化我们已写的 Redux 逻辑。以及为什么**我们建议使用 Redux Toolkit 作为编写 Redux 应用的标准方法**。

## Action Creators

在我们的应用中，我们总是在 dispatch 的地方字面量地直接写 action 对象：

```js
dispatch({ type: 'todos/todoAdded', payload: trimmedText })
```

但是，在实践中，编写良好的 Redux 应用在我们 dispatch 这些 action 对象时实际上不会以内联方式编写它们。相反，我们使用 "action creator" 函数。

"action creator" 就是一个创建并返回一个 action object 的函数。我们通常使用它们，因此我们不必每次都手动编写操作对象：

```js
const todoAdded = text => {
  return {
    type: 'todos/todoAdded',
    payload: text
  }
}
```

我们**调用这个 action creator**，然后**把返回值直接传给 `dispatch`**

```js
store.dispatch(todoAdded('Buy milk'))

console.log(store.getState().todos)
// [ {id: 0, text: 'Buy milk', completed: false}]
```

<DetailedExplanation title="Detailed Explanation: 为什么使用 Action Creators?">

在我们的小型 todo 应用中，每次都直接写 action 对象不是啥难事。实际上，在使用 action creators 的方式后，我们已经做了 _额外_ 的工作了 - 我们已经写了一个函数 _和_ 一个 action 对象。

但是，假如我们需要在应用程序的多个地方 dispatch 相同的 action ？或者假如当我们每次 dispatch 一个 action 时都要做一些额外的逻辑，比如创建一个唯一的 ID ？我们最终将不得不在每次需要调度该操作时复制粘贴其他设置逻辑。

Action creators 操作创建者有两个主要用途：:

- 准备和格式化 action 对象的内容
- 每当我们创建 action 时，封装所需的任何其他工作

这样，我们就有了一致的方法来创建 action，无论是否有任何额外的工作需要完成。thunk 也是一样的目的。

</DetailedExplanation>

### Using Action Creators

让我们更新一下 todosSlice 文件，以便为几种 action 类型使用 action creators。

我们将从到目前为止一直使用的两个主要操作开始：从服务器加载待办事项列表，以及在将其保存到服务器后添加新的待办事项。

当下, `todosSlice.js` 里直接 dispatch 一个 action 对象，如下：

```js
dispatch({ type: 'todos/todosLoaded', payload: response.todos })
```

我们将创建一个函数，该函数创建并返回相同类型的 action 对象，但接受 todos 数组作为其参数，并将其作为 `action.payload` 放入 action 中。然后，我们可以使用 `fetchTodos `thunk 中的新 action creator 来 dispatch action：

```js title="src/features/todos/todosSlice.js"
// highlight-start
export const todosLoaded = todos => {
  return {
    type: 'todos/todosLoaded',
    payload: todos
  }
}
// highlight-end

export async function fetchTodos(dispatch, getState) {
  const response = await client.get('/fakeApi/todos')
  // highlight-next-line
  dispatch(todosLoaded(response.todos))
}
```

我们也为 "todo added" action 做一样的事情:

```js title="src/features/todos/todosSlice.js"
// highlight-start
export const todoAdded = todo => {
  return {
    type: 'todos/todoAdded',
    payload: todo
  }
}
// highlight-end

export function saveNewTodo(text) {
  return async function saveNewTodoThunk(dispatch, getState) {
    const initialTodo = { text }
    const response = await client.post('/fakeApi/todos', { todo: initialTodo })
    // highlight-next-line
    dispatch(todoAdded(response.todo))
  }
}
```

再为 "color filter changed" action 做一样的事情:

```js title="src/features/filters/filtersSlice.js"
// highlight-start
export const colorFilterChanged = (color, changeType) => {
  return {
    type: 'filters/colorFilterChanged',
    payload: { color, changeType }
  }
}
// highlight-end
```

由于此 action 是从 `<Footer>` 组件 dispatch 的，因此我们需要将 `colorFilterChanged` 导入到该处并使用它：


```js title="src/features/footer/Footer.js"
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { availableColors, capitalize } from '../filters/colors'
// highlight-next-line
import { StatusFilters, colorFilterChanged } from '../filters/filtersSlice'

// omit child components

const Footer = () => {
  const dispatch = useDispatch()

  const todosRemaining = useSelector(state => {
    const uncompletedTodos = state.todos.filter(todo => !todo.completed)
    return uncompletedTodos.length
  })

  const { status, colors } = useSelector(state => state.filters)

  const onMarkCompletedClicked = () => dispatch({ type: 'todos/allCompleted' })
  const onClearCompletedClicked = () =>
    dispatch({ type: 'todos/completedCleared' })

  // highlight-start
  const onColorChange = (color, changeType) =>
    dispatch(colorFilterChanged(color, changeType))
  // highlight-end

  const onStatusChange = status =>
    dispatch({ type: 'filters/statusFilterChanged', payload: status })

  // omit rendering output
}

export default Footer
```

请注意，`colorFilterChanged` action creator 实际上接受两个不同的参数，然后将它们组合在一起以形成正确的 `action.payload` 字段。

这不会改变应用程序的工作方式或 Redux 数据流的行为方式 - 我们仍在创建 action 对象并 dispatch 它们。但是，我们现在不是一直直接在代码中编写 action 对象，而是使用 action creator 在 dispatch 这些 action 对象之前对其进行准备。

我们也可以结合 thunk 函数使用 action creators，实际上[在之前的章节我们已经在 action creator 内包裹了一个 thunk 了](./part-6-async-logic.md#saving-todo-items)。我们专门将 `saveNewTodo` 包装在 "thunk action creator" 函数中，以便我们可以传入 `text` 参数。虽然 `fetchTodos` 不采用任何参数，但我们仍然可以将其包装在操作创建器中：

```js title="src/features/todos/todosSlice.js"
// highlight-next-line
export function fetchTodos() {
  return async function fetchTodosThunk(dispatch, getState) {
    const response = await client.get('/fakeApi/todos')
    dispatch(todosLoaded(response.todos))
  }
}
```

这意味着我们必须更改它在 `index.js` 中 dispatch 的位置以调用外部 thunk action creator 函数，并将返回的内部 thunk 函数传递给 `dispatch`：

```js title="src/index.js"
import store from './store'
import { fetchTodos } from './features/todos/todosSlice'

// highlight-next-line
store.dispatch(fetchTodos())
```

到目前为止，我们已经使用 `function` 关键字编写了 thunks，以明确他们在做什么。但是，我们也可以使用箭头函数语法来编写它们。使用隐式返回可以缩短代码，尽管如果您不熟悉箭头函数，它也可能使阅读变得有点困难：

```js title="src/features/todos/todosSlice.js"
// Same thing as the above example!
// highlight-next-line
export const fetchTodos = () => async dispatch => {
  const response = await client.get('/fakeApi/todos')
  dispatch(todosLoaded(response.todos))
}
```

同样，如果我们愿意，我们 _可以_ 缩短 action creators：

```js title="src/features/todos/todosSlice.js"
// highlight-next-line
export const todoAdded = todo => ({ type: 'todos/todoAdded', payload: todo })
```

由您决定以这种方式使用箭头函数是否更好。

:::info

有关 action creators 为何有用的更多详细信息，请参阅：

- [Idiomatic Redux: Why Use Action Creators?](https://blog.isquaredsoftware.com/2016/10/idiomatic-redux-why-use-action-creators/)

:::

## 记忆化 Selectors

我们已经看到我们可以编写 "selector" 函数，它接受 Redux `state` 对象作为参数，并返回一个值：

```js
const selectTodos = state => state.todos
```

假如我们需要 _派生_ 一些数据怎么办？举个例子，或许我们希望只要一个 todo IDs 组成的数组：

```js
const selectTodoIds = state => state.todos.map(todo => todo.id)
```

然而，`array.map()` 每次都返回的是一个新数组引用（reference）。我们知道 _每次_ dispatch action 后 React-Redux `useSelector` hook 都会重新调用其 selector 函数，如果 selector 返回一个新值，组件一定会重新渲染。

在这个例子中，**在 _每个_ action 后调用 `useSelector(selectTodoIds)` 将 _总是_ 造成重渲染，因为总是返回一个新数组引用`**


在第 5 节，我们看到[我们传了 `shallowEqual` 作为参数给 `useSelector`](./part-5-ui-and-react.md#selecting-data-in-list-items-by-id)。现在有另一选择：我们可以使用 “记忆化的（memoized）” selectors。

**记忆化** 是缓存技术的一种 - 具体来说，保存昂贵计算的结果，如果我们以后看到相同的输入，请重用这些结果。

**记忆化 selector functions** 是保存最新结果值的 selector，如果使用相同的输入多次调用它们，则将返回相同的结果值。如果使用与上次不同的 _different_ 输入调用它们，它们将重新计算新的结果值，缓存该值，然后返回新结果。

### 结合 `createSelector` 记忆化 Selectors

**[Reselect library](https://github.com/reduxjs/reselect) 提供了一个能生成记忆化 selector 函数的 `createSelector` API**。该 API 接收一个或多个 "input selector" 函数作为参数，加上一个 "output selector"，并返回新的 selector 函数。每次调用选择器时：

- 所有 "input selectors" 都使用所有参数调用
- 如果任何 input selector 返回值已更改，"output selector" 将重新运行
- 所有 input selector 的结果都将成为 output selector 的参数
- output selector 的最终结果将缓存以供下次使用

让我们来创建一个记忆化版的 `selectTodoIds`，并且在 `<TodoList>` 中使用。

首先我们需要安装 Reselect:

```bash
npm install reselect
```

接着我们导入且调用 `createSelector`。我们最初的 `selectTodoIds` 函数是在 `TodoList.js` 中定义的，但更常见的是选择器函数写在相关的切片文件中。因此，让我们将其添加到待办事项切片中：

```js title="src/features/todos/todosSlice.js"
// highlight-next-line
import { createSelector } from 'reselect'

// omit reducer

// omit action creators

// highlight-start
export const selectTodoIds = createSelector(
  // First, pass one or more "input selector" functions:
  state => state.todos,
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  todos => todos.map(todo => todo.id)
)
// highlight-end
```

接下来, 在 `<TodoList>` 里使用:

```js title="src/features/todos/TodoList.js"
import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'

// highlight-next-line
import { selectTodoIds } from './todosSlice'
import TodoListItem from './TodoListItem'

const TodoList = () => {
  // highlight-next-line
  const todoIds = useSelector(selectTodoIds)

  const renderedListItems = todoIds.map(todoId => {
    return <TodoListItem key={todoId} id={todoId} />
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}
```

这实际上与 `shallowEqual` 比较函数的行为略有不同。每当 `state.todos` 数组更改时，我们都会创建一个新的 todo IDs 数组。这包括对待办事项的任何不可变更新，例如切换其 `completed` 字段，因为我们必须为不可变更新创建一个新数组。

:::tip

仅当您实际从原始数据派生其他值时，记忆选择器才有用。如果只是查找并返回现有值，则可以将选择器保留为普通函数。

:::

### 具有多个参数的 Selectors

我们的待办事项应用程序应该能够根据其完成状态过滤可见的待办事项。让我们编写一个记忆选择器，返回经过过滤的待办事项列表。 

我们知道我们需要整个 `todos` 数组作为 output selector 的一个参数。我们还需要传入当前完成状态筛选器值。我们将添加一个单独的 "input selector" 来提取每个值，并将结果传递给 "output selector"。

```js title="src/features/todos/todosSlice.js"
import { createSelector } from 'reselect'
import { StatusFilters } from '../filters/filtersSlice'

// omit other code

// highlight-start
export const selectFilteredTodos = createSelector(
  // First input selector: all todos
  state => state.todos,
  // Second input selector: current status filter
  state => state.filters.status,
  // Output selector: receives both values
  (todos, status) => {
    if (status === StatusFilters.All) {
      return todos
    }

    const completedStatus = status === StatusFilters.Completed
    // Return either active or completed todos based on filter
    return todos.filter(todo => todo.completed === completedStatus)
  }
)
// highlight-end
```

:::警告

请注意，我们现在在两个切片之间添加了一个导入依赖关系 - `todosSlice` 正在从 `filtersSlice` 导入一个值。这是合法的，但要小心。**如果两个切片 _都在_ 尝试从彼此导入某些内容，则最终可能会遇到“循环导入依赖项”问题，从而导致代码崩溃**。如果发生这种情况，请尝试将一些常用代码移动到其自己的文件中，然后改为从该文件导入。

:::

现在，我们可以使用这个新的 "filtered todos" 选择器作为另一个选择器的输入，该选择器返回这些待办事项的 ID：

```js title="src/features/todos/todosSlice.js"
export const selectFilteredTodoIds = createSelector(
  // Pass our other memoized selector as an input
  selectFilteredTodos,
  // And derive data in the output selector
  filteredTodos => filteredTodos.map(todo => todo.id)
)
```

如果我们在 `<TodoList>` 使用 `selectFilteredTodoIds`，那么我们应该能够将几个待办事项标记为已完成：

![Todo app - todos marked completed](/img/tutorials/fundamentals/todos-app-markedCompleted.png)

然后将列表筛选为 _只_ 显示已完成的待办事项：

![Todo app - todos marked completed](/img/tutorials/fundamentals/todos-app-showCompleted.png)

然后，我们可以扩展我们的 `selectFilteredTodos`，以便在选择中也包括颜色过滤：

```js title="src/features/todos/todosSlice.js"
export const selectFilteredTodos = createSelector(
  // First input selector: all todos
  selectTodos,
  // Second input selector: all filter values
  // highlight-next-line
  state => state.filters,
  // Output selector: receives both values
  (todos, filters) => {
    // highlight-start
    const { status, colors } = filters
    const showAllCompletions = status === StatusFilters.All
    if (showAllCompletions && colors.length === 0) {
      // highlight-end
      return todos
    }

    // highlight-next-line
    const completedStatus = status === StatusFilters.Completed
    // Return either active or completed todos based on filter
    return todos.filter(todo => {
      // highlight-start
      const statusMatches =
        showAllCompletions || todo.completed === completedStatus
      const colorMatches = colors.length === 0 || colors.includes(todo.color)
      return statusMatches && colorMatches
      // highlight-end
    })
  }
)
```

请注意，通过将逻辑封装在此选择器中，即使更改了筛选行为，我们的组件也不需要更改。现在我们可以同时按状态和颜色进行过滤：

![Todo app - status and color filters](/img/tutorials/fundamentals/todos-app-selectorFilters.png)

最后，我们的代码在几个地方查找 `state.todos`。在完成本节的其余部分时，我们将对该状态的设计方式进行一些更改，因此我们将提取一个 `selectTodos` 选择器并在任何地方使用它。我们还可以将 `selectTodoById` 移动到 `todosSlice` 中：

```js title="src/features/todos/todosSlice.js"
export const selectTodos = state => state.todos

export const selectTodoById = (state, todoId) => {
  return selectTodos(state).find(todo => todo.id === todoId)
}
```

:::info

学习更多关于怎样使用 Reselect 和记忆化 selectors ，请看：

- The [Reselect docs](https://github.com/reduxjs/reselect)
- [Idiomatic Redux: Using Reselect Selectors for Encapsulation and Performance](https://blog.isquaredsoftware.com/2017/12/idiomatic-redux-using-reselect-selectors/)

:::

## 异步请求状态

我们使用异步 thunk 从服务器获取待办事项的初始列表。由于我们使用的是伪造的服务器 API，因此该响应会立即返回。在实际应用中，API 调用可能需要一段时间才能解决。在这种情况下，在我们等待响应完成时，通常会显示某种加载微调器（loading spinner）。

这通常在 Redux 应用中通过以下方式进行处理：

- 具有某种“加载状态”值来指示请求的当前状态
- _在_ 进行 API 调用 _前_ dispatch "request started" action，该 dispatch 通过更改加载状态值进行处理
- 请求完成时再次更新加载状态值，以指示调用已完成

然后，UI 层在请求进行时显示加载微调器，并在请求完成时切换到显示实际数据。

我们将更新待办事项切片以跟踪加载状态值，并 dispatch 一个额外的 `'todos/todosLoading'` action 作为 `fetchTodos` thunk 的一部分。

现在，我们的 todosReducer 的 `state` 只是 todos 本身的数组。如果我们想跟踪 todos 切片中的加载状态，我们需要将 todos 状态重新组织为具有 todos 数组 _和_ 加载状态值的对象。这也意味着重写 reducer 逻辑以处理额外的嵌套：

```js title="src/features/todos/todosSlice.js"
// highlight-start
const initialState = {
  status: 'idle',
  entities: []
}
// highlight-end

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case 'todos/todoAdded': {
      // highlight-start
      return {
        ...state,
        entities: [...state.entities, action.payload]
      }
      // highlight-end
    }
    case 'todos/todoToggled': {
      // highlight-start
      return {
        ...state,
        entities: state.entities.map(todo => {
          if (todo.id !== action.payload) {
            return todo
          }

          return {
            ...todo,
            completed: !todo.completed
          }
        })
      }
      // highlight-end
    }
    // omit other cases
    default:
      return state
  }
}

// omit action creators

// highlight-next-line
export const selectTodos = state => state.todos.entities
```

这里有一些重要的事情需要注意：

- todos 数组现在作为 `state.entities` 嵌套在 `todosReducer` 状态对象中。"entities" 这个词是一个术语，意思是“具有 ID 的唯一项目”，它确实描述了我们的待办事项对象。
- 这也意味着数组嵌套在 _整个_ Redux state 对象中，作为 `state.todos.entities`
- 我们现在必须在 Reducer 中执行额外的步骤来复制额外的嵌套级别，以进行正确的不可变更新，例如 `state` 对象 -> `entities` 数组 -> `todo` 对象
- 由于代码的其余部分是 _只_ 通过选择器访问 todos 状态，**我们只需要更新 `selectTodo` 选择器** - 即使我们大大重塑了状态，UI 的其余部分仍将继续按预期工作。

### 加载状态的枚举值

您还会注意到，我们已将加载状态字段定义为字符串枚举：

```js
{
  status: 'idle' // or: 'loading', 'succeeded', 'failed'
}
```

而不是 `isLoading` 布尔值。

布尔值将我们限制在两种可能性：“加载”或“不加载”。实际上，**请求实际上可能处于 _许多_ 不同的状态**，例如：

- 根本没有开始
- 进行中
- 成功
- 失败
- 成功, 但又回到了我们可能想要重新筛选的情况

还有一种可能是应用逻辑应仅根据某些操作在特定状态之间转换，这更难使用布尔值实现。

因此，我们建议 **将加载状态存储为字符串枚举值，而不是布尔标志**。

:::info

有关为什么加载状态应为枚举的详细说明，请参阅：

- [Redux Style Guide: treat reducers as state machines](../../style-guide/style-guide.md#treat-reducers-as-state-machines)

:::

在此基础上，我们将添加一个新的 "loading" action，该操作会将我们的状态设置为 `'loading'`，并更新 "loaded" action 以将状态标志重置 `'idle'`：

```js title="src/features/todos/todosSlice.js"
const initialState = {
  status: 'idle',
  entities: []
}

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    // omit other cases
    // highlight-start
    case 'todos/todosLoading': {
      return {
        ...state,
        status: 'loading'
      }
    }
    // highlight-end
    case 'todos/todosLoaded': {
      return {
        ...state,
        // highlight-next-line
        status: 'idle',
        entities: action.payload
      }
    }
    default:
      return state
  }
}

// omit action creators

// Thunk function
export const fetchTodos = () => async dispatch => {
  // highlight-next-line
  dispatch(todosLoading())
  const response = await client.get('/fakeApi/todos')
  dispatch(todosLoaded(response.todos))
}
```

但是，在我们尝试在 UI 中显示这一点之前，我们需要修改假服务器 API，以向 API 调用添加人为延迟。打开 `src/api/server.js`，然后在第 63 行周围查找此注释掉的行：

```js title="src/api/server.js"
new Server({
  routes() {
    this.namespace = 'fakeApi'
    // highlight-next-line
    // this.timing = 2000

    // omit other code
  }
})
```

如果您取消注释该行，假服务器将为我们的应用程序进行的每个API调用添加2秒的延迟，这使我们有足够的时间实际看到正在显示的加载微调器。

现在，我们可以读取 `<TodoList>` 组件中的加载状态值，并根据该值显示加载微调器。

```js title="src/features/todos/TodoList.js"
// omit imports

const TodoList = () => {
  const todoIds = useSelector(selectFilteredTodoIds)
  // highlight-start
  const loadingStatus = useSelector(state => state.todos.status)

  if (loadingStatus === 'loading') {
    return (
      <div className="todo-list">
        <div className="loader" />
      </div>
    )
  }
  // highlight-end

  const renderedListItems = todoIds.map(todoId => {
    return <TodoListItem key={todoId} id={todoId} />
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}
```

在实际应用中，我们还希望处理 API 故障错误和其他潜在情况。

以下是启用加载状态后应用的外观（若要再次查看微调器，请重新加载应用预览或在新选项卡（tag）中打开它）：

<iframe
  class="codesandbox"
  src="https://codesandbox.io/embed/github/reduxjs/redux-fundamentals-example-app/tree/checkpoint-7-asyncLoading/?fontsize=14&hidenavigation=1&theme=dark&runonclick=1"
  title="redux-fundamentals-example-app"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

## Flux Standard Actions

Redux store 本身实际上并不关心您在 action 中放入了哪些字段。它只关心 `action.type` 是否存在并具有值，并且常规的 Redux action 始终使用字符串表示 `action.type`。这意味着您可以将任何其他字段放入所需的 action 中。也许我们可以用 `action.todo` 来表示 "todo add" 动作，或者 `action.color`，依此类推。

但是，如果每个 action 对其数据字段使用不同的字段名称，则很难提前知道每个 reducer 中需要处理哪些字段。

这就是为什么 Redux 社区提出["Flux Standard Actions" 约定](https://github.com/redux-utilities/flux-standard-action#motivation), 简称 "FSA"。这是有关如何在 action 对象内部组织字段的建议方法，以便开发人员始终知道哪些字段包含哪些类型的数据。FSA 模式在 Redux 社区中被广泛使用，事实上，您在整个教程中已经使用它。

FSA 约定表达了：

- 如果您的 action 对象具有任何实际数据，则 action 的“数据”值应始终位于 `action.payload` 中
- action 还可以具有包含额外描述性数据的 `action.meta` 字段
- action 可能具有包含错误信息的 `action.error` 字段

所以，_所有_ Redux actions 必须：

- 是一个普通的 JS 对象
- 必须有 `type` 字段

如果您使用 FSA 模式编写 action，则 action 可能会:

- 拥有一个 `payload` 字段
- 拥有一个 `error` 字段
- 拥有一个 `meta` 字段

<DetailedExplanation title="Detailed Explanation: FSAs and Errors">

FSA 规范规定：

> 如果 action 表示错误，则可选的 `error` 属性可以设置为 `true`。
> `error` 为真的操作类似于 rejected Promise。按照惯例，`payload` 应该是一个错误对象。
> 如果 `error` 除 `true` 之外还有任何其他值，包括 `undefined` 和 `null`，则该action 不得解释为错误。

FSA 规范还反对为 "loading succeeded" 和 "loading failed" 等内容提供特定的 action 类型。

然而，在实践中，Redux 社区忽略了使用 `action.error` 作为布尔标志的想法，而是选择了单独的 action 类型，如 `todos/todosLoadingSucceeded` 和 `todos/todosLoadingFailed`。这是因为检查这些 action 类型比首先处理 `todos/todosLoaded` _再_ 检查 `if （action.error）` 要容易得多。

你可以执行任何一种更适合你的方法，但大多数应用使用单独的 action 类型来表示成功和失败。

</DetailedExplanation>

## 规范化 State

到目前为止，我们已将待办事项保存在一个数组中。这是合理的，因为我们从服务器接收数据作为数组，我们还需要循环访问待办事项以在 UI 中将它们显示为列表。

但是，在较大的 Redux 应用中，通常将数据存储在**规范化状态结构**中。“规范化”是指：

- 确保每条数据只有一个副本
- 以允许按 ID 直接查找项目（items）的方式存储项目
- 基于 ID 引用其他项目，而不是复制整个项目

例如，在博客应用程序中，您可能具有指向 `User` 和 `Comment` 对象的 `Post`  对象。同一个人可能有很多帖子，因此，如果每个 `Post` 对象都包含整个 `User`，我们将拥有同一个 `User` 对象的许多副本。相反，若 `Post` 对象的用户 ID 值为 `post.user`，然后我们可以按 ID 查找 `User` 对象，如 `state.users[post.user]`。


这意味着我们通常将数据组织为对象而不是数组，其中项目 ID 是键，项目本身是值，如下所示：

```js
const rootState = {
  todos: {
    status: 'idle',
    // highlight-start
    entities: {
      2: { id: 2, text: 'Buy milk', completed: false },
      7: { id: 7, text: 'Clean room', completed: true }
    }
    // highlight-end
  }
}
```

让我们转换 todos 切片，以规范化的形式存储 todos。这将需要对我们的 reducer 逻辑进行一些重大更改，并更新 selectors：

```js title="src/features/todos/todosSlice"
const initialState = {
  status: 'idle',
  // highlight-next-line
  entities: {}
}

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case 'todos/todoAdded': {
      const todo = action.payload
      // highlight-start
      return {
        ...state,
        entities: {
          ...state.entities,
          [todo.id]: todo
        }
      }
      // highlight-end
    }
    case 'todos/todoToggled': {
      // highlight-start
      const todoId = action.payload
      const todo = state.entities[todoId]
      return {
        ...state,
        entities: {
          ...state.entities,
          [todoId]: {
            ...todo,
            completed: !todo.completed
          }
        }
      }
      // highlight-end
    }
    case 'todos/colorSelected': {
      // highlight-start
      const { color, todoId } = action.payload
      const todo = state.entities[todoId]
      return {
        ...state,
        entities: {
          ...state.entities,
          [todoId]: {
            ...todo,
            color
          }
        }
      }
      // highlight-end
    }
    case 'todos/todoDeleted': {
      // highlight-start
      const newEntities = { ...state.entities }
      delete newEntities[action.payload]
      return {
        ...state,
        entities: newEntities
      }
      // highlight-end
    }
    case 'todos/allCompleted': {
      // highlight-start
      const newEntities = { ...state.entities }
      Object.values(newEntities).forEach(todo => {
        newEntities[todo.id] = {
          ...todo,
          completed: true
        }
      })
      return {
        ...state,
        entities: newEntities
      }
      // highlight-end
    }
    case 'todos/completedCleared': {
      // highlight-start
      const newEntities = { ...state.entities }
      Object.values(newEntities).forEach(todo => {
        if (todo.completed) {
          delete newEntities[todo.id]
        }
      })
      return {
        ...state,
        entities: newEntities
      }
      // highlight-end
    }
    case 'todos/todosLoading': {
      return {
        ...state,
        status: 'loading'
      }
    }
    case 'todos/todosLoaded': {
      // highlight-start
      const newEntities = {}
      action.payload.forEach(todo => {
        newEntities[todo.id] = todo
      })
      return {
        ...state,
        status: 'idle',
        entities: newEntities
      }
      // highlight-end
    }
    default:
      return state
  }
}

// omit action creators

// highlight-start
const selectTodoEntities = state => state.todos.entities

export const selectTodos = createSelector(selectTodoEntities, entities =>
  Object.values(entities)
)

export const selectTodoById = (state, todoId) => {
  return selectTodoEntities(state)[todoId]
}
// highlight-end
```

由于我们的 `state.entities` 字段现在是一个对象而不是数组，因此我们必须使用嵌套对象展开运算符来更新数据而不是数组操作。此外，我们不能像循环数组那样循环访问对象，因此在几个地方，我们必须使用 `Object.values（entities` 来获取待办事项的数组，以便我们可以循环访问它们。

好消息是，由于我们使用 selectors 来封装状态查找，因此我们的 UI 仍然不必更改。坏消息是，reducer 代码实际上更长，更复杂。

这里的部分问题是**此待办事项应用程序示例不是大型实际应用程序**。因此，规范化状态在此特定应用中没有那么有用，并且更难看到潜在的好处。

幸运的是，在[第 8 节：基于 Redux Toolkit 的现代化 Redux](part-8-modern-redux.md)中，我们将看到一些方法来大大缩短用于管理规范化状态的 reducer 逻辑。

目前，要了解的重要事项是：

- 规范化在 Redux 应用中 _很_ 常用
- 主要好处是能够通过 ID 查找单个项目，并确保 state 中只存在项目的一个副本

:::info

有关规范化对 Redux 有用的更多详细信息，请参阅：

- [Structuring Reducers: Normalizing State Shape](../../recipes/structuring-reducers/NormalizingStateShape.md)

:::

## Thunks 和 Promises

对于本节，我们还有最后一个模式要看。我们已经了解了如何基于 dispatch action 在 Redux store 中处理加载状态。如果我们需要查看组件 thunk 的结果，该怎么办？

每当您调用 `store.dispatch(action)` 时，`dispatch` 实际上会返回 `action` 作为其结果。然后，中间件可以修改该行为并返回一些其他值。

我们已经看到，Redux Thunk 中间件允许我们将一个函数传递给 `dispatch`，调用该函数，然后返回结果：

```js title="reduxThunkMiddleware.js"
const reduxThunkMiddleware = storeAPI => next => action => {
  // If the "action" is actually a function instead...
  if (typeof action === 'function') {
    // then call the function and pass `dispatch` and `getState` as arguments
    // Also, return whatever the thunk function returns
    return action(storeAPI.dispatch, storeAPI.getState)
  }

  // Otherwise, it's a normal action - send it onwards
  return next(action)
}
```

这意味着**我们可以编写返回 promise 的 thunk 函数，并在我们的组件中等待 promise 状态变化**。

我们已经有 `<Header>` 组件 dispatching 一个 thunk，以将新的待办事项条目保存到服务器。让我们在 `<Header>` 组件中添加一些加载状态，然后禁用文本输入，并在等待服务器时显示另一个加载微调器：

```js title="src/features/header/Header.js"
const Header = () => {
  const [text, setText] = useState('')
  // highlight-next-line
  const [status, setStatus] = useState('idle')
  const dispatch = useDispatch()

  const handleChange = e => setText(e.target.value)

  // highlight-start
  const handleKeyDown = async e => {
    // If the user pressed the Enter key:
    const trimmedText = text.trim()
    if (e.which === 13 && trimmedText) {
      // Create and dispatch the thunk function itself
      setStatus('loading')
      // Wait for the promise returned by saveNewTodo
      await dispatch(saveNewTodo(trimmedText))
      // And clear out the text input
      setText('')
      setStatus('idle')
    }
  }

  let isLoading = status === 'loading'
  let placeholder = isLoading ? '' : 'What needs to be done?'
  let loader = isLoading ? <div className="loader" /> : null
  // highlight-end

  return (
    <header className="header">
      <input
        className="new-todo"
        placeholder={placeholder}
        autoFocus={true}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        // highlight-next-line
        disabled={isLoading}
      />
      // highlight-next-line
      {loader}
    </header>
  )
}

export default Header
```

现在，如果我们添加一个待办事项，我们将在标题中看到一个微调器：

![Todo app - component loading spinner](/img/tutorials/fundamentals/todos-app-headerLoading.png)

## 你学到了

如您所见，还有几种在 Redux 应用中广泛使用的其他模式。这些模式不是必需的，最初可能涉及编写更多代码，但它们提供了一些好处，例如使逻辑可重用、封装实现细节、提高应用性能以及使查找数据更容易。

:::info

有关这些模式存在的原因以及如何使用Redux的更多详细信息，请参阅：

- [Idiomatic Redux: The Tao of Redux, Part 1 - Implementation and Intent](https://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-1/)
- [Idiomatic Redux: The Tao of Redux, Part 2 - Practice and Philosophy](https://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-2/)

:::

以下是我们的应用在完全转换为使用这些模式后的样子：

<iframe
  class="codesandbox"
  src="https://codesandbox.io/embed/github/reduxjs/redux-fundamentals-example-app/tree/checkpoint-8-normalizedState/?fontsize=14&hidenavigation=1&theme=dark&runonclick=1"
  title="redux-fundamentals-example-app"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

:::tip 总结

- **Action creators 函数可以封装关于 action 对象和 thunks 的逻辑**
  - Action creators 可以接受参数并包含设置逻辑，并返回最终的 action 对象或 thunk 函数
- **记忆化 selectors 有助于提高 Redux 应用性能**
  - Reselect 有一个 `createSelector` API 可以生成记忆化 selectors
  - 如果给记忆化 selectors 传入相同的参数，将返回相同的结果（引用）
- **请求状态应存储为枚举值，而不是布尔值**
  - 使用 `'idle'` 和 `'loading'` 等枚举有助于一致地跟踪状态
- **"Flux Standard Actions" 是管理 action 对象公认的约定**
  - Actions 的数据放在 `payload` 字段里，`meta` 放额外的描述，`error` 放错误信息
- **规范化状态使按 ID 查找项目变得更加容易**
  - 规范化数据存储在对象而不是数组中，项目 ID 作为键
- **Thunks 可以从 `dispatch` 中返回 promise 值**
  - 组件内可以等待异步 thunks 完成，然后做更多的工作

:::

## 下一步

“手动”编写所有这些代码可能既耗时又困难。**这就是我们推荐你用官方库 [Redux Toolkit](https://redux-toolkit.js.org) 去写 Redux 逻辑的原因**。

Redux Toolkit 包含的 API 可**帮助您编写所有典型的 Redux 使用模式，且代码较少**。它还有助于**防止常见错误**，例如意外改变状态。

在[第 8 节: 现代化 Redux](./part-8-modern-redux.md), 我们将介绍如何使用 Redux Toolkit 来简化我们迄今为止编写的所有代码。
