# Reducer

[Action](./Actions.md) 只是描述了**有事情发生了**这一事实，并没有指明应用如何更新 state。而这正是 reducer 要做的事情。

## 设计 State 结构

在 Redux 应用中，所有的 state 都被保存在一个单一对象中。建议在写代码前先想一下这个对象的结构。如何才能以最简的形式把应用的 state 用对象描述出来？

以 todo 应用为例，需要保存两种不同的数据：

* 当前选中的任务过滤条件；
* 完整的任务列表。

通常，这个 state 树还需要存放其它一些数据，以及一些 UI 相关的 state。这样做没问题，但尽量把这些数据与 UI 相关的 state 分开。

```js
{
  visibilityFilter: 'SHOW_ALL',
  todos: [
    {
      text: 'Consider using Redux',
      completed: true,
    },
    {
      text: 'Keep all state in a single tree',
      completed: false
    }
  ]
}
```

>##### 处理 Reducer 关系时的注意事项

>开发复杂的应用时，不可避免会有一些数据相互引用。建议你尽可能地把 state 范式化，不存在嵌套。把所有数据放到一个对象里，每个数据以 ID 为主键，不同实体或列表间通过 ID 相互引用数据。把应用的 state 想像成数据库。这种方法在 [normalizr](https://github.com/gaearon/normalizr) 文档里有详细阐述。例如，实际开发中，在 state 里同时存放 `todosById: { id -> todo }` 和 `todos: array<id>` 是比较好的方式，本文中为了保持示例简单没有这样处理。

## Action 处理

现在我们已经确定了 state 对象的结构，就可以开始开发 reducer。reducer 就是一个纯函数，接收旧的 state 和 action，返回新的 state。

```js
(previousState, action) => newState
```

之所以称作 reducer 是因为它将被传递给 [`Array.prototype.reduce(reducer, ?initialValue)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) 方法。保持 reducer 纯净非常重要。**永远不要**在 reducer 里做这些操作：

* 修改传入参数；
* 执行有副作用的操作，如 API 请求和路由跳转；
* 调用非纯函数，如 `Date.now()` 或 `Math.random()`。

在[高级篇](../advanced/README.md)里会介绍如何执行有副作用的操作。现在只需要谨记 reducer 一定要保持纯净。**只要传入参数相同，返回计算得到的下一个 state 就一定相同。没有特殊情况、没有副作用，没有 API 请求、没有变量修改，单纯执行计算。**

明白了这些之后，就可以开始编写 reducer，并让它来处理之前定义过的 [action](Actions.md)。

我们将以指定 state 的初始状态作为开始。Redux 首次执行时，state 为 `undefined`，此时我们可借机设置并返回应用的初始 state。

```js
import { VisibilityFilters } from './actions'

const initialState = {
  visibilityFilter: VisibilityFilters.SHOW_ALL,
  todos: []
};

function todoApp(state, action) {
  if (typeof state === 'undefined') {
    return initialState
  }

  // 这里暂不处理任何 action，
  // 仅返回传入的 state。
  return state
}
```

这里一个技巧是使用 [ES6 参数默认值语法](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/default_parameters) 来精简代码。

```js
function todoApp(state = initialState, action) {
  // 这里暂不处理任何 action，
  // 仅返回传入的 state。
  return state
}
```

现在可以处理 `SET_VISIBILITY_FILTER`。需要做的只是改变 state 中的 `visibilityFilter`。

```js
function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    default:
      return state
  }
}
```

注意:

1. **不要修改 `state`。** 使用 [`Object.assign()`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) 新建了一个副本。不能这样使用 `Object.assign(state, { visibilityFilter: action.filter })`，因为它会改变第一个参数的值。你**必须**把第一个参数设置为空对象。你也可以开启对ES7提案[对象展开运算符](../recipes/UsingObjectSpreadOperator.md)的支持, 从而使用 `{ ...state, ...newState }` 达到相同的目的。

2. **在 `default` 情况下返回旧的 `state`。**遇到未知的 action 时，一定要返回旧的 `state`。

>##### `Object.assign` 须知

>[`Object.assign()`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) 是 ES6 特性，但多数浏览器并不支持。你要么使用 polyfill，[Babel 插件](https://github.com/babel-plugins/babel-plugin-object-assign)，或者使用其它库如 [`_.assign()`](https://lodash.com/docs#assign) 提供的帮助方法。

>##### `switch` 和样板代码须知

>`switch` 语句并不是严格意义上的样板代码。Flux 中真实的样板代码是概念性的：更新必须要发送、Store 必须要注册到 Dispatcher、Store 必须是对象（开发同构应用时变得非常复杂）。为了解决这些问题，Redux 放弃了 event emitters（事件发送器），转而使用纯 reducer。

>很不幸到现在为止，还有很多人存在一个误区：根据文档中是否使用 `switch` 来决定是否使用它。如果你不喜欢 `switch`，完全可以自定义一个 `createReducer` 函数来接收一个事件处理函数列表，参照["减少样板代码"](../recipes/ReducingBoilerplate.md#reducers)。

## 处理多个 action

还有两个 action 需要处理。让我们先处理 `ADD_TODO`。

```js
function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    case ADD_TODO:
      return Object.assign({}, state, {
        todos: [
          ...state.todos,
          {
            text: action.text,
            completed: false
          }
        ]
      })
    default:
      return state
  }
}
```

如上，不直接修改 `state` 中的字段，而是返回新对象。新的 `todos` 对象就相当于旧的 `todos` 在末尾加上新建的 todo。而这个新的 todo 又是基于 action 中的数据创建的。

最后，`TOGGLE_TODO` 的实现也很好理解：

```js
case TOGGLE_TODO:
  return Object.assign({}, state, {
    todos: state.todos.map((todo, index) => {
      if (index === action.index) {
        return Object.assign({}, todo, {
          completed: !todo.completed
        })
      }
      return todo
    })
  })
