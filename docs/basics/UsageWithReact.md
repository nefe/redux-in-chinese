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

Redux 的 React 绑定库包含了 [容器组件和展示组件相分离](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) 的开发思想。

明智的做法是只在最顶层组件（如路由操作）里使用 Redux。其余内部组件仅仅是展示性的，所有数据都通过 props 传入。

<table>
    <thead>
        <tr>
            <th></th>
            <th scope="col" style="text-align:left">容器组件</th>
            <th scope="col" style="text-align:left">展示组件</th>
        </tr>
    </thead>
    <tbody>
        <tr>
          <th scope="row" style="text-align:right">Location</th>
          <td>最顶层，路由处理</td>
          <td>中间和子组件</td>
        </tr>
        <tr>
          <th scope="row" style="text-align:right">Aware of Redux</th>
          <td>是</th>
          <td>否</th>
        </tr>
        <tr>
          <th scope="row" style="text-align:right">读取数据</th>
          <td>从 Redux 获取 state</td>
          <td>从 props 获取数据</td>
        </tr>
        <tr>
          <th scope="row" style="text-align:right">修改数据</th>
          <td>向 Redux 派发 actions</td>
          <td>从 props 调用回调函数</td>
        </tr>
    </tbody>
</table>

在这个 todo 应用中，只应有一个容器组件，它存在于组件的最顶层。在复杂的应用中，也有可能会有多个容器组件。虽然你也可以嵌套使用容器组件，但应该尽可能的使用传递 props 的形式。

## 设计组件层次结构

