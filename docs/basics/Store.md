# Store

在前面的章节中，我们学会了使用 [action](Actions.md) 来描述“发生了什么”，和使用 [reducers](Reducers.md) 来根据 action 更新 state 的用法。

**Store** 就是把它们联系到一起的对象。Store 有以下职责：

* 维持应用的 state；
* 提供 [`getState()`](../api/Store.md#getState) 方法获取 state；
* 提供 [`dispatch(action)`](../api/Store.md#dispatch) 方法更新 state；
* 通过 [`subscribe(listener)`](../api/Store.md#subscribe) 注册监听器;
* 通过 [`subscribe(listener)`](../api/Store.md#subscribe) 返回的函数注销监听器。

再次强调一下 **Redux 应用只有一个单一的 store**。当需要拆分数据处理逻辑时，你应该使用 [reducer 组合](Reducers.md#splitting-reducers) 而不是创建多个 store。

根据已有的 reducer 来创建 store 是非常容易的。在[前一个章节](Reducers.md)中，我们使用 [`combineReducers()`](../api/combineReducers.md) 将多个 reducer 合并成为一个。现在我们将其导入，并传递 [`createStore()`](../api/createStore.md)。

```js
import { createStore } from 'redux'
import todoApp from './reducers'
let store = createStore(todoApp)
```

[`createStore()`](../api/createStore.md) 的第二个参数是可选的, 用于设置 state 初始状态。这对开发同构应用时非常有用，服务器端 redux 应用的 state 结构可以与客户端保持一致, 那么客户端可以将从网络接收到的服务端 state 直接用于本地数据初始化。

```js
let store = createStore(todoApp, window.STATE_FROM_SERVER)
```

## 发起 Actions

现在我们已经创建好了 store ，让我们来验证一下！虽然还没有界面，我们已经可以测试数据处理逻辑了。

```js
import { addTodo, toggleTodo, setVisibilityFilter, VisibilityFilters } from './actions'

// 打印初始状态
console.log(store.getState())

// 每次 state 更新时，打印日志
// 注意 subscribe() 返回一个函数用来注销监听器
let unsubscribe = store.subscribe(() =>
  console.log(store.getState())
)

// 发起一系列 action
store.dispatch(addTodo('Learn about actions'))
store.dispatch(addTodo('Learn about reducers'))
store.dispatch(addTodo('Learn about store'))
store.dispatch(toggleTodo(0))
store.dispatch(toggleTodo(1))
store.dispatch(setVisibilityFilter(VisibilityFilters.SHOW_COMPLETED))

// 停止监听 state 更新
unsubscribe();
```

可以看到 store 里的 state 是如何变化的：

<img src='http://i.imgur.com/zMMtoMz.png' width='70%'>

可以看到，在还没有开发界面的时候，我们就可以定义程序的行为。而且这时候已经可以写 reducer 和 action 创建函数的测试。不需要模拟任何东西，因为它们都是纯函数。只需调用一下，对返回值做断言，写测试就是这么简单。

## 源码

#### `index.js`

```js
import { createStore } from 'redux'
import todoApp from './reducers'

let store = createStore(todoApp)
```

## 下一步

在创建 todo 应用界面之前，我们先穿插学习一下[数据在 Redux 应用中如何流动的](DataFlow.md)。
