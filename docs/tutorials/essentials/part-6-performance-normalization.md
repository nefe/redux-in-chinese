---
id: part-6-performance-normalization
title: 'Redux 循序渐进，第六节：性能与数据范式化'
sidebar_label: '性能与数据范式化'
hide_title: false
description: 'The official Redux Essentials tutorial: learn how to improve app performance and structure data correctly'
---

import { DetailedExplanation } from '../../components/DetailedExplanation'

# 第六节：性能与数据范式化

:::tip 你将学到

- 如何使用 `createSelector` 创建记忆化的 selector 函数
- 优化组件渲染性能的方法
- 如何使用 `createEntityAdapter` 来存储和更新范式化数据

:::

:::info 必备能力

- 完成[第五节](./part-5-async-logic.md)，理解数据请求流程

:::

## 简介

在[第五节：异步逻辑与数据请求](./part-5-async-logic.md)中，我们讲解了如何编写异步 thunks 从服务端 API 获取数据，如何处理异步请求 state 的开发模式，以及如何使用 selector 函数对从 Redux state 中读取数据的逻辑进行封装。

在本节中，我们将研究优化方法来确保我们的应用具有较好性能，以及用于自动处理 store 中数据常见更新的技术。

到目前为止，我们的大部分功能都以 `posts` 的特点为中心。接下来，我们将为这个应用添加几个新部分，添加这些之后，我们将看一看构建事物的具体细节，并讨论到目前为止我们构建的一些缺陷以及我们应该如何对其进行改进。

## 添加用户页面

我们从虚假 API 中获取用户列表，当我们添加新帖子时，我们可以从中选取一个用户作为作者。但是，社交媒体应用程序需要有能够查看特定用户的页面，并查看他们发布的所有帖子。让我们添加一个页面来显示所有用户列表，添加另一个页面来显示特定用户的所有帖子。

我们将从添加 `<UsersList>` 组件开始。它遵循常规模式，使用 `useSelector` 从 Store 中获取数据，然后通过数组映射生成一个用户列表，其中用户包含一个跳转到其各自页面的链接：

```jsx title="features/users/UsersList.js"
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectAllUsers } from './usersSlice'

export const UsersList = () => {
  const users = useSelector(selectAllUsers)

  const renderedUsers = users.map(user => (
    <li key={user.id}>
      <Link to={`/users/${user.id}`}>{user.name}</Link>
    </li>
  ))

  return (
    <section>
      <h2>Users</h2>

      <ul>{renderedUsers}</ul>
    </section>
  )
}
```

我们还没有 `selectAllUsers` selector，所以我们需要将其添加到 `usersSlice.js` 中，同时添加一个 `selectUserById` selector：

```js title="features/users/usersSlice.js"
export default usersSlice.reducer

// highlight-start
export const selectAllUsers = state => state.users

export const selectUserById = (state, userId) =>
  state.users.find(user => user.id === userId)
// highlight-end
```

接下来，我们将添加 `<UserPage>`， 类似于我们的 `<SinglePostPage>` ，从路由中获取 `userId` 参数：

```jsx title="features/users/UserPage.js"
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { selectUserById } from '../users/usersSlice'
import { selectAllPosts } from '../posts/postsSlice'

export const UserPage = ({ match }) => {
  const { userId } = match.params

  const user = useSelector(state => selectUserById(state, userId))

  const postsForUser = useSelector(state => {
    const allPosts = selectAllPosts(state)
    return allPosts.filter(post => post.user === userId)
  })

  const postTitles = postsForUser.map(post => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ))

  return (
    <section>
      <h2>{user.name}</h2>

      <ul>{postTitles}</ul>
    </section>
  )
}
```

正如我们之前所见，我们可以通过调用 `useSelector` 或从 props 中获取数据，并在另一个 `useSelector` 中使用它来帮助决定从 store 中获取哪些内容。

在 `<App>` 中为这些组件添加路由。

```jsx title="App.js"
          <Route exact path="/posts/:postId" component={SinglePostPage} />
          <Route exact path="/editPost/:postId" component={EditPostForm} />
          // highlight-start
          <Route exact path="/users" component={UsersList} />
          <Route exact path="/users/:userId" component={UserPage} />
          // highlight-end
          <Redirect to="/" />
```

在 `<Navbar>` 中添加一个用于链接到 `/users` 的 tab ，使我们能够点击并跳转到`<UsersList>`。

## 添加通知

如果不能弹出通知告诉我们有人发布了消息、留下了评论或者对我们的帖子做出了回应，那么任何社交媒体应用都是不完整的。

在一个真实的应用中，我们的客户端和后端服务器进行持续的通信，当发生某些事情时，服务器都会向客户端推送通知。由于我们这是一个小型应用，我们将通过添加一个按钮从虚假的 API 中获取一些通知来模拟该过程。我们也没有任何用来发送消息或对帖子做出反应的**真实**用户，因此虚假 API 会在我们每次发出请求时创建一些随机通知条目。（请记住，这里的目标是了解如何使用 Redux 本身。）

### 通知切片

由于这是我们应用程序的一个新部分，第一步是为我们的通知创建一个新切片，以及一个从 API 获取一些通知条目的异步 thunk。为了创建一些真实的通知，我们将在 state 中的保存最新通知的时间戳。这将使模拟服务器生成比该时间戳更新的通知：

