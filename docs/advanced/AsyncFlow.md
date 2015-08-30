# 异步数据流

如果不使用 [middleware](Middleware.md)，Redux store 只支持 [同步数据流](../basics/DataFlow.md)。这也是 [`createStore()`](../api/createStore.md) 默认返回的。

你可以使用 [`applyMiddleware()`](../api/applyMiddleware.md) 来增强 [`createStore()`](../api/createStore.md)，虽然并不是必须的，但它可以让你 [以更方便和友好的方式来描述异步 actions](AsyncActions.md)。

像 [redux-thunk](https://github.com/gaearon/redux-thunk) 或 [redux-promise](https://github.com/acdlite/redux-promise) 这样的异步 middleware 会包装 store 的 [`dispatch()`](../api/Store.md#dispatch) 方法，以此来让你 dispatch 内容比如函数或 Promise，不仅仅是 actions。所有你使用的 middleware 都可以操作你 dispatch 的任何内容，反过来，你也可以给这个 middleware 链中的下一个 middleware 传递 action。比如，一个 Promise middleware 能够拦截 Promise，然后异步地 dispatch 一对 begin/end actions。

当 middleware 链中的最后一个 middleware dispatch action 时，它必须是一个普通对象。这时使用的就是 [同步式的 Redux 数据流](../basics/DataFlow.md)。

## 下一步

现在你已经学完 Redux 数据流的全部内容！检出 [异步示例源码](ExampleRedditAPI.md)，或者阅读 [集成 React Router](UsageWithReactRouter.md)。