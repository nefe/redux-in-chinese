# 生态系统

Redux 是一个体小精悍的库，但它相关的内容和 API 都是精挑细选的，足以衍生出丰富的工具集和可扩展的生态系统。

如果需要关于 Redux 所有内容的列表，推荐移步至 [Awesome Redux](https://github.com/xgrommx/awesome-redux)。它包含了示例、样板代码、中间件、工具库，还有很多其它相关内容。

本页将只列出由 Redux 维护者审查过的一部分内容。不要因此打消尝试其它工具的信心！整个生态发展得太快，我们没有足够的时间去关注所有内容。建议只把这些当作“内部推荐”，如果你使用 Redux 创建了很酷的内容，不要犹豫，马上发个 PR 吧。

## 学习 Redux

### 演示

* **[开始学习 Redux](https://egghead.io/series/getting-started-with-redux)** — 从作者那学习 Redux 的基础知识（30 个免费的教学视频）

### 示例应用

* [SoundRedux](https://github.com/andrewngu/sound-redux) — 用 Redux 构建的 SoundCloud 客户端
* [Shopping Cart (Flux Comparison)](https://github.com/voronianski/flux-comparison/tree/master/redux) — 用于和 Flux 框架做对比的购物车示例

### 教程与文章

* [redux-tutorial](https://github.com/happypoulp/redux-tutorial) — 逐步学习使用 Redux
* [What the Flux?! Let’s Redux.](https://blog.andyet.com/2015/08/06/what-the-flux-lets-redux) — Redux 介绍
* [A cartoon intro to Redux](https://code-cartoons.com/a-cartoon-intro-to-redux-3afb775501a6) — 通过卡通动画来介绍 Redux 数据流向
* [Understanding Redux](http://www.youhavetolearncomputers.com/blog/2015/9/15/a-conceptual-overview-of-redux-or-how-i-fell-in-love-with-a-javascript-state-container) — 学习 Redux 的基础概念
* [Handcrafting an Isomorphic Redux Application (With Love)](https://medium.com/@bananaoomarang/handcrafting-an-isomorphic-redux-application-with-love-40ada4468af4) — 使用数据抓取与路由分发的同构应用创建指南
* [Full-Stack Redux Tutorial](http://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html) — 使用 Redux 、React 和 Immutable 的测试优先开发指南
* [Understanding Redux Middleware](https://medium.com/@meagle/understanding-87566abcfb7a#.l033pyr02) — Redux middleware 实践的深度指南
* [A Simple Way to Route with Redux](http://jlongster.com/A-Simple-Way-to-Route-with-Redux) — 介绍 Redux 做路由的一种简单形式

### 演讲

* [Live React: Hot Reloading and Time Travel](http://youtube.com/watch?v=xsSnOQynTHs) — 了解 Redux 如何使用限制措施，让伴随时间旅行的热加载变得简单
* [Cleaning the Tar: Using React within the Firefox Developer Tools](https://www.youtube.com/watch?v=qUlRpybs7_c) — 了解如何从已有的 MVC 应用逐步迁移至 Redux

## 使用 Redux

### 不同框架绑定

* [react-redux](https://github.com/gaearon/react-redux) — React
* [ng-redux](https://github.com/wbuchwalter/ng-redux) — Angular
* [ng2-redux](https://github.com/wbuchwalter/ng2-redux) — Angular 2
* [backbone-redux](https://github.com/redbooth/backbone-redux) — Backbone
* [redux-falcor](https://github.com/ekosz/redux-falcor) — Falcor
* [deku-redux](https://github.com/troch/deku-redux) — Deku

### 中间件

* [redux-thunk](http://github.com/gaearon/redux-thunk) — 用最简单的方式搭建异步 action 构造器
* [redux-promise](https://github.com/acdlite/redux-promise) — 遵从 [FSA](https://github.com/acdlite/flux-standard-action) 标准的 promise 中间件
* [redux-rx](https://github.com/acdlite/redux-rx) — 给 Redux 用的 RxJS 工具，包括观察变量的中间件
* [redux-logger](https://github.com/fcomb/redux-logger) — 记录所有 Redux action 和下一次 state 的日志
* [redux-immutable-state-invariant](https://github.com/leoasis/redux-immutable-state-invariant) — 开发中的状态变更提醒
* [redux-analytics](https://github.com/markdalgleish/redux-analytics) — Redux middleware 分析
* [redux-gen](https://github.com/weo-edu/redux-gen) — Redux middleware 生成器

### 路由

* [redux-router](https://github.com/rackt/redux-router) — 由 React Router 绑定到 Redux 的库
* [redux-simple-router](https://github.com/jlongster/redux-simple-router) — 保持 React Router 和 Redux 同步

### 组件

* [redux-form](https://github.com/erikras/redux-form) — 在 Redux 中时时持有 React 表格的 state

### 增强器（Enhancer）

* [redux-batched-subscribe](https://github.com/tappleby/redux-batched-subscribe) — 针对 store subscribers 的自定义批处理与防跳请求
* [redux-history-transitions](https://github.com/johanneslumpe/redux-history-transitions) — 基于独断的 action 的 history 库转换
* [redux-optimist](https://github.com/ForbesLindesay/redux-optimist) — 乐观使用将被提交或还原的 action
* [redux-undo](https://github.com/omnidan/redux-undo) —
使 reducer 具有便捷的重做/撤销，以及 action 记录功能
* [redux-ignore](https://github.com/omnidan/redux-ignore) — 通过数组或过滤功能忽略 redux action
* [redux-recycle](https://github.com/omnidan/redux-recycle) — 在确定的 action 上重置 redux 的 state
* [redux-batched-actions](https://github.com/tshelburne/redux-batched-actions) — 单用户通知去 dispatch 多个 action

### 工具集

* [reselect](https://github.com/faassen/reselect) — 受 NuclearJS 启发，有效派生数据的选择器
* [normalizr](https://github.com/gaearon/normalizr) — 为了让 reducers 更好的消化数据，将API返回的嵌套数据范式化
* [redux-actions](https://github.com/acdlite/redux-actions) — 在初始化 reducer 和 action 构造器时减少样板代码 (boilerplate)
* [redux-act](https://github.com/pauldijou/redux-act) — 生成 reducer 和 action 创建函数的库
* [redux-transducers](https://github.com/acdlite/redux-transducers) — Redux 的编译器工具
* [redux-immutablejs](https://github.com/indexiatech/redux-immutablejs) — 将Redux 和 [Immutable](https://github.com/facebook/immutable-js/) 整合到一起的工具
* [redux-tcomb](https://github.com/gcanti/redux-tcomb) — 在 Redux 中使用具有不可变特性、并经过类型检查的 state 和 action
* [redux-mock-store](https://github.com/arnaudbenard/redux-mock-store) - 模拟 redux 来测试应用

### 开发者工具

* [redux-devtools](http://github.com/gaearon/redux-devtools) — 一个使用时间旅行 UI 、热加载和 reducer 错误处理器的 action 日志工具，[最早演示于 React Europe 会议](https://www.youtube.com/watch?v=xsSnOQynTHs)

### 社区公约

* [Flux Standard Action](https://github.com/acdlite/flux-standard-action) —  Flux 中 action object 的人性化标准
* [Canonical Reducer Composition](https://github.com/gajus/canonical-reducer-composition) — 嵌套 reducer 组成的武断标准
* [Ducks: Redux Reducer Bundles](https://github.com/erikras/ducks-modular-redux) — 关于捆绑多个 reducer, action 类型 和 action 的提案

## 更多

[Awesome Redux](https://github.com/xgrommx/awesome-redux) 是一个包含大量与 Redux 相关的库列表。
