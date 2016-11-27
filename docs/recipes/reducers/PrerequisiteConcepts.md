# Prerequisite Reducer Concepts
# 必要的 Reducer 概念


As described in [Reducers](../../basics/Reducers.md), a Redux reducer
function:

就像 [Reducers](../../basics/Reducers.md) 中描述的一样，一个 Redux reducer 函数需要具备：

- Should have a signature of `(previousState, action) => newState`,
  similar to the type of function you would pass to
[`Array.prototype.reduce(reducer,
?initialValue)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)
- 应该有类似 `(previousState, action) => newState` 特征的函数，函数的类型与 Array.prototype.reduce(reducer, ?initialValue) 这个函数很相似。

- Should be "pure", which means it does not mutate its arguments,
  perform side effects like API calls or modifying values outside of the
function, or call non-pure functions like `Date.now()` or
`Math.random()`.  This also means that updates should be done in an
***"immutable"*** fashion, which means **always returning new objects
with the updated data**, rather than directly modifying the original
state tree in-place.
- 应该是纯函数，纯函数意味着不能突变它的参数，如果在函数中执行 API 调用，或者在函数外部修改值，又或者调用一个非纯函数比如 `Date.now()` 或 `Math.random()`，那么就会带来一些副作用。这意味着 state 的更新应该在不可变的理念下完成，而不是直接去修改原始的 state tree。

>##### Note on immutability, side effects, and mutation
> Mutation is discouraged because it generally breaks time-travel
> debugging, and React Redux's `connect` function:
> 
> - For time traveling, the Redux DevTools expect that replaying
>   recorded actions would output a state value, but not change anything
>   else. **Side effects like mutation or asynchronous behavior will
>   cause time travel to alter behavior between steps, breaking the
>   application**. 
> - For React Redux, `connect` checks to see if the props returned from
>   a `mapStateToProps` function have changed in order to determine if a
>   component needs to update.  To improve performance, `connect` takes
>   some shortcuts that rely on the state being immutable, and uses
>   shallow reference equality checks to detect changes. This means that
>   **changes made to objects and arrays by direct mutation will not be
>   detected, and components will not re-render**.
>
> Other side effects like generating unique IDs or timestamps in a
> reducer also make the code unpredictable and harder to debug and test.

>##### 关于不可变性和突变以及副作用
> 突变是一种不鼓励的做法，因为它通常会打乱调试的过程，以及 React Redux 的 `connect` 函数
> 
> - 对于调试过程, Redux DevTools 期望重放 action 记录时能够输出 state 值，而不会改变任何其他的状态。突变或者异步行为会产生一些副作用，可能使调试过程中的行为被替换，导致破坏了应用。
> - 对于 React Redux `connect` 来说，为了确定一个组件（component）是否需要更新，它会检查从 `mapStateToProps` 中返回的值是否发生改变。为了提升性能，`connect` 使用了一些依赖于不可变 state 的方法。并且使用浅引用（shallow reference）来检测状态的改变。这意味着直接修改对象或者数组是不会被检测到的并且组件不会被重新渲染。
> 
> 其他的副作用像在 reducer 中生成唯一的 ID 或者时间戳时也会导致代码的不可预测并且难以调试和测试。

Because of these rules, it's important that the following core concepts
are fully understood before moving on to other specific techniques for
organizing Redux reducers:

因为上面这些规则，在去学习下面这些组织 Redux reducer 的技术之前，了解并完全理解一些核心概念是十分重要的。

#### Redux Reducer Basics
#### Redux Reducer 基础

**Key concepts**:

**核心概念**：

- Thinking in terms of state and state shape
- 理解 state 和 state shape
- Delegating update responsibility by slice of state (*reducer
  composition*)
- 通过拆分 state 来确定各自的更新职责（**reducer 组合**）
- Higher order reducers
- 高阶 reducers
- Defining reducer initial state
- 定义 reducer 的初始化状态

**Reading list**:
**阅读列表**：

- [Redux Docs: Reducers](../../basics/Reducers.md)
- [Redux 文档: Reducer](../../basics/Reducers.md) 
- [Redux Docs: Reducing Boilerplate](../ReducingBoilerplate.md)
- [Redux 文档: Reducer 样板代码](../ReducingBoilerplate.md)
- [Redux Docs: Implementing Undo History](../ImplementingUndoHistory.md)
- [Redux 文档: 实现撤销历史](../ImplementingUndoHistory.md)
- [Redux Docs: `combineReducers`](../../api/combineReducers.md)
- [Redux 文档: `combineReducers`](../../api/combineReducers.md)
- [The Power of Higher-Order Reducers](http://slides.com/omnidan/hor#/)
- [高阶 Reducer 的力量](http://slides.com/omnidan/hor#/)
- [Stack Overflow: Store initial state and
  `combineReducers`](http://stackoverflow.com/questions/33749759/read-stores-initial-state-in-redux-reducer)
- [Stack Overflow: Store 初始化 state 和 `combineReducers`](http://stackoverflow.com/questions/33749759/read-stores-initial-state-in-redux-reducer) 
- [Stack Overflow: State key names and
  `combineReducers`](http://stackoverflow.com/questions/35667775/state-in-redux-react-app-has-a-property-with-the-name-of-the-reducer)
- [Stack Overflow: State 键的名称与 `combineReducers`](http://stackoverflow.com/questions/35667775/state-in-redux-react-app-has-a-property-with-the-name-of-the-reducer)

#### Pure Functions and Side Effects
#### 纯函数和副作用

**Key Concepts**:  

**核心概念**：

- Side effects
- 副作用
- Pure functions
- 纯函数
- How to think in terms of combining functions
- 如何理解组合函数

**Reading List**:

**阅读列表**：

- [The Little Idea of Functional
  Programming](http://jaysoo.ca/2016/01/13/functional-programming-little-ideas/)
- [关于函数式编程的一点儿小想法](http://jaysoo.ca/2016/01/13/functional-programming-little-ideas/)
- [Understanding Programmatic Side
  Effects](http://web24studios.com/2015/10/understanding-programmatic-side-effects/)
- [理解程序的副作用](http://web24studios.com/2015/10/understanding-programmatic-side-effects/)
- [Learning Functional Programming in
  Javascript](https://youtu.be/e-5obm1G_FY)
- [学习 Javascript 中的函数式编程](https://youtu.be/e-5obm1G_FY)
- [An Introduction to Reasonably Pure Functional
  Programming](https://www.sitepoint.com/an-introduction-to-reasonably-pure-functional-programming/)
- [使用纯函数编程的理由](https://www.sitepoint.com/an-introduction-to-reasonably-pure-functional-programming/)


#### Immutable Data Management
#### 不可变数据的管理

**Key Concepts**:

**核心概念**：

- Mutability vs immutability
- 可变与不可变
- Immutably updating objects and arrays safely
- 安全地以不可变的方式更新对象和数组
- Avoiding functions and statements that mutate state
- 避免在函数和语句中突变 state

**Reading List**:

**阅读列表**

- [Pros and Cons of Using Immutability With
  React](http://reactkungfu.com/2015/08/pros-and-cons-of-using-immutability-with-react-js/)
- [在 React 中使用 Immutable 特性的优缺点](http://reactkungfu.com/2015/08/pros-and-cons-of-using-immutability-with-react-js/)
- [Javascript and
  Immutability](http://t4d.io/javascript-and-immutability/)
- [Javascript 和 Immutable 特性](http://t4d.io/javascript-and-immutability/)
- [Immutable Data using ES6 and
  Beyond](http://wecodetheweb.com/2016/02/12/immutable-javascript-using-es6-and-beyond/)
- [使用 ES6 的 Immutable 数据及其延伸](http://wecodetheweb.com/2016/02/12/immutable-javascript-using-es6-and-beyond/)
- [Immutable Data from
  Scratch](https://ryanfunduk.com/articles/immutable-data-from-scratch/)
- [Immutable 数据从零开始](https://ryanfunduk.com/articles/immutable-data-from-scratch/)
- [Redux Docs: Using the Object Spread
Operator](../UsingObjectSpreadOperator.md)
- [Redux 文档: 使用对象展开符](../UsingObjectSpreadOperator.md)


#### Normalizing Data
#### 范式化数据

**Key Concepts**:

**核心概念**：

- Database structure and organization
- 数据库的组织结构
- Splitting relational/nested data up into separate tables
- 拆分相关/嵌套数据到单独的表中
- Storing a single definition for a given item
- 为每个被赋值的对象都存储一个单独的标识
- Referring to items by IDs
- 通过 ID 引用对象
- Using objects keyed by item IDs as lookup tables, and arrays of IDs to
  track ordering
- 通过对象 ID 来查找表，通过一组 ID 来记录顺序
- Associating items in relationships
- 通过关系来联系各个对象


**Reading List**:

**阅读列表**：

- [Database Normalization in Simple
  English](http://www.essentialsql.com/get-ready-to-learn-sql-database-normalization-explained-in-simple-english/)
- [用简单的英语介绍数据库范式化](http://www.essentialsql.com/get-ready-to-learn-sql-database-normalization-explained-in-simple-english/)
- [Idiomatic Redux: Normalizing the State
  Shape](https://egghead.io/lessons/javascript-redux-normalizing-the-state-shape)
- [Redux 惯用法: 范式化 State
  Shape](https://egghead.io/lessons/javascript-redux-normalizing-the-state-shape)
- [Normalizr Documentation](https://github.com/paularmstrong/normalizr)
- [范式化文档](https://github.com/paularmstrong/normalizr)
- [Redux Without Profanity
  Normalizr](https://tonyhb.gitbooks.io/redux-without-profanity/content/normalizer.html)
- [让 Redux 变得更干净：范式化](https://tonyhb.gitbooks.io/redux-without-profanity/content/normalizer.html)
- [Querying a Redux
  Store](https://medium.com/@adamrackis/querying-a-redux-store-37db8c7f3b0f)
- [查询 Redux Store](https://medium.com/@adamrackis/querying-a-redux-store-37db8c7f3b0f)
- [Wikipedia: Associative
  Entity](https://en.wikipedia.org/wiki/Associative_entity)
- [维基百科: 关联实体](https://en.wikipedia.org/wiki/Associative_entity)
- [Database Design:
  Many-to-Many](http://www.tomjewett.com/dbdesign/dbdesign.php?page=manymany.php)
- [数据库设计: 多对多](http://www.tomjewett.com/dbdesign/dbdesign.php?page=manymany.php)
- [Avoiding Accidental Complexity When Structuring Your App
  State](https://medium.com/@talkol/avoiding-accidental-complexity-when-structuring-your-app-state-6e6d22ad)
- [当组织你的应用 State 时避免不必要的复杂度](https://medium.com/@talkol/avoiding-accidental-complexity-when-structuring-your-app-state-6e6d22ad)