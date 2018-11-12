# `combineReducers(reducers)`

随着应用变得越来越复杂，可以考虑将 [reducer 函数](../Glossary.md#reducer) 拆分成多个单独的函数，拆分后的每个函数负责独立管理 [state](../Glossary.md#state) 的一部分。

`combineReducers` 辅助函数的作用是，把一个由多个不同 reducer 函数作为 value 的 object，合并成一个最终的 reducer 函数，然后就可以对这个 reducer 调用 [`createStore`](createStore.md) 方法。

合并后的 reducer 可以调用各个子 reducer，并把它们返回的结果合并成一个 state 对象。
**由 `combineReducers()` 返回的 state 对象，会将传入的每个 reducer 返回的 state 按其传递给 `combineReducers()` 时对应的 key 进行命名**。

示例：

```
rootReducer = combineReducers({potato: potatoReducer, tomato: tomatoReducer})
// rootReducer 将返回如下的 state 对象
{
  potato: {
    // ... potatoes, 和一些其他由 potatoReducer 管理的 state 对象 ...
  },
  tomato: {
    // ... tomatoes, 和一些其他由 tomatoReducer 管理的 state 对象，比如说 sauce 属性 ...
  }
}
```

通过为传入对象的 reducer 命名不同的 key 来控制返回 state key 的命名。例如，你可以调用 `combineReducers({ todos: myTodosReducer, counter: myCounterReducer })` 将 state 结构变为 `{ todos, counter }`。

通常的做法是命名 reducer，然后 state 再去分割那些信息，这样你可以使用 ES6 的简写方法：`combineReducers({ counter, todos })`。这与 `combineReducers({ counter: counter, todos: todos })` 是等价的。

> ##### Flux 用户使用须知

> 本函数可以帮助你组织多个 reducer，使它们分别管理自身相关联的 state。类似于 Flux 中的多个 store 分别管理不同的 state。在 Redux 中，只有一个 store，但是 `combineReducers` 让你拥有多个 reducer，同时保持各自负责逻辑块的独立性。

#### 参数

1. `reducers` (_Object_): 一个对象，它的值（value）对应不同的 reducer 函数，这些 reducer 函数后面会被合并成一个。下面会介绍传入 reducer 函数需要满足的规则。

> 之前的文档曾建议使用 ES6 的 `import * as reducers` 语法来获得 reducer 对象。这一点造成了很多疑问，因此现在建议在 `reducers/index.js` 里使用 `combineReducers()` 来对外输出一个 reducer。下面有示例说明。

#### 返回值

(_Function_)：一个调用 `reducers` 对象里所有 reducer 的 reducer，并且构造一个与 `reducers` 对象结构相同的 state 对象。

#### 注意

本函数设计的时候有点偏主观，就是为了避免新手犯一些常见错误。也因些我们故意设定一些规则，但如果你自己手动编写根 redcuer 时并不需要遵守这些规则。

每个传入 `combineReducers` 的 reducer 都需满足以下规则：

- 所有未匹配到的 action，必须把它接收到的第一个参数也就是那个 `state` 原封不动返回。

- 永远不能返回 `undefined`。当过早 `return` 时非常容易犯这个错误，为了避免错误扩散，遇到这种情况时 `combineReducers` 会抛异常。

- 如果传入的 `state` 就是 `undefined`，一定要返回对应 reducer 的初始 state。根据上一条规则，初始 state 禁止使用 `undefined`。使用 ES6 的默认参数值语法来设置初始 state 很容易，但你也可以手动检查第一个参数是否为 `undefined`。

虽然 `combineReducers` 自动帮你检查 reducer 是否符合以上规则，但你也应该牢记，并尽量遵守。即使你通过 `Redux.createStore(combineReducers(...), initialState)` 指定初始 state，`combineReducers` 也会尝试通过传递 `undefined` 的 `state` 来检测你的 reducer 是否符合规则。因此，即使你在代码中不打算实际接收值为 `undefined` 的 `state`，也必须保证你的 reducer 在接收到 `undefined` 时能够正常工作。

#### 示例

#### `reducers/todos.js`

```js
export default function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([action.text])
    default:
      return state
  }
}
```

#### `reducers/counter.js`

```js
export default function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}
```

#### `reducers/index.js`

```js
import { combineReducers } from 'redux'
import todos from './todos'
import counter from './counter'

export default combineReducers({
  todos,
  counter
})
```

#### `App.js`

```js
import { createStore } from 'redux'
import reducer from './reducers/index'

let store = createStore(reducer)
console.log(store.getState())
// {
//   counter: 0,
//   todos: []
// }

store.dispatch({
  type: 'ADD_TODO',
  text: 'Use Redux'
})
console.log(store.getState())
// {
//   counter: 0,
//   todos: [ 'Use Redux' ]
// }
```

#### 小贴士

- 本方法只是起辅助作用！你可以自行实现[不同功能](https://github.com/acdlite/reduce-reducers)的 `combineReducers`，甚至像实现其它函数一样，明确地写一个根 reducer 函数，用它把子 reducer 手动组装成 state 对象。

- 在 reducer 层级的任何一级都可以调用 `combineReducers`。并不是一定要在最外层。实际上，你可以把一些复杂的子 reducer 拆分成单独的孙子级 reducer，甚至更多层。
