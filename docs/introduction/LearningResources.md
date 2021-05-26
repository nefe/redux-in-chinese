---
id: learning-resources
title: 学习资源
description: '简介 > 学习资源: 学习 Redux 的附加文章和资源'
hide_title: false
---

# 学习资源

Redux 文档旨在教授 Redux 的基本概念，并解释在实际应用程序中使用的关键概念。但是，文档无法涵盖所有内容。幸运的是，还有许多其他很好的资源可用于学习 Redux。我们鼓励你仔细查看一下。其中许多内容涵盖了超出文档范围的主题，或以可能更适合您学习方式的方法阐述相同的内容。

此页面包含我们对可用于学习 Redux 的一些最佳外部资源的建议。有关 React，Redux，Javascript 和相关主题的其他大量教程，文章和其他资源，可以查看 [React/Redux Links list](https://github.com/markerikson/react-redux-links)。

## 基础介绍

_介绍 Redux 基本概念以及如何使用它的教程_

- **Redux 入门 —— 系列视频** <br/>
  https://app.egghead.io/courses/getting-started-with-redux <br/>
  https://github.com/tayiorbeii/egghead.io_redux_course_notes <br/>
  Redux 的创建者 Dan Abramov 在 30 个短片（2-5 分钟）中展示了各种概念。链接的 Github 仓库包含视频的笔记和转录。

- **使用 Redux 的常用方式构建 React 应用程序 —— 系列视频** <br/>
  https://app.egghead.io/courses/building-react-applications-with-idiomatic-redux <br/>
  https://github.com/tayiorbeii/egghead.io_idiomatic_redux_course_notes <br/>
  Dan Abramov 的第二个视频教程系列，第一个系列的续集。包括在 store 中初始化 state、如何和 React Router 一起使用、使用 “selector” function、状态规范化、使用 Redux 中间件、异步 action creator 等课程。链接的 Github 仓库包含视频的笔记和转录。

- **Live React: 热重载 and Time Travel** <br/>
  https://youtube.com/watch?v=xsSnOQynTHs <br/>
  Dan Abramov 在最初介绍了 Redux 的会议上的演讲。了解 Redux 如何通过强制执行的约束实现 Time Travel 和热重载。

- **Redux Crash Course With React** <br/>
  https://www.youtube.com/watch?v=93p3LxR9xfM <br/>
  Traversy Media explains the daunting Redux in such a beautiful way here. All the jargon words such as reducers, state, actions are very well defined by him. Redux may be seem difficult at the start but Traversy paves out a perfect route for beginners.

- **Redux 卡通指南** <br/>
  https://code-cartoons.com/a-cartoon-intro-to-redux-3afb775501a6 <br/>
  一个 Redux 的高级描述，使用友好的漫画来阐述 Redux 的理念。

- **Leveling Up with React: Redux** <br/>
  https://css-tricks.com/learning-react-redux/ <br/>
  一个非常精心编写的 Redux 及其相关概念的介绍，包含一些漂亮的卡通图表。

- **An Introduction to Redux** <br/>
  https://www.smashingmagazine.com/2016/06/an-introduction-to-redux/ <br/>
  概述和介绍 Redux 的基本概念。 使用 Redux 的好处，它与 MVC 或 Flux 的区别，以及它与函数式编程的关系。

- **Redux Tutorial** <br/>
  https://github.com/pshrmn/notes/blob/master/redux/redux.md <br/>
  一个简短明了的教程，介绍了基本的 Redux 术语，展示了如何拆分 reducer 函数，并描述了 Redux store API。

- **Redux: From Twitter Hype to Production** <br/>
  https://slides.com/jenyaterpil/redux-from-twitter-hype-to-production#/ <br/>
  这是一个制作精良的幻灯片，直观地介绍了 Redux 核心概念、与 React 的联动、项目组织以及带有 thunk 和 sagas 的副作用（side effect）。 用一些绝对 **极出色** 的动画图表演示了数据如何流经 React + Redux 架构。

- **DevGuides: Introduction to Redux** <br/>
  http://devguides.io/redux/ <br/>
  一个涵盖 Redux 多方面的教程，包括 actions、reducers、与 React 的联动和中间件。

## 在 React 中使用 Redux

_一些有关 React-Redux 绑定和 `connect` 函数的文章_

- **为什么 Redux 在 React 应用程序中很有用** <br/>
  https://www.fullstackreact.com/articles/redux-with-mark-erikson/ <br/>
  解释使用 Redux 和 React 的一些好处，比如在组件和热加载 (Hot Module Reloading) 之间共享数据。

* **Redux 可以做什么？（什么时候应该使用它？）** <br/>
  https://daveceddia.com/what-does-redux-do/ <br/>
  关于 Redux 如何解决 React 应用程序中的数据流问题的总结。

* **Redux 如何工作：一个计数器的例子** <br/>
  https://daveceddia.com/how-does-redux-work/ <br/>
  对前一篇文章的一个很好的后续。 它解释了如何使用 Redux 和 React-Redux，首先显示一个 React 组件，该组件在其内部状态中存储一个值，然后重构它以使用 Redux。在此过程中，本文解释了重要的 Redux 术语和概念，以及它们如何组合在一起以使 Redux 数据流正常工作。

* **Redux React 简介** <br/>
  https://jakesidsmith.com/blog/post/2017-11-18-redux-and-react-an-introduction/ <br/>
  介绍 Redux 的核心概念，解释如何使用 React-Redux 包将 Redux 与 React 一起使用。

## 基于项目的教程

_通过构建项目来教授 Redux 概念的教程，包括更大的现实场景类型的应用程序_

- **实用的 Redux** <br/>
  https://blog.isquaredsoftware.com/2016/10/practical-redux-part-0-introduction/ <br/>
  https://blog.isquaredsoftware.com/series/practical-redux/ <br/>
  An ongoing series of posts intended to demonstrate a number of specific Redux techniques by building a sample application, 一系列正在发布的帖子旨在通过构建示例应用程序来演示一些特定的 Redux 技术，该应用程序基于用于管理 Battletech 活动的 MekHQ 应用程序。由 Redux 共同维护者 Mark Erikson 撰写。涵盖管理关系数据，连接多个组件和列表、功能的复杂 reducer 逻辑，处理表单，显示模态对话框等主题。

- **使用 React + Redux 构建简单的 CRUD 应用程序** <br/>
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
  通过构建一个小型 RPG 风格的游戏介绍 Redux 和相关的库。

## 手写 Redux

_教你开发一个简化版 Redux，来阐述 Redux 内部工作原理_

- **Build Yourself a Redux** <br/>
  https://zapier.com/engineering/how-to-build-redux/ <br/>
  An excellent in-depth "build a mini-Redux" article, which covers not only Redux's core, but also `connect` and middleware as well.

- **Connect.js explained** <br/>
  https://gist.github.com/gaearon/1d19088790e70ac32ea636c025ba424e <br/>
  A very simplified version of React Redux's `connect()` function that illustrates the basic implementation

- **Let's Write Redux!** <br/>
  https://www.jamasoftware.com/blog/lets-write-redux/ <br/>
  Walks through writing a miniature version of Redux step-by-step, to help explain the concepts and implementation.

## Reducers

_讨论如何编写 reducer 函数的文章_

- **Taking Advantage of `combineReducers`** <br/>
  https://randycoulman.com/blog/2016/11/22/taking-advantage-of-combinereducers/ <br/>
  使用 `combineReducers` 多次生成状态树的示例，以及关于如何权衡各种 reducer 逻辑的一些想法。

- **高阶 Reducer 的力量** <br/>
  https://slides.com/omnidan/hor#/ <br/>
  来自 redux-undo 和其他库的作者的幻灯片演示，解释了高阶 Reducer 的概念以及如何使用它们

- **Reducer composition with Higher Order Reducers** <br/>
  https://medium.com/@mange_vibration/reducer-composition-with-higher-order-reducers-35c3977ed08f <br/>
  一些很好的例子，关于如何编写可以组合在一起执行更大的特定 Reducer 任务的小函数，例如提供初始状态、过滤、更新特定键等等。

- **Higher Order Reducers - It just sounds scary** <br/>
  https://medium.com/@danielkagan/high-order-reducers-it-just-sounds-scary-2b9e5dbfc705 <br/>
  解释如何将 Reducer 像乐高积木一样组合以创建可重复使用且可测试的 Reducer 逻辑。

## 选择器 Selectors

_如何以及为何使用 Selector 函数从 state 读取值_

- **Idiomatic Redux: Using Reselect Selectors for Encapsulation and Performance** <br/>
  https://blog.isquaredsoftware.com/2017/12/idiomatic-redux-using-reselect-selectors/ <br/>
  A complete guide to why you should use selector functions with Redux, how to use the Reselect library to write optimized selectors, and advanced tips for improving performance.

- **ReactCasts #8: Selectors in Redux** <br/>
  https://www.youtube.com/watch?v=frT3to2ACCw <br/>
  A great overview of why and how to use selector functions to retrieve data from the store, and derive additional data from store values

- **Optimizing React Redux Application Development with Reselect** <br/>
  https://codebrahma.com/reselect-tutorial-optimizing-react-redux-application-development-with-reselect/ <br/>
  A good tutorial on Reselect. Covers the concept of "selector functions", how to use Reselect's API, and how to use memoized selectors to improve performance.

- **Usage of Reselect in a React-Redux Application** <br/>
  https://dashbouquet.com/blog/frontend-development/usage-of-reselect-in-a-react-redux-application <br/>
  Discusses the importance of memoized selectors for performance, and good practices for using Reselect.

- **React, Reselect, and Redux** <br/>
  https://medium.com/@parkerdan/react-reselect-and-redux-b34017f8194c <br/>
  An explanation of how Reselect's memoized selector functions are useful in Redux apps, and how to create unique selector instances for each component instance.

## 范式化 Normalization

_如何像数据库一样构建 Redux Store以获得最佳性能_

- **Querying a Redux Store** <br/>
  https://medium.com/@adamrackis/querying-a-redux-store-37db8c7f3b0f <br/>
  A look at best practices for organizing and storing data in Redux, including normalizing data and use of selector functions.

- **Normalizing Redux Stores for Maximum Code Reuse** <br/>
  https://medium.com/@adamrackis/normalizing-redux-stores-for-maximum-code-reuse-ae6e3844ae95 <br/>
  Thoughts on how normalized Redux stores enable some useful data handling approaches, with examples of using selector functions to denormalize hierarchical data.

- **Advanced Redux Entity Normalization** <br/>
  https://medium.com/@dcousineau/advanced-redux-entity-normalization-f5f1fe2aefc5 <br/>
  Describes a "keyWindow" concept for tracking subsets of entities in state, similar to an SQL "view". A useful extension to the idea of normalized data.

## 中间件 Middleware

_Explanations and examples of how middleware work and how to write them_

- **Exploring Redux Middlewares** <br/>
  https://blog.krawaller.se/posts/exploring-redux-middleware/ <br/>
  Understanding middlewares through a series of small experiments

- **Redux Middleware Tutorial** <br/>
  https://www.pshrmn.com/tutorials/react/redux-middleware/ <br/>
  An overview of what middleware is, how `applyMiddleware` works, and how to write middleware.

- **ReactCasts #6: Redux Middleware** <br/>
  https://www.youtube.com/watch?v=T-qtHI1qHIg <br/>
  A screencast that describes how middleware fit into Redux, their uses, and how to implement a custom middleware

- **A Beginner's Guide to Redux Middleware** <br/>
  https://www.codementor.io/reactjs/tutorial/beginner-s-guide-to-redux-middleware <br/>
  A useful explanation of middleware use cases, with numerous examples

- **Functional Composition in Javascript** <br/>
  https://joecortopassi.com/articles/functional-composition-in-javascript/ <br/>
  Breaking down how the `compose` function works

## 副作用 (Side Effect) —— 基础

_介绍如何在 Redux 中处理异步行为_

- **Stack Overflow: Dispatching Redux Actions with a Timeout** <br/>
  https://stackoverflow.com/questions/35411423/how-to-dispatch-a-redux-action-with-a-timeout/35415559#35415559 <br/>
  Dan Abramov explains the basics of managing async behavior in Redux, walking through a progressive series of approaches (inline async calls, async action creators, thunk middleware).

- **Stack Overflow: Why do we need middleware for async flow in Redux?** <br/>
  https://stackoverflow.com/questions/34570758/why-do-we-need-middleware-for-async-flow-in-redux/34599594#34599594 <br/>
  Dan Abramov gives reasons for using thunks and async middleware, and some useful patterns for using thunks.

- **What the heck is a "thunk"?** <br/>
  https://daveceddia.com/what-is-a-thunk/ <br/>
  A quick explanation for what the word "thunk" means in general, and for Redux specifically.

- **Thunks in Redux: The Basics** <br/>
  https://medium.com/fullstack-academy/thunks-in-redux-the-basics-85e538a3fe60 <br/>
  A detailed look at what thunks are, what they solve, and how to use them.

## 副作用 (Side Effect) —— 进阶

_用于管理异步行为的进阶工具和技术_

- **What is the right way to do asynchronous operations in Redux?** <br/>
  https://decembersoft.com/posts/what-is-the-right-way-to-do-asynchronous-operations-in-redux/ <br/>
  An excellent look at the most popular libraries for Redux side effects, with comparisons of how each one works.

- **Redux 4 Ways** <br/>
  https://medium.com/react-native-training/redux-4-ways-95a130da0cdc <br/>
  Side-by-side comparisons of implementing some basic data fetching using thunks, sagas, observables, and a promise middleware

- **Idiomatic Redux: Thoughts on Thunks, Sagas, Abstractions, and Reusability** <br/>
  https://blog.isquaredsoftware.com/2017/01/idiomatic-redux-thoughts-on-thunks-sagas-abstraction-and-reusability/ <br/>
  A response to several "thunks are bad" concerns, arguing that thunks (and sagas) are still a valid approach for managing complex sync logic and async side effects.

- **Javascript Power Tools: Redux-Saga** <br/>
  https://formidable.com/blog/2017/javascript-power-tools-redux-saga/ <br/>
  https://formidable.com/blog/2017/composition-patterns-in-redux-saga/ <br/>
  https://formidable.com/blog/2017/real-world-redux-saga-patterns/ <br/>
  A fantastic series that teaches the concepts, implementation, and benefits behind Redux-Saga, including how ES6 generators are used to control function flow, how sagas can be composed together to accomplish concurrency, and practical use cases for sagas.

- **Exploring Redux Sagas** <br/>
  https://medium.com/onfido-tech/exploring-redux-sagas-cc1fca2015ee <br/>
  An excellent article that explores how to use sagas to provide a glue layer to implement decoupled business logic in a Redux application.

- **Taming Redux with Sagas** <br/>
  https://objectpartners.com/2017/11/20/taming-redux-with-sagas/ <br/>
  A good overview of Redux-Saga, including info on generator functions, use cases for sagas, using sagas to deal with promises, and testing sagas.

- **Reactive Redux State with RxJS** <br/>
  https://ivanjov.com/reactive-redux-state-with-rxjs/ <br/>
  Describes the concept of "Reactive Programming" and the RxJS library, and shows how to use redux-observable to fetch data, along with examples of testing.

- **Using redux-observable to handle asynchronous logic in Redux** <br/>
  https://medium.com/dailyjs/using-redux-observable-to-handle-asynchronous-logic-in-redux-d49194742522 <br/>
  An extended post that compares a thunk-based implementation of handling a line-drawing example vs an observable-based implementation.

## 像 Redux 一样思考

_更深入地了解 Redux 的使用方式，以及它为何如此工作_

- **When (and when not) to reach for Redux** <br />
  https://changelog.com/posts/when-and-when-not-to-reach-for-redux <br />
  Redux maintainer Mark Erikson describes the problems Redux was created to solve, and how it compares to other commonly used tools.

* **You Might Not Need Redux** <br/>
  https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367 <br/>
  Dan Abramov 的一些是否需要使用 Redux 的看法。

* **Idiomatic Redux: The Tao of Redux, Part 1 - Implementation and Intent** <br/>
  https://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-1/ <br/>
  深入探讨 Redux 的实际工作方式，它要求您遵循的约束条件，以及其设计和使用背后的意图。

* **Idiomatic Redux: The Tao of Redux, Part 2 - Practice and Philosophy** <br/>
  https://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-2/ <br/>
  后续探讨了为什么存在常见的 Redux 使用模式，可以使用 Redux 的其他方式，以及这些不同模式和方法的优缺点。

* **What's So Great About Redux?** <br/>
  https://medium.freecodecamp.org/whats-so-great-about-redux-ac16f1cc0f8b <br/>
  对 Redux 如何与 OOP 和消息传递进行比较的深入而有趣的分析，Redux 的典型使用方式可以转向具有更多样板的类似 Java 的 “setter” 函数，以及对更高级别的 “blessed” 抽象的请求。Redux 让您更容易与新手一起工作和学习。非常值得一读。作者最初写了一个 tweetstorm（它在 Storify 链接中），并写了博客文章以扩展这些想法。最后，他在另一篇较短的推文帖子中对抽象与具体例子进行了更多的思考。

## Redux 架构

_用于构建大型 Redux 应用程序的模式和实践_

- **在构建应用程序 state 时避免意外复杂性** <br/>
  https://hackernoon.com/avoiding-accidental-complexity-when-structuring-your-app-state-6e6d22ad5e2a <br/>
  一套出色的如何组织 Redux state 结构的指南。

- **Redux Step by Step: 适用于真实应用程序的简单而强大的工作流程** <br/>
  https://hackernoon.com/redux-step-by-step-a-simple-and-robust-workflow-for-real-life-apps-1fdf7df46092 <br/>
  “意外复杂性” 一文的后续部分，讨论组织 Redux state 的原则

- **我希望我知道的那些关于 Redux 的事** <br/>
  https://medium.com/horrible-hacks/things-i-wish-i-knew-about-redux-9924abf2f9e0 <br/>
  https://www.reddit.com/r/javascript/comments/4taau2/things_i_wish_i_knew_about_redux/ <br/>
  分享了使用 Redux 构建应用程序后获得的一些优秀技巧和经验教训。包括有关连接组件、选择数据、应用程序结构和项目结构的信息。Reddit 上有更多的讨论。

- **React+Redux: 有关如何实现代码干净、可靠和具有可维护的提示和最佳实践** <br/>
  https://speakerdeck.com/goopscoop/react-plus-redux-tips-and-best-practices-for-clean-reliable-and-scalable-code <br/>
  一个出色的幻灯片，提供各种提示和建议，包括简化 action 创建和减少 reducer 中的数据操作，抽象 API 调用，避免 props 传递等等。

- **Redux 用于大型 Web 应用程序中的状态管理** <br/>
  https://blog.mapbox.com/redux-for-state-management-in-large-web-apps-c7f3fab3ce9b <br/>
  优秀的讨论和常用的 Redux 架构示例，以及 Mapbox 如何将这些方法应用于他们的 Mapbox Studio 应用程序。

## 应用和示例

- **React-Redux RealWorld Example: TodoMVC for the Real World** <br/>
  https://github.com/GoThinkster/redux-review <br/>
  使用 Redux 构建的全栈 “real world” 应用程序示例。类似 medium 的社交博客网站 Demo，其中包括 JWT 身份验证，CRUD，收藏文章，关注用户，路由等。RealWorld 项目还包括网站前端和后端的许多其他实现，包括同一项目、API 规范的服务器端和客户端实现的比较。

- **Project Mini-Mek** <br/>
  https://github.com/markerikson/project-minimek <br/>
  一个应用程序示例，演示各种有用的 Redux 技术，“Practical Redux” 博客系列 https://blog.isquaredsoftware.com/series/practical-redux

- **react-redux-yelp-clone** <br/>
  https://github.com/mohamed-ismat/react-redux-yelp-clone <br/>
  使用 react 技术栈完成的 “Yelp clone” 应用。它通过使用 Redux 和 Redux-Saga 而不是本地状态，以及 React Router v4、样式组件和其他现代标准来扩展原始版本。基于 React-Boilerplate starter kit。

- **WordPress-Calypso** <br/>
  https://github.com/Automattic/wp-calypso <br/>
  新的基于 JavaScript 和 API 的 WordPress.com

- **Sound-Redux** <br/>
  https://github.com/andrewngu/sound-redux <br/>
  使用 React/Redux 构建的 Soundcloud 客户端

- **Webamp** <br/>
  https://webamp.org <br/>
  https://github.com/captbaritone/webamp <br/>
  Winamp2 的浏览器版本，用 React 和 Redux 构建。实际上播放 MP3，并允许您加载本地 MP3 文件。

- **Tello** <br/>
  https://github.com/joshwcomeau/Tello <br/>
  一种简单而愉快的方式来跟踪和管理电视节目

- **io-808** <br/>
  https://github.com/vincentriemer/io-808 <br/>
  试图完全重建基于网络的 TR-808 drum machine

## Redux 文档翻译

- [⭐🌟✨中文文档](http://camsong.github.io/redux-in-chinese/) — Chinese [本文档]
- [繁體中文文件](https://github.com/chentsulin/redux) — Traditional Chinese
- [Redux in Russian](https://github.com/rajdee/redux-in-russian) — Russian
- [Redux en Español](https://es.redux.js.org/) - Spanish
- [Redux in Korean](https://ko.redux.js.org/) - Korean

## 书籍

- **Redux in Action** <br/>
  https://www.manning.com/books/redux-in-action <br/>
  A comprehensive book that covers many key aspects of using Redux, including the basics of reducers and actions and use with React, complex middlewares and side effects, application structure, performance, testing, and much more. Does a great job of explaining the pros, cons, and tradeoffs of many approaches to using Redux. Personally recommended by Redux co-maintainer Mark Erikson.

- **The Complete Redux Book** <br/>
  https://leanpub.com/redux-book <br/>
  How do I manage a large state in production? Why do I need store enhancers? What is the best way to handle form validations? Get the answers to all these questions and many more using simple terms and sample code. Learn everything you need to use Redux to build complex and production-ready web applications. (Note: now permanently free!)

- **Taming the State in React** <br/>
  https://www.robinwieruch.de/learn-react-redux-mobx-state-management/ <br/>
  If you have learned React with the previous book of the author called The Road to learn React, Taming the State in React will be the perfect blend to learn about basic and advanced state management in React. You will start out with learning only Redux without React. Afterward, the book shows you how to connect Redux to your React application. The advanced chapters will teach you about normalization, naming, selectors and asynchronous actions. In the end, you will set up and build a real world application with React and Redux.

## 课程

- **Modern React with Redux, by Stephen Grider (paid)** <br/>
  https://www.udemy.com/react-redux/ <br/>
  使用本教程能够学习开发应用时如何将 React、Redux 与 React-Router、Webpack、ES6 同时使用的基础知识。本课程将帮助您快速启动并运行，并教您深入理解使用 Redux 时如何构建 React 组件和如何处理应用程序结构。

- **Redux, by Tyler McGinnis (paid)** <br/>
  https://tylermcginnis.com/courses/redux/ <br/>
  在学习 Redux 时，您需要在足够复杂的应用程序环境中才能感受到 Redux 带来的好处。这就是为什么这门课程很大。一个更好的名字可能会是 Real World Redux 。如果您厌倦了类似 “Todo list” 的 Redux 教程，那么您来对了地方。在本课程中，我们将讨论 Redux 在您的应用程序中管理状态的特殊之处。我们将构建一个实际的 “真实世界” 应用程序，以便您可以学到 Redux 如何处理 optimistic updates 和错误捕获等边缘情况。我们还将介绍许多其他适用于 Redux，Firebase 和 CSS Modules 的技术。

- **Learn Redux, by Wes Bos (free)** <br/>
  https://learnredux.com/ <br/>
  一个构建 'Reduxstagram' 的视频课程 —— 一个简单的照片应用程序，将简化 Redux，React Router 和 React.js 背后的核心思想。

## 更多资源

- [React-Redux Links](https://github.com/markerikson/react-redux-links) 是 React、Redux、ES6 等高质量文章、教程和相关内容的精选列表。
- [Redux Ecosystem Links](https://github.com/markerikson/redux-ecosystem-links) 是 Redux 相关库、插件和实用程序的分类集合。
- [Awesome Redux](https://github.com/xgrommx/awesome-redux) 是与 Redux 相关的库的列表。
- [DEV Community](https://dev.to/t/redux) 是一个分享 Redux 项目、文章和教程以及讨论并询问有关 Redux 问题的地方。 欢迎各种技术水平的开发人员参加。
