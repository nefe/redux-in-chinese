---
id: learning-resources
title: 学习资源
description: '简介 > 学习资源: 学习 Redux 的附加文章和资源'
hide_title: false
---

# 学习资源

Redux 文档旨在教授 Redux 的基本概念，并解释在实际应用程序中使用的关键概念。但是，文档无法涵盖所有内容。幸运的是，还有许多其他很棒的资源可用于学习 Redux。我们鼓励你仔细查看一下。其中许多涵盖的主题超出了文档的范围，或者你可以用其他更适合自己学习方式的去学习相同的内容。

此页面包含我们对可用于学习 Redux 的一些最佳外部资源的建议。有关 React，Redux，Javascript 和相关主题的更多教程、文章和其他资源，可以查看 [React/Redux Links list](https://github.com/markerikson/react-redux-links)。

## 基础介绍

_介绍 Redux 基本概念以及如何使用它的教程_

- **React、Redux 和 Typescript 简介** <br />
  https://blog.isquaredsoftware.com/2020/12/presentations-react-redux-ts-intro/ <br />
  Redux 维护者 Mark Erikson 的幻灯片集，涵盖了 React、Redux 和 TypeScript 的基础知识。 Redux 主题包括 store、reducers、middleware、React-Redux 和 Redux Toolkit。

- **学习流行的 Redux - Redux Toolkit、React-Redux Hooks 和 RTK Query** <br />
  https://www.learnwithjason.dev/let-s-learn-modern-redux <br />
  Redux 维护者 Mark Erikson 在作为嘉宾的一集 “Learn with Jason” 节目中，展示了一个实时编码的应用程序，并展示了如何创建一个新的 React+TS 项目、添加 Redux 包以及从头开始设置 Redux Toolkit 和 React-Redux（包括我们推荐的 TS hooks 配置）。 它还展示了如何使用即将推出的 RTK Query 数据获取 API 获取数据并在 UI 中显示数据。

- **Redux 教程：概述和演练** <br />
  https://www.taniarascia.com/redux-react-guide/ <br />
  Tania Rascia 的一篇写得很好的教程，它快速解释了 Redux 的关键概念，并展示了如何使用 vanilla Redux 和 Redux Toolkit 组合一个基本的 Redux + React 应用程序。

- **Redux 初学者 - 学习 Redux 的大脑友好型指南** <br />
  https://www.freecodecamp.org/news/redux-for-beginners-the-brain-friendly-guide-to-redux/ <br />
  一个易于理解的教程，使用 Redux Toolkit 和 React-Redux 构建一个小型 todo 应用程序，包括数据获取。

- **使用 Redux Toolkit 和 Typescript 让 Redux 变得简单** <br />
  https://www.mattbutton.com/redux-made-easy-with-redux-toolkit-and-typescript/ <br />
  一个很有用的教程，展示了如何一起使用 Redux Toolkit 和 TypeScript 来编写 Redux 应用程序，以及 RTK 如何简化典型的 Redux 使用。

- **Redux：从 Twitter 炒作到生产** <br/>
  https://slides.com/jenyaterpil/redux-from-twitter-hype-to-production#/ <br/>
  一个制作精良的幻灯片，直观地介绍了 Redux 的核心概念、React 的使用、项目组织以及 thunk 和 sagas 的副作用。 有一些很棒的动画图展示了数据如何通过 React+Redux 架构流动。

## 在 React 中使用 Redux

_一些有关 React-Redux 绑定的解释_

- **使用 React-Redux Hooks 对旧版 Redux 应用程序进行现代化改造** <br />
  https://app.egghead.io/playlists/modernizing-a-legacy-redux-application-with-react-hooks-c528 <br />
  这个系列视频，展示了早期的 `connect` API 和较新的 React-Redux 钩子 API 之间的差异，以及如何在组件中使用这些钩子。

- **为什么 Redux 在 React 应用程序中很有用** <br/>
  https://www.fullstackreact.com/articles/redux-with-mark-erikson/ <br/>
  解释使用 Redux 和 React 的一些好处，比如在组件和热加载 (Hot Module Reloading) 之间共享数据。

## 基于项目的教程

_通过构建项目来教授 Redux 概念的教程，包括更大的现实场景类型的应用程序_

- **实用的 Redux** <br/>
  https://blog.isquaredsoftware.com/2016/10/practical-redux-part-0-introduction/ <br/>
  https://blog.isquaredsoftware.com/series/practical-redux/ <br/>
  一系列正在更新的帖子旨在通过构建示例应用程序来演示一些特定的 Redux 技术，该应用程序基于用于管理 Battletech 活动的 MekHQ 应用程序。由 Redux 共同维护者 Mark Erikson 撰写。涵盖管理关系数据，连接多个组件和列表、功能的复杂 reducer 逻辑，处理表单，显示模态对话框等主题。（注：这是一个较老的系列，今天我们推荐更新的编写 Redux 代码的模式。但是，这个系列中的许多原则仍然很有价值。）

<!-- - **使用 React + Redux 构建简单的 CRUD 应用程序** <br/>
  https://www.thegreatcodeadventure.com/building-a-simple-crud-app-with-react-redux-part-1/ <br/>
  这是一个精彩的含有 8 部分的系列教程，演示了如何构建 CRUD 应用程序，包括路由、AJAX 调用和各种 CRUD 方面。写得很好，还有一些有用的图表。

- **使用 React + Redux 开发 Soundcloud 客户端** <br/>
  https://www.robinwieruch.de/the-soundcloud-client-in-react-redux/ <br/>
  详细的演示了项目设置、路由、身份验证、获取远程数据以及如何包装有状态库（stateful library）。

- **Redux 全栈教程** <br/>
  https://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html <br/>
  这是一个全面、深入的教程，可构建完整的客户端——服务器应用程序。

- **React，Redux 和 Immutable 入门：一个测试驱动的教程** <br/>
  https://www.theodo.fr/blog/2016/03/getting-started-with-react-redux-and-immutable-a-test-driven-tutorial-part-1/ <br/>
  https://www.theodo.fr/blog/2016/03/getting-started-with-react-redux-and-immutable-a-test-driven-tutorial-part-2/ <br/>
  另一个坚实、深入的教程，类似于 “全栈 Redux 教程”。 构建一个仅有客户端的 TodoMVC 应用程序，并演示一个良好的项目设置（包括基于 Mocha + JSDOM 的测试配置）。写得很好，涵盖了很多概念，而且非常容易理解。

- **Redux Hero：Redux 和 Reselect 简介** <br/>
  https://decembersoft.com/posts/redux-hero-part-1-a-hero-is-born-a-fun-introduction-to-redux-js/ <br/>
  通过构建一个小型 RPG 风格的游戏介绍 Redux 和相关的库。 -->

## Redux 实现

_教你开发一个简化版 Redux，来阐述 Redux 内部工作原理_

- **Redux 入门 - 视频系列** <br/>
  https://egghead.io/courses/fundamentals-of-redux-course-from-dan-abramov-bd5cc867 <br/>
  https://github.com/tayiorbeii/egghead.io_redux_course_notes <br/>
  Redux 的创建者 Dan Abramov 在 30 个短片（每个 2-5 分钟）中演示了各种概念。 上述链接的 Github 库中包含视频的注释和转录。

- **使用惯用的 Redux 构建 React 应用程序 - 视频系列** <br/>
  https://egghead.io/courses/building-react-applications-with-idiomatic-redux <br/>
  https://github.com/tayiorbeii/egghead.io_idiomatic_redux_course_notes <br/>
  Dan Abramov 的第二个视频教程系列， 包括关于存储初始状态、使用 Redux 和 React Router、使用 “selector” 函数、规范化 state、使用 Redux middleware、异步 action creators 等方面的课程。 链接的 Github 库中包含视频的注释和转录。

- **Live React：热重载和时间旅行** <br/>
  https://youtube.com/watch?v=xsSnOQynTHs <br/>
  Dan Abramov 在最初的会议演讲中介绍了 Redux。 展示了 Redux 强制执行的约束如何使时间旅行的热重载变得容易。

- **Build Yourself a Redux** <br/>
  https://zapier.com/engineering/how-to-build-redux/ <br/>
  这是一篇优秀的深度 “构建迷你 Redux” 文章，不仅涵盖了 Redux 的核心，还涵盖了 `connect` 和 middleware。

- **Connect.js explained** <br/>
  https://gist.github.com/gaearon/1d19088790e70ac32ea636c025ba424e <br/>
  React Redux 的 `connect()` 函数的一个非常简化的版本，讲述了其基本实现。

- **Let's Write Redux!** <br/>
  https://www.jamasoftware.com/blog/lets-write-redux/ <br/>
  逐步编写 Redux 的微型版本，以帮助理解概念和实现。

## Reducers

_讨论如何编写 reducer 函数的文章_

- **利用 `combineReducers`** <br/>
  https://randycoulman.com/blog/2016/11/22/taking-advantage-of-combinereducers/ <br/>
  使用 `combineReducers` 多次生成状态树的示例，以及关于如何权衡各种 reducer 逻辑的一些想法。

- **高阶 Reducer 的力量** <br/>
  https://slides.com/omnidan/hor#/ <br/>
  来自 redux-undo 和其他库的作者的幻灯片演示，解释了高阶 Reducer 的概念以及如何使用它们

- **高阶 Reducer 的组合** <br/>
  https://medium.com/@mange_vibration/reducer-composition-with-higher-order-reducers-35c3977ed08f <br/>
  一些很好的例子，关于如何编写可以组合在一起执行更大的特定 Reducer 任务的小函数，例如提供初始状态、过滤、更新特定键等等。

- **高阶 Reducer  - 它只是听起来很吓人** <br/>
  https://medium.com/@danielkagan/high-order-reducers-it-just-sounds-scary-2b9e5dbfc705 <br/>
  解释如何像乐高积木一样组合 Reducer，以创建可重用且可测试的 Reducer 逻辑。

## 选择器 Selectors

_如何以及为何使用 Selector 函数从 state 读取值_

- **惯用的 Redux: 为了封装和性能使用 Reselect Selectors** <br/>
  https://blog.isquaredsoftware.com/2017/12/idiomatic-redux-using-reselect-selectors/ <br/>
  一个完整的指南，介绍为什么应该在 Redux 中使用 selector 函数、如何使用 Reselect 库来编写优化的 selector，以及提高性能的高级技巧。

- **ReactCasts #8: Selectors in Redux** <br/>
  https://www.youtube.com/watch?v=frT3to2ACCw <br/>
  很好地概述了为什么以及如何使用 selector 函数从 store 中检索数据，并从 store 值中派生附加数据。

- **使用 Reselect 优化 React Redux 应用程序开发** <br/>
  https://codebrahma.com/reselect-tutorial-optimizing-react-redux-application-development-with-reselect/ <br/>
  关于 Reselect 的一个很棒的教程. 涵盖 “selector 函数” 的概念、如何使用 Reselect 的 API，以及如何使用 memoized selectors 来提高性能。

- **在 React-Redux 应用程序中使用 Reselect** <br/>
  https://dashbouquet.com/blog/frontend-development/usage-of-reselect-in-a-react-redux-application <br/>
  讨论 memoized selectors 对性能的重要性，以及使用 Reselect 的良好实践。

- **React, Reselect, and Redux** <br/>
  https://medium.com/@parkerdan/react-reselect-and-redux-b34017f8194c <br/>
  解释 Reselect 的 memoized selector 函数如何在 Redux 应用程序中使用用，以及如何为每个组件实例创建唯一的 selector 实例。

## 规范化 Normalization

_如何像数据库一样构建 Redux Store以获得最佳性能_

- **Querying a Redux Store** <br/>
  https://medium.com/@adamrackis/querying-a-redux-store-37db8c7f3b0f <br/>
  在 Redux 中组织和存储数据的最佳实践，包括规范化数据和使用 selector 函数。

- **规范化 Redux Store 以最大限度地重用代码** <br/>
  https://medium.com/@adamrackis/normalizing-redux-stores-for-maximum-code-reuse-ae6e3844ae95 <br/>
  关于规范化 Redux store 如何启用一些有用的数据处理方法的思考，包括使用 selector 函数对分层数据进行非规范化的示例。

- **高级 Redux 实体规范化** <br/>
  https://medium.com/@dcousineau/advanced-redux-entity-normalization-f5f1fe2aefc5 <br/>
  描述用于跟踪状态实体子集的 “keyWindow” 概念，类似于 SQL “视图”。 是对标准化数据概念的有用扩展。

## 中间件 Middleware

_中间件如何工作以及如何编写它们的解释和示例_

- **Exploring Redux Middlewares** <br/>
  https://blog.krawaller.se/posts/exploring-redux-middleware/ <br/>
  通过一系列小实验了解 Middleware

- **Redux Middleware 教程** <br/>
  https://www.pshrmn.com/tutorials/react/redux-middleware/ <br/>
  概述什么是 Middleware，`applyMiddleware` 是如何工作的，以及如何编写 Middleware。

- **ReactCasts #6: Redux Middleware** <br/>
  https://www.youtube.com/watch?v=T-qtHI1qHIg <br/>
  描述 Middleware 如何融入 Redux、它们的用途以及如何实现自定义 Middleware 的截屏视频。

- **Redux Middleware 初学者指南** <br/>
  https://www.codementor.io/reactjs/tutorial/beginner-s-guide-to-redux-middleware <br/>
  有着大量示例的 Middleware 用例的有用解释。

- **Javascript 中的函数式组合** <br/>
  https://joecortopassi.com/articles/functional-composition-in-javascript/ <br/>
  分解 `compose` 函数的工作原理。

## 副作用 (Side Effect) —— 基础

_介绍如何在 Redux 中处理异步行为_

- **Stack Overflow: Dispatching Redux Actions with a Timeout** <br/>
  https://stackoverflow.com/questions/35411423/how-to-dispatch-a-redux-action-with-a-timeout/35415559#35415559 <br/>
  Dan Abramov 解释了在 Redux 中管理异步行为的基础知识，介绍了一系列渐进式方法（内联异步调用、异步 action creators、thunk middleware ）。

- **Stack Overflow: 为什么我们需要 middleware 来实现 Redux 中的异步流？** <br/>
  https://stackoverflow.com/questions/34570758/why-do-we-need-middleware-for-async-flow-in-redux/34599594#34599594 <br/>
  Dan Abramov 给出了使用 thunk 和异步 middleware 的理由，以及使用 thunk 的一些有用模式。

- **“thunk” 到底是什么？** <br/>
  https://daveceddia.com/what-is-a-thunk/ <br/>
  快速解释 “thunk” 这个词的一般含义，特别是在 Redux 里。

- **Redux 中的 Thunks：基础知识** <br/>
  https://medium.com/fullstack-academy/thunks-in-redux-the-basics-85e538a3fe60 <br/>
  详细了解 thunk 是什么、它们解决了什么问题以及如何使用它们。

## 副作用 (Side Effect) —— 进阶

_用于管理异步行为的高级工具和技术_

- **在 Redux 中进行异步操作的正确方法是什么？** <br/>
  https://decembersoft.com/posts/what-is-the-right-way-to-do-asynchronous-operations-in-redux/ <br/>
  对最流行的 Redux 副作用库进行了很好的解释，并比较了每个库的工作原理。

- **Redux 4 种方式** <br/>
  https://medium.com/react-native-training/redux-4-ways-95a130da0cdc <br/>
  使用 thunk、sagas、observables 和 promise middleware 实现一些基本数据获取的并排比较。

- **惯用的 Redux：关于 Thunks、Sagas、抽象和可重用性的思考** <br/>
  https://blog.isquaredsoftware.com/2017/01/idiomatic-redux-thoughts-on-thunks-sagas-abstraction-and-reusability/ <br/>
  对一些 “thunk are bad” 问题的回应，认为 thunk（和 sagas）仍然是管理复杂同步逻辑和异步副作用的有效方法。

- **Javascript 强有力的工具：Redux-Saga** <br/>
  https://formidable.com/blog/2017/javascript-power-tools-redux-saga/ <br/>
  https://formidable.com/blog/2017/composition-patterns-in-redux-saga/ <br/>
  https://formidable.com/blog/2017/real-world-redux-saga-patterns/ <br/>
  一个精彩的系列，讲授 Redux-Saga 背后的概念、实现和好处，包括如何使用 ES6 生成器来控制函数流，如何将 sagas 组合在一起以实现并发，以及 sagas 的实际用例。

- **探索 Redux Sagas** <br/>
  https://medium.com/onfido-tech/exploring-redux-sagas-cc1fca2015ee <br/>
  一篇优秀的文章，探讨了如何使用 sagas 提供粘合层来实现 Redux 应用程序中的解耦业务逻辑。

- **Taming Redux with Sagas** <br/>
  https://objectpartners.com/2017/11/20/taming-redux-with-sagas/ <br/>
  Redux-Saga 的一个很好的概述，包括有关生成器函数的信息、sagas 的用例、使用 sagas 处理 promises 以及测试 sagas。

- **使用 RxJS 的响应式 Redux State** <br/>
  https://ivanjov.com/reactive-redux-state-with-rxjs/ <br/>
  描述“响应式编程”的概念和 RxJS 库，并展示如何使用 redux-observable 获取数据，以及测试示例。

- **在 Redux 中使用 redux-observable 处理异步逻辑** <br/>
  https://medium.com/dailyjs/using-redux-observable-to-handle-asynchronous-logic-in-redux-d49194742522 <br/>
  一篇扩展的文章，用一个处理画线的示例比较了基于 thunk 的实现与基于可观察的实现。

## 像 Redux 一样思考

_更深入地了解 Redux 的使用方式，以及它为何如此工作_

- **何时（何时不）使用 Redux** <br />
  https://changelog.com/posts/when-and-when-not-to-reach-for-redux <br />
  Redux 维护者 Mark Erikson 描述了 Redux 旨在解决的问题，以及它与其他常用工具的比较。

* **你可能不需要 Redux** <br/>
  https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367 <br/>
  Dan Abramov 的一些是否需要使用 Redux 的看法。

* **惯用的 Redux：Redux 之道，第 1 部分 - 实现和意图** <br/>
  https://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-1/ <br/>
  深入探讨 Redux 的实际工作原理，它要求您遵循的约束条件，以及其设计和使用背后的意图。

* **惯用的 Redux：Redux 之道，第 2 部分 - 实践与哲学** <br/>
  https://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-2/ <br/>
  后续探讨了为什么存在常见的 Redux 使用模式，可以使用 Redux 的其他方式，以及这些不同模式和方法的优缺点。

* **Redux 有什么了不起的？** <br/>
  https://medium.freecodecamp.org/whats-so-great-about-redux-ac16f1cc0f8b <br/>
  对 Redux 如何与 OOP 和消息传递进行比较的深入而有趣的分析，Redux 的典型使用方式可以转向具有更多样板的类似 Java 的 “setter” 函数，以及对更高级别的 “blessed” 抽象的请求。Redux 让新手更容易使用和学习。非常值得一读。

## Redux 架构

_用于构建大型 Redux 应用程序的模式和实践_

- **在构建应用程序 state 时避免意外复杂性** <br/>
  https://hackernoon.com/avoiding-accidental-complexity-when-structuring-your-app-state-6e6d22ad5e2a <br/>
  一套用于组织 Redux 存储结构的优秀指南。

- **Redux Step by Step: 适用于真实应用程序的简单而强大的工作流程** <br/>
  https://hackernoon.com/redux-step-by-step-a-simple-and-robust-workflow-for-real-life-apps-1fdf7df46092 <br/>
  “意外复杂性” 一文的后续部分，讨论组织 Redux state 的原则

- **我希望我知道的那些关于 Redux 的事** <br/>
  https://medium.com/horrible-hacks/things-i-wish-i-knew-about-redux-9924abf2f9e0 <br/>
  https://www.reddit.com/r/javascript/comments/4taau2/things_i_wish_i_knew_about_redux/ <br/>
  使用 Redux 构建应用程序后获得的一些优秀技巧和经验教训。包括有关连接组件、选择数据、应用程序结构和项目结构的信息。Reddit 上有更多的讨论。

- **React+Redux: 有关如何实现代码干净、可靠和具有可维护的提示和最佳实践** <br/>
  https://speakerdeck.com/goopscoop/react-plus-redux-tips-and-best-practices-for-clean-reliable-and-scalable-code <br/>
  一个出色的幻灯片，提供各种提示和建议，包括简化 action 创建和减少 reducer 中的数据操作，抽象 API 调用，避免 props 传递等等。

- **Redux 用于大型 Web 应用程序中的状态管理** <br/>
  https://blog.mapbox.com/redux-for-state-management-in-large-web-apps-c7f3fab3ce9b <br/>
  对惯用 Redux 架构的精彩讨论和示例，以及 Mapbox 如何将这些方法应用于他们的 Mapbox Studio 应用程序。

## 应用和示例

- **React-Redux RealWorld Example: TodoMVC for the Real World** <br/>
  https://github.com/GoThinkster/redux-review <br/>
  使用 Redux 构建的全栈 “real world” 应用程序示例。演示一个类似于 medium 的社交博客网站 Demo，其中包括 JWT 身份验证，CRUD，收藏文章，关注用户，路由等。RealWorld 项目还包括网站前端和后端的许多其他实现，包括同一项目、API 规范的服务器端和客户端实现的比较。

- **Project Mini-Mek** <br/>
  https://github.com/markerikson/project-minimek <br/>
  演示各种有用 Redux 技术的示例应用程序，随附 “Practical Redux” 博客系列 https://blog.isquaredsoftware.com/series/practical-redux。

- **react-redux-yelp-clone** <br/>
  https://github.com/mohamed-ismat/react-redux-yelp-clone <br/>
  FullStackReact 改编的 “Yelp Clone” 应用程序。它通过使用 Redux 和 Redux-Saga 而不是本地状态，以及 React Router v4、样式组件和其他现代标准来扩展原始版本。基于 React-Boilerplate 的入门套件。

- **WordPress-Calypso** <br/>
  https://github.com/Automattic/wp-calypso <br/>
  新的基于 JavaScript 和 API 的 WordPress.com

- **Sound-Redux** <br/>
  https://github.com/andrewngu/sound-redux <br/>
  使用 React/Redux 构建的 Soundcloud 客户端

- **Webamp** <br/>
  https://webamp.org <br/>
  https://github.com/captbaritone/webamp <br/>
  用 React 和 Redux 构建的 Winamp2 的浏览器版本。实际上播放 MP3，并允许您加载本地 MP3 文件。

- **Tello** <br/>
  https://github.com/joshwcomeau/Tello <br/>
  一种简单而愉快的方式来跟踪和管理电视节目

- **io-808** <br/>
  https://github.com/vincentriemer/io-808 <br/>
  完全重建基于网络的 TR-808 drum machine 的尝试。

## Redux 文档翻译

- [⭐🌟✨中文文档](http://camsong.github.io/redux-in-chinese/) — Chinese [本文档]
- [繁體中文文件](https://github.com/chentsulin/redux) — Traditional Chinese
- [Redux in Russian](https://github.com/rajdee/redux-in-russian) — Russian
- [Redux en Español](https://es.redux.js.org/) - Spanish
- [Redux in Korean](https://ko.redux.js.org/) - Korean

## 书籍

- **Redux in Action** <br/>
  https://www.manning.com/books/redux-in-action <br/>
  一本全面的书，涵盖了使用 Redux 的许多关键方面，包括 reducer 和 action 的基础知识以及 React 的使用、复杂的 middleware 和副作用、应用程序结构、性能、测试等等。很好地解释了使用 Redux 的许多方法的优缺点和权衡。 由 Redux 共同维护者 Mark Erikson 亲自推荐。

- **完整的 Redux 书籍** <br/>
  https://leanpub.com/redux-book <br/>
  如何管理生产中的庞大的 state？为什么我需要 store enhancers？处理表单验证的最佳方法是什么？使用简单的术语和示例代码获取所有这些问题以及更多问题的答案。了解使用 Redux 复杂的构建和可用于生产的 Web 应用程序所需的一切（。注：现在永久免费！）

- **Taming the State in React** <br/>
  https://www.robinwieruch.de/learn-react-redux-mobx-state-management/ <br/>
  如果您已经通过作者的前一本书《学习 React 之路》学习了 React，那么在 React 中驾驭 state 将是学习 React 中基本和高级状态管理的完美结合。你将从只学习 Redux 开始，而不使用 React。之后，这本书向您展示了如何将 Redux 连接到您的 React 应用程序。高级章节将教你规范化、命名、selectors 和异步 actions。 最后，您将使用 React 和 Redux 设置和构建一个实际应用程序。
## 课程

- **Modern React with Redux, by Stephen Grider (付费)** <br/>
  https://www.udemy.com/react-redux/ <br/>
  使用本教程能够学习开发应用时如何将 React、Redux 与 React-Router、Webpack、ES6 同时使用的基础知识。本课程将帮助您快速启动并运行，并教您深入理解使用 Redux 时如何构建 React 组件和如何处理应用程序结构。

- **Redux, by Tyler McGinnis (paid)** <br/>
  https://tylermcginnis.com/courses/redux/ <br/>
  在学习 Redux 时，您需要在足够复杂的应用程序的上下文环境中才能感受到 Redux 带来的好处。这就是为什么这门课程很大。一个更好的名字可能会是 _“Real World Redux”_ 。如果您厌倦了类似 “Todo list” 的 Redux 教程，那么您来对了地方。在本课程中，我们将讨论 Redux 在您的应用程序中管理状态的特殊之处。我们将构建一个实际的 “真实世界” 应用程序，以便您可以学到 Redux 如何处理 optimistic updates 和错误捕获等边缘情况。我们还将介绍许多其他适用于 Redux，Firebase 和 CSS Modules 的技术。

- **Learn Redux, by Wes Bos (free)** <br/>
  https://learnredux.com/ <br/>
  一个构建 'Reduxstagram' 的视频课程 —— 一个简单的照片应用程序，将简化 Redux，React Router 和 React.js 背后的核心思想。

## 更多资源

- [React-Redux Links](https://github.com/markerikson/react-redux-links) 是 React、Redux、ES6 等高质量文章、教程和相关内容的精选列表。
- [Redux Ecosystem Links](https://github.com/markerikson/redux-ecosystem-links) 是 Redux 相关库、插件和实用程序的分类集合。
- [Awesome Redux](https://github.com/xgrommx/awesome-redux) 是与 Redux 相关的库的列表。
- [DEV Community](https://dev.to/t/redux) 是一个分享 Redux 项目、文章和教程以及讨论并询问有关 Redux 问题的地方。欢迎各种技术水平的开发人员参加。
