---
id: immutable-data
title: Immutable Data
hide_title: false
---

# Redux FAQ: 不可变数据

## 目录

- [不变性有什么好处？](#what-are-the-benefits-of-immutability)
- [为什么 Redux 需要不可变性？](#why-is-immutability-required-by-redux)
- [为什么 Redux 的浅相等检查需要不可变性？](#why-does-reduxs-use-of-shallow-equality-checking-require-immutability)
  - [浅相等检和深相等检有何不同？](#how-do-shallow-and-deep-equality-checking-differ)
  - [Redux 如何使用浅相等检查？](#how-does-redux-use-shallow-equality-checking)
  - [`combineReducers` 如何使用浅相等检查？](#how-does-combinereducers-use-shallow-equality-checking)
  - [React-Redux 如何使用浅相等检查？](#how-does-react-redux-use-shallow-equality-checking)
  - [React-Redux 如何使用浅相等检查来确定组件是否需要重新渲染？](#how-does-react-redux-use-shallow-equality-checking-to-determine-whether-a-component-needs-re-rendering)
  - [为什么浅相等检查不适用于可变对象？](#why-will-shallow-equality-checking-not-work-with-mutable-objects)
  - [使用可变对象进行浅相等检查是否会导致 Redux 出现问题？](#does-shallow-equality-checking-with-a-mutable-object-cause-problems-with-redux)
  - [为什么改变 state 的 reducer 会阻止 React-Redux 重新渲染包装的组件？](#why-does-a-reducer-mutating-the-state-prevent-react-redux-from-re-rendering-a-wrapped-component)
  - [为什么 selector 改变并将持久对象返回给`mapStateToProps` 会阻止 React-Redux 重新渲染包装的组件？](#why-does-a-selector-mutating-and-returning-a-persistent-object-to-mapstatetoprops-prevent-react-redux-from-re-rendering-a-wrapped-component)
  - [不变性如何使浅检查能够检测对象改变？](#how-does-immutability-enable-a-shallow-check-to-detect-object-mutations)
  - [reducer 中的不变性如何导致组件不必要地渲染？](#how-can-immutability-in-your-reducers-cause-components-to-render-unnecessarily)
  - [mapStateToProps 中的不变性如何导致组件不必要地渲染？](#how-can-immutability-in-mapstatetoprops-cause-components-to-render-unnecessarily)
- [有哪些方法可以处理数据不变性？ 我必须使用 Immer 吗？](#what-approaches-are-there-for-handling-data-immutability-do-i-have-to-use-immer)
- [使用 JavaScript 进行不可变操作有什么问题？](#what-are-the-issues-with-using-plain-javascript-for-immutable-operations)

## 不变性有什么好处？

不变性可以为你的应用程序带来更高的性能，并导致更简单的编程和调试，因为从不可更改的数据比在整个应用程序中可以随意更改的数据更容易推理。

特别是，Web 应用程序上下文中的不变性使得复杂的变更检测技术能够简单而廉价地实现，确保仅在绝对必要时才发生计算昂贵的更新 DOM 过程（React 相对于其他库的性能改进的基石）.

#### 更多信息

**文章**

- [Immer 介绍](https://immerjs.github.io/immer/)
- [JavaScript 不变性演示文稿（PDF - 请参阅幻灯片 12 了解好处）](https://www.jfokus.se/jfokus16/preso/JavaScript-Immutability--Dont-Go-Changing.pdf)
- [React：优化性能](https://facebook.github.io/react/docs/optimizing-performance.html)
- [2015 年的 JavaScript 应用程序架构](https://medium.com/google-developers/javascript-application-architecture-on-the-road-to-2015-d8125811101b#.djje0rfys)

## 为什么 Redux 需要不可变性？

- Redux 和 React-Redux 都使用 [浅相等检查](#how-do-shallow-and-deep-equality-checking-differ)。 特别是： - Redux 的 `combineReducers` 实用程序 [浅检查引用更改]（#how-does-redux-use-shallow-equality-checking）由它调用的 reducer 引起。 - React-Redux 的 `connect` 方法生成 [浅检查对根状态的引用更改]（#how-does-react-redux-use-shallow-equality-checking）的组件，以及来自 `mapStateToProps` 函数的返回值看看被包装的组件是否真的需要重新渲染。这样的[浅检查需要不变性]。（#why-will-shallow-equality-checking-not-work-with-mutable-objects）才能正常工作。
- 不可变的数据管理最终使数据处理更安全。
- 时间旅行调试要求 reducer 是没有副作用的纯函数，这样你就可以正确地在不同的 state 之间跳转。

#### 更多信息

**文档**

- [Recipes: Reducer 概念的先决条件](../recipes/structuring-reducers/PrerequisiteConcepts.md)

**Discussions**

- [Reddit: 为什么 Redux 需要 Reducer 成为纯函数](https://www.reddit.com/r/reactjs/comments/5ecqqv/why_redux_need_reducers_to_be_pure_functions/dacmmjh/?context=3)

## 为什么 Redux 使用浅相等检查需要不可变性？

如果要正确更新任何连接的组件，Redux 需要不变性的浅相等检查。要了解原因，我们需要了解 JavaScript 中浅层和深层相等检查之间的区别。

### 浅相等检查和深相等检查有何不同？

浅相等检查（或 _reference相等_）只是检查两个不同的 _variables_ 引用同一个对象；相反，深度相等检查（或 _值相等_）必须检查两个对象属性的每个 _值_。

因此，浅相等性检查与 `a === b` 一样简单（并且同样快速），而深层相等性检查涉及递归遍历两个对象的属性，在每一步比较每个属性的值。

正是为了提高性能，Redux 使用了浅相等检查。

#### 更多信息

**文章**

- [在 React.js 中使用不变性的优点和缺点](https://reactkungfu.com/2015/08/pros-and-cons-of-using-immutability-with-react-js/)

### Redux 如何使用浅相等检查？

Redux 在其 `combineReducers` 函数中使用浅相等检查来返回根 state 对象的新更改副本，或者，如果没有发生任何更改，则返回当前根 state 对象。

#### 更多信息

**文档**

- [API: combineReducers](../api/combineReducers.md)

#### `combineReducers` 如何使用浅相等检查？

Redux store 的[推荐结构](./Reducers.md#reducers-share-state) 是将 state 对象按键拆分成多个“slices” 或 “domains”，并提供单独的 reducer 函数来管理每个个体的数据 slice。

`combineReducers` 的 `reducers` 参数使得这种结构更加容易，该参数被定义为包含一组键/值对的哈希表，其中每个键是 state slice 的名称，对应的值是将作用于它的 reducer 函数。

因此，例如，如果你的 state 是 `{ todos, counter }`，则对 `combineReducers` 的调用将是：

```js
combineReducers({ todos: myTodosReducer, counter: myCounterReducer })
```

where:

- 键 `todos` 和 `counter` 分别指向一个单独的 state slice；
- 值 `myTodosReducer` 和 `myCounterReducer` 是 reducer 函数，每个函数都作用于由相应键标识的 state slice。

`combineReducers` 遍历每个键/值对。 对于每次迭代，它：

- 创建对每个键所引用的当前 state slice 的引用；
- 调用适当的 reducer 并将 slice 传递给它；
- 创建对 reducer 返回的可能改变的 state slice 的引用。

随着迭代的继续，`combineReducers` 将构造一个新的 state 对象，其中包含从每个 reducer 返回的 state slice。 这个新的 state 对象可能与当前 state 对象不同，也可能不同。 正是在这里，`combineReducers` 使用浅相等检查来确定 state 是否已更改。

具体来说，在迭代的每个阶段，`combineReducers` 对当前 state slice 和从 reducer 返回的 state slice 执行浅相等检查。 如果 reducer 返回一个新对象，浅相等检查将失败，并且 `combineReducers` 会将 `hasChanged` 标志设置为 true。

迭代完成后，`combineReducers` 将检查 `hasChanged` 标志的 state。 如果为真，则返回新构造的 state 对象。 如果为 false，则返回 _current_ state 对象。

这一点值得强调：_如果 reducer 都返回传递给它们的相同 `state` 对象，那么 `combineReducers` 将返回 *current* 根 state 对象，而不是新更新的。_

#### 更多信息

**文档**

- [API: combineReducers](../api/combineReducers.md)
- [Redux FAQ - 如何在两个 reducer 之间共享 state？ 我必须使用 “combineReducers” 吗？](./Reducers.md#reducers-share-state)

**Video**

- [Egghead.io: Redux: 从头开始实现 combineReducers()](https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch)

### React-Redux 如何使用浅相等检查？

React-Redux 使用浅相等检查来确定它所包装的组件是否需要重新渲染。

为此，它假设被包装的组件是纯的；也就是说，该组件将产生[相同的结果（给定相同的 prop 和 state）](https://react-redux.js.org/troubleshooting#my-views-aren-t-updating-when-something-changes-outside-of-redux).

通过假设被包装的组件是纯的，它只需要检查根 state 对象或从 `mapStateToProps` 返回的值是否发生了变化。如果没有，则包装的组件不需要重新渲染。

它通过保留对根 state 对象的引用以及对从 `mapStateToProps` 函数返回的 props 对象中的 _each value_ 的引用来检测更改。

然后，它对其对根 state 对象的引用和传递给它的 state 对象进行浅相等检查，并再次对每个 props 对象值的引用以及从运行 `mapStateToProps` 函数返回的值进行一系列单独的浅检查。

#### 更多信息

**文档**

- [React-Redux Bindings](https://react-redux.js.org)

**文章**

- [API: React-Redux’s 链接函数和 `mapStateToProps`](https://react-redux.js.org/using-react-redux/connect-mapstate)
- [Redux FAQ: 为什么我的组件没有重新渲染，或者我的 `mapStateToProps` 没有运行？](./ReactRedux.md#why-isnt-my-component-re-rendering-or-my-mapstatetoprops-running)

### 为什么 React-Redux 会浅检查从 `mapStateToProp` 返回的 props 对象中的每个值？

React-Redux 对 props 对象中的每个 _value_ 执行浅相等检查，而不是 props 对象本身。

这样做是因为 props 对象实际上是 prop 名称及其值（或用于检索或生成值的 selector 函数）的哈希，例如在此示例中：

```js
function mapStateToProps(state) {
  return {
    todos: state.todos, // prop value
    visibleTodos: getVisibleTodos(state) // selector
  }
}

export default connect(mapStateToProps)(TodoApp)
```

因此，对重复调用 `mapStateToProps` 返回的 props 对象的浅相等检查总是失败，因为每次都会返回一个新对象。

因此，React-Redux 对返回的 props 对象中的每个 _value_ 保持单独的引用。

#### 更多信息

**文章**

- [React.js 纯渲染性能的反面模式](https://medium.com/@esamatti/react-js-pure-render-performance-anti-pattern-fb88c101332f#.gh07cm24f)

### React-Redux 如何使用浅相等检查来确定组件是否需要重新渲染？

每次 React-Redux 的 “connect” 函数被调用时，它都会对其存储的根 state 对象的引用以及从 store 传递给它的当前根 state 对象执行浅相等性检查。如果检查通过，则根 state 对象尚未更新，因此无需重新呈现组件，甚至无需调用 “mapStateToProps”。

但是，如果检查失败，则根 state 对象 _has_ 已更新，因此 `connect` 将调用 `mapStateToProps` 以查看包装组件的 props 是否已更新。

它通过单独对对象中的每个值执行浅相等检查来做到这一点，并且只有在其中一个检查失败时才会触发重新渲染。

在下面的示例中，如果 `state.todos` 和从 `getVisibleTodos()` 返回的值在连续调用 `connect` 时没有改变，那么组件将不会重新渲染。

```js
function mapStateToProps(state) {
  return {
    todos: state.todos, // prop value
    visibleTodos: getVisibleTodos(state) // selector
  }
}

export default connect(mapStateToProps)(TodoApp)
```

相反，在下一个示例（如下）中，组件将 _总是_ 重新渲染，因为 `todos` 的值始终是一个新对象，无论其值是否更改：

```js
// AVOID - 总是会导致重新渲染
function mapStateToProps(state) {
  return {
    // todos 总是引用一个新创建的对象
    todos: {
      all: state.todos,
      visibleTodos: getVisibleTodos(state)
    }
  }
}

export default connect(mapStateToProps)(TodoApp)
```

如果从 `mapStateToProps` 返回的新值与 React-Redux 保留引用的先前值之间的浅相等检查失败，则将触发组件的重新渲染。

#### 更多信息

**文章**

- [实用 Redux，第 6 部分：连接列表、表单和性能](https://blog.isquaredsoftware.com/2017/01/practical-redux-part-6-connected-lists-forms-and-performance/)
- [React.js 纯渲染性能的反面模式](https://medium.com/@esamatti/react-js-pure-render-performance-anti-pattern-fb88c101332f#.sb708slq6)
- [高性能 Redux 应用程序](https://somebody32.github.io/high-performance-redux/)

**讨论**

- [#1816: 使用 `mapStateToProps` 连接到 state 的组件](https://github.com/reduxjs/redux/issues/1816)
- [#300: 潜在的 connect() 优化](https://github.com/reduxjs/react-redux/issues/300)

### 为什么浅相等检查不适用于可变对象？

如果该对象是可变的，则不能使用浅相等检查来检测函数是否改变了传递给它的对象。

这是因为引用同一个对象的两个变量 _总是_ 相等，无论对象的值是否改变，因为它们都引用同一个对象。 因此，以下将始终返回 true：

```js
function mutateObj(obj) {
  obj.key = 'newValue'
  return obj
}

const param = { key: 'originalValue' }
const returnVal = mutateObj(param)

param === returnVal
//> true
```

`param` 和 `returnValue` 的浅检查只是检查两个变量是否引用同一个对象。`mutateObj()` 可能会返回 `obj` 的修改后的版本，但它仍然与传入的对象相同。它的值已经在 `mutateObj` 中更改的事实对于浅层检查一点也不重要。

#### 更多信息

**文章**

- [在 React.js 中使用不变性的优点和缺点](https://reactkungfu.com/2015/08/pros-and-cons-of-using-immutability-with-react-js/)

### 使用可变对象进行浅相等检查是否会导致 Redux 出现问题？

使用可变对象进行浅相等性检查不会导致 Redux 出现问题，但是[它会导致依赖于 store 的库出现问题，例如 React-Redux](#shallow-checking-problems-with-react-redux)。

具体来说，如果 `combineReducers` 传递给 reducer 的 state slice 是可变对象，reducer 可以直接修改并返回。

如果是这样，`combineReducers` 执行的浅相等检查将始终通过，因为 reducer 返回的 state slice 的值可能已经发生了变化，但对象本身没有 - 它仍然是传递给 reducer。

因此，`combineReducers` 不会设置它的 `hasChanged` 标志，即使 state 已经改变。 如果没有其他 reducer 返回一个新的、更新的 state slice，`hasChanged` 标志将保持设置为 false，导致 `combineReducers` 返回 _existing_ 根 state 对象。

store 仍然会使用根 state 的新值进行更新，但是由于根 state 对象本身仍然是同一个对象，绑定到 Redux 的库，例如 React-Redux，将不会意识到 state 的变化，并且 所以不会触发包装组件的重新渲染。

#### 更多信息

**文档**

- [Recipes: 不可变的更新模式](../recipes/structuring-reducers/ImmutableUpdatePatterns.md)
- [Troubleshooting: 永远不要改变 reducer 参数](../recipes/Troubleshooting.md#never-mutate-reducer-arguments)

### 为什么改变 state 的 reducer 会阻止 React-Redux 重新渲染包装的组件？

如果 Redux reducer 直接改变并返回传递给它的 state 对象，根 state 对象的值会改变，但对象本身不会改变。

因为 React-Redux 对根 state 对象执行浅检查以确定其包装的组件是否需要重新渲染，所以它无法检测到 state 改变，因此不会触发重新渲染。

#### 更多信息

**文档**

- [Troubleshooting: 当 Redux 之外的某些内容发生变化时，我的视图不会更新](https://react-redux.js.org/troubleshooting#my-views-aren-t-updating-when-something-changes-outside-of-redux)

### 为什么 selector 修改并将持久对象返回给 `mapStateToProps` 会阻止 React-Redux 重新渲染包装的组件？

如果从 `mapStateToProps` 返回的 props 对象的值之一是在对 `connect` 的调用中持续存在的对象（例如，可能是根 state 对象），但直接更改是由 selector 函数返回，React-Redux 将无法检测到更改，因此不会触发包装组件的重新渲染。

正如我们所见，selector 函数返回的可变对象中的值可能已经改变，但对象本身没有改变，浅相等性检查只比较对象本身，而不是它们的值。

例如，以下 `mapStateToProps` 函数永远不会触发重新渲染：

```js
// 在 Redux store 中保存的 state 对象
const state = {
  user: {
    accessCount: 0,
    name: 'keith'
  }
}

// Selector function
const getUser = state => {
  ++state.user.accessCount // 改变 state 对象
  return state
}

// mapStateToProps
const mapStateToProps = state => ({
  // 从 getUser() 返回的对象始终是同一个对象，因此这个包装的组件永远不会重新渲染，即使它已经发生了改变
  userRecord: getUser(state)
})

const a = mapStateToProps(state)
const b = mapStateToProps(state)

a.userRecord === b.userRecord
//> true
```

请注意，相反，如果使用 _immutable_ 对象，[组件可能会在不应该重新渲染时重新渲染](#immutability-issues-with-react-redux)。

#### 更多信息

**文章**

- [实用 Redux，第 6 部分：连接列表、表单和性能](https://blog.isquaredsoftware.com/2017/01/practical-redux-part-6-connected-lists-forms-and-performance/)

**Discussions**

- [#1948: getMappedItems 是 mapStateToProps 中的反面模式吗？](https://github.com/reduxjs/redux/issues/1948)

### 不变性如何使浅检查能够检测对象改变？

如果对象是不可变的，则需要在函数内对其进行的任何更改都必须对对象的 _copy_ 进行。

这个变异的副本是与传入函数的对象 _分开_ 的对象，因此当它返回时，浅检查会将其识别为与传入的对象不同的对象，因此会失败。

#### 更多信息

**文章**

- [在 React.js 中使用不变性的优点和缺点](https://reactkungfu.com/2015/08/pros-and-cons-of-using-immutability-with-react-js/)

### Reducer 中的不变性如何导致组件不必要地渲染？

你不能改变一个不可变的对象；相反，你必须对其副本进行改变，保持原件完好无损。

当你改变副本时这完全没问题，但是在 reducer 的上下文中，如果你返回一个 _hasn't_ 被改变的副本，Redux 的 `combineReducers` 函数仍然会认为 state 需要更新，因为你正在返回与传入的 state slice 对象完全不同的对象。

然后，`combineReducers` 会将这个新的根 state 对象返回给 store。 新对象将具有与当前根 state 对象相同的值，但由于它是不同的对象，它将导致存储更新，最终将导致所有连接的组件不必要地重新渲染。

为了防止这种情况发生，你必须 _总是返回传递给 reducer 的 state slice 对象，如果 reducer 没有改变 state。_

#### 更多信息

**文章**

- [React.js 纯渲染性能反面模式](https://medium.com/@esamatti/react-js-pure-render-performance-anti-pattern-fb88c101332f#.5hmnwygsy)
- [使用 React 和 Redux 构建高效的 UI](https://www.toptal.com/react/react-redux-and-immutablejs)

### `mapStateToProps` 中的不变性如何导致组件不必要地渲染？

某些不可变操作，例如数组过滤器，将始终返回一个新对象，即使值本身没有更改。

如果在 `mapStateToProps` 中将此类操作用作 selector 函数，React-Redux 对每个值执行的浅相等检查
在返回的 props 对象中总是会失败，因为 selector 每次都返回一个新对象。

因此，即使那个新对象的值没有改变，被包装的组件总是会被重新渲染，

例如，以下将始终触发重新渲染：

```js
// JavaScript 数组的 'filter' 方法将数组视为不可变的，并返回该数组的过滤副本。
const getVisibleTodos = todos => todos.filter(t => !t.completed)

const state = {
  todos: [
    {
      text: 'do todo 1',
      completed: false
    },
    {
      text: 'do todo 2',
      completed: true
    }
  ]
}

const mapStateToProps = state => ({
  // getVisibleTodos() 总是返回一个新数组，因此 'visibleToDos' 属性将总是引用一个不同的数组，导致被包装的组件重新渲染，即使数组的值没有改变
  visibleToDos: getVisibleTodos(state.todos)
})

const a = mapStateToProps(state)
// 使用完全相同的参数再次调用 mapStateToProps(state)
const b = mapStateToProps(state)

a.visibleToDos
//> { "completed": false, "text": "do todo 1" }

b.visibleToDos
//> { "completed": false, "text": "do todo 1" }

a.visibleToDos === b.visibleToDos
//> false
```

请注意，相反，如果你的 props 对象中的值引用可变对象，[你的组件可能不会在应该渲染的时候渲染](#shallow-checking-stops-component-re-rendering)。

#### 更多信息

**文章**

- [React.js 纯渲染性能的反面模式](https://medium.com/@esamatti/react-js-pure-render-performance-anti-pattern-fb88c101332f#.b8bpx1ncj)
- [使用 React 和 Redux 构建高效的 UI](https://www.toptal.com/react/react-redux-and-immutablejs)
- [ImmutableJS: 物有所值吗？](https://medium.com/@AlexFaunt/immutablejs-worth-the-price-66391b8742d4#.a3alci2g8)

## 有哪些方法可以处理数据不变性？我必须使用 Immer 吗？

你不需要将 Immer 与 Redux 一起使用。 如果编写正确，纯 JavaScript 完全能够提供不可变性，而无需使用以不可变为中心的库。

然而，用 JavaScript 保证不变性是很困难的，而且很容易意外地改变一个对象，导致你的应用程序中的错误非常难以定位。 因此，使用 Immer 等不可变更新实用程序库可以显着提高应用程序的可靠性，并使应用程序的开发更加容易。

#### 更多信息

**讨论**

- [#1185: 问题：我应该使用不可变数据结构吗？](https://github.com/reduxjs/redux/issues/1422)
- [Immer 介绍](https://immerjs.github.io/immer/)

## 使用纯 JavaScript 进行不可变操作有什么问题？

JavaScript 从未被设计为提供有保证的不可变操作。因此，如果你选择将它用于 Redux 应用程序中的不可变操作，则需要注意几个问题。

### 意外地改变对象

使用 JavaScript，你可能很容易意外地改变一个对象（例如 Redux state 树）而没有意识到。 例如，更新深度嵌套的属性、为对象创建新的 _reference_ 而不是新对象，或者执行浅拷贝而不是深拷贝，都可能导致无意中的对象改变，甚至可能使最有经验的 JavaScript 程序员绊倒。

为避免这些问题，请确保遵循推荐的 [ES6 的不可变更新模式](../recipes/structuring-reducers/ImmutableUpdatePatterns.md)。

### 详细编码

更新复杂的嵌套 state 树可能会导致编写冗长且难以调试的冗长代码。

### 不好的表现

以不可变的方式对 JavaScript 对象和数组进行操作可能会很慢，尤其是当你的 state 态树变大时。

请记住，要更改不可变对象，您必须更改它的 _copy_，并且复制大对象可能会很慢，因为必须复制每个属性。

相比之下，像 Immer 这样的不可变库可以使用结构共享，它有效地返回一个新对象，该对象重用了从中复制的大部分现有对象。

#### 更多信息

**文档**

- [ES6 的不可变更新模式](../recipes/structuring-reducers/ImmutableUpdatePatterns.md)

**Articles**

- [深入了解 Clojure 的数据结构](https://www.slideshare.net/mohitthatte/a-deep-dive-into-clojures-data-structures-euroclojure-2015)
- [JavaScript 和不变性](https://t4d.io/javascript-and-immutability/)
- [使用 ES6 及更高版本的不可变 Javascript](https://wecodetheweb.com/2016/02/12/immutable-javascript-using-es6-and-beyond/)
- [在 React.js 中使用不变性的优点和缺点 - React Kung Fu](https://reactkungfu.com/2015/08/pros-and-cons-of-using-immutability-with-react-js/)
