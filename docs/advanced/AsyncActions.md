# 异步 Action

在[基础教程](../basics/README.md)中，我们创建了一个简单的 todo 应用。它只有同步操作。每当 dispatch action 时，state 会被立即更新。

在本教程中，我们将开发一个不同的，异步的应用。它将使用 Reddit API 来获取并显示指定 subreddit 下的帖子列表。那么 Redux 究竟是如何处理异步数据流的呢？

## Action

当调用异步 API 时，有两个非常关键的时刻：发起请求的时刻，和接收到响应的时刻 （也可能是超时）。

这两个时刻都可能会更改应用的 state；为此，你需要 dispatch 普通的同步 action。一般情况下，每个 API 请求都需要 dispatch 至少三种 action：

* **一种通知 reducer 请求开始的 action。**

  对于这种 action，reducer 可能会切换一下 state 中的 `isFetching` 标记。以此来告诉 UI 来显示加载界面。

* **一种通知 reducer 请求成功的 action。**

  对于这种 action，reducer 可能会把接收到的新数据合并到 state 中，并重置 `isFetching`。UI 则会隐藏加载界面，并显示接收到的数据。

* **一种通知 reducer 请求失败的 action。**

  对于这种 action，reducer 可能会重置 `isFetching`。另外，有些 reducer 会保存这些失败信息，并在 UI 里显示出来。

为了区分这三种 action，可能在 action 里添加一个专门的 `status` 字段作为标记位：

```js
{ type: 'FETCH_POSTS' }
{ type: 'FETCH_POSTS', status: 'error', error: 'Oops' }
{ type: 'FETCH_POSTS', status: 'success', response: { ... } }
```

又或者为它们定义不同的 type：

```js
{ type: 'FETCH_POSTS_REQUEST' }
{ type: 'FETCH_POSTS_FAILURE', error: 'Oops' }
{ type: 'FETCH_POSTS_SUCCESS', response: { ... } }
```

