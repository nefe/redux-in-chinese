# Redux 常见问题：代码结构

## 目录

 - [文件结构应该是什么样？项目中该如何对 action 创建函数和 reducer 分组？ selector 又该放在哪里？](#structure-file-structure)
 - [如何将逻辑在 reducer 和 action 创建函数之间划分？ “业务逻辑” 应该放在哪里？](#structure-business-logic)

## 代码结构

<a id="structure-file-structure"></a>
### 文件结构应该是什么样？项目中该如何对 action 创建函数和 reducer 分组？ selector 又该放在哪里？

因为 Redux 只是数据存储的库，它没有关于工程应该被如何组织的直接主张。然后，有一些被大多数 Redux 开发者所推荐的模式：

- Rails-style：“actions”、“constants”、“reducers”、“containers” 以及 “components” 分属不同的文件夹
- Domain-style：为每个功能或者域创建单独的文件夹，可能会为某些文件类型创建子文件夹
- “Ducks”：类似于 Domain-style，但是明确地将 action、 reducer 绑定在一起，通常将它们定义在同一文件内。

推荐做法是将 selector 与 reducer 定义在一起并输出，并在 reducer 文件中与知道 state 树真实形状的代码一起被重用（例如在 `mapStateToProps` 方法、异步 action 创建函数，或者 saga）。

不管代码在你的磁盘上是如何存放的，必须记住的是 action 和 reducer 不应该单独考虑。在一个文件夹中定义的 reducer 可以响应另一个文件夹中定义的 action 是非常常见的（甚至是鼓励的）。

#### 补充资料

**文档**

- [FAQ: Actions - "1:1 mapping between reducers and actions?"](/docs/faq/Actions.md#actions-reducer-mappings)

**文章**

- [How to Scale React Applications](https://www.smashingmagazine.com/2016/09/how-to-scale-react-applications/)(accompanying talk:[Scaling React Applications](https://vimeo.com/168648012))
- [Redux Best Practices](https://medium.com/lexical-labs-engineering/redux-best-practices-64d59775802e)
- [Rules For Structuring (Redux) Applications ](http://jaysoo.ca/2016/02/28/organizing-redux-application/)
- [A Better File Structure for React/Redux Applications](http://marmelab.com/blog/2015/12/17/react-directory-structure.html)
- [Organizing Large React Applications](http://engineering.kapost.com/2016/01/organizing-large-react-applications/)
- [Four Strategies for Organizing Code](https://medium.com/@msandin/strategies-for-organizing-code-2c9d690b6f33)
- [Encapsulating the Redux State Tree](http://randycoulman.com/blog/2016/09/13/encapsulating-the-redux-state-tree/)
- [Redux Reducer/Selector Asymmetry](http://randycoulman.com/blog/2016/09/20/redux-reducer-selector-asymmetry/)
- [Modular Reducers and Selectors](http://randycoulman.com/blog/2016/09/27/modular-reducers-and-selectors/)
- [My journey towards a maintainable project structure for React/Redux](https://medium.com/@mmazzarolo/my-journey-toward-a-maintainable-project-structure-for-react-redux-b05dfd999b5)
- [React/Redux Links: Architecture - Project File Structure](https://github.com/markerikson/react-redux-links/blob/master/react-redux-architecture.md#project-file-structure)

**讨论**

- [#839: Emphasize defining selectors alongside reducers](https://github.com/reactjs/redux/issues/839)
- [#943: Reducer querying](https://github.com/reactjs/redux/issues/943)
- [React Boilerplate #27: Application Structure](https://github.com/mxstbr/react-boilerplate/issues/27)
- [Stack Overflow: How to structure Redux components/containers](http://stackoverflow.com/questions/32634320/how-to-structure-redux-components-containers/32921576)
- [Twitter: There is no ultimate file structure for Redux](https://twitter.com/dan_abramov/status/783428282666614784)

<a id="structure-business-logic"></a>
### 如何将逻辑在 reducer 和 action 创建函数之间划分？ “业务逻辑” 应该放在哪里？

关于逻辑的哪个部分应该放在 reducer 或者 action 创建函数中，没有清晰的答案。一些开发者喜欢 “fat” action 创建函数，“thin” reducer 仅仅从 action 拿到数据并绑定到 state 树。其他人的则强调 action 越简单越好，尽量减少在 action 创建函数中使用 `getState()` 方法。

下面的评论恰如其分的概括了这两种分歧：

> 问题是什么在 action 创建函数中、什么在 reducer 中，就是关于 fat 和 thin action 创建函数的选择。如果你将逻辑都放在 action 创建函数中，最终用于更新 state 的 action 对象就会变得 fat，相应的 reducer 就变得纯净、简洁。因为只涉及很少的业务逻辑，将非常有利于组合。
> 如果你将大部分逻辑置于 reducer 之中，action 将变得精简、美观，大部分数据逻辑都在一个地方维护，但是 reducer 由于引用了其它分支的信息，将很难组合。最终的 reducer 会很庞大，而且需要从更高层的 state 获取额外信息。

当你从这两种极端情况中找到一个平衡时，就意味着你已经掌握了 Redux。

#### 补充资料

**文章**

- [Where do I put my business logic in a React/Redux application?](https://medium.com/@jeffbski/where-do-i-put-my-business-logic-in-a-react-redux-application-9253ef91ce1)
- [How to Scale React Applications](https://www.smashingmagazine.com/2016/09/how-to-scale-react-applications/)

**讨论**

- [#1165: Where to put business logic / validation？](https://github.com/reactjs/redux/issues/1165)
- [#1171: Recommendations for best practices regarding action-creators, reducers, and selectors](https://github.com/reactjs/redux/issues/1171 )
- [Stack Overflow: Accessing Redux state in an action creator？](http://stackoverflow.com/questions/35667249/accessing-redux-state-in-an-action-creator/35674575)
