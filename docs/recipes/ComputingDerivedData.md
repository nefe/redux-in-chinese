# 计算衍生数据

[Reselect](https://github.com/faassen/reselect.git) 库可以创建可记忆的(Memoized)、可组合的 **selector** 函数。Reselect selectors 可以用来高效地计算 Redux store 里的衍生数据。

### 可记忆的 Selectors 初衷

首先访问 [Todos 列表示例](../basics/UsageWithReact.md):

#### `containers/VisibleTodoList.js`

```js
import { connect } from 'react-redux'
import { toggleTodo } from '../actions'
import TodoList from '../components/TodoList'

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)
  }
}

const mapStateToProps = (state) => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id))
    }
  }
}

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)

export default VisibleTodoList
```

上面的示例中，`mapStateToProps` 调用了 `getVisibleTodos` 来计算 `todos`。运行没问题，但有一个缺点：每当组件更新时都会重新计算 `todos`。如果 state tree 非常大，或者计算量非常大，每次更新都重新计算可能会带来性能问题。Reselect 能帮你省去这些没必要的重新计算。

### 创建可记忆的 Selector

我们需要一个可记忆的 selector 来替代这个 `getVisibleTodos`，只在 `state.todos` or `state.visibilityFilter` 变化时重新计算 `todos`，而在其它部分（非相关）变化时不做计算。

Reselect 提供 `createSelector` 函数来创建可记忆的 selector。`createSelector` 接收一个 input-selectors 数组和一个转换函数作为参数。如果 state tree 的改变会引起 input-selector 值变化，那么 selector 会调用转换函数，传入 input-selectors 作为参数，并返回结果。如果 input-selectors 的值和前一次的一样，它将会直接返回前一次计算的数据，而不会再调用一次转换函数。

定义一个可记忆的 selector `getVisibleTodos ` 来替代上面的无记忆版本：

#### `selectors/index.js`

```js
import { createSelector } from 'reselect'

const getVisibilityFilter = (state) => state.visibilityFilter
const getTodos = (state) => state.todos

export const getVisibleTodos = createSelector(
  [ getVisibilityFilter, getTodos ],
  (visibilityFilter, todos) => {
    switch (visibilityFilter) {
      case 'SHOW_ALL':
        return todos
      case 'SHOW_COMPLETED':
        return todos.filter(t => t.completed)
      case 'SHOW_ACTIVE':
        return todos.filter(t => !t.completed)
    }
  }
)
```

在上例中，`getVisibilityFilter` 和 `getTodos ` 是 input-selector。因为他们并不转换数据，所以被创建成普通的非记忆的 selector 函数。但是，`getVisibleTodos` 是一个可记忆的 selector。他接收 `getVisibilityFilter` 和 `getTodos` 为 input-selector，还有一个转换函数来计算过滤的 todos 列表。

### 组合 Selector

可记忆的 selector 自身可以作为其它可记忆的 selector 的 input-selector。下面的 `getVisibleTodos` 被当作另一个 selector 的 input-selector，来进一步通过关键字（keyword）过滤 todos。

```js
const getKeyword = (state) => state.keyword

const getVisibleTodosFilteredByKeyword = createSelector(
  [ getVisibleTodos, getKeyword ],
  (visibleTodos, keyword) => visibleTodos.filter(
    todo => todo.text.indexOf(keyword) > -1
  )
)
```

### 连接 Selector 和 Redux Store

如果你在使用 React Redux，你可以在 `mapStateToProps()` 中当正常函数来调用 selectors

#### `containers/VisibleTodoList.js`

```js
import { connect } from 'react-redux'
import { toggleTodo } from '../actions'
import TodoList from '../components/TodoList'
import { getVisibleTodos } from '../selectors'

const mapStateToProps = (state) => {
  return {
    todos: getVisibleTodos(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id))
    }
  }
}

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)

export default VisibleTodoList
```

### 在 selectors 中访问 React Props

到目前为止，我们只看到 selector 接收 Redux store state 作为参数，然而，selector 也可以接收 props。

例如，我们来实现包含多个 Todo List 的应用。我们需要改写 state 来支持多个 Todo List，每个 Todo List 分别有各自的 `todos` 和 `visibilityFilter` state。

我们还需要改写 reducer，现在 `todos` 和 `visibilityFilter` 分别在各自的 Todo List state里， 所以我们只需要一个 `todoLists` reducer 来进行我们的state 管理。

#### `reducers/index.js`

```js
import { combineReducers } from 'redux'
import todoLists from './todoLists'

export default combineReducers({
  todoLists
});
```

#### `reducers/todoLists.js`

```js
// Note that we're hard coding three lists here just as an example.
// In the real world, we'd have a feature to add/remove lists,
// and this would be empty initially.
const initialState = {
  1: {
    todos: [],
    visibilityFilter: 'SHOW_ALL'
  },
  2: {
    todos: [],
    visibilityFilter: 'SHOW_ALL'
  },
  3: {
    todos: [],
    visibilityFilter: 'SHOW_ALL'
  }
}

const addTodo = (state, action) => {
  const todoList = state[action.listId]
  const { todos } = todoList

  return {
    ...state,
    [action.listId]: {
      ...todoList,
      todos: [
        ...todos,
        {
          id: action.id,
          text: action.text,
          completed: false
        }
      ]
    }
  }
}

const toggleTodo = (state, action) => {
  const todoList = state[action.listId]
  const { todos } = todoList

  return {
    ...state,
    [action.listId]: {
      ...todoList,
      todos: todos.map(todo =>
        (todo.id === action.id)
          ? {...todo, completed: !todo.completed}
          : todo
      )
    }
  }
}

const setVisibilityFilter = (state, action) => {
  const todoList = state[action.listId]
  return {
    ...state,
    [action.listId]: {
      ...todoList,
      visibilityFilter: action.filter
    }
  }
}

export default const todoLists = (state = initialState, action) => {
  // make sure a list with the given id exists
  if (!state[action.listId]) {
    return state;
  }

  switch (action.type) {
    case 'ADD_TODO':
      return addTodo(state, action)

    case 'TOGGLE_TODO':
      return toggleTodo(state, action)

    case 'SET_VISIBILITY_FILTER':
      return setVisibilityFilter(state, action)

    default:
      return state
  }
}
```

上面的例子中，我们使用 `todoLists` reducer 来处理全部三个 action， 所以我们需要向 action creator 传入一个 `listId` 参数
 
#### `actions/index.js`

```js
let nextTodoId = 0
export const addTodo = (text, listId) => ({
  type: 'ADD_TODO',
  id: nextTodoId++,
  text,
  listId
})
 
export const setVisibilityFilter = (filter, listId) => ({
  type: 'SET_VISIBILITY_FILTER',
  filter,
  listId
})
 
export const toggleTodo = (id, listId) => ({
  type: 'TOGGLE_TODO',
  id,
  listId
})
 
export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}
```

#### `components/TodoList.js`

```js
import React from 'react'
import PropTypes from 'prop-types'
import Todo from './Todo'
 
const TodoList = ({ todos, toggleTodo, listId }) => (
  <ul>
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => toggleTodo(todo.id, listId)}
      />
    )}
  </ul>
)

export default TodoList
```

以下是渲染三个 `VisibleTodoList` components 的 `App` , 每个`VisibleTodoList` 都有一个 `listId` prop。

#### components/App.js

```js
import React from 'react'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'

const App = () => (
  <div>
    <VisibleTodoList listId="1" />
    <VisibleTodoList listId="2" />
    <VisibleTodoList listId="3" />
  </div>
)
```
每个 `VisibleTodoList` 容器根据 `listId` props 的值选择不同的 state 切片，让我们修改 `getVisibilityFilter` 和 `getTodos` 来接收 props。

#### `selectors/todoSelectors.js`

```js
import { createSelector } from 'reselect'

const getVisibilityFilter = (state, props) =>
  state.todoLists[props.listId].visibilityFilter

const getTodos = (state, props) => state.todoLists[props.listId].todos

const getVisibleTodos = createSelector(
  [getVisibilityFilter, getTodos],
  (visibilityFilter, todos) => {
    switch (visibilityFilter) {
      case 'SHOW_COMPLETED':
        return todos.filter(todo => todo.completed)
      case 'SHOW_ACTIVE':
        return todos.filter(todo => !todo.completed)
      default:
        return todos
    }
  }
)

export default getVisibleTodos
```

`props` 可以通过 `mapStateToProps` 传递给 `getVisibleTodos`:

```js
const mapStateToProps = (state, props) => {
  return {
    todos: getVisibleTodos(state, props)
  }
}
```

现在，`getVisibleTodos` 可以访问 `props`，一切看上去都是如此的美好。

**但是这儿有一个问题！**

使用带有多个 `visibleTodoList` 容器实例的 `getVisibleTodos` selector 不能正常使用函数记忆功能。

#### containers/VisibleTodoList.js

```js
import { connect } from 'react-redux'
import { toggleTodo } from '../actions'
import TodoList from '../components/TodoList'
import { getVisibleTodos } from '../selectors'

const mapStateToProps = (state, props) => {
  return {
    // 警告：下面的 selector 不会正确记忆
    todos: getVisibleTodos(state, props)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id))
    }
  }
}

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)

export default VisibleTodoList
```

用 `createSelector` 创建的 selector 只有在参数集与之前的参数集相同时才会返回缓存的值。如果我们交替的渲染 `VisibleTodoList listId="1" />` 和 `VisibleTodoList listId="2" />`，共享的 selector 将交替的接收 `listId: 1` 和 `listId: 2`。这会导致每次调用时传入的参数不同，因此 selector 将始终重新计算而不是返回缓存的值。我们将在下一节了解如何解决这个限制。

### 跨多组件的共享 Selector
> 这节中的例子需要 React Redux v4.3.0 或者更高的版本

为了跨越多个 `VisibleTodoList` 组件共享 selector，**同时实现**正确记忆。每个组件的实例需要有拷贝 selector 的私有版本。

我们创建一个 `makeGetVisibleTodos` 的函数，在每个调用的时候返回一个 `getVisibleTodos` selector 的新拷贝。

####selectors/todoSelectors.js
```js
import { createSelector } from 'reselect'

const getVisibilityFilter = (state, props) =>
  state.todoLists[props.listId].visibilityFilter

const getTodos = (state, props) =>
  state.todoLists[props.listId].todos

const makeGetVisibleTodos = () => {
  return createSelector(
    [ getVisibilityFilter, getTodos ],
    (visibilityFilter, todos) => {
      switch (visibilityFilter) {
        case 'SHOW_COMPLETED':
          return todos.filter(todo => todo.completed)
        case 'SHOW_ACTIVE':
          return todos.filter(todo => !todo.completed)
        default:
          return todos
      }
    }
  )
}
```

我们还需要一种每个容器访问自己私有 selector 的方式。`connect` 的 `mapStateToProps` 函数可以帮助我们。

**如果 `connect` 的 `mapStateToProps` 返回的不是一个对象而是一个函数，他将被用做为每个容器的实例创建一个单独的 `mapStateToProps` 函数。**

下面例子中的 `makeMapStateToProps` 创建一个新的 `getVisibleTodos` selectors，返回一个独占新 selector 的权限的 `mapStateToProps` 函数。

```js
const makeMapStateToProps = () => {
  const getVisibleTodos = makeGetVisibleTodos()
  const mapStateToProps = (state, props) => {
    return {
      todos: getVisibleTodos(state, props)
    }
  }
  return mapStateToProps
}
```

如果我们通过 `makeMapStateToProps` 来 `connect`，`VisibleTodosList` 容器的每个组件都会拥有含私有 `getVisibleTodos` selector 的 `mapStateToProps`。不论 `VisibleTodosList` 容器的展现顺序如何，记忆功能都会正常工作。

#### container/VisibleTodosList.js

```js
import { connect } from 'react-redux'
import { toggleTodo } from '../actions'
import TodoList from '../components/TodoList'
import { makeGetVisibleTodos } from '../selectors'

const makeMapStateToProps = () => {
  const getVisibleTodos = makeGetVisibleTodos()
  const mapStateToProps = (state, props) => {
    return {
      todos: getVisibleTodos(state, props)
    }
  }
  return mapStateToProps
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id))
    }
  }
}

const VisibleTodoList = connect(
  makeMapStateToProps,
  mapDispatchToProps
)(TodoList)

export default VisibleTodoList
```

### 下一步

查看 [官方文档](https://github.com/reactjs/reselect) 和 [FAQ](https://github.com/reactjs/reselect#faq)。当因为太多的衍生计算和重复渲染导致出现性能问题时，大多数的 Redux 项目会开始使用 Reselect。所以在你创建一个大型项目的时候确保你对 reselect 是熟悉的。你也可以去研究他的 [源码](https://github.com/reactjs/reselect/blob/master/src/index.js)，这样你就不认为他是黑魔法了。
