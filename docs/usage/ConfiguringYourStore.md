---
id: configuring-your-store
title: Configuring Your Store
hide_title: false
---

# 配置 Store

在["Redux 深入浅出" 教程](../tutorials/fundamentals/part-1-overview.md)这一章节我们构建了一个 Todo list 应用，介绍了一些 Redux 基础知识。其中也讲到了如何配置 Redux store。

接下来我们将会探索如何定制 store 来添加额外的功能。我们将会接着基础部分的源代码继续写，你可以在[文档](../tutorials/fundamentals/part-5-ui-and-react.md)，或 [仓库中的示例部分](https://github.com/reduxjs/redux-fundamentals-example-app/tree/checkpoint-5-uiAllActions)，或者用 [CodeSandbox 在浏览器中](https://codesandbox.io/s/github/reduxjs/redux-fundamentals-example-app/tree/checkpoint-5-uiAllActions/)阅读这些代码。

## 创建 store

首先我们来看看在原先的 `index.js` 中我们是如何创建 store 的：

```js
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './reducers'
import App from './components/App'

const store = createStore(rootReducer)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

代码中，我们将 reducer 传入 Redux 提供的 `createStore` 函数中，它返回了一个 `store` 对象。接着我们将这个对象传入 `react-redux` 提供的 `Provider` 组件中，然后将它挂载在组件树的根部。

这样做可以保证我们在任何时候通过 `react-redux` 的 `connect` 连接到 Redux 时，store 可以在组件中正常使用。

## 拓展 Redux 功能

大多数的应用都会使用 middleware 或 enhancer 来拓展 Redux store 的功能。**（注：middleware 很常见，enhancer 不太常见）** middleware 拓展了 Redux `dispatch` 函数的功能；enhancer 拓展了 Redux store 的功能。

我们将会添加如下两个 middleware 和 一个 enhancer：

- [`redux-thunk` middleware](https://github.com/reduxjs/redux-thunk)，允许了简单的 dispatch 异步用法。
- 一个记录 dispatch 的 action 和得到的新 state 的 middleware。
- 一个记录 reducer 处理每个 action 所用时间的 enhancer。

#### 安装 `redux-thunk`

```
npm install --save redux-thunk
```

#### middleware/logger.js

```js
const logger = store => next => action => {
  console.group(action.type)
  console.info('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  console.groupEnd()
  return result
}

export default logger
```

#### enhancers/monitorReducer.js

```js
const round = number => Math.round(number * 100) / 100

const monitorReducerEnhancer =
  createStore => (reducer, initialState, enhancer) => {
    const monitoredReducer = (state, action) => {
      const start = performance.now()
      const newState = reducer(state, action)
      const end = performance.now()
      const diff = round(end - start)

      console.log('reducer process time:', diff)

      return newState
    }

    return createStore(monitoredReducer, initialState, enhancer)
  }

export default monitorReducerEnhancer
```

我们把这些东西添加到 `index.js` 中。

- 首先我们引入 `redux-thunk`，我们自己写的 `loggerMiddleware` 和 `monitorReducerEnhancer`，还有两个 Redux 提供的函数：`applyMiddleware` 和 `compose`。
- 接下来我们用 `applyMiddleware` 来创建一个 store enhancer，通过它我们可以将 `loggerMiddleware` 和 `thunkMiddleware` 应用到 dispatch 函数。
- 下一步，我们使用 `compose` 将新的 `middlewareEnhancer` 和 `monitorReducerEnhancer` 组合到一起。这一步必须要做，因为 `createStore` 只接受一个 enhancer 作为参数，所以你只能将它俩组合（compose）成一个大的 enhancer，正如示例中所示。
- 最后，我们将这个 `composedEnhancers` 函数传入 `createStore` 中作为第三个参数。 **注：这里我们忽略掉了 createStore 的第二个参数，你可以通过它给 store 传入一个初始 state。**

```js
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers'
import loggerMiddleware from './middleware/logger'
import monitorReducerEnhancer from './enhancers/monitorReducer'
import App from './components/App'

const middlewareEnhancer = applyMiddleware(loggerMiddleware, thunkMiddleware)
const composedEnhancers = compose(
  middlewareEnhancer,
  monitorReducerEnhancer
)

const store = createStore(rootReducer, undefined, composedEnhancers)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

## 这种做法的问题

这些代码的确能正常运行，但对于一个典型（typical）的应用来说还不够理想。

大多数应用使用的 middleware 大于一个，而且每个 middleware 经常需要一些额外的初始化工作。这些“噪声”的加入会使 `index.js` 很快变得难以维护，因为这些逻辑并没有被清晰合理地组织起来。

## 解决方案：`configureStore`

这个问题的解决方案是创造一个封装了 store 创建逻辑的新的函数 `configureStore`。它放在一个单独的文件中，所以可以被任意拓展。

我们的 `index.js` 的最终是这样：

```js
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './components/App'
import configureStore from './configureStore'

const store = configureStore()

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

所有配置 store 相关的逻辑（包括引入 reducer、middleware、enhancer），都放置于一个单独用于处理它们的文件中。

为了达到这个目标，`configureStore` 函数应该是这样：

```js
import { applyMiddleware, compose, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'

import monitorReducersEnhancer from './enhancers/monitorReducers'
import loggerMiddleware from './middleware/logger'
import rootReducer from './reducers'

export default function configureStore(preloadedState) {
  const middlewares = [loggerMiddleware, thunkMiddleware]
  const middlewareEnhancer = applyMiddleware(...middlewares)

  const enhancers = [middlewareEnhancer, monitorReducersEnhancer]
  const composedEnhancers = compose(...enhancers)

  const store = createStore(rootReducer, preloadedState, composedEnhancers)

  return store
}
```

这个函数遵循了上述步骤，其中有一些逻辑拆分开来，为后续拓展做好准备。

- `middlwares` 和 `enhancers` 都被定义为数组，与实际使用它们的函数分离开来。这样做我们可以很容易地为不同情况添加更多的 middleware 或 enhancer。

  例如，一种很常见的情况是，只有在开发模式下才添加某些 middleware。这个可以在一个 if 条件句中向 middleware 数组添加新的 middleware 来轻松实现：

  ```js
  if (process.env === 'development') {
    middlewares.push(secretMiddleware)
  }
  ```

- 将一个 `preloadedState` 变量传入 `createStore`，以便后续使用。

这样我们调试 `createStore` 也更轻松了——每个步骤都分离的清清楚楚，目前正在发生什么一目了然。

## 集成 devtools 扩展程序

另外一个你很想在你的应用中加入的功能就是 `redux-devtools-extension` 的集成。

这个扩展程序是一系列工具的集合，通过它们你可以获得 Redux store 完全的控制：它允许你观察或重放 action，在不同时刻查看 state，直接向 store 中 dispatch 一个 action，......等等很多功能。[点击此处阅读更多](https://github.com/zalmoxisus/redux-devtools-extension)。

有很多方案可以集成此扩展程序，但我们会用最方便的那个。

首先，使用 npm 安装：

```
npm install --save-dev redux-devtools-extension
```

接下来，我们移除掉从 `redux` 引入的 `compose` 函数，然后用一个从 `redux-devtools-extension` 中引入的 `composeWithDevTools` 函数来替换它。

最终的代码是这样：

```js
import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import monitorReducersEnhancer from './enhancers/monitorReducers'
import loggerMiddleware from './middleware/logger'
import rootReducer from './reducers'

export default function configureStore(preloadedState) {
  const middlewares = [loggerMiddleware, thunkMiddleware]
  const middlewareEnhancer = applyMiddleware(...middlewares)

  const enhancers = [middlewareEnhancer, monitorReducersEnhancer]
  const composedEnhancers = composeWithDevTools(...enhancers)

  const store = createStore(rootReducer, preloadedState, composedEnhancers)

  return store
}
```

这样就成了！

现在用安装了 devtools 扩展程序的浏览器访问我们的应用，我们即可使用这一强大的工具来探索和调试了。

## 热加载

还有一个强大的工具可以使你的开发过程更加直观，那就是热加载（hot reloading），它可以在无需重启整个应用的情况下替换代码。

比如说，你启动了应用程序，使用了一会儿，决定对其中一个 reducer 做一些改动。正常情况下，你做了改动后应用会重启，并且 Redux state 会重置到其初始状态。

当使用热加载时，只有你做了更改的 reducer 会被重启。这样一来你就无需在每次修改代码之后重置整个 state，开发过程会更加迅速。

我们将 Redux reducer 和 React 组件都启用热加载。

首先，将它引入 `configureStore` 函数：

```js
import { applyMiddleware, compose, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'

import monitorReducersEnhancer from './enhancers/monitorReducers'
import loggerMiddleware from './middleware/logger'
import rootReducer from './reducers'

export default function configureStore(preloadedState) {
  const middlewares = [loggerMiddleware, thunkMiddleware]
  const middlewareEnhancer = applyMiddleware(...middlewares)

  const enhancers = [middlewareEnhancer, monitorReducersEnhancer]
  const composedEnhancers = compose(...enhancers)

  const store = createStore(rootReducer, preloadedState, composedEnhancers)

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(rootReducer))
  }

  return store
}
```

新的代码放置在 `if` 条件句中，所以它只在非生产环境中运行，而且只在能用 `module.hot` 时运行。

像 Webpack 和 Parcel 这样的打包工具支持 `module.hot.accept` 方法，它用于指定哪一个模块（module）应该启用热加载，以及当模块改变时应该做什么。此例中，我们监控 `./reducers` 模块，当这个模块改变时将新计算出的 `rootReducer` 传入 `store.replaceReducer` 函数。

在 `index.js` 中，我们也会使用相同的模式来热加载 React 组件：

```js
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './components/App'
import configureStore from './configureStore'

const store = configureStore()

const renderApp = () =>
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./components/App', renderApp)
}

renderApp()
```

这里只有一个地方与刚刚不同，就是我们将应用的渲染封装进了 `renderApp` 函数，调用它将会重新渲染整个应用。

## 使用 Redux Starter Kit 简化设置

Redux 核心库特意设置为最轻量化的。它可以让您决定如何处理所有内容，例如 store
设置、您的 state 包含的内容、以及您希望如何构建 Reducer。

这在某些情况下是好的，因为它为您提供了灵活性，但我们并不总是需要这种灵活性。有时我们只想要使用一个包含默认配置的开箱即用的方法。

[Redux Starter Kit](https://redux-starter-kit.js.org/) 包旨在帮助简化几个常见的 Redux 用例，包括 store 设置。
让我们看看它如何帮助改善 store 设置流程。

Redux Starter Kit 包含一个预构建的 [`configureStore` 函数](https://redux-starter-kit.js.org/api/configureStore) ，该函数类似于前面示例展示的同名函数。

最快的使用方法是只传递 root reducer 函数：

```js
import { configureStore } from 'redux-starter-kit'
import rootReducer from './reducers'

const store = configureStore({
  reducer: rootReducer
})

export default store
```

请注意，它接受具有命名参数的对象，以使您更清楚地展示所传入的内容。

默认情况下，Redux Starter Kit 中 的 `configureStore` 将：

- 调用 `applyMiddleware` 来使用 [默认的多个中间件, 包括 `redux-thunk`](https://redux-starter-kit.js.org/api/getDefaultMiddleware), 以及一些仅用于开发环境的中间件，例如用来捕获类似 state 变异错误的中间件。
- 调用 `composeWithDevTools` 来设置 Redux DevTools 扩展

以下是使用 Redux Starter Kit 的 hot reloading 示例：

```js
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit'

import monitorReducersEnhancer from './enhancers/monitorReducers'
import loggerMiddleware from './middleware/logger'
import rootReducer from './reducers'

export default function configureAppStore(preloadedState) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [loggerMiddleware, ...getDefaultMiddleware()],
    preloadedState,
    enhancers: [monitorReducersEnhancer]
  })

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(rootReducer))
  }

  return store
}
```

这肯定简化了一些设置过程。

## 下一步

现在你已经学会了如何将配置 store 的方法进行封装，让它更易于维护。你现在可以学习[Redux Toolkit `configureStore` API](https://redux-toolkit.js.org/api/configureStore)，或者看一些[Redux 生态系统提供的扩展程序](../introduction/Ecosystem.md#debuggers-and-viewers).
