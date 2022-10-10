---
id: part-3-data-flow
title: 'Redux 循序渐进，第三节：数据流基础'
sidebar_label: '数据流基础'
hide_title: false
description: 'The official Redux Essentials tutorial: learn how data flows in a React + Redux app'
---

import { DetailedExplanation } from '../../components/DetailedExplanation'

# 第三节：数据流基础

:::tip 你将学到

- 如何使用 `createSlice` 将 reducer 逻辑的 “slices” 添加到 Redux store
- 使用 `useSelector` hooks 读取组件中的 Redux 数据
- 使用 `useDispatch` 钩子在组件中 dispatch action

:::

:::info 预置知识

- 熟悉 Redux 核心术语与概念，如 "actions"、"reducers"、"store"、"dispatching"。(参考 [**第一节：Redux 概述和概念**](./part-1-overview-concepts.md) 有这些术语的介绍)

:::

## 简介

在 [第一节：Redux 概述和概念](./part-1-overview-concepts.md) 中，我们研究了 Redux 如何通过为我们提供一个放置全局应用状态的单一中心位置来帮助我们构建可维护的应用程序。我们还讨论了核心的 Redux 概念，例如 dispatch action 对象、使用返回新状态值的 reducer 函数以及使用 thunk 编写异步逻辑。在 [第二节：Redux 应用程序结构](./part-2-app-structure.md) 中，我们看到了像 Redux Toolkit 中的 `configureStore` 和 `createSlice` 以及 React-Redux 中的 `Provider` 和 `useSelector` 这样的 API 共同努力让我们编写 Redux 逻辑并从我们的 React 组件中与该逻辑进行交互。

既然您对这些部分是什么有了一些了解，现在是时候将这些知识付诸实践了。我们将开发一个小型社交媒体信息流应用，其中将包含许多演示一些真实用例的功能。这将帮助您了解如何在您自己的应用程序中使用 Redux。

:::caution 注意

本示例应用程序并不是一个完整的生产就绪项目。目标是帮助您学习 Redux API 和典型的使用模式，并使用一些有限的示例为您指明正确的方向。并且，为了展示更好的开发方式，前面的代码在后面可能会更新使用。请通读整个教程来学习所有概念。

:::

### 项目启动

在本教程中，我们创建了一个预配置的入门项目，该项目已经设置了 React 和 Redux，包括一些默认样式，以及一个允许我们在我们的应用程序中编写实际 API 请求的模拟的 REST API。 您将使用它作为编写实际应用程序代码的基础。

首先，您可以打开并 fork 这个 CodeSandbox：

<iframe
  class="codesandbox"
  src="https://codesandbox.io/embed/github/reduxjs/redux-essentials-example-app/tree/master/?fontsize=14&hidenavigation=1&theme=dark&runonclick=1"
  title="redux-quick-start-example-app"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

