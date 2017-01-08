# Redux 常见问题：性能

## 目录

- [考虑到性能和架构， Redux “可扩展性” 如何？](#performance-scaling)
- [每个 action 都调用 “所有的 reducer” 会不会很慢？](#performance-all-reducers)
- [在 reducer 中必须对 state 进行深拷贝吗？拷贝 state 不会很慢吗？](#performance-clone-state)
- [怎样减少 store 更新事件的数量？](#performance-update-events)
- [仅有 “一个 state 树” 会引发内存问题吗？分发多个 action 会占用内存空间吗？](#performance-state-memory)

## 性能

<a id="performance-scaling"></a>
### 考虑到性能和架构， Redux “可扩展性” 如何？

没有一个明确的答案，在大多数情况下都不需要考虑该问题。

Redux 所做的工作可以分为以下几部分：在 middleware 和 reducer 中处理 action （包括对象复制及不可变更新）、 action 分发之后通知订阅者、根据 state 变化更新 UI 组件。虽然在一些复杂场景下，这些都 *可能* 变成一个性能问题，但 Redux 本质上并没有任何慢或者低效的实现。实际上，React Redux 已经做了大量的优化工作减少不必要的重复渲染，React Redux v5 相比之前的版本有着显著的改进。

与其他库相比，Redux 可能没有那么快。为了更大限度的展示 React 的渲染性能，state 应该以规范化的结构存储，许多单独的组件应该直接连接到 store，连接的列表组件应该将项目 ID 传给子列表（允许列表项通过 ID 查找数据）。这使得要进行渲染的量最小化。使用带有记忆功能的 selector 函数也对性能有非常大的帮助。

考虑到架构方面，事实证据表明在各种项目及团队规模下，Redux 都表现出色。Redux 目前正被成百上千的公司以及更多的开发者使用着，NPM 上每月都有几十万的安装量。有一位开发者这样说：

> 规模方面，我们大约有500个 action 类型、400个 reducer、150个组件、5个 middleware、200个 action、2300个测试案例。

#### 补充资料

**文档**

- [Recipes: Structuring Reducers - state 范式化](docs/recipes/reducers/NormalizingStateShape.md)

**文章**

- [How to Scale React Applications ](https://www.smashingmagazine.com/2016/09/how-to-scale-react-applications/)(accompanying talk: [Scaling React Applications](https://vimeo.com/168648012))
- [High-Performance Redux](http://somebody32.github.io/high-performance-redux/)
- [Improving React and Redux Perf with Reselect](http://blog.rangle.io/react-and-redux-performance-with-reselect/)
- [Encapsulating the Redux State Tree](http://randycoulman.com/blog/2016/09/13/encapsulating-the-redux-state-tree/)
- [React/Redux Links: Performance - Redux](https://github.com/markerikson/react-redux-links/blob/master/react-performance.md#redux-performance)

**讨论**

- [#310: Who uses Redux？](https://github.com/reactjs/redux/issues/310)
- [#1751: Performance issues with large collections](https://github.com/reactjs/redux/issues/1751)
- [React Redux #269: Connect could be used with a custom subscribe method](https://github.com/reactjs/react-redux/issues/269)
- [React Redux #407: Rewrite connect to offer an advanced API](https://github.com/reactjs/react-redux/issues/407)
- [React Redux #416: Rewrite connect for better performance and extensibility](https://github.com/reactjs/react-redux/issues/416)
- [Redux vs MobX TodoMVC Benchmark: #1](https://github.com/mweststrate/redux-todomvc/pull/1)
- [Reddit: What's the best place to keep the initial state？](https://www.reddit.com/r/reactjs/comments/47m9h5/whats_the_best_place_to_keep_the_initial_state/)
- [Reddit: Help designing Redux state for a single page app](https://www.reddit.com/r/reactjs/comments/48k852/help_designing_redux_state_for_a_single_page/)
- [Reddit: Redux performance issues with a large state object？](https://www.reddit.com/r/reactjs/comments/41wdqn/redux_performance_issues_with_a_large_state_object/)
- [Reddit: React/Redux for Ultra Large Scale apps](https://www.reddit.com/r/javascript/comments/49box8/reactredux_for_ultra_large_scale_apps/)
- [Twitter: Redux scaling](https://twitter.com/NickPresta/status/684058236828266496)
- [Twitter: Redux vs MobX benchmark graph - Redux state shape matters](https://twitter.com/dan_abramov/status/720219615041859584)
- [Stack Overflow: How to optimize small updates to props of nested components?](http://stackoverflow.com/questions/37264415/how-to-optimize-small-updates-to-props-of-nested-component-in-react-redux)
- [Chat log: React/Redux perf - updating a 10K-item Todo list](https://gist.github.com/markerikson/53735e4eb151bc228d6685eab00f5f85)
- [Chat log: React/Redux perf - single connection vs many connections](https://gist.github.com/markerikson/6056565dd65d1232784bf42b65f8b2ad)

<a id="performance-all-reducers"></a>
### 每个 action 都调用 “所有的 reducer” 会不会很慢？

我们应当清楚的认识到 Redux store 只有一个 reducer 方法。 store 将当前的 state 和分发的 action 传递给这个 reducer 方法，剩下的就让 reducer 去处理。

显然，在单独的方法里处理所有的 action 仅从方法大小及可读性方面考虑，就已经很不利于扩展了，所以将实际工作分割成独立的方法并在顶层的 reducer 中调用就变得很有意义。尤其是目前的建议模式中推荐让单独的子 reducer 只负责更新特定的 state 部分。 `combineReducers()` 和 Redux 搭配的方案只是许多实现方式中的一种。强烈建议尽可能保持 store 中 state 的扁平化和范式化，至少你可以随心所欲的组织你的 reducer 逻辑。

即使你在不经意间已经维护了许多独立的子 reducer，甚至 state 也是深度嵌套，reducer 的速度也并不构成任何问题。JavaScript 引擎有足够的能力在每秒运行大量的函数调用，而且大部门的子 reducer 只是使用 `switch` 语句，并且针对大部分 action 返回的都是默认的 state。

如果你仍然关心 reducer 的性能，可以使用类似 [redux-ignore](https://github.com/omnidan/redux-ignore) 和 [reduxr-scoped-reducer](https://github.com/chrisdavies/reduxr-scoped-reducer) 的工具，确保只有某几个 reducer 响应特定的 action。你还可以使用 [redux-log-slow-reducers](https://github.com/michaelcontento/redux-log-slow-reducers) 进行性能测试。

#### 补充资料

**讨论**

- [#912: Proposal: action filter utility](https://github.com/reactjs/redux/issues/912)
- [#1303: Redux Performance with Large Store and frequent updates](https://github.com/reactjs/redux/issues/1303)
- [Stack Overflow: State in Redux app has the name of the reducer](http://stackoverflow.com/questions/35667775/state-in-redux-react-app-has-a-property-with-the-name-of-the-reducer/35674297)
- [Stack Overflow: How does Redux deal with deeply nested models？](http://stackoverflow.com/questions/34494866/how-does-redux-deals-with-deeply-nested-models/34495397)

<a id="performance-clone-state"></a>
### 在 reducer 中必须对 state 进行深拷贝吗？拷贝 state 不会很慢吗？

以不可变的方式更新 state 意味着浅拷贝，而非深拷贝。相比于深拷贝，浅拷贝更快，因为只需复制很少的字段和对象，实际的底层实现中也只是移动了若干指针而已。

因此，你需要创建一个副本，并且更新受影响的各个嵌套的对象层级即可。尽管上述动作代价不会很大，但这也是为什么需要维护范式化及扁平化 state 的又一充分理由。

> Redux 常见的误解： 需要深拷贝 state。实际情况是：如果内部的某些数据没有改变，继续保持统一引用即可。

#### 补充资料

**文档**

- [Recipes: Structuring Reducers - Prerequisite Concepts](/docs/faq/docs/recipes/reducers/PrerequisiteConcepts.md)
- [Recipes: Structuring Reducers - Immutable Update Patterns](/docs/recipes/reducers/ImmutableUpdatePatterns.md)

**讨论**

- [#454: Handling big states in reducer](https://github.com/reactjs/redux/issues/454)
- [#758: Why can't state be mutated？](https://github.com/reactjs/redux/issues/758)
- [#994: How to cut the boilerplate when updating nested entities？](https://github.com/reactjs/redux/issues/994)
- [Twitter: common misconception - deep cloning](https://twitter.com/dan_abramov/status/688087202312491008)
- [Cloning Objects in JavaScript](http://www.zsoltnagy.eu/cloning-objects-in-javascript/)

<a id="performance-update-events"></a>
### 怎样减少 store 更新事件的数量？

Redux 在 action 分发成功（例如，action 到达 store 被 reducer 处理）后通知订阅者。在有些情况下，减少订阅者被调用的次数会很有用，特别在当 action 创建函数分发了一系列不同的 action 时。

如果你在使用 React，你可以写在 `ReactDOM.unstable_batchedUpdates()` 以提高同步分发的性能，但这个 API 是实验性质的，可能会在以后的版本中移除，所以也不要过度依赖它。可以看看一些第三方的实现 [redux-batched-subscribe](https://github.com/tappleby/redux-batched-subscribe)（一个高级的 reducer，可以让你单独分发几个 action）、[redux-batched-subscribe](https://github.com/tappleby/redux-batched-subscribe)（一个 store 增强器，可以平衡多个分发情况下订阅者的调用次数）和 [redux-batched-actions](https://github.com/tshelburne/redux-batched-actions)（一个 store 增强器，可以利用单个订阅提醒的方式分发一系列的 action）。

#### 补充资料

**讨论**

- [#125: Strategy for avoiding cascading renders](https://github.com/reactjs/redux/issues/125)
- [#542: Idea: batching actions](https://github.com/reactjs/redux/issues/542)
- [#911: Batching actions](https://github.com/reactjs/redux/issues/911)
- [#1813: Use a loop to support dispatching arrays](https://github.com/reactjs/redux/issues/1813)
- [React Redux #263: Huge performance issue when dispatching hundreds of actions](https://github.com/reactjs/react-redux/issues/263)

**库**

- [Redux Addons Catalog: Store - Change Subscriptions](https://github.com/markerikson/redux-ecosystem-links/blob/master/store.md#store-change-subscriptions)

<a id="performance-state-memory"></a>
### 仅有 “一个 state 树” 会引发内存问题吗？分发多个 action 会占用内存空间吗？

首先，在原始内存使用方面，Redux 和其它的 JavaScript 库并没有什么不同。唯一的区别就是所有的对象引用都嵌套在同一棵树中，而不是像类似于 Backbone 那样保存在不同的模型实例中。第二，与同样的 Backbone 应用相比，典型的 Redux 应用可能使用 *更少* 的内存，因为 Redux 推荐使用普通的 JavaScript 对象和数组，而不是创建模型和集合实例。最后，Redux 仅维护一棵 state 树。不再被引用的 state 树通常都会被垃圾回收。

Redux 本身不存储 action 的历史。然而，Redux DevTools 会记录这些 action 以便支持重放，而且也仅在开发环境被允许，生产环境则不会使用。

#### 补充资料

**文档**

- [Docs: Async Actions](advanced/AsyncActions.md])

**讨论**

- [Stack Overflow: Is there any way to "commit" the state in Redux to free memory？](http://stackoverflow.com/questions/35627553/is-there-any-way-to-commit-the-state-in-redux-to-free-memory/35634004)
- [Reddit: What's the best place to keep initial state？](https://www.reddit.com/r/reactjs/comments/47m9h5/whats_the_best_place_to_keep_the_initial_state/)


