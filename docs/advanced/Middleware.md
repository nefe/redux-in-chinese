# Middleware

我们已经在[异步 Action ](../advanced/AsyncActions.md)一节的示例中看到了一些 middleware 的使用。如果你使用过 [Express](http://expressjs.com/) 或者 [Koa](http://koajs.com/) 等服务端框架, 那么应该对 *middleware* 的概念不会陌生。 在这类框架中，middleware 是指可以被嵌入在框架接收请求到产生响应过程之中的代码。例如，Express 或者 Koa 的 middleware 可以完成添加 CORS headers、记录日志、内容压缩等工作。middleware 最优秀的特性就是可以被链式组合。你可以在一个项目中使用多个独立的第三方 middleware。

相对于 Express 或者 Koa 的 middleware，Redux middleware 被用于解决不同的问题，但其中的概念是类似的。**它提供的是位于 action 被发起之后，到达 reducer 之前的扩展点。** 你可以利用 Redux middleware 来进行日志记录、创建崩溃报告、调用异步接口或者路由等等。

这个章节分为两个部分，前面是帮助你理解相关概念的深度介绍，而后半部分则通过[一些实例](#seven-examples)来体现 middleware 的强大能力。对文章前后内容进行结合通读，会帮助你更好的理解枯燥的概念，并从中获得启发。

## 理解 Middleware

正因为 middleware 可以完成包括异步 API 调用在内的各种事情，了解它的演化过程是一件相当重要的事。我们将以记录日志和创建崩溃报告为例，引导你体会从分析问题到通过构建 middleware 解决问题的思维过程。

### 问题: 记录日志

使用 Redux 的一个益处就是它让 state 的变化过程变的可预知和透明。每当一个 action 发起完成后，新的 state 就会被计算并保存下来。State 不能被自身修改，只能由特定的 action 引起变化。

试想一下，当我们的应用中每一个 action 被发起以及每次新的 state 被计算完成时都将它们记录下来，岂不是很好？当程序出现问题时，我们可以通过查阅日志找出是哪个 action 导致了 state 不正确。

<img src='http://i.imgur.com/BjGBlES.png' width='70%'>

我们如何通过 Redux 实现它呢？

### 尝试 #1: 手动记录

最直接的解决方案就是在每次调用 [`store.dispatch(action)`](../api/Store.md#dispatch) 前后手动记录被发起的 action 和新的 state。这称不上一个真正的解决方案，仅仅是我们理解这个问题的第一步。

>##### 注意

>如果你使用 [react-redux](https://github.com/gaearon/react-redux) 或者类似的绑定库，最好不要直接在你的组件中操作 store 的实例。在接下来的内容中，仅仅是假设你会通过 store 显式地向下传递。

假设，你在创建一个 Todo 时这样调用：

```js
store.dispatch(addTodo('Use Redux'))
```

为了记录这个 action 以及产生的新的 state，你可以通过这种方式记录日志：

```js
let action = addTodo('Use Redux')

console.log('dispatching', action)
store.dispatch(action)
console.log('next state', store.getState())
```

虽然这样做达到了想要的效果，但是你并不想每次都这么干。

### 尝试 #2: 封装 Dispatch

你可以将上面的操作抽取成一个函数：

```js
function dispatchAndLog(store, action) {
  console.log('dispatching', action)
  store.dispatch(action)
  console.log('next state', store.getState())
}
```

然后用它替换 `store.dispatch()`:

```js
dispatchAndLog(store, addTodo('Use Redux'))
```
你可以选择到此为止，但是每次都要导入一个外部方法总归还是不太方便。

### 尝试 #3: Monkeypatching Dispatch

如果我们直接替换 store 实例中的 `dispatch` 函数会怎么样呢？Redux store 只是一个包含[一些方法](../api/Store.md)的普通对象，同时我们使用的是 JavaScript，因此我们可以这样实现 `dispatch` 的 monkeypatch：

```js
let next = store.dispatch
store.dispatch = function dispatchAndLog(action) {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}
```

这离我们想要的已经非常接近了！无论我们在哪里发起 action，保证都会被记录。Monkeypatching 令人感觉还是不太舒服，不过利用它我们做到了我们想要的。

### 问题: 崩溃报告

如果我们想对 `dispatch` 附加**超过一个**的变换，又会怎么样呢？

我脑海中出现的另一个常用的变换就是在生产过程中报告 JavaScript 的错误。全局的 `window.onerror` 并不可靠，因为它在一些旧的浏览器中无法提供错误堆栈，而这是排查错误所需的至关重要信息。

试想当发起一个 action 的结果是一个异常时，我们将包含调用堆栈，引起错误的 action 以及当前的 state 等错误信息通通发到类似于 [Sentry](https://getsentry.com/welcome/) 这样的报告服务中，不是很好吗？这样我们可以更容易地在开发环境中重现这个错误。

然而，将日志记录和崩溃报告分离是很重要的。理想情况下，我们希望他们是两个不同的模块，也可能在不同的包中。否则我们无法构建一个由这些工具组成的生态系统。（提示：我们正在慢慢了解 middleware 的本质到底是什么！）

如果按照我们的想法，日志记录和崩溃报告属于不同的模块，他们看起来应该像这样：

```js
function patchStoreToAddLogging(store) {
  let next = store.dispatch
  store.dispatch = function dispatchAndLog(action) {
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    return result
  }
}

function patchStoreToAddCrashReporting(store) {
  let next = store.dispatch
  store.dispatch = function dispatchAndReportErrors(action) {
    try {
      return next(action)
    } catch (err) {
      console.error('捕获一个异常!', err)
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

如果这些功能以不同的模块发布，我们可以在 store 中像这样使用它们：

```js
patchStoreToAddLogging(store)
patchStoreToAddCrashReporting(store)
```

尽管如此，这种方式看起来还是不是够令人满意。

### 尝试 #4: 隐藏 Monkeypatching

Monkeypatching 本质上是一种 hack。“将任意的方法替换成你想要的”，此时的 API 会是什么样的呢？现在，让我们来看看这种替换的本质。 在之前，我们用自己的函数替换掉了 `store.dispatch`。如果我们不这样做，而是在函数中**返回**新的 `dispatch` 呢？

```js
function logger(store) {
  let next = store.dispatch

  // 我们之前的做法:
  // store.dispatch = function dispatchAndLog(action) {

  return function dispatchAndLog(action) {
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    return result
  }
}
```

我们可以在 Redux 内部提供一个可以将实际的 monkeypatching 应用到 `store.dispatch` 中的辅助方法：

```js
function applyMiddlewareByMonkeypatching(store, middlewares) {
  middlewares = middlewares.slice()
  middlewares.reverse()

  // 在每一个 middleware 中变换 dispatch 方法。
  middlewares.forEach(middleware =>
    store.dispatch = middleware(store)
  )
}
```

然后像这样应用多个 middleware：

```js
applyMiddlewareByMonkeypatching(store, [ logger, crashReporter ])
```

尽管我们做了很多，实现方式依旧是 monkeypatching。  
因为我们仅仅是将它隐藏在我们的框架内部，并没有改变这个事实。

### 尝试 #5: 移除 Monkeypatching

为什么我们要替换原来的 `dispatch` 呢？当然，这样我们就可以在后面直接调用它，但是还有另一个原因：就是每一个 middleware 都可以操作（或者直接调用）前一个 middleware 包装过的 `store.dispatch`：

```js
function logger(store) {
  // 这里的 next 必须指向前一个 middleware 返回的函数：
  let next = store.dispatch

  return function dispatchAndLog(action) {
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    return result
  }
}
```

将 middleware 串连起来的必要性是显而易见的。

如果 `applyMiddlewareByMonkeypatching` 方法中没有在第一个 middleware 执行时立即替换掉 `store.dispatch`，那么 `store.dispatch` 将会一直指向原始的 `dispatch` 方法。也就是说，第二个 middleware 依旧会作用在原始的 `dispatch` 方法。

但是，还有另一种方式来实现这种链式调用的效果。可以让 middleware 以方法参数的形式接收一个 `next()` 方法，而不是通过 store 的实例去获取。

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
现在是[“我们该更进一步”](http://knowyourmeme.com/memes/we-need-to-go-deeper)的时刻了，所以可能会多花一点时间来让它变的更为合理一些。这些串联函数很吓人。ES6 的箭头函数可以使其 [柯里化](https://en.wikipedia.org/wiki/Currying) ，从而看起来更舒服一些:

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

Middleware 接收了一个 `next()` 的 dispatch 函数，并返回一个 dispatch 函数，返回的函数会被作为下一个 middleware 的 `next()`，以此类推。由于 store 中类似 `getState()` 的方法依旧非常有用，我们将 `store` 作为顶层的参数，使得它可以在所有 middleware 中被使用。

### 尝试 #6: “单纯”地使用 Middleware

我们可以写一个 `applyMiddleware()` 方法替换掉原来的 `applyMiddlewareByMonkeypatching()`。在新的 `applyMiddleware()` 中，我们取得最终完整的被包装过的 `dispatch()` 函数，并返回一个 store 的副本：

```js
// 警告：这只是一种“单纯”的实现方式！
// 这 *并不是* Redux 的 API.

function applyMiddleware(store, middlewares) {
  middlewares = middlewares.slice()
  middlewares.reverse()

  let dispatch = store.dispatch
  middlewares.forEach(middleware =>
    dispatch = middleware(store)(dispatch)
  )

  return Object.assign({}, store, { dispatch })
}
```

这与 Redux 中 [`applyMiddleware()`](../api/applyMiddleware.md) 的实现已经很接近了，但是**有三个重要的不同之处**：

* 它只暴露一个 [store API](../api/Store.md) 的子集给 middleware：[`dispatch(action)`](../api/Store.md#dispatch) 和 [`getState()`](../api/Store.md#getState)。

* 它用了一个非常巧妙的方式来保证你的 middleware 调用的是 `store.dispatch(action)` 而不是 `next(action)`，从而使这个 action 会在包括当前 middleware 在内的整个 middleware 链中被正确的传递。这对异步的 middleware 非常有用，正如我们在[之前的章节](AsyncActions.md)中提到的。

* 为了保证你只能应用 middleware 一次，它作用在 `createStore()` 上而不是 `store` 本身。因此它的签名不是 `(store, middlewares) => store`， 而是 `(...middlewares) => (createStore) => createStore`。

由于在使用之前需要先应用方法到 `createStore()` 之上有些麻烦，`createStore()` 也接受将希望被应用的函数作为最后一个可选参数传入。

### 最终的方法

这是我们刚刚所写的 middleware：

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

然后是将它们引用到 Redux store 中：

```js
import { createStore, combineReducers, applyMiddleware } from 'redux'

let todoApp = combineReducers(reducers)
let store = createStore(
  todoApp,
  // applyMiddleware() 告诉 createStore() 如何处理中间件
  applyMiddleware(logger, crashReporter)
)
```

就是这样！现在任何被发送到 store 的 action 都会经过 `logger` 和 `crashReporter`：

```js
// 将经过 logger 和 crashReporter 两个 middleware！
store.dispatch(addTodo('Use Redux'))
```

## 7个示例

如果读完上面的章节你已经觉得头都要爆了，那就想象一下把它写出来之后的样子。下面的内容会让我们放松一下，并让你的思路延续。

下面的每个函数都是一个有效的 Redux middleware。它们不是同样有用，但是至少他们一样有趣。

```js
/**
 * 记录所有被发起的 action 以及产生的新的 state。
 */
const logger = store => next => action => {
  console.group(action.type)
  console.info('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  console.groupEnd(action.type)
  return result
}

/**
 * 在 state 更新完成和 listener 被通知之后发送崩溃报告。
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
 * 用 { meta: { delay: N } } 来让 action 延迟 N 毫秒。
 * 在这个案例中，让 `dispatch` 返回一个取消 timeout 的函数。
 */
const timeoutScheduler = store => next => action => {
  if (!action.meta || !action.meta.delay) {
    return next(action)
  }

  let timeoutId = setTimeout(
    () => next(action),
    action.meta.delay
  )

  return function cancel() {
    clearTimeout(timeoutId)
  }
}

/**
 * 通过 { meta: { raf: true } } 让 action 在一个 rAF 循环帧中被发起。
 * 在这个案例中，让 `dispatch` 返回一个从队列中移除该 action 的函数。
 */
const rafScheduler = store => next => {
  let queuedActions = []
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
 * 使你除了 action 之外还可以发起 promise。
 * 如果这个 promise 被 resolved，他的结果将被作为 action 发起。
 * 这个 promise 会被 `dispatch` 返回，因此调用者可以处理 rejection。
 */
const vanillaPromise = store => next => action => {
  if (typeof action.then !== 'function') {
    return next(action)
  }

  return Promise.resolve(action).then(store.dispatch)
}

/**
 * 让你可以发起带有一个 { promise } 属性的特殊 action。
 *
 * 这个 middleware 会在开始时发起一个 action，并在这个 `promise` resolve 时发起另一个成功（或失败）的 action。
 *
 * 为了方便起见，`dispatch` 会返回这个 promise 让调用者可以等待。
 */
const readyStatePromise = store => next => action => {
  if (!action.promise) {
    return next(action)
  }

  function makeAction(ready, data) {
    let newAction = Object.assign({}, action, { ready }, data)
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
 * 让你可以发起一个函数来替代 action。
 * 这个函数接收 `dispatch` 和 `getState` 作为参数。
 *
 * 对于（根据 `getState()` 的情况）提前退出，或者异步控制流（ `dispatch()` 一些其他东西）来说，这非常有用。
 *
 * `dispatch` 会返回被发起函数的返回值。
 */
const thunk = store => next => action =>
  typeof action === 'function' ?
    action(store.dispatch, store.getState) :
    next(action)

// 你可以使用以上全部的 middleware！（当然，这不意味着你必须全都使用。）
let todoApp = combineReducers(reducers)
let store = createStore(
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
