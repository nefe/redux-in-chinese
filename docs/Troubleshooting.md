# 排错

这里会列出常见的问题和对应的解决方案。
虽然使用 React 做示例，但是即使你使用了其它库，这些问题和解决方案仍然对你有所帮助。

### dispatch action 后什么也没有发生

有时，你 dispatch action 后，view 却没有更新。这是为什么呢？可能有下面几种原因。

#### 永远不要直接修改 reducer 的参数

如果你想修改 Redux 给你传入的 `state` 或 `action`，请住手！

Redux 假定你永远不会修改 reducer 里传入的对象。**任何时候，你都应该返回一个新的 state 对象。**即使你没有使用 [Immutable](https://facebook.github.io/immutable-js/) 这样的库，也要保证做到不修改对象。

不变性（Immutability）可以让 [react-redux](https://github.com/gaearon/react-redux) 高效的监听 state 的细粗度更新。它也让 [redux-devtools](http://github.com/gaearon/redux-devtools) 能提供“时间旅行”这类强大特性。

例如，下面的 reducer 就是错误的，因为它改变了 state：

```js
function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      // 错误！这会改变 state.actions。
      state.push({
        text: action.text,
        completed: false
      })
      return state
    case 'COMPLETE_TODO':
      // 错误！这会改变 state[action.index]。
      state[action.index].completed = true
      return state
    default:
      return state
  }
}
```

应该重写成这样：

```js
function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      // 返回新数组
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case 'COMPLETE_TODO':
      // 返回新数组
      return state.map((todo, index) => {
        if (index === action.index) {
          // 修改之前复制数组
          return Object.assign({}, todo, {
            completed: true
          })
        }
        return todo
      })
    default:
      return state
  }
}
```

虽然需要写更多代码，但是让 Redux 变得可具有可预测性和高效。如果你想减少代码量，你可以用一些辅助方法类似
 [`React.addons.update`](https://facebook.github.io/react/docs/update.html) 来让这样的不可变转换操作变得更简单：

```js
// 修改前
return state.map((todo, index) => {
  if (index === action.index) {
    return Object.assign({}, todo, {
      completed: true
    })
  }
  return todo
})

// 修改后
return update(state, {
  [action.index]: {
    completed: {
      $set: true
    }
  }
})
```

最后，如果需要更新 object，你需要使用 Underscore 提供的 `_.extend` 方法，或者更好的，使用 [`Object.assign`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) 的 polyfill

要注意 `Object.assign` 的使用方法。例如，在 reducer 里不要这样使用 `Object.assign(state, newData)`，应该用 `Object.assign({}, state, newData)`。这样它才不会覆盖以前的 `state`。

你也可以通过 [对象操作符](recipes/UsingObjectSpreadOperator.md)　所述的使用更多简洁的语法：

```js
// 修改前：
return state.map((todo, index) => {
  if (index === action.index) {
    return Object.assign({}, todo, {
      completed: true
    })
  }
  return todo
})

// 修改后：
return state.map((todo, index) => {
  if (index === action.index) {
    return { ...todo, completed: true }
  }
  return todo
})
```

注意还在实验阶段的特性会经常改变。

同时要注意那些需要复制的深层嵌套的　state 对象。而　`_.extend` 和 `Object.assign`　只能提供浅层的　state 复制。在　[更新嵌套的对象](recipes/reducers/ImmutableUpdatePatterns.md#updating-nested-objects) 章节中会教会你如何处理嵌套的　state　对象。

#### 不要忘记调用 [`dispatch(action)`](api/Store.md#dispatch)

如果你定义了一个 action 创建函数，调用它并**不**会自动 dispatch 这个 action。比如，下面的代码什么也不会做：

#### `TodoActions.js`

```js
export function addTodo(text) {
  return { type: 'ADD_TODO', text }
}
```

#### `AddTodo.js`

```js
import React, { Component } from 'react'
import { addTodo } from './TodoActions'

class AddTodo extends Component {
  handleClick() {
    // 不起作用!
    addTodo('Fix the issue')
  }

  render() {
    return (
      <button onClick={() => this.handleClick()}>
        Add
      </button>
    )
  }
}
```

它不起作用是因为你的 action 创建函数只是一个**返回** action 的函数而已。你需要手动 dispatch 它。我们不能在定义时把 action 创建函数绑定到指定的 Store 上，因为应用在服务端渲染时需要为每个请求都对应一个独立的 Redux store。

解法是调用 [store](api/Store.md) 实例上的 [`dispatch()`](api/Store.md#dispatch) 方法。

```js
handleClick() {
  // 生效！（但你需要先以某种方式拿到 store）
  store.dispatch(addTodo('Fix the issue'))
}
```

如果组件的层级非常深，把 store 一层层传下去很麻烦。因此 [react-redux](https://github.com/gaearon/react-redux) 提供了 `connect` 这个 [高阶组件](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750)，它除了可以帮你监听 Redux store，还会把 `dispatch` 注入到组件的 props 中。

修复后的代码是这样的：
#### `AddTodo.js`
```js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addTodo } from './TodoActions'

class AddTodo extends Component {
  handleClick() {
    // 生效！
    this.props.dispatch(addTodo('Fix the issue'))
  }

  render() {
    return (
      <button onClick={() => this.handleClick()}>
        Add
      </button>
    )
  }
}

// 除了 state，`connect` 还把 `dispatch` 放到 props 里。
export default connect()(AddTodo)
```

如果你想的话也可以把 `dispatch` 手动传给其它组件。

####　确保　mapStateToProps　是正确的

你可能正确地　diaptching 一个 action　并且将它提到了　reducer　中，但是对应的　state　却没有通过　props　正确地传输。

## 其它问题

在 Discord [Reactiflux](http://reactiflux.com/) 里的 **redux** 频道里提问，或者[提交一个 issue](https://github.com/reactjs/redux/issues)。
如果问题终于解决了，请把解法[写到文档里](https://github.com/reactjs/redux/edit/master/docs/Troubleshooting.md)，以便别人遇到同样问题时参考。
