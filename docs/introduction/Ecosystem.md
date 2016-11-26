# 生态系统

Redux 是一个体小精悍的库，但它相关的内容和 API 都是精挑细选的，足以衍生出丰富的工具集和可扩展的生态系统。

如果需要关于 Redux 所有内容的列表，推荐移步至 [Awesome Redux](https://github.com/xgrommx/awesome-redux)。它包含了示例、样板代码、中间件、工具库，还有很多其它相关内容。要想学习 React 和 Redux ，[React/Redux Links](https://github.com/markerikson/react-redux-links) 包含了教程和不少有用的资源，[Redux Ecosystem Links](https://github.com/markerikson/redux-ecosystem-links) 则列出了 许多 Redux 相关的库及插件。

本页将只列出由 Redux 维护者审查过的一部分内容。不要因此打消尝试其它工具的信心！整个生态发展得太快，我们没有足够的时间去关注所有内容。建议只把这些当作“内部推荐”，如果你使用 Redux 创建了很酷的内容，不要犹豫，马上发个 PR 吧。

## 学习 Redux

### 演示

* **[开始学习 Redux](https://egghead.io/series/getting-started-with-redux)** — 向作者学习 Redux 基础知识（30 个免费的教学视频）
* **[学习 Redux](https://learnredux.com)** — 搭建一个简单的图片应用，简要使用了 Redux、React Router 和 React.js 的核心思想

### 示例应用

* [官方示例](Examples.md) — 一些官方示例，涵盖了多种 Redux 技术
* [SoundRedux](https://github.com/andrewngu/sound-redux) — 用 Redux 构建的 SoundCloud 客户端
* [grafgiti](https://github.com/mohebifar/grafgiti) — 在你的 Github 的 Contributor 页上创建 graffiti
* [React-lego](https://github.com/peter-mouland/react-lego) — 如何像积木一样，一块块地扩展你的 Redux 技术栈

### 教程与文章

* [Redux 教程](https://github.com/happypoulp/redux-tutorial)
* [Redux Egghead 课程笔记](https://github.com/tayiorbeii/egghead.io_redux_course_notes)
* [使用 React Native 进行数据整合](http://makeitopen.com/tutorials/building-the-f8-app/data/)
* [What the Flux?! Let’s Redux.](https://blog.andyet.com/2015/08/06/what-the-flux-lets-redux)
* [Leveling Up with React: Redux](https://css-tricks.com/learning-react-redux/)
* [A cartoon intro to Redux](https://code-cartoons.com/a-cartoon-intro-to-redux-3afb775501a6)
* [Understanding Redux](http://www.youhavetolearncomputers.com/blog/2015/9/15/a-conceptual-overview-of-redux-or-how-i-fell-in-love-with-a-javascript-state-container)
* [Handcrafting an Isomorphic Redux Application (With Love)](https://medium.com/@bananaoomarang/handcrafting-an-isomorphic-redux-application-with-love-40ada4468af4)
* [Full-Stack Redux Tutorial](http://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html)
* [Getting Started with React, Redux, and Immutable](http://www.theodo.fr/blog/2016/03/getting-started-with-react-redux-and-immutable-a-test-driven-tutorial-part-2/)
* [Secure Your React and Redux App with JWT Authentication](https://auth0.com/blog/2016/01/04/secure-your-react-and-redux-app-with-jwt-authentication/)
* [Understanding Redux Middleware](https://medium.com/@meagle/understanding-87566abcfb7a)
* [Angular 2 — Introduction to Redux](https://medium.com/google-developer-experts/angular-2-introduction-to-redux-1cf18af27e6e)
* [Apollo Client: GraphQL with React and Redux](https://medium.com/apollo-stack/apollo-client-graphql-with-react-and-redux-49b35d0f2641)
* [Using redux-saga To Simplify Your Growing React Native Codebase](https://shift.infinite.red/using-redux-saga-to-simplify-your-growing-react-native-codebase-2b8036f650de)
* [Build an Image Gallery Using Redux Saga](http://joelhooks.com/blog/2016/03/20/build-an-image-gallery-using-redux-saga)
* [Working with VK API (in Russian)](https://www.gitbook.com/book/maxfarseer/redux-course-ru/details)

### 演讲

* [Live React: Hot Reloading and Time Travel](http://youtube.com/watch?v=xsSnOQynTHs) — 了解 Redux 如何使用限制措施，让伴随时间旅行的热加载变得简单
* [Cleaning the Tar: Using React within the Firefox Developer Tools](https://www.youtube.com/watch?v=qUlRpybs7_c) — 了解如何从已有的 MVC 应用逐步迁移至 Redux
* [Redux: Simplifying Application State](https://www.youtube.com/watch?v=okdC5gcD-dM) — Redux 架构介绍

## 使用 Redux

### 不同框架绑定

* [react-redux](https://github.com/gaearon/react-redux) — React
* [ng-redux](https://github.com/wbuchwalter/ng-redux) — Angular
* [ng2-redux](https://github.com/wbuchwalter/ng2-redux) — Angular 2
* [backbone-redux](https://github.com/redbooth/backbone-redux) — Backbone
* [redux-falcor](https://github.com/ekosz/redux-falcor) — Falcor
* [deku-redux](https://github.com/troch/deku-redux) — Deku
* [polymer-redux](https://github.com/tur-nr/polymer-redux) - Polymer
* [ember-redux](https://github.com/toranb/ember-redux) - Ember.js

### 中间件

* [redux-thunk](http://github.com/gaearon/redux-thunk) — 用最简单的方式搭建异步 action 构造器
* [redux-promise](https://github.com/acdlite/redux-promise) — 遵从 [FSA](https://github.com/acdlite/flux-standard-action) 标准的 promise 中间件
* [redux-axios-middleware](https://github.com/svrcekmichal/redux-axios-middleware) — 使用 axios HTTP 客户端获取数据的 Redux 中间件
* [redux-observable](https://github.com/blesh/redux-observable/) — Redux 的 RxJS 中间件
* [redux-rx](https://github.com/acdlite/redux-rx) — 给 Redux 用的 RxJS 工具，包括观察变量的中间件
* [redux-logger](https://github.com/fcomb/redux-logger) — 记录所有 Redux action 和下一次 state 的日志
* [redux-immutable-state-invariant](https://github.com/leoasis/redux-immutable-state-invariant) — 开发中的状态变更提醒
* [redux-unhandled-action](https://github.com/socialtables/redux-unhandled-action) — 开发过程中，若 Action 未使 State 发生变化则发出警告
* [redux-analytics](https://github.com/markdalgleish/redux-analytics) — Redux middleware 分析
* [redux-gen](https://github.com/weo-edu/redux-gen) — Redux middleware 生成器
* [redux-saga](https://github.com/yelouafi/redux-saga) — Redux 应用的另一种副作用 model
* [redux-action-tree](https://github.com/cerebral/redux-action-tree) — Redux 的可组合性 Cerebral-style 信号
* [apollo-client](https://github.com/apollostack/apollo-client) — 针对 GraphQL 服务器及基于 Redux 的 UI 框架的缓存客户端

### 路由

* [redux-simple-router](https://github.com/rackt/redux-simple-router) — 保持 React Router 和 Redux 同步
* [redux-router](https://github.com/acdlite/redux-router) — 由 React Router 绑定到 Redux 的库

### 组件

* [redux-form](https://github.com/erikras/redux-form) — 在 Redux 中时时持有 React 表格的 state
* [react-redux-form](https://github.com/davidkpiano/react-redux-form) — 在 React 中使用 Redux 生成表格

### 增强器（Enhancer）

* [redux-batched-subscribe](https://github.com/tappleby/redux-batched-subscribe) — 针对 store subscribers 的自定义批处理与防跳请求
* [redux-history-transitions](https://github.com/johanneslumpe/redux-history-transitions) — 基于独断的 action 的 history 库转换
* [redux-optimist](https://github.com/ForbesLindesay/redux-optimist) — 使 action 可稍后提交或撤销
* [redux-optimistic-ui](https://github.com/mattkrick/redux-optimistic-ui) — A reducer enhancer to enable type-agnostic optimistic updates 允许对未知类型进行更新的 reducer 增强器
* [redux-undo](https://github.com/omnidan/redux-undo) — 使 reducer 便捷的重做/撤销，以及 action 记录功能
* [redux-ignore](https://github.com/omnidan/redux-ignore) — 通过数组或过滤功能忽略 redux action
* [redux-recycle](https://github.com/omnidan/redux-recycle) — 在确定的 action 上重置 redux 的 state
* [redux-batched-actions](https://github.com/tshelburne/redux-batched-actions) — 单用户通知去 dispatch 多个 action
* [redux-search](https://github.com/treasure-data/redux-search) — 自动 index 站点资源并实现即时搜索
* [redux-electron-store](https://github.com/samiskin/redux-electron-store) — Store 增强器， 可同步不同 Electron 进程上的多个 Redux store
* [redux-loop](https://github.com/raisemarketplace/redux-loop) — Sequence effects purely and naturally by returning them from your reducers
* [redux-side-effects](https://github.com/salsita/redux-side-effects) — Utilize Generators for declarative yielding of side effects from your pure reducers

### 工具集

* [reselect](https://github.com/faassen/reselect) — 受 NuclearJS 启发，有效派生数据的选择器
* [normalizr](https://github.com/gaearon/normalizr) — 为了让 reducers 更好的消化数据，将API返回的嵌套数据范式化
* [redux-actions](https://github.com/acdlite/redux-actions) — 在初始化 reducer 和 action 构造器时减少样板代码 (boilerplate)
* [redux-act](https://github.com/pauldijou/redux-act) — 生成 reducer 和 action 创建函数的库
* [redux-transducers](https://github.com/acdlite/redux-transducers) — Redux 的编译器工具
* [redux-immutablejs](https://github.com/indexiatech/redux-immutablejs) — 将Redux 和 [Immutable](https://github.com/facebook/immutable-js/) 整合到一起的工具
* [redux-tcomb](https://github.com/gcanti/redux-tcomb) — 在 Redux 中使用具有不可变特性、并经过类型检查的 state 和 action
* [redux-mock-store](https://github.com/arnaudbenard/redux-mock-store) - 模拟 redux 来测试应用
* [redux-actions-assertions](https://github.com/dmitry-zaets/redux-actions-assertions) — Redux actions 测试断言

### 开发者工具

* [redux-devtools](http://github.com/gaearon/redux-devtools) — 一个使用时间旅行 UI 、热加载和 reducer 错误处理器的 action 日志工具，[最早演示于 React Europe 会议](https://www.youtube.com/watch?v=xsSnOQynTHs)
* [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension) — 打包了 Redux DevTools 及附加功能的 Chrome 插件

### 开发者工具监听器

* [Log Monitor](https://github.com/gaearon/redux-devtools-log-monitor) — Redux DevTools 默认监听器，提供树状视图
* [Dock Monitor](https://github.com/gaearon/redux-devtools-dock-monitor) — A resizable and movable dock for Redux DevTools monitors
* [Slider Monitor](https://github.com/calesce/redux-slider-monitor) — Redux DevTools 自定义监听器，可回放被记录的 Redux action
* [Inspector](https://github.com/alexkuz/redux-devtools-inspector) — Redux DevTools 自定义监听器，可筛选、区分 action，深入 state 并监测变化
* [Diff Monitor](https://github.com/whetstone/redux-devtools-diff-monitor) — 区分不同 action 的 store 变动的 Redux Devtools 监听器
* [Filterable Log Monitor](https://github.com/bvaughn/redux-devtools-filterable-log-monitor/) — 树状可筛选视图的 Redux DevTools 监听器
* [Chart Monitor](https://github.com/romseguy/redux-devtools-chart-monitor) — Redux DevTools 图表监听器
* [Filter Actions](https://github.com/zalmoxisus/redux-devtools-filter-actions) — 可筛选 action 、可组合使用的 Redux DevTools 监听器


### 社区公约

* [Flux Standard Action](https://github.com/acdlite/flux-standard-action) —  Flux 中 action object 的人性化标准
* [Canonical Reducer Composition](https://github.com/gajus/canonical-reducer-composition) — 嵌套 reducer 组成的武断标准
* [Ducks: Redux Reducer Bundles](https://github.com/erikras/ducks-modular-redux) — 关于捆绑多个 reducer, action 类型 和 action 的提案

### 翻译

* [中文文档](http://camsong.github.io/redux-in-chinese/) — 简体中文
* [繁體中文文件](https://github.com/chentsulin/redux) — 繁体中文
* [Redux in Russian](https://github.com/rajdee/redux-in-russian) — 俄语
* [Redux en Español](http://es.redux.js.org/) - 西班牙语

## 更多

* [Awesome Redux](https://github.com/xgrommx/awesome-redux) 是一个包含大量与 Redux 相关的库列表。
* [React-Redux Links](https://github.com/markerikson/react-redux-links) React、Redux、ES6 的高质量文章、教程、及相关内容列表。
* [Redux Ecosystem Links](https://github.com/markerikson/redux-ecosystem-links) Redux 相关库、插件、工具集的分类资源。
