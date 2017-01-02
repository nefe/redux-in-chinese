# Redux 常见问题：组织 State

## 目录
- [必须将所有 state 都维护在 Redux 中吗？ 可以用 React 的 setState() 方法吗？](#organizing-state-only-redux-state)
- [可以将 store 的 state 设置为函数、promise或者其它非序列化值吗？](#organizing-state-non-serializable)
- [如何在 state 中组织嵌套及重复数据？](#organizing-state-nested-data)
  
## 组织 State

<a id="organizing-state-only-redux-state"></a>
### 必须将所有 state 都维护在 Redux 中吗？ 可以用 React 的 `setState()` 方法吗？

没有 “标准”。有些用户选择将所有数据都在 Redux 中维护，那么在任何时刻，应用都是完全有序及可控的。也有人将类似于“下拉菜单是否打开”的非关键或者 UI 状态，在组件内部维护。适合自己的才是最好的。

使用局部组件状态是更好的。作为一名开发者，应该决定使用何种 state 来组装你的应用，每个 state 的生存范围是什么。在两者之间做好平衡，然后就去做吧。

这里有一些将怎样的数据放入 Redux 的经验法则：

* 应用的其他部分是否关心这个数据？
* 是否需要根据需要在原始数据的基础上创建衍生数据？
* 相同的数据是否被用作驱动多个组件？
* 能否将状态恢复到特定时间点（在时光旅行调试的时候）？
* 是否要缓存数据（比如：数据存在的情况下直接去使用它而不是重复去请求他）？


有许多开源组件实现了各式各样在 Redux store 存储独立组件状态的替代方法，比如 [redux-ui](https://github.com/tonyhb/redux-ui)、 [redux-component](https://github.com/tomchentw/redux-component)、 [redux-react-local](https://github.com/threepointone/redux-react-local)等等。还可以将 Redux 的原则和 reducers 的概念应用到组件层面，按照 `this.setState((previousState) => reducer(previousState, someAction))` 的情形。

#### 补充资料

**文章**

- [You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)
- [Finding `state`’s place with React and Redux.](https://medium.com/@adamrackis/finding-state-s-place-with-react-and-redux-e9a586630172#.ioh033t3j)
- [A Case for setState](https://medium.com/@zackargyle/a-case-for-setstate-1f1c47cd3f73#.dwhuf0g8f)
- [How to handle state in React. The missing FAQ.
](https://medium.com/react-ecosystem/how-to-handle-state-in-react-6f2d3cd73a0c)
- [Where to Hold React Component Data: state, store, static, and this](https://medium.freecodecamp.com/where-do-i-belong-a-guide-to-saving-react-component-data-in-state-store-static-and-this-c49b335e2a00)
- [The 5 Types Of React Application State](http://jamesknelson.com/5-types-react-application-state/)

**讨论**

- [#159: Investigate using Redux for pseudo-local component state](https://github.com/reactjs/redux/issues/159)
- [#1098: Using Redux in reusable React component](https://github.com/reactjs/redux/issues/1098)
- [#1287: How to choose between Redux's store and React's state？](https://github.com/reactjs/redux/issues/1287)
- [#1385: What are the disadvantages of storing all your state in a single immutable atom？](https://github.com/reactjs/redux/issues/1385)
- [Twitter: Should I keep something in React component state?](https://twitter.com/dan_abramov/status/749710501916139520)
- [Twitter: Using a reducer to update a component](https://twitter.com/dan_abramov/status/736310245945933824)
- [React Forums: Redux and global state vs local state](https://discuss.reactjs.org/t/redux-and-global-state-vs-local-state/4187)
- [Reddit: "When should I put something into my Redux store?"](https://www.reddit.com/r/reactjs/comments/4w04to/when_using_redux_should_all_asynchronous_actions/d63u4o8/)
- [Stack Overflow: Why is state all in one place, even state that isn't global？](http://stackoverflow.com/questions/35664594/redux-why-is-state-all-in-one-place-even-state-that-isnt-global)
- [Stack Overflow: Should all component state be kept in Redux store？](http://stackoverflow.com/questions/35328056/react-redux-should-all-component-states-be-kept-in-redux-store)

**库**

- [Redux Addons Catalog: Component State](https://github.com/markerikson/redux-ecosystem-links/blob/master/component-state.md)

<a id="organizing-state-non-serializable"></a>
### 可以将 store 的 state 设置为函数、promise或者其它非序列化值吗？

强烈推荐只在 store 中维护普通的可序列化对象、数组以及基本数据类型。虽然从 *技术* 层面上将非序列化项保存在 store 中是可行的，但这样会破坏 store 内容持久化和恢复能力，以及会干扰时间旅行。

如果你不关心数据持久化和时间旅行，那么完全欢迎把不可以持久化的数据放入 Redux 的 Store 中存储。最终，他是你的应用程序，如何实现完全取决于你自己。与其他很多 Redux 的事情一样，你需要明白权衡所需。

#### 补充资料

**讨论**

- [#1248: Is it ok and possible to store a react component in a reducer？](https://github.com/reactjs/redux/issues/1248)
- [#1279: Have any suggestions for where to put a Map Component in Flux？](https://github.com/reactjs/redux/issues/1279)
- [#1390: Component Loading](https://github.com/reactjs/redux/issues/1390)
- [#1407: Just sharing a great base class](https://github.com/reactjs/redux/issues/1407)
- [#1793: React Elements in Redux State](https://github.com/reactjs/redux/issues/1793)

<a id="organizing-state-nested-data"></a>
### 如何在 state 中组织嵌套及重复数据？

当数据存在 ID、嵌套或者关联关系时，应当以 “范式化” 形式存储：对象只能存储一次，ID 作为键值，对象间通过 ID 相互引用。将 store 类比于数据库，每一项都是独立的 “表”。[normalizr](https://github.com/gaearon/normalizr) 、 [redux-orm](https://github.com/tommikaikkonen/redux-orm) 此类的库能在管理规范化数据时提供参考和抽象。

#### 补充资料

**文档**
- [Advanced: Async Actions](advanced/AsyncActions.md)
- [Examples: Real World example](introduction/Examples.html#real-world)
- [Recipes: Structuring Reducers - Prerequisite Concepts](https://github.com/reactjs/redux/blob/master/docs/recipes/reducers/PrerequisiteConcepts.md#normalizing-data)
- [Recipes: Structuring Reducers - Normalizing State Shape](https://github.com/reactjs/redux/blob/master/docs/recipes/reducers/NormalizingStateShape.md)
- [Examples: Tree View](https://github.com/reactjs/redux/tree/master/examples/tree-view)

**文章**

- [High-Performance Redux](http://somebody32.github.io/high-performance-redux/)
- [https://medium.com/@adamrackis/querying-a-redux-store-37db8c7f3b0f](https://medium.com/@adamrackis/querying-a-redux-store-37db8c7f3b0f)

**讨论**

- [#316: How to create nested reducers？](https://github.com/reactjs/redux/issues/316)
- [#815: Working with Data Structures](https://github.com/reactjs/redux/issues/815)
- [#946: Best way to update related state fields with split reducers？](https://github.com/reactjs/redux/issues/946)
- [#994: How to cut the boilerplate when updating nested entities？](https://github.com/reactjs/redux/issues/994)
- [#1255: Normalizr usage with nested objects in React/Redux](https://github.com/reactjs/redux/issues/1255)
- [#1269: Add tree view example](https://github.com/reactjs/redux/pull/1269)
- [#1824: Normalising state and garbage collection](https://github.com/reactjs/redux/issues/1824#issuecomment-228585904)
- [Twitter: state shape should be normalized](https://twitter.com/dan_abramov/status/715507260244496384)
- [Stack Overflow: How to handle tree-shaped entities in Redux reducers?](http://stackoverflow.com/questions/32798193/how-to-handle-tree-shaped-entities-in-redux-reducers)
- [Stack Overflow: How to optimize small updates to props of nested components in React + Redux?](http://stackoverflow.com/questions/37264415/how-to-optimize-small-updates-to-props-of-nested-component-in-react-redux)
