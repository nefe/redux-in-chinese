# 生态

Redux 是一个体小精悍的库，但它相关的内容和 API 都是精挑细选的，足以衍生出丰富的工具集和可扩展的生态系统。

如果需要关于 Redux 所有内容的列表，推荐移步至 [Awesome Redux](https://github.com/xgrommx/awesome-redux)。它包含了示例、样板代码、中间件、工具库，还有很多其它相关内容。

本页将只列出其中由 Redux 维护者亲自维护的一部分内容。不要因此打消尝试其它工具的信心！整个生态发展得太快，我们没有足够的时间去关注所有内容。建议只把这些当作“内部推荐”，如果你使用 Redux 创建了很酷的内容，不要犹豫，马上发个 PR 吧。

## 不同框架绑定

* [react-redux](https://github.com/gaearon/react-redux) — React
* [ng-redux](https://github.com/wbuchwalter/ng-redux) — Angular
* [ng2-redux](https://github.com/wbuchwalter/ng2-redux) — Angular 2

## 中间件

* [redux-thunk](http://github.com/gaearon/redux-thunk) — 用最简单的方式写异步 action 构造器
* [redux-promise](https://github.com/acdlite/redux-promise) — 遵从[FSA](https://github.com/acdlite/flux-standard-action) 的 promise 中间件
* [redux-rx](https://github.com/acdlite/redux-rx) — 给 Redux 用的 RxJS 工具，包括观察变量的中件间
* [redux-logger](https://github.com/fcomb/redux-logger) — 记录所有 Redux action 和下一次 state 的日志
* [redux-immutable-state-invariant](https://github.com/leoasis/redux-immutable-state-invariant) — 开发中的状态变更提醒

## 组件

* [redux-form](https://github.com/erikras/redux-form) — 在 Redux 中维持 React 表格的状态

## Store 增效器

* [redux-batched-subscribe](https://github.com/tappleby/redux-batched-subscribe) — 对于 store subscribers 的自定义批处理与防跳请求 
* [redux-history-transitions](https://github.com/johanneslumpe/redux-history-transitions) — 基于随意 action 的历史记录变动

## Reducer 增效器

* [redux-optimist](https://github.com/ForbesLindesay/redux-optimist) — Optimistically apply actions that can be later commited or reverted 随后提交或重做的 action 的乐观
* [redux-undo](https://github.com/omnidan/redux-undo) — Effortless undo/redo and action history for your reducers

## 工具集

* [reselect](https://github.com/faassen/reselect) — 有效派生数据的选择器，受 NuclearJS 启发
* [normalizr](https://github.com/gaearon/normalizr) — 标准化内嵌 API 的响应，为了通过 reducers 更方便地作处理
* [redux-actions](https://github.com/acdlite/redux-actions) — 在写 reducers and action 构造器的初始化
* [redux-transducers](https://github.com/acdlite/redux-transducers) — Redux 的编译器工具
* [redux-immutablejs](https://github.com/indexiatech/redux-immutablejs) — Integration tools between Redux and [Immutable](https://github.com/facebook/immutable-js/)
* [redux-tcomb](https://github.com/gcanti/redux-tcomb) — Immutable and type-checked state and actions for Redux

## 开发者工具

* [redux-devtools](http://github.com/gaearon/redux-devtools) — 一个像是时间旅行似的 action 日志工具，包括热更新和 reducers 的错误处理器 [最早演示于 React Europe](https://www.youtube.com/watch?v=xsSnOQynTHs)

## 教程与文章

* [redux-tutorial](https://github.com/happypoulp/redux-tutorial) - 学习如何一步步使用 redux
* [What the Flux?! Let’s Redux.](https://blog.andyet.com/2015/08/06/what-the-flux-lets-redux)
* [Handcrafting an Isomorphic Redux Application (With Love)](https://medium.com/@bananaoomarang/handcrafting-an-isomorphic-redux-application-with-love-40ada4468af4)
* [Full-Stack Redux Tutorial](http://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html) — A comprehensive guide to test-first development with Redux, React, and Immutable

## 演讲

* [Live React: Hot Reloading and Time Travel](http://youtube.com/watch?v=xsSnOQynTHs) — See how constraints enforced by Redux make hot reloading with time travel easy
* [Cleaning the Tar: Using React within the Firefox Developer Tools](https://www.youtube.com/watch?v=qUlRpybs7_c) — Learn how to gradually migrate existing MVC applications to Redux

## 社区公约

* [Flux Standard Action](https://github.com/acdlite/flux-standard-action) — A human-friendly standard for Flux action objects
* [Canonical Reducer Composition](https://github.com/gajus/canonical-reducer-composition) — An opinionated standard for nested reducer composition
* [Ducks: Redux Reducer Bundles](https://github.com/erikras/ducks-modular-redux) — A proposal for bundling reducers, action types and actions

## 更多

[Awesome Redux](https://github.com/xgrommx/awesome-redux) 是一个展示丰富 Redux 相关信息的列表。
