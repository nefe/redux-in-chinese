# Redux 常见问题: 设计哲学

## 目录

- [为什么 Redux 不把 state 和 action 传给订阅者？](#does-not-pass-state-action-to-subscribers) 
- [为什么 Redux 不支持 class 形式的 action 和 reducer？](#does-not-support-classes) 
- [为什么 middleware 签名是柯里化的形式？](#why-currying)
- [为什么 `applyMiddlewrae` 要为 `dispatch` 创建一个闭包？](#closure-dispatch)
- [在 `combineReducers` 调用其所有 reducer 时，为什么不引入第三个参数来表示整个 state？](#combineReducers-limitations)
- [为什么 `mapDispatchToProps` 中不允许使用 `getState()` 或 `mapStateToProps()` 的返回值？](#no-asynch-in-mapDispatchToProps)


## 设计哲学

<a id="does-not-pass-state-action-to-subscribers"></a>
### 为什么 Redux 不把 state 和 action 传给订阅者？
订阅者（subscribers）的意图是响应 state，而不是 action。对 state 的更新是同步的，但给订阅者的通知可能是批处理（batched）或节流（debounced）的，也就是说每次 action 发出时，订阅者不一定立刻得到通知。这是一种常见的避免重复渲染所做的 [性能优化](http://cn.redux.js.org/docs/faq/Performance.html#performance-update-events)。

使用 enhancer 来替换 `store.dispatch` 是可以覆盖批处理或节流行为的，从而改变通知订阅者的方式。同时，有些类库可以让 Redux 成批处理 action 来优化性能的同时避免重复渲染：
* [redux-batch](https://github.com/manaflair/redux-batch) 允许向 `store.dispatch()` 传递一个由 action 组成的数组，包含的这些 action 只发送一个通知。
* [redux-batched-subscribe](https://github.com/tappleby/redux-batched-subscribe) 允许 dispatch 后成批地给订阅者发送通知。

这是为了保证 Redux 最终调用所有订阅者时使用最新的 state，但并非在每次 action 发出后调用所有订阅者。在订阅者中你很容易得到 store 当前的 state，只需调用 `store.getState()` 就行了。而在订阅者中你却没法得到 action，因为多个 action 可能会被成批处理。

在订阅者中使用 action 有一种可能的使用场景（当然这个特性并不支持），就是为了保证组件只在特定 action 发出后重新渲染。而对于重新渲染的控制应使用以下方法代替：
1. [shouldComponentUpdate](https://facebook.github.io/react/docs/react-component.html#shouldcomponentupdate) 生命周期函数
2. [virtual DOM 相等性检查 (vDOMEq)](https://facebook.github.io/react/docs/optimizing-performance.html#avoid-reconciliation)、
3. [React.PureComponent](https://facebook.github.io/react/docs/optimizing-performance.html#examples)
4. 使用 React-Redux：用 [mapStateToProps](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) 订阅组件时，只订阅它需要的那部分 store。

#### 更多信息
**文章**
 * [How can I reduce the number of store update events?](https://cn.redux.js.org/docs/faq/Performance.html#performance-update-events)

**讨论**
* [#580: Why doesn't Redux pass the state to subscribers?](https://github.com/reactjs/redux/issues/580)
* [#2214: Alternate Proof of Concept: Enhancer Overhaul -- more on debouncing](https://github.com/reactjs/redux/pull/2214)

<a id="does-not-support-classes"></a>
### 为什么 Redux 不支持 class 形式的 action 和 reducer？
Redux 使用函数（称为 action 创建函数）来返回一个 action 对象的模式，在某些有着丰富面向对象开发经验的程序员眼中，似乎显得有悖常理。他们觉得这是这显然是类（class）和实例（instance）的使用场景。然而 Redux 不支持类的实例作为 action 对象和函数，这是因为类的实例会使得序列化（serialization）和反序列化（serialization）这样的工作更加棘手。如 `JSON.parse(string)` 这样的反序列化方法返回的是一个普通 JavaScript 对象而不是一个类的实例。

正如 [组织 State](https://cn.redux.js.org/docs/faq/OrganizingState.html#organizing-state-non-serializable) 所描述的那样，如果你不需要像数据持久化、时间旅行调试这样的功能，那么完全欢迎把不可以序列化的数据放入 Redux 的 Store 中存储。

序列化可使浏览器使用更少的内存，储存之前所有被 dispatch 的 action，以及 store 中所有以前的 state。时间回溯和“热加载”是提升 Redux 开发者开发体验的核心，也是 Redux Devtools 的功能所在。而且在 Redux 服务端渲染的场景中，可以把已经序列化的 action 储存在服务器，然后在浏览器中重新序列化。

#### 更多信息
**文章**
* [可以将 store 的 state 设置为函数、promise或者其它非序列化值吗？](https://cn.redux.js.org/docs/faq/OrganizingState.html#organizing-state-non-serializable)

**讨论**
* [#1171: Why doesn't Redux use classes for actions and reducers?](https://github.com/reactjs/redux/issues/1171#issuecomment-196819727)

<a id="why-currying"></a>
### 为什么 middleware 签名是柯里化（currying）的形式？
有些人认为使用 [柯里化函数签名] 的方式声明 middleware 是 [没有必要的](https://github.com/reactjs/redux/pull/784) ，因为当 applyMiddleware 函数执行时 store 和 next 都是存在的。这个 issue 已经被认为是 [不值得为此引入破坏性修改](https://github.com/reactjs/redux/issues/1744)。

#### 更多信息
**讨论**
* 为什么 middleware 签名是柯里化（currying）的形式？
    * 参见 [#55](https://github.com/reactjs/redux/pull/55), [#534](https://github.com/reactjs/redux/issues/534), [#784](https://github.com/reactjs/redux/pull/784), [#922](https://github.com/reactjs/redux/issues/922), [#1744](https://github.com/reactjs/redux/issues/1744)

<a id="closure-dispatch"></a>
### 为什么 `applyMiddleware` 要为 `dispatch` 创建一个闭包？
`applyMiddleware` 从 store 中获取已有的 dispatch，然后把它封装在一个闭包中来创建最开始的 middleware 链。然后用一个对象调用来调用，以暴露出 getState 和 dispatch 函数。这样做可以使得 middleware [在初始化时可以使用 dispatch](https://github.com/reactjs/redux/pull/1592)。

#### 更多信息
**讨论**
* 为什么 `applyMiddleware` 要为 `dispatch` 创建一个闭包？
    * 参见 [#1592](https://github.com/reactjs/redux/pull/1592) 以及 [#2097](https://github.com/reactjs/redux/issues/2097)

<a id="combineReducers-limitations"></a>
### 在 `combineReducers` 调用其所有 reducer 时，为什么不引入第三个参数来表示整个 state？

`combienReducer` 鼓励你按照“域”（domain）来划分 reducer 逻辑。正如 [`combineReducers` 进阶](https://cn.redux.js.org/docs/recipes/reducers/BeyondCombineReducers.html) 所说，`combineReducers` 被有意限制于单一的应用场景：把不同片段的 state 的更新工作委托给一个特定的 reducer，以此更新由普通的 JavaScript 对象构成的 state 树。

对于每一个 reducer 来说，潜在的第三个参数应该是什么并不那么确定：可以是整个 state 树、可以是某些回调函数、可以是 state 树的其它部分、等等。如果 `combineReducers` 不符合你的使用场景，可以考虑使用其它的库，比如 [combineSectionReducers](https://github.com/ryo33/combine-section-reducers) 或 [reduceReducers](https://github.com/acdlite/reduce-reducers)，来获取更多选项：诸如深层嵌套的 reducer 或能够获取到全局 state 的 reducer。

如果这些发布的工具都解决不了你的使用场景，你总是可以自行实现一个函数来精确地实现你的需求。

#### 更多信息
**文章**
* [`combineReducers` 进阶](https://cn.redux.js.org/docs/recipes/reducers/BeyondCombineReducers.html)

**讨论**
* [#1768 Allow reducers to consult global state](https://github.com/reactjs/redux/pull/1768)

<a id="no-asynch-in-mapDispatchToProps"></a>
### 为什么 `mapDispatchToProps` 中不允许使用 `getState()` 或 `mapStateToProps()` 的返回值？

曾经有人希望在 `mapDispatch` 中使用整个 `state` 或 `mapState` 的返回值，这样一来 `mapDispatch` 中声明的函数就能拿到 `store` 中最新的返回值了。

然而 `mapDispatch` 并不支持这种做法，因为这么做意味着每次 store 更新后 `mapDispatch` 也需要被调用，导致每次 state 更新后函数需要重新创建，从而带来很多性能开销。

像这种“需要基于当前 state 以及 mapDispatchToProps 函数来替换 prop”的场景，正确的处理方式是使用 mergeProps（connect 函数的第三个参数）。如果这个参数被定义，它会被传入 `mapStateToProps()` 和 `mapDispatchToProps()` 的结果、以及容器组件的 prop。而 `mergeProps` 返回的普通对象（plain object）会作为 prop 传入包装的组件（wrapped component）。

#### 更多信息
**讨论**
* [#237 Why doesn't mapDispatchToProps allow use of return values from getState() or mapStateToProps()?](https://github.com/reactjs/react-redux/issues/237)