您还可以[克隆 Github 上相同的仓库](https://github.com/reduxjs/redux-essentials-example-app)。在克隆之后，您可以使用 `npm install` 来安装依赖，并使用 `npm start` 来启动。

如果您想看到我们要构建的最终版本，您可以切换到[**`tutorial-steps`分支**](https://github.com/reduxjs/redux-essentials-example-app/tree/tutorial-steps)，或[打开 CodeSandbox 中的最终版本](https://codesandbox.io/s/github/duxjs/redux-estials-example-app/tree/tutorial-step)。

> 感谢 [Tania Rascia](https://www.taniarascia.com/), 本节中的例子灵感来源于她的 [在 React 中使用 Redux](https://www.taniarascia.com/redux-react-guide/)。本节的样式还使用了她的 [基本 UI CSS 模版](https://taniarascia.github.io/primitive/)。

#### 创建 Redux + React 项目

完成本教程后，你可能希望开始自己的项目。**我们建议你使用 [Create-React-App 的 Redux 模版](https://github.com/reduxjs/cra-template-redux) 作为创建 React + Redux 项目的快捷方式**。它内置了配置好的 Redux Tookit 和 React-Redux，使用您在第一节中看到的相同[“计数器”应用程序示例](./part-1-overview-concepts.md)。这使您可以跳转到编写实际应用程序代码，而无需添加 Redux 软件包并设置 store。

如果您想了解有关如何将 Redux 添加到项目的特定详细信息，请参阅此说明：

<DetailedExplanation title="细节说明：为 React 项目添加 Redux">

CRA（Create-React-App）的 Redux 模板附带 Redux Toolkit 并已配置 React-Redux。如果您在没有该模板的情况下从头开始设置新项目，请按照下列步骤操作：

- 添加 `@reduxjs/toolkit` 和 `react-redux` packages
- 使用 RTK 的 `configureStore` API 创建 Redux store，并传入至少一个 reducer 函数。
- 在应用程序的入口文件（比如 `src/index.js`）中引入 Redux store。
- 用 react-redux 中的 `<Provider>` 组件来包裹 React 根组件，比如

```jsx
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

</DetailedExplanation>

#### 探索初始项目

让我们快速查看初始项目包含的内容：

- `/src`
  - `index.js`: 应用程序的入口点文件，渲染 React-Redux 的 `<Provider>`组件和入口组件 `<app>`。
  - `App.js`: 应用的入口组件。渲染顶部导航条和处理客户端路由。
  - `index.css`: 应用所有的样式
  - `/api`
    - `client.js`: 小的 AJAX 请求客户端，用来发起 GET 和 POST 请求。
    - `server.js`: 为我们的数据提供模拟的的 REST API。我们的应用程序将在稍后从这些模拟的接口获取数据。
  - `/app`
    - `Navbar.js`: 渲染顶部标题和导航
    - `store.js`: 创建 Redux store 实例

如果您现在加载应用程序，您应该会看到标题和欢迎消息。我们还可以打开 Redux DevTools Extension，看到我们的初始 Redux 状态完全为空。

有了这个，让我们开始吧！

## 主页的文章列表

我们社交媒体提要应用程序的主要功能将是文章列表。 随着我们的进展，我们将为此功能添加更多部分，但首先，我们的第一个目标是仅在屏幕上显示文章条目列表。

### 创建文章列表 slice

第一步是创建一个新的 Redux “slice”，其中将包含我们文章的数据。一旦我们在 Redux store 中拥有该数据，我们就可以创建 React 组件以在页面上显示该数据。

在 `src` 目录下，创建 `features` 目录，然后在里面创建 `posts` 目录，并在里面创建 `postSlice.js` 文件。

我们将使用 Redux Toolkit `createSlice` 函数来创建一个知道如何处理我们的文章数据的 reducer 函数。 Reducer 函数需要包含一些初始数据，以便 Redux store 在应用程序启动时加载这些值。

现在，我们将创建一个包含一些模拟的文章对象的数组，以便我们可以开始添加 UI。

我们将导入 `createSlice`，定义我们的初始 posts 数组，将其传递给 `createSlice`，并导出`createSlice` 为我们生成的 posts reducer 函数：

```js title="features/posts/postsSlice.js"
import { createSlice } from '@reduxjs/toolkit'

const initialState = [
  { id: '1', title: 'First Post!', content: 'Hello!' },
  { id: '2', title: 'Second Post', content: 'More text' }
]

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {}
})

export default postsSlice.reducer
```

每次我们创建一个新 slice 时，我们都需要将它的 reducer 函数添加到我们的 Redux store 中。我们已经创建了一个 Redux store，但现在它里面没有任何数据。 打开 `app/store.js`，导入 `postsReducer` 函数，并更新对 `configureStore` 的调用，以便将 `postsReducer` 作为名为 `posts` 的 reducer 字段传递：

```js title="app/store.js"
import { configureStore } from '@reduxjs/toolkit'

import postsReducer from '../features/posts/postsSlice'

export default configureStore({
  reducer: {
    posts: postsReducer
  }
})
```

这告诉 Redux 我们希望我们的根部 state 对象内部有一个名为 `posts` 的字段，并且 `state.posts` 的所有数据都将在 dispatch action 时由 `postsReducer` 函数更新。

我们可以通过打开 Redux DevTools Extension 并查看当前状态内容来确认这是否有效：

![初始的文章数据](/img/tutorials/essentials/example-initial-posts.png)

### 展示文章列表

现在我们的商店中有一些文章数据，我们可以创建一个显示文章列表的 React 组件。 所有与我们的提要文章功能相关的代码都应该放在 `posts` 文件夹中，所以继续在那里创建一个名为 `PostsList.js` 的新文件。

如果我们要呈现一个文章列表，我们需要从某个地方获取数据。React 组件可以使用 React-Redux 库中的 `useSelector` 钩子从 Redux store 中读取数据。您编写的“selector 函数”将使用整个 Redux `state` 对象作为参数被调用，并且应该从 store 中返回该组件需要的特定数据。

我们最初的 `PostsList` 组件将从 Redux store 中读取 `state.posts` 值，然后遍历文章数组并在屏幕上显示每个文章：

```jsx title="features/posts/PostsList.js"
import React from 'react'
import { useSelector } from 'react-redux'

export const PostsList = () => {
  const posts = useSelector(state => state.posts)

  const renderedPosts = posts.map(post => (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <p className="post-content">{post.content.substring(0, 100)}</p>
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

然后我们需要更新 `App.js` 中的路由，以便我们显示 `PostsList` 组件而不是“欢迎”消息。将`PostsList` 组件导入`App.js`，并将欢迎文本替换为`<PostsList />`。 我们还将把它包装在一个 React Fragment 中，因为我们很快就会向主页添加其他内容：

```jsx title="App.js"
import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'

import { Navbar } from './app/Navbar'

// highlight-next-line
import { PostsList } from './features/posts/PostsList'

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
              // highlight-start
              <React.Fragment>
                <PostsList />
              </React.Fragment>
              // highlight-end
            )}
          />
          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  )
}

export default App
```

添加后，我们应用程序的主页现在应如下所示：

![初始文章列表](/img/tutorials/essentials/working_post_list.png)

进步！ 我们已经向 Redux store 添加了一些数据，并在 React 组件的屏幕上显示它。

### 添加新文章

很高兴看到人们写的文章，但我们希望能够编写自己的文章。让我们创建一个“添加新文章”表单，让我们可以编写文章并保存它们。

我们将首先创建空表单并将其添加到页面中。 然后，我们会将表单连接到我们的 Redux store，以便在我们单击“保存文章”按钮时添加新文章。

#### 添加新文章的表单 Form

在我们的 `posts` 文件夹中创建 `AddPostForm.js`。我们将为文章标题添加一个文本输入，并为文章正文添加一个文本区域：

```jsx title="features/posts/AddPostForm.js"
import React, { useState } from 'react'

export const AddPostForm = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const onTitleChanged = e => setTitle(e.target.value)
  const onContentChanged = e => setContent(e.target.value)

  return (
    <section>
      <h2>添加新文章</h2>
      <form>
        <label htmlFor="postTitle">文章标题:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
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
        <button type="button">保存文章</button>
      </form>
    </section>
  )
}
```

将该组件导入`App.js`，并将其添加到`<PostsList />` 组件的正上方：

```jsx title="App.js"
<Route
  exact
  path="/"
  render={() => (
    <React.Fragment>
      // highlight-next-line
      <AddPostForm />
      <PostsList />
    </React.Fragment>
  )}
/>
```

您应该会看到该表单显示在页眉正下方。

#### 保存文章

现在，让我们更新我们的文章 slice 以向 Redux store 添加新的文章条目。

我们的文章 slice 负责处理文章数据的所有更新。在 `createSlice` 调用内部，有一个名为 `reducers` 的对象。现在，它是空的。我们需要在里面添加一个 reducer 函数来处理添加文章的情况。

在 `reducers` 内部，添加一个名为 `postAdded` 的函数，它将接收两个参数：当前的 `state` 值和被 dispatched 的 `action` 对象。由于文章 `postsSlice` _只_ 知道它负责的数据，所以 `state` 参数将是 posts 数组本身，而不是整个 Redux 状态对象。

`action` 对象将我们的新文章条目作为 `action.payload` 字段，我们将把新的文章对象放入 `state` 数组中。

当我们编写 `postAdded` reducer 函数时，`createSlice` 会自动生成一个同名的 “action creator” 函数。我们可以导出该动作创建者并在我们的 UI 组件中使用它来在用户单击“保存文章”时分派动作。

```js title="features/posts/postsSlice.js"
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // highlight-start
    postAdded(state, action) {
      state.push(action.payload)
    }
    // highlight-end
  }
})

// highlight-next-line
export const { postAdded } = postsSlice.actions

export default postsSlice.reducer
```

:::caution 警告

请记住：**reducer 函数必须*总是*通过复制来不可变地创建新的状态值！** 调用诸如 `Array.push()` 之类的变异函数或修改 `createSlice()` 中的诸如 `state.someField = someValue` 之类的对象字段是安全的，因为它使用 Immer 库在内部将这些突变转换为安全的不可变更新，但**不要尝试在 `createSlice` 之外更改任何数据！**
:::

#### Dispatch "添加文章" Action

我们的 `AddPostForm` 有文本输入和 “Save Post” 按钮，但该按钮还没有做任何事情。 我们需要添加一个点击处理程序，它将 dispatch `postAdded` 并传入一个包含用户编写的标题和内容的新文章对象。

我们的 post 对象也需要有一个 `id` 字段。现在，我们最初的测试文章使用了一些模拟的数字作为他们的 ID。 我们可以编写一些代码来确定下一个递增的 ID 编号应该是什么，但是如果我们生成一个随机的唯一 ID 会更好。Redux Toolkit 有一个我们可以使用的 `nanoid` 函数。

:::info 说明

我们将在 [第四节：使用 Redux 数据](./part-4-using-data.md) 中详细讨论生成 ID 和 dispatch action。

:::

为了从组件 dispatch action，我们需要访问 store 的 `dispatch` 函数。我们通过调用 React-Redux 中的 `useDispatch` 钩子来获得它。我们还需要将 `postAdded` 动作创建者导入到这个文件中。

一旦我们在组件中使用了 `dispatch` 函数，我们就可以在点击处理程序中调用 `dispatch(postAdded())`。 我们可以从我们的 React 组件 `useState` 钩子中获取标题和内容值，生成一个新的 ID，并将它们放在一个新的 post 对象中，我们将其传递给 `postAdded()`。

```jsx title="features/posts/AddPostForm"
import React, { useState } from 'react'
// highlight-start
import { useDispatch } from 'react-redux'
import { nanoid } from '@reduxjs/toolkit'

import { postAdded } from './postsSlice'
// highlight-end

export const AddPostForm = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  // highlight-next-line
  const dispatch = useDispatch()

  const onTitleChanged = e => setTitle(e.target.value)
  const onContentChanged = e => setContent(e.target.value)

  // highlight-start
  const onSavePostClicked = () => {
    if (title && content) {
      dispatch(
        postAdded({
          id: nanoid(),
          title,
          content
        })
      )

      setTitle('')
      setContent('')
    }
  }
  // highlight-end

  return (
    <section>
      <h2>添加新文章</h2>
      <form>
        {/* omit form inputs */}
        // highlight-next-line
        <button type="button" onClick={onSavePostClicked}>
          保存文章
        </button>
      </form>
    </section>
  )
}
```

现在，尝试输入标题和一些文本，然后单击“保存文章”。 您应该会在文章列表中看到该文章的新项目。

**恭喜！你刚刚构建了你的第一个 React + Redux 应用程序！**

这显示了完整的 Redux 数据流周期：

- 使用 `useSelector` 从 store 读取初始文章列表并渲染 UI
- 我们 dispatch 了包含新文章条目数据的 `postAdded` action
- `postsReducer` 监听到了 `postAdded` 动作，并用新条目更新了 posts 数组
- Redux store 告诉 UI 一些数据已经改变
- 文章列表读取更新后的文章数组，并重新渲染 UI 以显示新文章

在此之后我们将添加的所有新功能都将遵循相同的这个模式：添加状态 slice、编写 reducer 函数、dispatch action 以及基于 Redux store 中的数据渲染 UI。

我们可以检查 Redux DevTools Extension 以查看我们 dispatch 的 action，并查看 Redux 状态如何更新以响应该操作。如果我们单击操作列表中的 `posts/postAdded` 条目，"Action" 选项卡应如下所示：

![postAdded action 信息](/img/tutorials/essentials/example-postAdded-action.png)

“Diff” 选项卡还应该向我们显示 `state.posts` 添加了一个新项目，位于索引 2。

请注意，我们的 `AddPostForm` 组件内部有一些 React `useState` 钩子，用于跟踪用户输入的标题和内容值。记住，**Redux store 应该只包含被认为是应用程序“全局”的数据!** 在这种情况下，只有 `AddPostForm` 需要知道输入字段的最新值，因此我们希望将该数据保留在 React 组件状态中，而不是尝试将临时数据保留在 Redux store 中。当用户完成表单时，我们会 dispatch 一个 Redux action，根据用户输入使用最终值更新 store。

## 你学到了

让我们回顾一下您在本节中学到的内容：

:::tip 总结

- **Redux state 由 reducer 函数来更新**:
  - Reducers 总是通过复制现有状态值，更新副本来*不可变地*生成新状态
  - Redux Toolkit `createSlice` 函数为您生成“slice reducer”函数，并让您编写 “mutable 可变”代码，内部自动将其转变为安全的不可变更新
  - 这些 slice 化 reducer 函数被添加到 `configureStore` 中的 `reducer` 字段中，并定义了 Redux store 中的数据和状态字段名称
- **React 组件使用 `useSelector` 钩子从 store 读取数据**
  - 选择器函数接收整个 `state` 对象，并且返回需要的部分数据
  - 每当 Redux store 更新时，选择器将重新运行，如果它们返回的数据发生更改，则组件将重新渲染
- **React 组件使用 `useDispatch` 钩子 dispatch action 来更新 store**
  - `createSlice` 将为我们添加到 slice 的每个 reducer 函数生成 action creator 函数
  - 在组件中调用 `dispatch(someActionCreator())` 来 dispatch action
  - Reducers 将运行，检查此 action 是否相关，并在适当时返回新状态
  - 表单输入值等临时数据应保留为 React 组件状态。当用户完成表单时，dispatch 一个 Redux action 来更新 store。

:::

现在应用长这样：

<iframe
  class="codesandbox"
  src="https://codesandbox.io/embed/github/reduxjs/redux-essentials-example-app/tree/checkpoint-1-postAdded/?fontsize=14&hidenavigation=1&theme=dark&runonclick=1"
  title="redux-quick-start-example-app"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

## 下一步

现在你已经了解 Redux 数据流基础，是时候打开 [第 4 节: 使用 Redux 数据](./part-4-using-data.md)，学习给应用添加更多功能并且学习如何与现有 store 中的数据做交互。
