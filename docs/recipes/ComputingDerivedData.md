# 计算衍生数据

[Reselect](https://github.com/faassen/reselect.git) 库可以创建可记忆的(Memoized)、可组合的 **selector** 函数。Reselect selectors 可以用来高效地计算 Redux store 里的衍生数据。

### 可记忆的 Selectors 初衷

首先访问 [Todos 列表示例](../basics/UsageWithReact.md):

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
    // 通过 connect() 注入：
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

function select(state) {
  return {
    visibleTodos: selectTodos(state.todos, state.visibilityFilter),
    visibilityFilter: state.visibilityFilter
  };
}

// 打包组件，注入 dispatch 和 state
export default connect(select)(App);
```

上面的示例中，`select` 调用了 `selectTodos` 来计算 `visibleTodos`。运行没问题，但有一个缺点：每当组件更新时都会重新计算 `visibleTodos`。如果 state tree 非常大，或者计算量非常大，每次更新都重新计算可能会带来性能问题。Reselect 能帮你省去这些没必要的重新计算。

### 创建可记忆的 Selector

我们需要一个可记忆的 selector 来替代这个 `select`，只在 `state.todos` or `state.visibilityFilter` 变化时重新计算 `visibleTodos`，而在其它部分（非相关）变化时不做计算。

Reselect 提供 `createSelector` 函数来创建可记忆的 selector。`createSelector` 接收一个 input-selectors 数组和一个转换函数作为参数。如果 state tree 的改变会引起 input-selector 值变化，那么 selector 会调用转换函数，传入 input-selectors 作为参数，并返回结果。如果 input-selectors 的值和前一次的一样，它将会直接返回前一次计算的数据，而不会再调用一次转换函数。

定义一个可记忆的 selector `visibleTodosSelector` 来替代 `select`：

#### `selectors/TodoSelectors.js`

```js
import { createSelector } from 'reselect';
import { VisibilityFilters } from './actions';

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

const visibilityFilterSelector = (state) => state.visibilityFilter;
const todosSelector = (state) => state.todos;

export const visibleTodosSelector = createSelector(
  [visibilityFilterSelector, todosSelector],
  (visibilityFilter, todos) => {
    return {
      visibleTodos: selectTodos(todos, visibilityFilter),
      visibilityFilter
    };
  }
);
```

在上例中，`visibilityFilterSelector` 和 `todosSelector` 是 input-selector。因为他们并不转换数据，所以被创建成普通的非记忆的 selector 函数。但是，`visibleTodosSelector` 是一个可记忆的 selector。他接收 `visibilityFilterSelector` 和 `todosSelector` 为 input-selector，还有一个转换函数来计算过滤的 todos 列表。

### 组合 Selector

可记忆的 selector 自身可以作为其它可记忆的 selector 的 input-selector。下面的 `visibleTodosSelector` 被当作另一个 selector 的 input-selector，来进一步通过关键字（keyword）过滤 todos。

```js
const keywordSelector = (state) => state.keyword

const keywordFilterSelector = createSelector(
  [ visibleTodosSelector, keywordSelector ],
  (visibleTodos, keyword) => visibleTodos.filter(
    todo => todo.indexOf(keyword) > -1
  )
)
```

### 连接 Selector 和 Redux Store

如果你在使用 react-redux，你可以使用 connect 来连接可记忆的 selector 和 Redux store。

#### `containers/App.js`

```js
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { addTodo, completeTodo, setVisibilityFilter } from '../actions'
import AddTodo from '../components/AddTodo'
import TodoList from '../components/TodoList'
import Footer from '../components/Footer'
import { visibleTodosSelector } from '../selectors/todoSelectors'

class App extends Component {
  render() {
    // Injected by connect() call:
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

// 把 selector 传递给连接的组件
export default connect(visibleTodosSelector)(App)
```
