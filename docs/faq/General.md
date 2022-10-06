---
id: general
title: General
hide_title: false
---

# Redux FAQ: 通用的

## 我应该什么时候学习 Redux？

对于 JavaScript 开发人员来说，学习什么可能是一个压倒性的问题。可以通过你在工作中发现的问题并专注于一次学习一种知识来缩小选择范围。Redux 是一种用于管理应用程序状态的模式。 如果你在状态管理方面没有问题，你可能对于 Redux 的好处更难理解。一些 UI 库（如 React）有自己的状态管理系统。 如果你正在使用其中一个库，特别是如果刚刚学习使用它们，我们鼓励你首先了解该内置系统的功能。 这可能是你构建应用程序所需的全部内容。 如果你的应用程序变得很复杂以至于你对状态存储在哪里或状态如何变化感到困惑，那么现在是学习 Redux 的好时机。

:::tip

**我们建议大多数新学习者应该先专注于学习 React，等到熟悉 React 后再学习 Redux**。 这样，一次学习的新概念就更少了，并且更清楚哪些概念是 React 的一部分，哪些概念是 Redux 的一部分。 你还将更好地了解如何将 Redux 用于 React 应用程序，以及 Redux 为何有用。

:::

#### 更多信息

**文章**

- [决定不学什么](https://gedd.ski/post/what-not-to-learn/)
- [如何学习网络框架](https://ux.shopify.com/how-to-learn-web-frameworks-9d447cb71e68)
- [Redux vs MobX vs Flux vs... 你甚至需要那个吗？](https://goshakkk.name/redux-vs-mobx-vs-flux-etoomanychoices/)

**讨论**

- [Ask HN: 学习前端不知所措，我该如何进行？](https://news.ycombinator.com/item?id=12882816)
- [Twitter: 如果你想教某人使用抽象...](https://twitter.com/acemarke/status/901329101088215044)
- [Twitter: 以前从来没有打算学过...](https://twitter.com/dan_abramov/status/739961787295117312)
- [Twitter: 在 React 之前学习 Redux？](https://twitter.com/dan_abramov/status/739962098030137344)
- [Twitter: 我第一次使用 React 时，人们告诉我需要 Redux ......](https://twitter.com/raquelxmoss/status/901576285020856320)
- [Twitter: 这是我对 Redux 的体验...](https://twitter.com/garetmckinley/status/901500556568645634)
- [Dev.to: 什么时候可以使用 Redux？](https://dev.to/dan_abramov/comment/1n2k)

## 我什么时候应该使用 Redux？

**并非所有应用都需要 Redux。 了解你正在构建的应用程序类型、需要解决的问题类型以及哪些工具可以最好地解决你面临的问题非常重要。**

Redux 可帮助你处理共享状态管理，但与任何工具一样，它也需要权衡取舍。它并非旨在成为编写代码的最短或最快方式。它旨在通过可预测的行为来帮助回答“某部分状态何时发生变化，数据来自何处？”的问题。有更多的概念要学习，也有更多的代码要编写。 它还为你的代码添加了一些间接性，并要求你遵循某些限制。这是短期和长期生产力之间的权衡。

正如 React 的早期贡献者之一 Pete Hunt 所说：

> 你会知道何时需要 Flux。 如果你不确定你是否需要它，你就不需要它。

同样，Redux 的创建者之一 Dan Abramov 说：

> 我想修正这一点：在你对 vanilla React 有问题之前不要使用 Redux。

**Redux 在以下情况下最有用**：

- 你在应用程序的许多地方都需要大量的应用程序状态
- 应用状态更新频繁
- 更新该状态的逻辑可能很复杂
- 该应用程序有一个中型或大型的代码库，并且可能由许多人开发
- 你需要查看该状态如何随着时间的推移而更新

还有许多其他工具可以帮助解决 Redux 遇到的一些相同问题：状态管理、缓存获取的服务器数据以及通过 UI 传递数据。

:::info

如果你不确定 Redux 是否适合你的应用程序，这些资源会提供更多指导：

- **[何时（以及何时不）接触 Redux](https://changelog.com/posts/when-and-when-not-to-reach-for-redux)**
- **[Redux 之道, 第 1 部分 - 实现和意图](https://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-1/)**
- **[你或许不需要 Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)**

:::

归根结底，Redux 只是一个工具。它是一个很棒的工具，使用它有一些很好的理由，但也有一些你可能不想使用它的理由。对你的工具做出明智的决策，并了解每个决策中涉及的权衡。

#### 更多信息

**文档**

- [Redux 中的思考: 动机](../understanding/thinking-in-redux/Motivation.md)

**文章**

- **[何时（以及何时不）接触 Redux](https://changelog.com/posts/when-and-when-not-to-reach-for-redux)**
- **[Redux 之道, 第 1 部分 - 实现和意图](https://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-1/)**
- [你或许不需要 Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)
- [Flux 示例](https://medium.com/swlh/the-case-for-flux-379b7d1982c6)

**讨论**

- [Twitter: 不要用 Redux 除非...](https://twitter.com/dan_abramov/status/699241546248536064)
- [Twitter: Redux 的设计是可预测的，而不是简洁的](https://twitter.com/dan_abramov/status/733742952657342464)
- [Twitter: Redux 对于消除深度 prop 传递很有用](https://twitter.com/dan_abramov/status/732912085840089088)
- [Twitter: 除非你对本地组件 state 不满意，否则不要使用 Redux](https://twitter.com/dan_abramov/status/725089243836588032)
- [Twitter: 如果你的数据从不改变，你就不需要 Redux](https://twitter.com/dan_abramov/status/737036433215610880)
- [Twitter: 如果你的 reducer 看起来很单调，不要使用 redux](https://twitter.com/dan_abramov/status/802564042648944642)
- [Reddit: 如果你的应用只是在单个页面上获取某些内容，则不需要 Redux](https://www.reddit.com/r/reactjs/comments/5exfea/feedback_on_my_first_redux_app/dagglqp/)
- [Stack Overflow: 为什么使用 Redux 而不是 Facebook Flux？](https://stackoverflow.com/questions/32461229/why-use-redux-over-facebook-flux)
- [Stack Overflow: 为什么我应该在这个例子中使用 Redux？](https://stackoverflow.com/questions/35675339/why-should-i-use-redux-in-this-example)
- [Stack Overflow: 使用 Redux 而不是 Flux 的缺点是什么？](https://stackoverflow.com/questions/32021763/what-could-be-the-downsides-of-using-redux-instead-of-flux)
- [Stack Overflow: 我应该何时将 Redux 添加到 React 应用程序？](https://stackoverflow.com/questions/36631761/when-should-i-add-redux-to-a-react-app)
- [Stack Overflow: Redux 与普通 React？](https://stackoverflow.com/questions/39260769/redux-vs-plain-react/39261546#39261546)
- [Twitter: Redux 是一个供开发人员使用可重用事物构建自定义状态管理的平台](https://twitter.com/acemarke/status/793862722253447168)

## Redux 只能与 React 一起使用吗？

Redux 可以用作任何 UI 层的数据存储。 最常见的用法是使用 React 和 React Native，但也有适用于 Angular、Angular 2、Vue、Mithril 等的绑定。 Redux 只是提供了一种订阅机制，任何其他代码都可以使用它。也就是说，当与可以从状态更改推断 UI 更新的声明性视图库结合使用时，它是最有用的，例如 React 或可用的类似库之一。

## 我是否需要特定的构建工具才能使用 Redux？

Redux 最初是用 ES6 编写的，并使用 Webpack 和 Babel 转译为 ES5 以用于生产。 无论你的 JavaScript 构建过程如何，你都应该能够使用它。 Redux 还提供了一个 UMD 构建，可以直接使用，而无需任何构建过程。 [counter-vanilla](https://github.com/reduxjs/redux/tree/master/examples/counter-vanilla) 示例演示了基本的 ES5 用法，其中 Redux 包含在 `<script>` 标记中。 正如相关的拉取请求所说：

> 新的 Counter Vanilla 示例旨在消除 Redux 需要 Webpack、React、热重载、sagas、动作创建者、常量、Babel、npm、CSS 模块、装饰器、流利的拉丁语、Egghead 订阅、PhD 或 超出预期 O.W.L. 等级。
>
> 不，它只是 HTML、一些手工的 `<script>` 标签和简单的旧 DOM 操作。 享受它吧！
