---
id: motivation
title: 动机
description: '原理 > 动机: Redux 到底解决什么问题？'
sidebar_label: '动机'
hide_title: false
---

# 动机

随着 JavaScript 单页应用开发日趋复杂，**我们的编码要管理的 state（状态）比以往任何时候都要多**。 这些 state 可能包括服务器响应、缓存数据、本地生成尚未持久化到服务器的数据，也包括 UI 状态，如激活的路由，被选中的标签，是否显示加载动效或者分页器等等。

管理不断变化的 state 非常困难。如果一个 model 的变化会引起另一个 model 变化，那么当 view 变化时，就可能引起对应 model 以及另一个 model 的变化，这个变化反过来又可能引起另一个 view 的变化。当这些连锁反应到一定程度之后，你根本搞不清楚到底发生了什么。**state 在什么时候，由于什么原因，如何变化已然不受控制。** 当系统变得错综复杂的时候，想重现问题或者添加新功能就会变得举步维艰。

如果以上还不够糟糕，那想想**前端开发领域里变得越来越普遍的新需求**。作为一名前端开发者，我们可能要最优化更新、服务端渲染，在路由变化之前请求到数据等等。我们要掌管以前从未有过的复杂工作，难免会问一句：[是时候放弃了吗？](https://www.quirksmode.org/blog/archives/2015/07/stop_pushing_th.html) 答案当然是否定的。

复杂度很难降下来，因为 **我们总是混淆了两个概念**，这两个概念对我们来说很难理解：**Mutation 和异步**。我把它们比作[曼妥思和可乐](https://en.wikipedia.org/wiki/Diet_Coke_and_Mentos_eruption)。两者如果分开都是极好的，但是混在一起就是一团糟。有一些库，比如[React](https://facebook.github.io/react) 尝试在视图层面通过禁止异步操作和直接的 DOM 操作来解决这个问题。但美中不足的是 React 把 state 管理这件事情交给了开发者自己，这就是 Redux 的用武之地。

跟随 [Flux](https://facebook.github.io/flux)、[CQRS](https://martinfowler.com/bliki/CQRS.html) 和 [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html) 的脚步，通过限制更新操作的发生时间和方式，**Redux 试图让 state 的变化变得可预测**。这些限制条件体现在 Redux 的[三大原则](ThreePrinciples.md)中。