还记得当初如何 [设计 state 根对象的结构](Reducers.md) 吗？现在就要定义与它匹配的界面的层次结构。其实这不是 Redux 相关的工作，[React 开发思想](https://facebook.github.io/react/docs/thinking-in-react.html)在这方面解释的非常棒。

我们的概要设计很简单。我们想要显示一个 todo 项的列表。一个 todo 项被点击后，会增加一条删除线并标记 completed。我们会显示用户新增一个 todo 字段。在 footer 里显示一个可切换的显示全部/只显示 completed 的/只显示 incompleted 的 todos。

以下的这些组件（和它们的 props ）就是从这个设计里来的：

* **`AddTodo`** 输入字段的输入框和按钮。
  - `onAddClick(text: string)` 当按钮被点击时调用的回调函数。
* **`TodoList`** 用于显示 todos 列表。
  - `todos: Array` 以 `{ text, completed }` 形式显示的 todo 项数组。
  - `onTodoClick(index: number)` 当 todo 项被点击时调用的回调函数。
* **`Todo`** 一个 todo 项。
  - `text: string` 显示的文本内容。
  - `completed: boolean` todo 项是否显示删除线。
  - `onClick()` 当 todo 项被点击时调用的回调函数。
* **`Footer`** 一个允许用户改变可见 todo 过滤器的组件。
  - `filter: string` 当前的过滤器为： `'SHOW_ALL'`、 `'SHOW_COMPLETED'` 或 `'SHOW_ACTIVE'`。
  - `onFilterChange(nextFilter: string)`： 当用户选择不同的过滤器时调用的回调函数。

这些全部都是展示组件。它们不知道数据是从**哪里**来的，或者数据是**怎么**变化的。你传入什么，它们就渲染什么。

如果你要把 Redux 迁移到别的上，你应该要保持这些组件的一致性。因为它们不依赖于 Redux。

直接写就是了！我们已经不用绑定到 Redux。你可以在开发过程中给出一些实验数据，直到它们渲染对了。

## 展示组件

这就是普通的 React 组件，所以就不在详述。直接看代码：

#### `components/AddTodo.js`

```js
import React, { findDOMNode, Component, PropTypes } from 'react';

export default class AddTodo extends Component {
  render() {
    return (
      <div>
        <input type='text' ref='input' />
        <button onClick={e => this.handleClick(e)}>
          Add
        </button>
      </div>
    );
  }

  handleClick(e) {
    const node = findDOMNode(this.refs.input);
    const text = node.value.trim();
    this.props.onAddClick(text);
    node.value = '';
  }
}

AddTodo.propTypes = {
  onAddClick: PropTypes.func.isRequired
}
```

#### `components/Todo.js`

```js
import React, { Component, PropTypes } from 'react';

export default class Todo extends Component {
  render() {
    return (
      <li
        onClick={this.props.onClick}
        style={{
          textDecoration: this.props.completed ? 'line-through' : 'none',
          cursor: this.props.completed ? 'default' : 'pointer'
        }}>
        {this.props.text}
      </li>
    );
  }
}

Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  completed: PropTypes.bool.isRequired
};
```

#### `components/TodoList.js`

```js
import React, { Component, PropTypes } from 'react';
import Todo from './Todo';

export default class TodoList extends Component {
  render() {
    return (
      <ul>
        {this.props.todos.map((todo, index) =>
          <Todo {...todo}
                key={index}
                onClick={() => this.props.onTodoClick(index)} />
        )}
      </ul>
    )
  }
}

TodoList.propTypes = {
  onTodoClick: PropTypes.func.isRequired,
  todos: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  }).isRequired).isRequired
}
```

#### `components/Footer.js`

```js
import React, { Component, PropTypes } from 'react';

export default class Footer extends Component {
  renderFilter(filter, name) {
    if (filter === this.props.filter) {
      return name;
    }

    return (
      <a href='#' onClick={e => {
        e.preventDefault();
        this.props.onFilterChange(filter);
      }}>
        {name}
      </a>
    )
  }

  render() {
    return (
      <p>
        Show:
        {' '}
        {this.renderFilter('SHOW_ALL', 'All')}
        {', '}
        {this.renderFilter('SHOW_COMPLETED', 'Completed')}
        {', '}
        {this.renderFilter('SHOW_ACTIVE', 'Active')}
        .
      </p>
    );
  }
}

Footer.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  filter: PropTypes.oneOf([
    'SHOW_ALL',
    'SHOW_COMPLETED',
    'SHOW_ACTIVE'
  ]).isRequired
};
```

就是这些，现在开发一个笨拙型的组件 `App` 把它们渲染出来，验证下是否工作。

#### `containers/App.js`

```js
import React, { Component } from 'react';
import AddTodo from '../components/AddTodo';
import TodoList from '../components/TodoList';
import Footer from '../components/Footer';

export default class App extends Component {
  render() {
    return (
      <div>
        <AddTodo
          onAddClick={text =>
            console.log('add todo', text)
          } />
        <TodoList
          todos={[{
            text: 'Use Redux',
            completed: true
          }, {
            text: 'Learn to connect it to React',
            completed: false
          }]}
          onTodoClick={todo =>
            console.log('todo clicked', todo)
          } />
        <Footer
          filter='SHOW_ALL'
          onFilterChange={filter =>
            console.log('filter change', filter)
          } />
      </div>
    );
  }
}
```

渲染 `<App />` 结果如下：

<img src='http://i.imgur.com/lj4QTfD.png' width='40%'>

单独来看，并没有什么特别，现在把它和 Redux 连起来。

## 连接到 Redux

我们需要做出两个变化，将 `App` 组件连接到 Redux 并且让它能够 dispatch actions 以及从 Redux store 读取到 state。

首先，我们需要获取从之前安装好的 [`react-redux`](http://github.com/reactjs/react-redux) 提供的  `Provider`，并且在渲染之前**将根组件包装进 `<Provider>`**。

#### `index.js`

```js
import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './containers/App'
import todoApp from './reducers'

let store = createStore(todoApp);

let rootElement = document.getElementById('root')
render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
)
```

这使得我们的 store 能为下面的组件所用。（在内部，这个是通过 React 的 ["context" 特性](http://facebook.github.io/react/docs/context.html)实现。）

接着，我们**想要通过 [`react-redux`](http://github.com/reactjs/react-redux) 提供的 `connect()` 方法将包装好的组件连接到Redux**。尽量只做一个顶层的组件，或者 route 处理。从技术上来说你可以将应用中的任何一个组件 `connect()` 到 Redux store 中，但尽量避免这么做，因为这个数据流很难追踪。

**任何一个从 `connect()` 包装好的组件都可以得到一个 [`dispatch`](../api/Store.md#dispatch) 方法作为组件的 props，以及得到全局 state 中所需的任何内容。** `connect()` 的唯一参数是 **selector**。此方法可以从 Redux store 接收到全局的 state，然后返回组件中需要的 props。最简单的情况下，可以返回一个初始的 `state` （例如，返回认证方法），但最好先将其进行转化。

为了使组合 selectors 更有效率，不妨看看  [reselect](https://github.com/faassen/reselect)。在这个例子中我们不会用到它，但它适合更大的应用。

#### `containers/App.js`

```js
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addTodo, completeTodo, setVisibilityFilter, VisibilityFilters } from '../actions';
import AddTodo from '../components/AddTodo';
import TodoList from '../components/TodoList';
import Footer from '../components/Footer';

class App extends Component {
  render() {
    // 通过调用 connect() 注入:
    const { dispatch, visibleTodos, visibilityFilter } = this.props
    return (
      <div>
        <AddTodo
          onAddClick={text =>
            dispatch(addTodo(text))
          } />
        <TodoList
          todos={this.props.visibleTodos}
          onTodoClick={index =>
            dispatch(completeTodo(index))
          } />
        <Footer
          filter={visibilityFilter}
          onFilterChange={nextFilter =>
            dispatch(setVisibilityFilter(nextFilter))
          } />
      </div>
    )
  }
}

App.propTypes = {
  visibleTodos: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  })),
  visibilityFilter: PropTypes.oneOf([
    'SHOW_ALL',
    'SHOW_COMPLETED',
    'SHOW_ACTIVE'
  ]).isRequired
}

function selectTodos(todos, filter) {
  switch (filter) {
  case VisibilityFilters.SHOW_ALL:
    return todos;
  case VisibilityFilters.SHOW_COMPLETED:
    return todos.filter(todo => todo.completed);
  case VisibilityFilters.SHOW_ACTIVE:
    return todos.filter(todo => !todo.completed);
  }
}

// 基于全局 state ，哪些是我们想注入的 props ?
// 注意：使用 https://github.com/reactjs/reselect 效果更佳。
function select(state) {
  return {
    visibleTodos: selectTodos(state.todos, state.visibilityFilter),
    visibilityFilter: state.visibilityFilter
  };
}

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export default connect(select)(App);
```

到此为止，迷你型的任务管理应用就开发完毕。

## 下一步

参照 [本完整示例](ExampleTodoList.md) 来深化理解。然后就可以跳到 [高级教程](../advanced/README.md) 学习网络请求处理和路由。
