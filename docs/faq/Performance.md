---
id: performance
title: Performance
sidebar_label: Performance
---

# Redux 常见问答：性能

## 目录

- [Redux 常见问答：性能](#redux-faq-performance)
  - [目录](#table-of-contents)
  - [性能](#performance)
    - [Redux 在性能和架构方面的“扩展性”如何？](#how-well-does-redux-scale-in-terms-of-performance-and-architecture)
      - [更多信息](#further-information)
    - [为每个 action 调用“所有的 reducers” 会不会很慢？](#wont-calling-all-my-reducers-for-each-action-be-slow)
      - [更多信息](#further-information-1)
    - [必须在 reducer 中深拷贝 state 吗？拷贝 state 不会很慢吗？](#do-i-have-to-deep-clone-my-state-in-a-reducer-isnt-copying-my-state-going-to-be-slow)
      - [更多信息](#further-information-2)
    - [如何减少 store 更新事件的数量？](#how-can-i-reduce-the-number-of-store-update-events)
      - [更多信息](#further-information-3)
    - [“单状态树”会导致内存问题吗？Dispatch 很多 actions 会占用内存吗？](#will-having-one-state-tree-cause-memory-problems-will-dispatching-many-actions-take-up-memory)
      - [更多信息](#further-information-4)
    - [缓存远端数据会导致内存问题吗？](#will-caching-remote-data-cause-memory-problems)
      - [更多信息](#further-information-5)

## 性能

### Redux 在性能和架构方面的“扩展性”如何？

虽然对此没有一个明确的答案，但在大多数情况下，这两种情况都不应该成为问题。

Redux 所做的工作通常分为几个方面：在 middleware 和 reducers 中处理 actions（包括不可变更新的对象复制），在 dispatch actions 后通知订阅者，以及根据 state 变化更新 UI 组件。虽然在足够复杂的情况下，其中的每一个都 _可能_ 产生性能问题，但 Redux 的实现方式并没有天生的缓慢或低效。事实上，特别是 React Redux 进行了大量优化以减少不必要的重新渲染，并且 React-Redux v5 与早期版本相比有明显的改进。

与其他库相比，Redux 可能没有开箱即用的效率。为了在 React 应用程序中获得最大的渲染性能，state 应该以归一化的状态来存储，大多数（而不是少数几个）单独的组件都应该连接到 store，连接的列表组件应该将项目 ID 传递给它们的连接子列表项（允许列表项通过按 ID 查找数据）。这最大限度地减少了渲染总量。使用记忆 selector 函数也是一个重要的性能考虑因素。

至于架构，轶事证据表明 Redux 适用于不同的项目和团队规模。Redux 目前被许许多多的公司和成千上万的开发人员使用，NPM 月均安装数达十多万。一位开发人员报告显示：

> 规模上，我们有大约 500 个 action types、大约 400 个 reducer cases、大约 150 个组件、5 个 middleware、大约 200 个 actions、大约 2300 个测试

#### 更多信息

**文档**

- [Redux 使用指南：结构化 Reducers——归一化 State](../usage/structuring-reducers/NormalizingStateShape.md)

**文章**

- [如何扩展 React 应用程序](https://www.smashingmagazine.com/2016/09/how-to-scale-react-applications/) (随谈：[扩展 React 应用程序](https://vimeo.com/168648012))
- [高性能 Redux](https://somebody32.github.io/high-performance-redux/)
- [使用 Reselect 改进 React 和 Redux Perf](https://blog.rangle.io/react-and-redux-performance-with-reselect/)
- [封装 Redux State 树](https://randycoulman.com/blog/2016/09/13/encapsulating-the-redux-state-tree/)
- [React/Redux 链接：性能——Redux](https://github.com/markerikson/react-redux-links/blob/master/react-performance.md#redux-performance)

**讨论**

- [#310：谁需要使用 Redux？](https://github.com/reduxjs/redux/issues/310)
- [#1751：性能问题大合集](https://github.com/reduxjs/redux/issues/1751)
- [React Redux #269：Connect 可能可以与自定义订阅方法一起使用](https://github.com/reduxjs/react-redux/issues/269)
- [React Redux #407：重写 connect 以提供高级 API](https://github.com/reduxjs/react-redux/issues/407)
- [React Redux #416：重写 connect 以获得更好的性能和可扩展性](https://github.com/reduxjs/react-redux/pull/416)
- [Redux 与 MobX TodoMVC 基准测试：#1](https://github.com/mweststrate/redux-todomvc/pull/1)
- [Reddit：保存初始 state 的最佳位置是什么？](https://www.reddit.com/r/reactjs/comments/47m9h5/whats_the_best_place_to_keep_the_initial_state/)
- [Reddit：有助于设计单页应用的 Redux state](https://www.reddit.com/r/reactjs/comments/48k852/help_designing_redux_state_for_a_single_page/)
- [Reddit：大型 state 对象导致的 Redux 性能问题？](https://www.reddit.com/r/reactjs/comments/41wdqn/redux_performance_issues_with_a_large_state_object/)
- [Reddit：用于超大规模应用的 React/Redux](https://www.reddit.com/r/javascript/comments/49box8/reactredux_for_ultra_large_scale_apps/)
- [Twitter：Redux 扩展](https://twitter.com/NickPresta/status/684058236828266496)
- [Twitter：Redux 与 MobX 基准图——Redux state 结构很重要](https://twitter.com/dan_abramov/status/720219615041859584)
- [Stack Overflow：如何优化嵌套组件里 props 的很小改动？](https://stackoverflow.com/questions/37264415/how-to-optimize-small-updates-to-props-of-nested-component-in-react-redux)
- [聊天记录：React/Redux perf——更新 10K 项目的 Todo 列表](https://gist.github.com/markerikson/53735e4eb151bc228d6685eab00f5f85)
- [聊天记录：React/Redux perf——单连接 vs 多连接](https://gist.github.com/markerikson/6056565dd65d1232784bf42b65f8b2ad)

### 为每个 action 调用“所有的 reducers” 会不会很慢？

需要注意的是，一个 Redux store 实际上只有一个 reducer 函数。Store 将当前 state 和 dispatch 的 action 传递给该 reducer 函数，并让 reducer 适当地处理一些事情。

显然，仅就函数大小和可读性而言，尝试在单个函数中处理所有可能的 action 并不能很好地扩展，因此将实际工作拆分为可由顶级 reducer 调用的单独函数是有意义的。特别是，常见的建议模式是让一个单独的 sub-reducer 函数，负责管理对特定键的特定 state slice 的更新。Redux 附带的 `combineReducers()` 是实现这一目标的众多可行方法之一。我们还强烈建议保持你的 store state 尽可能扁平化和归一化。但最终，由你自己掌管组织 reducer 逻辑的方式。

但是，即使你碰巧将许多不同的 reducer 功能组合在一起，并且甚至 state 嵌套很深，reducer 的速度也不太可能会成为问题。JavaScript 引擎每秒能够运行大量的函数调用，并且你的大多数 reducer 可能只是使用 switch 语句并默认返回现有 state 以响应大多数 actions 的简单函数。

如果你真的关心 reducer 的性能，你可以使用 [redux-ignore](https://github.com/omnidan/redux-ignore) 或 [reduxr-scoped-reducer](https://github.com/chrisdavies/reduxr-scoped-reducer) 以确保只有某些 reducer 监听特定的 actions。你也可以使用 [redux-log-slow-reducers](https://github.com/michaelcontento/redux-log-slow-reducers) 做一些性能基准测试。

#### 更多信息

**讨论**

- [#912：提案：action 过滤器实用程序](https://github.com/reduxjs/redux/issues/912)
- [#1303：Redux 性能与大型 Store 以及频繁更新](https://github.com/reduxjs/redux/issues/1303)
- [Stack Overflow：Redux 应用中的 state 包含 reducer 的名字](https://stackoverflow.com/questions/35667775/state-in-redux-react-app-has-a-property-with-the-name-of-the-reducer/35674297)
- [Stack Overflow：Redux 如何处理深度嵌套模型？](https://stackoverflow.com/questions/34494866/how-does-redux-deals-with-deeply-nested-models/34495397)

### 必须在 reducer 中深拷贝 state 吗？拷贝 state 不会很慢吗？

不可变更新 state 通常意味着浅拷贝，而不是深拷贝。浅拷贝比深拷贝快得多，因为需要复制的对象和字段更少，而且它实际上归结为移动一些指针。

此外，深拷贝 state 为每个字段都创建了新的引用。由于 React-Redux 的 `connect` 函数依赖于引用地址比较来确定数据是否已更改，这意味着即使其他数据没有发生有意义的更改，UI 组件也会被强制重新渲染。

但是，你 _确实_ 需要为受影响的每个嵌套级别创建一个拷贝和更新的对象。虽然这代价不大，但如果可能的话，这是你应该保持 state 归一化和扁平化的另一个很好的理由。

> 常见的 Redux 误解：需要深拷贝 state。现实是：如果里面的东西没有改变，就保持它的引用不变！

#### 更多信息

**文档**

- [Redux 使用指南：构造化 Reducers——预置知识](../usage/structuring-reducers/PrerequisiteConcepts.md)
- [Redux 使用指南：结构化 Reducers——不可变更新模式](../usage/structuring-reducers/ImmutableUpdatePatterns.md)

**讨论**

- [#454：在 reducer 中处理大量 states](https://github.com/reduxjs/redux/issues/454)
- [＃758：为什么不能直接改变 state？](https://github.com/reduxjs/redux/issues/758)
- [#994：更新嵌套实体时如何减少样板代码？](https://github.com/reduxjs/redux/issues/994)
- [Twitter：常见的误解——深拷贝](https://twitter.com/dan_abramov/status/688087202312491008)

### 如何减少 store 更新事件的数量？

Redux 会在每个成功 dispatch 的 action 后通知订阅者（即一个 action 到达 store 并由 reducer 处理）。在某些情况下，减少调用订阅者的次数可能很有用，尤其是当 action creator 连续 dispatch 多个不同的 actions 时。

有几个插件可以通过各种方式添加批处理功能，例如： [redux-batched-actions](https://github.com/tshelburne/redux-batched-actions)（一个高阶 reducer，可让你 dispatch 多个 actions（看起来像是一个），然后会将它们 “unpack” 在 reducer 中），[redux-batched-subscribe](https://github.com/tappleby/redux-batched-subscribe)（一个 store enhancer，它允许为多个 dispatch 批量订阅调用），或 [redux-batch](https://github.com/manaflair/redux-batch)（一个 store enhancer，它通过单个订阅者通知 dispatch 一系列 actions）。

特别是对于 React-Redux，从 [React-Redux v7](https://github.com/reduxjs/react-redux/releases/tag/v7.0.1) 开始，一个新的 `batch` 公共 API 可用于最小化在 React 事件处理程序之外 dispatch actions 时 React 重新渲染的数量。它包装了 React 的 `unstable_batchedUpdate()` API，允许事件循环 tick 中的任何 React 更新被批处理到单个渲染通道中。React 已经在内部将这个 API 用于事件处理程序回调。这个 API 实际上是 ReactDOM 和 React Native 等渲染器包的一部分，而不是 React 核心本身。

由于 React-Redux 需要在 ReactDOM 和 React Native 环境中运行，因此我们已经在构建时从正确的渲染器中导入了这个 API 以供使用。现在我们自己也公开重新导出了这个函数，重命名为 `batch()`。你可以使用它来确保在 React 之外 dispatch 的多个 actions 仅导致一次渲染更新，如下所示：

```js
import { batch } from 'react-redux'

function myThunk() {
  return (dispatch, getState) => {
    // 应该只导致一个组合重新渲染，而不是两个
    batch(() => {
      dispatch(increment())
      dispatch(increment())
    })
  }
}
```

#### 更多信息

**讨论**

- [#125：避免级联渲染的策略](https://github.com/reduxjs/redux/issues/125)
- [#542：想法：批处理 actions](https://github.com/reduxjs/redux/issues/542)
- [#911：批处理 actions](https://github.com/reduxjs/redux/issues/911)
- [#1813：使用循环来支持 dispatch 数组](https://github.com/reduxjs/redux/pull/1813)
- [React Redux #263：dispatch 数百个 actions 时出现巨大的性能问题](https://github.com/reduxjs/react-redux/issues/263)
- [React-Redux #1177：路线图：v6、Context、订阅和 Hooks](https://github.com/reduxjs/react-redux/issues/1177)

**相关库**

- [Redux 插件目录：Store——更改订阅](https://github.com/markerikson/redux-ecosystem-links/blob/master/store.md#store-change-subscriptions)

### “单状态树”会导致内存问题吗？Dispatch 很多 actions 会占用内存吗？

首先，就原始内存使用而言，Redux 与任何其他 JavaScript 库没有什么不同。唯一的区别是所有不同的对象引用都嵌套在一棵树中，而不是可能保存在各个独立的模型实例中，例如在 Backbone 中。其次，典型的 Redux 应用程序可能会比等效的 Backbone 应用程序使用更少的内存，因为 Redux 鼓励使用普通的 JavaScript 对象和数组，而不是创建模型和集合的实例。最后，Redux 一次只保存一个 state 树引用。同样，该树中不再引用的对象将被垃圾回收。

Redux 本身不存储 actions 的历史记录。然而，Redux DevTools 存储了 actions，因此它们可以被回放，但这通常只在开发过程中启用，而不是在生产中使用。

#### 更多信息

**文档**

- [Redux 深入浅出：异步逻辑和数据流](../tutorials/fundamentals/part-6-async-logic.md)

**讨论**

- [Stack Overflow：有没有办法“提交” Redux 中的 state 以释放内存？](https://stackoverflow.com/questions/35627553/is-there-any-way-to-commit-the-state-in-redux-to-free-memory/35634004)
- [Stack Overflow：Redux store 会导致内存泄漏吗？](https://stackoverflow.com/questions/39943762/can-a-redux-store-lead-to-a-memory-leak/40549594#40549594)
- [Stack Overflow：Redux 和所有应用程序的 state](https://stackoverflow.com/questions/42489557/redux-and-all-the-application-state/42491766#42491766)
- [Stack Overflow：受控组件的内存使用问题](https://stackoverflow.com/questions/44956071/memory-usage-concern-with-controlled-components?noredirect=1&lq=1)
- [Reddit：保存初始 state 的最佳位置是什么？](https://www.reddit.com/r/reactjs/comments/47m9h5/whats_the_best_place_to_keep_the_initial_state/)

### 缓存远端数据会导致内存问题吗？

JavaScript 应用程序在浏览器中运行的可用内存量是有限的。当缓存大小接近可用内存量时，缓存数据会导致性能问题。当缓存的数据特别大或会话运行时间特别长时，这往往会成为问题。虽然意识到这些问题的可能性是件好事，但这种意识不应阻止你有效地缓存合理数量的数据。

以下是一些有效缓存远程数据的方法：

首先，只缓存用户需要的数据。如果应用程序显示的是分页的记录列表，则没必要缓存整个集合。相反，缓存用户可见的内容，并在用户有（或即将有）需要更多数据时立即添加到该缓存中。

其次，尽可能缓存记录的缩写形式。有时，记录包含与用户无关的数据。如果应用程序不依赖此数据，则可以将其从缓存中省略。

第三，只缓存一个记录的单个副本。当记录包含其他记录的副本时，这一点尤其重要。为每条记录缓存一个唯一的副本，并用引用替换每个嵌套副本。这就是归一化。出于[几个原因](../usage/structuring-reducers/NormalizingStateShape.md#designing-a-normalized-state)，归一化是存储关系型数据的首选方法，包括高效的内存利用率。

#### 更多信息

**讨论**

- [Stack Overflow：如何为具有列表/详细视图和分页的应用程序选择 Redux state 结构？](https://stackoverflow.com/questions/33940015/how-to-choose-the-redux-state-shape-for-an-app-with-list-detail-views-and-pagina)
- [Twitter：...担心 “state 树中的数据过多”...](https://twitter.com/acemarke/status/804071531844423683)
- [高级 Redux 实体归一化](https://medium.com/@dcousineau/advanced-redux-entity-normalization-f5f1fe2aefc5)