```

我们需要修改数组中指定的数据项而又不希望导致**突变**, 因此我们的做法是在创建一个新的数组后, 将那些无需修改的项原封不动移入, 接着对需修改的项用新生成的对象替换。(译者注：Javascript中的对象存储时均是由值和指向值的引用两个部分构成。此处**突变**指直接修改引用所指向的值, 而引用本身保持不变。) 如果经常需要这类的操作，可以选择使用帮助类 [React-addons-update](https://facebook.github.io/react/docs/update.html)，[updeep](https://github.com/substantial/updeep)，或者使用原生支持深度更新的库 [Immutable](http://facebook.github.io/immutable-js/)。最后，时刻谨记永远不要在克隆 `state` 前修改它。

## 拆分 Reducer

目前的代码看起来有些冗长：

```js
function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    case ADD_TODO:
      return Object.assign({}, state, {
        todos: [
          ...state.todos,
          {
            text: action.text,
            completed: false
          }
        ]
      })
    case TOGGLE_TODO:
      return Object.assign({}, state, {
        todos: state.todos.map((todo, index) => {
          if(index === action.index) {
            return Object.assign({}, todo, {
              completed: !todo.completed
            })
          }
          return todo
        })
      })
    default:
      return state
  }
}
```

上面代码能否变得更通俗易懂？这里的 `todos` 和 `visibilityFilter` 的更新看起来是相互独立的。有时 state 中的字段是相互依赖的，需要认真考虑，但在这个案例中我们可以把 `todos` 更新的业务逻辑拆分到一个单独的函数里：

```js
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case TOGGLE_TODO:
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: !todo.completed
          })
        }
        return todo
      })
    default:
      return state
  }
}

