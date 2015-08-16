# 动机

随着 JavaScript 单页应用开发日趋复杂，**JavaScript 需要管理比以何任何时候都多的 state。** 这些 state 包括服务器响应，缓存数据，本地生成尚未持久化到服务器的数据。还包括 UI 状态，如激活的路由，选中的标签，是否显示加载动画或者分页器等等。

管理不断变化的 state 非常难。如果一个 model 的变化会引起另一个 model 变化，那么一个 view 变化就可能引起其它 model 变化的 model 的变化，依次地，可能会引起另一个 view 的变化... 直至你搞不清楚到底发生了什么。**state 什么时候，为什么，如何变化已不受控制。** 当系统变得不透明盘根错节的时候，想重现问题，添加新功能变得举步维艰。

如果这还不够糟糕，考虑一些**前端开发领域比比皆是的需求**，如更新调优，服务端渲染，路由跳转前请求数据等等。我们前端开发者正在经受前所未有的复杂性。[是否应该放弃？](http://www.quirksmode.org/blog/archives/2015/07/stop_pushing_th.html)

这里的复杂性很大程度上来自于：**两大人类难以理解的概念困扰着我们：变化和异步。** 我称它们为[Mentos and Coke](https://en.wikipedia.org/wiki/Diet_Coke_and_Mentos_eruption)。如果把二都分开，能做的很好，但混到一起，就变得一团糟。一些库如 [React](http://facebook.github.io/react) 试图在视图层禁止异步和直接 DOM 操作来解决这个问题。美中不足的是，React 把处理 state 里数据的问题又留给了你自己。

跟随 [Flux](http://facebook.github.io/flux)、[CQRS](http://martinfowler.com/bliki/CQRS.html) 和 [Event Sourcing](http://martinfowler.com/eaaDev/EventSourcing.html) 的脚步，通过限制更新发生的时间和方式，**Redux 试图让 state 的变化变得可预测。**这些限制反映在 Redux 的 [三大原则](ThreePrinciples.md)中。