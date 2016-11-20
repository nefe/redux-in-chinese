# 组织 Reducer

作为核心概念， Redux 真的是一种十分简单的设计模式：所有你“写”的逻辑都集中在一个单独的函数中，并且执行这些逻辑的唯一方式就是传给 Redux 一个能够描述当时情景的普通对象（plain object）。Redux store 调用这些逻辑函数，并传入当前的 state tree 以及这些描述对象，返回新的 state tree，接着 Redux store 便开始通知这些订阅者（subscriber）state tree 已经改变了。

Redux 设置了一些基本的限制来保证这些逻辑函数的正常工作，就像 [Reducers](../basics/Reducers.md) 里面描述的一样，它必须有类似 `(previousState, action) => newState` 这样的结构，它们通常被称作 **reducer 函数**，并且必须是**纯**函数和可预测的。

在这之后，只要遵循这些基本的规则，Redux 就不会关心你在这些 reducer 函数中是如何组织逻辑的。这既能带来会多的自由，也会导致很多的困惑。不过在写这些 reducer 的时候，也会有很多的常见的模式以及很多需要注意的相关信息与概念。而随着应用规模逐渐变大，这些模式在管理这些错综复杂的 reducer 时，处理真实世界的数据时，以及优化 UI 性能时都起着至关重要的作用。


### 写 Reducer 时必要的概念

这些概念中的一部分，可能已经在别的 Redux 文档中描述过了。其他的概念也都是些比较普通的或者可以适用于 Redux 外的，这里有许多文章来详细的解释这些概念。这些概念和技巧是能写出符合 Solid 原则的 Redux reducer 逻辑的基础。

**深入的理解**这些概念是你要学习更高级的 Redux 技术之前必不可少的事情。这里有一个推荐的阅读列表。

#### [必要的概念](./reducers/PrerequisiteConcepts.md)

另外还值得注意的是，在特定的应用特定的架构下，这些建议可能也不是非常的适合。举个例子，如果一个应用使用了 Immutable.js Map 来存储数据，那么它组织 reducer 逻辑的时候就可能和用普通对象存储数据的情况不一样。 这些文档主要假设我们使用的都是 Javascript 普通对象，但即使你使用一些其他的工具，这里的很多规则其实依然适用。



Reducer 概念和技巧

- [基本 Reducer 结构](./reducers/BasicReducerStructure.md)
- [拆分 Reducer 逻辑](./reducers/SplittingReducerLogic.md)
- [重构 Reducer 的例子](./reducers/RefactoringReducersExample.md)
- [使用 `combineReducers`](./reducers/UsingCombineReducers.md)
- [超越 `combineReducers`](./reducers/BeyondCombineReducers.md)
- [范式化 State 结构](./reducers/NormalizingStateShape.md)
- [更新范式化数据](./reducers/UpdatingNormalizedData.md)
- [重用 Reducer 逻辑](./reducers/ReusingReducerLogic.md)
- [Immutable 的更新模式](./reducers/ImmutableUpdatePatterns.md)
- [初始化 State](./reducers/InitializingState.md)
