---
id: part-7-standard-patterns
title: 'Redux 深入浅出，第 7 节：标准 Redux 模式'
sidebar_label: '标准 Redux 模式'
hide_title: false
description: 'Redux 官方基础教程：学习 Redux 实际应用程序中使用的标准模式'
---

import { DetailedExplanation } from '../../components/DetailedExplanation'

# Redux 深入浅出，第 7 节：标准 Redux 模式

:::tip 你将学到

- 实际应用中 Redux 的标准使用模式，以及这些模式存在的原因：
  - 使用 Action creators 封装 action 对象
  - 使用记忆化（memoized）selectors 以提高性能
  - 通过加载枚举值跟踪请求状态
  - 规范化 state 以管理项目集合
  - 与 promises、thunks 一起工作

:::

:::info 预置知识

- 理解了之前所有小节的内容

:::

在[第 6 节：异步逻辑和数据获取](./part-6-async-logic.md)，我们了解了怎样使用 Redux middleware 编写异步逻辑来与 store 进行交互。尤其是使用 Redux thunk middleware 来编写能够包含可重用异步逻辑的函数，而无需提前知道他们将要与哪些 Redux store 进行通信。

到目前为止，我们已经介绍了 Redux 实际工作原理的基础知识。但是，现实世界的 Redux 应用程序在这些基础上使用了一些额外的模式。

重点需要注意，**这些模式都不是使用 Redux 所必需的！**但是，每个模式都有很好的存在理由，并且几乎在每个 Redux 代码库中都可以看到部分或全部模式。

在本节中，我们将重做现有的 todo 应用程序以使用其中一些模式，并讨论为什么它们常用在 Redux 应用中。然后在[**第 8 节**](./part-8-modern-redux.md)，我们将讨论“现代化 Redux”，包括怎样使用官方 [Redux Toolkit](https://redux-toolkit.js.org) 库简化已写的 Redux 逻辑。以及为什么**建议使用 Redux Toolkit 作为编写 Redux 应用的标准方法**。

## Action Creators

在应用中，我们一直在 dispatch 的地方以字面量的方式直接写 action 对象：

```js
dispatch({ type: 'todos/todoAdded', payload: trimmedText })
```

但是，在实践中，编写良好的 Redux 应用程序实际上并不会在我们 dispatch 这些 action 对象时以内联的方式编写它们。相反，我们使用 action creator 函数。

action creator 就是创建并返回一个 action 对象的函数。我们通常使用它们来避免每次都手动编写 action 对象：

```js
const todoAdded = text => {
  return {
    type: 'todos/todoAdded',
    payload: text
  }
}
```

我们**调用这个 action creator**，然后**把返回值直接传给 `dispatch`**：

```js
store.dispatch(todoAdded('Buy milk'))

console.log(store.getState().todos)
// [ {id: 0, text: 'Buy milk', completed: false}]
```

<DetailedExplanation title="详细说明：为什么使用 Action Creators？">

在 todo 应用程序这个小示例中，每次都直接写 action 对象并不麻烦。实际上，改成使用 action creators 的方式后，我们 _额外_ 做了一些工作——必须编写一个函数 _和_ 一个 action 对象。

但是，假如我们需要在应用程序的多个地方 dispatch 相同的 action 呢？或者假如每次 dispatch action 时都要处理一些额外的逻辑，比如创建一个唯一的 ID？我们最终将不得不在每次需要 dispatch action 时复制粘贴额外的设置逻辑。

Action creators 有两个主要用途：

- 准备和格式化 action 对象的内容
- 封装创建 action 时所需的任何额外工作

这样，无论是否有任何额外的工作需要完成，我们都有了一致的方法来创建 action。thunk 亦是如此。

</DetailedExplanation>

### 使用 Action Creators

让我们更新一下 todosSlice 文件，以便为几种 action 类型使用 action creators。

我们将从到目前为止一直使用的两个主要的 actions 开始：从服务器加载 todos 列表，以及在将其保存到服务器后添加新的 todo。

当下，`todosSlice.js` 里直接 dispatch 了一个 action 对象，如下所示：

```js
dispatch({ type: 'todos/todosLoaded', payload: response.todos })
```

我们将创建一个函数，该函数创建并返回相同类型的 action 对象，但接受 todos 数组作为其参数，并将其作为 `action.payload` 放入 action 中。然后，我们可以使用 `fetchTodos` thunk 中的新 action creator 来 dispatch action：

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

// 省略子组件

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

  // 省略渲染输出
}

