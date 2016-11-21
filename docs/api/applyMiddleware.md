# `applyMiddleware(...middlewares)`

使用包含自定义功能的 middleware 来扩展 Redux 是一种推荐的方式。Middleware 可以让你包装 store 的 [`dispatch`](Store.md#dispatch) 方法来达到你想要的目的。同时， middleware 还拥有“可组合”这一关键特性。多个 middleware 可以被组合到一起使用，形成 middleware 链。其中，每个 middleware 都不需要关心链中它前后的 middleware 的任何信息。

Middleware 最常见的使用场景是无需引用大量代码或依赖类似 [Rx](https://github.com/Reactive-Extensions/RxJS) 的第三方库实现异步 actions。这种方式可以让你像 dispatch 一般的 actions 那样 dispatch [异步 actions](../Glossary.md#async-action)。

例如，[redux-thunk](https://github.com/gaearon/redux-thunk) 支持 dispatch function，以此让 action creator 控制反转。被 dispatch 的 function 会接收 [`dispatch`](Store.md#dispatch) 作为参数，并且可以异步调用它。这类的 function 就称为 *thunk*。另一个 middleware 的示例是 [redux-promise](https://github.com/acdlite/redux-promise)。它支持 dispatch 一个异步的 [Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) action，并且在 Promise resolve 后可以 dispatch 一个普通的 action。

Middleware 并不需要和 [`createStore`](createStore.md) 绑在一起使用，也不是 Redux 架构的基础组成部分，但它带来的益处让我们认为有必要在 Redux 核心中包含对它的支持。因此，虽然不同的 middleware 可能在易用性和用法上有所不同，它仍被作为扩展 [`dispatch`](Store.md#dispatch) 的唯一标准的方式。

#### 参数

* `...middlewares` (*arguments*): 遵循 Redux *middleware API* 的函数。每个 middleware 接受 [`Store`](Store.md) 的 [`dispatch`](Store.md#dispatch) 和 [`getState`](Store.md#getState) 函数作为命名参数，并返回一个函数。该函数会被传入
被称为 `next` 的下一个 middleware 的 dispatch 方法，并返回一个接收 action 的新函数，这个函数可以直接调用 `next(action)`，或者在其他需要的时刻调用，甚至根本不去调用它。调用链中最后一个 middleware 会接受真实的 store 的 [`dispatch`](Store.md#dispatch) 方法作为 `next` 参数，并借此结束调用链。所以，middleware 的函数签名是 `({ getState, dispatch }) => next => action`。

#### 返回值

(*Function*) 一个应用了 middleware 后的 store enhancer。这个 store enhancer 的签名是 `createStore => createStore`，但是最简单的使用方法就是直接作为最后一个 `enhancer` 参数传递给 [`createStore()`](createStore.md) 函数。

#### 示例: 自定义 Logger Middleware

```js
import { createStore, applyMiddleware } from 'redux'
import todos from './reducers'

function logger({ getState }) {
  return (next) => (action) => {
    console.log('will dispatch', action)

    // 调用 middleware 链中下一个 middleware 的 dispatch。
    let returnValue = next(action)

    console.log('state after dispatch', getState())

    // 一般会是 action 本身，除非
    // 后面的 middleware 修改了它。
    return returnValue
  }
}

let store = createStore(
  todos,
  [ 'Use Redux' ],
  applyMiddleware(logger)
)

store.dispatch({
  type: 'ADD_TODO',
  text: 'Understand the middleware'
})
// (将打印如下信息:)
// will dispatch: { type: 'ADD_TODO', text: 'Understand the middleware' }
// state after dispatch: [ 'Use Redux', 'Understand the middleware' ]
```

#### 示例: 使用 Thunk Middleware 来做异步 Action

```js
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import * as reducers from './reducers'

let reducer = combineReducers(reducers)
// applyMiddleware 为 createStore 注入了 middleware:
let store = createStore(reducer, applyMiddleware(thunk))

function fetchSecretSauce() {
  return fetch('https://www.google.com/search?q=secret+sauce')
}

// 这些是你已熟悉的普通 action creator。
// 它们返回的 action 不需要任何 middleware 就能被 dispatch。
// 但是，他们只表达「事实」，并不表达「异步数据流」

function makeASandwich(forPerson, secretSauce) {
  return {
    type: 'MAKE_SANDWICH',
    forPerson,
    secretSauce
  }
}

function apologize(fromPerson, toPerson, error) {
  return {
    type: 'APOLOGIZE',
    fromPerson,
    toPerson,
    error
  }
}

function withdrawMoney(amount) {
  return {
    type: 'WITHDRAW',
    amount
  }
}

// 即使不使用 middleware，你也可以 dispatch action：
store.dispatch(withdrawMoney(100))

// 但是怎样处理异步 action 呢，
// 比如 API 调用，或者是路由跳转？

// 来看一下 thunk。
// Thunk 就是一个返回函数的函数。
// 下面就是一个 thunk。

function makeASandwichWithSecretSauce(forPerson) {

  // 控制反转！
  // 返回一个接收 `dispatch` 的函数。
  // Thunk middleware 知道如何把异步的 thunk action 转为普通 action。

  return function (dispatch) {
    return fetchSecretSauce().then(
      sauce => dispatch(makeASandwich(forPerson, sauce)),
      error => dispatch(apologize('The Sandwich Shop', forPerson, error))
    )
  }
}

// Thunk middleware 可以让我们像 dispatch 普通 action
// 一样 dispatch 异步的 thunk action。

store.dispatch(
  makeASandwichWithSecretSauce('Me')
)

// 它甚至负责回传 thunk 被 dispatch 后返回的值，
// 所以可以继续串连 Promise，调用它的 .then() 方法。

store.dispatch(
  makeASandwichWithSecretSauce('My wife')
).then(() => {
  console.log('Done!')
})

// 实际上，可以写一个 dispatch 其它 action creator 里
// 普通 action 和异步 action 的 action creator，
// 而且可以使用 Promise 来控制数据流。

function makeSandwichesForEverybody() {
  return function (dispatch, getState) {
    if (!getState().sandwiches.isShopOpen) {

      // 返回 Promise 并不是必须的，但这是一个很好的约定，
      // 为了让调用者能够在异步的 dispatch 结果上直接调用 .then() 方法。

      return Promise.resolve()
    }

    // 可以 dispatch 普通 action 对象和其它 thunk，
    // 这样我们就可以在一个数据流中组合多个异步 action。

    return dispatch(
      makeASandwichWithSecretSauce('My Grandma')
    ).then(() =>
      Promise.all([
        dispatch(makeASandwichWithSecretSauce('Me')),
        dispatch(makeASandwichWithSecretSauce('My wife'))
      ])
    ).then(() =>
      dispatch(makeASandwichWithSecretSauce('Our kids'))
    ).then(() =>
      dispatch(getState().myMoney > 42 ?
        withdrawMoney(42) :
        apologize('Me', 'The Sandwich Shop')
      )
    )
  }
}

// 这在服务端渲染时很有用，因为我可以等到数据
// 准备好后，同步的渲染应用。

import { renderToString } from 'react-dom/server'

store.dispatch(
  makeSandwichesForEverybody()
).then(() =>
  response.send(renderToString(<MyApp store={store} />))
)

// 也可以在任何导致组件的 props 变化的时刻
// dispatch 一个异步 thunk action。

import { connect } from 'react-redux'
import { Component } from 'react'

class SandwichShop extends Component {
  componentDidMount() {
    this.props.dispatch(
      makeASandwichWithSecretSauce(this.props.forPerson)
    )
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.forPerson !== this.props.forPerson) {
      this.props.dispatch(
        makeASandwichWithSecretSauce(nextProps.forPerson)
      )
    }
  }

  render() {
    return <p>{this.props.sandwiches.join('mustard')}</p>
  }
}

export default connect(
  state => ({
    sandwiches: state.sandwiches
  })
)(SandwichShop)
```

#### 小贴士

* Middleware 只是包装了 store 的 [`dispatch`](Store.md#dispatch) 方法。技术上讲，任何 middleware 能做的事情，都可能通过手动包装 `dispatch` 调用来实现，但是放在同一个地方统一管理会使整个项目的扩展变的容易得多。

* 如果除了 `applyMiddleware`，你还用了其它 store enhancer，一定要把 `applyMiddleware` 放到组合链的前面，因为 middleware 可能会包含异步操作。比如，它应该在 [redux-devtools](https://github.com/gaearon/redux-devtools) 前面，否则 DevTools 就看不到 Promise middleware 里 dispatch 的 action 了。

* 如果你想有条件地使用 middleware，记住只 import 需要的部分：

  ```js
  let middleware = [ a, b ]
  if (process.env.NODE_ENV !== 'production') {
    let c = require('some-debug-middleware')
    let d = require('another-debug-middleware')
    middleware = [ ...middleware, c, d ]
  }

  const store = createStore(
    reducer,
    preloadedState,
    applyMiddleware(...middleware)
  )
  ```

  这样做有利于打包时去掉不需要的模块，减小打包文件大小。

* 有想过 `applyMiddleware` 本质是什么吗？它肯定是比 middleware 还强大的扩展机制。实际上，`applyMiddleware` 只是被称为 Redux 最强大的扩展机制的 [store enhancer](../Glossary.md#store-enhancer) 中的一个范例而已。你不太可能需要实现自己的 store enhancer。另一个 store enhancer 示例是 [redux-devtools](https://github.com/gaearon/redux-devtools)。Middleware 并没有 store enhancer 强大，但开发起来却是更容易的。

* Middleware 听起来比实际难一些。真正理解 middleware 的唯一办法是了解现有的 middleware 是如何工作的，并尝试自己实现。需要的功能可能错综复杂，但是你会发现大部分 middleware 实际上很小，只有 10 行左右，是通过对它们的组合使用来达到最终的目的。

* 想要使用多个 store enhancer，可以使用 [`compose()`](./compose.md) 方法。