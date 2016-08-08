# Redux 常见问题

## 目录

- **综合**
  - [何时使用 Redux ？](#general-when-to-use)
  - [Redux 只能搭配 React 使用？](#general-only-react)
  - [Redux 需要特殊的编译工具支持吗？](#general-build-tools)
- **Reducers**
  - [如何在 reducer 之间共享 state ？ combineReducers 是必须的吗？](#reducers-share-state)
  - [处理 action 必须用 switch 语句吗？](#reducers-use-switch)
- **组织 State**
  - [必须将所有 state 都维护在 Redux 中吗？ 可以用 React 的 setState() 方法吗？](#organizing-state-only-redux-state)
  - [可以将 store 的 state 设置为函数、promise或者其它非序列化值吗](#organizing-state-non-serializable)
  - [如何在 state 中组织嵌套及重复数据？](#organizing-state-nested-data)
- **创建 Store**
  - [可以创建多个 store 吗，应该这么做吗？能在组件中直接引用 store 并使用吗？](#store-setup-multiple-stores)
  - [在 store enhancer 中可以存在多个 middleware 链吗？ 在 middleware 方法中，next 和 dispatch 之间区别是什么？](#store-setup-middleware-chains)
  - [怎样只订阅 state 的一部分变更？如何将分发的 action 作为订阅的一部分？](#store-setup-subscriptions)
- **Actions**
  - [Why should type be a string, or at least serializable？ Why should my action types be constants？](#actions-string-constants)
  - [Is there always a one-to-one mapping between reducers and actions？](#actions-reducer-mappings)
  - [How can I represent “side effects” such as AJAX calls？ Why do we need things like “action creators”, “thunks”, and “middleware” to do async behavior？](#actions-side-effects)
  - [Should I dispatch multiple actions in a row from one action creator？](#actions-multiple-actions)
- **代码结构**  
  - [What should my file structure look like？ How should I group my action creators and reducers in my project？ Where should my selectors go？](#structure-file-structure)
  - [How should I split my logic between reducers and action creators？ Where should my “business logic” go？](#structure-business-logic)
- **性能**
  - [How well does Redux “scale” in terms of performance and architecture？](#performance-scaling)
  - [Won't calling “all my reducers” for each action be slow？](#performance-all-reducers)
  - [Do I have to deep-clone my state in a reducer？ Isn't copying my state going to be slow？](#performance-clone-state)
  - [How can I reduce the number of store update events？](#performance-update-events)
  - [Will having “one state tree” cause memory problems？ Will dispatching many actions take up memory？](#performance-state-memory)
- **React Redux**
  - [Why isn't my component re-rendering, or my mapStateToProps running？](#react-not-rerendering)
  - [Why is my component re-rendering too often？](#react-rendering-too-often)
  - [How can I speed up my mapStateToProps？](#react-mapstate-speed)
  - [Why don't I have this.props.dispatch available in my connected component？](#react-props-dispatch)
  - [Should I only connect my top component, or can I connect multiple components in my tree？](#react-multiple-components)
- **其它**
  - [Are there any larger, “real” Redux projects？](#miscellaneous-real-projects)
  - [How can I implement authentication in Redux？](#miscellaneous-authentication)


## 综合

<a id="general-when-to-use"></a>
### 何时使用 Redux？

React 早起贡献者之一 Pete Hunt 说：

> You'll know when you need Flux. If you aren't sure if you need it, you don't need it.
> 你应当清楚何时需要 Flux。

Redux 的创建者之一 Dan Abramov 也曾表达过类似的意思:

> I would like to amend this: don't use Redux until you have problems with vanilla React.

一般而言，Redux 的适应场景有以下几点特征：

- 随着时间的推移，数据处于合理的变动之中；
- 单一数据源
- 在 React 顶层组件的 state 中维护所有内容的方法无法满足需求

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

> Counter Vanilla 例子意图是消除 Redux 需要 Webpack、 React、 hot reloading、 sagas、 action creators、 constants、 Babel、 npm、 CSS modules、 decorators、 fluent Latin、 an Egghead subscription、 a PhD 或者 an Exceeds Expectations O.W.L. level 的荒谬观点。

> 仅仅是 HTML， 一些 `<script>`  标签，和简单的 DOM 操作而已。


## Reducers

<a id="reducers-share-state"></a>
### 如何在 reducer 之间共享 state ？ combineReducers 是必须的吗？

Redux store 推荐的结构是将 state 对象按键值切分成 “层” 或者 “域”，并提供独立的 reducer 方法管理各自的数据层。就像 Flux 模式中的多个独立 store 一样， Redux 为此还提供了 [`combineReducers`](api/combineReducers.md) 工具来简化该模型。应当注意的是， `combineReducers` **不是** 必须的，它仅仅是通过简单的 JavaScript 对象作为数据，让 state 层能与 reducer 一一关联的函数而已。

许多用户想在 reducer 之间共享数据，但是 `combineReducers` 不允许此种行为。有许多可用的办法：

* 如果一个 reducer 想获取其它 state 层的数据，往往意味着 state 树需要重构，需要让单独的 reducer 处理更多的数据。
* 你可能需要自定义方法去处理这些 action，用自定义的顶层 reducer 方法替换 `combineReducers`。你可以使用类似于 [reduce-reducers](https://github.com/acdlite/reduce-reducers) 的工具去运行 `combineReducers` 从而处理尽可能多的 action，但是需要考虑到对于存在交叉的 state 层，特定的 action 执行特定的 reducer。
* 类似于 `redux-thunk` 的 [异步 action 创建函数](advanced/AsyncActions.md) 能通过 `getState()` 方法获取所有的 state。 action 创建函数能从 state 中检索到额外的数据并传入 action，所以 reducer 有足够的信息去更新所维护的 state 层。

只需牢记 reducer 仅仅是函数，可以随心所欲的进行划分和组合，而且也推荐将其分解成更小、可复用的函数 (“reducer composition”)。按照这种做法，如果子 reducer 需要一些参数时，可以从父 reducer 传入即可。你只需要确保他们遵循 reducer 的基本准则： `(state, action) => newState`，并且用非可变方式更新 state，而不是直接修改。

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

不是。在 reducer 里面你可以使用任何方法响应 action。 `switch` 语句是最常用的方法，当然你也可以用 `if`、功能查找表、创建抽象函数等。

#### 补充资料

**文档**
- [Recipes: Reducing Boilerplate](recipes/ReducingBoilerplate.md)

**讨论**
- [#883: take away the huge switch block](https://github.com/reactjs/redux/issues/883)
- [#1167: Reducer without switch](https://github.com/reactjs/redux/issues/1167)


## 组织 State

<a id="organizing-state-only-redux-state"></a>
### 必须将所有 state 都维护在 Redux 中吗？ 可以用 React 的 `setState()` 方法吗？

没有 “准则”。有些用户选择将所有数据都在 Redux 中维护，那么在任何时刻，应用都是完全有序及可控的。也有人将类似于“下拉菜单是否打开”的非关键或者 UI 状态，在组件内部维护。适合自己的才是最好的。

有许多开源组件实现了各式各样在 Redux store 存储独立组件状态的代替方法，比如 [redux-ui](https://github.com/tonyhb/redux-ui)、 [redux-component](https://github.com/tomchentw/redux-component)、 [redux-react-local](https://github.com/threepointone/redux-react-local)等等。

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

强烈推荐只将普通可序列化对象、数组以及基本数据在 store 中维护。虽然在 *技术* 层面将非序列化项保存在 store 中是可行的，但这样会破坏 store 内容持久化或深加工的能力。

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

Flux 原始模型中描述了一个应用中有多个 “store”，每个都维护了不同维度的数据。这样导致了类似于一个 store “等待” 另一 store 操作的问题。Redux 中将 reducer 分解成多个 reducer，进而切分数据域，避免了这种情况的发生。

正如上述问题所述，“可能” 在一个页面中创建多个的独立 Redux store，但是预设模式中只会有一个 store。仅维持单个 store 可以使用 Redux DevTools、简化持久化以及数据深加工、精简订阅逻辑。

在 Redux 中使用多个 store 的正当理由可能包含：

* 当对应用进行性能分析时，解决由于过于频繁更新部分 state 引起的性能问题。
* 在更大的应用中，将 Redux 应用作为一个组件，这种情况下，你也许更倾向于为每个根组件创建单独的 store。

然而，创建新的 store 不应成为你的第一反应，特别当你是从 Flux 背景迁移而来。首先尝试组合 reducer，只有当它无法解决你的问题时才使用多个 store。

类似的，即使你 *能* 通过导入获取 store 实例时，这也不是 Redux 的推荐方式。当你创建 store 实例并从组件导出，它将变成一个单例。这意味着很难将 Redux 应用封装成一个更大应用的一个组件，除非这是必要的，或者为了实现服务端渲染，因为在服务端你需要为每一个请求创建单独的 store 实例。

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

Redux middleware 就像一个链表。每个 middleware 方法既能调用 `next(action)` 传递 action 到下一个 middleware、调用 `dispatch(action)` 重新开始处理、或者什么都不做而仅仅终止 action 的处理进程。

创建 store 时， `applyMiddleware` 方法的入参定义了 middleware 链。定义多个链将无法正常执行，因为它们的 `dispatch` 引用显示是不一样的，而且不同的链也无法有效连到一起。

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

Redux 提供了独立的 `store.subscribe` 方法用于通知监听器 store 已变更。监听器的回调方法没有把当前的 state 作为入参，它仅仅代表了 *有些数据* 被更新。订阅者的逻辑中调用 `getState()` 获取当前的 state 值。

这个 API 是没有依赖及副作用的底层接口，可以用于创建订阅者逻辑。类似 React Redux 的 UI 绑定能为所有连接的组件都创建订阅。也可以用于编写智能的新旧 state 比对方法，从而在某些内容变更时执行额外的逻辑处理。示例 [redux-watch](https://github.com/jprichardson/redux-watch) 和 [redux-subscribe](https://github.com/ashaffer/redux-subscribe) 提供不同的方式用于指定订阅及处理变更。

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
### Why should `type` be a string, or at least serializable？ Why should my action types be constants？

As with state, serializable actions enable several of Redux's defining features, such as time travel debugging, and recording and replaying actions. Using something like a `Symbol` for the `type` value or using `instanceof` checks for actions themselves would break that. Strings are serializable and easily self-descriptive, and so are a better choice. Note that it *is* okay to use Symbols, Promises, or other non-serializable values in an action if the action is intended for use by middleware. Actions only need to be serializable by the time they actually reach the store and are passed to the reducers.

We can't reliably enforce serializable actions for performance reasons, so Redux only checks that every action is a plain object, and that the `type` is defined. The rest is up to you, but you might find that keeping everything serializable helps debug and reproduce issues.

Encapsulating and centralizing commonly used pieces of code is a key concept in programming. While it is certainly possible to manually create action objects everywhere, and write each `type` value by hand, defining reusable constants makes maintaining code easier. If you put constants in a separate file, you can [check your `import` statements against typos](https://www.npmjs.com/package/eslint-plugin-import) so you can't accidentally use the wrong string.

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
### Is there always a one-to-one mapping between reducers and actions？

No. We suggest you write independent small reducer functions that are each responsible for updates to a specific slice of state. We call this pattern “reducer composition”. A given action could be handled by all, some, or none of them. This keep components decoupled from the actual data changes, as one action may affect different parts of the state tree, and there is no need for the component to be aware of this. Some users do choose to bind them more tightly together, such as the “ducks” file structure, but there is definitely no one-to-one mapping by default, and you should break out of such a paradigm any time you feel you want to handle an action in many reducers.

#### 补充资料

**文档**
- [Basics: Reducers](basics/Reducers.md)

**讨论**
- [Twitter: most common Redux misconception](https://twitter.com/dan_abramov/status/682923564006248448)
- [#1167: Reducer without switch](https://github.com/reactjs/redux/issues/1167)
- [Reduxible #8: Reducers and action creators aren't a one-to-one mapping](https://github.com/reduxible/reduxible/issues/8)
- [Stack Overflow: Can I dispatch multiple actions without Redux Thunk middleware？](http://stackoverflow.com/questions/35493352/can-i-dispatch-multiple-actions-without-redux-thunk-middleware/35642783)

<a id="actions-side-effects"></a>
### How can I represent “side effects” such as AJAX calls？ Why do we need things like “action creators”, “thunks”, and “middleware” to do async behavior？

This is a long and complex topic, with a wide variety of opinions on how code should be organized and what approaches should be used.

Any meaningful web app needs to execute complex logic, usually including asynchronous work such as making AJAX requests. That code is no longer purely a function of its inputs, and the interactions with the outside world are known as [“side effects”](https://en.wikipedia.org/wiki/Side_effect_%28computer_science%29)

Redux is inspired by functional programming, and out of the box, has no place for side effects to be executed. In particular, reducer functions *must* always be pure functions of `(state, action) => newState`. However, Redux's middleware makes it possible to intercept dispatched actions and add additional complex behavior around them, including side effects.

In general, Redux suggests that code with side effects should be part of the action creation process. While that logic *can* be performed inside of a UI component, it generally makes sense to extract that logic into a reusable function so that the same logic can be called from multiple places—in other words, an action creator function.

The simplest and most common way to do this is to add the [Redux Thunk](https://github.com/gaearon/redux-thunk) middleware that lets you write action creators with more complex and asynchronous logic. Another widely-used method is [Redux Saga](https://github.com/yelouafi/redux-saga) which lets you write more synchronous-looking code using generators, and can act like “background threads” or “daemons” in a Redux app. Yet another approach is [Redux Loop](https://github.com/raisemarketplace/redux-loop), which inverts the process by allowing your reducers to declare side effects in response to state changes and have them executed separately. Beyond that, there are *many* other community-developed libraries and ideas, each with their own take on how side effects should be managed.


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
### Should I dispatch multiple actions in a row from one action creator？

There's no specific rule for how you should structure your actions. Using an async middleware like Redux Thunk certainly enables scenarios such as dispatching multiple distinct but related actions in a row, dispatching actions to represent progression of an AJAX request, dispatching actions conditionally based on state, or even dispatching an action and checking the updated state immediately afterwards.

In general, ask if these actions are related but independent, or should actually be represented as one action. Do what makes sense for your own situation but try to balance the readability of reducers with readability of the action log. For example, an action that includes the whole new state tree would make your reducer a one-liner, but the downside is now you have no history of *why* the changes are happening, so debugging gets really difficult. On the other hand, if you emit actions in a loop to keep them granular, it's a sign that you might want to introduce a new action type that is handled in a different way.

Try to avoid dispatching several times synchronously in a row in the places where you're concerned about performance. If you use React, note that you can improve performance of multiple synchronous dispatches by wrapping them in `ReactDOM.unstable_batchedUpdates()`, but this API is experimental and may be removed in any React release so don't rely on it too heavily. Take a look at [redux-batched-actions](https://github.com/tshelburne/redux-batched-actions) that lets you dispatch several actions as if it was one and “unpack” them in the reducer, and [redux-batched-subscribe](https://github.com/tappleby/redux-batched-subscribe) which lets you debounce subscriber calls for multiple dispatches.

#### 补充资料

**讨论**
- [#597: Valid to dispatch multiple actions from an event handler？](https://github.com/reactjs/redux/issues/597)
- [#959: Multiple actions one dispatch？](https://github.com/reactjs/redux/issues/959)
- [Stack Overflow: Should I use one or several action types to represent this async action？](http://stackoverflow.com/questions/33637740/should-i-use-one-or-several-action-types-to-represent-this-async-action/33816695)
- [Stack Overflow: Do events and actions have a 1:1 relationship in Redux？](http://stackoverflow.com/questions/35406707/do-events-and-actions-have-a-11-relationship-in-redux/35410524)
- [Stack Overflow: Should actions be handled by reducers to related actions or generated by action creators themselves？](http://stackoverflow.com/questions/33220776/should-actions-like-showing-hiding-loading-screens-be-handled-by-reducers-to-rel/33226443#33226443)


## Code Structure

<a id="structure-file-structure"></a>
### What should my file structure look like？ How should I group my action creators and reducers in my project？ Where should my selectors go？

Since Redux is just a data store library, it has no direct opinion on how your project should be structured. However, there are a few common patterns that most Redux developers tend to use:

- Rails-style: separate folders for “actions”, “constants”, “reducers”, “containers”, and “components”
- Domain-style: separate folders per feature or domain, possibly with sub-folders per file type
- “Ducks”: similar to domain style, but explicitly tying together actions and reducers, often by defining them in the same file

It's generally suggested that selectors are defined alongside reducers and exported, and then reused elsewhere (such as in `mapStateToProps` functions, in async action creators, or sagas) to colocate all the code that knows about the actual shape of the state tree in the reducer files.

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
### How should I split my logic between reducers and action creators？ Where should my “business logic” go？

There's no single clear answer to exactly what pieces of logic should go in a reducer or an action creator. Some developers prefer to have “fat” action creators, with “thin” reducers that simply take the data in an action and blindly merge it into the corresponding state. Others try to emphasize keeping actions as small as possible, and minimize the usage of `getState()` in an action creator.

This comment sums up the dichotomy nicely:

> Now, the problem is what to put in the action creator and what in the reducer, the choice between fat and thin action objects. If you put all the logic in the action creator, you end up with fat action objects that basically declare the updates to the state. Reducers become pure, dumb, add-this, remove that, update these functions. They will be easy to compose. But not much of your business logic will be there.
> If you put more logic in the reducer, you end up with nice, thin action objects, most of your data logic in one place, but your reducers are harder to compose since you might need info from other branches. You end up with large reducers or reducers that take additional arguments from higher up in the state.

Find the balance between these two extremes, and you will master Redux.

#### 补充资料

**讨论**
- [#1165: Where to put business logic / validation？](https://github.com/reactjs/redux/issues/1165)
- [#1171: Recommendations for best practices regarding action-creators, reducers, and selectors](https://github.com/reactjs/redux/issues/1171 )
- [Stack Overflow: Accessing Redux state in an action creator？](http://stackoverflow.com/questions/35667249/accessing-redux-state-in-an-action-creator/35674575)


## Performance

<a id="performance-scaling"></a>
### How well does Redux “scale” in terms of performance and architecture？

While there's no single definitive answer to this, most of the time this should not be a concern in either case.

The work done by Redux generally falls into a few areas: processing actions in middleware and reducers (including object duplication for immutable updates), notifying subscribers after actions are dispatched, and updating UI components based on the state changes. While it's certainly *possible* for each of these to become a performance concern in sufficiently complex situations, there's nothing inherently slow or inefficient about how Redux is implemented. In fact, React Redux in particular is heavily optimized to cut down on unnecessary re-renders.

As for architecture, anecdotal evidence is that Redux works well for varying project and team sizes. Redux is currently used by hundreds of companies and thousands of developers, with several hundred thousand monthly installations from NPM. One developer reported:

> for scale, we have ~500 action types, ~400 reducer cases, ~150 components, 5 middlewares, ~200 actions, ~2300 tests

#### 补充资料

**讨论**
- [#310: Who uses Redux？](https://github.com/reactjs/redux/issues/310)
- [Reddit: What's the best place to keep the initial state？](https://www.reddit.com/r/reactjs/comments/47m9h5/whats_the_best_place_to_keep_the_initial_state/)
- [Reddit: Help designing Redux state for a single page app](https://www.reddit.com/r/reactjs/comments/48k852/help_designing_redux_state_for_a_single_page/)
- [Reddit: Redux performance issues with a large state object？](https://www.reddit.com/r/reactjs/comments/41wdqn/redux_performance_issues_with_a_large_state_object/)
- [Reddit: React/Redux for Ultra Large Scale apps](https://www.reddit.com/r/javascript/comments/49box8/reactredux_for_ultra_large_scale_apps/)
- [Twitter: Redux scaling](https://twitter.com/NickPresta/status/684058236828266496)

<a id="performance-all-reducers"></a>
### Won't calling “all my reducers” for each action be slow？

It's important to note that a Redux store really only has a single reducer function. The store passes the current state and dispatched action to that one reducer function, and lets the reducer handle things appropriately.

Obviously, trying to handle every possible action in a single function does not scale well, simply in terms of function size and readability, so it makes sense to split the actual work into separate functions that can be called by the top-level reducer. In particular, the common suggested pattern is to have a separate sub-reducer function that is responsible for managing updates to a particular slice of state at a specific key. The `combineReducers()` that comes with Redux is one of the many possible ways to achieve this. It's also highly suggested to keep your store state as flat and as normalized as possible. Ultimately, though, you are in charge of organizing your reducer logic any way you want.

However, even if you happen to have many different independent sub-reducers, and even have deeply nested state, reducer speed is unlikely to be a problem. JavaScript engines are capable of running a very large number of function calls per second, and most of your sub-reducers are probably just using a `switch` statement and returning the existing state by default in response to most actions.

If you actually are concerned about reducer performance, you can use a utility such as [redux-ignore](https://github.com/omnidan/redux-ignore) or [reduxr-scoped-reducer](https://github.com/chrisdavies/reduxr-scoped-reducer) to ensure that only certain reducers listen to specific actions. You can also use [redux-log-slow-reducers](https://github.com/michaelcontento/redux-log-slow-reducers) to do some performance benchmarking.

#### 补充资料

**讨论**
- [#912: Proposal: action filter utility](https://github.com/reactjs/redux/issues/912)
- [#1303: Redux Performance with Large Store and frequent updates](https://github.com/reactjs/redux/issues/1303)
- [Stack Overflow: State in Redux app has the name of the reducer](http://stackoverflow.com/questions/35667775/state-in-redux-react-app-has-a-property-with-the-name-of-the-reducer/35674297)
- [Stack Overflow: How does Redux deal with deeply nested models？](http://stackoverflow.com/questions/34494866/how-does-redux-deals-with-deeply-nested-models/34495397)

<a id="performance-clone-state"></a>
### Do I have to deep-clone my state in a reducer？ Isn't copying my state going to be slow？

Immutably updating state generally means making shallow copies, not deep copies. Shallow copies are much faster than deep copies, because fewer objects and fields have to be copied, and it effectively comes down to moving some pointers around.

However, you *do* need to create a copied and updated object for each level of nesting that is affected. Although that shouldn't be particularly expensive, it's another good reason why you should keep your state normalized and shallow if possible.

> Common Redux misconception: you need to deeply clone the state. Reality: if something inside doesn't change, keep its reference the same!

#### 补充资料

**讨论**
- [#454: Handling big states in reducer](https://github.com/reactjs/redux/issues/454)
- [#758: Why can't state be mutated？](https://github.com/reactjs/redux/issues/758)
- [#994: How to cut the boilerplate when updating nested entities？](https://github.com/reactjs/redux/issues/994)
- [Twitter: common misconception - deep cloning](https://twitter.com/dan_abramov/status/688087202312491008)
- [Cloning Objects in JavaScript](http://www.zsoltnagy.eu/cloning-objects-in-javascript/)

<a id="performance-update-events"></a>
### How can I reduce the number of store update events？

Redux notifies subscribers after each successfully dispatched action (i.e. an action reached the store and was handled by reducers). In some cases, it may be useful to cut down on the number of times subscribers are called, particularly if an action creator dispatches multiple distinct actions in a row. There are a number of community add-ons that provide batching of subscription notifications when multiple actions are dispatched, such as [redux-batched-subscribe](https://github.com/tappleby/redux-batched-subscribe) and [redux-batched-actions](https://github.com/tshelburne/redux-batched-actions).

#### 补充资料

**讨论**
- [#125: Strategy for avoiding cascading renders](https://github.com/reactjs/redux/issues/125)
- [#542: Idea: batching actions](https://github.com/reactjs/redux/issues/542)
- [#911: Batching actions](https://github.com/reactjs/redux/issues/911)
- [React Redux #263: Huge performance issue when dispatching hundreds of actions](https://github.com/reactjs/react-redux/issues/263)

<a id="performance-state-memory"></a>
### Will having “one state tree” cause memory problems？ Will dispatching many actions take up memory？

First, in terms of raw memory usage, Redux is no different than any other JavaScript library. The only difference is that all the various object references are nested together into one tree, instead of maybe saved in various independent model instances such as in Backbone. Second, a typical Redux app would probably have somewhat *less* memory usage than an equivalent Backbone app because Redux encourages use of plain JavaScript objects and arrays rather than creating instances of Models and Collections. Finally, Redux only holds onto a single state tree reference at a time. Objects that are no longer referenced in that tree will be garbage collected, as usual.

Redux does not store a history of actions itself. However, the Redux DevTools do store actions so they can be replayed, but those are generally only enabled during development, and not used in production.

#### 补充资料

**文档**
- [Docs: Async Actions](advanced/AsyncActions.md])

**讨论**
- [Stack Overflow: Is there any way to "commit" the state in Redux to free memory？](http://stackoverflow.com/questions/35627553/is-there-any-way-to-commit-the-state-in-redux-to-free-memory/35634004)
- [Reddit: What's the best place to keep initial state？](https://www.reddit.com/r/reactjs/comments/47m9h5/whats_the_best_place_to_keep_the_initial_state/)

## React Redux

<a id="react-not-rerendering"></a>
### Why isn't my component re-rendering, or my mapStateToProps running？

Accidentally mutating or modifying your state directly is by far the most common reason why components do not re-render after an action has been dispatched. Redux expects that your reducers will update their state “immutably”, which effectively means always making copies of your data, and applying your changes to the copies. If you return the same object from a reducer, Redux assumes that nothing has been changed, even if you made changes to its contents. Similarly, React Redux tries to improve performance by doing shallow equality reference checks on incoming props in `shouldComponentUpdate`, and if all references are the same, returns `false` to skip actually updating your original component.

It's important to remember that whenever you update a nested value, you must also return new copies of anything above it in your state tree. If you have `state.a.b.c.d`, and you want to make an update to `d`, you would also need to return new copies of `c`, `b`, `a`, and `state`. This [state tree mutation diagram](http://arqex.com/wp-content/uploads/2015/02/trees.png) demonstrates how a change deep in a tree requires changes all the way up.

Note that “updating data immutably” does *not* mean that you must use [Immutable.js](https://facebook.github.io/immutable-js/), although that is certainly an option. You can do immutable updates to plain JS objects and arrays using several different approaches:

- Copying objects using functions like `Object.assign()` or `_.extend()`, and array functions such as `slice()` and `concat()`
- The array spread operator in ES6, and the similar object spread operator that is proposed for a future version of JavaScript
- Utility libraries that wrap immutable update logic into simpler functions

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
### Why is my component re-rendering too often？

React Redux implements several optimizations to ensure your actual component only re-renders when actually necessary. One of those is a shallow equality check on the combined props object generated by the `mapStateToProps` and `mapDispatchToProps` arguments passed to `connect`. Unfortunately, shallow equality does not help in cases where new array or object instances are created each time `mapStateToProps` is called. A typical example might be mapping over an array of IDs and returning the matching object references, such as:

```js
const mapStateToProps = (state) => {
  return {
    objects: state.objectIds.map(id => state.objects[id])
  }
}
```

Even though the array might contain the exact same object references each time, the array itself is a different reference, so the shallow equality check fails and React Redux would re-render the wrapped component.

The extra re-renders could be resolved by saving the array of objects into the state using a reducer, caching the mapped array using [Reselect](https://github.com/reactjs/reselect), or implementing `shouldComponentUpdate` in the component by hand and doing a more in-depth props comparison using a function such as `_.isEqual`. Be careful to not make your custom `shouldComponentUpdate()` more expensive than the rendering itself! Always use a profiler to check your assumptions about performance.

For non-connected components, you may want to check what props are being passed in. A common issue is having a parent component re-bind a callback inside its render function, like `<Child onClick={this.handleClick.bind(this)} />`. That creates a new function reference every time the parent re-renders. It's generally good practice to only bind callbacks once in the parent component's constructor.

#### 补充资料

**讨论**
- [Stack Overflow: Can a React Redux app scale as well as Backbone？](http://stackoverflow.com/questions/34782249/can-a-react-redux-app-really-scale-as-well-as-say-backbone-even-with-reselect)
- [React.js pure render performance anti-pattern](https://medium.com/@esamatti/react-js-pure-render-performance-anti-pattern-fb88c101332f)
- [A Deep Dive into React Perf Debugging](http://benchling.engineering/deep-dive-react-perf-debugging/)

<a id="react-mapstate-speed"></a>
### How can I speed up my `mapStateToProps`？

While React Redux does work to minimize the number of times that your `mapStateToProps` function is called, it's still a good idea to ensure that your `mapStateToProps` runs quickly and also minimizes the amount of work it does. The common recommended approach is to create memoized “selector” functions using [Reselect](https://github.com/reactjs/reselect). These selectors can be combined and composed together, and selectors later in a pipeline will only run if their inputs have changed. This means you can create selectors that do things like filtering or sorting, and ensure that the real work only happens if needed.

#### 补充资料

**文档**
- [Recipes: Computed Derived Data](recipes/ComputingDerivedData.md)

**讨论**
- [#815: Working with Data Structures](https://github.com/reactjs/redux/issues/815)
- [Reselect #47: Memoizing Hierarchical Selectors](https://github.com/reactjs/reselect/issues/47)

<a id="react-props-dispatch"></a>
### Why don't I have `this.props.dispatch` available in my connected component？

The `connect()` function takes two primary arguments, both optional. The first, `mapStateToProps`, is a function you provide to pull data from the store when it changes, and pass those values as props to your component. The second, `mapDispatchToProps`, is a function you provide to make use of the store's `dispatch` function, usually by creating pre-bound versions of action creators that will automatically dispatch their actions as soon as they are called.

If you do not provide your own `mapDispatchToProps` function when calling `connect()`, React Redux will provide a default version, which simply returns the `dispatch` function as a prop. That means that if you *do* provide your own function, `dispatch` is *not* automatically provided.  If you still want it available as a prop, you need to explicitly return it yourself in your `mapDispatchToProps` implementation.

#### 补充资料

**文档**
- [React Redux API: connect()](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)

**讨论**
- [React Redux #89: can i wrap multi actionCreators into one props with name？](https://github.com/reactjs/react-redux/issues/89)
- [React Redux #145: consider always passing down dispatch regardless of what mapDispatchToProps does](https://github.com/reactjs/react-redux/issues/145)
- [React Redux #255: this.props.dispatch is undefined if using mapDispatchToProps](https://github.com/reactjs/react-redux/issues/255)
- [Stack Overflow: How to get simple dispatch from this.props using connect w/ Redux？](http://stackoverflow.com/questions/34458261/how-to-get-simple-dispatch-from-this-props-using-connect-w-redux/34458710])

<a id="react-multiple-components"></a>
### Should I only connect my top component, or can I connect multiple components in my tree？

Early Redux 文档 advised that you should only have a few connected components near the top of your component tree.  However, time and experience has shown that that generally requires a few components to know too much about the data requirements of all their descendants, and forces them to pass down a confusing number of props.

The current suggested best practice is to categorize your components as “presentational” or “container” components, and extract a connected container component wherever it makes sense:

> Emphasizing “one container component at the top” in Redux examples was a mistake. Don't take this as a maxim. Try to keep your presentation components separate. Create container components by connecting them when it's convenient. Whenever you feel like you're duplicating code in parent components to provide data for same kinds of children, time to extract a container. Generally as soon as you feel a parent knows too much about “personal” data or actions of its children, time to extract a container.

In general, try to find a balance between understandable data flow and areas of responsibility with your components.

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

## Miscellaneous

<a id="miscellaneous-real-projects"></a>
### Are there any larger, “real” Redux projects？

The Redux “examples” folder has several sample projects of varying complexity, including a “real-world” example. While many companies are using Redux, most of their applications are proprietary and not available. A large number of Redux-related projects can be found on Github, such as [SoundRedux](https://github.com/andrewngu/sound-redux).

#### 补充资料

**文档**
- [Introduction: Examples](introduction/Examples.md)

**讨论**
- [Reddit: Large open source react/redux projects？](https://www.reddit.com/r/reactjs/comments/496db2/large_open_source_reactredux_projects/)
- [HN: Is there any huge web application built using Redux？](https://news.ycombinator.com/item？id=10710240)

<a id="miscellaneous-authentication"></a>
### How can I implement authentication in Redux？

Authentication is essential to any real application. When going about authentication you must keep in mind that nothing changes with how you should organize your application and you should implement authentication in the same way you would any other feature. It is relatively straightforward:

1. Create action constants for `LOGIN_SUCCESS`, `LOGIN_FAILURE`, etc.

2. Create action creators that take in credentials, a flag that signifies whether authentication succeeded, a token, or an error message as the payload.

3. Create an async action creator with Redux Thunk middleware or any middleware you see fit to fire a network request to an API that returns a token if the credentials are valid. Then save the token in the local storage or show a response to the user if it failed. You can perform these side effects from the action creators you wrote in the previous step.

4. Create a reducer that returns the next state for each possible authentication case (`LOGIN_SUCCESS`, `LOGIN_FAILURE`, etc).

#### 补充资料

**讨论**
- [Authentication with JWT by Auth0](https://auth0.com/blog/2016/01/04/secure-your-react-and-redux-app-with-jwt-authentication/)
- [Tips to Handle Authentication in Redux](https://medium.com/@MattiaManzati/tips-to-handle-authentication-in-redux-2-introducing-redux-saga-130d6872fbe7)
- [react-redux-jwt-auth-example](https://github.com/joshgeller/react-redux-jwt-auth-example)
- [redux-auth](https://github.com/lynndylanhurley/redux-auth)
