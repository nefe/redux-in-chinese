# `bindActionCreators(actionCreators, dispatch)`

把 [action creators](../Glossary.md#action-creator) 转成拥有同名 keys 的对象，但使用 [`dispatch`](Store.md#dispatch) 把每个 action creator 包围起来，这样可以直接调用它们。

一般情况下你可以直接在 [`Store`](Store.md) 实例上调用 [`dispatch`](Store.md#dispatch)。如果你在 React 中使用 Redux，[react-redux](https://github.com/gaearon/react-redux) 会提供 [`dispatch`](Store.md#dispatch) 函数让你直接调用它 。

惟一使用 `bindActionCreators` 的场景是当你需要把 action creator 往下传到一个组件上，却不想让这个组件觉察到 Redux 的存在，而且不希望把 Redux store 或 [`dispatch`](Store.md#dispatch) 传给它。

为方便起见，你可以传入一个函数作为第一个参数，它会返回一个函数。

#### 参数

1. `actionCreators` (*Function* or *Object*): 一个 [action creator](../Glossary.md#action-creator)，或者键值是 action creators 的对象。

2. `dispatch` (*Function*): 一个 [`dispatch`](Store.md#dispatch) 函数，由 [`Store`](Store.md) 实例提供。

#### 返回值

(*Function* or *Object*): 一个与原对象类似的对象，只不过这个对象中的的每个函数值都可以直接 dispatch action。如果传入的是一个函数作为 actionCreators，返回的也是一个函数。

#### 示例

#### `TodoActionCreators.js`

```js
export function addTodo(text) {
  return {
    type: 'ADD_TODO',
    text
  };
}

export function removeTodo(id) {
  return {
    type: 'REMOVE_TODO',
    id
  };
}
```

#### `SomeComponent.js`

```js
import { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as TodoActionCreators from './TodoActionCreators';
console.log(TodoActionCreators);
// {
//   addTodo: Function,
//   removeTodo: Function
// }

class TodoListContainer extends Component {
  componentDidMount() {
    // 由 react-redux 注入：
    let { dispatch } = this.props;

    // 注意：这样做行不通：
    // TodoActionCreators.addTodo('Use Redux');

    // 你只是调用了创建 action 的方法。
    // 你必须要 dispatch action 而已。

    // 这样做行得通：
    let action = TodoActionCreators.addTodo('Use Redux');
    dispatch(action);
  }

  render() {
    // 由 react-redux 注入：
    let { todos, dispatch } = this.props;

    // 这是应用 bindActionCreators 比较好的场景：
    // 在子组件里，可以完全不知道 Redux 的存在。

    let boundActionCreators = bindActionCreators(TodoActionCreators, dispatch);
    console.log(boundActionCreators);
    // {
    //   addTodo: Function,
    //   removeTodo: Function
    // }

    return (
      <TodoList todos={todos}
                {...boundActionCreators} />
    );

    // 一种可以替换 bindActionCreators 的做法是直接把 dispatch 函数
    // 和 action creators 当作 props 
    // 传递给子组件
    // return <TodoList todos={todos} dispatch={dispatch} />;
  }
}

export default connect(
  state => ({ todos: state.todos })
)(TodoListContainer)
```

#### 小贴士

* 你或许要问：为什么不直接把 action creators 绑定到 store 实例上，就像传统 Flux 那样？问题是这样做的话如果开发同构应用，在服务端渲染时就不行了。多数情况下，你 每个请求都需要一个独立的 store 实例，这样你可以为它们提供不同的数据，但是在定义的时候绑定 action creators，你就可以使用一个唯一的 store 实例来对应所有请求了。

* 如果你使用 ES5，不能使用 `import * as` 语法，你可以把 `require('./TodoActionCreators')` 作为第一个参数传给 `bindActionCreators`。惟一要考虑的是 `actionCreators` 的参数全是函数。模块加载系统并不重要。
