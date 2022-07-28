---
id: immutable-update-patterns
title: 不可变更新模式
description: '组织 Reducers > Immutable 不可变更新模式：How to correctly update state immutably, with examples of common mistakes'
hide_title: false
---

# Immutable 不可变更新模式

在 [Reducer 必备概念之不可变数据管理](PrerequisiteConcepts.md#immutable-data-management) 中给出一些示例，演示了不可变的基本更新操作，例如，更新一个对象中一个字段，或者，在数组的末尾增加一个数据。然而，reducer 经常需要综合使用这些基本操作去处理更加复杂的任务。下面是一些你可能必须去实现的常见任务的例子。

## 更新嵌套的对象

更新嵌套数据的关键是**必须适当地复制和更新嵌套的每个级别**。这往往是那些学习 redux 一个难以理解的概念，当试图更新嵌套对象的时候，有一些具体的问题会经常出现。这些意外的导致了直接变化，应该被避免。

##### 正确方法：复制嵌套数据的所有层级

不幸的是，将不可变更新正确应用于深层嵌套状态的过程很容易变得冗长且难以阅读。 以下是更新 `state.first.second[someId].fourth` 的示例：

```js
function updateVeryNestedField(state, action) {
  return {
    ...state,
    first: {
      ...state.first,
      second: {
        ...state.first.second,
        [action.someId]: {
          ...state.first.second[action.someId],
          fourth: action.someValue
        }
      }
    }
  }
}
```

##### 常见错误 #1：指向同一对象的新变量

定义一个新变量不会创建一个新的实际对象，它只创建另一个引用到同一个对象。这个错误的示例如下：

```javascript
function updateNestedState(state, action) {
  let nestedState = state.nestedState
  // 错误: 这将导致直接修改已经存在的对象引用-不要这么做!
  nestedState.nestedField = action.data

  return {
    ...state,
    nestedState
  }
}
```

这个函数正确返回了顶层状态对象的浅复制，但是变量 `nestedState` 依然指向已经存在的对象，这个状态被直接修改了。

##### 常见错误 #2：仅仅在一个层级上做浅复制

这个错误的另外一个常见版本的如下所示：

```javascript
function updateNestedState(state, action) {
  // 问题: 这仅仅做了浅复制！
  let newState = { ...state }

  // 错误: nestedState 仍然是同一个对象!
  newState.nestedState.nestedField = action.data

  return newState
}
```

做一个顶层的浅复制是**不**够的 - `nestedState` 对象也应该被复制。

## 在数组中插入和删除数据

通常，一个 Javascript 数组中内容使用变化的函数来修改，例如，`push` , `unshift`, `shift` 。因为我们不想在 reducer 中直接修改状态，这些通常应该被避免。正因如此，你可能会看到 “插入” 和 “删除” 的行为如下所示：

```javascript
function insertItem(array, action) {
  return [
    ...array.slice(0, action.index),
    action.item,
    ...array.slice(action.index)
  ]
}

function removeItem(array, action) {
  return [...array.slice(0, action.index), ...array.slice(action.index + 1)]
}
```

但是，请记住，关键是原始内存中的引用没有被修改。**只要首先我们做了复制，我们就可以安全的变化这个复制。** 请注意，这个对于数组和对象都是正确的，但嵌套的数据仍然必须使用相同的规则更新。

这意味着我们也可以编写插入和删除函数如下所示：

```javascript
function insertItem(array, action) {
  let newArray = array.slice()
  newArray.splice(action.index, 0, action.item)
  return newArray
}

function removeItem(array, action) {
  let newArray = array.slice()
  newArray.splice(action.index, 1)
  return newArray
}
```

删除函数也可以是这样：

```javascript
function removeItem(array, action) {
  return array.filter((item, index) => index !== action.index)
}
```

## 在一个数组中更新一个项目

更新数组的一项可以使用 `Array.map`, 返回我们想要更新那项的一个新值，和其他项原先的值：

```javascript
function updateObjectInArray(array, action) {
  return array.map((item, index) => {
    if (index !== action.index) {
      // 这不是我们关心的项-保持原来的值
      return item
    }

    // 否则, 这是我们关心的-返回一个更新的值
    return {
      ...item,
      ...action.item
    }
  })
}
```

## 不可变更新工具库

因为编写不可变的更新代码可能变得乏味，所以有许多工具程序库试图抽象出这个过程。这些库在 API 和用法上有所不同，但都试图提供一种更短和更简洁的方式来编写这些更新。例如，[Immer](https://github.com/mweststrate/immer) 使不可变更新成为一个简单的函数和纯 JavaScript 对象：

```js
var usersState = [{ name: 'John Doe', address: { city: 'London' } }]
var newState = immer.produce(usersState, draftState => {
  draftState[0].name = 'Jon Doe'
  draftState[0].address.city = 'Paris'
  //nested update similar to mutable way
})
```

有些，像 [dot-prop-immutable](https://github.com/debitoor/dot-prop-immutable) ，使用字符串路径作为命令：

```javascript
state = dotProp.set(state, `todos.${index}.complete`, true)
```

其他的，例如  [immutability-helper](https://github.com/kolodny/immutability-helper) （现在过时的 React 不可变助手插件的一个复制），使用嵌套数据和助手函数：

```javascript
var collection = [1, 2, { a: [12, 17, 15] }]
var newCollection = update(collection, {
  2: { a: { $splice: [[1, 1, 13, 14]] } }
})
```

这些可以有效的替代了手写不可变更新逻辑。

许多不可变更新工具的列表可以在  [Immutable Data#Immutable Update Utilities](https://github.com/markerikson/redux-ecosystem-links/blob/master/immutable-data.md#immutable-update-utilities)  的  [Redux Addons Catalog](https://github.com/markerikson/redux-ecosystem-links) 部分找到。

## 使用 Redux Starter Kit 简化不可变更新

我们的 [Redux Starter Kit](https://redux-starter-kit.js.org/) 包中包含在内部使用了 Immer 的[`createReducer` 实用程序](https://redux-starter-kit.js.org/api/createReducer)。
因此，您可以编写看似“变异”状态的 Reducer，但更新实际上是不可改变的。

这允许以更简单的方式编写不可变更新逻辑。这是[嵌套数据示例](#正确方法：复制嵌套数据的所有层级)
可能看起来像使用 `createReducer`：

```js
import { createReducer } from 'redux-starter-kit'

const initialState = {
  first: {
    second: {
      id1: { fourth: 'a' },
      id2: { fourth: 'b' }
    }
  }
}

const reducer = createReducer(initialState, {
  UPDATE_ITEM: (state, action) => {
    state.first.second[action.someId].fourth = action.someValue
  }
})
```

这显然更短，更易读。但是，这仅仅在您使用来自 Redux Starter Kit 中的 `createReducer` 函数将这个 reducer 包装在 Immer 的 [`produce` 函数](https://github.com/mweststrate/immer#api) 中才会生效。
**如果这个 reducer 脱离 Immer 使用，它实际上会改变 state**。而且仅仅依靠代码，可能不容易发现这个函数实际上是安全并且更新是不可改变的。请确保您完全理解不可变更新的概念。当您完全理解这些概念后，可能有助于在你的代码中添加一些注释，来说明你的 Reducer 正在使用 Redux Starter Kit 和 Immer。

此外 Redux Toolkit's [`createSlice` 工具函数](https://redux-toolkit.js.org/api/createSlice) 将自动生成 action creator 和基于您提供的 reducer 函数的 action 类型，代码块内置的 Immer 驱动的更新功能。
