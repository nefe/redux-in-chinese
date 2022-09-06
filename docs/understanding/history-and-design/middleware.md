---
id: middleware
title: Middleware 中间件
description: '历史与设计  > Middleware 中间件：Middleware 是如何能让你给 Redux store 添加一些额外能力的'
hide_title: false
---

# Middleware 中间件

在 ["Redux 深入浅出" 教程中](../../tutorials/fundamentals/part-4-store.md#middleware) 你已经学习过在 action 里的 middleware。如果你使用过服务端框架像 [Express](https://expressjs.com/) 或 [Koa](https://koajs.com/)，你或许已经熟悉 _middleware_ 的概念。在这些框架中，middlewares 可以让你在接收请求和生成响应之间放置的一些代码。例如，Express 或 Koa middleware 可能会添加 CORS 标头、记录日志、压缩等。Middleware 的最大特点是它可以组合成一个链。你可以在一个项目中使用多个不同的独立三方 middlewares。

Redux middleware 解决的问题与 Express 或 Koa middleware 不同，但在概念上是相似的。**它在 dispatch action 的时候和 action 到达 reducer 那一刻之间提供了三方的逻辑拓展点**。可以使用 Redux middleware 进行日志记录、故障监控上报、与异步 API 通信、路由等。

本文分成几部分来让你深入了解它的概念，以及[几个实际例子](#seven-examples)在最后展示 middleware 的威力。这些例子可能需要来回看，这样你会在无聊和灵感间切换。

## 理解 Middleware

虽然 middleware 可用于多种用途，包括异步 API 调用，但了解它的来源的原因非常重要。我们将通过“日志记录”和“异常监控”作为示例，来一步步引导你知道 middleware 产生背后的过程。

### 问题：日志

Redux 的好处之一是它使状态的变更变得可预测且透明。每次 dispatch action 时，状态都会被重新计算并保存。状态不能自行改变，它只能是被一个特定 action 改变的结果。

如果我们能记录应用程序中每个 action 的调用，连同调用 action 后计算的状态，不是很好吗？当出现问题时，我们可以回溯日志，并找出哪个 action 导致了问题。

<img src='https://i.imgur.com/BjGBlES.png' width='70%' />

我们如何用 Redux 解决这个问题？

### 尝试 #1：手动打日志

最原始的解决方案就是每次调用 [`store.dispatch(action)`](../../api/Store.md#dispatchaction) 时手动记录 action 和下一个状态。这并不是真正的解决方案，而只是理解问题的第一步。

> ##### 注意
>
> 使用 [react-redux](https://github.com/reduxjs/react-redux) 或类似的绑定库，你可能无法直接访问组件中的 store 实例。但在接下来的几段中，假设你显式地传递了 store 对象。

比如说，这样来创建 todo：

```js
store.dispatch(addTodo('Use Redux'))
```

要记录 action 和状态，你可以将代码改成这样：

```js
const action = addTodo('Use Redux')

console.log('dispatching', action)
store.dispatch(action)
console.log('next state', store.getState())
```

这样生成了你要的效果，但你应该不想每次都这样做。

### 尝试 #2: 封装 dispatch

你可以写个函数来记录日志：

```js
function dispatchAndLog(store, action) {
  console.log('dispatching', action)
  store.dispatch(action)
  console.log('next state', store.getState())
}
```

然后你可以在任何地方使用这个函数而不是调用`store.dispatch()`：

```js
dispatchAndLog(store, addTodo('Use Redux'))
```

我们可以到此结束，但是每次都导入一个特殊函数不是很方便。

### 尝试 #3: 给 dispatch 做猴子补丁（Monkeypatch）

如果我们直接重写 store 实例上的 `dispatch` 函数怎么样？store 本身是带有 [一些方法](../../api/Store.md) 的普通对象，因为是 JavaScript，所以我们可以直接对 `dispatch` 函数进行猴子补丁：

```js
const next = store.dispatch
store.dispatch = function dispatchAndLog(action) {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}
```

这已经非常接近预期效果了！无论我们在何处 dispatch action，一定会被 log 记录下来。猴子补丁从来都不是正确做法，但是现在可以允许其存在。

### 问题: 异常监控

如果需要对 `dispatch` 做**多个**这样的加工怎么办？

我想到的另一个实用的场景是在生产环境中记录的 JavaScript 错误。全局 `window.onerror` 事件不可靠，因为它在一些旧浏览器中不提供堆栈信息，而这些堆栈信息对我们理解错误是如何产生的至关重要。

如果每当 dispatch action 抛出错误时，我们都将错误、堆栈信息以及造成错误的 action 发送给异常监控服务器比如 [Sentry](https://getsentry.com/welcome/)，那不就很实用了吗？这比要在生产环境复现错误要容易的多。

但是，将日志记录和异常监控分开是很重要的。理想情况下，我们希望它们属于不同的模块，可能在不同的包中。否则，我们就无法创造这些工具的生态环境。（提示：我们正在慢慢了解什么是 middlewares！）

如果日志记录和异常监控是分开的工具函数，它们可能长这样：

```js
function patchStoreToAddLogging(store) {
  const next = store.dispatch
  store.dispatch = function dispatchAndLog(action) {
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    return result
  }
}

function patchStoreToAddCrashReporting(store) {
  const next = store.dispatch
  store.dispatch = function dispatchAndReportErrors(action) {
    try {
      return next(action)
    } catch (err) {
      console.error('Caught an exception!', err)
      Raven.captureException(err, {
        extra: {
          action,
          state: store.getState()
        }
      })
      throw err
    }
  }
}
```

如果这些函数作为单独的模块发布，那之后就可以用它们来给 store 打补丁：

```js
patchStoreToAddLogging(store)
patchStoreToAddCrashReporting(store)
```

即便是这样，依然不是很好。

### 尝试 #4: 隐藏猴子补丁

打猴子补丁是一种 Hack（不推荐）的方式。“替换一切你想替换的方法”，那是一种什么样的 API？让我们一探究竟。之前我们的函数重写了`store.dispatch`。那为什么不 _返回_ 新的 `dispatch` 函数？

```js
function logger(store) {
  const next = store.dispatch

  // 之前:
  // store.dispatch = function dispatchAndLog(action) {

  return function dispatchAndLog(action) {
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    return result
  }
}
```

我们可以在 Redux 中提供一个 helper 方法，但实际实现还是用了猴子补丁：

```js
function applyMiddlewareByMonkeypatching(store, middlewares) {
  middlewares = middlewares.slice()
  middlewares.reverse()

  // 依次调用每个 middleware 来增强 dispatch
  middlewares.forEach(middleware => (store.dispatch = middleware(store)))
}
```

我们可以使用它来调用多个 middlewares，如下所示：

```js
applyMiddlewareByMonkeypatching(store, [logger, crashReporter])
```

然而，它仍然是猴子补丁。
我们将它隐藏在库中并没有改变这一事实。

### 尝试 #5: 移除猴子补丁

为什么每次都需要重写 `dispatch` 呢？很简单，为了以后能够调用它，但还有另外一个原因：这样每个 middleware 都可以访问（和调用）之前封装的 `store.dispatch`：

```js
function logger(store) {
  // 必须指向被前一个 middleware 返回的方法:
  const next = store.dispatch

  return function dispatchAndLog(action) {
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    return result
  }
}
```

必须要链式调用 middlewares！

如果 `applyMiddlewareByMonkeypatching` 在处理第一个 middleware 后没有立即覆盖掉原来的 `store.dispatch`，`store.dispatch` 将继续指向原始的 `dispatch` 函数。那么第二个 middlewares 也会绑定到原来的 `dispatch` 函数上。

但是还有一种不同的方式来做链式调用。Middlewares 来接受 `next()` 调度函数作为参数，而不是从 `store` 实例中读取它。

```js
function logger(store) {
  return function wrapDispatchToAddLogging(next) {
    return function dispatchAndLog(action) {
      console.log('dispatching', action)
      let result = next(action)
      console.log('next state', store.getState())
      return result
    }
  }
}
```

这是一个 [“我们需要更深入”](https://knowyourmeme.com/memes/we-need-to-go-deeper) 的时刻，所以这可能需要一段时间来理解。函数级联感觉很吓人。ES6 箭头函数使这个 [柯里化](https://en.wikipedia.org/wiki/Currying) 更易读：

```js
const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

const crashReporter = store => next => action => {
  try {
    return next(action)
  } catch (err) {
    console.error('Caught an exception!', err)
    Raven.captureException(err, {
      extra: {
        action,
        state: store.getState()
      }
    })
    throw err
  }
}
```

**这正是 Redux middleware 的样子。**

现在 middleware 接受 `next()` dispatch 函数，并返回新的 dispatch 函数，该函数又充当左侧 middleware 的 `next()`，依此类推。仍然可以在需要的时候调用 store 方法（如 `getState()`），因此 `store` 作为顶层参数传入在这里仍然可用。

### 尝试 #6：简单粗暴的 middleware 调用方法

为了替代 `applyMiddlewareByMonkeypatching()`，我们可以编写 `applyMiddleware()`，它先计算出最终的、被所有 middleware 封装后的 `dispatch()` 函数，并使用它返回 store 的副本：

```js
// 注意：这是简单粗暴的middleware调用方法
// 并 *不是* Redux API 真实的实现方法。
function applyMiddleware(store, middlewares) {
  middlewares = middlewares.slice()
  middlewares.reverse()
  let dispatch = store.dispatch
  middlewares.forEach(middleware => (dispatch = middleware(store)(dispatch)))
  return Object.assign({}, store, { dispatch })
}
```

以上方法与 Redux 内置的 [`applyMiddleware()`](../../api/applyMiddleware.md) 的实现是相似的，但**在三个重要方面**不同：

- 它只向 middleware 暴露 [store API](../../api/Store.md) 的一个子集：[`dispatch(action)`](../../api/Store.md#dispatchaction) 和 [`getState()`](../../api/Store.md#getState)。

- 如果你从 middleware 调用 `store.dispatch(action)` 而不是 `next(action)`，确保该 action 再次遍历整个 middleware 链，包括当前的 middleware，这需要一些技巧。[这对异步 middleware 很有用](../../tutorials/fundamentals/part-6-async-logic.md)。在配置 Redux 期间调用 `dispatch` 时有一个警告，后面会讲。

- 为确保你只能应用一次 middleware，它在 `createStore()` 上运行，而不是在 `store` 本身上运行。它的函数签名不是`(store, middlewares) => store`，而是`(...middlewares) => (createStore) => createStore`。

因为在使用 `createStore()` 之前应用函数是很麻烦的，`createStore()` 的最后一个参数作为可选的来指定这样的函数。

#### 警告：在配置 Redux 期间调用 dispatch

当 `applyMiddleware` 执行并配置你的 middleware 时，`store.dispatch` 函数将指向 `createStore` 提供的最初版本。这个时候的 dispatch 还不会经过任何 middleware。如果你期望在配置期间与另一个 middleware 进行交互，可能不支持。由于这种意外行为，在配置完成之前如果 dispatch 了 action，`applyMiddleware` 将抛出错误。解法是，你应该通过一个公共对象（例如做 API 请求的 middleware，那就直接用 API 请求的对象）直接与其他 middleware 通信，或者放到 middleware 配置完后的回调函数中等待执行。

### 最后的实现

鉴于这个 middleware，我们刚刚写道：

```js
const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

const crashReporter = store => next => action => {
  try {
    return next(action)
  } catch (err) {
    console.error('Caught an exception!', err)
    Raven.captureException(err, {
      extra: {
        action,
        state: store.getState()
      }
    })
    throw err
  }
}
```

以下是如何将其应用于 Redux store 的例子：

```js
import { createStore, combineReducers, applyMiddleware } from 'redux'

const todoApp = combineReducers(reducers)
const store = createStore(
  todoApp,
  // applyMiddleware() 告诉 createStore() 如何处理 middlewares
  applyMiddleware(logger, crashReporter)
)
```

就是这样！现在，dispatch 到 store 的所有 action 都会调用 `logger` 和 `crashReporter` 这 2 个 middlewares：

```js
// 将会经过 logger 和 crashReporter middleware!
store.dispatch(addTodo('Use Redux'))
```

## 七个例子

如果你在阅读上述部分时头昏脑胀，请想象一下编写它是什么感觉。本节旨在让你和我放松身心，并有助于让你的头脑开窍。

下面的每个函数都是一个合法的 Redux middleware。它们并不都有作用，但都很有意思。

```js
/**
 * 打印每个 dispatch 的 action 和调用后的状态日志
 */
const logger = store => next => action => {
  console.group(action.type)
  console.info('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  console.groupEnd()
  return result
}

/**
 * 报错的时候发送异常报告
 */
const crashReporter = store => next => action => {
  try {
    return next(action)
  } catch (err) {
    console.error('Caught an exception!', err)
    Raven.captureException(err, {
      extra: {
        action,
        state: store.getState()
      }
    })
    throw err
  }
}

/**
 * 一个定时器，使用 { meta: { delay: N } } 令 action 延迟 N 毫秒后调用。
 * 让 `dispatch` 返回一个取消定时器的函数。
 */
const timeoutScheduler = store => next => action => {
  if (!action.meta || !action.meta.delay) {
    return next(action)
  }

  const timeoutId = setTimeout(() => next(action), action.meta.delay)

  return function cancel() {
    clearTimeout(timeoutId)
  }
}

/**
 * 另一个定时器，使用 { meta: { raf: true } } 让 action 在 rAF 循环内调用。
 * 让 `dispatch` 返回一个删除 action 的函数
 */
const rafScheduler = store => next => {
  const queuedActions = []
  let frame = null

  function loop() {
    frame = null
    try {
      if (queuedActions.length) {
        next(queuedActions.shift())
      }
    } finally {
      maybeRaf()
    }
  }

  function maybeRaf() {
    if (queuedActions.length && !frame) {
      frame = requestAnimationFrame(loop)
    }
  }

  return action => {
    if (!action.meta || !action.meta.raf) {
      return next(action)
    }

    queuedActions.push(action)
    maybeRaf()

    return function cancel() {
      queuedActions = queuedActions.filter(a => a !== action)
    }
  }
}

/**
 * 让你可以直接 dispatch promise 作为 action。
 * 如果 promise 执行成功，它的结果将作为一个 action 发送。
 * `dispatch` 返回的也是 promise，这样如果出错也能处理。
 */
const vanillaPromise = store => next => action => {
  if (typeof action.then !== 'function') {
    return next(action)
  }

  return Promise.resolve(action).then(store.dispatch)
}

/**
 * 允许你 dispatch 带有 { promise } 字段的特殊 action。
 *
 * 这个middleware会在一开始就把它们变成一个单一的 action ，
 * 以及当 `promise` 成功时再 dispatch 一个成功（或失败）的 action 。
 *
 * 为方便起见，`dispatch` 将返回 promise 以便调用者可以继续 then。
 */
const readyStatePromise = store => next => action => {
  if (!action.promise) {
    return next(action)
  }

  function makeAction(ready, data) {
    const newAction = Object.assign({}, action, { ready }, data)
    delete newAction.promise
    return newAction
  }

  next(makeAction(false))
  return action.promise.then(
    result => next(makeAction(true, { result })),
    error => next(makeAction(true, { error }))
  )
}

/**
 * 让你 dispatch 函数而不是 action 对象。
 * 此函数将接收 `dispatch` 和 `getState` 作为参数。
 *
 * 用于提前退出（使用 `getState()` 的条件判断），以及
 * 用于异步控制流（它可以 `dispatch()` 别的东西）。
 *
 * `dispatch` 将返回被调度函数的返回值。
 */
const thunk = store => next => action =>
  typeof action === 'function'
    ? action(store.dispatch, store.getState)
    : next(action)

// 你可以使用以上所有middlewares！（并不等于你应该使用。）
const todoApp = combineReducers(reducers)
const store = createStore(
  todoApp,
  applyMiddleware(
    rafScheduler,
    timeoutScheduler,
    thunk,
    vanillaPromise,
    readyStatePromise,
    logger,
    crashReporter
  )
)
```
