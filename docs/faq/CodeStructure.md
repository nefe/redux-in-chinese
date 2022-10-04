---
id: 代码结构
title: 代码结构
hide_title: false
---

import { DetailedExplanation } from '../components/DetailedExplanation'

# Redux FAQ: 代码结构

## 目录

- [我的文件结构应该是什么样的？应该如何在项目中对 action creator 和 reducer 进行分组？ selector 应该放在哪里？](#what-should-my-file-structure-look-like-how-should-i-group-my-action-creators-and-reducers-in-my-project-where-should-my-selectors-go)
- [我应该如何在 reducer 和 action creator 之间划分逻辑？“业务逻辑”应该放在哪里？](#how-should-i-split-my-logic-between-reducers-and-action-creators-where-should-my-business-logic-go)
- [为什么我应该使用 action creator ？](#why-should-i-use-action-creators)
- [websockets 和其他持久连接应该在哪里？](#where-should-websockets-and-other-persistent-connections-live)
- [如何在非组件文件中使用 Redux store？](#how-can-i-use-the-redux-store-in-non-component-files)

## 我的文件结构应该是什么样的？应该如何在项目中对 action creator 和 reducer 进行分组？selector应该放在哪里？

由于 Redux 只是一个数据存储库，对于项目的结构没有直接的意见。但是，有一些大多数 Redux 开发人员倾向于使用的常见模式：

- Rails 样式：“actions”、“constants”、“reducers”、“containers”和“components”的单独文件夹
-“功能文件夹”/“域”样式：每个功能或域的单独文件夹，每个文件类型可能带有子文件夹
- “Ducks/Slices”：类似于领域风格，但明确地将 reducer 和 action 绑定在一起，通常通过在同一个文件中定义它们

通常建议 selector 与 reducer 一起定义并导出，然后在其他地方重用（例如在 `mapStateToProps` 函数、异步操作创建器或 sagas 中）以将所有知道状态树实际形状的代码放在 reducer 文件中。

:::tip

**我们特别建议将你的逻辑组织到“功能文件夹”中，将给定功能的所有 Redux 逻辑都放在一个“Ducks/Slices”文件中"**.

有关示例，请参见本节：

<DetailedExplanation title="Detailed Explanation: Example Folder Structure">
示例文件夹结构可能类似于：

- `/src`
  - `index.tsx`: React 组件树的入口点文件
  - `/app`
    - `store.ts`: store 设置
    - `rootReducer.ts`: 根 reducer (可选择的)
    - `App.tsx`: 根 React 组件
  - `/common`: hooks, 通用组件, utils, 等
  - `/features`: 包含所有“功能文件夹”
    - `/todos`: 单个功能文件夹
      - `todosSlice.ts`: Redux reducer 逻辑和相关操作
      - `Todos.tsx`: 一个 React 组件

`/app` 包含依赖于所有其他文件夹的应用程序范围的设置和布局。

`/common` 包含真正通用和可重用的实用程序和组件。

`/features` 具有包含与特定功能相关的所有功能的文件夹。 在此示例中，`todosSlice.ts` 是一个 “duck” 风格的文件，其中包含对 RTK 的`createSlice()` 函数的调用，并导出切片 reducer 和 action creator。

</DetailedExplanation>

:::

虽然最终如何在磁盘上布置代码并不重要，但重要的是要记住不应孤立地考虑 action 和 reducer。 一个文件夹中定义的 reducer 完全有可能（并且鼓励）响应另一个文件夹中定义的 action。

#### 更多信息

**文档**

- [Style Guide: 使用单文件逻辑将文件结构作为功能文件夹](../style-guide/style-guide.md##structure-files-as-feature-folders-with-single-file-logic)
- [Redux Essentials tutorial: App Structure](../tutorials/essentials/part-2-app-structure.md)
- [FAQ: Actions - “reducer 和 action 之间的 1:1 映射？”](./Actions.md#actions-reducer-mappings)

**文章**

- [如何扩展 React 应用程序](https://www.smashingmagazine.com/2016/09/how-to-scale-react-applications/) (accompanying talk: [Scaling React Applications](https://vimeo.com/168648012))
- [Redux 最佳实践](https://medium.com/lexical-labs-engineering/redux-best-practices-64d59775802e)
- [结构化 (Redux) 应用程序的规则](http://jaysoo.ca/2016/02/28/organizing-redux-application/)
- [为 React/Redux 应用程序提供更好的文件结构](https://marmelab.com/blog/2015/12/17/react-directory-structure.html)
- [组织大型 React 应用程序](http://engineering.kapost.com/2016/01/organizing-large-react-applications/)
- [组织代码的四种策略](https://medium.com/@msandin/strategies-for-organizing-code-2c9d690b6f33)
- [封装 Redux 状态树](https://randycoulman.com/blog/2016/09/13/encapsulating-the-redux-state-tree/)
- [非对称 Redux Reducer/Selector](https://randycoulman.com/blog/2016/09/20/redux-reducer-selector-asymmetry/)
- [模块化 Reducers and Selectors](https://randycoulman.com/blog/2016/09/27/modular-reducers-and-selectors/)
- [我的 React/Redux 可维护项目结构之旅](https://medium.com/@mmazzarolo/my-journey-toward-a-maintainable-project-structure-for-react-redux-b05dfd999b5)
- [React/Redux Links: 架构 - 项目文件结构](https://github.com/markerikson/react-redux-links/blob/master/react-redux-architecture.md#project-file-structure)

**讨论**

- [#839: 强调在 reducer 旁边定义 selector](https://github.com/reduxjs/redux/issues/839)
- [#943: Reducer querying](https://github.com/reduxjs/redux/issues/943)
- [React Boilerplate #27: Application Structure](https://github.com/mxstbr/react-boilerplate/issues/27)
- [Stack Overflow: 如何构建 Redux 组件/容器](https://stackoverflow.com/questions/32634320/how-to-structure-redux-components-containers/32921576)
- [Twitter: Redux 没有终极的文件结构](https://twitter.com/dan_abramov/status/783428282666614784)

## 我应该如何在 reducer 和 action creator 之间划分逻辑？“业务逻辑”应该放在哪里？

对于 reducer 或 action creator 中应该包含哪些逻辑，没有一个明确的答案。 一些开发人员更喜欢拥有 “fat” 的 action creator，而 “thin” 的 reducer 只是简单地将 action 中的数据合并到相应的 state 中。 其他人试图强调保持action 尽可能小，并尽量减少在 action creator 使用 `getState()`。 （对于这个问题，其他异步方法，如 sagas 和 observables 属于 “action creator” 类别。）

将更多逻辑放入 reducer 有几个潜在的好处。 action 类型可能会更语义化和更有意义（例如 `"USER_UPDATED"` 而不是 `"SET_STATE"`）。 此外，在 reducer 中有更多的逻辑意味着更多的功能会受到时间旅行调试的影响。

这条评论很好地总结了二分法：

> 现在，问题是在 action creator 中放入什么，在 reducer 中放入什么，在 “fat” action 对象和 “thin” action 对象之间进行选择。 如果你把所有的逻辑都放在 action creator 中，你最终会得到基本上声明 state 更新的 “fat” action creator 对象。 Reducers 变得纯粹、傻瓜式、添加这个、删除那个、更新这些功能。 他们将很容易组成。 但是你的业务逻辑并不多。
> 如果你在 reducer 中加入更多逻辑，你最终会得到漂亮、精简的 action 对象，大部分数据逻辑都在一个地方，但是你的 reducer 更难组合，因为你可能需要来自其他分支的信息。 您最终会得到大型 reducer 或从该州更高层获取额外参数的 reducer。

:::tip

**建议将尽可能多的逻辑放入 reducer**. 有时您可能需要一些逻辑来帮助准备 action 中的内容，但 reducer 应该完成大部分工作。

:::

#### 更多的信息

**文档**

- [Style Guide: 在 Reducer 中尽可能多地添加逻辑](../style-guide/style-guide.md#put-as-much-logic-as-possible-in-reducers)
- [Style Guide: 将 Actions 作为 “Events”, 而不是 “Setters”](../style-guide/style-guide.md#model-actions-as-events-not-setters)

**文章**

- [我应该将业务逻辑放在 React/Redux 应用程序的什么位置？](https://medium.com/@jeffbski/where-do-i-put-my-business-logic-in-a-react-redux-application-9253ef91ce1)
- [如何扩展 React 应用程序](https://www.smashingmagazine.com/2016/09/how-to-scale-react-applications/)
- [Redux 之道，第 2 部分 - 实践与哲学。 厚重和轻量的 reducer。](https://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-2/#thick-and-thin-reducers)

**讨论**

- [在 action creator 中放置过多的逻辑会如何影响调试](https://github.com/reduxjs/redux/issues/384#issuecomment-127393209)
- [#384:reducer 中的内容越多，您可以通过时间旅行重播的内容越多](https://github.com/reduxjs/redux/issues/384#issuecomment-127393209)
- [#1165: 在哪里放置业务逻辑/验证？](https://github.com/reduxjs/redux/issues/1165)
- [#1171: 关于 action-creator、reducer 和 selector 的最佳实践建议](https://github.com/reduxjs/redux/issues/1171)
- [Stack Overflow: 在 action-creator 中访问 Redux state？](https://stackoverflow.com/questions/35667249/accessing-redux-state-in-an-action-creator/35674575)
- [#2796: 明确“业务逻辑”](https://github.com/reduxjs/redux/issues/2796#issue-289298280)
- [Twitter: 远离不明确的术语...](https://twitter.com/FwardPhoenix/status/952971237004926977)

## 为什么应该使用 action creator？

Redux 不需要 action creator。 您可以以任何最适合您的方式自由创建 action，包括简单地将对象文字传递给 `dispatch`。 action creator从 [Flux 架构](https://facebook.github.io/react/blog/2014/07/30/flux-actions-and-the-dispatcher.html#actions-and-actioncreators) 中出现并被 Redux 社区采用，因为它们提供了几个好处。

Action creator 更易于维护。可以在一个地方对 action 进行更新，并在任何地方应用。 保证 action 的所有实例具有相同的状态和相同的默认值。

Action creator 是可测试的。必须手动验证内联 action 的正确性。 与任何函数一样，action creator 的测试可以编写一次并自动运行。

Action creator 更容易记录。Action creator 的参数枚举 action 的依赖关系。action 定义的集中化为文档注释提供了一个方便的地方。内联编写 action 时，这些信息更难捕获和交流。

Action creator 是一个更强大的抽象。 创建 action 通常涉及转换数据或发出 AJAX 请求。 Action creator 为这种不同的逻辑提供了统一的接口。 这种抽象释放了一个组件来 dispatch 一个动作，而不会因为该 action 的创建细节而变得复杂。

#### 更多信息

**文章**

- [惯用的 Redux：为什么使用 action creator ？](https://blog.isquaredsoftware.com/2016/10/idiomatic-redux-why-use-action-creators/)

**Discussions**

- [Reddit: Redbox - 使 Redux action 创建变得简单](https://www.reddit.com/r/reactjs/comments/54k8js/redbox_redux_action_creation_made_simple/d8493z1/?context=4)

## Websockets 和其他持久连接应该放在哪里？

Middleware 是 Redux 应用程序中持续连接（如 websockets）的正确位置，原因如下：

- Middleware 存在于应用程序的生命周期中
- 与 store 本身一样，你可能只需要整个应用程序中可以使用的给定连接的单个实例
- Middleware 可以看到所有 dispatch 的 action 和自己 dispatch 的 action 。 这意味着 middleware 可以采取 dispatch 的 action 并将其转换为通过 websocket 发送的消息，并在通过 websocket 接收到消息时 dispatch 新的 action。
- websocket 连接实例不可序列化，因此[它不属于 store state 本身](/faq/organizing-state#organizing-state-non-serializable)

请参阅 [此示例显示 socket middleware 如何 dispatch 和响应 Redux action](https://gist.github.com/markerikson/3df1cf5abbac57820a20059287b4be58).

有许多用于 websocket 和其他类似连接的现有 middleware - 请参阅下面的链接。

**库**

- [Middleware: Socket and Adapters](https://github.com/markerikson/redux-ecosystem-links/blob/master/middleware-sockets-adapters.md)

## 如何在非组件文件中使用 Redux store？

每个应用程序应该只有一个 Redux store。 这使得它在应用程序架构方面实际上是一个单例。 与 React 一起使用时，通过在根 `<App>` 组件周围渲染 `<Provider store={store}>`，将 store 在运行时注入到组件中，因此只有应用程序设置逻辑需要直接导入 store。

但是，有时代码库的其他部分也需要与 store 交互。

**您应该避免将 store 直接导入其他代码库文件**. 虽然它在某些情况下可能会起作用，但这通常会导致循环导入依赖错误。

一些可能的解决方案：

- 将依赖于 store 的逻辑编写为 thunk，然后从组件中 dispatch 该 thunk。
- 将组件中对 “dispatch” 的引用作为相关函数的参数传递。
- 将逻辑编写为 middleware，并在设置时将它们添加到 store 中。
- 在创建应用程序时将 store 实例注入相关文件。

一个常见的用例是在 Axios 拦截器内部读取 API 授权信息，例如来自 Redux state 的令牌。 拦截器文件需要引用 `store.getState()`，还需要导入API层文件，导致循环导入。

您可以从拦截器文件中暴露一个 `injectStore` 函数：

```js title="common/api.js"
let store

export const injectStore(_store) {
  store = _store
}

axiosInstance.interceptors.request.use(
  config => {
    config.headers.authorization = store.getState().auth.token
    return config;
  }
)
```

然后，在你的入口点文件中，将 store 注入 API 设置文件：

```js title="index.js"
import store from "./app/store".
import {injectStore} from "./common/api";
injectStore(store);
```

这样，应用程序设置是唯一必须导入 store 的代码，文件依赖图避免了循环依赖。
