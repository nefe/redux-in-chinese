# 搭配 React

这里需要再强调一下：Redux 和 React 之间没有关系。Redux 支持 React、Angular、Ember、jQuery 甚至纯 JavaScript。

尽管如此，Redux 还是和 [React](http://facebook.github.io/react/) 和 [Deku](https://github.com/dekujs/deku) 这类框架搭配起来用最好，因为这类框架允许你以 state 函数的形式来描述界面，Redux 通过 action 的形式来发起 state 变化。

下面使用 React 来开发一个 todo 任务管理应用。

## 安装 React Redux

Redux 默认并不包含 [React 绑定库](https://github.com/reactjs/react-redux)，需要单独安装。

```
npm install --save react-redux
```

## 容器组件（Smart/Container Components）和展示组件（Dumb/Presentational Components）

Redux 的 React 绑定库是基于 [容器组件和展示组件相分离](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) 的开发思想。所以建议先读完这篇文章再回来继续学习。

已经读完了？那让我们再总结一下不同点：

<table>
    <thead>
        <tr>
            <th></th>
            <th scope="col" style="text-align:left">展示组件</th>
            <th scope="col" style="text-align:left">容器组件</th>
        </tr>
    </thead>
    <tbody>
        <tr>
          <th scope="row" style="text-align:right">作用</th>
          <td>描述如何展现（骨架、样式）</td>
          <td>描述如何运行（数据获取、状态更新）</td>
        </tr>
        <tr>
          <th scope="row" style="text-align:right">直接使用 Redux</th>
          <td>否</th>
          <td>是</th>
        </tr>
        <tr>
          <th scope="row" style="text-align:right">数据来源</th>
          <td>props</td>
          <td>监听 Redux state</td>
        </tr>
        <tr>
          <th scope="row" style="text-align:right">数据修改</th>
          <td>从 props 调用回调函数</td>
          <td>向 Redux 派发 actions</td>
        </tr>
        <tr>
          <th scope="row" style="text-align:right">调用方式</th>
          <td>手动</td>
          <td>通常由 React Redux 生成</td>
        </tr>
    </tbody>
</table>

大部分的组件都应该是展示型的，但一般需要少数的几个容器组件把它们和 Redux store 连接起来。

技术上讲你可以直接使用 `store.subscribe()` 来编写容器组件。但不建议这么做因为就无法使用 React Redux 带来的性能优化。也因此，不要手写容器组件，都是使用 React Redux 的 `connect()` 方法来生成，后面会详细介绍。

## 设计组件层次结构

还记得当初如何 [设计 state 根对象的结构](Reducers.md) 吗？现在就要定义与它匹配的界面的层次结构。其实这不是 Redux 相关的工作，[React 开发思想](https://facebook.github.io/react/docs/thinking-in-react.html)在这方面解释的非常棒。

我们的概要设计很简单。我们想要显示一个 todo 项的列表。一个 todo 项被点击后，会增加一条删除线并标记 completed。我们会显示用户新增一个 todo 字段。在 footer 里显示一个可切换的显示全部/只显示 completed 的/只显示 incompleted 的 todos。

### 展示组件

以下的这些组件（和它们的 props ）就是从这个设计里来的：

* **`TodoList`** 用于显示 todos 列表。
  - `todos: Array` 以 `{ text, completed }` 形式显示的 todo 项数组。
  - `onTodoClick(index: number)` 当 todo 项被点击时调用的回调函数。
* **`Todo`** 一个 todo 项。
  - `text: string` 显示的文本内容。
  - `completed: boolean` todo 项是否显示删除线。
  - `onClick()` 当 todo 项被点击时调用的回调函数。
* **`Link`** 带有 callback 回调功能的链接
  - `onClick()` 当点击链接时会触发
* **`Footer`** 一个允许用户改变可见 todo 过滤器的组件。
* **`App`** 根组件，渲染余下的所有内容。

这些组件只定义外观并不设计数据从哪里来，如果改变它。传入什么就渲染什么。如果你把代码从 Redux 迁移到别的架构，这些组件可以不做任何改动直接使用。它们并不依赖于 Redux。

### 容器组件

还需要一些容器组件来把展示组件连接到 Redux。例如，展示型的 `TodoList` 组件需要一个类似 `VisibleTodoList` 的容器来监听 Redux store 变化并处理如何过滤出要显示的数据。为了实现状态过滤，需要实现 `FilterLink` 的容器组件来渲染 `Link` 并在点击时触发对应的 action：

* **`VisibleTodoList`** 根据当前显示的状态来对 todo 列表进行过滤，并渲染 `TodoList`。
* **`FilterLink`** 得到当前过滤器并渲染 `Link`。
  - `filter: string` 就是当前过滤的状态

### 其它组件

有时很难分清到底该使用容器组件还是展示组件。例如，有时表单和函数严重耦合在一起，如这个小的组件：

* **`AddTodo`** 含有“Add”按钮的输入框

技术上讲可以把它分成两个组件，但一开始就这么做有点早。在一些非常小的组件里混用容器和展示是可以的。当业务变复杂后，如何拆分就很明显了。所以现在就使用混合型的中。

## 组件编码

终于开始开发组件了！先做展示组件，这样可以先不考虑 Redux。

### 展示组件

它们只是普通的 React 组件，所以不会详细解释。我们会使用函数式无状态组件除非需要本地 state 或生命周期函数的场景。这并不是说展示组件必须是函数 -- 只是因为这样做容易些。如果你需要使用本地 state，生命周期方法，或者性能优化，可以所它们转成 class。

#### `components/Todo.js`

```js
import React, { PropTypes } from 'react'

const Todo = ({ onClick, completed, text }) => (
  <li
    onClick={onClick}
    style={{
      textDecoration: completed ? 'line-through' : 'none'
    }}
  >
    {text}
  </li>
)

Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired
}

export default Todo
```

#### `components/TodoList.js`

```js
import React, { PropTypes } from 'react'
import Todo from './Todo'

const TodoList = ({ todos, onTodoClick }) => (
  <ul>
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => onTodoClick(todo.id)}
      />
    )}
  </ul>
)

TodoList.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    completed: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired).isRequired,
  onTodoClick: PropTypes.func.isRequired
}

export default TodoList
```

#### `components/Link.js`

```js
import React, { PropTypes } from 'react'

const Link = ({ active, children, onClick }) => {
  if (active) {
    return <span>{children}</span>
  }

  return (
    <a href="#"
       onClick={e => {
         e.preventDefault()
         onClick()
       }}
    >
      {children}
    </a>
  )
}

Link.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Link
```

#### `components/Footer.js`

```js
import React from 'react'
import FilterLink from '../containers/FilterLink'

const Footer = () => (
  <p>
    Show:
    {" "}
    <FilterLink filter="SHOW_ALL">
      All
    </FilterLink>
    {", "}
    <FilterLink filter="SHOW_ACTIVE">
      Active
    </FilterLink>
    {", "}
    <FilterLink filter="SHOW_COMPLETED">
      Completed
    </FilterLink>
  </p>
)

export default Footer
```

#### `components/App.js`

```js
import React from 'react'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'

const App = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
)

export default App
```

### 容器组件

现在来创建一些容器组件把这些展示组件和 Redux 关联起来。技术上讲，容器组件就是使用 [`store.subscribe()`](../api/Store.md#subscribe) 从 Redux state 树中读取部分数据，并通过 props 来把这些数据提供给要渲染的组件。你可以手工来开发容器组件，但建议使用使用 React Redux 库的 [`connect()`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) 方法来生成，这个方法做了性能优化来避免很多不必要的重复渲染。（这样你就不必为了性能而手动实现 [React 性能优化建议](https://facebook.github.io/react/docs/advanced-performance.html) 中的 `shouldComponentUpdate` 方法。）

使用 `connect()` 前，需要先定义 `mapStateToProps` 这个函数来指定如何把当前 Redux store state 映射到展示组件的 props 中。例如，`VisibleTodoList` 需要计算传到 `TodoList` 中的 `todos`，所以定义了根据 `state.visibilityFilter` 来过滤 `state.todos` 的方法，并在 `mapStateToProps` 中使用。

```js
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
```

除了读取 state，容器组件还能分发 action。类似的方式，可以定义 `mapDispatchToProps()` 方法接收 [`dispatch()`](../api/Store.md#dispatch) 方法并返回期望注入到展示组件的 props 中的回调方法。例如，我们希望 `VisibleTodoList` 向 `TodoList` 组件中注入一个叫 `onTodoClick` 的 props 中，还希望 `onTodoClick` 能分发 `TOGGLE_TODO` 这个 action：

```js
const mapDispatchToProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id))
    }
  }
}
```

最后，使用 `connect()` 创建 `VisibleTodoList`，并传入这两个函数。

```js
import { connect } from 'react-redux'

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)

export default VisibleTodoList
```

这就是 React Redux API 的基础，但还漏了一些快捷技巧和强大的配置。建议你仔细学习 [它的文档](https://github.com/reactjs/react-redux)。如果你担心 `mapStateToProps` 创建新对象太过频繁，可以学习如何使用 [reselect](https://github.com/reactjs/reselect) 来 [计算衍生数据](../recipes/ComputingDerivedData.md)。

其它容器组件定义如下：

#### `containers/FilterLink.js`

```js
import { connect } from 'react-redux'
import { setVisibilityFilter } from '../actions'
import Link from '../components/Link'

const mapStateToProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter))
    }
  }
}

const FilterLink = connect(
  mapStateToProps,
  mapDispatchToProps
)(Link)

export default FilterLink
```

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

### 其它组件

#### `containers/AddTodo.js`

```js
import React from 'react'
import { connect } from 'react-redux'
import { addTodo } from '../actions'

let AddTodo = ({ dispatch }) => {
  let input

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        if (!input.value.trim()) {
          return
        }
        dispatch(addTodo(input.value))
        input.value = ''
      }}>
        <input ref={node => {
          input = node
        }} />
        <button type="submit">
          Add Todo
        </button>
      </form>
    </div>
  )
}
AddTodo = connect()(AddTodo)

export default AddTodo
```

## 传入 Store

所有容器组件都可以访问 Redux store，所以可以手动监听它。一种方式是把它以 props 的形式传入到所有容器组件中。但这太麻烦了，因为必须要用 `store` 把展示组件包裹一层，仅仅是因为恰好在组件树中渲染了一个容器组件。

建议的方式是使用指定的 React Redux 组件 [`<Provider>`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#provider-store) 来 [魔法般的](https://facebook.github.io/react/docs/context.html) 让所有容器组件都可以访问 store，而不必显示地传递它。只需要在渲染根组件时使用即可。

#### `index.js`

```js
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import todoApp from './reducers'
import App from './components/App'

let store = createStore(todoApp)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

## 下一步

参照 [本完整示例](ExampleTodoList.md) 来深化理解。然后就可以跳到 [高级教程](../advanced/README.md) 学习网络请求处理和路由。
