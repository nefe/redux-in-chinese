# Redux 常见问题：不可变对象

## 目录
- [不变性（immutability）的好处有哪些？](#benefits-of-immutability)
- [为什么 Redux 需要不变性？](#why-is-immutability-required)
- [为什么 Redux 对浅层比较的使用要求不变性？](#redux-shallow-checking-requires-immutability)
	- [浅层比较和深层比较有何区别？](#shallow-and-deep-equality-checking)
	- [Redux 是如何使用浅对比的？](#how-redux-uses-shallow-checking)
	- [`combineReducers` 是如何进行浅层检查的？](#how-combine-reducers-uses-shallow-checking)
	- [React-Redux 是如何使用浅层检查的？](#how-react-redux-uses-shallow-checking)
	- [React-Redux 是如何使用浅对比来决定组件是否需要重新渲染的？](#how-react-redux-determines-need-for-re-rendering)
	- [为什么在使用可变对象时不能用浅对比？](#no-shallow-equality-checking-with-mutable-objects)
	- [使用浅对比检查一个可变对象对 Redux 会造成问题吗？](#shallow-checking-problems-with-redux)
  - [为什么 reducer 直接修改 state 会导致 React-Redux 不重新渲染包装的组件？](#shallow-checking-problems-with-react-redux)
	- [为什么 `mapStateToProps` 的 selector 直接修改并返回一个对象时，React-Redux 包装的组件不会重新渲染？](#shallow-checking-stops-component-re-rendering)
	- [“不变性”如何使得浅对比检测到对象变化的？](#immutability-enables-shallow-checking)
- [reducer 中的不变性是如何导致组件非必要渲染的？](#immutability-issues-with-redux)
- [mapStateToProps 中的不变性是如何导致组件非必要渲染的？](#immutability-issues-with-react-redux)
- [处理不可变数据都有哪些途径？一定要用 Immutable.JS吗？](#do-i-have-to-use-immutable-js)
- [原生 JavaScript 进行不可变操作会遇到哪些问题？](#issues-with-es6-for-immutable-ops)


<a id="benefits-of-immutability"></a>
## 不变性的好处有哪些
不变性可以给你的应用带来性能提升，也可以带来更简单的编程和调试体验。这是因为，与那些在整个应用中可被随意篡改的数据相比，永远不变的数据更容易追踪，推导。

特别来说，在 Web 应用中对于不变性的使用，可以让成熟的变化检测机制得以简单快速的实现。这保证了代价高昂的 DOM 更新过程只在真正需要的时候进行（这也是 React 性能方面优于其他类库的基石）。

#### 更多信息

**文章**
- [Introduction to Immutable.js and Functional Programming Concepts](https://auth0.com/blog/intro-to-immutable-js/)
- [JavaScript Immutability presentation (PDF - see slide 12 for benefits)](https://www.jfokus.se/jfokus16/preso/JavaScript-Immutability--Dont-Go-Changing.pdf)
- [Immutable.js - Immutable Collections for JavaScript](https://facebook.github.io/immutable-js/#the-case-for-immutability)
- [React: Optimizing Performance](https://facebook.github.io/react/docs/optimizing-performance.html)
- [JavaScript Application Architecture On The Road To 2015](https://medium.com/google-developers/javascript-application-architecture-on-the-road-to-2015-d8125811101b#.djje0rfys)


<a id="why-is-immutability-required"></a>
## 为什么 Redux 需要不变性？
- Redux 和 React-Redux 都使用了[浅对比](#shallow-and-deep-equality-checking)。具体来说：
  - Redux 的 `combineReducers` 调用 reducer 造成引用发生变化时，[进行浅对比](#how-redux-uses-shallow-checking)
  - React-Redux 的 `connect` 方法生成的组件[与根 state 进行浅对比](#how-react-redux-uses-shallow-checking)，以及 `mapStateToProps` 函数的返回值，来判断被包裹的组件是否需要重新渲染。 
以上[浅对比需要不变性](#redux-shallow-checking-requires-immutability)才能正常工作
- 不可变数据的管理极大地提升了数据处理的安全性。
- 进行时间旅行调试要求 reducer 是一个没有副作用的纯函数，以此在不同 state 之间正确的移动。

#### 更多信息

**文档**
- [Recipes: Prerequisite Reducer Concepts](http://redux.js.org/docs/recipes/reducers/PrerequisiteConcepts.html)

**讨论**
- [Reddit: Why Redux Needs Reducers To Be Pure Functions](https://www.reddit.com/r/reactjs/comments/5ecqqv/why_redux_need_reducers_to_be_pure_functions/dacmmjh/?context=3)


<a id="redux-shallow-checking-requires-immutability"></a>
## 为什么 Redux 对浅对比的使用要求不变性？
Redux 对浅对比的使用要求不变性，以保证任何连接的组件能被正确渲染。要了解原因，我们需要理解 Javascript 中浅比较和深比较的区别。


<a id="shallow-and-deep-equality-checking"></a>
### 浅对比和深对比有何区别？
浅对比（也被称为 **引用相等**）只检查两个不同 **变量** 是否为同一对象的引用；与之相反，深对比（也被称为 **原值相等**）必须检查两个对象所有属性的 **值** 是否相等。

所以，浅对比就是简单的（且快速的）`a === b`，而深对比需要以递归的方式遍历两个对象的所有属性，每一个循环中对比各个属性的值。

正是因为性能考虑，Redux 使用浅对比。

#### 更多信息

**文章**
- [Pros and Cons of using immutability with React.js](http://reactkungfu.com/2015/08/pros-and-cons-of-using-immutability-with-react-js/)

<a id="how-redux-uses-shallow-checking"></a>
### Redux 是如何使用浅对比的？
Redux 在 `combineReducers` 函数中使用浅层检查来返回根 state 对象（root state object）经过修改的拷贝，在没有修改时，返回当前根 state 对象。

#### 更多信息

**文档**
- [API: combineReducers](http://redux.js.org/docs/api/combineReducers.html)


<a id="how-combine-reducers-uses-shallow-checking"></a>
#### `combineReducers` 是如何进行浅层检查的？
Redux 中 store [推荐的结构](http://cn.redux.js.org/docs/faq/Reducers.html#reducers-share-state) 是将 state 对象按键值切分成 “层”（slice） 或者 “域”（domain），并提供独立的 reducer 方法管理各自的数据层。

`combineReducers` 接受 `reducers` 参数简化了该模型。`reducers` 参数是一组键值对组成的哈希表，其中键是每个数据层的名字，而相应的值是响应该数据层的 reducer 函数。

举例说明，如果你的 state 结构是 `{ todos, counter }`，调用 `combineReducers` 即：
```js
combineReducers({ todos: myTodosReducer, counter: myCounterReducer })
```

其中：
- `todos` 和 `counter` 两个键各自是不同的 state 层。
- `myTodosReducer` 和 `myCounterReducer` 两个值是 reducer 函数，各自负责处理它们的键所对应的 state 层。

`combineReducers` 遍历所有这些键值对，对于每一次循环：
- 为每一个键代表的当前 state 层创建一个引用；
- 调用相应的 reducer 并把该数据层传递给它
- 为 reducer 返回的可能发生了变化的 state 层创建一个引用。

在循环过程中，对于每一个 reducer 返回的 state 层，`combineReducers` 都会根据其创建一个新的 state 对象。这个新的 state 对象与当前 state 对象可能有区别，也可能没有区别。于是在这里 `combineReducers` 使用浅层检查来判断 state 到底有没有发生变化。

特别来说，在循环的每一阶段，`combineReducers` 会浅对比当前 state 层与 reducer 返回的 state 层。如果 reducer 返回了新的对象，它们就不是浅相等的，而且 `combineReducers` 会把 `hasChanged` 设置为 true。

循环结束后，`combineReducers` 会检查 `hasChanged` 的值，如果为 true，就会返回新构建的 state 对象。如果为 false，就会返回**当前**state 对象。

需要强调的一点是：**如果所有 reducer 返回的 `state` 对象都与传入时一致，那么 `combineReducers` 将返回当前的根 state 对象，而不是新构建的。**

#### 更多信息

**文档**
- [API: combineReducers](http://redux.js.org/docs/api/combineReducers.html)
- [Redux FAQ - How do I share state between two reducers? do I have to use `combineReducers`?](http://redux.js.org/docs/faq/Reducers.html#reducers-share-state)

**视频**
- [Egghead.io: Redux: Implementing combineReducers() from Scratch](https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch)


<a id="how-react-redux-uses-shallow-checking"></a>
### React-Redux 是如何使用浅对比的？
React-Redux 使用浅对比来决定它包裹的组件是否需要重新渲染。

首先 React-Redux 假设被包裹的组件是一个“纯”（pure）组件，即[给定相同的 props 和 state，这个组件会返回相同的结果](https://github.com/reactjs/react-redux/blob/f4d55840a14601c3a5bdc0c3d741fc5753e87f66/docs/troubleshooting.md#my-views-arent-updating-when-something-changes-outside-of-redux)。

做出这样的假设后，React-Redux 就只需检查根 state 对象或 `mapStateToProps` 的返回值是否改变。如果没变，被包裹的组件就无需重新渲染。

为了检测改变是否发生，React-Redux 会保留一个对根 state 对象的引用，还会保留 `mapStateToProps` 返回的 props 对象的**每个值**的引用。

最后 React-Redux 会对根 state 对象的引用与传递给它的 state 对象进行浅对比，还会对每个 props 对象的每个值的引用与 `mapStateToProps` 返回的那些值进行一系列浅对比。

#### 更多信息

**文档**
- [React-Redux Bindings](http://redux.js.org/docs/basics/UsageWithReact.html)

**文章**
- [API: React-Redux’s connect function and `mapStateToProps`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)
- [Troubleshooting: My views aren’t updating when something changes outside of Redux](https://github.com/reactjs/react-redux/blob/f4d55840a14601c3a5bdc0c3d741fc5753e87f66/docs/troubleshooting.md#my-views-arent-updating-when-something-changes-outside-of-redux)



### 为什么 React-Redux 对 `mapStateToProps` 返回的 props 对象的每个值进行浅对比？
对 props 对象来说，React-Redux 会对其中的每个**值**进行浅对比，而不是 props 对象本身。

它这样做的原因是：props 对象实际上是一组由属性名和其值（或用于取值或生成值的 selector 函数）的键值对组成的。请看下例：

```js
function mapStateToProps(state) {
  return {
    todos: state.todos, // prop value
    visibleTodos: getVisibleTodos(state) // selector
  }
}

export default connect(mapStateToProps)(TodoApp)
```

像这样，重复调用 `mapStateToProps` 每次返回的 props 对象都不是浅层相等的，因为 `mapStateToProps` 总是会返回新的对象。

#### 更多信息

**文章**
- [React.js pure render performance anti-pattern](https://medium.com/@esamatti/react-js-pure-render-performance-anti-pattern-fb88c101332f#.gh07cm24f)


<a id="how-react-redux-determines-need-for-re-rendering"></a>
### React-Redux 是如何使用浅对比来决定组件是否需要重新渲染的？
每次调用 React-Redux 提供的 `connect` 函数时，它储存的根 state 对象的引用，与当前传递给 store 的根 state 对象之间，会进行浅对比。如果相等，说明根 state 对象没有变化，也就无需重新渲染组件，甚至无需调用 `mapStateToProps`。

如果发现其不相等，说明根 state 对象**已经**被更新了，这时 `connect` 会调用 `mapStateToProps` 来查看传给被包裹的组件的 props 是否被更新。

它会对该对象的每一个值各自进行浅对比，如果发现其中有不相等的才会触发重新渲染。

在下例中，调用 `connect` 后，如果 `state.todos` 以及 `getVisibleTodos()` 的返回值没有改变，组件就不会重新渲染。

```js
function mapStateToProps(state) {
  return {
    todos: state.todos, // prop value
    visibleTodos: getVisibleTodos(state) // selector
  }
}

export default connect(mapStateToProps)(TodoApp)
```

与之相反，在下例中，组件**总是**重新渲染，因为不管 `todos` 的值有没有改变，`todos` 本身总是一个新的对象。

```js
// AVOID - will always cause a re-render
function mapStateToProps(state) {
  return {
    // todos always references a newly-created object
    todos: {
      all: state.todos,
      visibleTodos: getVisibleTodos(state)
    }
  }
}

export default connect(mapStateToProps)(TodoApp)
```

`mapStateToProps` 返回的新值，与 React-Redux 保留的旧值的引用如果不是浅层相等的，组件就会被重新渲染。

#### 更多信息

**文章**
- [Practical Redux, Part 6: Connected Lists, Forms, and Performance](http://blog.isquaredsoftware.com/2017/01/practical-redux-part-6-connected-lists-forms-and-performance/)
- [React.js Pure Render Performance Anti-Pattern](https://medium.com/@esamatti/react-js-pure-render-performance-anti-pattern-fb88c101332f#.sb708slq6)
- [High Performance Redux Apps](http://somebody32.github.io/high-performance-redux/)

**讨论**
- [#1816: Component connected to state with `mapStateToProps`](https://github.com/reactjs/redux/issues/1816)
- [#300: Potential connect() optimization](https://github.com/reactjs/react-redux/issues/300)


<a id="no-shallow-equality-checking-with-mutable-objects"></a>
### 为什么在使用可变对象时不能用浅对比？
如果一个函数改变了传给它的可变对象的值，这时就不能使用浅对比。

这是因为对同一个对象的两个引用**总是**相同的，不管此对象的值有没有改变，它们都是同一个对象的引用。因此，以下这段代码总会返回 true：

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

`param` 与 `returnValue` 的浅对比只是检查了这两个对象是否为相同对象的引用，而这段代码中总是（相同的对象的引用）。`mutateObj()` 也许会改变 `obj`，但它仍是传入的对象的引用。浅对比根本无法判断 `mutateObj` 改变了它的值。

#### 更多信息

**文章**
- [Pros and Cons of using immutability with React.js](http://reactkungfu.com/2015/08/pros-and-cons-of-using-immutability-with-react-js/)


<a id="shallow-checking-problems-with-redux"></a>
### 使用浅对比检查一个可变对象对 Redux 会造成问题吗？
对于 Redux 来说，使用浅对比来检查可变对象不会造成问题，但[当你使用依赖于 store 的类库时（例如 React-Redux），就会造成问题](#shallow-checking-problems-with-react-redux)。

特别是，如果 `combineReducers` 传给某个 reducer 的 state 层是一个可变对象，reducer 就可以直接修改数据并返回。

这样一来，浅对比判断 `combineReducers` 总会相等。因为尽管 reducer 返回的 state 层可能被修改了，但这个对象本身没有，它仍是传给 reducer 的那个对象。

从而，尽管 state 发生了变化，`combineReducers` 不会改变 `hasChanged` 的值。如果所有 reducer 都没有返回新的 state 层，`hasChange` 就会始终是 false，于是 `combineReducers` 就返回**现有的**根 state 对象。

store 仍会根据新的根 state 对象进行更新，但由于根 state 对象仍然是同一个对象，绑定于 Redux 的类库（例如 React-Redux）不会觉察到 state 的变化，于是不会触发被包裹组件的重新渲染。

#### 更多信息

**文档**
- [Recipes: Immutable Update Patterns](http://redux.js.org/docs/recipes/reducers/ImmutableUpdatePatterns.html)
- [Troubleshooting: Never mutate reducer arguments](http://redux.js.org/docs/Troubleshooting.html#never-mutate-reducer-arguments)


<a id="shallow-checking-problems-with-react-redux"></a>
### 为什么 reducer 直接修改 state 会导致 React-Redux 不重新渲染包装的组件？
如果某个 Redux 的 reducer 直接修改并返回了传给它的 state 对象，那么根 state 对象的值改变了，但对象本身没有。

React-Redux 对根 state 对象进行浅对比，来决定是否要重新渲染包装的组件，因此它不会检测到 state 的变化，也就不会触发重新渲染。

#### 更多信息

**文档**
- [Troubleshooting: My views aren’t updating when something changes outside of Redux](https://github.com/reactjs/react-redux/blob/f4d55840a14601c3a5bdc0c3d741fc5753e87f66/docs/troubleshooting.md#my-views-arent-updating-when-something-changes-outside-of-redux)


<a id="shallow-checking-stops-component-re-rendering"></a>
### 为什么 `mapStateToProps` 的 selector 直接修改并返回一个对象时，React-Redux 包装的组件不会重新渲染？
如果 `mapStateToProps` 返回的 props 对象的值当中，有一个每次调用 `connect` 时都不会发生改变的对象（比如，有可能是根 state 对象），同时还是一个 selector 函数直接改变并返回的对象，那么 React-Redux 就不会检测到这次改变，也就不会触发包装的组件的重新渲染。

我们已经知道了，selector 函数返回的可变对象中的值也许改变了，但这个对象本身没有。浅对比只会检查两个对象自身，而不会对比它们的值。

比如说，下例中 `mapStateToProps` 函数永远不会触发重新渲染：

```js
// store 中的 state 对象
const state = {
  user: {
    accessCount: 0,
    name: 'keith'
  }
}

// selector 函数
const getUser = state => {
  ++state.user.accessCount // mutate the state object
  return state
}

// mapStateToProps
const mapStateToProps = state => ({
  // getUser() 返回的对象总是同一个对象，
  // 所以这个包装的组件永远不会重新渲染，
  // 尽管它已经被改变了
  userRecord: getUser(state)
})

const a = mapStateToProps(state)
const b = mapStateToProps(state)

a.userRecord === b.userRecord
//> true
```

注意，与之相反，如果使用了一个**不可变**对象，组件可能会在不该渲染时重新渲染。

#### 更多信息

**文章**
- [Practical Redux, Part 6: Connected Lists, Forms, and Performance](http://blog.isquaredsoftware.com/2017/01/practical-redux-part-6-connected-lists-forms-and-performance/)

**讨论**
- [#1948: Is getMappedItems an anti-pattern in mapStateToProps?](https://github.com/reactjs/redux/issues/1948)


<a id="immutability-enables-shallow-checking"></a>
### “不变性”如何使得浅对比检测到对象变化的？
如果某个对象是不可变的，那么一个函数需要对它进行改变时，就只能改变它的 **拷贝**。

这个被改变了的拷贝与原先传入该函数的对象**不是同一个对象**，于是当它被返回时，浅对比检查就会知道它与传入的对象不同，于是就判断为不相等。

#### 更多信息

**文章**
- [Pros and Cons of using immutability with React.js](http://reactkungfu.com/2015/08/pros-and-cons-of-using-immutability-with-react-js/)


<a id="immutability-issues-with-redux"></a>
### reducer 中的不变性是如何导致组件非必要渲染的？
你不能直接修改某个对象，你只能修改它的拷贝，并保持原对象不变。

修改拷贝完全不会造成问题。但在一个 reducer 里，如果你返回了一个**没有进行**任何修改、与原对象一模一样的拷贝，Redux 的 `combineReducers` 函数仍会认为 state 需要更新，因为你返回了一个与传入的 state 对象完全不同的对象。

`combineReducers` 会把这个新的根 state 对象返回给 store。新的对象与原有的根 state 对象的值是相同的，但由于对象本身不同，会导致 store 更新，从而所有已连接的组件都进行了毫无必要的重新渲染。

为了防止这种现象的发生，**当 reducer 没有改变 state 时，你必须直接返回的传入的 state 层。**

#### 更多信息

**文章**
- [React.js pure render performance anti-pattern](https://medium.com/@esamatti/react-js-pure-render-performance-anti-pattern-fb88c101332f#.5hmnwygsy)
- [Building Efficient UI with React and Redux](https://www.toptal.com/react/react-redux-and-immutablejs)


<a id="immutability-issues-with-react-redux"></a>
### mapStateToProps 中的不变性是如何导致组件非必要渲染的？
某些特定的不可变操作，比如数组的 filter，总会返回一个新的对象，即使这些值没有改变。

如果在 `mapStateToProps` 的 selector 函数中使用了这样的操作，那么 React-Redux 使用浅对比检查返回的 props 的值时就会认为不相等，因为 selector 每次都返回了一个新的对象。

这样一来，即使新的对象的所有值都没有改变，包装的组件也会重新渲染。

```js
// JavaScript 数组的“filter”方法认为该数组是不可变的
// 于是返回数组被 filter 后的拷贝
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
  // getVisibleTodos() 总会返回新的数组，所以
  // “visibleToDos” 属性一直会指向不同的数组，
  // 结果是即使数组的值没有改变，包装的组件也会重新渲染
  visibleToDos: getVisibleTodos(state.todos)
})

const a = mapStateToProps(state)
// 用完全相同的参数再次调用 mapStateToProps(state)
const b = mapStateToProps(state)

a.visibleToDos
//> { "completed": false, "text": "do todo 1" }

b.visibleToDos
//> { "completed": false, "text": "do todo 1" }

a.visibleToDos === b.visibleToDos
//> false
```


注意，与之相反，如果你的 props 对象中的值是可变对象，[组件可能在需要渲染时也不渲染](#shallow-checking-stops-component-re-rendering)。

#### 更多信息

**文章**
- [React.js pure render performance anti-pattern](https://medium.com/@esamatti/react-js-pure-render-performance-anti-pattern-fb88c101332f#.b8bpx1ncj)
- [Building Efficient UI with React and Redux](https://www.toptal.com/react/react-redux-and-immutablejs)
- [ImmutableJS: worth the price?](https://medium.com/@AlexFaunt/immutablejs-worth-the-price-66391b8742d4#.a3alci2g8)


<a id="do-i-have-to-use-immutable-js"></a>
## 处理不可变数据都有哪些途径？一定要用 Immutable.JS吗？
你不一定要与 Redux 一起使用 Immutable.JS。原生 JavaScript，如果书写得当，是足以达到所需的不变性，不需要使用强制不可变的类库。

但是，在 JavaScript 中保证不变性是很难的。不小心直接修改了一个对象反而很简单，这就会导致你的应用中出现极难以调试的 bug。因此，使用一个提供不可变性的类库（比如 Immutable.JS）会显著提高你的应用的可靠性，而且让你的开发更为便捷

#### 更多信息

**讨论**
- [#1185: Question: Should I use immutable data structures?](https://github.com/reactjs/redux/issues/1422)
- [Introduction to Immutable.js and Functional Programming Concepts](https://auth0.com/blog/intro-to-immutable-js/)

<a id="issues-with-es6-for-immutable-ops"></a>
## 原生 JavaScript 进行不可变操作会遇到哪些问题？
JavaSctipt 从不是为了确保不可变性而设计的。所以，有几点事项是你需要特别留意的，如果你准备在 Redux 应用中使用不可变操作的话。

### 不小心直接修改了对象
使用 JavaScript 时，你很容易一不小心直接修改了一个对象（比如 Redux 中的 state 树），甚至自己都没意识到。比如说，更新了多层嵌套中的属性、给一个对象创建了一个**引用**而不是创建一个新的对象、或者用了浅拷贝而不是深拷贝，这些都会导致非故意的对象修改，甚至经验丰富的 JavaScript 程序员都会犯此错误。

为了避免这些问题，请确保你遵守了推荐的 [ES6 不可变更新模式](http://cn.redux.js.org/docs/recipes/reducers/ImmutableUpdatePatterns.html)。

### 重复代码
更新复杂的多级嵌套的 state 树会导致重复代码的出现，这样的代码不但写起来无趣，维护起来也很困难。

### 性能问题
用不可变的方式操作 JavaScript 的对象和数组可能会很慢，特别是你的 state 树很大的时候。

记住，想要改变一个不可变对象，你必须只修改其**拷贝**，而拷贝庞大的对象可能会很慢，因为每一个属性都需要拷贝。

不过，像 Immutable.JS 这样提供不可变性的类库会进行复杂精妙的优化，比如 [结构共享](http://www.slideshare.net/mohitthatte/a-deep-dive-into-clojures-data-structures-euroclojure-2015)），它能够在返回新对象的同时复用原有对象的结构，从而更加高效地实现拷贝。

对于非常庞大的对象，原生 JavaScript 比经过优化的不可变类库 [慢 100 倍](https://medium.com/@dtinth/immutable-js-persistent-data-structures-and-structural-sharing-6d163fbd73d2#.z1g1ofrsi)。

#### 更多信息

**文档**
- [Immutable Update Patterns for ES6](http://redux.js.org/docs/recipes/reducers/ImmutableUpdatePatterns.html)

**文章**
- [Immutable.js, persistent data structures and structural sharing](https://medium.com/@dtinth/immutable-js-persistent-data-structures-and-structural-sharing-6d163fbd73d2#.a2jimoiaf)
- [A deep dive into Clojure’s data structures](http://www.slideshare.net/mohitthatte/a-deep-dive-into-clojures-data-structures-euroclojure-2015)
- [Introduction to Immutable.js and Functional Programming Concepts](https://auth0.com/blog/intro-to-immutable-js/)
- [JavaScript and Immutability](http://t4d.io/javascript-and-immutability/)
- [Immutable Javascript using ES6 and beyond](http://wecodetheweb.com/2016/02/12/immutable-javascript-using-es6-and-beyond/)
- [Pros and Cons of using immutability with React.js - React Kung Fu](http://reactkungfu.com/2015/08/pros-and-cons-of-using-immutability-with-react-js/)