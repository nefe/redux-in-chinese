---
id: faq
title: FAQ 目录
hide_title: false
---

# Redux FAQ

## 目录

- **了解**
  - [我应该什么时候学习 Redux？](faq/General.md#when-should-i-learn-redux)
  - [我什么时候应该使用 Redux？](faq/General.md#when-should-i-use-redux)
  - [Redux 只能与 React 一起使用吗？](faq/General.md#can-redux-only-be-used-with-react)
  - [我需要特定的构建工具来使用 Redux 吗？](faq/General.md#do-i-need-to-have-a-particular-build-tool-to-use-redux)
- **Reducers**
  - [如何在两个 reducer 之间共享状态？我必须使用 combineReducers 吗？](faq/Reducers.md#how-do-i-share-state-between-two-reducers-do-i-have-to-use-combinereducers)
  - 我必须使用 switch 语句来处理 action 吗？](faq/Reducers.md#do-i-have-to-use-the-switch-statement-to-handle-actions)
- **组织 State**
  - [所有的状态都必须放入 Redux 吗？我应该使用 React 的 setState() 吗？](faq/OrganizingState.md#do-i-have-to-put-all-my-state-into-redux-should-i-ever-use-reacts-setstate)
  - [我可以在 store 中放置函数、promise 或其他不可序列化的内容吗？](faq/OrganizingState.md#can-i-put-functions-promises-or-other-non-serializable-items-in-my-store-state)
  - [如何组织嵌套或重复的数据？](faq/OrganizingState.md#how-do-i-organize-nested-or-duplicate-data-in-my-state)
  - [我应该在 store 中放置表单状态还是其他 UI 状态吗？](faq/OrganizingState.md#should-i-put-form-state-or-other-ui-state-in-my-store)
- **Store 配置**
  - [我可以或应该创建多个 store 吗？我可以直接导入我的 store，然后自己在组件中使用它吗？](faq/StoreSetup.md#can-or-should-i-create-multiple-stores-can-i-import-my-store-directly-and-use-it-in-components-myself)
  - [Store enhancer 中可以有多个 middleware 链吗？middleware 函数中的 next 和 dispatch 有什么区别？](faq/StoreSetup.md#is-it-ok-to-have-more-than-one-middleware-chain-in-my-store-enhancer-what-is-the-difference-between-next-and-dispatch-in-a-middleware-function)
  - [如何只订阅部分 state？我可以将 dispatch 的 action 作为订阅的一部分吗？](faq/StoreSetup.md#how-do-i-subscribe-to-only-a-portion-of-the-state-can-i-get-the-dispatched-action-as-part-of-the-subscription)
- **Actions**
  - [为什么 action type 应该是字符串，或者至少是可序列化的？为什么我的 action type 应该是常量？](faq/Actions.md#why-should-type-be-a-string-or-at-least-serializable-why-should-my-action-types-be-constants)
  - [reducer 和 action 之间是否总是存在一对一的映射？](faq/Actions.md#is-there-always-a-one-to-one-mapping-between-reducers-and-actions)
  - [如何表示“副作用”，例如 AJAX 调用？为什么我们需要诸如“action creator”、“thunk”和“middleware”之类的东西来执行异步行为？](faq/Actions.md#how-can-i-represent-side-effects-such-as-ajax-calls-why-do-we-need-things-like-action-creators-thunks-and-middleware-to-do-async-behavior)
  - [我应该使用什么异步 middleware？你如何在 thunk、sagas、observables 或其他东西之间做出选择？](faq/Actions.md#what-async-middleware-should-i-use-how-do-you-decide-between-thunks-sagas-observables-or-something-else)
  - [我应该从一个 action creator 连续 dispatch 多个 action 吗？](faq/Actions.md#should-i-dispatch-multiple-actions-in-a-row-from-one-action-creator)
- **Immutable Data**
  - [不可变数据的好处是什么？](faq/ImmutableData.md#what-are-the-benefits-of-immutability)
  - [为什么 Redux 需要不可变数据？](faq/ImmutableData.md#why-is-immutability-required-by-redux)
  - [处理数据不变性有哪些方法？我必须使用 Immer 吗？](faq/ImmutableData.md#what-approaches-are-there-for-handling-data-immutability-do-i-have-to-use-immer)
  - [使用 JavaScript 进行不可变操作有什么问题？](faq/ImmutableData.md#what-are-the-issues-with-using-plain-javascript-for-immutable-operations)
- **代码结构**
  - [我的文件结构应该是什么样的？我应该如何在我的项目中对我的 action creator 和 reducer 进行分组？我的 selector 应该放哪里？](faq/CodeStructure.md#what-should-my-file-structure-look-like-how-should-i-group-my-action-creators-and-reducers-in-my-project-where-should-my-selectors-go)
  - [我应该如何把业务逻辑拆分到 reducer 和 action creator？我的“业务逻辑”应该去哪里？](faq/CodeStructure.md#how-should-i-split-my-logic-between-reducers-and-action-creators-where-should-my-business-logic-go)
  - [为什么我应该使用 action creators](faq/CodeStructure.md#why-should-i-use-action-creators)
  - [Websockets 和其他持久连接应该在哪里？](faq/CodeStructure.md#where-should-websockets-and-other-persistent-connections-live)
  - [如何在非组件文件中使用 Redux store？](faq/CodeStructure.md#how-can-i-use-the-redux-store-in-non-component-files)
- **Performance 性能**
  - [Redux 在大型项目的性能和架构上表现如何？](faq/Performance.md#how-well-does-redux-scale-in-terms-of-performance-and-architecture)
  - [每个 action 都会调用“所有 reducer” 会很慢吗？](faq/Performance.md#wont-calling-all-my-reducers-for-each-action-be-slow)
  - [我必须在 reducer 中深拷贝 state 吗？复制 state 不会很慢吗？](faq/Performance.md#do-i-have-to-deep-clone-my-state-in-a-reducer-isnt-copying-my-state-going-to-be-slow)
  - [如何减少 store 更新事件的数量？](faq/Performance.md#how-can-i-reduce-the-number-of-store-update-events)
  - [只有“一个 state tree”会导致内存问题吗？dispatch 许多 action 会占用内存吗？](faq/Performance.md#will-having-one-state-tree-cause-memory-problems-will-dispatching-many-actions-take-up-memory)
  - [缓存远程数据会导致内存问题吗？](faq/Performance.md#will-caching-remote-data-cause-memory-problems)
- **设计决策**
  - [为什么 Redux 不将 state 和 action 传递给订阅者？](faq/DesignDecisions.md#why-doesnt-redux-pass-the-state-and-action-to-subscribers)
  - [为什么 Redux 不支持使用类 class 做 action 和 reducer ？](faq/DesignDecisions.md#why-doesnt-redux-support-using-classes-for-actions-and-reducers)
  - [为什么middleware 签名使用柯里化？](faq/DesignDecisions.md#why-does-the-middleware-signature-use-currying)
  - [为什么 applyMiddleware 使用闭包进行调度？](faq/DesignDecisions.md#why-does-applymiddleware-use-a-closure-for-dispatch)
  - [为什么 `combineReducers` 在调用每个 reducer 时不包含整个状态的第三个参数？](faq/DesignDecisions.md#why-doesnt-combinereducers-include-a-third-argument-with-the-entire-state-when-it-calls-each-reducer)
  - [为什么 `mapDispatchToProps` 不允许使用来自 `getState()` 或 `mapStateToProps()` 的返回值？](faq/DesignDecisions.md#why-doesnt-mapdispatchtoprops-allow-use-of-return-values-from-getstate-or-mapstatetoprops)
- **React Redux**
  - [为什么要使用 React-Redux？](faq/ReactRedux.md#why-should-i-use-react-redux)
  - [为什么我的组件没有重新渲染，或者我的 mapStateToProps 没有运行？](faq/ReactRedux.md#why-isnt-my-component-re-rendering-or-my-mapstatetoprops-running)
  - [为什么我的组件经常重新渲染？](faq/ReactRedux.md#why-is-my-component-re-rendering-too-often)
  - [如何让我的 mapStateToProps 性能更好？](faq/ReactRedux.md#how-can-i-speed-up-my-mapstatetoprops)
  - [为什么我的 connect 组件中没有 this.props.dispatch？](faq/ReactRedux.md#why-dont-i-have-this-props-dispatch-available-in-my-connected-component)
  - [我应该只 connect 顶部组件，还是可以 connect 树中的多个组件？](faq/ReactRedux.md#should-i-only-connect-my-top-component-or-can-i-connect-multiple-components-in-my-tree)
- **其他**
  - [有更大的、“真正生产环境的”项目在使用 Redux？](faq/Miscellaneous.md#are-there-any-larger-real-redux-projects)
  - [如何在 Redux 中实现身份验证？](faq/Miscellaneous.md#how-can-i-implement-authentication-in-redux)