export default Footer
```

请注意，`colorFilterChanged` action creator 实际上接收两个不同的参数，然后将它们组合在一起以形成正确的 `action.payload` 字段。

这不会改变应用程序的工作方式或 Redux 数据流的行为方式——我们仍在创建 action 对象并 dispatch 它们。但是，我们现在不是直接在代码中编写 action 对象，而是使用 action creator 在 dispatch 这些 action 对象之前就准备好。

我们也可以结合 thunk 函数使用 action creators，实际上[第 6 节我们已经在 action creator 内包裹了一个 thunk 了](./part-6-async-logic.md#saving-todo-items)。我们专门将 `saveNewTodo` 包装在 thunk action creator 函数中，以便可以传入 `text` 参数。虽然 `fetchTodos` 不带任何参数，但我们仍然可以将其包装在 action creator 中：

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

到目前为止，我们已经使用 `function` 关键字编写了 thunks，来显示地表明使用目的。但是，我们也可以使用箭头函数语法来编写。使用隐式返回可以缩短代码，但如果你不熟悉箭头函数的话，它也可能使阅读变得有点困难：

```js title="src/features/todos/todosSlice.js"
// 和上面的例子一样！
// highlight-next-line
export const fetchTodos = () => async dispatch => {
  const response = await client.get('/fakeApi/todos')
  dispatch(todosLoaded(response.todos))
}
```

同样，如果我们愿意，_也可以_ 缩短 action creators：

```js title="src/features/todos/todosSlice.js"
// highlight-next-line
export const todoAdded = todo => ({ type: 'todos/todoAdded', payload: todo })
```

由你决定以这种方式使用箭头函数是否更好。

:::info 提示

关于 action creators 为何有用的更多详细信息，请参阅：

- [Idiomatic Redux: Why Use Action Creators?](https://blog.isquaredsoftware.com/2016/10/idiomatic-redux-why-use-action-creators/)

:::

## 记忆化（Memoized）Selectors

我们已经可以编写 selector 函数了，它接受 Redux `state` 对象作为参数，并返回一个值：

```js
const selectTodos = state => state.todos
```

假如我们需要 _派生_ 一些数据怎么办？举个例子，或许我们只想要一个仅包含 todo IDs 的数组：

```js
const selectTodoIds = state => state.todos.map(todo => todo.id)
```

然而，`array.map()` 总是返回一个新数组引用。我们知道 _每次_ dispatch action 后 React-Redux 的 `useSelector` hook 都会重新调用其 selector 函数，如果 selector 返回一个新值，组件一定会重新渲染。

在这个例子中，**在 _每个_ action 后调用 `useSelector(selectTodoIds)` 将 _总是_ 造成重渲染，因为返回的是一个新数组引用！**


在第 5 节，我们看到[可以将 `shallowEqual` 作为参数传递给 `useSelector`](./part-5-ui-and-react.md#selecting-data-in-list-items-by-id)。现在还有另一选择：我们可以使用“记忆化”（memoized）selectors。

**Memoization** 是一种缓存——具体来说，就是保存那些非常耗时的计算结果，然后再次遇到同样的计算任务时，直接重用这些结果。

**Memoized selector 函数**是保存最新结果值的 selector，如果使用相同的输入多次调用它们，将得到相同的结果值。如果使用与上次 _不同的_ 输入调用它们，它们将重新计算新的结果值，将其缓存并返回新值。

### 使用 `createSelector` 来记忆（Memoize） Selectors

**[Reselect 库](https://github.com/reduxjs/reselect) 提供了一个 `createSelector` API，它将生成 memoized selector 函数**。`createSelector` 接收一个或多个 input selector 函数作为参数，外加一个 output selector，并返回新的 selector 函数。每次调用 selector 时：

- 所有 input selectors 都使用所有参数被调用
- 只要任何 input selector 返回值已更改，output selector 都将重新运行
- 所有 input selector 的结果都将成为 output selector 的参数
- output selector 的最终结果将被缓存以供下次使用

让我们来创建一个记忆化版的 `selectTodoIds`，并且在 `<TodoList>` 中使用。

首先我们需要安装 Reselect：

```bash
npm install reselect
```

接着我们导入且调用 `createSelector`。我们最初的 `selectTodoIds` 函数是在 `TodoList.js` 中定义的，但更常见的是 selector 函数写在相关的 slice 文件中。因此，让我们将其添加到 todos slice 中：

```js title="src/features/todos/todosSlice.js"
// highlight-next-line
import { createSelector } from 'reselect'

