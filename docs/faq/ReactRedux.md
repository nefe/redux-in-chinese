---
id: react-redux
title: React Redux
sidebar_label: React Redux
---

# Redux 常见问答：React Redux

## 目录

- [Redux 常见问答：React Redux](#redux-faq-react-redux)
  - [目录](#table-of-contents)
  - [React Redux](#react-redux)
    - [为什么应该使用 React-Redux？](#why-should-i-use-react-redux)
      - [更多信息](#further-information)
    - [为什么我的组件没有重新渲染，或者 mapStateToProps 没有运行？](#why-isnt-my-component-re-rendering-or-my-mapstatetoprops-running)
      - [更多信息](#further-information-1)
    - [为什么我的组件经常重新渲染？](#why-is-my-component-re-rendering-too-often)
      - [更多信息](#further-information-2)
    - [如何加速 `mapStateToProps`？](#how-can-i-speed-up-my-mapstatetoprops)
      - [更多信息](#further-information-3)
    - [为什么 connected 组件中没有 this.props.dispatch 可用？](#why-dont-i-have-thispropsdispatch-available-in-my-connected-component)
      - [更多信息](#further-information-4)
    - [应该只 connect 顶层组件，还是可以 connect 树中的多个组件？](#should-i-only-connect-my-top-component-or-can-i-connect-multiple-components-in-my-tree)
      - [更多信息](#further-information-5)
    - [Redux 与 React Context API 相比如何？](#how-does-redux-compare-to-the-react-context-api)
      - [更多信息](#further-information-6)

## React Redux

### 为什么应该使用 React-Redux？

Redux 本身是一个独立的库，可以与任何 UI 层或框架一起使用，包括 React、Angular、Vue、Ember 和 vanilla JS。虽然 Redux 和 React 通常一起使用，但它们是相互独立的。

Redux 与任何类型的 UI 框架一起使用时，通常会使用 “UI 绑定”库将 Redux 与 UI 框架绑定在一起，而不是直接在 UI 代码里与 store 进行交互。

**React-Redux 是 React 的官方 Redux UI 绑定库**。如果想要同时使用 Redux 和 React，你也应该使用 React-Redux 来绑定这两个库。

虽然可以手动编写 Redux store 的订阅逻辑，但这样做会有很多重复工作。此外，优化 UI 性能包含复杂的逻辑。

订阅 store、检查更新数据和触发重新渲染的过程可以变得更加通用和可复用。**像 React-Redux 这样的 UI 绑定库会处理 store 的交互逻辑，因此你不必手动编写该代码。**

总体而言，React-Redux 鼓励良好的 React 架构，并为你实现复杂的性能优化。它还与来自 Redux 和 React 的最新 API 更改保持同步。

#### 更多信息

**文档**

- **[React-Redux 文档：为什么使用 React-Redux？](https://react-redux.js.org/introduction/why-use-react-redux)**

### 为什么我的组件没有重新渲染，或者 mapStateToProps 没有运行？

到目前为止，意外地直接改变或修改 state 是组件在 dispatch action 后不重新渲染的最常见原因。Redux 期望 reducer “不可变地”更新 state，这实际上意味着始终制作数据副本，并将更改应用于副本。如果你从 reducer 返回相同的对象，Redux 会假设没有任何改变，即使你改变了它的内容。类似地，React Redux 尝试通过对 `shouldComponentUpdate` 中的传入 props 进行浅对比检查来提高性能，如果所有引用都相同，则 `shouldComponentUpdate` 返回 `false` 以跳过实际更新原始组件的步骤。

重点要记住，每当你更新嵌套值时，还必须在 state 树中返回它所有的上层内容的新副本。比如你有 `state.a.b.c.d`，并且想要更新 `d`，还需要返回 `c`、`b`、`a` 和 `state` 的新副本。这个 [state 树突变图](http://arqex.com/wp-content/uploads/2015/02/trees.png)演示了树深处的变化如何需要一直向上变化。

请注意，“不可变地更新数据” _并不_ 意味着你必须使用 [Immer](https://github.com/immerjs/immer)，尽管这当然是一种选择。你可以使用几种不同的方法对普通 JS 对象和数组进行不可变更新：

- 使用 `Object.assign()` 或 `_.extend()` 等函数以及 `slice()` 和 `concat()` 等数组函数来复制对象
- ES6 中的数组扩展运算符，以及未来版本的 JavaScript 提出的对象扩展运算符
- 将不可变更新逻辑包装成更简单函数的实用程序库

#### 更多信息

**文档**

- [故障排除](../usage/Troubleshooting.md)
- [React Redux：故障排除](https://react-redux.js.org/troubleshooting)
- [Redux 使用指南：结构化 Reducers——预置知识](../usage/structuring-reducers/PrerequisiteConcepts.md)
- [Redux 使用指南：结构化 Reducers——不可变更新模式](../usage/structuring-reducers/ImmutableUpdatePatterns.md)

**文献**

- [在 React 中使用不变性的优缺点](https://reactkungfu.com/2015/08/pros-and-cons-of-using-immutability-with-react-js/)
- [React/Redux 链接：不可变数据](https://github.com/markerikson/react-redux-links/blob/master/immutable-data.md)

**讨论**

- [#1262：不可变数据 + 糟糕的性能](https://github.com/reduxjs/redux/issues/1262)
- [React Redux #235：更新组件的判断函数](https://github.com/reduxjs/react-redux/issues/235)
- [React Redux #291：是否应该在每次 dispatch action 时调用 mapStateToProps？](https://github.com/reduxjs/react-redux/issues/291)
- [Stack Overflow：在 Redux 中更新嵌套 state 的更简洁/更短的方法是什么？](https://stackoverflow.com/questions/35592078/cleaner-shorter-way-to-update-nested-state-in-redux)
- [要点：state 突变](https://gist.github.com/amcdnl/7d93c0c67a9a44fe5761#gistcomment-1706579)

### 为什么我的组件经常重新渲染？

React Redux 实现了多项优化，以确保组件仅在实际需要时重新渲染。其中之一是对传递给 `connect` 的 `mapStateToProps` 和 `mapDispatchToProps` 参数生成的组合 props 对象进行浅层相等检查。不幸的是，在每次调用 mapStateToProps 时都会创建新的数组或对象实例的情况下，浅层相等检查是没有用的。一个典型的例子是映射一个 ID 数组并返回匹配的对象引用，例如：

```js
const mapStateToProps = state => {
  return {
    objects: state.objectIds.map(id => state.objects[id])
  }
}
```

虽然数组可能每次都包含完全相同的对象引用，但数组本身是不同的引用，因此浅层相等检查失败，React Redux 将重新渲染包装的组件。

额外的重新渲染可以通过使用 reducer 将对象数组保存到 state 中、使用 [Reselect](https://github.com/reduxjs/reselect) 缓存映射数组或手动在组件中实现 `shouldComponentUpdate`，并使用诸如 `_.isEqual` 之类的函数进行更深入的 props 比较。注意不要让你的自定义 `shouldComponentUpdate()` 比渲染本身代价更大！始终使用分析器来检查你对性能的预期。

对于未连接的组件，你可能需要检查传入的 props 的内容。一个常见的问题是父组件在其渲染函数中重新绑定回调，例如 `<Child onClick={this.handleClick.bind(this)} />`。每次父级重新渲染时，都会创建一个新的函数引用。更好的做法是仅在父组件的构造函数中绑定一次回调。

#### 更多信息

**文档**

- [常见问答：性能——扩展](./Performance.md#performance-scaling)

**文献**

- [深入研究 React Perf 调试](https://benchling.engineering/a-deep-dive-into-react-perf-debugging-fd2063f5a667)
- [React.js 纯渲染性能反模式](https://medium.com/@esamatti/react-js-pure-render-performance-anti-pattern-fb88c101332f)
- [使用 Reselect 提高 React 和 Redux 性能](https://rangle.io/blog/react-and-redux-performance-with-reselect/)
- [封装 Redux State 树](https://randycoulman.com/blog/2016/09/13/encapsulating-the-redux-state-tree/)
- [React/Redux 链接：React/Redux 性能](https://github.com/markerikson/react-redux-links/blob/master/react-performance.md)

**讨论**

- [Stack Overflow：React Redux 应用程序可以像 Backbone 一样扩展吗？](https://stackoverflow.com/questions/34782249/can-a-react-redux-app-really-scale-as-well-as-say-backbone-even-with-reselect)

**相关库**

- [Redux 插件目录：DevTools——组件更新监控](https://github.com/markerikson/redux-ecosystem-links/blob/master/devtools.md#component-update-monitoring)

### 如何加速 `mapStateToProps`？

虽然 React Redux 确实可以最大限度地减少调用 `mapStateToProps` 函数的次数，但确保 `mapStateToProps` 快速运行并最大限度地减少它所做的工作量仍然是一个很好的做法。常用的推荐方法是使用 [Reselect](https://github.com/reduxjs/reselect) 创建记忆化的 “selector” 函数。这些 selectors 可以组合在一起，并且后续在管道中的 selectors 只有在它们的输入发生变化时才会运行。这意味着你可以创建执行过滤或排序等操作的 selectors，并确保它们仅在需要时才会实际工作。

#### 更多信息

**文档**

- [Redux 使用指南：使用 Selectors 派生数据](../usage/deriving-data-selectors.md)

**文献**

- [使用 Reselect 提高 React 和 Redux 性能](https://rangle.io/blog/react-and-redux-performance-with-reselect/)

**讨论**

- [#815：使用数据结构](https://github.com/reduxjs/redux/issues/815)
- [Reselect #47：记忆化分层结构的 Selectors](https://github.com/reduxjs/reselect/issues/47)

### 为什么 connected 组件中没有 this.props.dispatch 可用？

`connect()` 函数有两个主要参数，都是可选的。第一个参数，`mapStateToProps`，是你提供的一个函数，用于在 store 发生变化时从 store 中提取数据，并将这些值作为 props 传递给你的组件。第二个参数，`mapDispatchToProps`，也是你提供的一个函数，用于使用 store 的 `dispatch` 函数，通常通过创建 action creators 的预绑定版本，一旦它们被调用就会自动 dispatch  actions。

如果你在调用 `connect()` 时没有提供 `mapDispatchToProps` 函数，React Redux 将提供一个默认版本，它只是简单地返回 `dispatch` 函数作为 props。这意味着如果你 _确实_ 提供了你自己的函数，`dispatch` _就不会_ 自动提供。如果你仍然希望它作为 prop 可用，则需要在 `mapDispatchToProps` 函数实现中显式返回它。

#### 更多信息

**文档**

- [React Redux API：connect()](https://react-redux.js.org/api/connect)

**讨论**

- [React Redux #89：可以将多个 actionCreators 包装到一个具名的 props 中吗？](https://github.com/reduxjs/react-redux/issues/89)
- [React Redux #145：无论 mapDispatchToProps 做什么，都考虑始终传递 dispatch](https://github.com/reduxjs/react-redux/issues/145)
- [React Redux #255：如果使用 mapDispatchToProps，则 this.props.dispatch 为 undefined](https://github.com/reduxjs/react-redux/issues/255)
- [Stack Overflow：如何使用带 Redux 的连接从 this.props 获得简单的 dispatch？](https://stackoverflow.com/questions/34458261/how-to-get-simple-dispatch-from-this-props-using-connect-w-redux/34458710])

### 应该只 connect 顶层组件，还是可以 connect 树中的多个组件？

早期的 Redux 文档建议在组件树的顶层附近只应该有几个 connected 的组件。但是，时间和经验表明，这样的组件架构一般需要少数几个组件额外地了解其所有后代的数据需求，并迫使它们传递大量令人困惑的 props。

当前建议的最佳实践是将你的组件分类为 “UI 组件”或“容器组件”，并在任何有意义的地方提取 connected 的容器组件：

> 在 Redux 示例中强调“一个容器组件在顶层”是错误的做法。但不要把这当作格言。尝试将你的 UI 组件分开。在适宜的时机通过 connect 它们来创建容器组件。每当你觉得需要在父组件中复制代码来为相同类型的子组件提供数据时，此时就是提取一个容器的好时机。通常，一旦你觉得“父母”对“个体”数据或其子女的行为了解太多的时候，就该提取容器了。

事实上，基准测试表明，更多的 connect 组件通常比更少的 connect 组件带来更好的性能。

总而言之，尝试在可理解的数据流和组件的责任范围之间找到平衡。

#### 更多信息

**文档**

- [Redux 深入浅出：UI 和 React](../tutorials/fundamentals/part-5-ui-and-react.md)
- [常见问答：性能——扩展](../faq/Performance.md#performance-scaling)

**文献**

- [UI 和容器组件](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
- [高性能 Redux](https://somebody32.github.io/high-performance-redux/)
- [React/Redux 链接：架构——Redux 架构](https://github.com/markerikson/react-redux-links/blob/master/react-redux-architecture.md#redux-architecture)
- [React/Redux 链接：性能——Redux 性能](https://github.com/markerikson/react-redux-links/blob/master/react-performance.md#redux-performance)

**讨论**

- [Twitter：强调“一个容器”是错误的](https://twitter.com/dan_abramov/status/668585589609005056)
- [#419：推荐使用 connect](https://github.com/reduxjs/redux/issues/419)
- [#756：容器 vs 组件？](https://github.com/reduxjs/redux/issues/756)
- [#1176：只有无状态组件的 Redux+React](https://github.com/reduxjs/redux/issues/1176)
- [Stack Overflow：dumb 组件可以使用 Redux 容器吗？](https://stackoverflow.com/questions/34992247/can-a-dumb-component-use-render-redux-container-component)

### Redux 与 React Context API 相比如何？

**相似之处**

Redux 以及 React 的 Context API 都用于处理 “prop 透传”。也就是说，它们都允许你传递数据，而无需通过多层组件传递 props。Redux 内部 _使用_ React 的 context API，以允许它沿着组件树传递 store。

**差异**

使用 Redux，你可以获得 [Redux Dev Tools 扩展](https://github.com/reduxjs/redux-devtools/tree/main/extension)的强大功能。它会自动记录应用程序执行的每个 action，并支持时间旅行——你可以单击任何过去的 action 并跳转到该时间点。Redux 还支持 middleware 的概念，你可以在每个 action dispatch 上绑定自定义函数调用。此类示例包括自动事件记录器、拦截某些 actions 等。

使用 React 的 Context API，你可以处理一对只相互通信的组件。这样可以很好地隔离不相关的数据。你还可以灵活地使用组件中的数据，即，你可以提供父组件的 state，并且可以将上下文数据作为 props 传递给包装的组件。

Redux 和 React 的 Context 处理数据的方式有一个关键的区别。Redux 将整个应用程序的数据保存在一个巨大的、有状态的对象中。它通过运行你提供的 reducer 函数来推断数据的变化，并返回与 dispatch 的每个 action 相对应的下一个 state。React Redux 接着优化组件渲染，并确保每个组件仅在其需要的数据发生变化时重新渲染。另一方面，context 不包含任何 state，它只是数据的管道。要体现数据的变化，你需要依赖父组件的 state。

#### 更多信息

- [何时（何时不）使用 Redux](https://changelog.com/posts/when-and-when-not-to-reach-for-redux)
- [Redux 与 React Context API](https://daveceddia.com/context-api-vs-redux/)
- [你可能不需要 Redux（但你不能用 Hooks 代替它）](https://www.simplethread.com/cant-replace-redux-with-hooks/)
