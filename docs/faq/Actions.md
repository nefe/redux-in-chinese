# Redux 常见问题：Action

## 目录

- [为何 type 必须是字符串，或者至少可以被序列化？ 为什么 action 类型应该作为常量？](#actions-string-constants)
- [是否存在 reducer 和 action 之间的一对一映射？](#actions-reducer-mappings)
- [怎样表示类似 AJAX 请求的 “副作用”？为何需要 “action 创建函数”、“thunk” 以及 “middleware” 类似的东西去处理异步行为？](#actions-side-effects)
- [是否应该在 action 创建函数中连续分发多个 action？](#actions-multiple-actions)

## Actions

<a id="actions-string-constants"></a>
### 为何 `type` 必须是字符串，或者至少可以被序列化？ 为什么 action 类型应该作为常量？

和 state 一样，可序列化的 action 使得若干 Redux 的经典特性变得可能，比如时间旅行调试器、录制和重放 action。若使用 `Symbol` 等去定义 `type` 值，或者用 `instanceof` 对 action 做自检查都会破坏这些特性。字符串是可序列化的、自解释型，所以是更好的选择。注意，如果 action 目的是在 middleware 中处理，那么使用 Symbols、 Promises 或者其它非可序列化值也是 *可以* 的。 action 只有当它们正真到达 store 且被传递给 reducer 时才需要被序列化。

因为性能原因，我们无法强制序列化 action，所以 Redux 只会校验 action 是否是普通对象，以及 `type` 是否定义。其它的都交由你决定，但是确保数据是可序列化将对调试以及问题的重现有很大帮助。

封装并集聚公共代码是程序规划时的核心概念。虽然可以在任何地方手动创建 action 对象、手动指定 `type` 值，定义常量的方式使得代码的维护更为方便。如果将常量维护在单独的文件中，[在 `import` 时校验](https://www.npmjs.com/package/eslint-plugin-import)，能避免偶然的拼写错误。

#### 补充资料

**文档**

- [Reducing Boilerplate](http://rackt.github.io/redux/docs/recipes/ReducingBoilerplate.html#actions)

**Discussion**

- [#384: Recommend that Action constants be named in the past tense](https://github.com/reactjs/redux/issues/384)
- [#628: Solution for simple action creation with less boilerplate](https://github.com/reactjs/redux/issues/628)
- [#1024: Proposal: Declarative reducers](https://github.com/reactjs/redux/issues/1024)
- [#1167: Reducer without switch](https://github.com/reactjs/redux/issues/1167)
- [Stack Overflow: Why do you need 'Actions' as data in Redux？](http://stackoverflow.com/q/34759047/62937)
- [Stack Overflow: What is the point of the constants in Redux？](http://stackoverflow.com/q/34965856/62937)

<a id="actions-reducer-mappings"></a>
### 是否存在 reducer 和 action 之间的一对一映射？

不存在。建议的方式是编写独立且很小的 reducer 方法去更新指定的 state 部分，这种模式被称为 “reducer 合成”。一个指定的 action 也许被它们中的全部、部分、甚至没有一个处理到。这种方式把组件从实际的数据变更中解耦，一个 action 可能影响到 state 树的不同部分，对组件而言再也不必知道这些了。有些用户选择将它们紧密绑定在一起，就像 “ducks” 文件结构，显然是没有默认的一对一映射。所以当你想在多个 reducer 中处理同一个 action 时，应当避免此类结构。

#### 补充资料

**文档**

- [Basics: Reducers](/docs/basics/Reducers.md)
- [Recipes: Structuring Reducers](/docs/recipes/StructuringReducers.md)

**讨论**

- [Twitter: most common Redux misconception](https://twitter.com/dan_abramov/status/682923564006248448)
- [#1167: Reducer without switch](https://github.com/reactjs/redux/issues/1167)
- [Reduxible #8: Reducers and action creators aren't a one-to-one mapping](https://github.com/reduxible/reduxible/issues/8)
- [Stack Overflow: Can I dispatch multiple actions without Redux Thunk middleware？](http://stackoverflow.com/questions/35493352/can-i-dispatch-multiple-actions-without-redux-thunk-middleware/35642783)

<a id="actions-side-effects"></a>
### 怎样表示类似 AJAX 请求的 “副作用”？为何需要 “action 创建函数”、“thunks” 以及 “middleware” 类似的东西去处理异步行为？

这是一个持久且复杂的话题，针对如何组织代码以及采用何种方式有很多的观点。

任何有价值的 web 应用都必然要执行复杂的逻辑，通常包括 AJAX 请求等异步工作。这类代码不再是针对输入的纯函数，与第三方的交互被认为是 [“副作用”](https://en.wikipedia.org/wiki/Side_effect_%28computer_science%29)。

Redux 深受函数式编程的影响，创造性的不支持副作用的执行。尤其是 reducer， *必须* 是符合  `(state, action) => newState` 的纯函数。然而，Redux 的 middleware 能拦截分发的 action 并添加额外的复杂行为，还可以添加副作用。

Redux 建议将带副作用的代码作为 action 创建过程的一部分。因为该逻辑 *能* 在 UI 组件内执行，那么通常抽取此类逻辑作为可重用的方法都是有意义的，因此同样的逻辑能被多个地方调用，也就是所谓的 action 创建函数。

最简单也是最常用的方法就是使用 [Redux Thunk](https://github.com/gaearon/redux-thunk) middleware，这样就能用更为复杂或者异步的逻辑书写 action 创建函数。另一个被广泛使用的方法是 [Redux Saga](https://github.com/yelouafi/redux-saga)，你可以用 generator 书写类同步代码，就像在 Redux 应用中使用 “后台线程” 或者 “守护进程”。还有一个方法是 [Redux Loop](https://github.com/raisemarketplace/redux-loop)，它允许 reducer 以声明副作用的方式去响应 state 变化，并让它们分别执行，从而反转了进程。除此之外，还有 *许多* 其它开源的库和理念，都有各自针对副作用的管理方法。

#### 补充资料
**文档**

- [Advanced: Async Actions](advanced/AsyncActions.md)
- [Advanced: Async Flow](advanced/AsyncFlow.md)
- [Advanced: Middleware](advanced/Middleware.md)

**文章**

- [Redux side effects and you](https://medium.com/@fward/redux-side-effects-and-you-66f2e0842fc3)
- [Pure functionality and side effects in Redux](http://blog.hivejs.org/building-the-ui-2/)
- [From Flux to Redux: Async Actions the easy way](http://danmaz74.me/2015/08/19/from-flux-to-redux-async-actions-the-easy-way/)
- [React/Redux Links: "Redux Side Effects" category](https://github.com/markerikson/react-redux-links/blob/master/redux-side-effects.md)
- [Gist: Redux-Thunk examples](https://gist.github.com/markerikson/ea4d0a6ce56ee479fe8b356e099f857e)

**讨论**

- [#291: Trying to put API calls in the right place](https://github.com/reactjs/redux/issues/291)
- [#455: Modeling side effects](https://github.com/reactjs/redux/issues/455)
- [#533: Simpler introduction to async action creators](https://github.com/reactjs/redux/issues/533)
- [#569: Proposal: API for explicit side effects](https://github.com/reactjs/redux/pull/569)
- [#1139: An alternative side effect model based on generators and sagas](https://github.com/reactjs/redux/issues/1139)
- [Stack Overflow: Why do we need middleware for async flow in Redux？](http://stackoverflow.com/questions/34570758/why-do-we-need-middleware-for-async-flow-in-redux)
- [Stack Overflow: How to dispatch a Redux action with a timeout？](http://stackoverflow.com/questions/35411423/how-to-dispatch-a-redux-action-with-a-timeout/35415559)
- [Stack Overflow: Where should I put synchronous side effects linked to actions in redux？](http://stackoverflow.com/questions/32982237/where-should-i-put-synchronous-side-effects-linked-to-actions-in-redux/33036344)
- [Stack Overflow: How to handle complex side-effects in Redux？](http://stackoverflow.com/questions/32925837/how-to-handle-complex-side-effects-in-redux/33036594)
- [Stack Overflow: How to unit test async Redux actions to mock ajax response](http://stackoverflow.com/questions/33011729/how-to-unit-test-async-redux-actions-to-mock-ajax-response/33053465)
- [Stack Overflow: How to fire AJAX calls in response to the state changes with Redux？](http://stackoverflow.com/questions/35262692/how-to-fire-ajax-calls-in-response-to-the-state-changes-with-redux/35675447)
- [Reddit: Help performing Async API calls with Redux-Promise Middleware.](https://www.reddit.com/r/reactjs/comments/469iyc/help_performing_async_api_calls_with_reduxpromise/)
- [Twitter: possible comparison between sagas, loops, and other approaches](https://twitter.com/dan_abramov/status/689639582120415232)


<a id="actions-multiple-actions"></a>
### 是否应该在 action 创建函数中连续分发多个 action？

关于如何构建 action 并没有统一的规范。使用类似 Redux Thunk 的异步 middleware 支持了更多的场景，比如分发连续多个独立且相关联的 action、 分发 action 指示 AJAX 请求的阶段、 根据 state 有条件的分发 action、甚至分发 action 并随后校验更新的 state。

通常，明确这些 action 是关联还是独立，是否应当作为一个 action。评判当前场景影响因素的同时，还需根据 action 日志权衡 reducer 的可读性。例如，一个包含新 state 树的 action 会使你的 reducer 只有一行，副作用是没有任何历史表明 *为什么* 发生了变更，进而导致调试异常困难。另一方面，如果为了维持它们的粒状结构（granular），在循环中分发 action，这表明也许需要引入新的 acton 类型并以不同的方式去处理它。

避免在同一地方连续多次以同步的方式进行分发，其性能问题是值得担忧的。有许多插件和方法可以批处理调度。

#### 补充资料

**文档**

- [FAQ: Performance - Reducing Update Events](https://github.com/reactjs/redux/blob/master/docs/faq/Performance.md#performance-update-events)

**讨论**

- [#597: Valid to dispatch multiple actions from an event handler？](https://github.com/reactjs/redux/issues/597)
- [#959: Multiple actions one dispatch？](https://github.com/reactjs/redux/issues/959)
- [Stack Overflow: Should I use one or several action types to represent this async action？](http://stackoverflow.com/questions/33637740/should-i-use-one-or-several-action-types-to-represent-this-async-action/33816695)
- [Stack Overflow: Do events and actions have a 1:1 relationship in Redux？](http://stackoverflow.com/questions/35406707/do-events-and-actions-have-a-11-relationship-in-redux/35410524)
- [Stack Overflow: Should actions be handled by reducers to related actions or generated by action creators themselves？](http://stackoverflow.com/questions/33220776/should-actions-like-showing-hiding-loading-screens-be-handled-by-reducers-to-rel/33226443#33226443)
