---
id: faq
title: FAQ Index
sidebar_label: FAQ Index
description: 'FAQ Index: Frequently Asked Questions about Redux'
---

# Redux 常见问答

## 目录

- **常见问题**
  - [应该什么时候学习 Redux？](faq/General.md#when-should-i-learn-redux)
  - [应该什么时候使用 Redux？](faq/General.md#when-should-i-use-redux)
  - [Redux 只能与 React 一起使用吗？](faq/General.md#can-redux-only-be-used-with-react)
  - [是否需要特定的构建工具才能使用 Redux？](faq/General.md#do-i-need-to-have-a-particular-build-tool-to-use-redux)
- **Reducers**
  - [如何在两个 reducers 之间共享 state？必须使用 combineReducers 吗？](faq/Reducers.md#how-do-i-share-state-between-two-reducers-do-i-have-to-use-combinereducers)
  - [是否必须使用 switch 语句来处理 actions 吗？](faq/Reducers.md#do-i-have-to-use-the-switch-statement-to-handle-actions)
- **组织 State**
  - [必须将所有的 state 都放入 Redux 吗？应该使用 React 的 setState() 吗？](faq/OrganizingState.md#do-i-have-to-put-all-my-state-into-redux-should-i-ever-use-reacts-setstate)
  - [可以将函数、promises 或其他不可序列化的项放入 store state 吗？](faq/OrganizingState.md#can-i-put-functions-promises-or-other-non-serializable-items-in-my-store-state)
  - [如何组织 state 中的嵌套或重复数据？](faq/OrganizingState.md#how-do-i-organize-nested-or-duplicate-data-in-my-state)
  - [应该将表单 state 或其他 UI state 放入 store 吗？](faq/OrganizingState.md#should-i-put-form-state-or-other-ui-state-in-my-store)
- **Store 设置**
  - [可以或者应该创建多个 stores 吗？可以直接导入 stores，并在组件中使用它吗？](faq/StoreSetup.md#can-or-should-i-create-multiple-stores-can-i-import-my-store-directly-and-use-it-in-components-myself)
  - [Store enhancer 中可以有多个 middleware 链吗？Middleware 函数中的 next 和 dispatch 有什么区别？](faq/StoreSetup.md#is-it-ok-to-have-more-than-one-middleware-chain-in-my-store-enhancer-what-is-the-difference-between-next-and-dispatch-in-a-middleware-function)
  - [如何能够只订阅 state 的一部分？可以将 dispatch action 作为订阅的一部分吗？](faq/StoreSetup.md#how-do-i-subscribe-to-only-a-portion-of-the-state-can-i-get-the-dispatched-action-as-part-of-the-subscription)
- **Actions**
  - [为什么 type 应该是一个字符串，或者至少是可序列化的？为什么 action types 应该是常量？](faq/Actions.md#why-should-type-be-a-string-or-at-least-serializable-why-should-my-action-types-be-constants)
  - [Reducers 和 actions 之间总是存在一对一的映射关系吗？](faq/Actions.md#is-there-always-a-one-to-one-mapping-between-reducers-and-actions)
  - [如何表示 AJAX 调用等“副作用”？为什么我们需要 action creator、thunk 和 middleware 这些来处理异步行为？](faq/Actions.md#how-can-i-represent-side-effects-such-as-ajax-calls-why-do-we-need-things-like-action-creators-thunks-and-middleware-to-do-async-behavior)
  - [应该使用哪个异步 middleware？如何在 thunk、sagas、observables 或其他中做出选择？](faq/Actions.md#what-async-middleware-should-i-use-how-do-you-decide-between-thunks-sagas-observables-or-something-else)
  - [应该从一个 action creator 连续 dispatch 多个 actions 吗？](faq/Actions.md#should-i-dispatch-multiple-actions-in-a-row-from-one-action-creator)
- **不可变数据**
  - [不变性有什么好处？](faq/ImmutableData.md#what-are-the-benefits-of-immutability)
  - [为什么 Redux 需要不可变性？](faq/ImmutableData.md#why-is-immutability-required-by-redux)
  - [有哪些方法可以处理数据不变性？必须使用 Immer 吗？](faq/ImmutableData.md#what-approaches-are-there-for-handling-data-immutability-do-i-have-to-use-immer)
  - [使用 JavaScript 进行不可变操作会有什么问题？](faq/ImmutableData.md#what-are-the-issues-with-using-plain-javascript-for-immutable-operations)
- **代码结构**
  - [文件结构应该是什么样的？应该如何对 action creators 和 reducers 进行分组？Selectors 应该放在哪里？](faq/CodeStructure.md#what-should-my-file-structure-look-like-how-should-i-group-my-action-creators-and-reducers-in-my-project-where-should-my-selectors-go)
  - [应该如何在 reducers 和 action creators 之间划分逻辑？“业务逻辑”应该放在哪里？](faq/CodeStructure.md#how-should-i-split-my-logic-between-reducers-and-action-creators-where-should-my-business-logic-go)
  - [为什么应该使用 action creators？](faq/CodeStructure.md#why-should-i-use-action-creators)
  - [Websockets 以及其他持久连接应该放在哪里？](faq/CodeStructure.md#where-should-websockets-and-other-persistent-connections-live)
  - [如何在非组件文件中使用 Redux store？](faq/CodeStructure.md#how-can-i-use-the-redux-store-in-non-component-files)
- **性能**
  - [Redux 在性能和架构方面的“扩展性”如何？](faq/Performance.md#how-well-does-redux-scale-in-terms-of-performance-and-architecture)
  - [为每个 action 调用“所有的 reducers” 会不会很慢？](faq/Performance.md#wont-calling-all-my-reducers-for-each-action-be-slow)
  - [必须在 reducer 中深拷贝 state 吗？拷贝 state 不会很慢吗？](faq/Performance.md#do-i-have-to-deep-clone-my-state-in-a-reducer-isnt-copying-my-state-going-to-be-slow)
  - [如何减少 store 更新事件的数量？](faq/Performance.md#how-can-i-reduce-the-number-of-store-update-events)
  - [“单状态树”会导致内存问题吗？Dispatch 很多 actions 会占用内存吗？](faq/Performance.md#will-having-one-state-tree-cause-memory-problems-will-dispatching-many-actions-take-up-memory)
  - [缓存远端数据会导致内存问题吗？](faq/Performance.md#will-caching-remote-data-cause-memory-problems)
- **设计决策**
  - [为什么 Redux 不将 state 和 action 传递给订阅者？](faq/DesignDecisions.md#why-doesnt-redux-pass-the-state-and-action-to-subscribers)
  - [为什么 Redux 不支持对 action 和 reducer 使用 class？](faq/DesignDecisions.md#why-doesnt-redux-support-using-classes-for-actions-and-reducers)
  - [为什么 middleware 签名使用柯里化？](faq/DesignDecisions.md#why-does-the-middleware-signature-use-currying)
  - [为什么 applyMiddleware 使用闭包进行 dispatch？](faq/DesignDecisions.md#why-does-applymiddleware-use-a-closure-for-dispatch)
  - [为什么 `combineReducers` 在调用每个 reducer 时不接收整个 state 作为第三个参数？](faq/DesignDecisions.md#why-doesnt-combinereducers-include-a-third-argument-with-the-entire-state-when-it-calls-each-reducer)
  - [为什么 mapDispatchToProps 不允许使用来自 `getState()` 或 `mapStateToProps()` 的返回值？](faq/DesignDecisions.md#why-doesnt-mapdispatchtoprops-allow-use-of-return-values-from-getstate-or-mapstatetoprops)
- **React Redux**
  - [为什么应该使用 React-Redux？](faq/ReactRedux.md#why-should-i-use-react-redux)
  - [为什么我的组件没有重新渲染，或者 mapStateToProps 没有运行？](faq/ReactRedux.md#why-isnt-my-component-re-rendering-or-my-mapstatetoprops-running)
  - [为什么我的组件经常重新渲染？](faq/ReactRedux.md#why-is-my-component-re-rendering-too-often)
  - [如何加速 mapStateToProps？](faq/ReactRedux.md#how-can-i-speed-up-my-mapstatetoprops)
  - [为什么 connected 组件中没有 this.props.dispatch 可用？](faq/ReactRedux.md#why-dont-i-have-this-props-dispatch-available-in-my-connected-component)
  - [应该只 connect 顶层组件，还是可以 connect 树中的多个组件？](faq/ReactRedux.md#should-i-only-connect-my-top-component-or-can-i-connect-multiple-components-in-my-tree)
- **其他**
  - [有没有更大的、“真实的” Redux 项目？](faq/Miscellaneous.md#are-there-any-larger-real-redux-projects)
  - [如何在 Redux 中实现身份验证？](faq/Miscellaneous.md#how-can-i-implement-authentication-in-redux)
