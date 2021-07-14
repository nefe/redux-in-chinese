---
id: middleware
title: Middleware 中间件
description: '原理  > Middleware 中间件：如何使用中间件来扩展 Redux store 的能力'
hide_title: false
---

# Middleware 中间件

在 ["Redux 深入浅出" 教程中](../../tutorials/fundamentals/part-4-store.md#middleware) 你已经学习过中间件的实践案例。如果你使用过服务端框架像 [Express](https://expressjs.com/) 或 [Koa](https://koajs.com/)，你或许已经熟悉 _middleware_ 的概念。在这些框架中，中间件可以让你在接收请求和生成响应之间放置的一些代码。例如，Express 或 Koa 中间件可能会添加 CORS 标头、记录日志、压缩等。中间件的最大特点是它可以组合成一个链。您可以在一个项目中使用多个不同的中间件。

Redux 中间件解决的问题与 Express 或 Koa 中间件不同，但在概念上是相似的。**它在 dispatch action 和到达 reducer 的那一刻之间提供了逻辑插入点**。可以使用 Redux 中间件进行日志记录、异常监控、与异步 API 对话、路由等。

本文分成几部分来让你深入了解它的概念，以及[几个实际例子](#seven-examples)在最后展示中间件的威力。这些例子可能需要来回看，这样你会在无聊和灵感间切换。

## 理解 Middleware

虽然中间件可用于多种用途，包括异步 API 调用，但了解它的来源的原因非常重要。我们将通过“日志记录”和“异常监控”作为示例，来一步步引导你知道中间件产生背后的过程。

### 问题：日志

Redux 的好处之一是它使状态的变更变得可预测且透明。每次 dispatch action 时，都会计算并保存新状态。状态不能自行改变，它只能作为特定 action 的结果而改变。

如果我们记录应用程序中发生的每个 action 调用前后的状态，不是很好吗？当出现问题时，我们可以回溯日志，并找出哪个 action 导致了问题。

<img src='https://i.imgur.com/BjGBlES.png' width='70%' />

我们如何用 Redux 解决这个问题？

### 尝试 #1：手动打日志

最简单的解决方案是每次调用 [`store.dispatch(action)`](../../api/Store.md#dispatchaction) 时手动记录 action 和下一个状态。这并不是真正的解决方案，而只是了解问题的第一步。

> ##### 注意
>
> 使用 [react-redux](https://github.com/reduxjs/react-redux) 或类似的绑定，可能无法直接访问组件中的 store 实例。在接下来的几段中，假设您明确地传递了 store。

比如说，这样来创建 todo：

```js
store.dispatch(addTodo('Use Redux'))
```

要记录 action 和状态，您可以将代码改成这样：

```js
const action = addTodo('Use Redux')

console.log('dispatching', action)
store.dispatch(action)
console.log('next state', store.getState())
```

这会产生所需的效果，但您不想每次都这样做。

### 尝试 #2: 包裹 dispatch

您可以写个函数来记录日志：

```js
function dispatchAndLog(store, action) {
  console.log('dispatching', action)
  store.dispatch(action)
  console.log('next state', store.getState())
}
```

然后你可以在任何地方使用它而不是`store.dispatch()`：

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

这已经非常接近我们想要的了！无论我们在何处 dispatch action，它都保证被记录。Monkeypatching 从来都不是正确的，但我们现在可以忍受它。

### 问题: 异常监控

如果需要对 `dispatch` 做**多个**这样的转换怎么办？

我想到的另一个有用的转换场景是记录生产环境中的 JavaScript 错误。全局 `window.onerror` 事件不可靠，因为它在一些旧浏览器中不提供堆栈信息，这对于理解错误发生的原因至关重要。

想一下这样会更好，每当 dispatch action 抛出错误时，我们都将错误发送给异常监控服务器，例如 [Sentry](https://getsentry.com/welcome/) 和堆栈，这不是很有用吗？记录导致错误的 action 以及当前状态？这样，在开发环境中重现错误要容易得多。

但是，将日志记录和异常监控分开是很重要的。理想情况下，我们希望它们属于不同的模块，可能在不同的包中。否则，我们就无法在不同的应用中复用。（提示：我们正在慢慢了解什么是中间件！）

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

如果这些函数作为单独的模块发布，我们稍后可以使用它们来装饰我们的 store：

```js
patchStoreToAddLogging(store)
patchStoreToAddCrashReporting(store)
```

尽管如此，这并不好。

### 尝试 #4: 隐藏猴子补丁

打猴子补丁是一种 Hack（不推荐）的方式。“替换任何你喜欢的方法”，那是一种什么样的API？让我们找出它的本质。以前，我们的函数替换了`store.dispatch`。如果他们 _返回_ 新的 `dispatch` 函数怎么样？

```js
function logger(store) {
  const next = store.dispatch

  // Previously:
  // store.dispatch = function dispatchAndLog(action) {

  return function dispatchAndLog(action) {
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    return result
  }
}
```

我们可以在 Redux 中提供一个 helper 来帮助我们做猴子补丁：

```js
function applyMiddlewareByMonkeypatching(store, middlewares) {
  middlewares = middlewares.slice()
  middlewares.reverse()

  // 依次调用每个 middleware 来增强 dispatch
  middlewares.forEach(middleware => (store.dispatch = middleware(store)))
}
```

我们可以使用它来调用多个中间件，如下所示：

```js
applyMiddlewareByMonkeypatching(store, [logger, crashReporter])
```

然而，它仍然是猴子补丁。
我们将它隐藏在库中的事实并没有改变这一事实。

### 尝试 #5: 移除猴子补丁

为什么每次都需要覆盖 `dispatch` 呢？很简单，为了以后能够调用它，但还有另外一个原因：这样每个中间件都可以访问（和调用）之前包裹的 `store.dispatch`：

```js
function logger(store) {
  // Must point to the function returned by the previous middleware:
  const next = store.dispatch

  return function dispatchAndLog(action) {
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    return result
  }
}
```

必须要链式调用中间件！

如果 `applyMiddlewareByMonkeypatching` 在处理第一个中间件后没有立即覆盖掉原来的 `store.dispatch`，`store.dispatch` 将继续指向原始的 `dispatch` 函数。那么第二个中间件也会绑定到原来的 `dispatch` 函数上。

但是还有一种不同的方式来做链式调用。中间件来接受 `next()` 调度函数作为参数，而不是从 `store` 实例中读取它。

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

这是一个 [“我们需要更深入”](https://knowyourmeme.com/memes/we-need-to-go-deeper) 的时刻，所以这可能需要一段时间来理解。函数级联感觉很吓人。ES6 箭头函数使这个 [轲里化](https://en.wikipedia.org/wiki/Currying) 更易读：

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

**这正是 Redux 中间件的样子。**

现在中间件接受 `next()` dispatch 函数，并返回新的 dispatch 函数，该函数又充当左侧中间件的 `next()`，依此类推。仍然可以在需要的时候调用 store 方法（如 `getState()`），因此 `store` 作为顶级参数传入在这里仍然可用。

### 尝试 #6：简单粗暴的中间件调用方法

为了替代 `applyMiddlewareByMonkeypatching()`，我们可以编写 `applyMiddleware()`，它先计算出最终的、被所有 middleware 包裹后的 `dispatch()` 函数，并使用它返回 store 的副本：

```js
// 注意：这是简单粗暴的中间件调用方法
// 并 *不是* Redux API 真实的实现方法。
function applyMiddleware(store, middlewares) {
  middlewares = middlewares.slice()
  middlewares.reverse()
  let dispatch = store.dispatch
  middlewares.forEach(middleware => (dispatch = middleware(store)(dispatch)))
  return Object.assign({}, store, { dispatch })
}
```

Redux 内置的 [`applyMiddleware()`](../../api/applyMiddleware.md) 的实现是相似的，但**在三个重要方面**不同：

- 它只向中间件公开 [store API](../../api/Store.md) 的一个子集：[`dispatch(action)`](../../api/Store.md# dispatchaction) 和 [`getState()`](../../api/Store.md#getState)。

- 确保如果您从中间件调用 `store.dispatch(action)` 而不是 `next(action)`，该 action 实际上将再次遍历整个中间件链，包括当前的中间件，这需要一些技巧。[这对异步中间件很有用](../../tutorials/fundamentals/part-6-async-logic.md)。在配置 Redux 期间调用 `dispatch` 时有一个警告，后面会讲。

- 为确保您只能应用一次中间件，它在 `createStore()` 上运行，而不是在 `store` 本身上运行。它的函数签名不是`(store, middlewares) => store`，而是`(...middlewares) => (createStore) => createStore`。

因为在使用 `createStore()` 之前将函数应用到它是很麻烦的，`createStore()` 的最后一个参数作为可选的来指定这样的函数。

#### 警告：在配置 Redux 期间调用 dispatch

当 `applyMiddleware` 执行并配置你的中间件时，`store.dispatch` 函数将指向 `createStore` 提供的最初版本。这个时候的 dispatch 还不会经过任何 middleware。如果您期望在配置期间与另一个中间件进行交互，您可能会感到失望。由于这种意外行为，在配置完成之前如果 dispatch 了 action，`applyMiddleware` 将抛出错误。解法是，你应该通过一个公共对象（例如做 API 请求的中间件，那就直接用 API 请求的对象）直接与其他中间件通信，或者放到中间件配置完后的回调函数中等待执行。

### 最后的实现

鉴于这个中间件，我们刚刚写道：

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

以下是如何将其应用于 Redux store ：

```js
import { createStore, combineReducers, applyMiddleware } from 'redux'

const todoApp = combineReducers(reducers)
const store = createStore(
  todoApp,
  // applyMiddleware() tells createStore() how to handle middleware
  applyMiddleware(logger, crashReporter)
)
```

就是这样！现在，dispatch 到 store 的所有 action 都会调用 `logger` 和 `crashReporter` 这2个中间件：

```js
// Will flow through both logger and crashReporter middleware!
store.dispatch(addTodo('Use Redux'))
```

## Seven Examples

如果您在阅读上述部分时头脑发热，请想象一下编写它是什么感觉。本节旨在让您和我放松身心，并有助于让您的头脑开窍。

下面的每个函数都是一个有效的 Redux 中间件。它们并不同样有用，但都同样有趣。

```js
/**
 * 日志打印每个 dispatch 的 action 和调用后的状态
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
 * 一个定时器，使用 { meta: { delay: N } } 安排 action 延迟 N 毫秒后调用。
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
 * 允许您 dispatch 带有 { promise } 字段的特殊 action。
 *
 * 这个中间件会在一开始就把它们变成一个单一的 action ，
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

// 您可以使用以上所有中间件！（这并不意味着你应该。）
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
