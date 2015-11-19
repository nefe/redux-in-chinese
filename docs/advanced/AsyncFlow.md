# 异步数据流

如果不使用 [middleware](Middleware.md) 的话，Redux 的 store 只支持 [同步数据流](../basics/DataFlow.md)。而这也是 [`createStore()`](../api/createStore.md) 所默认提供的创建方式。

你可以使用 [`applyMiddleware()`](../api/applyMiddleware.md) 来增强 [`createStore()`](../api/createStore.md)。这不是必须的，但它可以让你 [以更简便的方式来描述异步的 action](AsyncActions.md)。

像 [redux-thunk](https://github.com/gaearon/redux-thunk) 或 [redux-promise](https://github.com/acdlite/redux-promise) 这样支持异步的 middleware 都包装了 store 的 [`dispatch()`](../api/Store.md#dispatch) 方法，以此来让你 dispatch 一些除了 action 以外的其他内容，例如：函数或者 Promise。你所使用的任何 middleware 都可以以自己的方式解释你 dispatch 的任何内容，并继续传递 actions 给下一个 middleware。比如，一个 Promise middleware 能够 Promise，然后针对每个 Promise 异步地 dispatch 一对 begin/end actions。

当 middleware 链中的最后一个 middleware dispatch action 时，这个 action 必须是一个普通对象。这是 [同步式的 Redux 数据流](../basics/DataFlow.md) 开始的地方（译注：这里应该是指，你可以使用任意多异步的 middleware 去做你想做的事情，但是需要使用普通对象作为最后一个被 dispatch 的 action ，来将处理流程带回同步方式）。

接着可以查看 [异步示例的完整源码](ExampleRedditAPI.md)。

## 下一步

现在你对 middleware 在 Redux 中作用的例子有了初步了解，是时候应用到实际开发中了。继续阅读关于 [Middleware](Middleware.md) 的详细章节。