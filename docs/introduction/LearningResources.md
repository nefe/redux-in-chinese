# 学习资源

Redux文档旨在教授Redux的基本概念，并解释在实际应用程序中使用的关键概念。但是，文档无法涵盖所有内容。令人高兴的是，还有许多其他很好的资源可用于学习Redux。我们鼓励你仔细查看一下。 其中许多内容涵盖了超出文档范围的主题, 或以可能更适合您学习方式的方法阐述相同的内容。

此页面包含我们对可用于学习Redux的一些最佳外部资源的建议。有关React，Redux，Javascript和相关主题的其他大量教程，文章和其他资源，可以查看[React/Redux Links list](https://github.com/markerikson/react-redux-links)。

## 基础介绍

**教授Redux基本概念以及如何使用它的教程**

- **Redux入门 —— 系列视频**  
  https://egghead.io/series/getting-started-with-redux  
  https://github.com/tayiorbeii/egghead.io_redux_course_notes  
  Redux的创建者Dan Abramov在30个短片（2-5分钟）中展示了各种概念。链接的Github仓库包含视频的笔记和转录。

- **使用Redux的常用方式构建React应用程序 —— 系列视频**  
  https://egghead.io/series/building-react-applications-with-idiomatic-redux  
  https://github.com/tayiorbeii/egghead.io_idiomatic_redux_course_notes  
  Dan Abramov的第二个视频教程系列，第一个系列的续集。包括在store中初始化state、如何和React Router一起使用、使用“selector” function、状态规范化、使用Redux中间件、异步action creator等课程。链接的Github仓库包含视频的笔记和转录。

- **Live React: 热重载 and Time Travel**  
  http://youtube.com/watch?v=xsSnOQynTHs  
  Dan Abramov在最初介绍了Redux的会议上的演讲。了解Redux如何通过强制执行的约束实现Time Travel和热重载。

- **Redux卡通指南**  
  https://code-cartoons.com/a-cartoon-intro-to-redux-3afb775501a6  
  一个Redux的高级描述，使用友好的漫画来阐述Redux的理念。

- **Leveling Up with React: Redux**  
  https://css-tricks.com/learning-react-redux/  
  一个非常精心编写的Redux及其相关概念的介绍，包含一些漂亮的卡通图表。

- **Redux简介**  
  https://www.smashingmagazine.com/2016/06/an-introduction-to-redux/  
  概述和介绍Redux的基本概念。 使用Redux的好处，它与MVC或Flux的区别，以及它与函数式编程的关系。

- **Redux教程**  
  https://www.pshrmn.com/tutorials/react/redux/  
  一个简短明了的教程，介绍了基本的Redux术语，展示了如何拆分reducer函数，并描述了Redux store API。

- **Redux：从Twitter大肆宣传到生产环境**  
  http://slides.com/jenyaterpil/redux-from-twitter-hype-to-production#/  
  这是一个制作精良的幻灯片，直观地介绍了Redux核心概念、与React的联动、项目组织以及带有thunk和sagas的副作用（side effect）。 用一些绝对 **极出色** 的动画图表演示了数据如何流经React + Redux架构。

- **DevGuides: 介绍Redux**  
  http://devguides.io/redux/  
  一个涵盖Redux的几个方面的教程，包括actions、reducers、与React的联动和中间件。

## 在React中使用Redux

**一些有关React-Redux绑定和`connect`函数的文章**

- **为什么Redux在React应用程序中很有用**  
  https://www.fullstackreact.com/articles/redux-with-mark-erikson/  
  解释使用Redux和React的一些好处，比如在组件和热加载(Hot Module Reloading)之间共享数据。

* **Redux可以做什么？（什么时候应该使用它？）**  
  https://daveceddia.com/what-does-redux-do/  
  关于Redux如何解决React应用程序中的数据流问题的总结。

* **Redux如何工作：一个计数器的例子**  
  https://daveceddia.com/how-does-redux-work/  
  对前一篇文章的一个很好的后续。 它解释了如何使用Redux和React-Redux，首先显示一个React组件，该组件在其内部状态中存储一个值，然后重构它以使用Redux。在此过程中，本文解释了重要的Redux术语和概念，以及它们如何组合在一起以使Redux数据流正常工作。

* **Redux and React: 简介**  
  http://jakesidsmith.com/blog/post/2017-11-18-redux-and-react-an-introduction/  
  介绍Redux的核心概念，解释如何使用React-Redux包将Redux与React一起使用。

## 基于项目的教程

**通过构建项目来教授Redux概念的教程，包括更大的“real world”类型的应用程序**

- **实用的Redux**  
  http://blog.isquaredsoftware.com/2016/10/practical-redux-part-0-introduction/  
  http://blog.isquaredsoftware.com/series/practical-redux/  
  一系列正在发布的帖子旨在通过构建示例应用程序来演示一些特定的Redux技术，该应用程序基于用于管理Battletech活动的MekHQ应用程序。由Redux共同维护者Mark Erikson撰写。涵盖管理关系数据，连接多个组件和列表、功能的复杂reducer逻辑，处理表单，显示模态对话框等主题。

- **使用React + Redux构建简单的CRUD应用程序**  
  http://www.thegreatcodeadventure.com/building-a-simple-crud-app-with-react-redux-part-1/  
  这是一个精彩的含有8部分的系列教程，演示了如何构建CRUD应用程序，包括路由、AJAX调用和各种CRUD方面。写得很好，还有一些有用的图表。

- **使用React + Redux构建的Soundcloud客户端**  
  http://www.robinwieruch.de/the-soundcloud-client-in-react-redux/  
  详细的演示了项目设置、路由、身份验证、获取远程数据以及如何包装有状态库（stateful library）。

- **全栈Redux教程**  
  http://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html  
  这是一个全面、深入的教程，可构建完整的客户端——服务器应用程序。

- **React，Redux和Immutable入门：一个测试驱动的教程**  
  http://www.theodo.fr/blog/2016/03/getting-started-with-react-redux-and-immutable-a-test-driven-tutorial-part-1/  
  http://www.theodo.fr/blog/2016/03/getting-started-with-react-redux-and-immutable-a-test-driven-tutorial-part-2/  
  另一个坚实、深入的教程，类似于“全栈Redux教程”。 构建一个仅有客户端的TodoMVC应用程序，并演示一个良好的项目设置（包括基于Mocha + JSDOM的测试配置）。写得很好，涵盖了很多概念，而且非常容易理解。

- **Redux Hero：Redux和Reselect简介**  
  https://decembersoft.com/posts/redux-hero-part-1-a-hero-is-born-a-fun-introduction-to-redux-js/  
  通过构建一个小型RPG风格的游戏介绍Redux和相关的库。

## Redux实现

**通过实现简化版Redux来阐述Redux内部原理**

- **自己打造一个Redux**  
  https://zapier.com/engineering/how-to-build-redux/  
  这是一篇非常深入的“构建迷你Redux”文章，它不仅涵盖了Redux的核心，还涵盖了`connect`和中间件。

- **Connect.js explained**  
  https://gist.github.com/gaearon/1d19088790e70ac32ea636c025ba424e  
  React-Redux的`connect()`函数的一个非常简化的版本，完成了`connect()`的基本的实现。

- **让我们写一个Redux吧!**  
  http://www.jamasoftware.com/blog/lets-write-redux/  
  通过逐步编写Redux的简化版本来帮理解Redux的概念和实现。

## Reducer

**讨论如何编写reducer函数的文章**

- **利用`combineReducers`**  
  http://randycoulman.com/blog/2016/11/22/taking-advantage-of-combinereducers/  
  使用`combineReducers`多次生成状态树的示例，以及关于如何权衡各种reducer逻辑的一些想法。

- **高阶Reducer的力量**  
  http://slides.com/omnidan/hor#/  
  来自redux-undo和其他库的作者的幻灯片演示，解释了高阶Reducer的概念以及如何使用它们

- **具有高阶Reducer的Reducer组成**  
  https://medium.com/@mange_vibration/reducer-composition-with-higher-order-reducers-35c3977ed08f  
  一些很好的例子，关于如何编写可以组合在一起执行更大的特定Reducer任务的小函数，例如提供初始状态、过滤、更新特定键等等。

- **高阶Reducer —— 只是听起来很吓人**  
  https://medium.com/@danielkagan/high-order-reducers-it-just-sounds-scary-2b9e5dbfc705  
  解释如何将Reducer像乐高积木一样组合以创建可重复使用且可测试的Reducer逻辑。

## Selector

**如何以及为何使用Selector函数从state读取值**

- **Redux的常用方式: 使用Reselect Selector实现封装和高性能**  
  https://blog.isquaredsoftware.com/2017/12/idiomatic-redux-using-reselect-selectors/  
  一本完整指南，包含如何使用Redux的Selector函数、如何使用Reselect库编写优化Selector以及如何提高性能的高级技巧。

- **ReactCasts #8: Selectors in Redux**  
  https://www.youtube.com/watch?v=frT3to2ACCw  
  概述了为什么以及如何使用Selector函数从store中检索数据，以及如何从store value派生其他数据。

- **用Reselect优化React Redux应用程序开发**  
  https://codebrahma.com/reselect-tutorial-optimizing-react-redux-application-development-with-reselect/  
  关于Reselect的一个很好的教程。涵盖了“selector函数”的概念，如何使用Reselect的API，以及如何使用memoized selector来提高性能。

- **在React-Redux应用程序中使用Reselect**  
  https://dashbouquet.com/blog/frontend-development/usage-of-reselect-in-a-react-redux-application  
  讨论了memoized selector对性能的重要性，以及如何使用Reselect的良好实践。

- **React, Reselect, and Redux**  
  https://medium.com/@parkerdan/react-reselect-and-redux-b34017f8194c  
  解释Reselect的memoized selector函数在Redux应用程序中是如何有用的，以及如何为每个组件实例创建唯一的selector实例。

## 规范

**如何像数据库一样构建Redux存储以获得最佳性能**

- **查询Redux Store**  
  https://medium.com/@adamrackis/querying-a-redux-store-37db8c7f3b0f  
  在Redux中组织和存储数据的最佳实践，包括规范化数据和使用selector函数。

- **规范Redux Store以实现最大代码重用**  
  https://medium.com/@adamrackis/normalizing-redux-stores-for-maximum-code-reuse-ae6e3844ae95  
  关于规范化Redux存储以实现一些有用的数据处理方法的想法，以及如何使用selector函数来对分层数据进行非规范化的示例。

- **Redux Normalizr: 改善你的State管理**  
  http://www.robinwieruch.de/the-soundcloud-client-in-react-redux-normalizr/  
  描述如何使用Normalizr改进Redux中嵌套数据的数据管理的教程。

- **高级Redux实体规范化**  
  https://medium.com/@dcousineau/advanced-redux-entity-normalization-f5f1fe2aefc5  
  描述用于跟踪状态中实体子集的“keyWindow”概念，类似于SQL“视图”。标准化数据概念的有用扩展。

## 中间件

**中间件如何工作以及如何编写它们的解释和示例**

- **探索Redux中间件**  
  http://blog.krawaller.se/posts/exploring-redux-middleware/  
  通过一系列小实验了解中间件

- **Redux中间件教程**  
  http://www.pshrmn.com/tutorials/react/redux-middleware/  
  概述了什么是中间件，`applyMiddleware`是如何工作的，以及如何编写中间件。

- **ReactCasts #6: Redux 中间件**  
  https://www.youtube.com/watch?v=T-qtHI1qHIg  
  一个视频，描述了中间件如何融入Redux、中间件的用途以及如何实现自定义中间件。

- **Redux中间件初学者指南**  
  https://www.codementor.io/reactjs/tutorial/beginner-s-guide-to-redux-middleware  
  中间件用例的有用解释，有大量示例。

## 副作用(Side Effect) —— 基础

**介绍如何在Redux中处理异步行为**

- **Stack Overflow: Dispatching Redux Actions with a Timeout**  
  http://stackoverflow.com/questions/35411423/how-to-dispatch-a-redux-action-with-a-timeout/35415559#35415559  
  Dan Abramov解释了在Redux中管理异步行为的基础知识，介绍了一系列渐进式方法（内联异步调用，异步action creators，thunk中间件）。

- **Stack Overflow: 为什么我们在Redux中需要用于异步流的中间件？**  
  http://stackoverflow.com/questions/34570758/why-do-we-need-middleware-for-async-flow-in-redux/34599594#34599594  
  Dan Abramov给出了使用thunks和异步中间件的原因，以及一些使用thunk的有用模式。

- **什么是“thunk”？**  
  https://daveceddia.com/what-is-a-thunk/  
  快速解释一下“thunk”这个词的含义，以及Redux的具体含义。

- **Thunks in Redux: The Basics**  
  https://medium.com/fullstack-academy/thunks-in-redux-the-basics-85e538a3fe60  
  详细了解一下thunk是什么，他们解决了什么，以及如何使用它们。

## 副作用(Side Effect) —— 进阶

**用于管理异步行为的进阶工具和技术**

- **在Redux中进行异步操作的正确方法是什么？**  
  https://decembersoft.com/posts/what-is-the-right-way-to-do-asynchronous-operations-in-redux/  
  查看最流行的Redux副作用(Side Effect)库，并比较每个库的工作方式。

- **Redux的四种异步工具**  
  https://medium.com/react-native-training/redux-4-ways-95a130da0cdc  
  使用thunks，sagas，observables和promise中间件实现一些基本数据获取的并排比较。

- **Redux的常用方式: 关于Thunk、Saga、抽象和可重用性的思考**
  http://blog.isquaredsoftware.com/2017/01/idiomatic-redux-thoughts-on-thunks-sagas-abstraction-and-reusability/  
  对几个“thunk不好”问题的回应，认为thunk（和saga）仍然是管理复杂同步逻辑和异步副作用(Side Effect)的有效方法。

- **Javascript 利器: Redux-Saga**  
  http://formidable.com/blog/2017/javascript-power-tools-redux-saga/  
  http://formidable.com/blog/2017/composition-patterns-in-redux-saga/  
  http://formidable.com/blog/2017/real-world-redux-saga-patterns/  
  这是一个精彩的系列，讲述了Redux-Saga背后的概念、实现和优势，包括如何使用ES6 generator来控制功能流、如何将saga组合在一起以实现并发以及实际的saga使用案例。

- **探索Redux Saga** 
  https://medium.com/onfido-tech/exploring-redux-sagas-cc1fca2015ee  
  这篇文章探讨了如何使用saga提供粘合层以在Redux应用程序中实现解耦业务逻辑。

- **驯服Redux与Saga**  
  https://objectpartners.com/2017/11/20/taming-redux-with-sagas/  
  Redux-Saga的一个很好的概述，包括generator functions的信息、saga的使用案例、使用saga来处理promise以及测试saga。

- **Reactive Redux State with RxJS**  
  https://ivanjov.com/reactive-redux-state-with-rxjs/  
  描述了“Reactive Programming”和RxJS库的概念，并展示了如何使用redux-observable来获取数据，以及测试示例。

- **使用redux-observable处理Redux中的异步逻辑**  
  https://medium.com/dailyjs/using-redux-observable-to-handle-asynchronous-logic-in-redux-d49194742522  
  一个扩展的帖子，用于比较基于observable和基于thunk实现处理线条绘制示例的不同之处。

## Thinking in Redux

**更深入地了解Redux的使用方式，以及它为何如此工作**

- **你可能不需要Redux**  
  https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367  
  Dan Abramov的一些是否需要使用Redux的看法。

- **Redux的常用方式: Redux之道，第1部分——实现和意图**
  http://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-1/  
  深入探讨Redux的实际工作方式，它要求您遵循的约束条件，以及其设计和使用背后的意图。

- **Redux的常用方式: Redux之道，第2部分——实践和理念**  
  http://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-2/  
  后续探讨了为什么存在常见的Redux使用模式，可以使用Redux的其他方式，以及这些不同模式和方法的优缺点。

- **What's So Great About Redux？**  
  https://medium.freecodecamp.org/whats-so-great-about-redux-ac16f1cc0f8b  
  https://storify.com/acemarke/redux-pros-cons-and-limitations  
  https://twitter.com/modernserf/status/886426115874717697  
  对Redux如何与OOP和消息传递进行比较的深入而有趣的分析，Redux的典型使用方式可以转向具有更多样板的类似Java的“setter”函数，以及对更高级别的“blessed”抽象的请求。Redux让您更容易与新手一起工作和学习。非常值得一读。作者最初写了一个tweetstorm（它在Storify链接中），并写了博客文章以扩展这些想法。最后，他在另一篇较短的推文帖子中对抽象与具体例子进行了更多的思考。

## Redux架构

**用于构建大型Redux应用程序的模式和实践**

- **在构建应用程序state时避免意外复杂性**  
  https://hackernoon.com/avoiding-accidental-complexity-when-structuring-your-app-state-6e6d22ad5e2a  
  一套出色的如何组织Redux state结构的指南。

- **Redux Step by Step: 适用于真实应用程序的简单而强大的工作流程**  
  https://hackernoon.com/redux-step-by-step-a-simple-and-robust-workflow-for-real-life-apps-1fdf7df46092  
  “意外复杂性”一文的后续部分，讨论组织Redux state的原则

- **我希望我知道的那些关于Redux的事**  
  https://medium.com/horrible-hacks/things-i-wish-i-knew-about-redux-9924abf2f9e0  
  https://www.reddit.com/r/javascript/comments/4taau2/things_i_wish_i_knew_about_redux/  
  分享了使用Redux构建应用程序后获得的一些优秀技巧和经验教训。包括有关连接组件、选择数据、应用程序结构和项目结构的信息。Reddit上有更多的讨论。

- **React+Redux: 有关如何实现代码干净、可靠和具有可维护的提示和最佳实践**  
  https://speakerdeck.com/goopscoop/react-plus-redux-tips-and-best-practices-for-clean-reliable-and-scalable-code  
  一个出色的幻灯片，提供各种提示和建议，包括简化action创建和减少reducer中的数据操作，抽象API调用，避免props传递等等。

- **Redux用于大型Web应用程序中的状态管理** 
  https://www.mapbox.com/blog/redux-for-state-management-in-large-web-apps/  
  优秀的讨论和常用的Redux架构示例，以及Mapbox如何将这些方法应用于他们的Mapbox Studio应用程序。

## 应用和示例

- **React-Redux RealWorld Example: TodoMVC for the Real World**  
  https://github.com/GoThinkster/redux-review  
  使用Redux构建的全栈“real world”应用程序示例。类似medium的社交博客网站Demo，其中包括JWT身份验证，CRUD，收藏文章，关注用户，路由等。RealWorld项目还包括网站前端和后端的许多其他实现，包括同一项目、API规范的服务器端和客户端实现的比较。

- **Project Mini-Mek**  
  https://github.com/markerikson/project-minimek  
  一个应用程序示例，演示各种有用的Redux技术，“Practical Redux”博客系列http://blog.isquaredsoftware.com/series/practical-redux

- **react-redux-yelp-clone**  
  https://github.com/mohamed-ismat/react-redux-yelp-clone  
  使用react技术栈完成的“Yelp clone”应用。它通过使用Redux和Redux-Saga而不是本地状态，以及React Router v4、样式组件和其他现代标准来扩展原始版本。基于React-Boilerplate starter kit。

- **WordPress-Calypso**  
  https://github.com/Automattic/wp-calypso  
  新的基于JavaScript和API的WordPress.com

- **Sound-Redux**  
  https://github.com/andrewngu/sound-redux  
  使用React/Redux构建的Soundcloud客户端

- **Webamp**  
  https://webamp.org  
  https://github.com/captbaritone/webamp  
  Winamp2的浏览器版本，用React和Redux构建。实际上播放MP3，并允许您加载本地MP3文件。

- **Tello**  
  https://github.com/joshwcomeau/Tello  
  一种简单而愉快的方式来跟踪和管理电视节目

- **io-808**  
  https://github.com/vincentriemer/io-808  
  试图完全重建基于网络的TR-808 drum machine

## Redux 文档翻译

- [中文文档](http://camsong.github.io/redux-in-chinese/) — Chinese
- [繁體中文文件](https://github.com/chentsulin/redux) — Traditional Chinese
- [Redux in Russian](https://github.com/rajdee/redux-in-russian) — Russian
- [Redux en Español](http://es.redux.js.org/) - Spanish

## 书籍

- **Redux in Action**  
  https://www.manning.com/books/redux-in-action  
  这本综合性书籍涵盖了使用Redux的许多关键方面，包括reducers和actions的基础知识以及与React的联动、复杂的中间件和副作用、应用程序结构、性能、测试等等。很好地解释了使用Redux的许多方法的优点、缺点和如何权衡。由Redux co-maintainer Mark Erikson亲自推荐。

- **The Complete Redux Book**  
  https://leanpub.com/redux-book  
  如何在生产环境中管理大型state？为什么我需要store enhancers？处理表单验证的最佳实践是什么？使用简单的术语和示例代码，获得所有这些问题以及更多问题的答案。了解使用Redux构建复杂且可投入生产的Web应用程序所需的一切。(提示: 现在永久免费!)

## 课程

- **Modern React with Redux, by Stephen Grider (付费)**  
  https://www.udemy.com/react-redux/  
  使用本教程能够学习开发应用时如何将React、Redux与React-Router、Webpack、ES6同时使用的基础知识。本课程将帮助您快速启动并运行，并教您深入理解使用Redux时如何构建React组件和如何处理应用程序结构。

- **Redux, by Tyler McGinnis (付费)**  
  https://tylermcginnis.com/courses/redux/  
  在学习Redux时，您需要在足够复杂的应用程序环境中才能感受到Redux带来的好处。这就是为什么这门课程很大。一个更好的名字可能会是 **Real World Redux** 。如果您厌倦了类似“Todo list”的Redux教程，那么您来对了地方。在本课程中，我们将讨论Redux在您的应用程序中管理状态的特殊之处。我们将构建一个实际的“真实世界”应用程序，以便您可以学到Redux如何处理optimistic updates和错误捕获等边缘情况。我们还将介绍许多其他适用于Redux，Firebase和CSS Modules的技术。

- **Learn Redux, by Wes Bos (免费)**  
  https://learnredux.com/  
  一个构建'Reduxstagram'的视频课程 —— 一个简单的照片应用程序，将简化Redux，React Router和React.js背后的核心思想。

## 更多资源

- [React-Redux Links](https://github.com/markerikson/react-redux-links) 是React、Redux、ES6等高质量文章、教程和相关内容的精选列表。
- [Redux Ecosystem Links](https://github.com/markerikson/redux-ecosystem-links)是Redux相关库、插件和实用程序的分类集合。
- [Awesome Redux](https://github.com/xgrommx/awesome-redux)是与Redux相关的库的列表。
- [DEV Community](https://dev.to/t/redux)是一个分享Redux项目、文章和教程以及讨论并询问有关Redux问题的地方。 欢迎各种技术水平的开发人员参加。
