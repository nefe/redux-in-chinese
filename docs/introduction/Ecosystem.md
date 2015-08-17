# 生态

Redux 是一个体小精悍的库，但它相关的内容和 API 都是精挑细选的，为的是衍生出丰富的工具集和可扩展的生态系统。

如果需要关于 Redux 所有内容的列表，推荐移步到 [Awesome Redux](https://github.com/xgrommx/awesome-redux)。它包含了示例、样板代码、中间件、工具库还有很多其它相关内容。

本页内容将只列出其中 Redux 维护者亲自维护的一部分内容。不要因此而打消你尝试其它工具的信心！整个生态发展得太快，我们没有足够的时间去关注所有内容。建议只把这里的当作“内部推荐”，如果你使用 Redux 创建了很酷的内容，不要犹豫，马上发个 PR 吧。

## 不同框架绑定

* [react-redux](https://github.com/gaearon/react-redux) — React
* [ng-redux](https://github.com/wbuchwalter/ng-redux) — Angular

## 中间件

* [redux-thunk](http://github.com/gaearon/redux-thunk) — 用最简单的方式写异步 action 构造器
* [redux-promise](https://github.com/acdlite/redux-promise) — 遵从[FSA](https://github.com/acdlite/flux-standard-action) 的 promise 中间件
* [redux-rx](https://github.com/acdlite/redux-rx) — 给 Redux 用的 RxJS 工具，包括观察者的中件间
* [redux-batched-updates](https://github.com/acdlite/redux-batched-updates) — 以 React 分发器的形式分批更新 React
* [redux-logger](https://github.com/fcomb/redux-logger) — 记录所有 Redux action 和下一次 state 的日志

## 工具集

* [reselect](https://github.com/faassen/reselect) — 有效地派生数据选择器，这从NuclearJS 产生的想法
* [normalizr](https://github.com/gaearon/normalizr) — 标准化内嵌 API 的响应，为了通过 reducers 更方便地作处理
* [redux-actions](https://github.com/acdlite/redux-actions) — 在写 reducers and action 构造器的初始化
* [redux-transducers](https://github.com/acdlite/redux-transducers) — Redux 的编译器工具

## 开发者工具

* [redux-devtools](http://github.com/gaearon/redux-devtools) — 一个像是时间旅行似的 action 日志工具，包括热更新和 reducers 的错误处理器器 [最早演示于 React Europe](https://www.youtube.com/watch?v=xsSnOQynTHs)

## 教程与文章

* [redux-tutorial](https://github.com/happypoulp/redux-tutorial) - 学习如何一步步使用 redux
* [What the Flux?! Let’s Redux.](https://blog.andyet.com/2015/08/06/what-the-flux-lets-redux)
* [Handcrafting an Isomorphic Redux Application (With Love)](https://medium.com/@bananaoomarang/handcrafting-an-isomorphic-redux-application-with-love-40ada4468af4)

## 更多

[Awesome Redux](https://github.com/xgrommx/awesome-redux) 是一个展示丰富 Redux 相关信息的列表。
