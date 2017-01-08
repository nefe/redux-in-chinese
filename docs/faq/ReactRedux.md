# Redux 常见问题：React Redux

## 目录

- [为何组件没有被重新渲染、或者 mapStateToProps 没有运行？](#react-not-rerendering)
- [为何组件频繁的重新渲染？](#react-rendering-too-often)
- [怎样使 mapStateToProps 执行更快？](#react-mapstate-speed)
- [为何不在被连接的组件中使用 this.props.dispatch ？](#react-props-dispatch)
- [应该只连接到顶层组件吗，或者可以在组件树中连接到不同组件吗？](#react-multiple-components)

## React Redux

<a id="react-not-rerendering"></a>
### 为何组件没有被重新渲染、或者 mapStateToProps 没有运行？

目前来看，导致组件在 action 分发后却没有被重新渲染，最常见的原因是对 state 进行了直接修改。Redux 期望 reducer 以 “不可变的方式” 更新 state，实际使用中则意味着复制数据，然后更新数据副本。如果直接返回同一对象，即使你改变了数据内容，Redux 也会认为没有变化。类似的，React Redux 会在 `shouldComponentUpdate` 中对新的 props 进行浅层的判等检查，以期提升性能。如果所有的引用都是相同的，则返回 `false` 从而跳过此次对组件的更新。

需要注意的是，不管何时更新了一个嵌套的值，都必须同时返回上层的任何数据副本给 state 树。如果数据是 `state.a.b.c.d`，你想更新 `d`，你也必须返回 `c`、`b`、`a` 以及 `state` 的拷贝。[state 树变化图](http://arqex.com/wp-content/uploads/2015/02/trees.png) 展示了树的深层变化为何需要改变途经的结点。

“以不可变的方式更新数据” 并 *不* 代表你必须使用 [Immutable.js](https://facebook.github.io/immutable-js/), 虽然是很好的选择。你可以使用多种方法，达到对普通 JS 对象进行不可变更新的目的：

- 使用类似于 `Object.assign()` 或者 `_.extend()` 的方法复制对象， `slice()` 和 `concat()` 方法复制数组。
- ES6 数组的 spread sperator（展开运算符），JavaScript 新版本提案中类似的对象展开运算符。
- 将不可变更新逻辑包装成简单方法的工具库。

#### 补充资料

**文档**
- [Troubleshooting](Troubleshooting.md)
- [React Redux: Troubleshooting](https://github.com/reactjs/react-redux/blob/master/docs/troubleshooting.md)
- [Recipes: Using the Object Spread Operator](/docs/recipes/UsingObjectSpreadOperator.md)
- [Recipes: Structuring Reducers - Prerequisite Concepts](/docs/recipes/reducers/PrerequisiteConcepts.md)
- [Recipes: Structuring Reducers - Immutable Update Patterns](/docs/recipes/reducers/ImmutableUpdatePatterns.md)

**文章**

- [Pros and Cons of Using Immutability with React](http://reactkungfu.com/2015/08/pros-and-cons-of-using-immutability-with-react-js/)
- [React/Redux Links: Immutable Data](https://github.com/markerikson/react-redux-links/blob/master/immutable-data.md)

**讨论**
- [#1262: Immutable data + bad performance](https://github.com/reactjs/redux/issues/1262)
- [React Redux #235: Predicate function for updating component](https://github.com/reactjs/react-redux/issues/235)
- [React Redux #291: Should mapStateToProps be called every time an action is dispatched？](https://github.com/reactjs/react-redux/issues/291)
- [Stack Overflow: Cleaner/shorter way to update nested state in Redux？](http://stackoverflow.com/questions/35592078/cleaner-shorter-way-to-update-nested-state-in-redux)
- [Gist: state mutations](https://gist.github.com/amcdnl/7d93c0c67a9a44fe5761#gistcomment-1706579)

<a id="react-rendering-too-often"></a>
### 为何组件频繁的重新渲染？

React Redux 采取了很多的优化手段，保证组件直到必要时才执行重新渲染。一种是对 `mapStateToProps` 和 `mapDispatchToProps` 生成后传入 `connect` 的 props 对象进行浅层的判等检查。遗憾的是，如果当 `mapStateToProps` 调用时都生成新的数组或对象实例的话，此种情况下的浅层判等不会起任何作用。一个典型的示例就是通过 ID 数组返回映射的对象引用，如下所示：

```js
const mapStateToProps = (state) => {
  return {
    objects: state.objectIds.map(id => state.objects[id])
  }
}
```

尽管每次数组内都包含了同样的对象引用，数组本身却指向不同的引用，所以浅层判等的检查结果会导致 React Redux 重新渲染包装的组件。

这种额外的重新渲染也可以避免，使用 reducer 将对象数组保存到 state，利用 [Reselect](https://github.com/reactjs/reselect) 缓存映射的数组，或者在组件的 `shouldComponentUpdate` 方法中，采用 `_.isEqual` 等对 props 进行更深层次的比较。注意在自定义的 `shouldComponentUpdate()` 方法中不要采用了比重新渲染本身更为昂贵的实现。可以使用分析器评估方案的性能。

对于独立的组件，也许你想检查传入的 props。一个普遍存在的问题就是在 render 方法中绑定父组件的回调，比如 `<Child onClick={this.handleClick.bind(this)} />`。这样就会在每次父组件重新渲染时重新生成一个函数的引用。所以只在父组件的构造函数中绑定一次回调是更好的做法。

#### 补充资料

**文档**

- [FAQ: Performance - Scaling](/docs/faq/Performance.md#performance-scaling)

**文章**

- [A Deep Dive into React Perf Debugging](http://benchling.engineering/deep-dive-react-perf-debugging/)
- [React.js pure render performance anti-pattern](https://medium.com/@esamatti/react-js-pure-render-performance-anti-pattern-fb88c101332f)
- [Improving React and Redux Performance with Reselect](http://blog.rangle.io/react-and-redux-performance-with-reselect/)
- [Encapsulating the Redux State Tree](http://randycoulman.com/blog/2016/09/13/encapsulating-the-redux-state-tree/)
- [React/Redux Links: React/Redux Performance](https://github.com/markerikson/react-redux-links/blob/master/react-performance.md)

**讨论**
- [Stack Overflow: Can a React Redux app scale as well as Backbone？](http://stackoverflow.com/questions/34782249/can-a-react-redux-app-really-scale-as-well-as-say-backbone-even-with-reselect)

**库**

- [Redux Addons Catalog: DevTools - Component Update Monitoring](https://github.com/markerikson/redux-ecosystem-links/blob/master/devtools.md#component-update-monitoring)

<a id="react-mapstate-speed"></a>
### 怎样使 `mapStateToProps` 执行更快？

尽管 React Redux 已经优化并尽量减少对 `mapStateToProps` 的调用次数，加快 `mapStateToProps` 执行并减少其执行次数仍然是非常有价值的。普遍的推荐方式是利用 [Reselect](https://github.com/reactjs/reselect) 创建可记忆（memoized）的 “selector” 方法。这样，selector 就能被组合在一起，并且同一管道（pipeline）后面的 selector 只有当输入变化时才会执行。意味着你可以像筛选器或过滤器那样创建 selector，并确保任务的执行时机。

#### 补充资料

**文档**
- [Recipes: Computed Derived Data](/docs/recipes/ComputingDerivedData.md)

**文章**

- [Improving React and Redux Performance with Reselect](http://blog.rangle.io/react-and-redux-performance-with-reselect/)

**讨论**
- [#815: Working with Data Structures](https://github.com/reactjs/redux/issues/815)
- [Reselect #47: Memoizing Hierarchical Selectors](https://github.com/reactjs/reselect/issues/47)

<a id="react-props-dispatch"></a>
### 为何不在被连接的组件中使用 `this.props.dispatch`？

`connect()` 方法有两个主要的参数，而且都是可选的。第一个参数 `mapStateToProps` 是个函数，让你在数据变化时从 store 获取数据，并作为 props 传到组件中。第二个参数 `mapDispatchToProps` 依然是函数，让你可以使用 store 的 `dispatch` 方法，通常都是创建 action 创建函数并预先绑定，那么在调用时就能直接分发 action。

如果在执行 `connect()` 时没有指定 `mapDispatchToProps` 方法，React Redux 默认将 `dispatch` 作为 prop 传入。所以当你指定方法时， `dispatch` 将 *不* 会自动注入。如果你还想让其作为 prop，需要在 `mapDispatchToProps` 实现的返回值中明确指出。

#### 补充资料

**文档**
- [React Redux API: connect()](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)

**讨论**
- [React Redux #89: can i wrap multi actionCreators into one props with name？](https://github.com/reactjs/react-redux/issues/89)
- [React Redux #145: consider always passing down dispatch regardless of what mapDispatchToProps does](https://github.com/reactjs/react-redux/issues/145)
- [React Redux #255: this.props.dispatch is undefined if using mapDispatchToProps](https://github.com/reactjs/react-redux/issues/255)
- [Stack Overflow: How to get simple dispatch from this.props using connect w/ Redux？](http://stackoverflow.com/questions/34458261/how-to-get-simple-dispatch-from-this-props-using-connect-w-redux/34458710])

<a id="react-multiple-components"></a>
### 应该只连接到顶层组件吗，或者可以在组件树中连接到不同组件吗？

早期的 Redux 文档中建议只在组件树顶层附近连接若干组件。然而，时间和经验都表明，这需要让这些组件非常了解它们子孙组件的数据需求，还导致它们会向下传递一些令人困惑的 props。

目前的最佳实践是将组件按照 “展现层（presentational）” 或者 “容器（container）” 分类，并在合理的地方抽象出一个连接的容器组件：

> Redux 示例中强调的 “在顶层保持一个容器组件” 是错误的。不要把这个当做准则。让你的展现层组件保持独立。然后创建容器组件并在合适时进行连接。当你感觉到你是在父组件里通过复制代码为某些子组件提供数据时，就是时候抽取出一个容器了。只要你认为父组件过多了解子组件的数据或者 action，就可以抽取容器。

总之，试着在数据流和组件职责间找到平衡。

#### 补充资料

**文档**
- [Basics: Usage with React](basics/UsageWithReact.md)

**文章**

- [Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
- [High-Performance Redux](http://somebody32.github.io/high-performance-redux/)
- [React/Redux Links: Architecture - Redux Architecture](https://github.com/markerikson/react-redux-links/blob/master/react-redux-architecture.md#redux-architecture)
- [React/Redux Links: Performance - Redux Performance](https://github.com/markerikson/react-redux-links/blob/master/react-performance.md#redux-performance)

**讨论**

- [Twitter: emphasizing “one container” was a mistake](https://twitter.com/dan_abramov/status/668585589609005056)
- [#419: Recommended usage of connect](https://github.com/reactjs/redux/issues/419)
- [#756: container vs component？](https://github.com/reactjs/redux/issues/756)
- [#1176: Redux+React with only stateless components](https://github.com/reactjs/redux/issues/1176)
- [Stack Overflow: can a dumb component use a Redux container？](http://stackoverflow.com/questions/34992247/can-a-dumb-component-use-render-redux-container-component)