究竟使用带有标记位的同一个 action，还是多个 action type 呢，完全取决于你。这应该是你的团队共同达成的约定。使用多个 type 会降低犯错误的机率，但是如果你使用像 [redux-actions](https://github.com/acdlite/redux-actions) 这类的辅助库来生成 action 创建函数和 reducer 的话，这就完全不是问题了。

无论使用哪种约定，一定要在整个应用中保持统一。  
在本教程中，我们将使用不同的 type 来做。

## 同步 Action 创建函数（Action Creator）

下面先定义几个同步的 action 类型 和 action 创建函数。比如，用户可以选择要显示的 subreddit：

#### `actions.js`

```js
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'

export function selectSubreddit(subreddit) {
  return {
    type: SELECT_SUBREDDIT,
    subreddit
  }
}
```

也可以按 "刷新" 按钮来更新它：

```js
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'

export function invalidatesubreddit(subreddit) {
  return {
    type: INVALIDATE_SUBREDDIT,
    subreddit
  }
}
```

这些是用户操作来控制的 action。也有另外一类 action，是由网络请求来控制。后面会介绍如何使用它们，现在，我们只是来定义它们。

当需要获取指定 subreddit 的帖子的时候，需要 dispatch `REQUEST_POSTS` action：

```js
export const REQUEST_POSTS = 'REQUEST_POSTS'

export function requestPosts(subreddit) {
  return {
    type: REQUEST_POSTS,
    subreddit
  }
}
```

把 `REQUEST_POSTS` 和 `SELECT_SUBREDDIT` 或 `INVALIDATE_SUBREDDIT` 分开很重要。虽然它们的发生有先后顺序，但随着应用变得复杂，有些用户操作（比如，预加载最流行的 subreddit，或者一段时间后自动刷新过期数据）后需要马上请求数据。路由变化时也可能需要请求数据，所以一开始如果把请求数据和特定的 UI 事件耦合到一起是不明智的。

最后，当收到请求响应时，我们会 dispatch `RECEIVE_POSTS`：

```js
export const RECEIVE_POSTS = 'RECEIVE_POSTS'

export function receivePosts(subreddit, json) {
  return {
    type: RECEIVE_POSTS,
    subreddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  }
}
```

以上就是现在需要知道的所有内容。稍后会介绍如何把 dispatch action 与网络请求结合起来。

>##### 错误处理须知

>在实际应用中，网络请求失败时也需要 dispatch action。虽然在本教程中我们并不做错误处理，但是这个 [真实场景的案例](../introduction/Examples.html#real-world) 会演示一种实现方案。

## 设计 state 结构

就像在基础教程中，在功能开发前你需要 [设计应用的 state 结构](../basics/Reducers.md#designing-the-state-shape)。在写异步代码的时候，需要考虑更多的 state，所以我们要仔细考虑一下。

这部分内容通常让初学者感到迷惑，因为选择哪些信息才能清晰地描述异步应用的 state 并不直观，还有怎么用一个树来把这些信息组织起来。

我们以最通用的案例来打头：列表。Web 应用经常需要展示一些内容的列表。比如，帖子的列表，朋友的列表。首先要明确应用要显示哪些列表。然后把它们分开储存在 state 中，这样你才能对它们分别做缓存并且在需要的时候再次请求更新数据。

"Reddit 头条" 应用会长这个样子：

```js
{
  selectedsubreddit: 'frontend',
  postsBySubreddit: {
    frontend: {
      isFetching: true,
      didInvalidate: false,
      items: []
    },
    reactjs: {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: 1439478405547,
      items: [
        {
          id: 42,
          title: 'Confusion about Flux and Relay'
        },
        {
          id: 500,
          title: 'Creating a Simple Application Using React JS and Flux Architecture'
        }
      ]
    }
  }
}
```

下面列出几个要点：

* 分开存储 subreddit 信息，是为了缓存所有 subreddit。当用户来回切换 subreddit 时，可以立即更新，同时在不需要的时候可以不请求数据。不要担心把所有帖子放到内存中（会浪费内存）：除非你需要处理成千上万条帖子，同时用户还很少关闭标签页，否则你不需要做任何清理。

* 每个帖子的列表都需要使用 `isFetching` 来显示进度条，`didInvalidate` 来标记数据是否过期，`lastUpdated` 来存放数据最后更新时间，还有 `items` 存放列表信息本身。在实际应用中，你还需要存放 `fetchedPageCount` 和 `nextPageUrl` 这样分页相关的 state。

>##### 嵌套内容须知

>在这个示例中，接收到的列表和分页信息是存在一起的。但是，这种做法并不适用于有互相引用的嵌套内容的场景，或者用户可以编辑列表的场景。想像一下用户需要编辑一个接收到的帖子，但这个帖子在 state tree 的多个位置重复出现。这会让开发变得非常困难。

>如果你有嵌套内容，或者用户可以编辑接收到的内容，你需要把它们分开存放在 state 中，就像数据库中一样。在分页信息中，只使用它们的 ID 来引用。这可以让你始终保持数据更新。[真实场景的案例](../introduction/Examples.html#real-world) 中演示了这种做法，结合 [normalizr](https://github.com/gaearon/normalizr) 来把嵌套的 API 响应数据范式化，最终的 state 看起来是这样：

>```js
> {
>   selectedsubreddit: 'frontend',
>   entities: {
>     users: {
>       2: {
>         id: 2,
>         name: 'Andrew'
>       }
>     },
>     posts: {
>       42: {
>         id: 42,
>         title: 'Confusion about Flux and Relay',
>         author: 2
>       },
>       100: {
>         id: 100,
>         title: 'Creating a Simple Application Using React JS and Flux Architecture',
>         author: 2
>       }
>     }
>   },
>   postsBySubreddit: {
>     frontend: {
>       isFetching: true,
>       didInvalidate: false,
>       items: []
>     },
>     reactjs: {
>       isFetching: false,
>       didInvalidate: false,
>       lastUpdated: 1439478405547,
>       items: [ 42, 100 ]
>     }
>   }
> }
>```

>在本教程中，我们不会对内容进行范式化，但是在一个复杂些的应用中你可能需要使用。

## 处理 Action

在讲 dispatch action 与网络请求结合使用细节前，我们为上面定义的 action 开发一些 reducer。

>##### Reducer 组合须知

>这里，我们假设你已经学习过 [`combineReducers()`](../api/combineReducers.md) 并理解 reducer 组合，还有 [基础章节](../basics/README.md) 中的 [拆分 Reducer](../basics/Reducers.md#splitting-reducers)。如果还没有，请[先学习](../basics/Reducers.md#splitting-reducers)。

#### `reducers.js`

```js
import { combineReducers } from 'redux'
import {
  SELECT_SUBREDDIT, INVALIDATE_SUBREDDIT,
  REQUEST_POSTS, RECEIVE_POSTS
} from '../actions'

function selectedsubreddit(state = 'reactjs', action) {
  switch (action.type) {
    case SELECT_SUBREDDIT:
      return action.subreddit
    default:
      return state
  }
}

function posts(state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) {
  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
      return Object.assign({}, state, {
        didInvalidate: true
      })
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_POSTS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.posts,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

function postsBySubreddit(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        [action.subreddit]: posts(state[action.subreddit], action)
      })
    default:
      return state
  }
}

const rootReducer = combineReducers({
  postsBySubreddit,
  selectedsubreddit
})

export default rootReducer
```

上面代码有两个有趣的点：

* 使用 ES6 计算属性语法，使用 `Object.assign()` 来简洁高效地更新 `state[action.subreddit]`。这个：

  ```js
  return Object.assign({}, state, {
    [action.subreddit]: posts(state[action.subreddit], action)
  })
  ```
  与下面代码等价：

  ```js
  let nextState = {}
  nextState[action.subreddit] = posts(state[action.subreddit], action)
  return Object.assign({}, state, nextState)
  ```

* 我们提取出 `posts(state, action)` 来管理指定帖子列表的 state。这仅仅使用 [reducer 组合](../basics/Reducers.md#splitting-reducers)而已！我们还可以借此机会把 reducer 分拆成更小的 reducer，这种情况下，我们把对象内列表的更新代理到了 `posts` reducer 上。在[真实场景的案例](../introduction/Examples.html#real-world)中甚至更进一步，里面介绍了如何做一个 reducer 工厂来生成参数化的分页 reducer。

记住 reducer 只是函数而已，所以你可以尽情使用函数组合和高阶函数这些特性。

## 异步 action 创建函数

最后，如何把[之前定义](#synchronous-action-creators)的同步 action 创建函数和 网络请求结合起来呢？标准的做法是使用 [Redux Thunk middleware](https://github.com/gaearon/redux-thunk)。要引入 `redux-thunk` 这个专门的库才能使用。我们[后面](Middleware.md)会介绍 middleware 大体上是如何工作的；目前，你只需要知道一个要点：通过使用指定的 middleware，action 创建函数除了返回 action 对象外还可以返回函数。这时，这个 action 创建函数就成为了 [thunk](https://en.wikipedia.org/wiki/Thunk)。

当 action 创建函数返回函数时，这个函数会被 Redux Thunk middleware 执行。这个函数并不需要保持纯净；它还可以带有副作用，包括执行异步 API 请求。这个函数还可以 dispatch action，就像 dispatch 前面定义的同步 action 一样。

我们仍可以在 `actions.js` 里定义这些特殊的 thunk action 创建函数。

#### `actions.js`

```js
import fetch from 'isomorphic-fetch'

export const REQUEST_POSTS = 'REQUEST_POSTS'
function requestPosts(subreddit) {
  return {
    type: REQUEST_POSTS,
    subreddit
  }
}

export const RECEIVE_POSTS = 'RECEIVE_POSTS'
function receivePosts(subreddit, json) {
  return {
    type: RECEIVE_POSTS,
    subreddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  }
}

// 来看一下我们写的第一个 thunk action 创建函数！
// 虽然内部操作不同，你可以像其它 action 创建函数 一样使用它：
// store.dispatch(fetchPosts('reactjs'))

export function fetchPosts(subreddit) {

  // Thunk middleware 知道如何处理函数。
  // 这里把 dispatch 方法通过参数的形式传给函数，
  // 以此来让它自己也能 dispatch action。

  return function (dispatch) {

    // 首次 dispatch：更新应用的 state 来通知
    // API 请求发起了。

    dispatch(requestPosts(subreddit))

    // thunk middleware 调用的函数可以有返回值，
    // 它会被当作 dispatch 方法的返回值传递。

    // 这个案例中，我们返回一个等待处理的 promise。
    // 这并不是 redux middleware 所必须的，但这对于我们而言很方便。

    return fetch(`http://www.subreddit.com/r/${subreddit}.json`)
      .then(response => response.json())
      .then(json =>

        // 可以多次 dispatch！
        // 这里，使用 API 请求结果来更新应用的 state。

        dispatch(receivePosts(subreddit, json))
      )

      // 在实际应用中，还需要
      // 捕获网络请求的异常。
  }
}
```

>##### `fetch` 使用须知

>本示例使用了 [`fetch` API](https://developer.mozilla.org/en/docs/Web/API/Fetch_API)。它是替代 `XMLHttpRequest` 用来发送网络请求的非常新的 API。由于目前大多数浏览器原生还不支持它，建议你使用 [`isomorphic-fetch`](https://github.com/matthew-andrews/isomorphic-fetch) 库：

>```js
// 每次使用 `fetch` 前都这样调用一下
>import fetch from 'isomorphic-fetch'
>```

>在底层，它在浏览器端使用 [`whatwg-fetch` polyfill](https://github.com/github/fetch)，在服务器端使用 [`node-fetch`](https://github.com/bitinn/node-fetch)，所以如果当你把应用改成[同构](https://medium.com/@mjackson/universal-javascript-4761051b7ae9)时，并不需要改变 API 请求。

>注意，`fetch` polyfill 假设你已经使用了 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 的 polyfill。确保你使用 Promise polyfill 的一个最简单的办法是在所有应用代码前启用 Babel 的 ES6 polyfill：

>```js
>// 在应用中其它任何代码执行前调用一次
>import 'babel-polyfill'
>```

我们是如何在 dispatch 机制中引入 Redux Thunk middleware 的呢？我们使用了 [`applyMiddleware()`](../api/applyMiddleware.md)，如下：

#### `index.js`

```js
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import { selectSubreddit, fetchPosts } from './actions'
import rootReducer from './reducers'

const loggerMiddleware = createLogger()

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware, // 允许我们 dispatch() 函数
    loggerMiddleware // 一个很便捷的 middleware，用来打印 action 日志
  )
)

store.dispatch(selectSubreddit('reactjs'))
store.dispatch(fetchPosts('reactjs')).then(() =>
  console.log(store.getState())
)
```

thunk 的一个优点是它的结果可以再次被 dispatch：

#### `actions.js`

```js
import fetch from 'isomorphic-fetch'

export const REQUEST_POSTS = 'REQUEST_POSTS'
function requestPosts(subreddit) {
  return {
    type: REQUEST_POSTS,
    subreddit
  }
}

export const RECEIVE_POSTS = 'RECEIVE_POSTS'
function receivePosts(subreddit, json) {
  return {
    type: RECEIVE_POSTS,
    subreddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  }
}

function fetchPosts(subreddit) {
  return dispatch => {
    dispatch(requestPosts(subreddit))
    return fetch(`http://www.reddit.com/r/${subreddit}.json`)
      .then(response => response.json())
      .then(json => dispatch(receivePosts(subreddit, json)))
  }
}

function shouldFetchPosts(state, subreddit) {
  const posts = state.postsBySubreddit[subreddit]
  if (!posts) {
    return true
  } else if (posts.isFetching) {
    return false
  } else {
    return posts.didInvalidate
  }
}

export function fetchPostsIfNeeded(subreddit) {

  // 注意这个函数也接收了 getState() 方法
  // 它让你选择接下来 dispatch 什么。

  // 当缓存的值是可用时，
  // 减少网络请求很有用。

  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), subreddit)) {
      // 在 thunk 里 dispatch 另一个 thunk！
      return dispatch(fetchPosts(subreddit))
    } else {
      // 告诉调用代码不需要再等待。
      return Promise.resolve()
    }
  }
}
```

这可以让我们逐步开发复杂的异步控制流，同时保持代码整洁如初：

#### `index.js`

```js
store.dispatch(fetchPostsIfNeeded('reactjs')).then(() =>
  console.log(store.getState())
)
```

>##### 服务端渲染须知

>异步 action 创建函数对于做服务端渲染非常方便。你可以创建一个 store，dispatch 一个异步 action 创建函数，这个 action 创建函数又 dispatch 另一个异步 action 创建函数来为应用的一整块请求数据，同时在 Promise 完成和结束时才 render 界面。然后在 render 前，store 里就已经存在了需要用的 state。

[Thunk middleware](https://github.com/gaearon/redux-thunk) 并不是 Redux 处理异步 action 的唯一方式：
* 你可以使用 [redux-promise](https://github.com/acdlite/redux-promise) 或者 [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware) 来 dispatch Promise 替代函数。
* 你可以使用 [redux-observable](https://github.com/redux-observable/redux-observable) 来 dispatch Observable。
* 你可以使用 [redux-saga](https://github.com/yelouafi/redux-saga/) 中间件来创建更加复杂的异步 action。
* 你甚至可以写一个自定义的 middleware 来描述 API 请求，就像这个[真实场景的案例](../introduction/Examples.html#real-world)中的做法一样。

你也可以先尝试一些不同做法，选择喜欢的，并使用下去，不论有没有使用到 middleware 都行。

## 连接到 UI

Dispatch 同步 action 与异步 action 间并没有区别，所以就不展开讨论细节了。参照 [搭配 React](../basics/UsageWithReact.md) 获得 React 组件中使用 Redux 的介绍。参照 [示例：Reddit API](ExampleRedditAPI.md) 来获取本例的完整代码。

## 下一步

阅读 [异步数据流](AsyncFlow.md) 来整理一下异步 action 是如何适用于 Redux 数据流的。