// 省略 reducer

// 省略 action creators

// highlight-start
export const selectTodoIds = createSelector(
  // 首先传入一个或更多的 input selector 函数：
  state => state.todos,
  // 然后，output selector 接收所有输入结果作为参数
  // 并返回最终结果值
  todos => todos.map(todo => todo.id)
)
// highlight-end
```

接下来，在 `<TodoList>` 里使用：

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

这实际上与 `shallowEqual` 比较函数的行为略有不同。每当 `state.todos` 数组更改时，我们都会创建一个新的 todo IDs 数组。这包括对 todo 的任何不可变更新，例如切换其 `completed` 字段，因为我们必须为不可变更新创建一个新数组。

:::tip 提示

仅当你实际需要从原始数据派生其他值时，memoized selectors 才有用。如果只是查找并返回现有值，则可以将 selector 作为普通函数。

:::

### 具有多个参数的 Selectors

todo 应用程序应该能够根据其完成状态过滤出可见的 todo 列表。让我们编写一个 memoized selector，来返回过滤后的 todo 列表。

我们需要整个 `todos` 数组作为 output selector 的一个参数。还需要传入当前完成状态的过滤值。我们将添加一个单独的 input selector 来提取每个值，并将结果传递给 output selector。

```js title="src/features/todos/todosSlice.js"
import { createSelector } from 'reselect'
import { StatusFilters } from '../filters/filtersSlice'

// 省略其他代码

