# [Redux 中文文档](http://github.com/camsong/redux-in-chinese) [![Join the chat at https://gitter.im/camsong/redux-in-chinese](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/camsong/redux-in-chinese?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Build Status](https://travis-ci.org/camsong/redux-in-chinese.svg?branch=master)](https://travis-ci.org/camsong/redux-in-chinese)

<img src='https://camo.githubusercontent.com/f28b5bc7822f1b7bb28a96d8d09e7d79169248fc/687474703a2f2f692e696d6775722e636f6d2f4a65567164514d2e706e67' height='60'>

> :tada: :tada: :tada:
> 本文档从建立之初，帮助了非常多的小伙伴学习 Redux，也收到了 Redux 作者 Dan 的多次点赞。目前每天浏览量大概在一万左右。但由于几位作者工作都比较忙，很多文档已经过期，却也没有时间更新。如果你有时间，希望你和我们一起翻译，帮助更多人，欢迎提交 PR。不知何处下手不用怕？我们为你准备好了完善的 [ETC 翻译文档](https://github.com/react-guide/etc)。:point_right: 回复 issue 认领 https://github.com/camsong/redux-in-chinese/issues :heart: :heart: :heart:

> 在线 Gitbook 地址：http://cn.redux.js.org/
> 英文原版：http://redux.js.org/
> 学了这个还不尽兴？推荐极精简的 [Redux Tutorial 教程](https://github.com/react-guide/redux-tutorial-cn#redux-tutorial)
> React 核心开发者写的 [React 设计思想](https://github.com/react-guide/react-basic)

> :arrow_down: 离线下载：[pdf 格式](https://github.com/camsong/redux-in-chinese/raw/master/offline/redux-in-chinese.pdf)，[epub 格式](https://github.com/camsong/redux-in-chinese/raw/master/offline/redux-in-chinese.epub)，[mobi 格式](https://github.com/camsong/redux-in-chinese/raw/master/offline/redux-in-chinese.mobi)

Redux 是 JavaScript 状态容器，提供可预测化的状态管理。
(如果你需要一个 WordPress 框架，请查看 [Redux Framework](https://reduxframework.com/)。)

可以让你构建一致化的应用，运行于不同的环境（客户端、服务器、原生应用），并且易于测试。不仅于此，它还提供
超爽的开发体验，比如有一个[时间旅行调试器可以编辑后实时预览](https://github.com/gaearon/redux-devtools)。

Redux 除了和 [React](https://facebook.github.io/react/) 一起用外，还支持其它界面库。
它体小精悍（只有 2kB，包括依赖）。

## 学习 Redux

我们会为你提供一系列广泛的资源。无论你基础如何，学习方式如何，这些资料都会帮助你学习 Redux。

### 基础

如果你刚刚开始学习 Redux，想要了解一些基础概念，请看：

- Redux 背后的 **[动机](https://cn.redux.js.org/docs/introduction/Motivation)**，**[核心概念](https://cn.redux.js.org/docs/introduction/coreconcepts)** 和 **[三大原则](https://cn.redux.js.org/docs/introduction/threeprinciples)**。
- **[Redux 文档基础教程](https://cn.redux.js.org/docs/basics)**
- Redux 作者 Dan Abramov 的 **免费 ["Getting Started with Redux" 系列视频](https://egghead.io/courses/getting-started-with-redux)**
- Redux 维护者 Mark Erikson 的 **["Redux Fundamentals" 幻灯片](http://blog.isquaredsoftware.com/2018/03/presentation-reactathon-redux-fundamentals/)** 以及 **[Redux 学习推荐资源列表](http://blog.isquaredsoftware.com/2017/12/blogged-answers-learn-redux/)**
- 如果你喜欢直接浏览和运行代码来学习的话，看看我们的 **[Redux 示例应用](https://cn.redux.js.org/docs/introduction/examples)** 列表，Redux repo 中也有相应的项目，同时提供 CodeSandbox 上的在线可交互示例。
- **[React/Redux links](https://github.com/markerikson/react-redux-links)** 中的 **[Redux Tutorials](https://github.com/markerikson/react-redux-links/blob/master/redux-tutorials.md)** 部分。下面是一些我们推荐的其中最好的文章：
  - Dave Ceddia 的文章 [What Does Redux Do? (and when should you use it?)](https://daveceddia.com/what-does-redux-do/) 以及 [How Redux Works: A Counter-Example](https://daveceddia.com/how-does-redux-work/)，这篇文章很好的介绍了 Redux 的基础知识，如何与 React 一起使用。同时 [React and Redux: An Introduction](http://jakesidsmith.com/blog/post/2017-11-18-redux-and-react-an-introduction/) 也有异曲同工之处。
  - Valentino Gagliardi 的文章 [React Redux Tutorial for Beginners: Learning Redux in 2018](https://www.valentinog.com/blog/react-redux-tutorial-beginners/) 很好的拓展了 Redux 各方面的介绍。
  - CSS Tricks 上的这篇 [Leveling Up with React: Redux](https://css-tricks.com/learning-react-redux/) 也介绍了 Redux 的基础。
  - [DevGuides: Introduction to Redux](http://devguides.io/redux/) 这篇教程覆盖了 Redux 方方面面，包括 actions，reducers，结合 React 以及 middleware。

### 进阶概念

当你了解了 action、reducer、store 的基本使用方法之后，你也许会在其他一些方面遇到问题，比如异步逻辑和 AJAX 请求、连接到 React 等 UI 库、用 Redux 建立一个应用等等：

- **[Redux 文档“高级”部分](https://cn.redux.js.org/docs/advanced)** 包括异步逻辑、middleware、路由。
- Redux 文档 **[“学习资源”](https://cn.redux.js.org/docs/introduction/LearningResources.html)** 中推荐了一些文章，覆盖了 Redux 很多方面。
- Sophie DeBenedetto 的 8 个章节的 **[Building a Simple CRUD App with React + Redux](http://www.thegreatcodeadventure.com/building-a-simple-crud-app-with-react-redux-part-1/)** 教程，展示了如何从零开始建立一个 CURD（增删改查）应用。

### 真实世界使用

从一个 TodoMVC 应用过渡到一个真正的生产级别的应用是一个飞跃，但我们有很多资源可以帮到你：

- Redux 作者 Dan Abramov 的 **[免费 “Building React Applications with Idiomatic Redux” 系列教程](https://egghead.io/courses/building-react-applications-with-idiomatic-redux)**，基于他本人第一季的视频打造，涵盖了诸如 middleware、路由、不变性等内容。
- **[Redux 常见问题](https://cn.redux.js.org/docs/faq)** 回答了一些常见问题，比如如何使用 Redux。**[文档中“技巧”部分](https://cn.redux.js.org/docs/recipes)** 包含了处理衍生数据、测试、组织 reducer 逻辑、减少样板代码等方面的信息。
- Redux 维护者 Mark Erikson 的 **["Practical Redux" 教程系列](http://blog.isquaredsoftware.com/series/practical-redux/)** 演示了真实世界 React Redux 应用的进阶技巧。（还在 **[Educative.io 上提供一个可交互版本](https://www.educative.io/collection/5687753853370368/5707702298738688)**）
- **[React/Redux links](https://github.com/markerikson/react-redux-links)** 储存了一些分类过的文章，包含 [reducer 和 selector](https://github.com/markerikson/react-redux-links/blob/master/redux-reducers-selectors.md)、[管理副作用](https://github.com/markerikson/react-redux-links/blob/master/redux-side-effects.md)、[Redux 架构与最佳实践](https://github.com/markerikson/react-redux-links/blob/master/redux-architecture.md) 等等。
- 我们的社区创造了数以千计的 Redux 相关库，插件和工具。[文档的“生态系统”页面](https://cn.redux.js.org/docs/introduction/ecosystem) 列举了我们推荐的一些。在 **[Redux 插件目录](https://github.com/markerikson/redux-ecosystem-links)** 有完整的列表。
- 如果你希望通过一个实际的应用代码来学习的话，插件目录中也有一个 **[出于特定目的构建的示例和真实世界应用](https://github.com/markerikson/redux-ecosystem-links/blob/master/apps-and-examples.md)** 列表。

最后，Mark Erikson 在 **[Workshop.me 教授了一系列工坊课程](#redux-workshops)**。查看[工坊时间表](https://workshop.me/?a=mark)获取即将到来的时间地点安排。

### 帮助和讨论

**[Reactiflux Discord community](http://www.reactiflux.com)** 中的 **[#redux channel](https://discord.gg/0ZcbPKXt5bZ6au5t)** 是我们的官方资源，所有有关学习和使用 Redux 的问题都可以提问。Reactiflux 是您闲逛、提问、学习的好地方，来加入我们吧！

## 开始之前

Redux 是负责组织 state 的工具，但你也要考虑它是否适合你的情况。不要因为有人告诉你要用 Redux 就去用，花点时间好好想想使用了 Redux 会带来的好处或坏处。

在下面的场景中，引入 Redux 是比较明智的：

- 你有着相当大量的、随时间变化的数据
- 你的 state 需要有一个单一可靠数据来源
- 你觉得把所有 state 放在最顶层组件中已经无法满足需要了

的确，这些场景很主观笼统。因为对于何时应该引入 Redux 这个问题，对于每个使用者和每个应用来说都是不同的。

> **对于 Redux 应该如何、何时使用的更多建议，请看：**
>
> - **[“You Might Not Need Redux”](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)**
> - **[The Tao of Redux, Part 1 - Implementation and Intent](http://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-1/)**
> - **[The Tao of Redux, Part 2 - Practice and Philosophy](http://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-2/)**
> - **[Redux 常见问题](https://cn.redux.js.org/docs/faq)**

## 开发经历

Dan Abramov（Redux 作者）在他准备 React Europe 演讲[热加载与时间旅行](https://www.youtube.com/watch?v=xsSnOQynTHs)时开始开发 Redux。他的目标是创建一个状态管理库，来提供最简化 API，但同时做到行为的完全可预测，因此才得以实现日志打印，热加载，时间旅行，同构应用，录制和重放，而不需要任何开发参与。

## 启示

Redux 由 [Flux](http://facebook.github.io/flux/) 演变而来，但受 [Elm](http://elm-lang.org/guide/architecture) 的启发，避开了 Flux 的复杂性。
不管你有没有使用过它们，只需几分钟就能上手 Redux。

## 安装

安装稳定版：

```
npm install --save redux
```

以上基于使用 [npm](https://www.npmjs.com/) 来做包管理工具的情况下。

否则你可以直接在 [unpkg 上访问这些文件](https://unpkg.com/redux/)，下载下来，或者把让你的包管理工具指向它。

一般情况下人们认为 Redux 就是一些 [CommonJS](http://webpack.github.io/docs/commonjs.html) 模块的集合。这些模块就是你在使用 [Webpack](http://webpack.github.io/)、[Browserify](http://browserify.org/)、或者 Node 环境时引入的。如果你想追求时髦并使用 [Rollup](http://rollupjs.org/)，也是支持的。

你也可以不使用模块打包工具。`redux` 的 npm 包里 [`dist` 目录](https://unpkg.com/redux/dist/)包含了预编译好的生产环境和开发环境下的 [UMD](https://github.com/umdjs/umd) 文件。可以直接使用，而且支持大部分流行的 JavaScript 包加载器和环境。比如，你可以直接在页面上的 `<script>` 标签 中引入 UMD 文件，也可以[让 `Bower` 来安装](https://github.com/reactjs/redux/pull/1181#issuecomment-167361975)。UMD 文件可以让你使用 `window.Redux` 全局变量来访问 Redux。

Redux 源文件由 ES2015 编写，但是会预编译到 CommonJS 和 UMD 规范的 ES5，所以它可以支持 [任何现代浏览器](http://caniuse.com/#feat=es5)。你不必非得使用 Babel 或模块打包器来使用 Redux。

### 附加包

多数情况下，你还需要使用 [React 绑定库](http://github.com/gaearon/react-redux)和[开发者工具](http://github.com/gaearon/redux-devtools)。

```
npm install --save react-redux
npm install --save-dev redux-devtools
```

需要提醒的是，和 Redux 不同，很多 Redux 生态下的包并不提供 UMD 文件，所以为了提升开发体验，我们建议使用像 [Webpack](http://webpack.github.io/) 和 [Browserify](http://browserify.org/) 这样的 CommonJS 模块打包器。

## 要点

应用中所有的 state 都以一个对象树的形式储存在一个单一的 _store_ 中。
惟一改变 state 的办法是触发 _action_，一个描述发生什么的对象。
为了描述 action 如何改变 state 树，你需要编写 _reducers_。

就是这样！

```js
import { createStore } from 'redux'

/**
 * 这是一个 reducer，形式为 (state, action) => state 的纯函数。
 * 描述了 action 如何把 state 转变成下一个 state。
 *
 * state 的形式取决于你，可以是基本类型、数组、对象、
 * 甚至是 Immutable.js 生成的数据结构。惟一的要点是
 * 当 state 变化时需要返回全新的对象，而不是修改传入的参数。
 *
 * 下面例子使用 `switch` 语句和字符串来做判断，但你可以写帮助类(helper)
 * 根据不同的约定（如方法映射）来判断，只要适用你的项目即可。
 */
function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}

// 创建 Redux store 来存放应用的状态。
// API 是 { subscribe, dispatch, getState }。
let store = createStore(counter)

// 可以手动订阅更新，也可以事件绑定到视图层。
store.subscribe(() => console.log(store.getState()))

// 改变内部 state 惟一方法是 dispatch 一个 action。
// action 可以被序列化，用日记记录和储存下来，后期还可以以回放的方式执行
store.dispatch({ type: 'INCREMENT' })
// 1
store.dispatch({ type: 'INCREMENT' })
// 2
store.dispatch({ type: 'DECREMENT' })
// 1
```

你应该把要做的修改变成一个普通对象，这个对象被叫做 _action_，而不是直接修改 state。然后编写专门的函数来决定每个 action 如何改变应用的 state，这个函数被叫做 _reducer_。

如果你以前使用 Flux，那么你只需要注意一个重要的区别。Redux 没有 Dispatcher 且不支持多个 store。相反，只有一个单一的 store 和一个根级的 reduce 函数（reducer）。随着应用不断变大，你应该把根级的 reducer 拆成多个小的 reducers，分别独立地操作 state 树的不同部分，而不是添加新的 stores。这就像一个 React 应用只有一个根级的组件，这个根组件又由很多小组件构成。

用这个架构开发计数器有点杀鸡用牛刀，但它的美在于做复杂应用和庞大系统时优秀的扩展能力。由于它可以用 action 追溯应用的每一次修改，因此才有强大的开发工具。如录制用户会话并回放所有 action 来重现它。

## Redux 作者教你学

### Dan Abramov 出品的 Redux 视频教程

#### Redux 入门（Getting Started with Redux）

[Redux 入门](https://egghead.io/courses/getting-started-with-redux) 是由 Redux 作者 Dan Abramov 讲述的包含 30 个视频的课程。它涵盖了本文档的“基础”部分，同时还有不可变（immutability）、测试、Redux 最佳实践、搭配 React 使用的讲解。**这个课程将永久免费。**

> [“Great course on egghead.io by @dan_abramov - instead of just showing you how to use #redux, it also shows how and why redux was built!”](https://twitter.com/sandrinodm/status/670548531422326785)  
> Sandrino Di Mattia

> [“Plowing through @dan_abramov 'Getting Started with Redux' - its amazing how much simpler concepts get with video.”](https://twitter.com/chrisdhanaraj/status/670328025553219584)  
> Chris Dhanaraj

> [“This video series on Redux by @dan_abramov on @eggheadio is spectacular!”](https://twitter.com/eddiezane/status/670333133242408960)  
> Eddie Zaneski

> [“Come for the name hype. Stay for the rock solid fundamentals. (Thanks, and great job @dan_abramov and @eggheadio!)”](https://twitter.com/danott/status/669909126554607617)  
> Dan

> [“This series of videos on Redux by @dan_abramov is repeatedly blowing my mind - gunna do some serious refactoring”](https://twitter.com/gelatindesign/status/669658358643892224)  
> Laurence Roberts

还等什么？

#### [开始观看 30 个免费视频！](https://egghead.io/courses/getting-started-with-redux)

> 注意：如果你喜欢 Dan Abromov 的课程，可以考虑[购买订阅](https://egghead.io/pricing)来支持 Egghead。订阅者可以查看视频中所有示例代码，以及更多高级课程，包括深入 Javascript，React，Angular 等等。许多 [Egghead 导师](https://egghead.io/instructors) 也是开源项目作者，所以购买订阅也是感谢他们的辛勤工作的一种方式。

#### 使用 Redux 构建 React 应用的常用实践（Building React Applications with Idiomatic Redux）

**[使用 Redux 构建 React 应用的常用实践](https://egghead.io/courses/building-react-applications-with-idiomatic-redux)** 是 Dan Abramov 出品的第二个系列视频。它从第一个视频结束的地方开始，涵盖了很多实用的手段，来构建生产级别 React 和 Redux 应用，包括：进阶 state 管理、中间件（middleware）、集成 React Router 以及构建应用可能会遇到的其它问题。跟第一季一样，**这个课程将永久免费。**

#### [开始观看免费 "Idiomatic Redux" 视频](https://egghead.io/courses/building-react-applications-with-idiomatic-redux)

### Pratical Redux 课程

**[Practical Redux](https://www.educative.io/collection/5687753853370368/5707702298738688/)** 是 Redux 维护者 Mark Erikson 教授的付费课程。这个课程展示了如何使用 Redux 的基本概念来创建一个比 TodoMVC 更大一点的应用。包括以下一些真实世界问题：

- 把 Redux 添加到一个 Create-React-App 创建的项目中，并配置模块热加载来加速开发
- 用 Redux 控制 UI
- 使用 Redux-ORM 管理 Redux store 中的相关数据
- 建立一个 master/detail 模式来展示并编辑数据
- 自行编写的高级 Redux reducer 逻辑来解决特定问题
- 对 Redux 连接的表单进行性能优化

还有更多内容！

这个课程基于 Mark 原来的免费课程 **["Practical Redux" 教程系列](http://blog.isquaredsoftware.com/series/practical-redux/)** 之上，并改进更新了其内容。

### Redux 基础工坊（Redux Fundamentals Workshop）

Redux 维护者 [Mark Erikson](https://twitter.com/acemarke) 建立了一个 [**Redux 基础工坊**，幻灯片在这里](https://blog.isquaredsoftware.com/2018/06/redux-fundamentals-workshop-slides/)，包括如下内容：

- Redux 的历史及目的
- Reducer，action，使用 Redux store
- 在 React 中使用 Redux
- 使用并编写 Redux middleware
- 使用 AJAX 请求和其他副作用操作
- 为 Redux 应用编写单元测试
- 真实世界中的 Redux 应用结构和开发

## 文档

- [介绍](http://camsong.github.io/redux-in-chinese//docs/introduction/index.html)
- [基础](http://camsong.github.io/redux-in-chinese//docs/basics/index.html)
- [高级](http://camsong.github.io/redux-in-chinese//docs/advanced/index.html)
- [技巧](http://camsong.github.io/redux-in-chinese//docs/recipes/index.html)
- [常见问题](http://camsong.github.io/redux-in-chinese//docs/FAQ.html)
- [排错](http://camsong.github.io/redux-in-chinese//docs/Troubleshooting.html)
- [词汇表](http://camsong.github.io/redux-in-chinese//docs/Glossary.html)
- [API 文档](http://camsong.github.io/redux-in-chinese//docs/api/index.html)

## 示例

- [原生 Counter](http://camsong.github.io/redux-in-chinese/docs/introduction/Examples.html#counter-vanilla) ([source](https://github.com/rackt/redux/tree/master/examples/counter-vanilla))
- [Counter](http://camsong.github.io/redux-in-chinese/docs/introduction/Examples.html#counter) ([source](https://github.com/rackt/redux/tree/master/examples/counter))
- [Todos](http://camsong.github.io/redux-in-chinese/docs/introduction/Examples.html#todos) ([source](https://github.com/rackt/redux/tree/master/examples/todos))
- [可撤销的 Todos](http://camsong.github.io/redux-in-chinese/docs/introduction/Examples.html#todos-with-undo) ([source](https://github.com/rackt/redux/tree/master/examples/todos-with-undo))
- [TodoMVC](http://camsong.github.io/redux-in-chinese/docs/introduction/Examples.html#todomvc) ([source](https://github.com/rackt/redux/tree/master/examples/todomvc))
- [购物车](http://camsong.github.io/redux-in-chinese/docs/introduction/Examples.html#shopping-cart) ([source](https://github.com/rackt/redux/tree/master/examples/shopping-cart))
- [Tree View](http://camsong.github.io/redux-in-chinese/docs/introduction/Examples.html#tree-view) ([source](https://github.com/rackt/redux/tree/master/examples/tree-view))
- [异步](http://camsong.github.io/redux-in-chinese/docs/introduction/Examples.html#async) ([source](https://github.com/rackt/redux/tree/master/examples/async))
- [Universal](http://camsong.github.io/redux-in-chinese/docs/introduction/Examples.html#universal) ([source](https://github.com/rackt/redux/tree/master/examples/universal))
- [Real World](http://camsong.github.io/redux-in-chinese/docs/introduction/Examples.html#real-world) ([source](https://github.com/rackt/redux/tree/master/examples/real-world))

如果你是 NPM 新手，创建和运行一个新的项目有难度，或者不知道上面的代码应该放到哪里使用，请下载 [simplest-redux-example](https://github.com/jackielii/simplest-redux-example) 这个示例，它是一个集成了 React、Browserify 和 Redux 的最简化的示例项目。

## 评价

> [“Love what you’re doing with Redux”](https://twitter.com/jingc/status/616608251463909376)
> Jing Chen，Flux 作者

> [“I asked for comments on Redux in FB's internal JS discussion group, and it was universally praised. Really awesome work.”](https://twitter.com/fisherwebdev/status/616286955693682688)
> Bill Fisher，Flux 作者

> [“It's cool that you are inventing a better Flux by not doing Flux at all.”](https://twitter.com/andrestaltz/status/616271392930201604)
> André Staltz，Cycle 作者

## 感谢

- [Elm 架构](https://github.com/evancz/elm-architecture-tutorial) 介绍了使用 reducers 来操作 state 数据；
- [Turning the database inside-out](http://blog.confluent.io/2015/03/04/turning-the-database-inside-out-with-apache-samza/) 大开脑洞;
- [ClojureScript 里使用 Figwheel](http://www.youtube.com/watch?v=j-kj2qwJa_E) for convincing me that re-evaluation should “just work”;
- [Webpack](https://github.com/webpack/docs/wiki/hot-module-replacement-with-webpack) 热模块替换;
- [Flummox](https://github.com/acdlite/flummox) 教我在 Flux 里去掉样板文件和单例对象；
- [disto](https://github.com/threepointone/disto) 演示使用热加载 Stores 的可行性；
- [NuclearJS](https://github.com/optimizely/nuclear-js) 证明这样的架构性能可以很好；
- [Om](https://github.com/omcljs/om) 普及 state 惟一原子化的思想。
- [Cycle](https://github.com/staltz/cycle) 介绍了 function 是如何在很多场景都是最好的工具；
- [React](https://github.com/facebook/react) 实践启迪。

特别感谢 [Jamie Paton](http://jdpaton.github.io) 交出了 `redux` 这个 NPM 包名。

## Logo

官方 Logo [在 Github 上可以找到](https://github.com/reduxjs/redux/tree/master/logo)。

## 作者列表

> 定期更新，谢谢各位辛勤贡献

- [Cam Song 会影@camsong](https://github.com/camsong)
- [Jovey Zheng@jovey-zheng](https://github.com/jovey-zheng)
- [Pandazki@pandazki](https://github.com/pandazki)
- [Shangbin Yang@rccoder](https://github.com/rccoder)
- [Doray Hong@dorayx](https://github.com/dorayx)
- [Yuwei Wang@yuweiw823](https://github.com/yuweiw823)
- [Yudong@hashtree](https://github.com/hashtree)
- [Arcthur@arcthur](https://github.com/arcthur)
- [Desen Meng@demohi](https://github.com/demohi)
- [Zhe Zhang@zhe](https://github.com/zhe)
- [alcat2008](https://github.com/alcat2008)
- [Frozenme](https://github.com/Frozenme)
- [姜杨军@Yogi-Jiang](https://github.com/Yogi-Jiang)
- [Byron Bai@happybai](https://github.com/happybai)
- [Guo Cheng@guocheng](https://github.com/guocheng)
- [omytea](https://github.com/omytea)
- [Fred Wang](https://github.com/namelos)
- [Amo Wu](https://github.com/amowu)
- [C. T. Lin](https://github.com/chentsulin)
- [钱利江](https://github.com/timqian)
- [云谦](https://github.com/sorrycc)
- [denvey](https://github.com/denvey)
- [三点](https://github.com/zousandian)
- [Eric Wong](https://github.com/ele828)
- [Owen Yang](https://github.com/owenyang0)
- [Cai Huanyu](https://github.com/Darmody)

<a href="https://github.com/camsong/redux-in-chinese/graphs/contributors"><img src="https://opencollective.com/redux-in-chinese/contributors.svg?width=890&button=false" /></a>

**本文档翻译流程符合 [ETC 翻译规范](https://github.com/react-guide/ETC)，欢迎你来一起完善**
