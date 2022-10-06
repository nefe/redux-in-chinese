---
id: design-decisions
title: Design Decisions
hide_title: false
---

# Redux FAQ: 设计决策

## 目录

- [为什么 Redux 不将 state 和 action 传递给订阅者？](#why-doesnt-redux-pass-the-state-and-action-to-subscribers)
- [为什么 Redux 不支持对 action 和 reducer 使用类？](#why-doesnt-redux-support-using-classes-for-actions-and-reducers)
- [为什么 middleware 签名使用柯里化？](#why-does-the-middleware-signature-use-currying)
- [为什么 applyMiddleware 使用闭包进行 dispatch？](#why-does-applymiddleware-use-a-closure-for-dispatch)
- [为什么 `combineReducers` 在调用每个 reducer 时不包含整个 state 的第三个参数？](#why-doesnt-combinereducers-include-a-third-argument-with-the-entire-state-when-it-calls-each-reducer)
- [为什么 mapDispatchToProps 不允许使用来自 `getState()` 或 `mapStateToProps()` 的返回值？](#why-doesnt-mapdispatchtoprops-allow-use-of-return-values-from-getstate-or-mapstatetoprops)

## 设计决策

### 为什么 Redux 不将 state 和 action 传递给订阅者？

订阅者旨在响应 state 值本身，而不是 action。 对 state 的更新是同步处理的，但是给订阅者的通知可以被批处理或去抖动，这意味着订阅者并不总是被通知每个 action。 这是一种常见的[性能优化](./Performance.md#performance-update-events)，以避免重复重新渲染。

通过使用增强器覆盖 “store.dispatch” 来改变通知订阅者的方式，可以进行批处理或去抖动。 此外，还有一些库将 Redux 更改为批量处理操作以优化性能并避免重复重新渲染：

- [redux-batch](https://github.com/manaflair/redux-batch) 只需要一个通知，将一组操作传递给 `store.dispatch()`。
- [redux-batched-subscribe](https://github.com/tappleby/redux-batched-subscribe) 允许批处理由于 dispatch 而发生的订阅通知。

预期的保证是 Redux 最终以可用的最新 state 调用所有订阅者，但并不总是为每个 action 调用每个订阅者。 只需调用 store.getState() 即可在订阅者中获得存储 state。 如果不破坏可能对 action 进行批处理的方式，则无法在订阅者中使用该 action。

在订阅者内部使用该 action 的潜在用例（这是一个不受支持的功能）是确保组件仅在某些类型的 action 后重新呈现。 相反，应通过以下方式控制重新渲染：

1. the [shouldComponentUpdate](https://facebook.github.io/react/docs/react-component.html#shouldcomponentupdate) 生命周期方法
2. the [virtual DOM equality check (vDOMEq)](https://facebook.github.io/react/docs/optimizing-performance.html#avoid-reconciliation)
3. [React.PureComponent](https://facebook.github.io/react/docs/optimizing-performance.html#examples)
4. Using React-Redux: use [mapStateToProps](https://react-redux.js.org/api#connect) 将组件订阅到他们需要的 store 部分

#### 更多信息

**文章**

- [如何减少 store 更新事件的数量？](./Performance.md#performance-update-events)

**讨论**

- [#580: 为什么 Redux 不将 state 传递给订阅者？](https://github.com/reactjs/redux/issues/580)
- [#2214: Alternate Proof of Concept: Enhancer Overhaul -- more on debouncing](https://github.com/reactjs/redux/pull/2214)

### 为什么 Redux 不支持对 action 和 reducer 使用类？

对于具有大量面向对象编程经验的程序员来说，使用称为 action creator 的函数返回动作对象的模式似乎违反直觉，他们会认为这是类和实例的强大用例。 不支持 action 对象和 reducer 的类实例，因为类实例使序列化和反序列化变得棘手。 像 `JSON.parse(string)` 这样的反序列化方法将返回一个普通的旧 Javascript 对象而不是类实例。

如 [Store FAQ](./OrganizingState.md#organizing-state-non-serializable) 中所述，如果您可以接受诸如持久性和时间旅行调试之类的事情无法按预期工作，欢迎你也可以在 Redux store 使用非序列化对象。

序列化使浏览器能够以更少的内存存储所有已 dispatch 的 action，以及之前的store state。 回退和 “热重新加载” store 是 Redux 开发人员体验和 Redux DevTools 功能的核心。 这也使得反序列化的操作能够存储在服务器上，并在使用 Redux 进行服务器端渲染的情况下在浏览器中重新序列化。

#### 更多信息

**文章**

- [我可以将函数，promises，或其他不可序列化的项目放在 store state 中吗?](./OrganizingState.md#organizing-state-non-serializable)

**讨论**

- [#1171: 为什么 Redux 不使用类作为 action 和 reducer？](https://github.com/reactjs/redux/issues/1171#issuecomment-196819727)

### 为什么 middleware 签名使用柯里化？

为什么 Redux 不使用类作为 action 和 reducer？Redux middleware 是使用三重嵌套的函数结构编写的，看起来像 `const middleware = storeAPI => next => action => {}`，而不是看起来像的单个函数 比如`const middleware = (storeAPI, next, action) => {}`。以下有几个原因。

其中一个原因是 “currying” 函数是一种标准的函数式编程技术，Redux明确打算在其设计中使用函数式编程原则。另一个原因是 currying 函数创建闭包，你可以在闭包中声明 middleware 生存期内存在的变量（可以将其视为与类实例生存期内的实例变量等效的函数）。最后，它是最初设计 Redux 时选择的方法。

声明 middleware 的 [柯里化的函数签名](https://github.com/reactjs/redux/issues/1744) 被某些人[认为没有必要](https://github.com/reactjs/redux/pull/784)，因为执行 applyMiddleware 函数时 store 和 next 都可用。 这个问题已被确定为不 [值得引入重大更改](https://github.com/reactjs/redux/issues/1744)，因为现在 Redux 生态系统中有数百个 middleware 依赖于现有的 middleware 定义 .

#### 更多信息

**讨论**

- 为什么 middleware 签名使用柯里化？
  - 之前的讨论： [#55](https://github.com/reactjs/redux/pull/55), [#534](https://github.com/reactjs/redux/issues/534), [#784](https://github.com/reactjs/redux/pull/784), [#922](https://github.com/reactjs/redux/issues/922), [#1744](https://github.com/reactjs/redux/issues/1744)
  - [React Boston 2017: 你可能需要 Redux（及其生态系统）](https://blog.isquaredsoftware.com/2017/09/presentation-might-need-redux-ecosystem/)

### 为什么 applyMiddleware 使用闭包进行 dispatch？

`applyMiddleware` 从 store 中获取现有的 dispatch 并关闭它以创建初始 middleware 链，这些 middleware 已使用公开 getState 和 dispatch 函数的对象调用，这使得 middleware [在初始化期间依赖dispatch]（https： //github.com/reactjs/redux/pull/1592) 运行。

#### 更多信息

**讨论**

- 为什么 applyMiddleware 使用闭包进行 dispatch？
  - 见 - [#1592](https://github.com/reactjs/redux/pull/1592) 和 [#2097](https://github.com/reactjs/redux/issues/2097)

### 为什么 `combineReducers` 在调用每个 reducer 时不包含整个 state 的第三个参数？

`combineReducers` 被认为是鼓励按域拆分 reducer 逻辑。 正如 [Beyond `combineReducers`](../recipes/structuring-reducers/BeyondCombineReducers.md) 中所述，`combineReducers` 被故意限制为处理单个常见用例：通过委托更新作为普通 Javascript 对象的 state 树，将每个 state 切片更新为特定切片 reducer。

每个 reducer 的潜在第三个参数应该是什么并不是很明显，可以为：整个 state 树、一些回调函数、state 树的其他部分等。如果 `combineReducers` 不适合你的用例，请考虑使用类似的库 [combineSectionReducers](https://github.com/ryo33/combine-section-reducers) 或 [reduceReducers](https://github.com/acdlite/reduce-reducers) 用于具有深度嵌套的 reducer 和需要  reducer 的其他选项访问全局状态。

如果已发布的实用程序都不能解决你的用例，你始终可以自己编写一个完全满足你需要的函数。

#### 更多信息

**文章**

- [Beyond `combineReducers`](../recipes/structuring-reducers/BeyondCombineReducers.md)

**讨论**

- [#1768 允许 reducer 查询全局状态](https://github.com/reactjs/redux/pull/1768)

### 为什么 mapDispatchToProps 不允许使用来自 `getState()` 或 `mapStateToProps()` 的返回值？

如果已经有请求在 `mapDispatch` 中使用整个 `state` 或 `mapState` 的返回值中，当在 `mapDispatch` 中声明函数时，它们可以关闭来自 store 的最新返回值。

`mapDispatch` 不支持这种方法，因为这意味着每次更新 store 时也要调用 `mapDispatch`。 这将导致在每次 state 更新时重新创建函数，从而增加大量性能开销。

处理这个用例的首选方法——需要根据当前 state 和 mapDispatchToProps 函数来改变 props——使用 mergeProps，connect 函数的第三个参数。 如果指定，则传递 `mapStateToProps()`、`mapDispatchToProps()` 和容器组件的 props 的结果。 从 `mergeProps` 返回的普通对象将作为道具传递给包装的组件。

#### 更多信息

**讨论**

- [#237 为什么 mapDispatchToProps 不允许使用 getState() 或 mapStateToProps()？](https://github.com/reactjs/react-redux/issues/237)