// highlight-start
export const selectFilteredTodos = createSelector(
  // 第一个 input selector：所有的 todo 列表
  state => state.todos,
  // 第二个 input selector：当前状态过滤器
  state => state.filters.status,
  // Output selector：接收两个值
  (todos, status) => {
    if (status === StatusFilters.All) {
      return todos
    }

    const completedStatus = status === StatusFilters.Completed
    // 根据过滤器返回未完成或已完成的 todo 列表
    return todos.filter(todo => todo.completed === completedStatus)
  }
)
// highlight-end
```

:::caution 警告

请注意，我们现在在两个 slice 之间添加了一个导入依赖关系——`todosSlice` 正在从 `filtersSlice` 导入一个值。这样做是合法的，但要小心使用。**如果两个 slice _都_ 尝试从彼此导入某些内容，则最终会产生“循环导入依赖”问题，从而导致代码崩溃**。如果发生这种情况，请尝试将一些通用代码移动到其自己的文件中，然后改为从该文件导入。

:::

现在，我们可以使用这个新的 filtered todos selector 作为另一个 selector 的输入，该 selector 返回这些 todo 的 ID：

```js title="src/features/todos/todosSlice.js"
export const selectFilteredTodoIds = createSelector(
  // 将其他的 memoized selector 作为输入传递
  selectFilteredTodos,
  // 并在 output selector 中导出数据
  filteredTodos => filteredTodos.map(todo => todo.id)
)
```

如果切换成在 `<TodoList>` 使用 `selectFilteredTodoIds`，那么我们应该能够将几个 todo 项标记为已完成状态：

![Todo app - todos marked completed](/img/tutorials/fundamentals/todos-app-markedCompleted.png)

然后切换筛选条件为 _只_ 显示已完成状态的列表：

![Todo app - todos marked completed](/img/tutorials/fundamentals/todos-app-showCompleted.png)

然后，我们可以扩展 `selectFilteredTodos`，以便在选择项中也包括颜色过滤：

```js title="src/features/todos/todosSlice.js"
export const selectFilteredTodos = createSelector(
  // 第一个 input selector：所有 todo 列表
  selectTodos,
  // 第二个 input selector：所有过滤器值
  // highlight-next-line
  state => state.filters,
  // Output selector: 接收两个值
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
    // 根据过滤器返回未完成或已完成的 todo 列表
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

请注意，通过将逻辑封装在此选择器中，即使更改了筛选行为，组件也不需要变更。现在我们可以同时按状态和颜色进行过滤：

![Todo app - status and color filters](/img/tutorials/fundamentals/todos-app-selectorFilters.png)

最后，我们的代码会在几个地方检索 `state.todos`。在本节的其余部分，我们将对该 state 的设计方式进行一些更改，我们将提取一个 `selectTodos` selector 以便在任何地方使用。我们还可以将 `selectTodoById` 移动到 `todosSlice` 中：

```js title="src/features/todos/todosSlice.js"
export const selectTodos = state => state.todos

export const selectTodoById = (state, todoId) => {
  return selectTodos(state).find(todo => todo.id === todoId)
}
```

:::info 提示

学习更多关于为何使用 selector 函数以及如何使用 Reselect 编写 memoized selectors，请参阅：

- [Using Redux: Deriving Data with Selectors](../../usage/deriving-data-selectors.md)

:::

## 异步请求状态

我们使用异步 thunk 从服务器获取 todo 的初始列表。由于我们使用的是虚拟的服务器 API，因此该响应会立即返回。在实际应用中，API 调用可能需要一段时间才能完成。在这种情况下，在我们等待响应完成过程中，通常会显示某种 loading spinner。

这通常在 Redux 应用中通过以下方式进行处理：

- 使用具有某种 loading state 值来表示请求的当前状态
- 在进行 API 调用 _前_ dispatch “request started” action，该 dispatch 会更改 loading state 值
- 在请求完成时再次更新 loading state 值，以表示调用已完成

然后，UI 层在请求过程中显示 loading spinner，并在请求完成时切换到显示真实数据。

我们将更新 todos slice 以跟踪 loading state 值，并 dispatch 一个额外的 `'todos/todosLoading'` action 作为 `fetchTodos` thunk 的一部分。

现在，todos reducer 的 `state` 只是 todos 本身的数组。如果我们想跟踪 todos slice 中的 loading state，我们需要将 todos state 重新组织为具有 todos 数组 _和_  loading state 值的对象。这也意味着重写 reducer 逻辑以处理额外的嵌套：

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
    // 省略其他 cases
    default:
      return state
  }
}

// 省略 action creators

