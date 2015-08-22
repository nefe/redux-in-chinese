# `bindActionCreators(actionCreators, dispatch)`

Turns an object whose values are [action creators](../Glossary.md#action-creator), into an object with the same keys, but with every action creator wrapped into a [`dispatch`](Store.md#dispatch) call so they may be invoked directly.

Normally you should just call [`dispatch`](Store.md#dispatch) directly on your [`Store`](Store.md) instance. If you use Redux with React, [react-redux](https://github.com/gaearon/react-redux) will provide you with the [`dispatch`](Store.md#dispatch) function so you can call it directly, too.

The only use case for `bindActionCreators` is when you want to pass some action creators down to a component that isn’t aware of Redux, and you don’t want to pass [`dispatch`](Store.md#dispatch) or the Redux store to it.

为方便起见，你可以在第一个参数的位置传入一个函数，它又会返回一个函数。
For convenience, you can also pass a single function as the first argument, and get a function in return.

#### 参数

1. `actionCreators` (*Function* or *Object*): An [action creator](../Glossary.md#action-creator), or an object whose values action creators.

2. `dispatch` (*Function*): A [`dispatch`](Store.md#dispatch) function available on the [`Store`](Store.md) instance.

#### 返回

(*Function* or *Object*): An object mimicking the original object, but with each function immediately dispatching the action returned by the corresponding action creator. If you passed a function as `actionCreators`, the return value will also be a single function.

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
    // Injected by react-redux:
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

    // An alternative to bindActionCreators is to pass
    // just the dispatch function down, but then your child component
    // needs to import action creators and know about them.

    // return <TodoList todos={todos} dispatch={dispatch} />;
  }
}

export default connect(
  TodoListContainer,
  state => ({ todos: state.todos })
)
```

#### 小贴士

* You might ask: why don’t we bind the action creators to the store instance right away, like in classical Flux? The problem is that this won’t work well with universal apps that need to render on the server. Most likely you want to have a separate store instance per request so you can prepare them with different data, but binding action creators during their definition means you’re stuck with a single store instance for all requests.

* If you use ES5, instead of `import * as` syntax you can just pass `require('./TodoActionCreators')` to `bindActionCreators` as the first argument. The only thing it cares about is that the values of the `actionCreators` arguments are functions. The module system doesn’t matter.
