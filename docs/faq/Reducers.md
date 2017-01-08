# Redux 常见问题：Reducer

## 目录

- [如何在 reducer 之间共享 state? combineReducers 是必须的吗？](#reducers-share-state)
- [处理 action 必须用 switch 语句吗？](#reducers-use-switch)

## Reducer

<a id="reducers-share-state"></a>
### 如何在 reducer 之间共享 state? `combineReducers` 是必须的吗？

Redux store 推荐的结构是将 state 对象按键值切分成 “层”（slice） 或者 “域”（domain），并提供独立的 reducer 方法管理各自的数据层。就像 Flux 模式中的多个独立 store 一样， Redux 为此还提供了 [`combineReducers`](/docs/api/combineReducers.md) 工具来简化该模型。应当注意的是， `combineReducers` **不是** 必须的，它仅仅是通过简单的 JavaScript 对象作为数据，让 state 层能与 reducer 一一关联的函数而已。

许多用户想在 reducer 之间共享数据，但是 `combineReducers` 不允许此种行为。有许多可用的办法：

* 如果一个 reducer 想获取其它 state 层的数据，往往意味着 state 树需要重构，需要让单独的 reducer 处理更多的数据。
* 你可能需要自定义方法去处理这些 action，用自定义的顶层 reducer 方法替换 `combineReducers`。你可以使用类似于 [reduce-reducers](https://github.com/acdlite/reduce-reducers) 的工具运行 `combineReducers` 去处理尽可能多的 action，同时还要为存在 state 交叉部分的若干 action 执行更专用的 reducer。
* 类似于 `redux-thunk` 的 [异步 action 创建函数](/docs/advanced/AsyncActions.md) 能通过 `getState()` 方法获取所有的 state。 action 创建函数能从 state 中检索到额外的数据并传入 action，所以 reducer 有足够的信息去更新所维护的 state 层。

只需牢记 reducer 仅仅是函数，可以随心所欲的进行划分和组合，而且也推荐将其分解成更小、可复用的函数 (“reducer 合成”)。按照这种做法，如果子 reducer 需要一些参数时，可以从父 reducer 传入。你只需要确保他们遵循 reducer 的基本准则： `(state, action) => newState`，并且以不可变的方式更新 state，而不是直接修改 state。

#### 补充资料

**文档**

- [API: combineReducers](/docs/api/combineReducers.md)
- [Recipes: Reducers 基础结构](/docs/recipes/StructuringReducers.md)

**讨论**

- [#601: A concern on combineReducers, when an action is related to multiple reducers](https://github.com/reactjs/redux/issues/601)
- [#1400: Is passing top-level state object to branch reducer an anti-pattern？](https://github.com/reactjs/redux/issues/1400)
- [Stack Overflow: Accessing other parts of the state when using combined reducers？](http://stackoverflow.com/questions/34333979/accessing-other-parts-of-the-state-when-using-combined-reducers)
- [Stack Overflow: Reducing an entire subtree with redux combineReducers](http://stackoverflow.com/questions/34427851/reducing-an-entire-subtree-with-redux-combinereducers)
- [Sharing State Between Redux Reducers](https://invalidpatent.wordpress.com/2016/02/18/sharing-state-between-redux-reducers/)

<a id="reducers-use-switch"></a>
### 处理 action 必须用 `switch` 语句吗？

不是。在 reducer 里面你可以使用任何方法响应 action。 `switch` 语句是最常用的方式，当然你也可以用 `if`、功能查找表、创建抽象函数等。事实上，虽然 Redux 要求每个 action 对象都有一个 `type` 的字段，但是你的 reducer 逻辑不必一定要依赖它做处理。也就是说，标准方法肯定是用基于 `type` 的 `switch` 语句或者查找表。

#### 补充资料

**文档**

- [Recipes: Reducing Boilerplate](recipes/ReducingBoilerplate.md)

**讨论**

- [#883: take away the huge switch block](https://github.com/reactjs/redux/issues/883)
- [#1167: Reducer without switch](https://github.com/reactjs/redux/issues/1167)