// highlight-next-line
export const selectTodos = state => state.todos.entities
```

需要重点注意：

- todos 数组现在作为 `state.entities` 嵌套在 `todosReducer` state 对象中。entities 这个词是一个术语，意思是“具有 ID 的唯一项”，它确实描述了 todo 对象。
- 这也意味着数组嵌套在 _整个_ Redux state 对象中，作为 `state.todos.entities`
- 我们现在必须在 Reducer 中执行额外的步骤来复制额外的嵌套级别，以进行正确的不可变更新，例如 `state` 对象 -> `entities` 数组 -> `todo` 对象
- 由于代码的其余部分是 _只_ 通过 selectors 访问 todos state，**我们只需要更新 `selectTodo` selector**——即使我们重塑了 state，UI 的其余部分仍将继续按预期工作。

### Loading State 的枚举值

你还会注意到，我们已将 loading state 字段定义为字符串枚举：

```js
{
  status: 'idle' // or: 'loading', 'succeeded', 'failed'
}
```

而不是 `isLoading` 布尔值。

布尔值将状态限制为两种可能性：“加载”或“未加载”。实际上，**一个请求可能处于 _许多_ 不同的状态**，例如：

- 根本没有开始
- 进行中
- 成功
- 失败
- 成功，但又回到了我们可能想要重新获取状态的情况

应用程序逻辑也可能只应基于某些 actions 在特定 states 之间转换，而使用布尔值会更难实现。

因此，我们建议 **将 loading state 存储为字符串枚举值，而不是布尔值**。

:::info 提示

有关为什么 loading state 应为枚举值的详细说明，请参阅：

- [Redux Style Guide: treat reducers as state machines](../../style-guide/style-guide.md#treat-reducers-as-state-machines)

:::

在此基础上，我们将添加一个新的 loading action，该 action 会将状态设置为 `loading`，并更新 "loaded" action 以将 state 标志重置为 `idle`：

```js title="src/features/todos/todosSlice.js"
const initialState = {
  status: 'idle',
  entities: []
}

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    // 省略其他 cases
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

// 省略 action creators

// Thunk 函数
export const fetchTodos = () => async dispatch => {
  // highlight-next-line
  dispatch(todosLoading())
  const response = await client.get('/fakeApi/todos')
  dispatch(todosLoaded(response.todos))
}
```

但是，在 UI 中显示 loading state 前，我们需要修改虚拟服务器 API，来给 API 调用添加人为延迟。打开 `src/api/server.js`，然后在第 63 行周围查找被注释掉的行：

```js title="src/api/server.js"
new Server({
  routes() {
    this.namespace = 'fakeApi'
    // highlight-next-line
    // this.timing = 2000

    // 省略其他代码
  }
})
```

如果你取消注释该行，虚拟服务器将为应用程序的每个 API 调用添加2秒的延迟，这使我们有足够的时间看到正在显示的 loading spinner。

现在，我们可以读取 `<TodoList>` 组件中的 loading state 值，并根据该值显示 loading spinner。

```js title="src/features/todos/TodoList.js"
// 省略 imports

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

在实际应用中，我们还希望能处理 API 失败错误和其他潜在情况。

以下是启用加载状态后应用的视图（若要再次查看 spinner，请重新加载应用预览或在新选项卡（tab）中打开它）：

<iframe
  class="codesandbox"
  src="https://codesandbox.io/embed/github/reduxjs/redux-fundamentals-example-app/tree/checkpoint-7-asyncLoading/?fontsize=14&hidenavigation=1&theme=dark&runonclick=1"
  title="redux-fundamentals-example-app"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

## Flux Standard Actions

实际上 Redux store 本身并不关心你在 action 中放入了哪些字段。它只关心 `action.type` 是否存在并具有值，并且常规的 Redux action 始终使用字符串表来示 `action.type`。这意味着你 _可以_ 将任何其他字段放入所需的 action 中。也许我们可以用 `action.todo` 来表示 "todo add" action，或者用 `action.color` 来表示某个 action，依此类推。

但是，如果每个 action 对其数据字段使用不同的字段名称，则很难提前知道每个 reducer 中需要处理哪些字段。

