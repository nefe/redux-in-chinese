# Redux 常见问题

## 目录

- **综合**
  - [何时使用 Redux ？](#general-when-to-use)
  - [Redux 只能搭配 React 使用？](#general-only-react)
  - [Redux 需要特殊的编译工具支持吗？](#general-build-tools)
- **Reducer**
  - [如何在 reducer 之间共享 state ？ combineReducers 是必须的吗？](#reducers-share-state)
  - [处理 action 必须用 switch 语句吗？](#reducers-use-switch)
- **组织 State**
  - [必须将所有 state 都维护在 Redux 中吗？ 可以用 React 的 setState() 方法吗？](#organizing-state-only-redux-state)
  - [可以将 store 的 state 设置为函数、promise或者其它非序列化值吗？](#organizing-state-non-serializable)
  - [如何在 state 中组织嵌套及重复数据？](#organizing-state-nested-data)
- **创建 Store**
  - [可以创建多个 store 吗，应该这么做吗？能在组件中直接引用 store 并使用吗？](#store-setup-multiple-stores)
  - [在 store enhancer 中可以存在多个 middleware 链吗？ 在 middleware 方法中，next 和 dispatch 之间区别是什么？](#store-setup-middleware-chains)
  - [怎样只订阅 state 的一部分变更？如何将分发的 action 作为订阅的一部分？](#store-setup-subscriptions)
- **Action**
  - [为何 type 必须是字符串，或者至少可以被序列化？ 为什么 action 类型应该作为常量？](#actions-string-constants)
  - [是否存在 reducer 和 action 之间的一对一映射？](#actions-reducer-mappings)
  - [怎样表示类似 AJAX 请求的 “副作用”？为何需要 “action 创建函数”、“thunks” 以及 “middleware” 类似的东西去处理异步行为？](#actions-side-effects)
  - [是否应该在 action 创建函数中连续分发多个 action？](#actions-multiple-actions)
- **代码结构**  
  - [文件结构应该是什么样？项目中该如何对 action 创建函数和 reducer 分组？ selector 又该放在哪里？](#structure-file-structure)
  - [如何将逻辑在 reducer 和 action 创建函数之间划分？ “业务逻辑” 应该放在哪里？](#structure-business-logic)
- **性能**
  - [考虑到性能和架构， Redux “可扩展性” 如何？](#performance-scaling)
  - [每个 action 都调用 “所有的 reducer” 会不会很慢？](#performance-all-reducers)
  - [在 reducer 中必须对 state 进行深拷贝吗？拷贝 state 不会很慢吗？](#performance-clone-state)
  - [怎样减少 store 更新事件的数量？](#performance-update-events)
  - [仅有 “一个 state 树” 会引发内存问题吗？分发多个 action 会占用内存空间吗？](#performance-state-memory)
- **React Redux**
  - [为何组件没有被重新渲染、或者 mapStateToProps 没有运行？](#react-not-rerendering)
  - [为何组件频繁的重新渲染？](#react-rendering-too-often)
  - [怎样使 mapStateToProps 执行更快？](#react-mapstate-speed)
  - [为何不在被连接的组件中使用 this.props.dispatch ？](#react-props-dispatch)
  - [应该只连接到顶层组件吗，或者可以在组件树中连接到不同组件吗？](#react-multiple-components)
- **其它**
  - [有 “真实存在” 且很庞大的 Redux 项目吗？](#miscellaneous-real-projects)
  - [如何在 Redux 中实现鉴权？](#miscellaneous-authentication)


## 综合

<a id="general-when-to-use"></a>
### 何时使用 Redux？

React 早期贡献者之一 Pete Hunt 说：

> 你应当清楚何时需要 Flux。如果你不确定是否需要它，那么其实你并不需要它。

Redux 的创建者之一 Dan Abramov 也曾表达过类似的意思:

> 我想修正一个观点：当你在使用 React 遇到问题时，才使用 Redux。

一般而言，Redux 的适应场景有以下几点特征：

- 随着时间的推移，数据处于合理的变动之中；
- 单一数据源
- 在 React 顶层组件 state 中维护所有内容的办法已经无法满足需求

#### 补充资料

**文档**
- [Introduction: Motivation](introduction/Motivation.md)

**讨论**
- [React How-To](https://github.com/petehunt/react-howto)
- [Twitter: Don't use Redux until...](https://twitter.com/dan_abramov/status/699241546248536064)
- [The Case for Flux](https://medium.com/swlh/the-case-for-flux-379b7d1982c6)
- [Stack Overflow: Why use Redux over Facebook Flux？](http://stackoverflow.com/questions/32461229/why-use-redux-over-facebook-flux)
- [Stack Overflow: Why should I use Redux in this example？](http://stackoverflow.com/questions/35675339/why-should-i-use-redux-in-this-example)
- [Stack Overflow: What could be the downsides of using Redux instead of Flux？](http://stackoverflow.com/questions/32021763/what-could-be-the-downsides-of-using-redux-instead-of-flux)

<a id="general-only-react"></a>
### Redux 只能搭配 React 使用？

Redux 能作为任何 UI 层的 store。通常是与 React 或 React Native 搭配使用，但是也可以绑定 Angular、 Angular 2、 Vue、 Mithril 等框架使用。 Redux 提供的订阅机制，可以与任何代码集成。即便如此，只有在结合声明式，即 UI 随 state 变化的视图层实现时，才能发挥它的最大作用。

<a id="general-build-tools"></a>
### Redux 需要特殊的编译工具支持吗？

Redux 写法遵循 ES6 语法，但在发布时被 Webpack 和 Babel 编译成了 ES5，所以在使用时可以忽略 JavaScript 的编译过程。 Redux 也提供了 UMD 版本，可以直接使用而不需要任何编译过程。[counter-vanilla](https://github.com/reactjs/redux/tree/master/examples/counter-vanilla) 示例展示了 Redux 基本的 ES5 用法。正如相关 pull 请求中的说法：

> Counter Vanilla 例子意图是消除 Redux 需要 Webpack、 React、 热重载、 sagas、 action 创建函数、 constants、 Babel、 npm、 CSS 模块化、 decorators、 fluent Latin、 Egghead subscription、 博士学位或者需要达到 Exceeds Expectations O.W.L. 这一级别的荒谬观点。

> 仅仅是 HTML， 一些 `<script>`  标签，和简单的 DOM 操作而已。


## Reducers

<a id="reducers-share-state"></a>
### 如何在 reducer 之间共享 state ？ combineReducers 是必须的吗？

Redux store 推荐的结构是将 state 对象按键值切分成 “层” 或者 “域”，并提供独立的 reducer 方法管理各自的数据层。就像 Flux 模式中的多个独立 store 一样， Redux 为此还提供了 [`combineReducers`](api/combineReducers.md) 工具来简化该模型。应当注意的是， `combineReducers` **不是** 必须的，它仅仅是通过简单的 JavaScript 对象作为数据，让 state 层能与 reducer 一一关联的函数而已。

许多用户想在 reducer 之间共享数据，但是 `combineReducers` 不允许此种行为。有许多可用的办法：

* 如果一个 reducer 想获取其它 state 层的数据，往往意味着 state 树需要重构，需要让单独的 reducer 处理更多的数据。
* 你可能需要自定义方法去处理这些 action，用自定义的顶层 reducer 方法替换 `combineReducers`。你可以使用类似于 [reduce-reducers](https://github.com/acdlite/reduce-reducers) 的工具运行 `combineReducers` 去处理尽可能多的 action，同时还要为存在 state 交叉部分的若干 action 执行更专用的 reducer。
* 类似于 `redux-thunk` 的 [异步 action 创建函数](advanced/AsyncActions.md) 能通过 `getState()` 方法获取所有的 state。 action 创建函数能从 state 中检索到额外的数据并传入 action，所以 reducer 有足够的信息去更新所维护的 state 层。

只需牢记 reducer 仅仅是函数，可以随心所欲的进行划分和组合，而且也推荐将其分解成更小、可复用的函数 (“reducer 合成”)。按照这种做法，如果子 reducer 需要一些参数时，可以从父 reducer 传入。你只需要确保他们遵循 reducer 的基本准则： `(state, action) => newState`，并且以不可变的方式更新 state，而不是直接修改 state。

#### 补充资料

**文档**
- [API: combineReducers](api/combineReducers.md)

**讨论**
- [#601: A concern on combineReducers, when an action is related to multiple reducers](https://github.com/reactjs/redux/issues/601)
- [#1400: Is passing top-level state object to branch reducer an anti-pattern？](https://github.com/reactjs/redux/issues/1400)
- [Stack Overflow: Accessing other parts of the state when using combined reducers？](http://stackoverflow.com/questions/34333979/accessing-other-parts-of-the-state-when-using-combined-reducers)
- [Stack Overflow: Reducing an entire subtree with redux combineReducers](http://stackoverflow.com/questions/34427851/reducing-an-entire-subtree-with-redux-combinereducers)
- [Sharing State Between Redux Reducers](https://invalidpatent.wordpress.com/2016/02/18/sharing-state-between-redux-reducers/)

<a id="reducers-use-switch"></a>
### 处理 action 必须用 `switch` 语句吗？？

不是。在 reducer 里面你可以使用任何方法响应 action。 `switch` 语句是最常用的方式，当然你也可以用 `if`、功能查找表、创建抽象函数等。

#### 补充资料

**文档**
- [Recipes: Reducing Boilerplate](recipes/ReducingBoilerplate.md)

**讨论**
- [#883: take away the huge switch block](https://github.com/reactjs/redux/issues/883)
- [#1167: Reducer without switch](https://github.com/reactjs/redux/issues/1167)


## 组织 State

<a id="organizing-state-only-redux-state"></a>
### 必须将所有 state 都维护在 Redux 中吗？ 可以用 React 的 `setState()` 方法吗？

没有 “标准”。有些用户选择将所有数据都在 Redux 中维护，那么在任何时刻，应用都是完全有序及可控的。也有人将类似于“下拉菜单是否打开”的非关键或者 UI 状态，在组件内部维护。适合自己的才是最好的。

有许多开源组件实现了各式各样在 Redux store 存储独立组件状态的替代方法，比如 [redux-ui](https://github.com/tonyhb/redux-ui)、 [redux-component](https://github.com/tomchentw/redux-component)、 [redux-react-local](https://github.com/threepointone/redux-react-local)等等。

#### 补充资料

**讨论**

- [#159: Investigate using Redux for pseudo-local component state](https://github.com/reactjs/redux/issues/159)
- [#1098: Using Redux in reusable React component](https://github.com/reactjs/redux/issues/1098)
- [#1287: How to choose between Redux's store and React's state？](https://github.com/reactjs/redux/issues/1287)
- [#1385: What are the disadvantages of storing all your state in a single immutable atom？](https://github.com/reactjs/redux/issues/1385)
- [Stack Overflow: Why is state all in one place, even state that isn't global？](http://stackoverflow.com/questions/35664594/redux-why-is-state-all-in-one-place-even-state-that-isnt-global)
- [Stack Overflow: Should all component state be kept in Redux store？](http://stackoverflow.com/questions/35328056/react-redux-should-all-component-states-be-kept-in-redux-store)

<a id="organizing-state-non-serializable"></a>
### 可以将 store 的 state 设置为函数、promise或者其它非序列化值吗？

强烈推荐只在 store 中维护普通的可序列化对象、数组以及基本数据类型。虽然从 *技术* 层面上将非序列化项保存在 store 中是可行的，但这样会破坏 store 内容持久化和深加工的能力。

#### 补充资料

**讨论**
- [#1248: Is it ok and possible to store a react component in a reducer？](https://github.com/reactjs/redux/issues/1248)
- [#1279: Have any suggestions for where to put a Map Component in Flux？](https://github.com/reactjs/redux/issues/1279)
- [#1390: Component Loading](https://github.com/reactjs/redux/issues/1390)
- [#1407: Just sharing a great base class](https://github.com/reactjs/redux/issues/1407)

<a id="organizing-state-nested-data"></a>
### 如何在 state 中组织嵌套及重复数据？

当数据存在 ID、嵌套或者关联关系时，应当以 “范式化” 形式存储：对象只能存储一次，ID 作为键值，对象间通过 ID 相互引用。将 store 类比于数据库，每一项都是独立的 “表”。[normalizr](https://github.com/gaearon/normalizr) 、 [redux-orm](https://github.com/tommikaikkonen/redux-orm) 此类的库能在管理规范化数据时提供参考和抽象。

#### 补充资料

**文档**
- [Advanced: Async Actions](advanced/AsyncActions.md)
- [Examples: Real World example](introduction/Examples.html#real-world)

**讨论**
- [#316: How to create nested reducers？](https://github.com/reactjs/redux/issues/316)
- [#815: Working with Data Structures](https://github.com/reactjs/redux/issues/815)
- [#946: Best way to update related state fields with split reducers？](https://github.com/reactjs/redux/issues/946)
- [#994: How to cut the boilerplate when updating nested entities？](https://github.com/reactjs/redux/issues/994)
- [#1255: Normalizr usage with nested objects in React/Redux](https://github.com/reactjs/redux/issues/1255)
- [Twitter: state shape should be normalized](https://twitter.com/dan_abramov/status/715507260244496384)

## 创建 Store

<a id="store-setup-multiple-stores"></a>
### 可以创建多个 store 吗，应该这么做吗？能在组件中直接引用 store 并使用吗？

Flux 原始模型中一个应用有多个 “store”，每个都维护了不同维度的数据。这样导致了类似于一个 store “等待” 另一 store 操作的问题。Redux 中将 reducer 分解成多个小而美的 reducer，进而切分数据域，避免了这种情况的发生。

正如上述问题所述，“可能” 在一个页面中创建多个独立的 Redux store，但是预设模式中只会有一个 store。仅维持单个 store 不仅可以使用 Redux DevTools，还能简化数据的持久化及深加工、精简订阅的逻辑处理。

在 Redux 中使用多个 store 的理由可能包括：

* 对应用进行性能分析时，解决由于过于频繁更新部分 state 引起的性能问题。
* 在更大的应用中 Redux 只是作为一个组件，这种情况下，你也许更倾向于为每个根组件创建单独的 store。

然而，创建新的 store 不应成为你的第一反应，特别是当你从 Flux 背景迁移而来。首先尝试组合 reducer，只有当它无法解决你的问题时才使用多个 store。

类似的，虽然你 *能* 直接导入并获取 store 实例，但这并非 Redux 的推荐方式。当你创建 store 实例并从组件导出，它将变成一个单例。这意味着将很难把 Redux 应用封装成一个应用的子组件，除非这是必要的，或者为了实现服务端渲染，因为在服务端你需要为每一个请求创建单独的 store 实例。

借助 [React Redux](https://github.com/rackt/react-redux)，由 `connect()` 生成的包装类实际上会检索存在的 `props.store`，但还是推荐将根组件包装在 `<Provider store={store}>` 中，这样传递 store 的任务都交由 React Redux 处理。这种方式，我们不用考虑 store 模块的导入、 Redux 应用的封装，后期支持服务器渲染也将变得更为简便。

#### 补充资料

**文档**
- [API: Store](api/Store.md)

**讨论**
- [#1346: Is it bad practice to just have a 'stores' directory？](https://github.com/reactjs/redux/issues/1436)
- [Stack Overflow: Redux multiple stores, why not？](http://stackoverflow.com/questions/33619775/redux-multiple-stores-why-not)
- [Stack Overflow: Accessing Redux state in an action creator](http://stackoverflow.com/questions/35667249/accessing-redux-state-in-an-action-creator)
- [Gist: Breaking out of Redux paradigm to isolate apps](https://gist.github.com/gaearon/eeee2f619620ab7b55673a4ee2bf8400)

<a id="store-setup-middleware-chains"></a>
### 在 store enhancer 中可以存在多个 middleware 链吗？ 在 middleware 方法中，`next` 和 `dispatch` 之间区别是什么？

Redux middleware 就像一个链表。每个 middleware 方法既能调用 `next(action)` 传递 action 到下一个 middleware，也可以调用 `dispatch(action)` 重新开始处理，或者什么都不做而仅仅终止 action 的处理进程。

创建 store 时， `applyMiddleware` 方法的入参定义了 middleware 链。定义多个链将无法正常执行，因为它们的 `dispatch` 引用显然是不一样的，而且不同的链也无法有效连接到一起。

#### 补充资料

**文档**
- [Advanced: Middleware](advanced/Middleware.md)
- [API: applyMiddleware](api/applyMiddleware.md)

**讨论**
- [#1051: Shortcomings of the current applyMiddleware and composing createStore](https://github.com/reactjs/redux/issues/1051)
- [Understanding Redux Middleware](https://medium.com/@meagle/understanding-87566abcfb7a)
- [Exploring Redux Middleware](http://blog.krawaller.se/posts/exploring-redux-middleware/)

<a id="store-setup-subscriptions"></a>
### 怎样只订阅 state 的一部分变更？如何将分发的 action 作为订阅的一部分？

Redux 提供了独立的 `store.subscribe` 方法用于通知监听器 store 的变更信息。监听器的回调方法并没有把当前的 state 作为入参，它仅仅代表了 *有些数据* 被更新。订阅者的逻辑中调用 `getState()` 获取当前的 state 值。

这个 API 是没有依赖及副作用的底层接口，可以用于创建订阅者逻辑。类似 React Redux 的 UI 绑定能为所有连接的组件都创建订阅。也可以用于编写智能的新旧 state 比对方法，从而在某些内容变化时执行额外的逻辑处理。示例 [redux-watch](https://github.com/jprichardson/redux-watch) 和 [redux-subscribe](https://github.com/ashaffer/redux-subscribe) 提供不同的方式用于指定订阅及处理变更。

新的 state 没有传递给监听者，目的是简化 store enhancer 的实现，比如 Redux DevTools。此外，订阅者旨在响应 state 值本身，而非 action。当 action 很重要且需要特殊处理时，使用 middleware 。

#### 补充资料

**文档**
- [Basics: Store](basics/Store.md)
- [API: Store](api/Store.md)

**讨论**
- [#303: subscribe API with state as an argument](https://github.com/reactjs/redux/issues/303)
- [#580: Is it possible to get action and state in store.subscribe？](https://github.com/reactjs/redux/issues/580)
- [#922: Proposal: add subscribe to middleware API](https://github.com/reactjs/redux/issues/922)
- [#1057: subscribe listener can get action param？](https://github.com/reactjs/redux/issues/1057)
- [#1300: Redux is great but major feature is missing](https://github.com/reactjs/redux/issues/1300)

## Actions

<a id="actions-string-constants"></a>
### 为何 `type` 必须是字符串，或者至少可以被序列化？ 为什么 action 类型应该作为常量？

和 state 一样，可序列化的 action 使得若干 Redux 的经典特性变得可能，比如时间旅行调试器、录制和重放 action。若使用 `Symbol` 等去定义 `type` 值，或者用 `instanceof` 对 action 做自检查都会破坏这些特性。字符串是可序列化的、自解释型，所以是更好的选择。注意，如果 action 目的是在 middleware 中处理，那么使用 Symbols、 Promises 或者其它非可序列化值也是 *可以* 的。 action 只有当它们正真到达 store 且被传递给 reducer 时才需要被序列化。

因为性能原因，我们无法强制序列化 action，所以 Redux 只会校验 action 是否是普通对象，以及 `type` 是否定义。其它的都交由你决定，但是确保数据是可序列化将对调试以及问题的重现有很大帮助。

封装并集聚公共代码是程序规划时的核心概念。虽然可以在任何地方手动创建 action 对象、手动指定 `type` 值，定义常量的方式使得代码的维护更为方便。如果将常量维护在单独的文件中，[在 `import` 时校验](https://www.npmjs.com/package/eslint-plugin-import)，能避免偶然的拼写错误。

#### 补充资料

**文档**
- [Reducing Boilerplate](http://rackt.github.io/redux/docs/recipes/ReducingBoilerplate.html#actions)

**Discussion**
- [#384: Recommend that Action constants be named in the past tense](https://github.com/reactjs/redux/issues/384)
- [#628: Solution for simple action creation with less boilerplate](https://github.com/reactjs/redux/issues/628)
- [#1024: Proposal: Declarative reducers](https://github.com/reactjs/redux/issues/1024)
- [#1167: Reducer without switch](https://github.com/reactjs/redux/issues/1167)
- [Stack Overflow: Why do you need 'Actions' as data in Redux？](http://stackoverflow.com/q/34759047/62937)
- [Stack Overflow: What is the point of the constants in Redux？](http://stackoverflow.com/q/34965856/62937)

<a id="actions-reducer-mappings"></a>
### 是否存在 reducer 和 action 之间的一对一映射？

没有。建议的方式是编写独立且很小的 reducer 方法去更新指定的 state 部分，这种模式被称为 “reducer 合成”。一个指定的 action 也许被它们中的全部、部分、甚至没有一个处理到。这种方式把组件从实际的数据变更中解耦，一个 action 可能影响到 state 树的不同部分，对组件而言再也不必知道这些了。有些用户选择将它们紧密绑定在一起，就像 “ducks” 文件结构，显然是没有默认的一对一映射。所以当你想在多个 reducer 中处理同一个 action 时，应当避免此类结构。

#### 补充资料

**文档**
- [Basics: Reducers](basics/Reducers.md)

**讨论**
- [Twitter: most common Redux misconception](https://twitter.com/dan_abramov/status/682923564006248448)
- [#1167: Reducer without switch](https://github.com/reactjs/redux/issues/1167)
- [Reduxible #8: Reducers and action creators aren't a one-to-one mapping](https://github.com/reduxible/reduxible/issues/8)
- [Stack Overflow: Can I dispatch multiple actions without Redux Thunk middleware？](http://stackoverflow.com/questions/35493352/can-i-dispatch-multiple-actions-without-redux-thunk-middleware/35642783)

<a id="actions-side-effects"></a>
### 怎样表示类似 AJAX 请求的 “副作用”？为何需要 “action 创建函数”、“thunks” 以及 “middleware” 类似的东西去处理异步行为？

这是一个持久且复杂的话题，针对如何组织代码以及采用何种方式有很多的观点。

任何有价值的 web 应用都必然要执行复杂的逻辑，通常包括 AJAX 请求等异步工作。这类代码不再是针对输入的纯函数，与第三方的交互被认为是 [“副作用”](https://en.wikipedia.org/wiki/Side_effect_%28computer_science%29)。

Redux 深受函数式编程的影响，创造性的不支持副作用的执行。尤其是 reducer， *必须* 是符合  `(state, action) => newState` 的纯函数。然而，Redux 的 middleware 能拦截分发的 action 并添加额外的复杂行为，有副作用时也是如此。

Redux 建议将带副作用的代码作为 action 创建过程的一部分。因为该逻辑 *能* 在 UI 组件内执行，那么通常抽取此类逻辑作为可重用的方法都是有意义的，因此同样的逻辑能被多个地方调用，也就是所谓的 action 创建函数。

最简单也是最常用的方法就是添加 [Redux Thunk](https://github.com/gaearon/redux-thunk) middleware，这样就能用更为复杂或者异步的逻辑书写 action 创建函数。另一个被广泛使用的方法是 [Redux Saga](https://github.com/yelouafi/redux-saga)，你可以用 generator 书写类同步代码，就像在 Redux 应用中使用 “后台线程” 或者 “守护进程”。还有一个方法是 [Redux Loop](https://github.com/raisemarketplace/redux-loop)，它允许 reducer 以声明副作用的方式去响应 state 变化，并让它们分别执行，从而反转了进程。除此之外，还有 *许多* 其它开源的库和理念，都有各自针对副作用的管理方法。

#### 补充资料
**文档**
- [Advanced: Async Actions](advanced/AsyncActions.md)
- [Advanced: Async Flow](advanced/AsyncFlow.md)
- [Advanced: Middleware](advanced/Middleware.md)

**讨论**
- [#291: Trying to put API calls in the right place](https://github.com/reactjs/redux/issues/291)
- [#455: Modeling side effects](https://github.com/reactjs/redux/issues/455)
- [#533: Simpler introduction to async action creators](https://github.com/reactjs/redux/issues/533)
- [#569: Proposal: API for explicit side effects](https://github.com/reactjs/redux/pull/569)
- [#1139: An alternative side effect model based on generators and sagas](https://github.com/reactjs/redux/issues/1139)
- [Stack Overflow: Why do we need middleware for async flow in Redux？](http://stackoverflow.com/questions/34570758/why-do-we-need-middleware-for-async-flow-in-redux)
- [Stack Overflow: How to dispatch a Redux action with a timeout？](http://stackoverflow.com/questions/35411423/how-to-dispatch-a-redux-action-with-a-timeout/35415559)
- [Stack Overflow: Where should I put synchronous side effects linked to actions in redux？](http://stackoverflow.com/questions/32982237/where-should-i-put-synchronous-side-effects-linked-to-actions-in-redux/33036344)
- [Stack Overflow: How to handle complex side-effects in Redux？](http://stackoverflow.com/questions/32925837/how-to-handle-complex-side-effects-in-redux/33036594)
- [Stack Overflow: How to unit test async Redux actions to mock ajax response](http://stackoverflow.com/questions/33011729/how-to-unit-test-async-redux-actions-to-mock-ajax-response/33053465)
- [Stack Overflow: How to fire AJAX calls in response to the state changes with Redux？](http://stackoverflow.com/questions/35262692/how-to-fire-ajax-calls-in-response-to-the-state-changes-with-redux/35675447)
- [Reddit: Help performing Async API calls with Redux-Promise Middleware.](https://www.reddit.com/r/reactjs/comments/469iyc/help_performing_async_api_calls_with_reduxpromise/)
- [Twitter: possible comparison between sagas, loops, and other approaches](https://twitter.com/dan_abramov/status/689639582120415232)
- [Redux Side-Effects and You](https://medium.com/@fward/redux-side-effects-and-you-66f2e0842fc3)
- [Pure functionality and side effects in Redux](http://blog.hivejs.org/building-the-ui-2/)

<a id="actions-multiple-actions"></a>
### 是否应该在 action 创建函数中连续分发多个 action？

关于如何构建 action 并没有统一的规范。使用类似 Redux Thunk 的异步 middleware 支持了更多的场景，比如分发连续多个独立且相关联的 action、 分发 action 指示 AJAX 请求的阶段、 根据 state 有条件的分发 action、甚至分发 action 并随后校验更新的 state。

通常，明确这些 action 是关联还是独立，是否应当作为一个 action。评判当前场景影响因素的同时，还需根据 action 日志权衡 reducer 的可读性。例如，一个包含新 state 树的 action 会使你的 reducer 只有一行，副作用是没有任何历史表明 *为什么* 发生了变更，进而导致调试异常困难。另一方面，如果为了维持它们的粒状结构（granular），在循环中分发 action，这表明也许需要引入新的 acton 类型并以不同的方式去处理它。

避免在同一地方连续多次以同步的方式进行分发，其性能问题是值得担忧的。如果使用 React，将多个同步分发包装在 `ReactDOM.unstable_batchedUpdates()` 方法中能改善性能，但是这个 API 是实验性质的，也许在某个 React 版本中就被移除了，所以不要过度依赖它。可以参考 [redux-batched-actions](https://github.com/tshelburne/redux-batched-actions)，分发多个 action 就如分发一个这么简单，并且会在 reducer 中将它们 “解包”。[redux-batched-subscribe](https://github.com/tappleby/redux-batched-subscribe) 让你为多次分发分别调用订阅者。

#### 补充资料

**讨论**
- [#597: Valid to dispatch multiple actions from an event handler？](https://github.com/reactjs/redux/issues/597)
- [#959: Multiple actions one dispatch？](https://github.com/reactjs/redux/issues/959)
- [Stack Overflow: Should I use one or several action types to represent this async action？](http://stackoverflow.com/questions/33637740/should-i-use-one-or-several-action-types-to-represent-this-async-action/33816695)
- [Stack Overflow: Do events and actions have a 1:1 relationship in Redux？](http://stackoverflow.com/questions/35406707/do-events-and-actions-have-a-11-relationship-in-redux/35410524)
- [Stack Overflow: Should actions be handled by reducers to related actions or generated by action creators themselves？](http://stackoverflow.com/questions/33220776/should-actions-like-showing-hiding-loading-screens-be-handled-by-reducers-to-rel/33226443#33226443)


## 代码结构

<a id="structure-file-structure"></a>
### 文件结构应该是什么样？项目中该如何对 action 创建函数和 reducer 分组？ selector 又该放在哪里？

因为 Redux 只是数据存储的库，它没有关于工程应该被如何组织的直接主张。然后，有一些被大多数 Redux 开发者所推荐的模式：

- Rails-style：“actions”、“constants”、“reducers”、“containers” 以及 “components” 分属不同的文件夹
- Domain-style：为每个功能或者域创建单独的文件夹，可能会为某些文件类型创建子文件夹
- “Ducks”：类似于 Domain-style，但是明确地将 action、 reducer 绑定在一起，通常将它们定义在同一文件内。

推荐做法是将 selector 与 reducer 定义在一起并输出，并在 reducer 文件中与知道 state 树真实形状的代码一起被重用（例如在 `mapStateToProps` 方法、异步 action 创建函数，或者 sagas）。

#### 补充资料

**讨论**
- [#839: Emphasize defining selectors alongside reducers](https://github.com/reactjs/redux/issues/839)
- [#943: Reducer querying](https://github.com/reactjs/redux/issues/943)
- [React Boilerplate #27: Application Structure](https://github.com/mxstbr/react-boilerplate/issues/27)
- [Stack Overflow: How to structure Redux components/containers](http://stackoverflow.com/questions/32634320/how-to-structure-redux-components-containers/32921576)
- [Redux Best Practices](https://medium.com/lexical-labs-engineering/redux-best-practices-64d59775802e)
- [Rules For Structuring (Redux) Applications ](http://jaysoo.ca/2016/02/28/organizing-redux-application/)
- [A Better File Structure for React/Redux Applications](http://marmelab.com/blog/2015/12/17/react-directory-structure.html)
- [Organizing Large React Applications](http://engineering.kapost.com/2016/01/organizing-large-react-applications/)
- [Four Strategies for Organizing Code](https://medium.com/@msandin/strategies-for-organizing-code-2c9d690b6f33)

<a id="structure-business-logic"></a>
### 如何将逻辑在 reducer 和 action 创建函数之间划分？ “业务逻辑” 应该放在哪里？

关于逻辑的哪个部分应该放在 reducer 或者 action 创建函数中，没有清晰的答案。一些开发者喜欢 “fat” action 创建函数，“thin” reducer 仅仅从 action 拿到数据并绑定到 state 树。其他人的则强调 action 越简单越好，尽量减少在 action 创建函数中使用 `getState()` 方法。

下面的评论恰如其分的概括了这两种分歧：

> 问题是什么在 action 创建函数中、什么在 reducer 中，就是关于 fat 和 thin action 创建函数的选择。如果你将逻辑都放在 action 创建函数中，最终用于更新 state 的 action 对象就会变得 fat，相应的 reducer 就变得纯净、简洁。因为只涉及很少的业务逻辑，将非常有利于组合。
> 如果你将大部门逻辑置于 reducer 之中，action 将变得精简、美观，大部分数据逻辑都在一个地方维护，但是 reducer 由于引用了其它分支的信息，将很难组合。最终的 reducer 会很庞大，而且需要从更高层的 state 获取额外信息。

当你从这两种极端情况中找到一个平衡时，就意味着你已经掌握了 Redux。

#### 补充资料

**讨论**
- [#1165: Where to put business logic / validation？](https://github.com/reactjs/redux/issues/1165)
- [#1171: Recommendations for best practices regarding action-creators, reducers, and selectors](https://github.com/reactjs/redux/issues/1171 )
- [Stack Overflow: Accessing Redux state in an action creator？](http://stackoverflow.com/questions/35667249/accessing-redux-state-in-an-action-creator/35674575)


## Performance

<a id="performance-scaling"></a>
### 考虑到性能和架构， Redux “可扩展性” 如何？

因为没有一个明确的答案，所以在大多数情况下都不需要考虑该问题。

Redux 所做的工作可以分为以下几部分：在 middleware 和 reducer 中处理 action （包括对象复制及不可变更新）、 action 分发之后通知订阅者、根据 state 变化更新 UI 组件。虽然在一些复杂场景下，这些都 *可能* 变成一个性能问题，Redux 本质上并没有任何慢或者低效的实现。实际上，React Redux 已经做了大量的优化工作减少不必要的重复渲染。

考虑到架构方面，事实证据表明在各种项目及团队规模下，Redux 都表现出色。Redux 目前正被成百上千的公司以及更多的开发者使用着，NPM 上每月都有几十万的安装量。有一位开发者这样说：

> 规模方面，我们大约有500个 action 类型、400个 reducer、150个组件、5个 middleware、200个 action、2300个测试案例。

#### 补充资料

**讨论**
- [#310: Who uses Redux？](https://github.com/reactjs/redux/issues/310)
- [Reddit: What's the best place to keep the initial state？](https://www.reddit.com/r/reactjs/comments/47m9h5/whats_the_best_place_to_keep_the_initial_state/)
- [Reddit: Help designing Redux state for a single page app](https://www.reddit.com/r/reactjs/comments/48k852/help_designing_redux_state_for_a_single_page/)
- [Reddit: Redux performance issues with a large state object？](https://www.reddit.com/r/reactjs/comments/41wdqn/redux_performance_issues_with_a_large_state_object/)
- [Reddit: React/Redux for Ultra Large Scale apps](https://www.reddit.com/r/javascript/comments/49box8/reactredux_for_ultra_large_scale_apps/)
- [Twitter: Redux scaling](https://twitter.com/NickPresta/status/684058236828266496)

<a id="performance-all-reducers"></a>
### 每个 action 都调用 “所有的 reducer” 会不会很慢？

我们应当清楚的认识到 Redux store 只有一个 reducer 方法。 store 将当前的 state 和分发的 action 传递给这个 reducer 方法，剩下的就让 reducer 去处理。

显然，在单独的方法里处理所有的 action 仅从方法大小及可读性方面考虑，就已经很不利于扩展了，所以将实际工作分割成独立的方法并在顶层的 reducer 中调用就变得很有意义。尤其是目前的建议模式中推荐让单独的子 reducer 只负责更新特定的 state 部分。 `combineReducers()` 和 Redux 搭配的方案只是许多实现方式中的一种。强烈建议尽可能保持 store 中 state 的扁平化和范式化，至少你可以随心所欲的组织你的 reducer 逻辑。

即使你在不经意间已经维护了许多独立的子 reducer，甚至 state 也是深度嵌套，reducer 的速度也并不构成任何问题。JavaScript 引擎有足够的能力在每秒运行大量的函数调用，而且大部门的子 reducer 只是使用 `switch` 语句，并且针对大部分 action 返回的都是默认的 state。

如果你仍然关心 reducer 的性能，可以使用类似 [redux-ignore](https://github.com/omnidan/redux-ignore) 和 [reduxr-scoped-reducer](https://github.com/chrisdavies/reduxr-scoped-reducer) 的工具，确保只有某几个 reducer 响应特定的 action。你还可以使用 [redux-log-slow-reducers](https://github.com/michaelcontento/redux-log-slow-reducers) 进行性能测试。

#### 补充资料

**讨论**
- [#912: Proposal: action filter utility](https://github.com/reactjs/redux/issues/912)
- [#1303: Redux Performance with Large Store and frequent updates](https://github.com/reactjs/redux/issues/1303)
- [Stack Overflow: State in Redux app has the name of the reducer](http://stackoverflow.com/questions/35667775/state-in-redux-react-app-has-a-property-with-the-name-of-the-reducer/35674297)
- [Stack Overflow: How does Redux deal with deeply nested models？](http://stackoverflow.com/questions/34494866/how-does-redux-deals-with-deeply-nested-models/34495397)

<a id="performance-clone-state"></a>
### 在 reducer 中必须对 state 进行深拷贝吗？拷贝 state 不会很慢吗？

以不可变的方式更新 state 意味着浅拷贝，而非深拷贝。

相比于深拷贝，浅拷贝更快，因为只需复制很少的字段和对象，实际的底层实现中也只是移动了若干指针而已。

因此，你需要创建一个副本，并且更新受影响的各个嵌套的对象层级即可。尽管上述动作代价不会很大，但这也是为什么需要维护范式化及扁平化 state 的又一充分理由。

> Redux 常见的误解： 需要深拷贝 state。实际情况是：如果内部的某些数据没有改变，继续保持统一引用即可。

#### 补充资料

**讨论**
- [#454: Handling big states in reducer](https://github.com/reactjs/redux/issues/454)
- [#758: Why can't state be mutated？](https://github.com/reactjs/redux/issues/758)
- [#994: How to cut the boilerplate when updating nested entities？](https://github.com/reactjs/redux/issues/994)
- [Twitter: common misconception - deep cloning](https://twitter.com/dan_abramov/status/688087202312491008)
- [Cloning Objects in JavaScript](http://www.zsoltnagy.eu/cloning-objects-in-javascript/)

<a id="performance-update-events"></a>
### 怎样减少 store 更新事件的数量？

Redux 在 action 分发成功（例如，action 到达 store 被 reducer 处理）后通知订阅者。在有些情况下，减少订阅者被调用的次数会很有用，特别在当 action 创建函数分发了一系列不同的 action 时。有很多开源的组件提供了在多个 action 分发时，批量订阅通知的扩展，比如 [redux-batched-subscribe](https://github.com/tappleby/redux-batched-subscribe) 和 [redux-batched-actions](https://github.com/tshelburne/redux-batched-actions)。

#### 补充资料

**讨论**
- [#125: Strategy for avoiding cascading renders](https://github.com/reactjs/redux/issues/125)
- [#542: Idea: batching actions](https://github.com/reactjs/redux/issues/542)
- [#911: Batching actions](https://github.com/reactjs/redux/issues/911)
- [React Redux #263: Huge performance issue when dispatching hundreds of actions](https://github.com/reactjs/react-redux/issues/263)

<a id="performance-state-memory"></a>
### 仅有 “一个 state 树” 会引发内存问题吗？分发多个 action 会占用内存空间吗？

首先，在原始内存使用方面，Redux 和其它的 JavaScript 库并没有什么不同。唯一的区别就是所有的对象引用都嵌套在同一棵树中，而不是像类似于 Backbone 那样保存在不同的模型实例中。第二，与同样的 Backbone 应用相比，典型的 Redux 应用可能使用 *更少* 的内存，因为 Redux 推荐使用普通的 JavaScript 对象和数组，而不是创建模型和集合实例。最后，Redux 仅维护一棵 state 树。不再被引用的 state 树通常都会被垃圾回收。

Redux 本身不存储 action 的历史。然而，Redux DevTools 会记录这些 action 以便支持重放，而且也仅在开发环境被允许，生产环境则不会使用。

#### 补充资料

**文档**
- [Docs: Async Actions](advanced/AsyncActions.md])

**讨论**
- [Stack Overflow: Is there any way to "commit" the state in Redux to free memory？](http://stackoverflow.com/questions/35627553/is-there-any-way-to-commit-the-state-in-redux-to-free-memory/35634004)
- [Reddit: What's the best place to keep initial state？](https://www.reddit.com/r/reactjs/comments/47m9h5/whats_the_best_place_to_keep_the_initial_state/)

## React Redux

<a id="react-not-rerendering"></a>
### 为何组件没有被重新渲染、或者 mapStateToProps 没有运行？

目前来看，导致组件在 action 分发后却没有被重新渲染，最常见的原因是对 state 进行了直接修改。Redux 期望 reducer 以 “不可变的方式” 更新 state，实际使用中则意味着复制数据，然后更新数据副本。如果直接返回同一对象，即使你改变了数据内容，Redux 也会认为没有变化。类似的，React Redux 会在 `shouldComponentUpdate` 中对新的 props 进行浅层的判等检查，以期提升性能。如果所有的引用都是相同的，则返回 `false` 从而跳过此次对组件的更新。

需要注意的是，不管何时更新了一个嵌套的值，都必须同时返回上层的任何数据副本给 state 树。如果数据是 `state.a.b.c.d`，你想更新 `d`，你也必须返回 `c`、`b`、`a` 以及 `state` 的拷贝。[state 树变化图](http://arqex.com/wp-content/uploads/2015/02/trees.png) 展示了树的深层变化为何需要改变途经的结点。

“以不可变的方式更新数据” 并 *不* 代表你必须使用 [Immutable.js](https://facebook.github.io/immutable-js/), 虽然是很好的选择。你可以使用多种方法，达到对普通 JS 对象进行不可变更新的目的：

- 使用类似于 `Object.assign()` 或者 `_.extend()` 的方法复制对象， `slice()` 和 `concat()` 方法复制数组。
- ES6 数组的 spread sperator（展开运算符），JavaScript 新版本提案中类似的对象展开运算符。
- 将不可变更新逻辑包装成简单方法的工具库。

#### 补充资料

**文档**
- [Troubleshooting](Troubleshooting.md)
- [React Redux: Troubleshooting](https://github.com/reactjs/react-redux/blob/master/docs/troubleshooting.md)
- [Recipes: Using the Object Spread Operator](recipes/UsingObjectSpreadOperator.md)

**讨论**
- [#1262: Immutable data + bad performance](https://github.com/reactjs/redux/issues/1262)
- [React Redux #235: Predicate function for updating component](https://github.com/reactjs/react-redux/issues/235)
- [React Redux #291: Should mapStateToProps be called every time an action is dispatched？](https://github.com/reactjs/react-redux/issues/291)
- [Stack Overflow: Cleaner/shorter way to update nested state in Redux？](http://stackoverflow.com/questions/35592078/cleaner-shorter-way-to-update-nested-state-in-redux)
- [Gist: state mutations](https://gist.github.com/amcdnl/7d93c0c67a9a44fe5761#gistcomment-1706579)
- [Pros and Cons of Using Immutability with React](http://reactkungfu.com/2015/08/pros-and-cons-of-using-immutability-with-react-js/)

<a id="react-rendering-too-often"></a>
### 为何组件频繁的重新渲染？

React Redux 采取了很多的优化手段，保证组件直到必要时才执行重新渲染。一种是对 `mapStateToProps` 和 `mapDispatchToProps` 生成后传入 `connect` 的 props 对象进行浅层的判等检查。遗憾的是，如果当 `mapStateToProps` 调用时都生成新的数组或对象实例的话，此种情况下的浅层判等不会起任何作用。一个典型的示例就是通过 ID 数组返回映射的对象引用，如下所示：

```js
const mapStateToProps = (state) => {
  return {
    objects: state.objectIds.map(id => state.objects[id])
  }
}
```

尽管每次数组内都包含了同样的对象引用，数组本身却指向不同的引用，所以浅层判等的检查结果会导致 React Redux 重新渲染包装的组件。

这种额外的重新渲染也可以避免，使用 reducer 将对象数组保存到 state，利用 [Reselect](https://github.com/reactjs/reselect) 缓存映射的数组，或者在组件的 `shouldComponentUpdate` 方法中，采用 `_.isEqual` 等对 props 进行更深层次的比较。注意在自定义的 `shouldComponentUpdate()` 方法中不要采用了比重新渲染本身更为昂贵的实现。可以使用分析器评估方案的性能。

对于独立的组件，也许你想检查传入的 props。一个普遍存在的问题就是在 render 方法中绑定父组件的回调，比如 `<Child onClick={this.handleClick.bind(this)} />`。这样就会在每次父组件重新渲染时重新生成一个函数的引用。所以只在父组件的构造函数中绑定一次回调是更好的做法。

#### 补充资料

**讨论**
- [Stack Overflow: Can a React Redux app scale as well as Backbone？](http://stackoverflow.com/questions/34782249/can-a-react-redux-app-really-scale-as-well-as-say-backbone-even-with-reselect)
- [React.js pure render performance anti-pattern](https://medium.com/@esamatti/react-js-pure-render-performance-anti-pattern-fb88c101332f)
- [A Deep Dive into React Perf Debugging](http://benchling.engineering/deep-dive-react-perf-debugging/)

<a id="react-mapstate-speed"></a>
### 怎样使 `mapStateToProps` 执行更快？

尽管 React Redux 已经优化并尽量减少对 `mapStateToProps` 的调用次数，加快 `mapStateToProps` 执行并减少其执行次数仍然是非常有价值的。普遍的推荐方式是利用 [Reselect](https://github.com/reactjs/reselect) 创建可记忆（memoized）的 “selector” 方法。这样，selector 就能被组合在一起，并且同一管道（pipeline）后面的 selector 只有当输入变化时才会执行。意味着你可以像筛选器或过滤器那样创建 selector，并确保任务的执行时机。

#### 补充资料

**文档**
- [Recipes: Computed Derived Data](recipes/ComputingDerivedData.md)

**讨论**
- [#815: Working with Data Structures](https://github.com/reactjs/redux/issues/815)
- [Reselect #47: Memoizing Hierarchical Selectors](https://github.com/reactjs/reselect/issues/47)

<a id="react-props-dispatch"></a>
### 为何不在被连接的组件中使用 `this.props.dispatch`？

`connect()` 方法有两个主要的参数，而且都是可选的。第一个参数 `mapStateToProps` 是个函数，让你在数据变化时从 store 获取数据，并作为 props 传到组件中。第二个参数 `mapDispatchToProps` 依然是函数，让你可以使用 store 的 `dispatch` 方法，通常都是创建 action 创建函数并预先绑定，那么在调用时就能直接分发 action。

如果在执行 `connect()` 时没有指定 `mapDispatchToProps` 方法，React Redux 默认将 `dispatch` 作为 prop 传入。所以当你指定方法时， `dispatch` 将 *不* 会自动注入。如果你还想让其作为 prop，需要在 `mapDispatchToProps` 实现的返回值中明确指出。

#### 补充资料

**文档**
- [React Redux API: connect()](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)

**讨论**
- [React Redux #89: can i wrap multi actionCreators into one props with name？](https://github.com/reactjs/react-redux/issues/89)
- [React Redux #145: consider always passing down dispatch regardless of what mapDispatchToProps does](https://github.com/reactjs/react-redux/issues/145)
- [React Redux #255: this.props.dispatch is undefined if using mapDispatchToProps](https://github.com/reactjs/react-redux/issues/255)
- [Stack Overflow: How to get simple dispatch from this.props using connect w/ Redux？](http://stackoverflow.com/questions/34458261/how-to-get-simple-dispatch-from-this-props-using-connect-w-redux/34458710])

<a id="react-multiple-components"></a>
### 应该只连接到顶层组件吗，或者可以在组件树中连接到不同组件吗？

早期的 Redux 文档中建议只在组件树顶层附近连接若干组件。然而，时间和经验都表明，这需要让这些组件非常了解它们子孙组件的数据需求，还导致它们会向下传递一些令人困惑的 props。

目前的最佳实践是将组件按照 “展现层（presentational）” 或者 “容器（container）” 分类，并在合理的地方抽象出一个连接的容器组件：

> Redux 示例中强调的 “在顶层保持一个容器组件” 是错误的。不要把这个当做准则。让你的展现层组件保持独立。然后创建容器组件并在合适时进行连接。当你感觉到你是在父组件里通过复制代码为某些子组件提供数据时，就是时候抽取出一个容器了。只要你认为父组件过多了解子组件的数据或者 action，就可以抽取容器。

总之，试着在数据流和组件职责间找到平衡。

#### 补充资料

**文档**
- [Basics: Usage with React](basics/UsageWithReact.md)

**讨论**
- [Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
- [Twitter: emphasizing “one container” was a mistake](https://twitter.com/dan_abramov/status/668585589609005056)
- [#419: Recommended usage of connect](https://github.com/reactjs/redux/issues/419)
- [#756: container vs component？](https://github.com/reactjs/redux/issues/756)
- [#1176: Redux+React with only stateless components](https://github.com/reactjs/redux/issues/1176)
- [Stack Overflow: can a dumb component use a Redux container？](http://stackoverflow.com/questions/34992247/can-a-dumb-component-use-render-redux-container-component)

## 其它

<a id="miscellaneous-real-projects"></a>
### 有 “真实存在” 且很庞大的 Redux 项目吗？

Redux 的 “examples” 目录下有几个复杂度不一的工程，包括一个 “real-world” 示例。虽然有很多公司在使用 Redux，大部分的应用都有版权，无法获得。依然可以在 Github 上找到大量的 Redux 相关项目，比如 [SoundRedux](https://github.com/andrewngu/sound-redux)。

#### 补充资料

**文档**
- [Introduction: Examples](introduction/Examples.md)

**讨论**
- [Reddit: Large open source react/redux projects？](https://www.reddit.com/r/reactjs/comments/496db2/large_open_source_reactredux_projects/)
- [HN: Is there any huge web application built using Redux？](https://news.ycombinator.com/item？id=10710240)

<a id="miscellaneous-authentication"></a>
### 如何在 Redux 中实现鉴权？

在任何真正的应用中，鉴权都必不可少。当考虑鉴权时须谨记：不管你怎样组织应用，都并不会改变什么，你应当像实现其它功能一样实现鉴权。这实际上很简单：

1. 为 `LOGIN_SUCCESS`、`LOGIN_FAILURE` 等定义 action 常量。

2. 创建接受凭证的 action 创建函数，凭证是指示身份验证成功与否的标志、一个令牌、或者作为负载的错误信息。

3. 使用 Redux Thunk middleware 或者其它适合于触发网络请求（请求 API，如果是合法鉴权则返回令牌）的 middleware 创建一个异步的 action 创建函数。之后在本地存储中保存令牌或者给用户一个非法提示。可以通过执行上一步的 action 创建函数达到此效果。

4. 为每个可能出现的鉴权场景（`LOGIN_SUCCESS`、`LOGIN_FAILURE`等）编写独立的 reducer。

#### 补充资料

**讨论**
- [Authentication with JWT by Auth0](https://auth0.com/blog/2016/01/04/secure-your-react-and-redux-app-with-jwt-authentication/)
- [Tips to Handle Authentication in Redux](https://medium.com/@MattiaManzati/tips-to-handle-authentication-in-redux-2-introducing-redux-saga-130d6872fbe7)
- [react-redux-jwt-auth-example](https://github.com/joshgeller/react-redux-jwt-auth-example)
- [redux-auth](https://github.com/lynndylanhurley/redux-auth)
