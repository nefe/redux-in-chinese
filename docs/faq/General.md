# Redux 常见问题：综合

## 目录

- [何时使用 Redux ？](#general-when-to-use)
- [Redux 只能搭配 React 使用？](#general-only-react)
- [Redux 需要特殊的编译工具支持吗？](#general-build-tools)

## 综合

<a id="general-when-to-use"></a>
### 何时使用 Redux？

React 早期贡献者之一 Pete Hunt 说：

> 你应当清楚何时需要 Flux。如果你不确定是否需要它，那么其实你并不需要它。

Redux 的创建者之一 Dan Abramov 也曾表达过类似的意思:

> 我想修正一个观点：当你在使用 React 遇到问题时，才使用 Redux。

一般而言，如果随着时间的推移，数据处于合理的变动之中、需要一个单一的数据源、在 React 顶层组件 state 中维护所有内容的办法已经无法满足需求，这个时候就需要使用 Redux 了。

在打算使用 Redux 的时候进行权衡是非常重要的。它从设计之初就不是为了编写最短、最快的代码，他是为了解决 “当有确定的状态发生改变时，数据从哪里来” 这种可预测行为的问题的。它要求你在应用程序中遵循特定的约定：应用的状态需要存储为纯数据的格式、用普通的对象描述状态的改变、用不可更新的纯函数式方式来处理状态变化。这也成了抱怨是“样板代码”的来源。这些约束需要开发人员一起来努力维护，但也打开了一扇扇可能的大门（比如：数据持久性、同步）。

如果你只是刚开始学习 React，你应该首先专注于 React，然后再看看 Redux 是否适合于你的应用。

最后需要说明的是：Redux 仅仅是个工具。它是一个伟大的工具，经常有一个很棒的理由去使用它，但也有很多的理由不去使用它。时刻注意对你的工具做出明确的决策，并且权衡每个决策带来的利弊。

#### 补充资料

**文档**

- [Introduction: Motivation](introduction/Motivation.md)

**文章**

- [React How-To](https://github.com/petehunt/react-howto)
- [You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)
- [The Case for Flux](https://medium.com/swlh/the-case-for-flux-379b7d1982c6)

**讨论**

- [Twitter: Don't use Redux until...](https://twitter.com/dan_abramov/status/699241546248536064)
- [Twitter: Redux is designed to be predictable, not concise](https://twitter.com/dan_abramov/status/733742952657342464)
- [Twitter: Redux is useful to eliminate deep prop passing](https://twitter.com/dan_abramov/status/732912085840089088)
- [Stack Overflow: Why use Redux over Facebook Flux？](http://stackoverflow.com/questions/32461229/why-use-redux-over-facebook-flux)
- [Stack Overflow: Why should I use Redux in this example？](http://stackoverflow.com/questions/35675339/why-should-i-use-redux-in-this-example)
- [Stack Overflow: What could be the downsides of using Redux instead of Flux？](http://stackoverflow.com/questions/32021763/what-could-be-the-downsides-of-using-redux-instead-of-flux)
- [Stack Overflow: When should I add Redux to a React app?](http://stackoverflow.com/questions/36631761/when-should-i-add-redux-to-a-react-app)

<a id="general-only-react"></a>
### Redux 只能搭配 React 使用？

Redux 能作为任何 UI 层的 store。通常是与 React 或 React Native 搭配使用，但是也可以绑定 Angular、 Angular 2、 Vue、 Mithril 等框架使用。 Redux 提供的订阅机制，可以与任何代码集成。这就是说，在结合 UI 随 state 变化的声明式视图时（如 React 或者其他相似的库），Redux 就发挥它的最大作用。

<a id="general-build-tools"></a>
### Redux 需要特殊的编译工具支持吗？

Redux 写法遵循 ES6 语法，但在发布时被 Webpack 和 Babel 编译成了 ES5，所以在使用时可以忽略 JavaScript 的编译过程。 Redux 也提供了 UMD 版本，可以直接使用而不需要任何编译过程。[counter-vanilla](https://github.com/reactjs/redux/tree/master/examples/counter-vanilla) 示例用 `<script>` 标签的方式展示了 Redux 基本的 ES5 用法。正如相关 pull request 中的说法：

> Counter Vanilla 例子意图是消除 Redux 需要 Webpack、 React、 热重载、 sagas、 action 创建函数、 constants、 Babel、 npm、 CSS 模块化、 decorators、 fluent Latin、 Egghead subscription、 博士学位或者需要达到 Exceeds Expectations O.W.L. 这一级别的荒谬观点。

> 仅仅是 HTML， 一些 `<script>`  标签，和简单的 DOM 操作而已。