```js title="features/notifications/notificationsSlice.js"
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { client } from '../../api/client'

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { getState }) => {
    const allNotifications = selectAllNotifications(getState())
    const [latestNotification] = allNotifications
    const latestTimestamp = latestNotification ? latestNotification.date : ''
    const response = await client.get(
      `/fakeApi/notifications?since=${latestTimestamp}`
    )
    return response.data
  }
)

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: [],
  reducers: {},
  extraReducers: {
    [fetchNotifications.fulfilled]: (state, action) => {
      state.push(...action.payload)
      // Sort with newest first
      state.sort((a, b) => b.date.localeCompare(a.date))
    }
  }
})

export default notificationsSlice.reducer

export const selectAllNotifications = state => state.notifications
```

和其他的切片一样，将 `notificationsReducer` 引入 `store.js`， 并将其添加到 `configureStore()` 的调用中。

我们编写了一个名为 `fetchNotifications` 的异步通知，它将从服务器检索新通知列表。作为其中的一部分，我们希望将最新通知的创建时间戳作为请求的一部分，以便服务器知道它应该只返回实际上更新的通知。

我们知道将返回一个通知数组，因此我们可以将它们作为单独的参数传递给 `state.push()` ，数组将添加每个条目。为了防止服务器将它们乱序发送，我们还想确保它们进行了排序，以便最近的通知在数组中的最后一个。 （提醒一下，`array.sort()` 总是会改变现有的数组——这是安全的，因为我们是在 `createSlice` 和 Immer 内使用。）

### Thunk 参数

看看我们的 `fetchNotifications` thunk，它有一些我们以前没见过的新东西。让我们花点时间来讨论一下 thunk 参数。

我们已经看到，当我们发送它时，我们可以将参数传递给 thunk action 的创建者，例如 `dispatch(addPost(newPost))`。特别是 `createAsyncThunk`，只能传递一个参数，无论我们传入的是什么，它都将成为 payload creation 回调的第一个参数。

payload creator 的第二个参数是一个' thunkAPI '对象，包含几个有用的函数和信息：

- `dispatch` 和 `getState`：`dispatch` 和 `getState` 方法由 Redux store 提供。您可以在 thunk 中使用这些来发起 action，或者从最新的 Redux store 中获取 state （例如在发起 另一个 action 后获取更新后的值）。
- `extra`：当创建 store 时，用于传递给 thunk 中间件的“额外参数”。这通常时某种 API 的包装器，比如一组知道如何对应用程序的服务器进行 API 调用并返回数据的函数，这样您的 thunk 就不必直接包含所有的 URL 和查询逻辑。
- `requestId`：该 thunk 调用的唯一随机 ID ，用于跟踪单个请求的状态。
- `signal`：一个`AbortController.signal` 函数，可用于取消正在进行的请求。
- `rejectWithValue`：一个用于当 thunk 收到一个错误时帮助自定义 `rejected` action 内容的工具。

（如果您要手写 thunk 而不是使用 `createAsyncThunk`，则 thunk 函数将获取 `(dispatch, getState)` 作为单独的参数，而不是将他们放在一个对象中。）

:::info 说明