function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    case ADD_TODO:
    case TOGGLE_TODO:
      return Object.assign({}, state, {
        todos: todos(state.todos, action)
      })
    default:
      return state
  }
}
```

注意 `todos` 依旧接收 `state`，但它变成了一个数组！现在 `todoApp` 只把需要更新的一部分 state 传给 `todos` 函数，`todos` 函数自己确定如何更新这部分数据。**这就是所谓的 *reducer 合成*，它是开发 Redux 应用最基础的模式。**

下面深入探讨一下如何做 reducer 合成。能否抽出一个 reducer 来专门管理 `visibilityFilter`？当然可以：

```js
function visibilityFilter(state = SHOW_ALL, action) {
  switch (action.type) {
  case SET_VISIBILITY_FILTER:
    return action.filter
  default:
    return state
  }
}
```

现在我们可以开发一个函数来做为主 reducer，它调用多个子 reducer 分别处理 state 中的一部分数据，然后再把这些数据合成一个大的单一对象。主 reducer 并不需要设置初始化时完整的 state。初始时，如果传入 `undefined`, 子 reducer 将负责返回它们的默认值。

```js
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case TOGGLE_TODO:
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: !todo.completed
          })
        }
        return todo
      })
    default:
      return state
  }
}

function visibilityFilter(state = SHOW_ALL, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter
    default:
      return state
  }
}

function todoApp(state = {}, action) {
  return {
    visibilityFilter: visibilityFilter(state.visibilityFilter, action),
    todos: todos(state.todos, action)
  }
}
```

**注意每个 reducer 只负责管理全局 state 中它负责的一部分。每个 reducer 的 `state` 参数都不同，分别对应它管理的那部分 state 数据。**

现在看起来好多了！随着应用的膨胀，我们还可以将拆分后的 reducer 放到不同的文件中, 以保持其独立性并用于专门处理不同的数据域。

最后，Redux 提供了 [`combineReducers()`](../api/combineReducers.md) 工具类来做上面 `todoApp` 做的事情，这样就能消灭一些样板代码了。有了它，可以这样重构 `todoApp`：

```js
import { combineReducers } from 'redux';

const todoApp = combineReducers({
  visibilityFilter,
  todos
})

export default todoApp;
```

注意上面的写法和下面完全等价：

```js
export default function todoApp(state = {}, action) {
  return {
    visibilityFilter: visibilityFilter(state.visibilityFilter, action),
    todos: todos(state.todos, action)
  }
}
```

你也可以给它们设置不同的 key，或者调用不同的函数。下面两种合成 reducer 方法完全等价：

```js
const reducer = combineReducers({
  a: doSomethingWithA,
  b: processB,
  c: c
})
```

```js
function reducer(state = {}, action) {
  return {
    a: doSomethingWithA(state.a, action),
    b: processB(state.b, action),
    c: c(state.c, action)
  }
}
```

[`combineReducers()`](../api/combineReducers.md) 所做的只是生成一个函数，这个函数来调用你的一系列 reducer，每个 reducer **根据它们的 key 来筛选出 state 中的一部分数据并处理**，然后这个生成的函数再将所有 reducer 的结果合并成一个大的对象。[没有任何魔法。](https://github.com/gaearon/redux/issues/428#issuecomment-129223274)

>##### ES6 用户使用注意

>`combineReducers` 接收一个对象，可以把所有顶级的 reducer 放到一个独立的文件中，通过 `export` 暴露出每个 reducer 函数，然后使用 `import * as reducers` 得到一个以它们名字作为 key 的 object：

>```js
>import { combineReducers } from 'redux'
>import * as reducers from './reducers'
>
>const todoApp = combineReducers(reducers)
>```
>
>由于 `import *` 还是比较新的语法，为了避免[困惑](https://github.com/gaearon/redux/issues/428#issuecomment-129223274)，我们不会在本文档中使用它。但在一些社区示例中你可能会遇到它们。

## 源码

#### `reducers.js`

```js
import { combineReducers } from 'redux'
import { ADD_TODO, TOGGLE_TODO, SET_VISIBILITY_FILTER, VisibilityFilters } from './actions'
const { SHOW_ALL } = VisibilityFilters

function visibilityFilter(state = SHOW_ALL, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter
    default:
      return state
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case TOGGLE_TODO:
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: !todo.completed
          })
        }
        return todo
      })
    default:
      return state
  }
}

const todoApp = combineReducers({
  visibilityFilter,
  todos
})

export default todoApp
```

## 下一步

接下来会学习 [创建 Redux store](Store.md)。store 能维持应用的 state，并在当你发起 action 的时候调用 reducer。
