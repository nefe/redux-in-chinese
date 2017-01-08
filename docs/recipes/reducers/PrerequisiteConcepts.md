# Reducer 基础概念


就像 [Reducers](../../basics/Reducers.md) 中描述的一样，一个 Redux reducer 函数需要具备：

- 应该有类似 `(previousState, action) => newState` 特征的函数，函数的类型与 [Array.prototype.reduce(reducer, ?initialValue)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) 这个函数很相似。
- 应该是"纯"函数，纯函数意味着不能突变（原文mutate，意指直接修改引用所指向的值）它的参数，如果在函数中执行 API 调用，或者在函数外部修改值，又或者调用一个非纯函数比如 `Date.now()` 或 `Math.random()`，那么就会带来一些副作用。这意味着 state 的更新应该在**"不可变（immutable）"**的理念下完成，这就是说**总是去返回一个新的更新后的对象**，而不是直接去修改原始的 state tree。


>##### 关于不可变（immutability）和突变（mutation）以及副作用
> 突变是一种不鼓励的做法，因为它通常会打乱调试的过程，以及 React Redux 的 `connect` 函数：
>
> - 对于调试过程, Redux DevTools 期望重放 action 记录时能够输出 state 值，而不会改变任何其他的状态。**突变或者异步行为会产生一些副作用，可能使调试过程中的行为被替换，导致破坏了应用。**
> - 对于 React Redux `connect` 来说，为了确定一个组件（component）是否需要更新，它会检查从 `mapStateToProps` 中返回的值是否发生改变。为了提升性能，`connect` 使用了一些依赖于不可变 state 的方法。并且使用浅引用（shallow reference）来检测状态的改变。这意味着**直接修改对象或者数组是不会被检测到的并且组件不会被重新渲染。**
>
> 其他的副作用像在 reducer 中生成唯一的 ID 或者时间戳时也会导致代码的不可预测并且难以调试和测试。

因为上面这些规则，在去学习具体的组织 Redux reducer 的技术之前，了解并完全理解下面这些核心概念是十分重要的。


#### Redux Reducer 基础

**核心概念**：

- 理解 state 和 state shape
- 通过拆分 state 来确定各自的更新职责（**reducer 组合**）
- 高阶 reducers
- 定义 reducer 的初始化状态

**阅读列表**：

- [Redux 文档: Reducer](../../basics/Reducers.md)
- [Redux 文档: Reducer 样板代码](../ReducingBoilerplate.md)
- [Redux 文档: 实现撤销历史](../ImplementingUndoHistory.md)
- [Redux 文档: `combineReducers`](../../api/combineReducers.md)
- [高阶 Reducer 的力量](http://slides.com/omnidan/hor#/)
- [Stack Overflow: Store 初始化 state 和 `combineReducers`](http://stackoverflow.com/questions/33749759/read-stores-initial-state-in-redux-reducer)
- [Stack Overflow: State 键的名称与 `combineReducers`](http://stackoverflow.com/questions/35667775/state-in-redux-react-app-has-a-property-with-the-name-of-the-reducer)

#### 纯函数和副作用

**核心概念**：

- 副作用
- 纯函数
- 如何理解组合函数

**Reading List**:

**阅读列表**：

- [关于函数式编程的一点儿小想法](http://jaysoo.ca/2016/01/13/functional-programming-little-ideas/)
- [理解程序的副作用](http://web24studios.com/2015/10/understanding-programmatic-side-effects/)
- [学习 Javascript 中的函数式编程](https://youtu.be/e-5obm1G_FY)
- [使用纯函数编程的理由](https://www.sitepoint.com/an-introduction-to-reasonably-pure-functional-programming/)


#### 不可变数据的管理

**核心概念**：

- 可变与不可变
- 安全地以不可变的方式更新对象和数组
- 避免在函数和语句中突变 state

**阅读列表**

- [在 React 中使用 Immutable 特性的优缺点](http://reactkungfu.com/2015/08/pros-and-cons-of-using-immutability-with-react-js/)
- [Javascript 和 Immutable 特性](http://t4d.io/javascript-and-immutability/)
- [使用 ES6 的 Immutable 数据及其延伸](http://wecodetheweb.com/2016/02/12/immutable-javascript-using-es6-and-beyond/)
- [Immutable 数据从零开始](https://ryanfunduk.com/articles/immutable-data-from-scratch/)
- [Redux 文档: 使用对象展开符](../UsingObjectSpreadOperator.md)


#### 范式化数据

**核心概念**：

- 数据库的组织结构
- 拆分相关/嵌套数据到单独的表中
- 为每个被赋值的对象都存储一个单独的标识
- 通过 ID 引用对象
- 通过对象 ID 来查找表，通过一组 ID 来记录顺序
- 通过关系来联系各个对象

**阅读列表**：

- [用简单的英语介绍数据库范式化](http://www.essentialsql.com/get-ready-to-learn-sql-database-normalization-explained-in-simple-english/)
- [Redux 惯用法: 范式化 State Shape](https://egghead.io/lessons/javascript-redux-normalizing-the-state-shape)
- [范式化文档](https://github.com/paularmstrong/normalizr)
- [让 Redux 变得更干净：范式化](https://tonyhb.gitbooks.io/redux-without-profanity/content/normalizer.html)
- [查询 Redux Store](https://medium.com/@adamrackis/querying-a-redux-store-37db8c7f3b0f)
- [维基百科: 关联实体](https://en.wikipedia.org/wiki/Associative_entity)
- [数据库设计: 多对多](http://www.tomjewett.com/dbdesign/dbdesign.php?page=manymany.php)
- [当组织你的应用 State 时避免不必要的复杂度](https://medium.com/@talkol/avoiding-accidental-complexity-when-structuring-your-app-state-6e6d22ad)
