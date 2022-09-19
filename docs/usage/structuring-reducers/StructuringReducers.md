---
id: structuring-reducers
title: 组织 Reducer
description: '组织 Reducer'
hide_title: false
---

# 组织 Reducer

Redux 的核心是一个非常简单的设计模式：所有你“写”的逻辑都集中在一个单独的函数中，并且执行这些逻辑的唯一方式就是传给 Redux 一个能够描述当时情景的普通对象（plain object）。Redux store 调用这些逻辑函数，并传入当前的 state tree 以及这些描述对象，返回新的 state tree，接着 Redux store 便开始通知这些订阅者（subscriber）state tree 已经改变了。

Redux 设置了一些基本的限制来保证这些逻辑函数的正常工作，就像 [Redux 基础知识，第三节： State、Actions 与 Reducers](../../tutorials/fundamentals/part-3-state-actions-reducers.md) 里面描述的一样，它必须有类似 `(previousState, action) => newState` 这样的结构，它们通常被称作 **reducer 函数**，并且必须是**纯函数**和可预测的。

在这之后，只要遵循这些基本的规则，Redux 就不会关心你在这些 reducer 函数中是如何组织逻辑的。这既能带来更多的自由，也会导致很多的困惑。不过在写这些 reducer 的时候，也会有很多的常见的模式以及很多需要注意的相关信息与概念。而随着应用规模逐渐变大，这些模式在管理这些错综复杂的 reducer 时，处理真实世界的数据时，以及优化 UI 性能时都起着至关重要的作用。

### 编写 Reducer 的预置知识

其中一些概念已经在 Redux 文档的其他地方进行了描述。其他的则是通用的并且适用于 Redux 本身之外，并且有许多现有的文章详细介绍了这些概念。这些概念和技巧是能写出符合 Solid 原则的 Redux reducer 逻辑的基础。

**深入的理解**这些概念是你要学习更高级的 Redux 技术之前必不可少的事情。这里有一个推荐的阅读列表。

#### [必要的概念](PrerequisiteConcepts.md)

标准的 Redux 架构依赖于使用普通的 JS 对象和数组来表示你的状态。如果您出于某种原因使用替代方法，则细节可能会因您的方法而异，但许多原则仍然适用。

Reducer 概念和技巧

- [基本 Reducer 结构](BasicReducerStructure.md)
- [拆分 Reducer 逻辑](SplittingReducerLogic.md)
- [重构 Reducer 的例子](RefactoringReducersExample.md)
- [使用 `combineReducers`](UsingCombineReducers.md)
- [进阶 `combineReducers`](BeyondCombineReducers.md)
- [范式化 State 结构](NormalizingStateShape.md)
- [更新范式化数据](UpdatingNormalizedData.md)
- [重用 Reducer 逻辑](ReusingReducerLogic.md)
- [Immutable 的更新模式](ImmutableUpdatePatterns.md)
- [初始化 State](InitializingState.md)
