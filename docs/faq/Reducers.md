---
id: reducers
title: Reducers
sidebar_label: Reducers
---

# Redux 常见问答：Reducers

## 目录

- [Redux 常见问答：Reducers](#redux-faq-reducers)
  - [目录](#table-of-contents)
  - [Reducers](#reducers)
    - [如何在两个 reducers 之间共享 state？必须使用 combineReducers 吗？](#how-do-i-share-state-between-two-reducers-do-i-have-to-use-combinereducers)
      - [更多信息](#further-information)
    - [是否必须使用 switch 语句来处理 actions 吗？](#do-i-have-to-use-the-switch-statement-to-handle-actions)
      - [更多信息](#further-information-1)

## Reducers

### 如何在两个 reducers 之间共享 state？必须使用 combineReducers 吗？

Redux store 的建议结构是将 state 对象按键拆分为多个 slices 或 domains，并提供单独的 reducer 函数来管理每个 slice。这类似于标准 Flux 模式包含多个独立 stores 的方式，Redux 提供了 [`combineReducers`](../api/combineReducers.md) 实用函数来使这种模式变得更容易。然而，需要重点注意 `combineReducers` _不是_ 必需的——它只是一个实用函数，适用于每个 state slice 只有一个 reducer 函数的常见用例，数据是纯 JavaScript 对象。

很多用户后来想尝试在两个 reducer 之间共享数据，但发现 `combineReducers` 不允许这样做。有几种解决办法：

- 如果 reducer 需要知道来自另一个 state slice 的数据，则可能需要重新组织 state 树，以便单个 reducer 可以处理更多数据。
- 你可能需要编写自定义函数来处理其中一些 actions。这可能需要用你自己的顶层 reducer 函数替换 `combineReducers`。你还可以使用诸如 [reduce-reducers](https://github.com/acdlite/reduce-reducers) 之类的实用程序来运行 `combineReducers` 以处理大多数 actions，但也可以为跨 state slices 的特定的 actions 运行更专业的 reducer。
- [具有异步逻辑的 middleware](../tutorials/fundamentals/part-4-store.md#middleware) 例如 [redux-thunk](https://github.com/reduxjs/redux-thunk)，可以通过 `getState()` 获取整个 state。Action creator 可以从 state 中检索额外的数据并将其放入 action 中，以便每个 reducer 都有足够的信息来更新自己的 state slice。

总之，请记住 reducer 仅仅只是函数——你可以按照自己的方式组织和细分它们，并且我们鼓励你将它们分解为更小的、可重用的函数（“reducer 组合”）。当你这样做时，如果子 reducer 需要额外的数据来计算它的下一个 state，你可以从父 reducer 传递一个自定义的第三个参数。你只需要确保它们一起遵循 reducer 的基本规则：`(state, action) => newState`，并且不可变地更新 state 而不是直接改变它。

#### 更多信息

**文档**

- [API：combineReducers](../api/combineReducers.md)
- [Redux 使用指南：构建 Reducers](../usage/structuring-reducers/StructuringReducers.md)

**讨论**

- [#601：当一个 action 与多个 reducer 相关时，combineReducers 值得关注](https://github.com/reduxjs/redux/issues/601)
- [#1400：将顶级 state 对象传递给分支 reducer 是一种反模式吗？](https://github.com/reduxjs/redux/issues/1400)
- [Stack Overflow：使用组合 reducers 时可以访问 state 的其他部分吗？](https://stackoverflow.com/questions/34333979/accessing-other-parts-of-the-state-when-using-combined-reducers)
- [Stack Overflow：使用 redux combineReducers 以减少整个子树](https://stackoverflow.com/questions/34427851/reducing-an-entire-subtree-with-redux-combinereducers)
- [在 Redux Reducer 之间共享 State](https://invalidpatent.wordpress.com/2016/02/18/sharing-state-between-redux-reducers/)

### 是否必须使用 switch 语句来处理 actions 吗？

不是的，欢迎你使用任何方法来响应 reducer 中的 action。`switch` 语句只是最常用的方法，但完全可以使用 `if` 语句、函数查找表或创建一个将其抽象出来的函数。事实上，虽然 Redux 确实需要 action 对象包含一个 `type` 字段，但 reducer 逻辑甚至不必依赖它来处理 action。也就是说，标准方法肯定是使用 switch 语句或基于 `type` 的查找表。

#### 更多信息

**文档**

- [Redux 使用指南：减少样板文件](../usage/ReducingBoilerplate.md)
- [Redux 使用指南：结构化 Reducer——拆分 Reducer 逻辑](../usage/structuring-reducers/SplittingReducerLogic.md)

**讨论**

- [#883：去掉冗杂的 switch 代码块](https://github.com/reduxjs/redux/issues/883)
- [#1167：不包含 switch 语句的 Reducer](https://github.com/reduxjs/redux/issues/1167)
