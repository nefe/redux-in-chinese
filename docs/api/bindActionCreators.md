---
id: bindactioncreators
title: bindActionCreators
hide_title: true
description: 'API > bindActionCreators: wrapping action creators for dispatching'
---

&nbsp;

# `bindActionCreators(actionCreators, dispatch)`

把一个 value 为不同 [action creator](../understanding/thinking-in-redux/Glossary.md#action-creator) 的对象，转成拥有同名 key 的对象。同时使用 [`dispatch`](Store.md#dispatchaction) 对每个 action creator 进行包装，以便可以直接调用它们。

一般情况下你可以直接在 [`Store`](Store.md) 实例上调用 [`dispatch`](Store.md#dispatchaction)。如果你在 React 中使用 Redux，[react-redux](https://github.com/gaearon/react-redux) 会提供 [`dispatch`](Store.md#dispatchaction) 函数让你直接调用它 。

惟一会使用到 `bindActionCreators` 的场景是当你需要把 action creator 往下传到一个组件上，却不想让这个组件觉察到 Redux 的存在，而且不希望把 [`dispatch`](Store.md#dispatchaction) 或 Redux store 传给它。

为方便起见，你也可以传入 action creator 作为第一个参数，并且得到一个 dispatch 函数作为返回值。

#### 参数

1. `actionCreators` (_Function_ or _Object_): 一个 [action creator](../understanding/thinking-in-redux/Glossary.md#action-creator)，或者一个 value 是 action creator 的对象。

2. `dispatch` (_Function_): 一个由 [`Store`](Store.md) 实例提供的 [`dispatch`](Store.md#dispatchaction) 函数。

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

function TodoListContainer(props) {
  // react-redux 注入:
  const { dispatch, todos } = props

  // 这是一个很好的 bindActionCreators 用例:
  // 你希望子组件完全不知道 Redux.
  // 我们现在创建这些函数的绑定版本，以便我们可以
  // 之后将它们传给子组件.

  const boundActionCreators = useMemo(
    () => bindActionCreators(TodoActionCreators, dispatch),
    [dispatch]
  )
  console.log(boundActionCreators)
  // {
  //   addTodo: Function,
  //   removeTodo: Function
  // }

  useEffect(() => {
    // 注意： 这不起作用:
    // TodoActionCreators.addTodo('Use Redux')

    // 你只是在调用一个创建 action 的函数。
    // 你也必须同时 dispatch 一个 action！

    // 这将起到作用:
    let action = TodoActionCreators.addTodo('Use Redux')
    dispatch(action)
  }, [])

  return <TodoList todos={todos} {...this.boundActionCreators} />

  //  bindActionCreators 的替代方法
  // 只有向下传递 dispatch 函数, 但是你的子组件
  // 需要 import action creators 并了解它们.

  // return <TodoList todos={todos} dispatch={dispatch} />
}

export default connect(state => ({ todos: state.todos }))(TodoListContainer)
```

#### 小贴士

- 你或许要问：为什么不直接把 action creator 绑定到 store 实例上，就像传统的 Flux 那样？问题在于，这对于需要在服务端进行渲染的同构应用会有问题。多数情况下，你的每个请求都需要一个独立的 store 实例，这样你可以为它们提供不同的数据，但是如果在定义的时候绑定 action creator，你就只能使用一个唯一的 store 实例来对应所有请求了。

- 如果你使用 ES5，无法使用 `import * as` 语法，你可以把 `require('./TodoActionCreators')` 作为第一个参数传给 `bindActionCreators`。惟一要注意的是作为 `actionCreators` 参数的对象，它的 value 需要是函数。模块系统并不重要。
