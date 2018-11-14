# `bindActionCreators(actionCreators, dispatch)`

把一个 value 为不同 [action creator](../Glossary.md#action-creator) 的对象，转成拥有同名 key 的对象。同时使用 [`dispatch`](Store.md#dispatch) 对每个 action creator 进行包装，以便可以直接调用它们。

一般情况下你可以直接在 [`Store`](Store.md) 实例上调用 [`dispatch`](Store.md#dispatch)。如果你在 React 中使用 Redux，[react-redux](https://github.com/gaearon/react-redux) 会提供 [`dispatch`](Store.md#dispatch) 函数让你直接调用它 。

惟一会使用到 `bindActionCreators` 的场景是当你需要把 action creator 往下传到一个组件上，却不想让这个组件觉察到 Redux 的存在，而且不希望把 [`dispatch`](Store.md#dispatch) 或 Redux store 传给它。

为方便起见，你也可以传入一个函数作为第一个参数，它会返回一个函数。

#### 参数

1. `actionCreators` (_Function_ or _Object_): 一个 [action creator](../Glossary.md#action-creator)，或者一个 value 是 action creator 的对象。

2. `dispatch` (_Function_): 一个由 [`Store`](Store.md) 实例提供的 [`dispatch`](Store.md#dispatch) 函数。

#### 返回值

(_Function_ or _Object_): 一个与原对象类似的对象，只不过这个对象的 value 都是会直接 dispatch 原 action creator 返回的结果的函数。如果传入一个单独的函数作为 `actionCreators`，那么返回的结果也是一个单独的函数。

#### 示例

#### `TodoActionCreators.js`

```js
export function addTodo(text) {
  return {
    type: 'ADD_TODO',
    text
  }
}

export function removeTodo(id) {
  return {
    type: 'REMOVE_TODO',
    id
  }
}
```

#### `SomeComponent.js`

```js
import { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as TodoActionCreators from './TodoActionCreators'
console.log(TodoActionCreators)
// {
//   addTodo: Function,
//   removeTodo: Function
// }

class TodoListContainer extends Component {
  constructor(props) {
    super(props)

    const { dispatch } = props

    // 这是一个很好的 bindActionCreators 的使用示例：
    // 你想让你的子组件完全不感知 Redux 的存在。
    // 我们在这里对 action creator 绑定 dispatch 方法，
    // 以便稍后将其传给子组件。

    this.boundActionCreators = bindActionCreators(TodoActionCreators, dispatch)
    console.log(this.boundActionCreators)
    // {
    //   addTodo: Function,
    //   removeTodo: Function
    // }
  }

  componentDidMount() {
    // 由 react-redux 注入的 dispatch：
    let { dispatch } = this.props

    // 注意：这样是行不通的：
    // TodoActionCreators.addTodo('Use Redux')

    // 你只是调用了创建 action 的方法。
    // 你必须要同时 dispatch action。

    // 这样做是可行的：
    let action = TodoActionCreators.addTodo('Use Redux')
    dispatch(action)
  }

  render() {
    // 由 react-redux 注入的 todos：
    let { todos } = this.props

    return <TodoList todos={todos} {...this.boundActionCreators} />

    // 另一替代 bindActionCreators 的做法是
    // 直接把 dispatch 函数当作 prop 传递给子组件，但这时你的子组件需要
    // 引入 action creator 并且感知它们

    // return <TodoList todos={todos} dispatch={dispatch} />;
  }
}

export default connect(state => ({ todos: state.todos }))(TodoListContainer)
```

#### 小贴士

- 你或许要问：为什么不直接把 action creator 绑定到 store 实例上，就像传统的 Flux 那样？问题在于，这对于需要在服务端进行渲染的同构应用会有问题。多数情况下，你的每个请求都需要一个独立的 store 实例，这样你可以为它们提供不同的数据，但是在定义的时候绑定 action creator，你就只能使用一个唯一的 store 实例来对应所有请求了。

- 如果你使用 ES5，无法使用 `import * as` 语法，你可以把 `require('./TodoActionCreators')` 作为第一个参数传给 `bindActionCreators`。惟一要注意的是作为 `actionCreators` 参数的对象它的 value 需要是函数。模块加载系统并不重要。