有关这些参数以及如何处理取消 thunk 和请求的更多详细信息，请查看 [`createAsyncThunk` API 参考页](https://redux-toolkit.js.org/api/createAsyncThunk).

:::

在本例中，我们知道通知列表存储在我们 Redux store 的 state 中，并且最新的通知应该在数组中的第一个。我们可以从 thunkAPI 对象中解构 getState 函数，调用它来读取 state 值，并使用 selectAllNotifications 选择器为我们提供通知数组。由于通知数组按最新进行了排序，因此我们可以使用数组解构来获取最新的通知。

### 添加通知列表

创建切片之后，我们可以添加一个 `<NotificationsList>` 组件：

```jsx title="features/notifications/NotificationsList.js"
import React from 'react'
import { useSelector } from 'react-redux'
import { formatDistanceToNow, parseISO } from 'date-fns'

import { selectAllUsers } from '../users/usersSlice'

import { selectAllNotifications } from './notificationsSlice'

export const NotificationsList = () => {
  const notifications = useSelector(selectAllNotifications)
  const users = useSelector(selectAllUsers)

  const renderedNotifications = notifications.map(notification => {
    const date = parseISO(notification.date)
    const timeAgo = formatDistanceToNow(date)
    const user = users.find(user => user.id === notification.user) || {
      name: 'Unknown User'
    }

    return (
      <div key={notification.id} className="notification">
        <div>
          <b>{user.name}</b> {notification.message}
        </div>
        <div title={notification.date}>
          <i>{timeAgo} ago</i>
        </div>
      </div>
    )
  })

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  )
}
```

同样，我们从 Redux state 中读取项目列表，对它们进行映射，给每个项目渲染内容。

我们还需要在 `<Navbar>` 中添加一个“通知” tab，以及用于获取一些通知的新按钮：

```jsx title="app/Navbar.js"
import React from 'react'
// highlight-next-line
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

// highlight-next-line
import { fetchNotifications } from '../features/notifications/notificationsSlice'

export const Navbar = () => {
  // highlight-start
  const dispatch = useDispatch()

  const fetchNewNotifications = () => {
    dispatch(fetchNotifications())
  }
  // highlight-end

  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>

        <div className="navContent">
          <div className="navLinks">
            <Link to="/">Posts</Link>
            <Link to="/users">Users</Link>
            // highlight-next-line
            <Link to="/notifications">Notifications</Link>
          </div>
          // highlight-start
          <button className="button" onClick={fetchNewNotifications}>
            Refresh Notifications
          </button>
          // highlight-end
        </div>
      </section>
    </nav>
  )
}
```

最后，我们在 `App.js`中添加“通知”路由，以便我们可以导航到它：

```js title="App.js"
// omit imports
// highlight-next-line
import { NotificationsList } from './features/notifications/NotificationsList'

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Switch>
          // highlight-next-line
          <Route exact path="/notifications" component={NotificationsList} />
          // omit existing routes
          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  )
}
```

到目前为止，“通知” tab 如下所示：

![Initial Notifications tab](/img/tutorials/essentials/notifications-initial.png)

### 显示新通知

我们每次单击“刷新通知”时，都会在我们的列表中添加更多的通知条目。在一个真实的应用程序中，当我们查看 UI 的其他部分时，这些数据可能取自服务器。在浏览 `<PostsList>` 或 `<UserPage>` 时我们可以通过单击“刷新通知”来执行类似的操作。但是，现在我们不知道刚收到多少通知，如果我们继续点击按钮，可能会有很多通知我们还没有阅读。让我们添加一些逻辑来跟踪哪些通知是已经阅读的以及哪些通知是“新的”。让我们在导航栏中的“通知” tab 上将“未读”通知的计数显示为徽章，并以不同的颜色显示新通知。

我们的虚假 API 返回的通知条目带有 `isNew` 和 `read` 字段，我们可以在代码中使用这些值。

首先，我们将更新 `notificationsSlice`， 添加一个将所有通知标记为已读的 reducer，以及一些将现有通知标记为“非新”的逻辑：

```js title="features/notifications/notificationsSlice.js"
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: [],
  reducers: {
    // highlight-start
    allNotificationsRead(state, action) {
      state.forEach(notification => {
        notification.read = true
      })
    }
    // highlight-end
  },
  extraReducers: {
    [fetchNotifications.fulfilled]: (state, action) => {
      // highlight-start
      state.forEach(notification => {
        // Any notifications we've read are no longer new
        notification.isNew = !notification.read
      })
      // highlight-end
      state.push(...action.payload)
      // Sort with newest first
      state.sort((a, b) => b.date.localeCompare(a.date))
    }
  }
})

// highlight-next-line
export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer
```

在展示 `<NotificationsList>` 组件时，我们希望将这些通知标记为已读，因为我们点击 tab 查看了这些通知，或者因为我们已经打开它并收到了一些其它的通知。我们可以通过在该组件重新渲染的时候调用 `allNotificationsRead` 来实现这将通知数据标记为已读。为了避免在更新时刷新旧数据，我们将在 `useLayoutEffect` 钩子中执行该操作。我们还想为页面中的所有通知列表条目添加一个额外的类名，用来突出显示它们：

```js title="features/notifications/NotificationsList.js"
import React, { useLayoutEffect } from 'react'
// highlight-next-line
import { useSelector, useDispatch } from 'react-redux'
import { formatDistanceToNow, parseISO } from 'date-fns'
// highlight-next-line
import classnames from 'classnames'

import { selectAllUsers } from '../users/usersSlice'

// highlight-start
import {
  selectAllNotifications,
  allNotificationsRead
} from './notificationsSlice'
// highlight-end

export const NotificationsList = () => {
  // highlight-next-line
  const dispatch = useDispatch()
  const notifications = useSelector(selectAllNotifications)
  const users = useSelector(selectAllUsers)

  // highlight-start
  useLayoutEffect(() => {
    dispatch(allNotificationsRead())
  })
  // highlight-end

  const renderedNotifications = notifications.map(notification => {
    const date = parseISO(notification.date)
    const timeAgo = formatDistanceToNow(date)
    const user = users.find(user => user.id === notification.user) || {
      name: 'Unknown User'
    }

    // highlight-start
    const notificationClassname = classnames('notification', {
      new: notification.isNew
    })

    return (
      <div key={notification.id} className={notificationClassname}>
        // highlight-end
        <div>
          <b>{user.name}</b> {notification.message}
        </div>
        <div title={notification.date}>
          <i>{timeAgo} ago</i>
        </div>
      </div>
    )
  })

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  )
}
```

这是可行的，但实际上有一些令人惊讶的行为。每当有新的通知（因为我们切换到这个 tab，或者通过 API 获取一些新的通知），实际上，你会看到发起了两次 `"notifications/allNotificationsRead"`。 这是为什么呢？

假设我们在查看 `<PostsList>` 时获取了一些通知，然后单击“通知” tab 。 `<NotificationsList>` 组件将被挂载，`useLayoutEffect` 回调将在第一次渲染和发起`allNotificationsRead` 之后运行。 我们的 `notificationsSlice` 将通过更新 store 中的通知条目来响应这一过程。 这会创建一个新的 `state.notifications` 数组，其中包含不可变更新的条目，因为组件观察到从 `useSelector` 返回了新的数组，这会导致组件再次渲染，从而再次触发 `useLayoutEffect` 钩子并再次发起`allNotificationsRead`。reducer 也将再次运行，但这次并没有数据更新，因此组件不会重新渲染。

有几种方法可以避免二次发起，例如通过拆分组件挂载时的逻辑确保只发起一次，并且仅在通知数组的大小发生变化时才再次发起。这并没有破坏其它任何东西，所以我们可以不管它。

这的确表明**可以发起一个 action 但不会导致任 state 发生更改**。 请记住，**它总是由你的 reducer 来决定哪些 state 确实需要更新，并且“不发生任何更改”对于 reducer 来说也是一个有效的决定**。

以下是通知 tab 现在的样子，因为我们已经有了“新/读”的行为了：

![New notifications](/img/tutorials/essentials/notifications-new.png)

在继续之前，我们需要做的最后一件事是在导航栏中的“通知” tab 上添加徽章。当我们在其他 tab 中时，这将向我们展示“未读”通知的条数：

```js title="app/Navbar.js"
// omit imports
// highlight-next-line
import { useDispatch, useSelector } from 'react-redux'

// highlight-start
import {
  fetchNotifications,
  selectAllNotifications
} from '../features/notifications/notificationsSlice'
// highlight-end

export const Navbar = () => {
  const dispatch = useDispatch()
  // highlight-start
  const notifications = useSelector(selectAllNotifications)
  const numUnreadNotifications = notifications.filter(n => !n.read).length
  // highlight-end
  // omit component contents
  // highlight-start
  let unreadNotificationsBadge

  if (numUnreadNotifications > 0) {
    unreadNotificationsBadge = (
      <span className="badge">{numUnreadNotifications}</span>
    )
  }
  // highlight-end
  return (
    <nav>
      // omit component contents
      <div className="navLinks">
        <Link to="/">Posts</Link>
        <Link to="/users">Users</Link>
        // highlight-start
        <Link to="/notifications">
          Notifications {unreadNotificationsBadge}
        </Link>
        // highlight-end
      </div>
      // omit component contents
    </nav>
  )
}
```

## 提升渲染性能

我们的应用程序看起来已经能用了，但实际上我们组件重新渲染的时机和方式都存在一些缺陷。让我们来看看这些问题，并讨论一些提升性能的方法。

### 调研渲染行为

我们可以使用 React DevTools Profiler 查看 state 更新时组件重新渲染的分析图。尝试单击单个用户的`<UserPage>`。 打开浏览器的 DevTools，然后在 React “Profiler” 选项卡中，单击左上角的圆形 “Record” 按钮。 然后，单击我们应用程序中的 “刷新通知” 按钮，并在 React DevTools Profiler 中停止记录。 您应该会看到如下所示的图表：

![React DevTools Profiler 渲染图 - <UserPage>](/img/tutorials/essentials/userpage-rerender.png)

我们看到 `<Navbar>` 进行了重新渲染，这是合理的，因为它必须在 tab 上显示更新的“未读通知”标记。 但是，为什么我们的 `<UserPage>` 也会重新渲染呢？

当我们检查 Redux DevTools 中最后发起的几个 action，我们可以看到只有通知 state 进行更新。由于 `<UserPage>` 没有读取任何通知，因此它不应该重新渲染。组件编写一定存在一些问题。

当我们仔细查看 `<UserPage>`，就会发现一个具体的问题：

```jsx title="features/UserPage.js
export const UserPage = ({ match }) => {
  const { userId } = match.params

  const user = useSelector(state => selectUserById(state, userId))

  // highlight-start
  const postsForUser = useSelector(state => {
    const allPosts = selectAllPosts(state)
    return allPosts.filter(post => post.user === userId)
  })
  // highlight-end

  // omit rendering logic
}
```

我们知道每发起一个 action 都将运行 `useSelector`，如果我们返回一个新的引用值，它会强制组件重新渲染。

我们在 `useSelector` 钩子中调用了 `filter()`，以便只返回属于该用户的帖子列表。不幸的是，**这意味着 `useSelector` _总会_ 返回一个新的数组，所以 _每次_ 执行以上操作我们的组件都将重新渲染，即使返回的数据并没有发生改变！**

### 记忆化的 Selector 函数

我们真正需要的是一种仅在 `state.posts` 或 `userId` 发生变化时计算新的过滤数组的方法。如果它们没有改变，我们希望返回上次相同过滤数组的引用。

这个想法被称为“记忆”。我们要保存之前的一组输入和计算的结果，如果输入相同，则返回之前的结果，而不是重新计算。

到目前为止，我们一直在自己编写 selector 函数，这样我们就不必复制和粘贴从 store 中读取数据的代码。如果有办法让我们的 selector 函数记忆化，那就太好了。

**[Reselect](https://github.com/reduxjs/reselect) 是一个创建记忆化 selector 函数的库**，并且是专门设计用来与 Redux 一起使用的。它有一个 `createSelector` 函数，可以创建记忆化的 selector，只有在输入发生变化时才会重新计算结果。Redux Toolkit [导出了 `createSelector` 函数](https://redux-toolkit.js.org/api/createSelector) ，因此我们可以直接使用它。

让我们使用 Reselect 创建一个新的 `selectPostsByUser` selector，并在这里使用它。

```js title="features/posts/postsSlice.js"
// highlight-next-line
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'

// omit slice logic

export const selectAllPosts = state => state.posts.posts

export const selectPostById = (state, postId) =>
  state.posts.posts.find(post => post.id === postId)

// highlight-start
export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter(post => post.user === userId)
)
// highlight-end
```

`createSelector` 将一个或多个“输入 selector ”函数作为参数，外加一个“输出 selector ”函数。 当我们调用 `selectPostsByUser(state, userId)` 时，`createSelector` 会将所有参数传递给每个输入 selector 。无论这些输入 selector 返回什么，都将成为输出 selector 的参数。

在这种情况下，我们知道我们需要将帖子数组和用户 ID 作为输出 selector 的两个参数。我们可以重用现有的 `selectAllPosts` selector 来提取帖子数组。由于用户 ID 是我们传递给 `selectPostsByUser` 的第二个参数，我们可以编写一个只返回 `userId` 的小 selector。

然后，我们的输出 selector 接受 `posts` 和 `userId`，并返回过滤后的属于该用户的帖子数组。

如果我们尝试多次调用 `selectPostsByUser`，它只会在 `posts` 或 `userId` 发生变化时重新执行输出 selector：

```js
const state1 = getState()
// Output selector runs, because it's the first call
selectPostsByUser(state1, 'user1')
// Output selector does _not_ run, because the arguments haven't changed
selectPostsByUser(state1, 'user1')
// Output selector runs, because `userId` changed
selectPostsByUser(state1, 'user2')

dispatch(reactionAdded())
const state2 = getState()
// Output selector does not run, because `posts` and `userId` are the same
selectPostsByUser(state2, 'user2')

// Add some more posts
dispatch(addNewPost())
const state3 = getState()
// Output selector runs, because `posts` has changed
selectPostsByUser(state3, 'user2')
```

如果我们在 `<UserPage>` 中调用这个 selector 并在获取通知时重新运行 React profiler，我们可以看到这次 `<UserPage>` 没有重新渲染：

```jsx
export const UserPage = ({ match }) => {
  const { userId } = match.params

  const user = useSelector(state => selectUserById(state, userId))

  // highlight-start
  const postsForUser = useSelector(state => selectPostsByUser(state, userId))
  // highlight-end

  // omit rendering logic
}
```

记忆化的 selector 是提高 React+Redux 应用程序性能的宝贵工具，因为它们可以帮助我们避免不必要的重新渲染，并且如果输入数据没有更改，还可以避免执行潜在的复杂或昂贵的计算。

### 调研帖子列表

如果我们回到`<PostsList>` 并在捕获 React profiler 跟踪时点击其中一个帖子上的反应按钮，我们看到不仅 `<PostsList>` 和真正更新的 `<PostExcerpt>` 实例渲染了，其它所有的 `<PostExcerpt>` 组件页也渲染了：

![React DevTools Profiler render capture - <PostsList>](/img/tutorials/essentials/postslist-rerender.png)

为什么会这样？ 其他帖子都没有改变，为什么他们也发生了重新渲染？

[**React 的默认行为是当父组件渲染时，React 会递归渲染其中的所有子组件！**](https://blog.isquaredsoftware.com/2020/05/blogged-answers-a-mostly -complete-guide-to-react-rendering-behavior/)。 一个 post 对象的不可变更新也创建了一个新的 `posts` 数组。`<PostsList>` 必须重新渲染，因为 `posts` 数组是一个新的引用，所以在渲染之后，React 继续向下并重新渲染所有的 `<PostExcerpt>` 组件。

这对于我们的小示例应用程序来说并不是一个严重的问题，但是在一个更大的真实应用程序中，可能有一些非常长的列表或者非常大的组件树，重新渲染所有额外的组件可能会导致速度下降。

在 `<PostsList>` 中有几种方法可以优化这种行为。

首先，我们可以将 `<PostExcerpt>` 组件包装在 React.memo() 中，这可以确保组件只有在 props 真正更改时才会重新渲染。这实际上还是会很好地运行——尝试一下，看看会发生什么：

```jsx title="features/posts/PostsList.js
// highlight-next-line
let PostExcerpt = ({ post }) => {
  // omit logic
}

// highlight-next-line
PostExcerpt = React.memo(PostExcerpt)
```

另一种选择是重写`<PostsList>`，使其仅从 store 中选择帖子 ID 列表而不是整个`posts`数组，并重写 `<PostExcerpt>`，使其接收 `postId` prop 并调用 `useSelector` 来读取需要的 post 对象。 如果 `<PostsList>` 获得与以前相同的 ID 列表，则不需要重新渲染，因此只有我们更新的那个 `<PostExcerpt>` 组件才会渲染。

不幸的是，这变得很棘手，因为我们还需要将所有帖子按日期排序并以正确的顺序渲染。可以更新我们的 `postsSlice` 以始终保持数组排序，因此我们不必在组件中对其进行排序，并使用记忆化的 selector 仅提取帖子 ID 列表。我们还可以自定义 useSelector 的比较函数来检查结果，，比如 `useSelector(selectPostIds, shallowEqual)`，这样如果 IDs 数组的内容没有改变，就会跳过重新渲染。

最后一个选项是找到某种方法让我们的 reducer 为所有帖子保留一个单独的 ID 数组，并且仅在添加或删除帖子时修改该数组，并对 `<PostsList>` 和 `<PostExcerpt>` 进行相同的重写。 这样，`<PostsList>` 只需要在 IDs 数组更改时重新渲染。

方便的是，Redux Toolkit 有一个 createEntityAdapter 函数可以帮助我们做到这一点。

## 范式化数据

您已经看到，我们的很多逻辑都是通过 ID 字段来查找对应的项。由于我们一直将数据存储在数组中，这意味着我们必须使用 `array.find()` 遍历数组中的所有项，直到找到我们寻找的那个 ID 的对应的项。

实际上，这不会花费很长时间，但是如果我们数组包含数百或数千个项，则查看整个数组以找到一个项目是耗时的。 我们需要的是一种直接根据其 ID 查找单个项的方法，而无需检查所有其他项。这个过程被称为“范式化”。

### 范式化 State 结构

“范式化 state”是指：

- 我们 state 中的每个特定数据只有一个副本，不存在重复。
- 已范式化的数据保存在查找表中，其中项目 ID 是键，项本身是值。
- 也可能有一个特定项用于保存所有 ID 的数组。

JavaScript 对象可以用作查找表，类似于其他语言中的 "maps" 或 "dictionaries"。 以下是一组“用户”对象的范式化 state 可能如下所示：

```js
{
  users: {
    ids: ["user1", "user2", "user3"],
    entities: {
      "user1": {id: "user1", firstName, lastName},
      "user2": {id: "user2", firstName, lastName},
      "user3": {id: "user3", firstName, lastName},
    }
  }
}
```

这使得通过 ID 查找特定的“用户”对象变得简单，不需遍历数组中其他的用户对象：

```js
const userId = 'user2'
const userObject = state.users.entities[userId]
```

:::info 说明

有关范式化 state 为何有用的更多详细信息，请参阅[范式化 state 结构](../../recipes/structuring-reducers/NormalizingStateShape.md) 和 Redux 工具包使用指南部分关于[管理范式化数据](https://redux-toolkit.js.org/usage/usage-guide#managing-normalized-data)。

:::

### 使用' createEntityAdapter '管理范式化 state

Redux Toolkit 的 `createEntityAdapter` API 提供了一种将数据存储在切片中的标准化方法，方法是获取项目集合并将它们放入 `{ ids: [], entities: {} }` 的结构中。除了这个预定义的 state 结构，它还会生成一组知道如何处理该数据的 reducer 函数和 selector。

这有几个好处：

- 我们不必自己编写代码来管理范式化
- `createEntityAdapter` 的预构建 reducer 函数处理一些常见的情况，例如“添加所有项”、“更新项”或“删除多个项”
- `createEntityAdapter` 可以基于项的内容将 ID 保持在排序的数组中，并且仅在添加/删除项或排序规则更改时才更新该数组。

`createEntityAdapter` 接受一个选项对象，该对象可能包含一个 `sortComparer` 函数，该函数将用于通过比较两个项目来保持项目 id 数组的排序(工作方式与 `array.sort()` 相同)。

它返回一个对象，该对象包含 [一组生成的 reducer 函数，用于从实体 state 对象中添加、更新和删除项目](https://redux-toolkit.js.org/api/createEntityAdapter#crud-functions)。这些 reducer 函数既可以用作特定 action 类型的 reducer，也可以用作 `createSlice` 中另一个 reducer 中的 "mutating" 实用函数。

adapter 对象也有一个 `getSelectors` 函数。你可以传入一个 selector，它从 Redux 根 state 返回这个特定的 state 切片，它会生成类似于 `selectAll` 和 `selectById` 的选择器。

最后，adapter 对象有一个 `getInitialState` 函数，它生成一个空的 `{ids: [], entities: {}}` 对象。您可以传递更多字段给 `getInitialState`，这些字段将会被合并。

### 更新帖子切片

考虑到这一点，让我们使用 `createEntityAdapter` 更新 `postsSlice` ：

```js title="features/posts/postsSlice.js"
import {
  // highlight-next-line
  createEntityAdapter
  // omit other imports
} from '@reduxjs/toolkit'

// highlight-start
const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = postsAdapter.getInitialState({
  status: 'idle',
  error: null
})
// highlight-end

// omit thunks

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      // highlight-next-line
      const existingPost = state.entities[postId]
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      // highlight-next-line
      const existingPost = state.entities[id]
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    }
  },
  extraReducers: {
    // omit other reducers

    [fetchPosts.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      // Add any fetched posts to the array
      // highlight-start
      // Use the `upsertMany` reducer as a mutating update utility
      postsAdapter.upsertMany(state, action.payload)
      // highlight-end
    },
    // highlight-start
    // Use the `addOne` reducer for the fulfilled case
    [addNewPost.fulfilled]: postsAdapter.addOne
    // highlight-end
  }
})

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

// highlight-start
// Export the customized selectors for this adapter using `getSelectors`
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
  // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => state.posts)
// highlight-end

export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter(post => post.user === userId)
)
```

上面代码做了很多事情！让我们分步讲解一下。

首先，我们导入了 `createEntityAdapter`，并调用它来创建 `postsAdapter` 对象。我们希望保留一个所有帖子 ID 并按最新排序的数组，所以我们传入一个 `sortComparer` 函数，它将根据 `post.date` 字段将较新的项排序到前面。

`getInitialState()` 返回一个空的 `{ids: [], entities: {}}` 范式化 state 对象。我们的 `postsSlice` 需要用 `status` 和 `error` 字段来保留加载 state，所以我们将它们传递给 `getInitialState()`。

现在我们的帖子作为一个查找表保存在 `state.entities` 中，我们可以修改 `reactionAdded` 和 `postUpdated` reducer，直接根据 id 查找正确的帖子，而不必遍历旧的`帖子`数组。

当收到 `fetchPosts.fulfilled` action 时，我们通过将现有 `state` 和 `action.payload` 传入 `postsAdapter.upsertMany` 函数，从而将所有传入的帖子添加到 state 中。如果 `action.payload` 中有任何项目已经存在于我们 state 中，`upsertMany` 函数将根据匹配的 ID 将它们合并在一起。

当我们收到 `addNewPost.fulfilled` action 时，我们需要将一个新的帖子对象添加到我们的 state 中。我们可以直接将 adapter 用作 reducer，因此我们将传递 `postsAdapter.addOne` 作为 reducer 函数来处理该操作。

最后，我们可以用 `postsAdapter.getSelectors` 生成的 selector 函数替换旧的手写的 `selectAllPosts` 和 `selectPostById` selector 函数。由于 selector 是使用根 Redux state 对象调用的，它们需要知道在 Redux state 中在哪里可以找到我们的帖子数据，所以我们传入一个返回 `state.posts` 的小 selector。生成的 selector 函数总是称为 `selectAll` 和 `selectById`，因此我们可以使用 ES6 解构语法在导出它们时重命名它们并匹配旧的 selector 名称。我们还将以同样的方式导出 `selectPostIds`，因为我们想在 `<PostsList>` 组件中读取已排序的帖子 ID 列表。

### 优化帖子列表

现在我们的帖子切片使用了 createEntityAdapter，我们可以更新 `<PostsList`> 以优化其渲染行为。

我们将更新 `<PostsList>` ，使其只读取已排序的帖子 ID 数组，并将 postId 传递给每个 `<PostExcerpt>`：

```jsx title="features/posts/PostsList.js"
// omit other imports

// highlight-start
import {
  selectAllPosts,
  fetchPosts,
  selectPostIds,
  selectPostById
} from './postsSlice'

let PostExcerpt = ({ postId }) => {
  const post = useSelector(state => selectPostById(state, postId))
  // highlight-end
  // omit rendering logic
}

export const PostsList = () => {
  const dispatch = useDispatch()
  // highlight-next-line
  const orderedPostIds = useSelector(selectPostIds)

  // omit other selections and effects

  if (postStatus === 'loading') {
    content = <div className="loader">Loading...</div>
  } else if (postStatus === 'succeeded') {
    // highlight-start
    content = orderedPostIds.map(postId => (
      <PostExcerpt key={postId} postId={postId} />
    ))
    // highlight-end
  } else if (postStatus === 'error') {
    content = <div>{error}</div>
  }

  // omit other rendering
}
```

现在，如果我们在捕获 React 组件性能 profile 时尝试点击其中一个帖子上的反应按钮，我们应该会看到只有一个组件进行了重新渲染：

![React DevTools Profiler render capture - optimized <PostsList>](/img/tutorials/essentials/postslist-optimized.png)

## 转换其他切片

我们快完成了。作为最后的清理步骤，我们将使用 `createEntityAdapter` 更新其他两个切片。

### 转换用户切片

`usersSlice` 相当小，我们只需要修改一些内容：

```js title="features/users/usersSlice.js"
import {
  createSlice,
  createAsyncThunk,
  // highlight-next-line
  createEntityAdapter
} from '@reduxjs/toolkit'
import { client } from '../../api/client'

// highlight-start
const usersAdapter = createEntityAdapter()

const initialState = usersAdapter.getInitialState()
// highlight-end

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get('/fakeApi/users')
  return response.users
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: {
    // highlight-next-line
    [fetchUsers.fulfilled]: usersAdapter.setAll
  }
})

export default usersSlice.reducer

// highlight-start
export const { selectAll: selectAllUsers, selectById: selectUserById } =
  usersAdapter.getSelectors(state => state.users)
// highlight-end
```

我们在这里处理的唯一操作是用从服务器获取的数组替换整个用户列表。 我们可以使用 `usersAdapter.setAll` 来实现。

`<AddPostForm>` 仍在将 `state.users` 作为数组读取，`<PostAuthor>` 也是如此。分别使用 `selectAllUsers` 和 `selectUserById`更新它们。

### 转换通知片

最后但同样重要的是，我们还将更新 `notificationsSlice`：

```js title="features/notifications/notificationsSlice.js"
import {
  createSlice,
  createAsyncThunk,
  // highlight-next-line
  createEntityAdapter
} from '@reduxjs/toolkit'

import { client } from '../../api/client'

// highlight-start
const notificationsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})
// highlight-end

// omit fetchNotifications thunk

const notificationsSlice = createSlice({
  name: 'notifications',
  // highlight-next-line
  initialState: notificationsAdapter.getInitialState(),
  reducers: {
    allNotificationsRead(state, action) {
      // highlight-start
      Object.values(state.entities).forEach(notification => {
        notification.read = true
      })
      // highlight-end
    }
  },
  extraReducers: {
    [fetchNotifications.fulfilled]: (state, action) => {
      // highlight-start
      Object.values(state.entities).forEach(notification => {
        // Any notifications we've read are no longer new
        notification.isNew = !notification.read
      })
      notificationsAdapter.upsertMany(state, action.payload)
      // highlight-end
    }
  }
})

export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

// highlight-start
export const { selectAll: selectAllNotifications } =
  notificationsAdapter.getSelectors(state => state.notifications)
// highlight-end
```

我们再次导入`createEntityAdapter` 并调用它，然后调用 `notificationsAdapter.getInitialState()` 来设置切片。

具有讽刺意味的是，我们确实有几个地方需要循环所有通知对象并更新它们。由于这些不再保存在数组中，我们必须使用 Object.values(state.entities) 来获取这些通知的数组并对其进行循环。 另一方面，我们可以用 `notificationsAdapter.upsertMany` 替换之前的 fetch 更新逻辑。

就这样......我们完成了！

## 你学到了

恭喜，你已经完成了 Redux Essentials 教程！ 让我们看看最终应用的实际效果：

<iframe
  class="codesandbox"
  src="https://codesandbox.io/embed/github/reduxjs/redux-essentials-example-app/tree/checkpoint-4-entitySlices/?fontsize=14&hidenavigation=1&theme=dark&runonclick=1"
  title="redux-essentials-example-app"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

以下是我们在本节中介绍的内容：

:::tip 总结

- **可用于优化性能的记忆化 selector 函数**
  - Redux Toolkit 重新导出了 Reselect 中的 `createSelector` 函数，该函数会生成记忆化的 selector
  - 只有当输入 selector 返回新的值时，记忆 selector 才会重新计算结果
  - 记忆化可以跳过昂贵的计算，并确保返回相同的结果引用
- **可以使用多种方式来优化使用了 Redux 的 React 组件的渲染**
  - 避免在 `useSelector` 中创建新的对象/数组引用——这将导致不必要的重新渲染
  - 可以传递记忆化的 selector 函数给`useSelector`来优化渲染
  - `useSelector` 可以接受比较函数，例如 `shallowEqual`，而不是引用相等
  - 组件可以包装在 `React.memo()` 中，仅在它们的 prop 发生变化时重新渲染
  - 列表渲染可以通过让列表父组件仅读取每项的 ID 组成的数组、将 ID 传递给列表项子项并在子项中按 ID 检索项来实现优化
- **范式化 state 结构是存储项的推荐方法**
  - “范式化”意味着不重复数据，并通过 ID 将项目存储在查找表中
  - 范式化 state 形式通常看起来像 `{ids: [], entities: {}}`
- **Redux Toolkit 的 `createEntityAdapter` API 帮助管理切片中的范式化数据**
  - 通过传入 `sortComparer` 选项，可以按排序顺序保持项目 ID
  - adapter 对象包括：
    - `adapter.getInitialState`，它可以接受额外的 state 字段，如加载 state
    - 预先创建通用 reducer，例如 `setAll`、`addMany`、`upsertOne` 和 `removeMany`
    - `adapter.getSelectors`，生成类似于 `selectAll` 和 `selectById` 的 selector

:::

## 下一步

我们在本教程中介绍的概念应该足以让您开始使用 React 和 Redux 构建自己的应用程序。现在是尝试自己进行项目以巩固这些概念并了解它们在实践中如何工作的好时机。如果您不确定要构建什么样的项目，请参阅 [应用项目创意列表](https://github.com/florinpop17/app-ideas) 以获得一些灵感。

Redux 循序渐进教程侧重于“如何正确使用 Redux”，而不是“它是如何工作的”或“为什么它会这样工作”。特别是，Redux Toolkit 是一组更高级别的抽象和实用程序，它有助于理解 RTK 中的抽象实际上为您做了什么。通读 ["Redux 基础" 教程](../fundamentals/part-1-overview.md) 将帮助您了解如何“手动”编写 Redux 代码，以及为什么我们推荐 Redux Toolkit 作为编写 Redux 逻辑的默认方式。

[Recipes](../../recipes/README.md) 部分包含有关许多重要概念的信息，例如 [如何构建 reducer](../../recipes/structuring-reducers/StructuringReducers.md) 和 [我们的样式指南页面](../../style-guide/style-guide) 包含有关推荐模式和最佳实践的重要信息。

如果您想了解更多关于 Redux 存在的原因、它试图解决的问题以及用途，请参阅 Redux 维护者 Mark Erikson 在 [The Tao of Redux, Part 1: Implementation and Intent](https://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-1/) 上的帖子和[Redux 之道，第 2 部分：实践与哲学](https://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-2/)。

如果您正在寻求有关 Redux 问题的帮助，请加入 [Discord 上 Reactiflux 服务器中的 `#redux` 频道](https://www.reactiflux.com)

**感谢您阅读本教程，我们希望您喜欢使用 Redux 构建应用程序！**
