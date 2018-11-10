# 下一步

如果你学到了这一章，你也许会想：接下来我该干什么？下面我们会为你提供一些建议，教你如何从 todo 级别的应用过度到真实世界中的项目。

## 实际项目中的建议和考虑

每当我们决定要建立一个新项目时，我们总是很容易忽略一些问题，这些问题在未来有可能影响性能。而在实际项目的开发之前我们必须把一些事情决策清楚，比如说：如何配置 `store`、`store` 的大小、数据结构、state 模型、中间件（middleware）、环境、异步操作、不可变性......，等等。

上面提及的这些决定是需要我们事先想清楚的。虽然任务艰巨，但实施一些策略可以让决策更加顺利。

### UI vs State

使用 Redux 时，开发者面临的最大挑战之一就是**用数据描述 UI**。大多数软件都是数据（data）换了一种形式的呈现。而且你要知道，UI 只不过是数据用一种漂亮的方式的呈现。理解了这一点，你构建应用时就会得心应手。

在 “[Describing UI state with data](http://nicolashery.com/describing-ui-state-with-data/)” 一文中 **Nicolas Hery** 把这个道理阐释得很好。而且你应该知道 **[在何时使用 Redux](https://medium.com/@fastphrase/when-to-use-redux-f0aa70b5b1e2)**，因为很多时候 **[你并不需要 Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)**

### 配置 Store

配置 `store` 时我们需要决定使用哪些 middleware。关于这点有很多库，其中最受欢迎的有：

#### 异步 dispatch

- [redux-thunk](https://github.com/gaearon/redux-thunk)
  - Redux Thunk middleware 允许你编写返回一个函数的 action creator，而不再返回 action。Thunk 可被用于推迟一个 action 的 dispatch，或者只在特定条件满足时 dispatch。它会将 `dispatch` 和 `getState` 作为参数传递。
- [redux-saga](https://github.com/redux-saga/redux-saga)
  - redux-saga 是一个库旨在让应用的“副作用”的执行更方便高效，例如异步访问数据或读取浏览器缓存这样的不纯操作。同时 redux-saga 很易于测试，因为它使用了 ES6 `generators` 特性，让代码流看起来像同步代码一样方便阅读。
- [redux-observable](https://github.com/redux-observable/redux-observable)
  - redux-observable 是一个 redux middleware，它受 redux-thunk 启发。开发者使用它可以 dispatch 一个函数，这个函数可以返回 `Observable`，`Promise`，或 `iterable` 对象。当 observable 对象发出（emit）一个 action，或 promise 对象 resolve 了一个 action，或 iterable 返回了一个对象时，这个对象才会像平时一样被 dispatch。

#### 开发环境 / 调试

- [redux-devtools](https://github.com/reduxjs/redux-devtools)
  - Redux DevTools 是一系列帮助你开发 Redux 的工具。
- [redux-logger](https://github.com/evgenyrodionov/redux-logger)
  - redux-logger 会记录下所有 dispatch 到 store 的所有 action。

要决定选择什么库，我们需要考虑应用的规模。同时也要考虑可用性，代码规范，以及对 Javascript 的熟练程度。选择的原则大同小异。

**小提示**：把 middleware 想象为赋予 `store` 的各种**技能**。例如：给 store 添加 `redux-thunk`，相当于 store 拥有了 dispatch 异步 action 的技能。

### 命名规范

在一个大项目中，命名会带来巨大的困惑，通常命名和写代码一样重要。在项目刚刚开始时，最好制定一套 action 的命名规范，并在之后的开发中严格遵守。当项目范围逐渐增大时，这将非常有助于你的代码的扩张。

非常好的文章：
[A Simple Naming Convention for Action Creators in Redux](https://decembersoft.com/posts/a-simple-naming-convention-for-action-creators-in-redux-js/) 
和 
[Redux Patterns and Anti-Patterns](https://tech.affirm.com/redux-patterns-and-anti-patterns-7d80ef3d53bc)

**小提示**：使用一个代码格式化工具，比如 [Prettier](https://github.com/prettier/prettier)。

### 扩容性

没有一种方法可以分析和预测你的项目会增长到什么程度，但没关系！因为 Redux 简洁的设计打下了坚实的基础，它可以在项目增长的过程中自适应。下面的一些文章介绍了一些方法，可以让你以优雅的姿势编写应用：

- [Taming Large React Applications with Redux](http://slides.com/joelkanzelmeyer/taming-large-redux-apps#/)
- [Real-World React and Redux - part l](https://dzone.com/articles/real-world-reactjs-and-redux-part-1)
- [Real-World React and Redux - part ll](https://dzone.com/articles/real-world-reactjs-and-redux-part-2)
- [Redux: Architecting and scaling a new web app at the NY Times](https://www.youtube.com/watch?v=lI3IcjFg9Wk)

**小提示**：在动手之前确实应该做好计划，但也不要陷入[“纸上谈兵”](https://en.wikipedia.org/wiki/Analysis_paralysis)。毕竟“做完”比“完美做完”更好，而且如果需要的话，[Redux 的重构起来很容易](https://blog.boldlisting.com/so-youve-screwed-up-your-redux-store-or-why-redux-makes-refactoring-easy-400e19606c71)


总之，最好的实践永远是 keep coding and learning。参与 [issues](https://github.com/reduxjs/redux/issues) 和 [StackOverFlow questions](https://stackoverflow.com/questions/tagged/redux) 的讨论也是一种精通 Redux 的好办法。

**小提示**：@markerikson 在 [react-redux-links](https://github.com/markerikson/react-redux-links) 中分享了更多最佳实践和 Redux 架构。