这就是为什么 Redux 社区提出 [Flux Standard Actions 约定](https://github.com/redux-utilities/flux-standard-action#motivation)（简称 FSA）的原因。这是有关如何在 action 对象内部组织字段的建议方法，以便开发人员始终知道哪些字段包含哪些类型的数据。FSA 模式已经在 Redux 社区中被广泛使用，事实上，你在整个教程中都在使用它。

FSA 公约规定：

- 如果 action 对象需要包含任何实际数据，则数据值应始终放在 `action.payload` 中
- action 还可以具有包含额外描述性数据的 `action.meta` 字段
- action 也可以具有包含错误信息的 `action.error` 字段

所以，_所有_ Redux actions 必须：

- 是一个普通的 JS 对象
- 必须有 `type` 字段

如果你使用 FSA 模式编写 action，则 action 可能会：

- 包含一个 `payload` 字段
- 包含一个 `error` 字段
- 包含一个 `meta` 字段

<DetailedExplanation title="详细说明：FSA 和错误">

FSA 规范规定：

> 如果 action 表示错误，则可选的 `error` 属性可以设置为 `true`。
> `error` 为 true 的 action 类似于 rejected Promise。按照惯例，`payload` 应该是一个错误对象。
> 如果 `error` 属性除 `true` 之外还有任何其他值，包括 `undefined` 和 `null`，则该 action 不得解释为错误。

FSA 规范还反对为 loading succeeded 和 loading failed 之类的内容提供特定的 action 类型。

然而，在实践中，Redux 社区忽略了使用 `action.error` 作为布尔标识符的想法，而是选择了单独的 action 类型，如 `todos/todosLoadingSucceeded` 和 `todos/todosLoadingFailed`。这是因为检查这些 action 类型比首先处理 `todos/todosLoaded` _再_ 检查 `if（action.error）` 要容易得多。

你可以采用任何一种更适合你的方法，但大多数应用使用单独的 action 类型来表示成功和失败。

</DetailedExplanation>

## 规范化 State

到目前为止，我们已将 todos 保存在一个数组中。这是合理的，因为我们从服务器接收到的数据是一个数组，然后还需要遍历 todos 以在 UI 中将它们显示为列表。

但是，在较大的 Redux 应用中，通常将数据存储在**规范化 state 结构**中。“规范化”是指：

- 确保每条数据只有一个副本
- 以允许按 ID 直接查找项目（items）的方式存储项目
- 基于 ID 引用其他项目，而不是复制整个项目

例如，在博客应用程序中，你可能具有指向 `User` 和 `Comment` 对象的 `Post` 对象。同一个人可能有很多帖子（Post），因此，如果每个 `Post` 对象都包含整个 `User`，将产生同一个 `User` 对象的许多副本。相反，若 `Post` 对象的用户 ID 值为 `post.user`，然后我们就可以按 ID 查找 `User` 对象，如 `state.users[post.user]`。


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

让我们转换 todos slice，以规范化的形式存储 todos。这需要大改 reducer 的逻辑，并更新 selectors：

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

// 省略 action creators

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

现在 `state.entities` 字段是一个对象而不是数组，因此我们必须使用嵌套对象的展开运算符来更新数据而不是数组操作。此外，我们不能像循环数组那样循环访问对象，因此在几个地方，我们必须使用 `Object.values(entities)` 来获取 todo 数组，以便我们可以循环访问它们。

好消息是，由于我们使用 selectors 来封装 state 的查找，因此 UI 仍然不必更改。坏消息是，reducer 代码实际上更长、更复杂。

这里的部分问题是**此 todo 应用程序示例不是大型实际应用程序**。因此，规范化 state 在此特定应用中没有那么有用，并且更难看到潜在的好处。

幸运的是，在[第 8 节：基于 Redux Toolkit 的现代化 Redux](part-8-modern-redux.md) 中，我们将看到一些方法来大大缩短用于管理规范化 state 的 reducer 逻辑。

目前，要了解的重要事项是：

- 规范化在 Redux 应用中 _很_ 常用
- 主要好处是能够通过 ID 查找单个项目，并确保 state 中仅存在项目的一个副本

:::info 提示

有关规范化为何对 Redux 有用的更多详细信息，请参阅：

- [结构化 Reducers：规范化 State](../../usage/structuring-reducers/NormalizingStateShape.md)

:::

## Thunks 和 Promises

对于本节，我们还有最后一个模式要看。我们已经了解了如何基于 dispatch action 在 Redux store 中处理 loading state。如果我们需要查看组件中 thunk 的结果，该怎么办？

每当你调用 `store.dispatch(action)` 时，`dispatch` 实际上会返回 `action` 作为其结果。然后，middleware 可以修改该行为并返回一些其他值。

我们已经看到，Redux Thunk middleware 允许传递一个函数给 `dispatch`，调用该函数，然后返回结果：

```js title="reduxThunkMiddleware.js"
const reduxThunkMiddleware = storeAPI => next => action => {
  // 如果 action 是一个函数
  if (typeof action === 'function') {
    // 调用函数并将 `dispatch` 和 `getState` 作为参数传递
    // 此外，返回 thunk 函数返回的任何内容
    return action(storeAPI.dispatch, storeAPI.getState)
  }

  // 否则，这是普通的 action——继续发送
  return next(action)
}
```

这意味着**我们可以编写返回 promise 的 thunk 函数，并在组件中等待 promise 状态变化**。

`<Header>` 组件已经 dispatch 了一个 thunk，用于将新的 todo 条目保存到服务器。让我们在 `<Header>` 组件中添加一些加载状态，然后在等待服务器响应时禁用文本输入并显示另一个 loading spinner：

```js title="src/features/header/Header.js"
const Header = () => {
  const [text, setText] = useState('')
  // highlight-next-line
  const [status, setStatus] = useState('idle')
  const dispatch = useDispatch()

  const handleChange = e => setText(e.target.value)

  // highlight-start
  const handleKeyDown = async e => {
    // 如果用户按下 Enter 键
    const trimmedText = text.trim()
    if (e.which === 13 && trimmedText) {
      // 创建并 dispatch thunk 函数本身
      setStatus('loading')
      // 等待 saveNewTodo 返回的 promise
      await dispatch(saveNewTodo(trimmedText))
      // 清除文本输入
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

现在，如果添加一个 todo，我们将在标题中看到一个 spinner：

![Todo app - component loading spinner](/img/tutorials/fundamentals/todos-app-headerLoading.png)

## 你的所学

如你所见，在 Redux 应用中广泛使用的还有其他几种模式。这些模式不是必需的，最初可能涉及编写更多代码，但同时提供了一些好处，例如使逻辑可重用、封装实现细节、提高应用性能以及使查找数据更容易。

:::info 提示

有关这些模式存在的原因以及如何使用 Redux 的更多详细信息，请参阅：

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
- **记忆化（memoized）selectors 有助于提高 Redux 应用性能**
  - Reselect 有一个 `createSelector` API 可以生成记忆化（memoized）selectors
  - 如果给记忆化（memoized）selectors 传入相同的参数，将返回相同的结果（引用）
- **请求状态应存储为枚举值，而不是布尔值**
  - 使用 `idle` 和 `loading` 等枚举有助于一致地跟踪状态
- **Flux Standard Actions 是管理 action 对象公认的约定**
  - 在 Actions 里，`payload` 表示数据，`meta` 表示额外的描述，`error` 表示错误信息
- **规范化 state 使按 ID 查找项目变得更加容易**
  - 规范化数据存储在对象而不是数组中，以项目 ID 作为键
- **Thunks 可以从 `dispatch` 中返回 promise**
  - 组件内可以等待异步 thunks 完成后再处理一些逻辑

:::

## 下一步

“手动”编写这些代码可能既耗时又困难。**这就是我们推荐你用 [Redux Toolkit](https://redux-toolkit.js.org) 官方库去写 Redux 逻辑的原因**。

Redux Toolkit 包含的 API 可以**帮助你使用更少的代码来编写所有典型的 Redux 使用模式**。它还有助于**防止常见错误**，例如意外改变 state。

在[第 8 节：现代化 Redux](./part-8-modern-redux.md)，我们将介绍如何使用 Redux Toolkit 来简化迄今为止编写的所有代码。
