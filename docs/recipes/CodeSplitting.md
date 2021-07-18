---
id: code-splitting
title: 代码分割
hide_title: false
---

# 代码分割

在大型 Web 应用程序中，通常需要将应用程序代码拆分为多个可以按需加载的 JS 包。 这种称为“代码分割”的策略通过减小初次加载时的 JS 的包的大小，来提高应用程序的性能。

要使用 Redux 进行代码拆分，我们希望能够将 reducer 动态添加到 store。 但是，Redux 实际上只有一个 root reducer 函数。 这个 root reducer 通常是在初始化应用程序时通过调用 `combineReducers（）` 或类似函数生成的。 为了动态添加更多的 reducer，我们需要再次调用该函数来重新生成 root reducer。 下面，我们将讨论可以解决此问题的一些方法，并推荐提供此功能的两个库。

## 基本原则

### 使用 `replaceReducer`

Redux store 暴露出一个 `replaceReducer` 函数，该函数使用新的 root reducer 替代当前活动的 root reducer。调用该函数将替换内部 reducer 的引用，并 dispatch 一个 action 以初始化新加入的 reducer：

```js
const newRootReducer = combineReducers({
  existingSlice: existingSliceReducer,
  newSlice: newSliceReducer
})

store.replaceReducer(newRootReducer)
```

## Reducer 注入

### 定义一个 `injectReducer` 函数

我们可能想从应用程序的任何地方调用 `store.replaceReducer（）`。因此，它使我们可以很轻易的定义一个可重用的 `injectReducer()` 函数。该函数能够保持对所有现有 slice reducer 的引用，并可将新 reducer 附加到 store 实例。

```js
import { createStore } from 'redux'

// 定义将始终存在于应用程序中的 Reducer
const staticReducers = {
  users: usersReducer,
  posts: postsReducer
}

// Configure the store
export default function configureStore(initialState) {
  const store = createStore(createReducer(), initialState)

  // 添加一个对象以跟踪已注册的异步 Reducer
  store.asyncReducers = {}

  //创建注入 reducer 函数
  // 此函数添加 async reducer，并创建一个新的组合 reducer
  store.injectReducer = (key, asyncReducer) => {
    store.asyncReducers[key] = asyncReducer
    store.replaceReducer(createReducer(this.asyncReducers))
  }

  // 返回修改后的 store
  return store
}

function createReducer(asyncReducers) {
  return combineReducers({
    ...staticReducers,
    ...asyncReducers
  })
}
```

现在，只需要调用 `store.injectReducer` 函数即可向 store 添加新的 reducer。

### 使用 'Reducer Manager'

另一种方法是创建一个 'Reducer Manager' 对象，它跟踪所有已注册的 Reducer 并暴露出 `reduce()` 函数。 请参考以下示例：

```js
export function createReducerManager(initialReducers) {
  // 创建一个将 key 映射到 reducer 的对象
  const reducers = { ...initialReducers }

  // 创建初始 CombinedReducer
  let combinedReducer = combineReducers(reducers)

  // 存储 key 的数组，用于删除 reducer 时删除 state 中对应的数据
  const keysToRemove = []

  return {
    getReducerMap: () => reducers,

    // 这个 root reducer 函数在该对象中暴露出
    // 并将传递给 store
    reduce: (state, action) => {
      // 如果已删除任何 reducer，请先清理 state 中对应的值
      if (keysToRemove.length > 0) {
        state = { ...state }
        for (let key of keysToRemove) {
          delete state[key]
        }
        keysToRemove = []
      }

      // Delegate to the combined reducer
      return combinedReducer(state, action)
    },

    // 添加具有指定 key 的新 reducer
    add: (key, reducer) => {
      if (!key || reducers[key]) {
        return
      }

      // 将 reducer 添加到 reducer 映射中
      reducers[key] = reducer

      // 生成新的 combined reducer
      combinedReducer = combineReducers(reducers)
    },

    // 使用指定的 key 删除 reducer
    remove: key => {
      if (!key || !reducers[key]) {
        return
      }

      // 从 reducer 映射中删除它
      delete reducers[key]

      // 将 key 添加到要清理的 key 列表中
      keysToRemove.push(key)

      // 生成新的 combined reducer
      combinedReducer = combineReducers(reducers)
    }
  }
}

const staticReducers = {
  users: usersReducer,
  posts: postsReducer
}

export function configureStore(initialState) {
  const reducerManager = createReducerManager(staticReducers)

  // 使用 root reducer 函数创建一个 store，该 root reducer 函数是 manager 暴露出的函数。
  const store = createStore(reducerManager.reduce, initialState)

  // 可选：将 reducer manager 添加到 store 上，以便于访问
  store.reducerManager = reducerManager
}
```

要添加新的 reducer，现在可以调用 `store.reducerManager.add("asyncState", asyncReducer)`。

要删除 reducer 现在可以调用 `store.reducerManager.remove("asyncState")`。

## 库和框架

以下有一些优秀的库可以帮助您自动添加上述功能：

- [`redux-dynamic-modules`](https://github.com/Microsoft/redux-dynamic-modules):
  该库引入了“Redux Module”的概念，它是一组应该动态加载的 Redux 部件（Reducer，middleware）。它还暴露出一个 React 高阶组件用来在应用组件加载后加载 Module。 此外，它还与诸如 `redux-thunk` 和 `redux-saga` 之类的库集成，以使这些库可以动态加载他们的部件（thunk，sagas）。
- [Redux 生态系统链接: Reducer - Reducer 动态注入](https://github.com/markerikson/redux-ecosystem-links/blob/master/reducers.md#dynamic-reducer-injection)
