# 搭配 React

这里需要再强调一下：Redux 和 React 之间没有关系。Redux 支持 React、Angular、Ember、jQuery 甚至纯 JavaScript。

尽管如此，Redux 还是和 [React](http://facebook.github.io/react/) 和 [Deku](https://github.com/dekujs/deku) 这类框架搭配起来用最好，因为这类框架允许你以 state 函数的形式来描述界面，Redux 通过 action 的形式来发起 state 变化。

下面使用 React 来开发一个 todo 任务管理应用。

## 安装 React Redux

Redux 默认并不包含 [React 绑定库](https://github.com/gaearon/react-redux)，需要单独安装。

```
npm install --save react-redux
```

## 智能组件（Smart Components）和木偶组件（Dumb Components）

Redux 的 React 绑定库拥抱了 [智能组件和木偶组件相分离](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) 的开发思想。

明智的做法是只在最顶层组件（如路由操作）里使用 Redux。内部组件应该像木偶一样保持“呆滞”，所有数据都通过 props 传入。

<center>
<table>
    <thead>
        <tr>
            <th></th>
            <th>Location</th>
            <th>Aware of Redux</th>
            <th>To read data</th>
            <th>To change data</th>
        </tr>
    </thead>
    <tbody>
        <tr>
          <td>“Smart” Components</td>
          <td>Top level, route handlers</td>
          <td>Yes</th>
          <td>Subscribe to Redux state</td>
          <td>Dispatch Redux actions</td>
        </tr>
        <tr>
          <td>“Dumb” Components</td>
          <td>Middle and leaf components</td>
          <td>No</th>
          <td>Read data from props</td>
          <td>Invoke callbacks from props</td>
        </tr>
    </tbody>
</table>
</center>

在这个 todo 应用中，只应有一个智能组件，它存在于组件的最顶层。在复杂的应用中，也有可能会有多个智能组件。虽然你也可以嵌套使用智能组件，但应该尽可能的使用传递 props 的形式。

## 设计组件层次结构

还记得当初如何 [设计 reducer 结构](Reducers.md) 吗？现在就要定义与它匹配的界面的层次结构。其实这不是 Redux 相关的工作，[React 开发思想](https://facebook.github.io/react/docs/thinking-in-react.html)在这方面解释的非常棒。

Our design brief is simple. We want to show a list of todo items. On click, a todo item is crossed out as completed. We want to show a field where user may add a new todo. In the footer, we want to show a toggle to show all / only completed / only incompleted todos.

I see the following components (and their props) emerge from this brief:

* **`AddTodo`** is an input field with a button.
  - `onAddClick(text: string)` is a callback to invoke when a button is pressed.
* **`TodoList`** is a list showing visible todos.
  - `todos: Array` is an array of todo items with `{ text, completed }` shape.
  - `onTodoClick(index: number)` is a callback to invoke when a todo is clicked.
* **`Todo`** is a single todo item.
  - `text: string` is the text to show.
  - `completed: boolean` is whether todo should appear crossed out.
  - `onClick()` is a callback to invoke when a todo is clicked.
* **`Footer`** is a component where we let user change visible todo filter.
  - `filter: string` is the current filter: `'SHOW_ALL'`, `'SHOW_COMPLETED'` or `'SHOW_ACTIVE'`.
  - `onFilterChange(nextFilter: string)`: Callback to invoke when user chooses a different filter.

These are all “dumb” components. They don’t know *where* the data comes from, or *how* to change it. They only render what’s given to them.

If you migrate from Redux to something else, you’ll be able to keep all these components exactly the same. They have no dependency on Redux.

Let’s write them! We don’t need to think about binding to Redux yet. You can just give them fake data while you experiment until they render correctly.

## 木偶组件

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
};
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
    );
  }
}

TodoList.propTypes = {
  onTodoClick: PropTypes.func.isRequired,
  todos: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  }).isRequired).isRequired
};
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
    );
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

就这些，现在开发一个木偶型的组件 `App` 把它们渲染出来，验证下是否工作。

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

We need to do two changes to connect our `App` component to Redux and make it dispatch actions and read state from the Redux store.

First, we need to import `Provider` from [`react-redux`](http://github.com/gaearon/react-redux) we installed earlier, and **wrap the root component in `<Provider>`** before rendering.

#### `index.js`

```js
import React from 'react'; 
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './containers/App';
import todoApp from './reducers';

let store = createStore(todoApp);

let rootElement = document.getElementById('root');
React.render(
  // The child must be wrapped in a function
  // to work around an issue in React 0.13.
  <Provider store={store}>
    {() => <App />}
  </Provider>,
  rootElement
);
```

This makes our store instance available to the components below. (Internally, this is done via React [undocumented “context” feature](http://www.youtube.com/watch?v=H7vlH-wntD4), but it’s not exposed directly in the API so don’t worry about it.)

Then, we **wrap the components we want to connect to Redux with `connect()` function from [`react-redux`](http://github.com/gaearon/react-redux)**. Try to only do this for a top-level component, or route handlers. While technically you can `connect()` any component in your app to Redux store, avoid doing this too deeply because it will make the data flow harder to trace.

**Any component wrapped with `connect()` call will receive a [`dispatch`](../api/Store.md#dispatch) function as a prop, and any state it needs from the global state.** The only argument to `connect()` is a function we call a **selector**. This function takes the global Redux store’s state, and returns the props you need for the component. In the simplest case, you can just return the `state` given to you, but you may also wish to transform it first.

To make performant memoized transformations with composable selectors, check out [reselect](https://github.com/faassen/reselect). In this example, we won’t use it, but it works great for larger apps.

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
    // Injected by connect() call:
    const { dispatch, visibleTodos, visibilityFilter } = this.props;
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
    );
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
};

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

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function select(state) {
  return {
    visibleTodos: selectTodos(state.todos, state.visibilityFilter),
    visibilityFilter: state.visibilityFilter
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(App);
```

到此为止，迷你型的任务管理应用就开发完毕。

## 下一步

参照 [本示例完整](ExampleTodoList.md) 来深化理解。然后就可以跳到 [高级教程](../advanced/README.md) 学习网络请求处理和路由。
