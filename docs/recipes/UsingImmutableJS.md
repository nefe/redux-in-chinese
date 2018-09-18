# 结合 Immutable.JS 使用 Redux
## 目录
- [为什么应该使用 Immutable.JS 等不可变的库？](#why-use-immutable-library)
- [为什么应该选择 Immutable.JS 作为不可变的库？](#why-choose-immutable-js)
- [使用 Immutable.JS 有什么问题？](#issues-with-immutable-js)
- [Immutable.JS 是否值得使用？](#is-immutable-js-worth-effort)
- [在 Redux 中使用 Immutable.JS 有哪些最佳实践？](#immutable-js-best-practices)

<a id="why-use-immutable-library"></a>
## 为什么应该使用 Immutable.JS 等不可变的库？

Immutable.JS 不可变的库被设计旨在解决 JavaScript 中固有的不可变（Immutability）问题，为应用程序提供不可变带来的所有好处。

你是选择使用这样的库，还是坚持使用简单的 JavaScript，完全取决于你对向应用程序中添加另一个依赖是满意程度，或者取决于你是否确信使用它可以避免 JavaScript 处理不可变的方法中固有的缺陷。

无论你做何选择，请确保你熟悉[不可变，副作用和突变](http://cn.redux.js.org/docs/recipes/reducers/PrerequisiteConcepts.html#note-on-immutability-side-effects-and-mutation)的概念。尤其要确保你深入了解 JavaScript 在更新和复制值时所做的操作，以防止意外的突变（mutation）导致应用程序性能的降低，甚至完全破坏应用程序的性能。

#### 更多信息

**文档**
- [技巧：不可变，副作用和突变](http://cn.redux.js.org/docs/recipes/reducers/PrerequisiteConcepts.html#note-on-immutability-side-effects-and-mutation)

**文章**
- [Immutable.js 和函数式编程概念介绍](https://auth0.com/blog/intro-to-immutable-js/)
- [React.js 使用不可变的优点和缺点](http://reactkungfu.com/2015/08/pros-and-cons-of-using-immutability-with-react-js/)


<a id="why-choose-immutable-js"></a>
## 为什么应该选择 Immutable.JS 作为不可变的库？

Immutable.JS 旨在以一种高性能的方式提供不可变，以克服 JavaScript 不可变的局限性。其主要优点包括：

#### 保证不可变

封装在 Immutable.JS 对象中的数据永远不会发生变换（mutate）。总是会返回一个新的拷贝对象。这与 JavaScript 相反，其中一些操作不会改变数据（例如，一些数组方法，包括 map，filter，concat，forEach 等），但有一些操作会改变数据（Array 的 pop，push，splice 等）。

#### 拥有 API

Immutable.JS 提供了一组丰富的不可变对象来封装数据（例如，Maps，Lists，Sets，Records等），以及一系列操作它们的方法，包括 sort，filter，数据分组，reverse，flatten 以及创建子集等方法。

#### 性能

Immutable.JS 在实现过程中针对性能优化做了很多工作。这是非常关键的功能，因为使用不可变的数据结构可能需要进行大量昂贵的复制。尤其是对大型复杂数据集（如嵌套的 Redux state tree(状态树)）进行不可变操作时，中间可能会产生很多拷贝对象，当浏览器的垃圾回收器清理对象时，这些拷贝对象会消耗内存并降低性能。

Immutable.JS 内部通过[巧妙共享数据结构](https://medium.com/@dtinth/immutable-js-persistent-data-structures-and-structural-sharing-6d163fbd73d2#.z1g1ofrsi)避免了这种情况，最大限度地减少了拷贝数据的情况。它还能执行复杂的操作链，而不会产生不必要的（且昂贵的）中间数据克隆，这些数据很快就会被丢弃。

你决不会看到这些，当然 - 你给 Immutable.JS 对象的数据永远不会发生变化。但是，它从 Immutable.JS 中生成的 *intermediate* 数据，可以通过链式调用序列中的数据进行自由的变换。因此，你可以拥有不可变数据结构的所有优势，并且不会产生任何潜在的（或很少）性能问题。

#### 更多信息

**文章**
- [Immutable.js，持续化数据结构与结构共享](https://medium.com/@dtinth/immutable-js-persistent-data-structures-and-structural-sharing-6d163fbd73d2#.6nwctunlc)
- [PDF： JavaScript Immutability - 不要更改](https://www.jfokus.se/jfokus16/preso/JavaScript-Immutability--Dont-Go-Changing.pdf)

**库**
- [Immutable.js](https://facebook.github.io/immutable-js/)


<a id="issues-with-immutable-js"></a>
## 使用 Immutable.JS 有什么问题？

尽管功能强大，但 Immutable.JS 还是需要谨慎使用，因为它存在它自己的问题。注意，所有这些问题都可以通过谨慎编码轻松解决。

#### 交互操作困难

JavaScript 没有提供不可变的数据结构。因此，要保证 Immutable.JS 其不可变，你的数据就必须封装在 Immutable.JS 对象（例如：`Map` 或 `List` 等）中。一旦使用这种方式包裹数据，这些数据就很难与其他普通的 JavaScript 对象进行交互操作。

例如，你将不再能够通过标准 JavaScript 中的点语法或中括号引用对象的属性。相反，你必须通过 Immutable.JS 提供的 `get()` 或 `getIn()` 方法来引用它们，这些方法使用了一种笨拙的语法，通过一个字符串字符串数组访问属性，每个字符串代表一个属性的 key。

例如，你将使用 `myImmutableMap.getIn(['prop1', 'prop2', 'prop3'])` 替代 `myObj.prop1.prop2.prop3`。

这不仅使得与你自己的代码进行交互操作变得尴尬，而且还与其他库（如 lodash 或 ramda）的交互也会很尴尬，这些库都需要普通的 JavaScript 对象。

注意，Immutable.JS 对象确实包含 `toJS()` 方法，该方法会返回普通 JavaScript 数据结构形式的对象，但这种方法非常慢，广泛使用将会失去 Immutable.JS 提供的性能优势。

### 一旦使用，Immutable.JS 将遍布整个代码库

一旦使用 Immutable.JS 封装数据，你必须使用 Immutable.JS 的 `get()` 和 `getIn()` 属性访问器来访问它。

这将会在整个代码库中传播 Immutable.JS，包括潜在组件，你可能不喜欢拥有这种外部依赖关系。你的整个代码库必须知道哪些应该是 Immutable.JS 对象，哪些不是。这也会使得当你想从应用程序中移除 Immutable.JS 变得非常困难。

如下面[最佳实践部分](#immutable-js-best-practices)所述，可以通过将[应用程序逻辑与数据结构解耦](https://medium.com/@dtinth/immutable-js-persistent-data-structures-and-structural-sharing-6d163fbd73d2#.z1g1ofrsi)来避免此问题。

### 没有解构或展开运算符(Spread Operators)

因为你必须通过 Immutable.JS 本身的 `get()` 和 `getIn()` 方法来访问你的数据，所以你不能再使用 JavaScript 的解构运算符（或者提案中的 Object 扩展运算符），这使得你的代码更加冗余。

### 不适用于经常改变的小数值

Immutable.JS 最适用于数据集合，越大越好。当你的数据包含大量小而简单的 JavaScript 对象时，速度会很慢，每个对象都包含几个基本数据类型的 key。

注意：无论如何，这都不适用于 Redux state tree，该树通常为大量数据的集合。

### 难以调试

Immutable.JS 对象，如 `Map`，`List` 等可能很难调试，因为检查这样的对象会看到整个嵌套层级结构，这些层级是你不关心的 Immutable.JS 特定的属性，而且你真正关心的是实际数据被封装了几层。

要解决此问题，请使用浏览器扩展程序，如 [Immutable.js 对象格式化扩展](https://chrome.google.com/webstore/detail/immutablejs-object-format/hgldghadipiblonfkkicmgcbbijnpeog)，它在 Chrome 开发工具中显示数据，并在检查数据时隐藏 Immutable.JS 的属性。

### 破坏对象引用，导致性能较差

不可变的一个主要优点是它可以浅层平等检查，大大提高了性能。

如果两个不同的变量引用同一个不可变对象，那么对这两个变量进行简单的相等检查就足以确定它们是否相等，并且它们所引用的对象是不可变的。等式检查从不必检查任何对象属性的值，因为它是不可变的。

然而，如果封装在 Immutable.JS 对象中的数据本身就是一个对象，渐层检查起不到任何作用。这是因为 Immutable.JS 的 `toJS()` 方法会将 Immutable.JS 对象中的数据作为 JavaScript 值并返回，每次调用它时都会创建一个新对象，并且使用封装数据来分解引用。

因此，如果调用 `toJS()` 两次，并将结果赋值给两个不同的变量将导致这两个变量的等式检查失败，即时对象值本身没有改变。

如果在包装组件的 `mapStateToProps` 函数中使用 `toJS()`，这就是一个特殊的问题了，因为 React-Redux 对返回的 props 对象中的每个值都进行了简单的比较。例如，下面代码中的 `mapStateToProps` 返回的 `todos` prop 所引用的值将始终是不同的对象，因此无法通过渐层等式检查。

```js
// 避免在 mapStateToProps 中使用 .toJS() 
function mapStateToProps(state) {
  return {
    todos: state.get('todos').toJS() // 总为新对象
  }
}
```

当浅层检查失败时，React-Redux 将导致组件重新渲染。因此，在 `mapStateToProps` 中使用 `toJS()` 的方式，将导致组件重新渲染，即时值未发生变化，也会严重影响性能。

该问题可以通过在高阶组件中使用 `toJS()` 来避免，如下面[最佳实践部分](#immutable-js-best-practices)所述。

#### 更多信息

**文章**
- [Immutable.js，持续化数据结构与结构共享](https://medium.com/@dtinth/immutable-js-persistent-data-structures-and-structural-sharing-6d163fbd73d2#.hzgz7ghbe)
- [不可变的数据结构与 JavaScript](http://jlongster.com/Using-Immutable-Data-Structures-in-JavaScript)
- [React.js 纯粹渲染性能反面模式（anti-pattern）](https://medium.com/@esamatti/react-js-pure-render-performance-anti-pattern-fb88c101332f#.9ucv6hwk4)
- [使用 React 和 Redux 构建高效的用户界面](https://www.toptal.com/react/react-redux-and-immutablejs)

**Chrome 扩展程序**
- [Immutable 对象格式化扩展](https://chrome.google.com/webstore/detail/immutablejs-object-format/hgldghadipiblonfkkicmgcbbijnpeog)


<a id="is-immutable-js-worth-effort"></a>
## Immutable.JS 是否值得使用？

通常来说，是的。有各种各样的权衡和意见参考，但有很多很好的理由推荐使用。不要低估尝试追踪无意间突变的 state tree 中的属性的难度。

组件在不必要时重新渲染，在它必要时拒绝渲染，以及追踪致使出现渲染问题的错误都是非常困难的，因为渲染不正确的组件不一定是属性突变的组件。

这个问题主要是由 Redux 的 reducer 返回一个突变的 state 对象引起的。使用 Immutable.JS，此类问题根本不会出现，因此，你的应用程序中就排除了这类错误。

以上这些与它的性能以及丰富的数据操作 API 组合在一起，就是为什么值得使用 Immutable.JS 的原因了。

#### 更多信息

**文档**
- [排错：dispatch action 后什么也没有发生](https://cn.redux.js.org/docs/Troubleshooting.html#nothing-happens-when-i-dispatch-an-action)


<a id="immutable-js-best-practices"></a>
## 在 Redux 中使用 Immutable.JS 有哪些最佳实践？

Immutable.JS 可以为你的应用程序提供可靠性和显著的性能优化，但必须正确使用。如果你选择使用 Immutable.JS（记住，并不是必须使用它，还有其他不可变库可以使用），请遵循这些有见地的最佳实践，你将能充分利用它，从而不会被它可能导致的任何问题绊倒。

### 永远不要将普通的 JavaScript 对象与 Immutable.JS 混合使用

永远不要让一个普通的 JavaScript 对象包含 Immutable.JS 属性。同样，永远不要让 Immutable.JS 对象包含一个普通的 JavaScript 对象。

#### 更多信息

**文章**
- [不可变的数据结构与 JavaScript](http://jlongster.com/Using-Immutable-Data-Structures-in-JavaScript)


### 使整个 Redux state tree 成为 Immutable.JS 对象

对于使用 Redux 的应用程序来说，你的整个 state tree 应该是 Immutable.JS 对象，根本不需要使用普通的 JavaScript 对象。

* 使用 Immutable.JS 的 `fromJS()` 函数创建树。

* 使用 `combineReducers` 函数的 Immutable.JS 的感知版本，比如 [redux-immutable](https://www.npmjs.com/package/redux-immutable) 中的版本，因为 Redux 本身会将 state tree 变成一个普通的 JavaScript 对象。

* 当使用 Immutable.JS 的 `update`，`merge` 或 `set` 方法将一个 JavaScript 对象添加到一个 Immutable.JS 的 Map 或者 List 中时，要确保被添加的对象事先使用了 `fromJS()` 转为一个 Immutable 的对象。

**示例**

```js
// 避免
const newObj = { key: value }
const newState = state.setIn(['prop1'], newObj)
// newObj 作为普通的 JavaScript 对象，而不是 Immutable.JS 的 Map 类型。

// 推荐
const newObj = { key: value }
const newState = state.setIn(['prop1'], fromJS(newObj))
// newObj 现在是 Immutable.JS 的 Map 类型。
```

#### 更多信息

**文章**
- [不可变的数据结构与 JavaScript](http://jlongster.com/Using-Immutable-Data-Structures-in-JavaScript)

**库**
- [redux-immutable](https://www.npmjs.com/package/redux-immutable)


### 在除了 Dumb 组件外的组件使用 Immutable.JS 

在任何地方使用 Immutable.JS 都可以保证代码的高性能。在你的 smart 组件中，选择器中，saga 或 thunk中，action 创建函数 中，特别是你的 reducer 中都可以使用它。

但是，请不要在你的 Dumb 组件中使用 Immutable.JS。

#### 更多信息

**文章**
- [不可变的数据结构与 JavaScript](http://jlongster.com/Using-Immutable-Data-Structures-in-JavaScript)
- [React 中的 Smart 和 Dumb 组件](http://jaketrent.com/post/smart-dumb-components-react/)

### 限制对 `toJS()` 的使用

`toJS()` 是一个昂贵(性能)的函数，并且与使用 Immutable.JS 的目的相违背。避免使用它。

#### 更多信息

**议题**
- [Lee Byron 的 Twitter: "Perf tip for #immutablejs…"](https://twitter.com/leeb/status/746733697093668864)

### 你的选择器应该返回 Immutable.JS 对象

总是返回 Immutable.JS 对象。

### 在 Smart 组件中使用 Immutable.JS 对象

通过 React Redux 的 `connect` 函数访问 store 的 Smart 组件必须使用 Immutable.JS 作为选择器的返回值。以确保你避免了由于不必要的组件重新渲染而导致的潜在问题。必要时使用库来记忆选择器（例如：reselect）。

#### 更多信息

**文档**
- [技巧：计算衍生数据](http://cn.redux.js.org/docs/recipes/ComputingDerivedData.html)
- [FAQ：Immutable 数据](/faq/ImmutableData.html#immutability-issues-with-react-redux)
- [Reselect 文档：如何使用 Reselect 结合 Immutable.js？](https://github.com/reduxjs/reselect/#q-how-do-i-use-reselect-with-immutablejs)

**文章**
- [Redux 模式和反面模式](https://tech.affirm.com/redux-patterns-and-anti-patterns-7d80ef3d53bc#.451p9ycfy)

**库**
- [Reselect: Redux 的选择器库](https://github.com/reduxjs/reselect)

### 绝对不要在 `mapStateToProps` 中使用 `toJS()`

使用 `toJS()` 将 Immutable.JS 对象转换为 JavaScript 对象时，每次都会返回一个新的对象。如果在 `mapStateToProps` 中执行此操作，则会导致组件在每次 state tree 更改时都认为该对象已更改，因此会触发不必要的重新渲染。

#### 更多信息

**文档**
- [FAQ: Immutable 数据](http://cn.redux.js.org/docs/faq/ImmutableData.html#how-can-immutability-in-mapstatetoprops-cause-components-to-render-unnecessarily)

### 永远不要在你的 Dumb 组件中使用 Immutable.JS

你的 dumb 组件应该是纯粹的；也就是说，它们应该在给定相同的输入的情况下产生相同的输出，并不具有外部依赖性。如果你将这一一个组件作为 props 传递给一个 Immutable.JS 对象，那么你需要依赖 Immutable.JS 来提取 props 的值，并以其他的方式操纵它。

这种依赖性会导致组件不纯，使组件测试更加困难，并且使组件复用和重构变得非常困难。

#### 更多信息

**文章**
- [不可变的数据结构与 JavaScript](http://jlongster.com/Using-Immutable-Data-Structures-in-JavaScript)
- [React 中的 Smart 和 Dumb 组件](http://jaketrent.com/post/smart-dumb-components-react/)
- [更好的 Redux 体系结构的小贴士：企业规模的经验教训](https://hashnode.com/post/tips-for-a-better-redux-architecture-lessons-for-enterprise-scale-civrlqhuy0keqc6539boivk2f)

### 使用高阶组件来转换从 Smart 组件的 Immutable.JS props 到 Dumb 组件的 JavaScript props

有些东西需要将 Smart 组件中的 Immutable.JS props 映射到 Dumb 组件中的纯 JavaScript props。这里的有些东西是指高阶组件（HOC），它只需从 Smart 组件中获取 Immutable.JS props，然后使用 `toJS()` 将它们转换为普通 JavaScript props，然后传递给你的 Dumb 组件。

这是一个关于 HOC 的例子：

```js
import React from 'react'
import { Iterable } from 'immutable'

export const toJS = WrappedComponent => wrappedComponentProps => {
  const KEY = 0
  const VALUE = 1

  const propsJS = Object.entries(
    wrappedComponentProps
  ).reduce((newProps, wrappedComponentProp) => {
    newProps[wrappedComponentProp[KEY]] = Iterable.isIterable(
      wrappedComponentProp[VALUE]
    )
      ? wrappedComponentProp[VALUE].toJS()
      : wrappedComponentProp[VALUE]
    return newProps
  }, {})

  return <WrappedComponent {...propsJS} />
}
```

以下为如何在 Smart 组件中使用它：

```js
import { connect } from 'react-redux'

import { toJS } from './to-js'
import DumbComponent from './dumb.component'

const mapStateToProps = state => {
  return {
    // obj 是一个 Smart 组件中的不可变对象，
    // 但它通过 toJS 被转换为普通 JavaScript 对象，并以纯 JavaScript 的形式传递给 Dumb 组件对象。
    // 因为它在 mapStateToProps 中仍然是 Immutable.JS 对象，
    // 虽然，这是无疑是错误重新渲染。
    obj: getImmutableObjectFromStateTree(state)
  }
}
export default connect(mapStateToProps)(toJS(DumbComponent))
```
通过在 HOC 中将 Immutable.JS 对象转换为纯 JavaScript 值，我们实现了 Dumb 的可移植性，也没在 Smart 组件中使用 `toJS()` 影响性能。

_注意: 如果你的应用程序需要高性能，你可能需要完全避免使用 `toJS()`，所以必须在你的 Dumb 组件中使用 Immutable.JS。但是，对于大多数应用程序来说并非如此，将 Immutable 保留在 Dumb 组件（可维护性，可移植性和更简单的测试）等方面的好处远远超过了保持它任何方面性能优化。_

_另外，在高阶组件中使用 `toJS` 应该不会引起任何性能的下降，因为只有在 connect 组件的 props 改变时才会调用组件。与任何性能问题一样，在决定优化什么之前先进行性能检测。_

#### 更多信息

**文档**
- [React：高阶组件](https://facebook.github.io/react/docs/higher-order-components.html)

**文章**
- [深入了解 React 的高阶组件](https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e#.dw2qd1o1g)

**议题**
- [Reddit: acemarke 和 cpsubrian 对 Dan Abramov 的评论：Redux 不是一种架构或设计模式，它只是一个库。](https://www.reddit.com/r/javascript/comments/4rcqpx/dan_abramov_redux_is_not_an_architecture_or/d5rw0p9/?context=3)

**Gists**
- [cpsubrian: React decorators for redux/react-router/immutable ‘smart’ components](https://gist.github.com/cpsubrian/79e97b6116ab68bd189eb4917203242c#file-tojs-js)

### 使用不可变对象格式化 Chrome 扩展来辅助调试

安装 [Immutable 对象格式化扩展](https://chrome.google.com/webstore/detail/immutablejs-object-format/hgldghadipiblonfkkicmgcbbijnpeog)，并检查你的 Immutable.JS 数据，而不会看到 Immutable.JS 本身的对象属性混淆视听。

#### 更多信息

**Chrome 扩展**
- [Immutable 对象格式化扩展](https://chrome.google.com/webstore/detail/immutablejs-object-format/hgldghadipiblonfkkicmgcbbijnpeog)
