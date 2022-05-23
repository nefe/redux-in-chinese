---
id: part-5-async-logic
title: 'Redux 循序渐进，第五节：异步逻辑与数据请求'
sidebar_label: '异步逻辑与数据请求'
hide_title: false
description: 'The official Redux Essentials tutorial: learn how async logic works in Redux apps'
---

import { DetailedExplanation } from '../../components/DetailedExplanation'

# 第五节：异步逻辑与数据请求

:::tip 你将学到

- 如何使用 Redux “thunk” 中间件处理异步逻辑
- 处理异步请求状态的开发模式
- 如何使用 Redux Toolkit `createAsyncThunk` API 来简化异步调用

:::

:::info 必备能力

- 熟悉使用 AJAX 请求从服务器获取和更新数据

:::

## 简介

在 [第四节：使用 Redux 数据](./part-4-using-data.md) 中，我们看到了如何使用 React 组件内部 Redux store 中的多条数据，在它们 dispatch 之前自定义 action 对象的内容，并在我们的 reducer 中处理更复杂的更新逻辑。

到目前为止，我们处理过的所有数据都直接存在于我们的 React 客户端应用程序中。然而，大多数真实的应用程序需要使用来自服务器的数据，通过调用 HTTP API 来获取和保存项目。

在本节中，我们将转换我们的社交媒体应用程序以从 API 获取帖子和用户数据，并通过将它们保存到 API 来添加新帖子。

### REST API 和客户端示例

