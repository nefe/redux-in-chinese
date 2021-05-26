---
id: overview
title: 'Redux Toolkit: 概览'
description: 'Redux Toolkit is the recommended way to write Redux logic'
hide_title: false
---

## Redux Toolkit 是什么？

**[Redux Toolkit](https://redux-toolkit.js.org)** 是我们官方的，有观点的，开箱即用的高效 Redux 开发工具集。它旨在成为标准的 Redux 逻辑开发方式，我们强烈建议您使用它。

它包括几个实用程序功能，这些功能可以简化最常见场景下的 Redux 开发，包括配置 store、定义 reducer，不可变的更新逻辑、甚至可以立即创建整个状态的 “切片 slice”，而无需手动编写任何 action creator 或者 action type。它还包括使用最广泛的 Redux 插件，例如 Redux Thunk 用于异步逻辑，而 Reselect 用于编写选择器 selector 函数，因此你可以立即使用它们。

### 安装

Redux Toolkit 提供 NPM 软件包，安装方式如下：

```bash
# NPM
npm install @reduxjs/toolkit

# Yarn
yarn add @reduxjs/toolkit
```

## 目的

Redux 核心库是故意设计为无观点（unopinionated）。 它使你可以决定如何处理所有内容，例如配置 store，包含你的状态以及如何构建 reducer。

在某些情况下，这是很好的，因为提供了灵活性，但并不总是需要灵活性。有时，我们只是想以最简单的方式上手，并且开箱即用了一些良好的默认行为。或者，也许您正在编写一个更大的应用程序并发现自己正在编写一些类似的代码，而你想减少必须手工编写的代码量。

**Redux Toolkit** 它最初是为了帮助解决有关 Redux 的三个常见问题而创建的：

- "配置 Redux store 过于复杂"
- "我必须添加很多软件包才能开始使用 Redux 做事情"
- "Redux 有太多样板代码"

我们不可能解决所有场景的问题，但是借鉴于 [`create-react-app`](https://github.com/facebook/create-react-app) 和 [`apollo-boost`](https://dev-blog.apollodata.com/zero-config-graphql-state-management-27b1f1b3c2c3) 的思路，我们可以提供一组官方推荐的工具，这些工具可以处理最常见的用例并减少做出额外决策的需要。

## 为什么需要使用 Redux Toolkit

通过遵循我们推荐的最佳实践，提供良好的默认行为，捕获错误并允许您编写更简单的代码，**React Toolkit** 使得编写良好的 Redux 应用程序和加快开发速度变得更加容易。 Redux工具包对**所有 Redux 用户都有帮助**无论技能水平或者经验如何。可以在新项目开始时添加它，也可以在现有项目中将其用作增量迁移的一部分。

请注意，**您不是_必须_使用 Redux Toolkit 才能使用Redux**。有许多现有的应用使用其他 Redux 封装库，或者**纯手写** Redux 逻辑。**如果你希望使用其他方法，请继续！**

总体而言，无论您是开发第一个项目的全新 Redux 用户，还是想简化现有应用程序的经验丰富的用户，**使用 Redux Toolkit 都将使你的代码更好，更可维护**。

## 包含了什么

Redux Toolkit 包含：

- [`configureStore()` 函数](https://redux-toolkit.js.org/api/configureStore) 提供简化的配置选项。它可以自动组合切片 slice 的 reducer，添加你提供的任何 Redux 中间件，默认情况下包含 `redux-thunk`，并启用 Redux DevTools 扩展。
- [`createReducer()` 工具](https://redux-toolkit.js.org/api/createReducer) 让你自动做 action type 到 reducer 的对应，而不是编写 switch...case 语句。另外，它会自动使用 [`immer` 库](https://github.com/mweststrate/immer)来让你使用普通的 mutable 代码编写更简单的 immutable 更新，例如 `state.todos[3].completed = true`。
- [`createAction()` 工具](https://redux-toolkit.js.org/api/createAction) 返回给定 action type 字符串的 action creator 函数。该函数本身已定义了 `toString()`，因此可以代替常量类型使用。
- [`createSlice()` 函数](https://redux-toolkit.js.org/api/createSlice) 接受一组化 reducer 函数，一个 slice 切片名和初始状态 initial state，并自动生成具有相应 action creator 和 action type 的 slice reducer。
- [`createSelector` 工具](https://redux-toolkit.js.org/api/createSelector) 来源于 [Reselect](https://github.com/reduxjs/reselect) 库，重新 export 出来以方便使用。

## 文档

Redux Toolkit 完整的文档在这里 **[https://redux-toolkit.js.org](https://redux-toolkit.js.org)**.

### 文档链接

- **简介**
  - [快速开始](https://redux-toolkit.js.org/introduction/quick-start)
- **教程**
  - [基础教程](https://redux-toolkit.js.org/tutorials/basic-tutorial)
  - [中级教程](https://redux-toolkit.js.org/tutorials/intermediate-tutorial)
  - [高级教程](https://redux-toolkit.js.org/tutorials/advanced-tutorial)
- **使用 Redux Toolkit**
  - [入门](https://redux-toolkit.js.org/usage/usage-guide)
- **API 文档**
  - [`configureStore`](https://redux-toolkit.js.org/api/configureStore)
  - [`getDefaultMiddleware`](https://redux-toolkit.js.org/api/getDefaultMiddleware)
  - [`createReducer`](https://redux-toolkit.js.org/api/createReducer)
  - [`createAction`](https://redux-toolkit.js.org/api/createAction)
  - [`createSlice`](https://redux-toolkit.js.org/api/createSlice)
  - [`createSelector`](https://redux-toolkit.js.org/api/createSelector)
  - [其他 Export](https://redux-toolkit.js.org/api/other-exports)
