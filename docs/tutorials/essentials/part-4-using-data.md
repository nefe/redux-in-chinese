---
id: part-4-using-data
title: 'Redux 循序渐进，第四节：使用数据'
sidebar_label: '使用数据'
hide_title: false
description: 'The official Redux Essentials tutorial: learn how to work with complex Redux state in React components'
---

import { DetailedExplanation } from '../../components/DetailedExplanation'

# 第四节：使用数据

:::tip 你将学到

- 在多个 React 组件中使用 Redux 数据
- 开发逻辑来 dispatch action
- 在 reducer 中编写更复杂的更新逻辑

:::

:::info 必备能力

- 理解 [Redux 循序渐进，第三节：数据流基础](./part-3-data-flow.md)
- 熟悉 [使用 React Router 中 `<Link>` 与 `<Route>` 组件来做页面路由](https://reacttraining.com/react-router/web/api)

:::

## 简介

在 [第三节：基本数据流](./part-3-data-flow.md) 中，我们看到了如何从一个空的 Redux+React 项目设置开始，添加一个新的状态切片，并创建 React 组件 可以从 Redux store 中读取数据并 dispatch action 来更新该数据。我们还研究了数据如何在应用程序中流动，组件 dispatch action，reducer 处理动作并返回新状态，以及组件读取新状态并重新渲染 UI。

现在您已经了解了编写 Redux 逻辑的核心步骤，我们将使用这些相同的步骤向我们的社交媒体提要添加一些很实用的新功能：查看单个帖子、编辑现有帖子、详细信息显示帖子作者、发布时间戳和反应按钮。


:::info 说明

提醒一下，代码示例侧重于每个部分的关键概念和更改。请参阅 CodeSandbox 项目和 [项目 repo 中的`tutorial-steps` 分支](https://github.com/reduxjs/redux-essentials-example-app/tree/tutorial-steps) 以了解应用程序中的完整更改。

:::

## 显示单个帖子

由于我们能够向 Redux store 添加新帖子，因此我们可以添加更多以不同方式使用帖子数据的功能。

目前，我们的帖子列表正在首页中显示，但如果文本太长，我们只会显示内容的摘录。能够在其自己的页面上查看单个帖子条目会很有帮助。

### 创建单个帖子的页面

首先，我们需要在我们的 `posts` 功能文件夹中添加一个新的 `SinglePostPage` 组件。当页面 URL 是 `/posts/123` 这样的格式时，我们将使用 React Router 来显示这个组件，其中 `123` 部分应该是我们想要显示的帖子的 ID。

```jsx title="features/posts/SinglePostPage.js"
import React from 'react'
import { useSelector } from 'react-redux'

export const SinglePostPage = ({ match }) => {
  const { postId } = match.params

  const post = useSelector(state =>
    state.posts.find(post => post.id === postId)
  )

  if (!post) {
    return (
      <section>
        <h2>页面未找到！</h2>
      </section>
    )
  }

  return (
    <section>
      <article className="post">
        <h2>{post.title}</h2>
        <p className="post-content">{post.content}</p>
      </article>
    </section>
  )
}
```

React Router 将传入一个 `match` 对象作为包含我们正在寻找的 URL 信息的 prop。当我们设置路由来渲染这个组件时，我们将告诉它解析 URL 的第二部分作为一个名为 `postId` 的变量，我们可以从 `match.params` 中读取该值。

一旦我们有了这个 `postId` 值，我们就可以在 selector 函数中使用它来从 Redux store 中找到正确的 post 对象。我们知道 `state.posts` 应该是所有 post 对象的数组，所以我们可以使用 `Array.find()` 函数循环遍历数组并返回带有我们正在寻找的 ID 的 post 条目。

重要的是要注意**每当 `useSelector` 返回的值为新引用时，组件就会重新渲染**。所以组件应始终尝试从 store 中选择它们需要的**尽可能少**的数据，这将有助于确保它仅在实际需要时才渲染。

可能我们在 store 中没有匹配的帖子条目 - 也许用户试图直接输入 URL，或者我们没有加载正确的数据。如果发生这种情况，`find()` 函数将返回 `undefined` 而不是实际的 post 对象。我们的组件需要检查并通过显示“找不到帖子！”来处理它。

假设我们在 store 中有正确的 post 对象，`useSelector` 将返回它，我们可以使用它来渲染页面中帖子的标题和内容。

您可能会注意到，这看起来与我们在 `<PostsList>` 组件主体中的逻辑非常相似，其中我们遍历整个 `posts` 数组以显示主要提要的帖子摘录。我们_可以尝试_提取一个可以在两个地方使用的“帖子”组件，但是我们在显示帖子摘录和整个帖子方面已经存在一些差异。即使有一些重复，通常最好还是分开写一段时间，然后我们可以稍后决定不同的代码部分是否足够相似，以至于我们可以真正提取出可重用的组件。

### 添加单个帖子的路由

现在我们有一个 `<Single Post Page>` 组件，我们可以定义一个路由来显示它，并在首页提要中添加每个帖子的链接。

我们将在`App.js`中导入`Single Post Page`，并添加路由：

```jsx title="App.js"
import { PostsList } from './features/posts/PostsList'
import { AddPostForm } from './features/posts/AddPostForm'
// highlight-next-line
import { SinglePostPage } from './features/posts/SinglePostPage'

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <React.Fragment>
                <AddPostForm />
                <PostsList />
              </React.Fragment>
            )}
          />
          // highlight-next-line
          <Route exact path="/posts/:postId" component={SinglePostPage} />
          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  )
}
```

然后，在 `<PostsList>` 中，我们将更新列表渲染逻辑以包含一个路由到该特定帖子的 `<Link>`：

```jsx title="features/posts/PostsList.js"
import React from 'react'
import { useSelector } from 'react-redux'
// highlight-next-line
import { Link } from 'react-router-dom'

export const PostsList = () => {
  const posts = useSelector(state => state.posts)

  const renderedPosts = posts.map(post => (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <p className="post-content">{post.content.substring(0, 100)}</p>
      // highlight-start
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
      // highlight-end
    </article>
  ))

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {renderedPosts}
    </section>
  )
}
```

由于我们现在可以点击进入不同的页面，因此在 `<Navbar>` 组件中提供一个返回主帖子页面的链接也会很有帮助：

```jsx title="app/Navbar.js"
import React from 'react'

// highlight-next-line
import { Link } from 'react-router-dom'

export const Navbar = () => {
  return (
    <nav>
      <section>
        <h1>Redux 循序渐进示例</h1>

        <div className="navContent">
          // highlight-start
          <div className="navLinks">
            <Link to="/">帖子列表</Link>
          </div>
          // highlight-end
        </div>
      </section>
    </nav>
  )
}
```

## 编辑帖子

作为用户，写完一篇文章，保存它，然后意识到你在某个地方犯了错误，这真的很烦人。 在我们创建帖子后能够编辑它会很有用。

让我们添加一个新的 `<EditPostForm>` 组件，该组件能够获取现有帖子 ID，从 store 读取该帖子，让用户编辑标题和帖子内容，然后保存更改以更新 store 中的帖子。

### 更新帖子条目

首先，我们需要更新我们的 `postsSlice` 以创建一个新的 reducer 函数和一个动作，以便 store 知道如何更新帖子数据。

在 `createSlice()` 函数中，我们应该在 `reducers` 对象中添加一个新函数。请记住，reducer 的名称应该很好地描述了正在发生的事情，因为无论何时调度此 action，我们都会看到 reducer 名称显示为 Redux DevTools 中的 action type 字符串的一部分。我们的第一个 reducer 被称为 `postAdded`，这个就命名为 `postUpdated`。

为了更新 post 对象，我们需要知道：

- 正在更新的帖子的ID，以便我们可以在状态中找到正确的帖子对象
- 用户输入的新“标题”和“内容”字段

Redux action 对象需要有一个 `type` 字段，它通常是一个描述性字符串，也可能包含其他字段，其中包含有关发生的事情的更多信息。按照惯例，我们通常将附加信息放在名为 `action.payload` 的字段中，但由我们来决定 `payload` 字段包含的内容 - 它可以是字符串、数字、对象、数组或别的东西。在这种情况下，由于我们需要三个信息，让我们计划让 `payload` 字段成为其中包含三个字段的对象。这意味着 action 对象将类似于 `{type: 'posts/postUpdated', payload: {id, title, content}}`。

默认情况下，`createSlice` 生成的 action creator 希望你传入一个参数，该值将作为 `action.payload` 放入 action 对象中。因此，我们可以将包含这些字段的对象作为参数传递给 `postUpdated` 这个 action creator。

我们还知道，reducer 负责确定在调度 action 时实际应该如何更新状态。鉴于此，我们应该让 reducer 根据 ID 找到正确的 post 对象，并专门更新该 post 中的 `title` 和 `content` 字段。

最后，我们需要导出 `createSlice` 为我们生成的 action creator 函数，以便用户保存帖子时 UI 可以 dispatch 新的 `postUpdated` action。

考虑到所有这些要求，修改后的 `postsSlice` 代码如下：

```js title="features/posts/postsSlice.js"
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded(state, action) {
      state.push(action.payload)
    },
    // highlight-start
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      const existingPost = state.find(post => post.id === id)
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    }
    // highlight-end
  }
})

// highlight-next-line
export const { postAdded, postUpdated } = postsSlice.actions

export default postsSlice.reducer
```

### 编辑帖子表单

我们新的 `<EditPostForm>` 组件看起来类似于 `<AddPostForm>`，但逻辑需要有点不同。我们需要从 store 中检索正确的 `post` 对象，然后使用它来初始化组件中的状态字段，以便用户可以进行更改。用户完成后，我们会将更改的标题和内容值保存回 store。 我们还将使用 React Router 的历史 API 切换到单个帖子页面并显示该帖子。

```jsx title="features/posts/EditPostForm.js"
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { postUpdated } from './postsSlice'

export const EditPostForm = ({ match }) => {
  const { postId } = match.params

  const post = useSelector(state =>
    state.posts.find(post => post.id === postId)
  )

  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)

  const dispatch = useDispatch()
  const history = useHistory()

  const onTitleChanged = e => setTitle(e.target.value)
  const onContentChanged = e => setContent(e.target.value)

  const onSavePostClicked = () => {
    if (title && content) {
      dispatch(postUpdated({ id: postId, title, content }))
      history.push(`/posts/${postId}`)
    }
  }

  return (
    <section>
      <h2>编辑帖子</h2>
      <form>
        <label htmlFor="postTitle">帖子标题：</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mind?"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postContent">内容：</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
      </form>
      <button type="button" onClick={onSavePostClicked}>
        保存帖子
      </button>
    </section>
  )
}
```

与 `SinglePostPage` 一样，我们需要将它导入 `App.js` 并添加一个路由来渲染这个组件。我们还应该向我们的 `SinglePostPage` 添加一个新链接，该链接将路由到 `EditPostPage`，例如：

```jsx title="features/post/SinglePostPage.js"
// highlight-next-line
import { Link } from 'react-router-dom'

export const SinglePostPage = ({ match }) => {

        // omit other contents

        <p  className="post-content">{post.content}</p>
        // highlight-start
        <Link to={`/editPost/${post.id}`} className="button">
          Edit Post
        </Link>
        // highlight-end
```

### 准备 Action Payloads

我们刚刚看到 `createSlice` 中的 action creator 通常期望一个参数，它变成了 `action.payload`。这简化了最常见的使用模式，但有时我们需要做更多的工作来准备 action 对象的内容。 在我们的 `postAdded` 操作的情况下，我们需要为新帖子生成一个唯一的 ID，我们还需要确保有效负载是一个看起来像 `{id, title, content}` 的对象。

现在，我们正在 React 组件中生成 ID 并创建有效负载对象，并将有效负载对象传递给 `postAdded`。 但是，如果我们需要从不同的组件 dispatch 相同的 action，或者准备负载的逻辑很复杂怎么办？ 每次我们想要 dispatch action 时，我们都必须复制该逻辑，并且我们强制组件确切地知道此 action 的有效负载应该是什么样子。

:::caution 注意

如果 action 需要包含唯一 ID 或其他一些随机值，请始终先生成该随机值并将其放入 action 对象中。 **Reducer 中永远不应该计算随机值**，因为这会使结果不可预测。

:::

如果我们手动编写 `postAdded` 的 action creator，我们可以自己将设置逻辑放在其中：

```js
// hand-written action creator
function postAdded(title, content) {
  const id = nanoid()
  return {
    type: 'posts/postAdded',
    payload: { id, title, content }
  }
}
```

但是，Redux Toolkit 的 `createSlice` 正在为我们生成这些 action creator。这使得代码更短，因为我们不必自己编写它们，但我们仍然需要一种方法来自定义 `action.payload` 的内容。

幸运的是，`createSlice` 允许我们在编写 reducer 时定义一个 `prepare` 函数。  `prepare` 函数可以接受多个参数，生成诸如唯一 ID 之类的随机值，并运行需要的任何其他同步逻辑来决定哪些值进入 action 对象。然后它应该返回一个包含 `payload` 字段的对象。（返回对象还可能包含一个 `meta` 字段，可用于向 action 添加额外的描述性值，以及一个 `error` 字段，该字段应该是一个布尔值，指示此 action 是否表示某种错误。）

在 `createSlice` 的 `reducers` 字段内，我们可以将其中一个字段定义为一个类似于 `{reducer, prepare}` 的对象：

```js title="features/posts/postsSlice.js"
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // highlight-start
    postAdded: {
      reducer(state, action) {
        state.push(action.payload)
      },
      prepare(title, content) {
        return {
          payload: {
            id: nanoid(),
            title,
            content
          }
        }
      }
    }
    // highlight-end
    // other reducers here
  }
})
```

现在我们的组件不必担心 payload 对象是什么样子 - action creator 将负责以正确的方式将它组合在一起。因此，我们可以更新组件代码，以便它在调度 `postAdded` 时传入 `title` 和 `content` 作为参数：

```jsx title="features/posts/AddPostForm.js"
const onSavePostClicked = () => {
  if (title && content) {
    // highlight-next-line
    dispatch(postAdded(title, content))
    setTitle('')
    setContent('')
  }
}
```

## 用户与帖子

到目前为止，我们只有一个状态切片。 逻辑在 `postsSlice.js` 中定义，数据存储在 `state.posts` 中，我们所有的组件都与 posts 功能相关。真实的应用程序可能会有许多不同的状态切片，以及用于 Redux 逻辑和 React 组件的几个不同的“功能文件夹”。

如果没有任何其他人参与，您就无法做出社交媒体。让我们添加在我们的应用程序中跟踪用户列表的功能，并更新与发布相关的功能。

### 添加用户切片

由于“用户”的概念不同于“帖子”的概念，我们希望将用户的代码和数据与帖子的代码和数据分开。我们将添加一个新的 `features/users` 文件夹，并在其中放置一个 `usersSlice` 文件。与帖子切片一样，现在我们将添加一些初始条目，以便我们可以使用数据。

### 添加用户切片

由于“用户”的概念不同于“帖子”的概念，我们希望将用户的代码和数据与帖子的代码和数据分开。我们将添加一个新的 `features/users` 文件夹，并在其中放置一个 `usersSlice` 文件。 与帖子切片一样，现在我们将添加一些初始条目，以便我们可以使用数据。

```js title="features/users/usersSlice.js"
import { createSlice } from '@reduxjs/toolkit'

const initialState = [
  { id: '0', name: 'Tianna Jenkins' },
  { id: '1', name: 'Kevin Grant' },
  { id: '2', name: 'Madison Price' }
]

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {}
})

export default usersSlice.reducer
```

目前，我们不需要实际更新数据，因此我们将 `reducers` 字段保留为空对象。（我们将在后面的部分中回到这一点。）

和以前一样，我们将 `usersReducer` 导入我们的 store 文件并将其添加到 store 设置中：

```js title="app/store.js"
import { configureStore } from '@reduxjs/toolkit'

import postsReducer from '../features/posts/postsSlice'
// highlight-next-line
import usersReducer from '../features/users/usersSlice'

export default configureStore({
  reducer: {
    posts: postsReducer,
    // highlight-next-line
    users: usersReducer
  }
})
```

### 为帖子添加作者

我们应用中的每篇文章都是由我们的一个用户撰写的，每次我们添加新文章时，我们都应该跟踪哪个用户写了该文章。 在一个真正的应用程序中，我们会有某种 `state.currentUser` 字段来跟踪当前登录的用户，并在他们添加帖子时使用该信息。

为了让这个例子更简单，我们将更新我们的 `<AddPostForm>` 组件，以便我们可以从下拉列表中选择一个用户，我们将把该用户的 ID 作为帖子的一部分。一旦我们的帖子对象中有一个用户 ID，我们就可以使用它来查找用户名并在 UI 中的每个单独帖子中显示它。

首先，我们需要更新我们的 `postAdded` action creator 以接受用户 ID 作为参数，并将其包含在 action 中。（我们还将更新 `initialState` 中的现有帖子条目，使其具有包含示例用户 ID 之一的 `post.user` 字段。）

```js title="features/posts/postsSlice.js"
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action) {
        state.push(action.payload)
      },
      // highlight-next-line
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            // highlight-next-line
            user: userId
          }
        }
      }
    }
    // other reducers
  }
})
```

现在，在我们的 `<AddPostForm>` 中，我们可以使用 `useSelector` 从 store 中读取用户列表，并将它们显示为下拉列表。然后我们将获取所选用户的 ID 并将其传递给 `postAdded` 这个 action creator。 在此过程中，我们可以在表单中添加一些验证逻辑，以便用户只能在标题和内容合规时才能单击“保存帖子”按钮：

```jsx title="features/posts/AddPostForm.js"
import React, { useState } from 'react'
// highlight-next-line
import { useDispatch, useSelector } from 'react-redux'

import { postAdded } from './postsSlice'

export const AddPostForm = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  // highlight-next-line
  const [userId, setUserId] = useState('')

  const dispatch = useDispatch()

  // highlight-next-line
  const users = useSelector(state => state.users)

  const onTitleChanged = e => setTitle(e.target.value)
  const onContentChanged = e => setContent(e.target.value)
  // highlight-next-line
  const onAuthorChanged = e => setUserId(e.target.value)

  const onSavePostClicked = () => {
    if (title && content) {
      // highlight-next-line
      dispatch(postAdded(title, content, userId))
      setTitle('')
      setContent('')
    }
  }

  // highlight-start
  const canSave = Boolean(title) && Boolean(content) && Boolean(userId)

  const usersOptions = users.map(user => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))
  // highlight-end

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mind?"
          value={title}
          onChange={onTitleChanged}
        />
        // highlight-start
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {usersOptions}
        </select>
        // highlight-end
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        // highlight-next-line
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  )
}
```

现在，我们需要一种方法来在我们的帖子列表项和 `<SinglePostPage>` 中显示帖子作者的姓名。由于我们想要在多个地方显示相同类型的信息，我们可以创建一个 PostAuthor 组件，它将用户 ID 作为 prop，查找正确的用户对象，并格式化用户名：

```jsx title="features/posts/PostAuthor.js"
import React from 'react'
import { useSelector } from 'react-redux'

export const PostAuthor = ({ userId }) => {
  const author = useSelector(state =>
    state.users.find(user => user.id === userId)
  )

  return <span>by {author ? author.name : 'Unknown author'}</span>
}
```

请注意，我们在每个组件中都遵循相同的模式。任何需要从 Redux store 读取数据的组件都可以使用 `useSelector` 钩子，并提取它需要的特定数据片段。此外，许多组件可以同时访问 Redux store 中的相同数据。

我们现在可以将 `PostAuthor` 组件导入到 `PostsList.js` 和 `SinglePostPage.js` 中，并将其渲染为 `<PostAuthor userId={post.user} />`，并且每次我们添加一个帖子条目时，所选用户的姓名应显示在帖子内。

## 更多帖子功能

此时，我们可以创建和编辑帖子。让我们添加一些额外的逻辑，使我们的帖子提要更有用。

### 存储帖子的日期

社交媒体提要通常按帖子创建时间排序，并向我们显示帖子创建时间作为相对描述，例如“5 小时前”。为此，我们需要开始跟踪帖子条目的“日期”字段。

与 `post.user` 字段一样，我们将更新我们的 `postAdded` prepare 回调，以确保在 dispatch action 时始终包含 `post.date`。然而，它不是将被传入的另一个参数。我们希望始终使用 dispatch action 时的时间戳，因此我们将让 prepare 回调自己处理它。

:::caution 注意

**Redux action 和 state 应该只能包含普通的 JS 值，如对象、数组和基本类型。不要将类实例、函数或其他不可序列化的值放入 Redux！**。

:::

由于我们不能将 Date 类实例放入 Redux store 中，因此我们将跟踪 `post.date` 值作为时间戳字符串：

```js title="features/posts/postsSlice.js"
    postAdded: {
      reducer(state, action) {
        state.push(action.payload)
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            // highlight-next-line
            date: new Date().toISOString(),
            title,
            content,
            user: userId,
          },
        }
      },
    },
```

与帖子作者一样，我们需要在 `<PostsList>` 和 `<SinglePostPage>` 组件中显示相对时间戳描述。我们将添加一个 `<TimeAgo>` 组件来处理格式化时间戳字符串作为相对描述。像 `date-fns` 这样的库有一些有用的工具函数来解析和格式化日期，可以在这里使用：

```jsx title="features/posts/TimeAgo.js"
import React from 'react'
import { parseISO, formatDistanceToNow } from 'date-fns'

export const TimeAgo = ({ timestamp }) => {
  let timeAgo = ''
  if (timestamp) {
    const date = parseISO(timestamp)
    const timePeriod = formatDistanceToNow(date)
    timeAgo = `${timePeriod} ago`
  }

  return (
    <span title={timestamp}>
      &nbsp; <i>{timeAgo}</i>
    </span>
  )
}
```

### 为帖子列表排序

我们的 `<PostsList>` 当前以帖子在 Redux store 中保存的相同顺序显示所有帖子。我们的示例首先包含最旧的帖子，每当我们添加新帖子时，它都会添加到帖子数组的末尾。这意味着最新的帖子总是在页面底部。

通常，社交媒体提要首先显示最新帖子，然后向下滚动以查看旧帖子。即使数据在 store 中是旧的在前，仍然可以在 `<PostsList>` 组件中重新排序数据，以便最新的帖子在最前面。理论上，由于我们知道 `state.posts` 数组已经排序，我们_可以_只反转列表。但是，为了确定起见，最好还是自己进行排序。

由于 `array.sort()` 改变了现有数组，我们需要制作 `state.posts` 的副本并对该副本进行排序。我们知道我们的 `post.date` 字段被保存为日期时间戳字符串，我们可以直接比较它们以按正确的顺序对帖子进行排序：

```jsx title="features/posts/PostsList.js"
// 根据日期时间字符串，对帖子安装时间倒序进行排序
//highlight-start
const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))

const renderedPosts = orderedPosts.map(post => {
  //highlight-end
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
})
```

我们还需要将 `date` 字段添加到 `postsSlice.js` 中的 `initialState`。我们将再次使用 `date-fns` 从当前日期/时间中减去分钟，使它们彼此不同。

```jsx title="features/posts/postsSlice.js"
import { createSlice, nanoid } from '@reduxjs/toolkit'
// highlight-next-line
import { sub } from 'date-fns'

const initialState = [
  {
    // omitted fields
    content: 'Hello!',
    // highlight-next-line
    date: sub(new Date(), { minutes: 10 }).toISOString()
  },
  {
    // omitted fields
    content: '更多',
    // highlight-next-line
    date: sub(new Date(), { minutes: 5 }).toISOString()
  }
]
```

### 为帖子添加反应表情

现在添加一个新功能，我们的帖子有点无聊。我们需要让他们更令人兴奋，还有什么比让我们的朋友在我们的帖子中添加反应表情更好的方法呢？

我们将在 `<PostsList>` 和 `<SinglePostPage>` 的每个帖子底部添加一行表情符号反应按钮。每次用户单击一个反应按钮时，我们都需要更新 Redux store 中该帖子的匹配计数器字段。由于反应计数器数据位于 Redux store 中，因此在应用程序的不同部分之间切换应该在使用该数据的任何组件中始终显示相同的值。

与帖子作者和时间戳一样，我们希望在显示帖子的任何地方使用它，因此我们将创建一个以 `post` 作为 props 的 `<ReactionButtons>` 组件。我们将首先显示里面的按钮，以及每个按钮的当前反应计数：

```jsx title="features/posts/ReactionButtons.js"
import React from 'react'

const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀'
}

export const ReactionButtons = ({ post }) => {
  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button key={name} type="button" className="muted-button reaction-button">
        {emoji} {post.reactions[name]}
      </button>
    )
  })

  return <div>{reactionButtons}</div>
}
```

我们的数据中还没有 `post.reactions` 字段，因此我们需要更新 `initialState` 帖子对象和我们的 `postAdded` prepare 回调函数以确保每个帖子都包含该数据，例如 `反应：{thumbsUp：0，hooray：0}`。

现在，我们可以定义一个新的 reducer，当用户单击反应按钮时，它将处理更新帖子的反应计数。

与编辑帖子一样，我们需要知道帖子的 ID，以及用户点击了哪个反应按钮。我们将让我们的 `action.payload` 成为一个看起来像 `{id, react}` 的对象。 然后，reducer 可以找到正确的 post 对象，并更新正确的反应字段。

```js
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // highlight-start
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.find(post => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    }
    // highlight-end
    // other reducers
  }
})

// highlight-next-line
export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions
```

正如我们已经看到的，`createSlice` 可以让我们在 reducer 中编写“mutable/变异”的逻辑。如果我们不使用 `createSlice` 和 Immer 库，`existingPost.reactions[reaction]++`这行代码确实会改变现有的 `post.reactions` 对象，这可能会导致我们应用程序中其他地方的错误，因为我们没有遵循 reducer 的规则。但是，由于我们_正在_使用 `createSlice`，我们可以以更简单的方式编写这个更复杂的更新逻辑，并让 Immer 完成将这段代码转换为安全不可变更新的工作。

请注意，**action 对象只包含描述发生的事情所需的最少信息**。我们知道我们需要更新哪个帖子，以及点击了哪个反应名称。我们_可以_计算新的反应计数器值并将其放入 action 中，但**保持动作对象尽可能小总是更好，并在 reducer 中进行状态更新计算**。这也意味着 **reducer 中可以包含计算新状态所需的尽可能多的逻辑**。

:::info 说明

使用 Immer 时，您可以“mutate/改变”现有的状态对象，或者自己返回一个新的状态值，但不能同时进行。有关更多详细信息，请参阅有关 [Immer 陷阱](https://immerjs.github.io/immer/pitfalls) 和 [返回新数据](https://immerjs.github.io/immer/return) 的 Immer 文档指南。

:::

最后一步是更新 `<ReactionButtons>` 组件以在用户单击按钮时 dispatch `reactionAdded` action：

```jsx title="features/posts/ReactionButtons.jsx"
import React from 'react'
// highlight-start
import { useDispatch } from 'react-redux'

import { reactionAdded } from './postsSlice'
// highlight-end

const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀'
}

export const ReactionButtons = ({ post }) => {
  // highlight-next-line
  const dispatch = useDispatch()

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type="button"
        className="muted-button reaction-button"
        // highlight-start
        onClick={() =>
          dispatch(reactionAdded({ postId: post.id, reaction: name }))
        }
        // highlight-end
      >
        {emoji} {post.reactions[name]}
      </button>
    )
  })

  return <div>{reactionButtons}</div>
}
```

现在，每次我们点击一个反应按钮时，计数器都会增加。如果我们浏览应用程序的不同部分，我们应该在每次查看此帖子时看到正确的计数器值，即使我们单击 `<PostsList>` 中的反应按钮，然后单独查看该帖子 `<SinglePostPage>`。

## 你学到了

所有这些更改后我们的应用程序长这样：

<iframe
  class="codesandbox"
  src="https://codesandbox.io/embed/github/reduxjs/redux-essentials-example-app/tree/checkpoint-2-reactionButtons/?fontsize=14&hidenavigation=1&theme=dark&runonclick=1"
  title="redux-essentials-example-app"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

它实际上开始看起来更有用和有趣了！

我们在本节中介绍了很多信息和概念。 让我们回顾一下要记住的重要事项：

:::tip 总结

- **任意 React 组件都能从 Redux store 中拿到其需要的数据**
  - 任意组件都能从 Redux Store 中读取任意数据
  - 多个组件可以读取相同的数据，甚至在同一时刻读
  - 组件应该根据其渲染所需，从 Redux Store 中读取最小量的数据
  - 组件可以结合 props, state, Redux store 的数据去渲染。组件可以从 store 中读取多条数据，并根据需要重塑数据以进行显示。
  - 任意组件都能通过 dispatch actions 引发状态更新（state updates）
- **Redux action creators 可以使用一个正确的内容模板去构造（prepare）action 对象**
  - `createSlice` 和 `createAction` 可以接受一个返回 action payload 的 "prepare callback"
  - 诸如唯一的 ID 和一些随机值应该放在 action 里，而不是在 reducer 中去计算
- **Reducers 内（仅）应该包含 state 的更新逻辑**
  - Reducers 内可以包含计算新 state 所需的任意逻辑
  - Action 对象内应该包含足够描述即将发生什么事的信息

:::

## 下一步

到现在为止，您应该已经熟练使用 Redux store 和 React 组件中的数据了。到目前为止，我们只使用了处于初始状态或用户添加的数据。 在 [第五节：异步逻辑和数据获取](./part-5-async-logic.md) 中，我们将了解如何处理来自服务器 API 的数据。