为了使示例项目保持独立但切合实际，初始项目设置已经为我们的数据包含了一个伪造的内存 REST API（使用 [Mock Service Worker 模拟 API 工具](https://mswjs.io/) 进行配置）。API 使用 `/fakeApi` 作为端点的基本 URL，并支持典型的 `GET/POST/PUT/DELETE` HTTP 方法用于 `/fakeApi/posts`、`/fakeApi/users` 和 `fakeApi/notifications `. 它在`src/api/server.js` 中定义。

该项目还包括一个小的 HTTP API 客户端对象，它公开 `client.get()` 和 `client.post()` 方法，类似于像 `axios` 这样的流行 HTTP 库。它在`src/api/client.js` 中定义。

在本节中，我们将使用 `client` 对象对我们的内存中假 REST API 进行 HTTP 调用。

此外，模拟服务器已设置为在每次加载页面时重复使用相同的随机种子，以便生成相同的假用户和假帖子列表。如果您想重置它，请删除浏览器 Local Storage 中的 `randomTimestampSeed` 值并重新加载页面，或者您可以通过编辑 `src/api/server.js` 并将 `useSeededRNG` 设置为 `false` 来关闭它.

:::info 说明

提醒一下，代码示例侧重于每个部分的关键概念和更改。请参阅 CodeSandbox 项目和 [项目 repo 中的`tutorial-steps` 分支](https://github.com/reduxjs/redux-essentials-example-app/tree/tutorial-steps) 以了解应用程序中的完整更改。
:::

## Thunks 与异步逻辑

### 使用 Middleware 中间件处理异步逻辑

就其本身而言，Redux store 对异步逻辑一无所知。它只知道如何同步 dispatch action，通过调用 root reducer 函数更新状态，并通知 UI 某些事情发生了变化。任何异步都必须发生在 store 之外。

但是，如果您希望通过调度或检查当前 store 状态来使异步逻辑与 store 交互，该怎么办？ 这就是 [Redux 中间件](../fundamentals/part-4-store.md#middleware) 的用武之地。它们扩展了 store，并允许您：

- dispatch action 时执行额外的逻辑（例如打印 action 的日志和状态）
- 暂停、修改、延迟、替换或停止 dispatch 的 action
- 编写可以访问 `dispatch` 和 `getState` 的额外代码
- 教 `dispatch` 如何接受除普通 action 对象之外的其他值，例如函数和 promise，通过拦截它们并 dispatch 实际 action 对象来代替

[使用中间件的最常见原因是允许不同类型的异步逻辑与 store 交互](../../faq/Actions.md#how-can-i-represent-side-effects-such-as-ajax-calls-why-do-we-need-things-like-action-creators-thunks-and-middleware-to-do-async-behavior)。这允许您编写可以 dispatch action 和检查 store 状态的代码，同时使该逻辑与您的 UI 分开。

Redux 有多种异步中间件，每一种都允许您使用不同的语法编写逻辑。最常见的异步中间件是 [`redux-thunk`](https://github.com/reduxjs/redux-thunk)，它可以让你编写可能直接包含异步逻辑的普通函数。Redux Toolkit 的 `configureStore` 功能[默认自动设置 thunk 中间件](https://redux-toolkit.js.org/api/getDefaultMiddleware#included-default-middleware)，[我们推荐使用 thunk 作为 Redux 开发异步逻辑的标准方式](../../style-guide/style-guide.md#use-thunks-for-async-logic)。

早些时候，我们看到了[Redux 的同步数据流是什么样子](part-1-overview-concepts.md#redux-application-data-flow)。当我们引入异步逻辑时，我们添加了一个额外的步骤，中间件可以运行像 AJAX 请求这样的逻辑，然后 dispatch action。这使得异步数据流看起来像这样：

![Redux 异步数据流](/img/tutorials/essentials/ReduxAsyncDataFlowDiagram.gif)

### Thunk 函数

将 thunk 中间件添加到 Redux store 后，它允许您将 _thunk 函数_ 直接传递给 `store.dispatch`。调用 thunk 函数时总是将 `(dispatch, getState)` 作为它的参数，你可以根据需要在 thunk 中使用它们。

Thunks 通常还可以使用 action creator 再次 dispatch 普通的 action，比如 `dispatch(increment())`：

```js
const store = configureStore({ reducer: counterReducer })

const exampleThunkFunction = (dispatch, getState) => {
  const stateBefore = getState()
  console.log(`Counter before: ${stateBefore.counter}`)
  dispatch(increment())
  const stateAfter = getState()
  console.log(`Counter after: ${stateAfter.counter}`)
}

store.dispatch(exampleThunkFunction)
```

为了与 dispatch 普通 action 对象保持一致，我们通常将它们写为 _thunk action creators_，它返回 thunk 函数。这些 action creator 可以接受可以在 thunk 中使用的参数。

```js
const logAndAdd = amount => {
  return (dispatch, getState) => {
    const stateBefore = getState()
    console.log(`Counter before: ${stateBefore.counter}`)
    dispatch(incrementByAmount(amount))
    const stateAfter = getState()
    console.log(`Counter after: ${stateAfter.counter}`)
  }
}

store.dispatch(logAndAdd(5))
```

Thunk 通常写在“切片”文件中。`createSlice` 本身对定义 thunk 没有任何特殊支持，因此您应该将它们作为单独的函数编写在同一个切片文件中。这样，他们就可以访问该切片的普通 action creator，并且很容易找到 thunk 的位置。

:::info

“thunk”这个词是一个编程术语，意思是 ["一段做延迟工作的代码"](https://en.wikipedia.org/wiki/Thunk). 如何使用 thunk 的详细信息，请参阅 thunk 使用指南页面:

- [Using Redux: Writing Logic with Thunks](../../usage/writing-logic-thunks)

以及这些文章:

- [What the heck is a thunk?](https://daveceddia.com/what-is-a-thunk/)
- [Thunks in Redux: the basics](https://medium.com/fullstack-academy/thunks-in-redux-the-basics-85e538a3fe60)

:::

### 编写异步 Thunks

Thunk 内部可能有异步逻辑，例如 `setTimeout`、`Promise` 和 `async/await`。这使它们成为将 AJAX 发起 API 请求的好地方。

Redux 的数据请求逻辑通常遵循以下可预测的模式：

- 在请求之前 dispatch 请求“开始” 的 action，以指示请求正在进行中。这可用于跟踪加载状态以允许跳过重复请求或在 UI 中显示加载指示器。
- 发出异步请求
- 根据请求结果，异步逻辑 dispatch 包含结果数据的 “成功” action 或包含错误详细信息的 “失败” action。在这两种情况下，reducer 逻辑都会清除加载状态，并且要么展示成功案例的结果数据，要么保存错误值并在需要的地方展示。

这些步骤不是 _必需的_，而是常用的。（如果你只关心一个成功的结果，你可以在请求完成时发送一个 “成功” action ，并跳过“开始”和“失败” action 。）

Redux Toolkit 提供了一个 `createAsyncThunk` API 来实现这些 action 的创建和 dispatch，我们很快就会看看如何使用它。

<DetailedExplanation title="细节说明：Dispatching Request Status Actions in Thunks">

如果我们手动编写一个典型的 async thunk 的代码，它可能看起来像这样：

```js
const getRepoDetailsStarted = () => ({
  type: 'repoDetails/fetchStarted'
})
const getRepoDetailsSuccess = repoDetails => ({
  type: 'repoDetails/fetchSucceeded',
  payload: repoDetails
})
const getRepoDetailsFailed = error => ({
  type: 'repoDetails/fetchFailed',
  error
})
const fetchIssuesCount = (org, repo) => async dispatch => {
  dispatch(getRepoDetailsStarted())
  try {
    const repoDetails = await getRepoDetails(org, repo)
    dispatch(getRepoDetailsSuccess(repoDetails))
  } catch (err) {
    dispatch(getRepoDetailsFailed(err.toString()))
  }
}
```

但是，使用这种方法编写代码很乏味。每个单独的请求类型都需要重复类似的实现：

- 需要为三种不同的情况定义独特的 action 类型
- 每种 action 类型通常都有相应的 action creator 功能
- 必须编写一个 thunk 以正确的顺序发送正确的 action

`createAsyncThunk` 实现了这套模式：通过生成 action type 和 action creator 并生成一个自动 dispatch 这些 action 的 thunk。您提供一个回调函数来进行异步调用，并把结果数据返回成 Promise。

</DetailedExplanation>

<br />

:::tip

Redux Toolkit 有一个新的 [**RTK Query data fetching API**](https://redux-toolkit.js.org/rtk-query/overview)。 RTK Query 是专门为 Redux 应用程序构建的数据获取和缓存解决方案，**可以不用编写任何 thunk 或 reducer 来处理数据获取**。 我们鼓励您尝试一下，看看它是否有助于简化您自己的应用程序中的数据获取逻辑！

我们将从 [第 7 部分：RTK query 基础](./part-7-rtk-query-basics.md) 开始介绍如何使用 RTK Query。

## 加载帖子

到目前为止，我们的 `postsSlice` 已经使用了一些硬编码的样本数据作为其初始状态。我们将把它改为从一个空的帖子数组开始，然后从服务器获取一个帖子列表。

为了做到这一点，我们将不得不更改 `postsSlice` 中的状态结构，以便我们可以跟踪 API 请求的当前状态。

### 提取帖子 selectors

现在，`postsSlice` 状态是一个单一的 `posts` 数组。我们需要将其更改为具有 `posts` 数组以及加载状态字段的对象。

同时，像 `<PostsList>` 这样的 UI 组件正在尝试从 `useSelector` 钩子中的 `state.posts` 中读取帖子，假设该字段是一个数组。我们还需要更改这些位置以匹配新数据。

如果我们不必在每次对 reducer 中的数据格式进行更改时都继续重写我们的组件，那就太好了。避免这种情况的一种方法是在切片文件中定义可重用的 selector 函数，并让组件使用这些 selector 来提取它们需要的数据，而不是在每个组件中重复 selector 逻辑。这样，如果我们再次更改状态结构，我们只需要更新切片文件中的代码。

`<PostsList>` 组件需要读取所有帖子的列表，而 `<SinglePostPage>` 和 `<EditPostForm>` 组件需要通过其 ID 查找单个帖子。让我们从 `postsSlice.js` 中导出两个小的 selector 函数来涵盖这些情况：

```js title="features/posts/postsSlice.js"
const postsSlice = createSlice(/* omit slice code*/)

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

// highlight-start
export const selectAllPosts = state => state.posts

export const selectPostById = (state, postId) =>
  state.posts.find(post => post.id === postId)
//highlight-end
```

请注意，这些选择器函数的 `state` 参数是根 Redux 状态对象，就像我们直接在 `useSelector` 内部编写的内联匿名选择器一样。

然后我们可以在组件中使用它们：

```js title="features/posts/PostsList.js"
// omit imports
// highlight-next-line
import { selectAllPosts } from './postsSlice'

export const PostsList = () => {
  // highlight-next-line
  const posts = useSelector(selectAllPosts)
  // omit component contents
}
```

```js title="features/posts/SinglePostPage.js"
// omit imports
//highlight-next-line
import { selectPostById } from './postsSlice'

export const SinglePostPage = ({ match }) => {
  const { postId } = match.params

  // highlight-next-line
  const post = useSelector(state => selectPostById(state, postId))
  // omit component logic
}
```

```js title="features/posts/EditPostForm.js"
// omit imports
//highlight-next-line
import { postUpdated, selectPostById } from './postsSlice'

export const EditPostForm = ({ match }) => {
  const { postId } = match.params

  // highlight-next-line
  const post = useSelector(state => selectPostById(state, postId))
  // omit component logic
}
```

通过编写可重用的选择器来封装数据查找通常是一个好主意。您还可以创建有助于提高性能的“记忆化 memoized” 选择器，我们将在本教程的后面部分进行介绍。

但是，就像任何抽象一样，这不是你 _所有_ 时间、任何地方都应该做的事情。编写选择器意味着需要理解和维护更多的代码。**不要觉得您需要为状态的每个字段都编写选择器**。建议开始时不使用任何选择器，稍后当您发现自己在应用程序代码的许多部分中查找相同值时添加一些选择器。

### 请求过程中的加载状态

当我们进行 API 请求时，我们可以将其进度视为一个小型状态机，它处于下面四种可能的状态之一：

- 请求尚未开始
- 请求正在进行中
- 请求成功，我们现在有了我们需要的数据
- 请求失败，可能有错误信息

我们 _可以_ 使用一些布尔值来跟踪该信息，例如 `isLoading: true`，但最好将这些状态作为单个枚举值。好的模式是使用如下所示的状态部分：

```ts
{
  // 多个可能的状态枚举值
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null
}
```

这些字段将与 store 的任何实际数据一起存在。这些特定的字符串状态名称不是必需的 - 如果您愿意，可以随意使用其他名称，例如`“pending”` 代替 `“loading”`，或 `“complete”` 代替 `“succeeded”`。

我们可以使用这些信息来决定在请求进行时在 UI 中显示什么，并在我们的 reducer 中添加逻辑以防止诸如两次加载数据之类的情况。

让我们更新我们的 `postsSlice` 以使用此模式来跟踪“获取帖子”请求的加载状态。我们将把我们的状态从一个单独的帖子数组切换到看起来像 `{posts, status, error}`。我们还将从初始状态中删除旧的示例帖子条目。作为此更改的一部分，我们还需要将 `state` 作为数组的任何使用更改为 `state.posts`，因为该数组现在更深一层：

```js title="features/posts/postsSlice.js"
import { createSlice, nanoid } from '@reduxjs/toolkit'

// highlight-start
const initialState = {
  posts: [],
  status: 'idle',
  error: null
}
//highlight-end

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action) {
        // highlight-next-line
        state.posts.push(action.payload)
      },
      prepare(title, content, userId) {
        // omit prepare logic
      }
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      // highlight-next-line
      const existingPost = state.posts.find(post => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      // highlight-next-line
      const existingPost = state.posts.find(post => post.id === id)
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    }
  }
})

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

// highlight-start
export const selectAllPosts = state => state.posts.posts

export const selectPostById = (state, postId) =>
  state.posts.posts.find(post => post.id === postId)
// highlight-end
```

是的，这 _确实_ 意味着我们现在有一个看起来像 `state.posts.posts` 的嵌套对象路径，这有点重复和愚蠢:) 我们 _可以_ 将嵌套数组名称更改为 `items` 或 `data` 或其他东西 如果我们想避免这种情况，但我们暂时保持原样。

### 使用 `createAsyncThunk` 请求数据

Redux Toolkit 的 `createAsyncThunk` API 生成 thunk，为您自动 dispatch 那些 "start/success/failure" action。

让我们从添加一个 thunk 开始，该 thunk 将进行 AJAX 调用以检索帖子列表。我们将从 `src/api` 文件夹中引入 `client` 工具库，并使用它向 `'/fakeApi/posts'` 发出请求。

```js title="features/posts/postsSlice"
// highlight-next-line
import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit'
// highlight-next-line
import { client } from '../../api/client'

const initialState = {
  posts: [],
  status: 'idle',
  error: null
}

// highlight-start
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.data
})
// highlight-end
```

`createAsyncThunk` 接收 2 个参数:

- 将用作生成的 action 类型的前缀的字符串
- 一个“payload creator”回调函数，它应该返回一个包含一些数据的 `Promise`，或者一个被拒绝的带有错误的 `Promise`

Payload creator 通常会进行某种 AJAX 调用，并且可以直接从 AJAX 调用返回 `Promise`，或者从 API 响应中提取一些数据并返回。我们通常使用 JS `async/await` 语法来编写它，这让我们可以编写使用 `Promise` 的函数，同时使用标准的 `try/catch` 逻辑而不是 `somePromise.then()` 链式调用。

在这种情况下，我们传入 `'posts/fetchPosts'` 作为 action 类型的前缀。我们的 payload 创建回调等待 API 调用返回响应。响应对象的格式为 `{data: []}`，我们希望我们 dispatch 的 Redux action 有一个 payload，也就是帖子列表的数组。所以，我们提取 `response.data`，并从回调中返回它。

当调用 `dispatch(fetchPosts())` 的时候，`fetchPosts` 这个 thunk 会首先 dispatch 一个 action 类型为`'posts/fetchPosts/pending'`：

![`createAsyncThunk`: posts pending action](/img/tutorials/essentials/devtools-posts-pending.png)

我们可以在我们的 reducer 中监听这个 action 并将请求状态标记为 “loading 正在加载”。

一旦 `Promise` 成功，`fetchPosts` thunk 会接受我们从回调中返回的 `response.data` 数组，并 dispatch 一个 action，action 的 payload 为 posts 数组，action 的 类型为 `'posts/fetchPosts/fulfilled'`。

![`createAsyncThunk`: posts pending action](/img/tutorials/essentials/devtools-posts-fulfilled.png)

#### 在组件中 dispatch thunk

现在，让我们更新我们的 `<PostsList>` 组件，来为我们自动请求这些数据。

我们将把 `fetchPosts` thunk 引入到组件中。像我们所有的其他 action creator 一样，我们必须 dispatch 它，所以我们还需要添加 `useDispatch` 钩子。由于我们想在 `<PostsList>` 挂载时获取这些数据，我们需要引入 React `useEffect` 钩子：

```js title="features/posts/PostsList.js"
// highlight-start
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// omit other imports
// highlight-end
//highlight-next-line
import { selectAllPosts, fetchPosts } from './postsSlice'

export const PostsList = () => {
  // highlight-next-line
  const dispatch = useDispatch()
  const posts = useSelector(selectAllPosts)

  // highlight-start
  const postStatus = useSelector(state => state.posts.status)

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [postStatus, dispatch])
  // highlight-end

  // omit rendering logic
}
```

重要的是，我们只尝试获取一次帖子列表。如果我们每次在 `<PostsList>` 组件渲染时都这样做，或者因为我们在视图之间切换而重新创建，我们最终可能会多次获取帖子。我们可以使用 `posts.status` 枚举来帮助决定我们是否需要真正开始获取，方法是将它注入到组件中，并且只有在状态为“idle 空闲”时才开始获取。

### Reducer 与 Loading Action

接下来，我们需要在我们的 reducer 中处理这两个 action。这需要更深入地了解我们一直在使用的 `createSlice` API。

我们已经看到 `createSlice` 将为 `reducers` 字段中定义的每个 reducer 函数生成一个 action creator，并且生成的 action type 中包含了切片的名称，例如：

```js
console.log(
  postUpdated({ id: '123', title: 'First Post', content: 'Some text here' })
)
/*
{
  type: 'posts/postUpdated',
  payload: {
    id: '123',
    title: 'First Post',
    content: 'Some text here'
  }
}
*/
```

但是，有时切片的 reducer 需要响应 _没有_ 定义到该切片的 `reducers` 字段中的 action。这个时候就需要使用 slice 中的 `extraReducers` 字段。

`extraReducers` 选项是一个接收名为 `builder` 的参数的函数。 `builder` 对象提供了一些方法，让我们可以定义额外的 case reducer，这些 reducer 将响应在 slice 之外定义的 action。 我们将使用 `builder.addCase(actionCreator, reducer)` 来处理我们异步 thunk dispatch 的每个 action。

<DetailedExplanation title="细节说明：Adding Extra Reducers to Slices">

`extraReducers` 中的 `builder` 对象提供了一些方法，让我们可以定义额外的 case reducer，这些 reducer 将响应在 slice 之外定义的 action：

- `builder.addCase(actionCreator, reducer)`：定义一个 case reducer，它响应 RTK action creator 生成或者普通字符串定义的 action。
- `builder.addMatcher(matcher, reducer)`：定义一个 case reducer，它可以响应任何 `matcher` 函数返回 `true` 的 action.
- `builder.addDefaultCase(reducer)`：定义一个 case reducer，如果没有其他 case reducer 被执行，这个 action 就会运行。

您可以将这些链接在一起，例如`builder.addCase().addCase().addMatcher().addDefaultCase()`。 如果多个匹配器匹配操作，它们将按照定义的顺序运行。

```js
import { increment } from '../features/counter/counterSlice'

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // slice-specific reducers here
  },
  // highlight-start
  extraReducers: builder => {
    builder
      .addCase('counter/decrement', (state, action) => {})
      .addCase(increment, (state, action) => {})
  }
  // highlight-end
})
```

如果您使用的是 TypeScript，则应该使用 `extraReducers` 的构建器回调（builder callback）形式。

或者，`extraReducers` 也可以是一个对象。 **这是一种遗留语法 - 它仍然受支持，但我们建议使用“ 构建器回调（builder callback）”语法，因为它与 TypeScript 一起使用效果更好。**

`extraReducers` 对象中的键应该是 Redux action 类型字符串，例如 `'counter/increment'`，手动输入即可。如果类型名称包含 `/` 这样的字符串，也必须写出来。

```js
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // slice-specific reducers here
  },
  extraReducers: {
    'counter/increment': (state, action) => {
      // 更新帖子内容 slice 的 reducer 逻辑
    }
  }
})
```

更好的方法是，调用 `actionCreator.toString()`，它会返回 Redux Toolkit 生成的 action 类型的字符串。这样就可以把它作为 ES6 对象字面量来传递，action 类型字符串作为对象的键：

```js
import { increment } from '../features/counter/counterSlice'
const object = {
  [increment]: () => {}
}
console.log(object)
// { "counter/increment": Function}
```

把它应用到 `extraReducers` 中就是：

```js
import { increment } from '../features/counter/counterSlice'

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // slice-specific reducers here
  },
  extraReducers: {
    // highlight-next-line
    [increment]: (state, action) => {
      // 更新帖子内容 slice 的 reducer 逻辑
    }
  }
})
```

不幸的是，TypeScript 无法进行类型推断，因此您必须在此处使用 `increment.type` 来传递类型字符串。 它也不会正确推断 reducer 内的 `action` 类型。

</DetailedExplanation>

在这个例子中，我们需要监听我们 `fetchPosts` thunk dispatch 的 "pending" 和 "fulfilled" action 类型。这些 action creator 附加到我们实际的 `fetchPost` 函数中，我们可以将它们传递给 `extraReducers` 来监听这些 action：

```js
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.data
})

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // omit existing reducers here
  },
  // highlight-start
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Add any fetched posts to the array
        state.posts = state.posts.concat(action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
  // highlight-end
})
```

我们将根据返回的 `Promise` 处理可以由 thunk dispatch 的三种 action 类型：

- 当请求开始时，我们将 `status` 枚举设置为 `'loading'`
- 如果请求成功，我们将 `status` 标记为 `'succeeded'`，并将获取的帖子添加到 `state.posts`
- 如果请求失败，我们会将 `status` 标记为 `'failed'`，并将任何错误消息保存到状态中以便我们可以显示它

### 显示加载状态

我们的 `<PostsList>` 组件已经在检查存储在 Redux 中的帖子的任何更新，并在列表更改时重新渲染。 因此，如果我们刷新页面，我们应该会在屏幕上看到一组来自假 API 的随机帖子：

我们使用的假 API 会立即返回数据。 但是，真正的 API 调用可能需要一些时间才能返回响应。 在 UI 中显示某种“正在加载...”指示器通常是个好主意，这样用户就知道我们正在等待数据。

我们可以更新我们的 `<PostsList>` ，根据 `state.posts.status` 的值显示不同的 UI：加载中显示加载动画（spinner）, 失败显示错误消息，请求成功显示正常的帖子列表。 现在是将列表中的一项封装成 `<PostExcerpt>` 组件的好时机。

结果可能如下所示：

```jsx title="features/posts/PostsList.js"
// highlight-next-line
import { Spinner } from '../../components/Spinner'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import { selectAllPosts, fetchPosts } from './postsSlice'

// highlight-start
const PostExcerpt = ({ post }) => {
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}
// highlight-end

export const PostsList = () => {
  const dispatch = useDispatch()
  const posts = useSelector(selectAllPosts)

  const postStatus = useSelector(state => state.posts.status)
  // highlight-next-line
  const error = useSelector(state => state.posts.error)

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [postStatus, dispatch])

  // highlight-start
  let content

  if (postStatus === 'loading') {
    content = <Spinner text="Loading..." />
  } else if (postStatus === 'succeeded') {
    // Sort posts in reverse chronological order by datetime string
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))

    content = orderedPosts.map(post => (
      <PostExcerpt key={post.id} post={post} />
    ))
  } else if (postStatus === 'failed') {
    content = <div>{error}</div>
  }
  // highlight-end

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}
```

您可能会注意到 API 调用需要一段时间才能完成，并且加载动画（spinner）在屏幕上停留了几秒钟。 我们的模拟 API 服务器配置为向所有响应添加 2 秒延迟，专门用于帮助可视化记载动画（spinner）可见的时间。 如果你想改变这个行为，你可以打开`api/server.js`，并修改这一行：

```js title="api/server.js"
// Add an extra delay to all endpoints, so loading spinners show up.
const ARTIFICIAL_DELAY_MS = 2000
```

如果您希望 API 调用更快完成，请随时打开和关闭它。

## 加载用户数据

我们现在正在获取并显示我们的帖子列表。但是，如果我们查看这些帖子，就会发现一个问题：作者全部都是 “未知作者”：

![未知帖子作者](/img/tutorials/essentials/posts-unknownAuthor.png)

这是因为帖子条目是由假 API 服务器随机生成的，每次我们重新加载页面时，它也会随机生成一组假用户。我们需要更新用户切片的代码，以在应用程序启动时获取用户数据。

和上次一样，我们将创建另一个异步 thunk 来从 API 获取用户数据，然后在 `extraReducers` 切片字段中处理 `fulfilled` action。暂时先不考虑加载状态：

```js title="features/users/usersSlice.js"
// highlight-start
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../api/client'
// highlight-end

const initialState = []

// highlight-start
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get('/fakeApi/users')
  return response.data
})
// highlight-end

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  // highlight-start
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      return action.payload
    })
  }
  // highlight-end
})

export default usersSlice.reducer
```

我们只需要获取一次用户列表，我们希望在应用程序启动时就完成。我们可以在我们的 `index.js` 文件中做到这一点，并直接 dispatch `fetchUsers` thunk，因为我们在那里有 `store`：

```js title="index.js"
// omit imports

// highlight-next-line
import { fetchUsers } from './features/users/usersSlice'

import { worker } from './api/server'

// Start our mock API server
worker.start({ onUnhandledRequest: 'bypass' })

// highlight-next-line
store.dispatch(fetchUsers())

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
```

现在，每个帖子都应该再次显示用户名，并且我们还应该在 `<AddPostForm>` 的“作者”下拉列表中显示相同的用户列表。

## 添加新帖子

本节还有一个步骤。当我们从 `<AddPostForm>` 添加一个新帖子时，该帖子只会被添加到我们应用程序内的 Redux store 中。我们需要实际进行 API 调用，以在我们的假 API 服务器中创建新的帖子条目，以便“保存”它。（因为这是一个虚假的 API，如果我们重新加载页面，新帖子将不会持久，但如果我们有一个真正的后端服务器，下次我们重新加载时它将可用。）

### 使用 Thunk 发送数据

我们可以使用 `createAsyncThunk` 来帮助发送数据，而不仅仅是获取数据。我们将创建一个 thunk，它接受来自我们的 `<AddPostForm>` 的值作为参数，并对假 API 进行 HTTP POST 调用以保存数据。

在此过程中，我们将改变在 reducer 中使用新 post 对象的方式。目前，我们的 `postsSlice` 正在为 `postAdded` 的 `prepare` 回调中创建一个新的帖子对象，并为该帖子生成一个新的唯一 ID。在大多数将数据保存到服务器的应用程序中，服务器会负责生成唯一 ID 并填写任何额外的字段，并且通常会在其响应中返回完成的数据。因此，我们可以向服务器发送一个类似 `{ title, content, user: userId }` 的请求体，然后将它发回的完整 post 对象添加到我们的 `postsSlice` 状态中。

```js title="features/posts/postsSlice.js"
// highlight-start
export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  // The payload creator receives the partial `{title, content, user}` object
  async initialPost => {
    // We send the initial data to the fake API server
    const response = await client.post('/fakeApi/posts', initialPost)
    // The response includes the complete post object, including unique ID
    return response.data
  }
)
// highlight-end

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // The existing `postAdded` reducer and prepare callback were deleted
    reactionAdded(state, action) {}, // omit logic
    postUpdated(state, action) {} // omit logic
  },
  extraReducers(builder) {
    // omit posts loading reducers
    // highlight-start
    builder.addCase(addNewPost.fulfilled, (state, action) => {
      // We can directly add the new post object to our posts array
      state.posts.push(action.payload)
    })
    // highlight-end
  }
})
```

### 检查组件中的 Thunk 结果

最后，我们将更新 `<AddPostForm>` 以 dispatch `addNewPost` thunk 而不是旧的 `postAdded` action。由于这是对服务器的另一个 API 调用，因此需要一些时间并且 _可能_ 失败。`addNewPost()` thunk 会自动将它的 `pending/fulfilled/rejected` action dispatch 到 store 中。如果我们愿意，我们可以使用第二个加载枚举来跟踪 `postsSlice` 中的请求状态，但是对于这个例子，让我们将加载状态跟踪限制在组件上。

在等待请求时可以禁用“保存帖子”按钮，那么用户就不会意外地尝试保存帖子两次，这样交互会更友好。如果请求失败，我们可能还想在表单中显示错误消息，或者只是将其记录到控制台。

可以让我们的组件逻辑等待异步 thunk 完成，并在完成后检查结果：

```js title="features/posts/AddPostForm.js"
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// highlight-next-line
import { addNewPost } from './postsSlice'

export const AddPostForm = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState('')
  // highlight-next-line
  const [addRequestStatus, setAddRequestStatus] = useState('idle')

  // omit useSelectors and change handlers

  // highlight-start
  const canSave =
    [title, content, userId].every(Boolean) && addRequestStatus === 'idle'

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus('pending')
        await dispatch(addNewPost({ title, content, user: userId })).unwrap()
        setTitle('')
        setContent('')
        setUserId('')
      } catch (err) {
        console.error('Failed to save the post: ', err)
      } finally {
        setAddRequestStatus('idle')
      }
    }
  }
  // highlight-end

  // omit rendering logic
}
```

可以使用 `useState` 添加一个表示加载状态的枚举状态，类似于我们在 `postsSlice` 中跟踪加载状态以获取帖子的方式。这样的话，就能知道请求是否在进行中。

当我们调用 `dispatch(addNewPost())` 时，异步 thunk 从 `dispatch` 返回一个 `Promise`。我们可以在这里 `await` 那个 promise 知道 thunk 什么时候完成它的请求。但是，我们还不知道该请求是成功还是失败。

`createAsyncThunk` 在内部处理了所有错误，因此我们在日志中看不到任何关于“rejected Promises”的消息。然后它返回它 dispatch 的最终 action：如果成功则返回“已完成” action，如果失败则返回“拒绝” action。Redux Toolkit 有一个名为 `unwrapResult` 的工具函数，它将返回来自 `fulfilled` action 的 `action.payload` 数据，或者如果它是 `rejected` action 则抛出错误。这让我们可以使用正常的 `try/catch` 逻辑处理组件中的成功和失败。因此，如果帖子成功创建，我们将清除输入字段以重置表单，如果失败，则将错误记录到控制台。

但是，想要编写查看实际请求成功或失败的逻辑是很常见的。 Redux Toolkit 向返回的 `Promise` 添加了一个 `.unwrap()` 函数，它将返回一个新的 `Promise`，这个 `Promise` 在 `fulfilled` 状态时返回实际的 `action.payload` 值，或者在 “rejected” 状态下抛出错误。这让我们可以使用正常的“try/catch”逻辑处理组件中的成功和失败。 因此，如果帖子创建成功，我们将清除输入字段以重置表单，如果失败，则将错误记录到控制台。

如果您想查看 `addNewPost` API 调用失败时如何处理，请尝试创建一个新帖子，其中“内容”字段只有“error”一词（不含引号）。服务器将看到并发送回失败的响应，这样你应该会看到控制台记录一条日志。

## 你学到了

异步逻辑和数据获取始终是一个复杂的话题。如您所见，Redux Toolkit 包含一些工具来自动化典型的 Redux 数据获取模式。

这是我们的应用程序现在从那个假 API 获取数据的样子：

<iframe
  class="codesandbox"
  src="https://codesandbox.io/embed/github/reduxjs/redux-essentials-example-app/tree/checkpoint-3-postRequests/?fontsize=14&hidenavigation=1&theme=dark&runonclick=1"
  title="redux-essentials-example-app"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

提醒一下，这是我们在本节中介绍的内容：

:::tip 总结

- **可以编写可复用的“selector 选择器”函数来封装从 Redux 状态中读取数据的逻辑**
  - 选择器是一种函数，它接收 Redux `state` 作为参数，并返回一些数据
- **Redux 使用叫做“中间件”这样的插件模式来开发异步逻辑**
  - 官方的处理异步中间件叫 `redux-thunk`，包含在 Redux Toolkit 中
  - Thunk 函数接收 `dispatch` 和`getState` 作为参数，并且可以在异步逻辑中使用它们
- **您可以 dispatch 其他 action 来帮助跟踪 API 调用的加载状态**
  - 典型的模式是在调用之前 dispatch 一个 "pending" 的 action，然后是包含数据的 “sucdess” 或包含错误的 “failure” action
  - 加载状态通常应该使用枚举类型，如 `'idle' | 'loading' | 'succeeded' | 'failed'`
- **Redux Toolkit 有一个 `createAsyncThunk` API 可以为你 dispatch 这些 action **
  - `createAsyncThunk` 接受一个 “payload creator” 回调函数，它应该返回一个 `Promise`，并自动生成 `pending/fulfilled/rejected` action 类型
  - 像 `fetchPosts` 这样生成的 action creator 根据你返回的 `Promise` dispatch 这些 action
  - 可以使用 `extraReducers` 字段在 `createSlice` 中监听这些 action，并根据这些 action 更新 reducer 中的状态。
  - action creator 可用于自动填充 `extraReducers` 对象的键，以便切片知道要监听的 action。
  - Thunk 可以返回 promise。 具体对于`createAsyncThunk`，你可以`await dispatch(someThunk()).unwrap()`来处理组件级别的请求成功或失败。

:::

## 下一步

我们还有一组主题要涵盖在本教程中。在 [第六节：性能和规范化数据](./part-6-performance-normalization.md) 中，我们将了解 Redux 的使用如何影响 React 性能，以及我们优化应用以提高性能的一些方法。
