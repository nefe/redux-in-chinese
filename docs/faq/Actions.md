---
id: actions
title: Actions
hide_title: false
---

# Redux FAQ: Actions

## 目录

- [Redux FAQ: Actions](#redux-faq-actions)
  - [目录](#目录)
  - [Actions](#actions)
    - [为什么 `type` 应该是一个字符串，或者至少是可序列化的？ 为什么 action types 应该是常量？](#why-should-type-be-a-string-or-at-least-serializable-why-should-my-action-types-be-constants)
      - [更多信息](#further-information)
    - [reducer 和 action 之间总是存在一对一的映射吗？](#is-there-always-a-one-to-one-mapping-between-reducers-and-actions)
      - [更多信息](#further-information-1)
    - [如何表示 AJAX 调用等的“副作用”？ 为什么需要像 “action creator”、“thunk” 和 “middleware” 来做异步行为？](#how-can-i-represent-side-effects-such-as-ajax-calls-why-do-we-need-things-like-action-creators-thunks-and-middleware-to-do-async-behavior)
      - [更多信息](#further-information-2)
    - [应该使用什么异步中间件？如何在 thunk、sagas、observables 或其他中间件之间做出选择？](#what-async-middleware-should-i-use-how-do-you-decide-between-thunks-sagas-observables-or-something-else)
    - [我应该从一个 action creator 里连续 dispatch 多个 actions 吗？](#should-i-dispatch-multiple-actions-in-a-row-from-one-action-creator)
      - [更多信息](#further-information-3)

## Actions

### 为什么 `type` 应该是一个字符串，或者至少是可序列化的？ 为什么 action types 应该是常量？

与 state 一样，可序列化的 action 支持 Redux 的一些定义功能，例如时间旅行调试，以及记录和重放操作。 如果 `type` 值使用 `Symbol` 等类型或使用 `instanceof` 检查 action 本身会破坏这一点。字符串是可序列化的并且易于自描述，因此是更好的选择。请注意，如果 action 旨在供中间件使用，则可以在 action 中使用 Symbols, Promises 或其他不可序列化的值。只需要保证将 action 实际存储到 store 并传递给 reducer 时是可序列化的。

出于性能原因，我们无法可靠地强制执行可序列化的 actions，因此 Redux 仅检查每个 action 是否都是普通对象，并且 `type` 是否已定义。 其余的取决于你，但你可能会发现保持所有内容可序列化有助于调试和重现问题。

封装和集中常用代码片段是编程中的一个关键概念。虽然在任何地方都可以手动创建 action 对象，并手动编写每个 `type` 值，但定义可重用的常量会使维护代码更容易。如果你将常量放在一个单独的文件中，你可以[检查你的 `import` 语句是否有错别字](https://www.npmjs.com/package/eslint-plugin-import) 这样你就不会意外使用错误的字符串。

#### 更多信息

**文档**

- [Reducing Boilerplate](../recipes/ReducingBoilerplate.md#actions)

**讨论**

- [#384: 建议 Action 常量用过去时命名](https://github.com/reactjs/redux/issues/384)
- [#628: 使用更少的样板代码创建简单的 action](https://github.com/reactjs/redux/issues/628)
- [#1024: Proposal: 声明式 reducers](https://github.com/reactjs/redux/issues/1024)
- [#1167: Reducer without switch](https://github.com/reactjs/redux/issues/1167)
- [Stack Overflow: 为什么在 Redux 中需要 “Actions” 作为数据？](https://stackoverflow.com/q/34759047/62937)
- [Stack Overflow: Redux 中的常量有什么意义？](https://stackoverflow.com/q/34965856/62937)

### reducer 和 action 之间总是存在一对一的映射吗？

不，建议编写独立的小型 reducer 函数，每个函数负责更新特定的 state 切片。 我们称这种模式为 “reducer composition”。 一个给定的 action 可以由全部 reducer 函数处理、部分 reducer 函数处理或一个 reducer 函数都不处理。 这使组件与实际数据更改分离，因为一个 action 可能会影响状态树的不同部分，并且组件无需意识到这一点。 有些用户确实选择将它们更紧密地绑定在一起，例如 “ducks” 文件结构，但默认情况下肯定没有一对一的映射，你应该随时打破这种范式，在多个 reducer 中处理一个 action。

#### 更多信息

**文档**

- [基础知识: State, Actions, Reducers](../tutorials/fundamentals/part-3-state-actions-reducers.md)
- [方法: 结构化 Reducers](../recipes/structuring-reducers/StructuringReducers.md)

**讨论**

- [Twitter: 最常见的 Redux 误解](https://twitter.com/dan_abramov/status/682923564006248448)
- [#1167: Reducer without switch](https://github.com/reactjs/redux/issues/1167)
- [Reduxible #8: Reducers 和 action creators 不是一对一的映射](https://github.com/reduxible/reduxible/issues/8)
- [Stack Overflow: 我可以在没有 Redux Thunk 中间件的情况下 dispatch 多个操作吗？](https://stackoverflow.com/questions/35493352/can-i-dispatch-multiple-actions-without-redux-thunk-middleware/35642783)

### 如何表示 AJAX 调用等的“副作用”？ 为什么需要像 “action creator”、“thunk” 和 “middleware” 来做异步行为？

这是一个漫长而复杂的话题，对于如何组织代码以及应该使用什么方法有各种各样的意见。

任何有意义的 Web 应用程序都需要执行复杂的逻辑，通常包括异步工作，例如发出 AJAX 请求。 该代码不再纯粹是其输入的函数，与外部世界的交互被称为 [“副作用”](https://en.wikipedia.org/wiki/Side_effect_%28computer_science%29)

Redux 受到函数式编程的启发，开箱即用，没有执行副作用的地方。 特别是，reducer 函数 _必须_ 始终是 `(state, action) => newState` 的纯函数。 但是，Redux 的中间件可以拦截 dispatch 了的 action 并在它们周围添加额外的复杂行为，包括副作用。

一般来说，Redux 建议带有副作用的代码应该是 action 创建过程的一部分。 虽然该逻辑 _可以_ 在 UI 组件内执行，但通常将逻辑提取到可重用函数中以便可以从多个位置调用相同的逻辑（一个 action 创建函数）。

最简单和最常见的方法是添加 [Redux Thunk](https://github.com/gaearon/redux-thunk) 中间件，让你可以编写具有更复杂和异步逻辑的 action creator。 另一个广泛使用的方法是 [Redux Saga](https://github.com/yelouafi/redux-saga) 它可以让你使用生成器编写更多看起来同步的代码，并且可以像一个 Redux 应用程序的 “background threads” or “daemons” 一样。另一种方法是 [Redux Loop](https://github.com/raisemarketplace/redux-loop), 它通过允许你的 reducer 声明副作用以响应 state 更改并让它们单独执行来反转过程。除此之外，还有 _许多_ 其他社区开发的库和想法，每个库和想法都对如何管理副作用有自己的看法。

#### 更多信息

**文档**

- [Redux 基础知识：异步逻辑和数据流](../tutorials/fundamentals/part-6-async-logic.md)
- [Redux 基础知识： Store - Middleware](../tutorials/fundamentals/part-4-store.md#middleware)

**文章**

- [Redux Side-Effects and You](https://medium.com/@fward/redux-side-effects-and-you-66f2e0842fc3)
- [Redux 中的纯功能和副作用](http://blog.hivejs.org/building-the-ui-2/)
- [从 Flux 到 Redux：异步操作的简单方法](http://danmaz74.me/2015/08/19/from-flux-to-redux-async-actions-the-easy-way/)
- [React/Redux Links: "Redux Side Effects" 类别](https://github.com/markerikson/react-redux-links/blob/master/redux-side-effects.md)
- [Gist: Redux-Thunk 示例](https://gist.github.com/markerikson/ea4d0a6ce56ee479fe8b356e099f857e)

**讨论**

- [#291: 尝试将 API 调用放在正确的位置](https://github.com/reactjs/redux/issues/291)
- [#455: Modeling side effects](https://github.com/reactjs/redux/issues/455)
- [#533: 更简单地介绍异步 action creator](https://github.com/reactjs/redux/issues/533)
- [#569: Proposal: 用于显式副作用的 API](https://github.com/reactjs/redux/pull/569)
- [#1139: 基于生成器和 sagas 的替代副作用模型](https://github.com/reactjs/redux/issues/1139)
- [Stack Overflow: 为什么我们需要中间件用于 Redux 中的异步流？](https://stackoverflow.com/questions/34570758/why-do-we-need-middleware-for-async-flow-in-redux)
- [Stack Overflow: Redux 如何在超时的情况下dispatch action？](https://stackoverflow.com/questions/35411423/how-to-dispatch-a-redux-action-with-a-timeout/35415559)
- [Stack Overflow: 我应该将与 redux 中的 action 相关联的同步副作用放在哪里？](https://stackoverflow.com/questions/32982237/where-should-i-put-synchronous-side-effects-linked-to-actions-in-redux/33036344)
- [Stack Overflow: 如何在 Redux 中处理复杂的副作用？](https://stackoverflow.com/questions/32925837/how-to-handle-complex-side-effects-in-redux/33036594)
- [Stack Overflow: 如何对异步 Redux action 进行单元测试以模拟 ajax 响应](https://stackoverflow.com/questions/33011729/how-to-unit-test-async-redux-actions-to-mock-ajax-response/33053465)
- [Stack Overflow: 如何使用 Redux 触发 AJAX 调用以响应状态更改？](https://stackoverflow.com/questions/35262692/how-to-fire-ajax-calls-in-response-to-the-state-changes-with-redux/35675447)
- [Reddit: 使用 Redux-Promise 中间件帮助执行异步 API 调用。](https://www.reddit.com/r/reactjs/comments/469iyc/help_performing_async_api_calls_with_reduxpromise/)
- [Twitter: sagas、loops 和其他方法之间的可能比较](https://twitter.com/dan_abramov/status/689639582120415232)

### 应该使用什么异步中间件？如何在 thunk、sagas、observables 或其他中间件之间做出选择？

这里有 [许多可用的 异步/副作用 middleware](https://github.com/markerikson/redux-ecosystem-links/blob/master/side-effects.md), 但最常用的是 [`redux-thunk`](https://github.com/reduxjs/redux-thunk), [`redux-saga`](https://github.com/redux-saga/redux-saga), 和 [`redux-observable`](https://github.com/redux-observable/redux-observable). 以下是不同的工具，具有不同的优势、劣势和一些用例。

作为一般经验法则：

- Thunks 最适合复杂的同步逻辑（尤其是需要访问整个 Redux store state 的代码）和简单的异步逻辑（如基本的 AJAX 调用）。 通过使用 `async/await`，将 thunk 用于一些更复杂的基于 Promise 的逻辑也是合理的。
- Sagas 最适合复杂的异步逻辑和解耦的 “background thread” 类型的行为，特别是如果你需要监听已 dispatch 过的 action（这是 thunk 无法完成的事情）。 需要熟悉 ES6 生成器函数和 `redux-saga` 的 “effects” 运算符。
- Observables 解决了与 sagas 相同的问题，但依赖 RxJS 来实现异步行为。 需要熟悉 RxJS API。

我们建议大多数 Redux 用户应该从 thunk 开始，如果应用程序确实需要处理更复杂的异步逻辑，再添加一个额外的副作用库，如 sagas 或 observables。

由于 sagas 和 observables 具有相同的用例，因此应用程序通常会使用其中一个，但不会同时使用两者。 但是，请注意**同时使用 thunk 和 sagas 或 observables 绝对没问题**，因为它们解决了不同的问题。

**文章**

- [Decembersoft: Decembersoft：在 Redux 中进行异步操作的正确方法是什么？](https://decembersoft.com/posts/what-is-the-right-way-to-do-asynchronous-operations-in-redux/)
- [Decembersoft: Redux-Thunk vs Redux-Saga](https://decembersoft.com/posts/redux-thunk-vs-redux-saga/)
- [Redux-Thunk vs Redux-Saga: an overview](https://medium.com/@shoshanarosenfield/redux-thunk-vs-redux-saga-93fe82878b2d)
- [Redux-Saga V.S. Redux-Observable](https://hackmd.io/s/H1xLHUQ8e#side-by-side-comparison)

**讨论**

- [Reddit: 讨论一起使用 thunk 和 sagas，以及 sagas 的优缺点](https://www.reddit.com/r/reactjs/comments/8vglo0/react_developer_map_by_adamgolab/e1nr597/)
- [Stack Overflow: 将 redux-saga 和 ES6 生成器结合使用与 redux-thunk 和 ES2017 async/await 结合使用的优缺点](https://stackoverflow.com/questions/34930735/pros-cons-of-using-redux-saga-with-es6-generators-vs-redux-thunk-with-es2017-asy)
- [Stack Overflow: 为什么使用 Redux-Observable 而不是 Redux-Saga？](https://stackoverflow.com/questions/40021344/why-use-redux-observable-over-redux-saga/40027778#40027778)

### 我应该从一个 action creator 里连续 dispatch 多个 action 吗？

对于应该如何构建行为没有特定的规则。 使用像 Redux Thunk 这样的异步中间件当然可以实现这样的场景，例如连续 dispatch 多个不同但相关的 action，dispatch action 来表示 AJAX 请求的进展，根据 state 有条件地 dispatch action，甚至 dispatch 一个 action 后并立即检查更新的 state。

一般来说，询问这些 action 是否相关但独立，或者实际上应该表示为一个 action。 做对你自己的情况有意义的事情，同时尝试平衡 reducer 的可读性和操作日志的可读性。 例如，包含全新 state 树的 action 将使你的 reducer 成为 “one-line”，但缺点是现在你没有 _为什么_ 发生更改的历史记录，因此调试变得非常困难。 另一方面，如果你在循环中发出 action 以保持它们的粒度，则表明你可能希望引入以不同方式处理的新  action 类型。

尽量避免在你关心性能的地方连续多次同步 dispatch。 有许多插件和方法也可以批量 dispatch。

#### 更多信息

**文档**

- [FAQ: Performance - Reducing Update Events](./Performance.md#performance-update-events)

**Articles**

- [Idiomatic Redux: Thoughts on Thunks, Sagas, Abstraction, and Reusability](https://blog.isquaredsoftware.com/2017/01/idiomatic-redux-thoughts-on-thunks-sagas-abstraction-and-reusability/#multiple-dispatching)

**Discussions**

- [#597: 从事件处理程序 dispatch 多个 action 是否有效？](https://github.com/reactjs/redux/issues/597)
- [#959: 一次 dispatch 多个 action？](https://github.com/reactjs/redux/issues/959)
- [Stack Overflow: 我应该使用一种还是几种 action 类型来表示这个异步 action？](https://stackoverflow.com/questions/33637740/should-i-use-one-or-several-action-types-to-represent-this-async-action/33816695)
- [Stack Overflow: Redux 中的事件和 action 是 1:1 的关系吗？](https://stackoverflow.com/questions/35406707/do-events-and-actions-have-a-11-relationship-in-redux/35410524)
- [Stack Overflow: action 应该由 reducer 处理为相关 action 还是由 action creator 自己生成？](https://stackoverflow.com/questions/33220776/should-actions-like-showing-hiding-loading-screens-be-handled-by-reducers-to-rel/33226443#33226443)
- [Twitter: “关于 Redux Thunk 问题的好帖子...”](https://twitter.com/dan_abramov/status/800310164792414208)
