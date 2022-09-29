---
id: migrating-to-redux
title: 迁移到 Redux
---

# 迁移到 Redux

Redux 不是一个单一的框架，而是一系列的约定和[一些让他们协同工作的函数](../api/README.md)。你的 Redux 项目的主体代码甚至不需要使用 Redux 的 API，大部分时间你其实是在编写函数。

因此，你想把应用迁移到 Redux 或迁移出都非常的容易。
我们可不想把你限制得死死的！

## 从 Flux 项目迁移

[Reducers](../understanding/thinking-in-redux/Glossary.md#reducer) 抓住了 Flux Store 的本质，因此，将一个 Flux 项目逐步迁移到 Redux 是可行的，无论你使用了 [Flummox](http://github.com/acdlite/flummox)、[Alt](http://github.com/goatslacker/alt)、[traditional Flux](https://github.com/facebook/flux) 还是其他 Flux 库。

你的迁移过程大致包含几个步骤：

- 创建一个叫做 `createFluxStore(reducer)` 的函数，通过 reducer 函数适配你当前项目的 Flux Store。从代码来看，这个函数很像 Redux 中 [`createStore`](../api/createStore.md) ([来源](https://github.com/reactjs/redux/blob/master/src/createStore.js))的实现。它的 dispatch 处理器应该根据不同的 action 来调用不同的 `reducer`，保存新的 state 并抛出更新事件。

- 通过创建 `createFluxStore(reducer)` 的方法来将每个 Flux Store 逐步重写为 Reducer，这个过程中你的应用中其他部分代码感知不到任何变化，仍可以和原来一样使用 Flux Store 。

- 当重写你的 Store 时，你会发现你应该避免一些明显违反 Flux 模式的使用方法，例如在 Store 中请求 API、或者在 Store 中触发 action。一旦你将 Flux 代码移植为基于 reducer，它会变得更易于理解！

- 当你所有的 Flux Store 全部基于 reducer 来实现时，你就可以利用 [`combineReducers(reducers)`](../api/combineReducers.md) 将多个 reducer 合并到一起，然后在应用里使用这个唯一的 Redux Store。

- 现在剩下要做的就是将 UI 移植到 [使用 React-Redux](../tutorials/fundamentals/part-5-ui-and-react.md) 或等效项。

- 最后，你可以使用一些 Redux 的特性，例如利用 middleware 来进一步简化异步的代码。

## 从 Backbone 项目迁移

Backbone 的 Model 层与 Redux 有着巨大的差别，因此，我们不建议从 Backbone 项目迁移到 Redux 。如果可以的话，最好的方法是彻底重写应用的 Model 层。但是，如果重写不可行，也可以试试使用 [backbone-redux](https://github.com/redbooth/backbone-redux) 来逐步迁移，并使 Redux 的 store 和 Backbone 的 model 层及 collection 保持同步。

如果你的 Backbone 代码库太大而无法快速重写，或者您不想管理 store 和 modal 之间的交互，请使用 [backbone-redux-migrator](https://github.com/naugtur/backbone-redux-migrator) 帮助你的两个代码库共存，同时保持健康的分离。 重写完成后，可以丢弃 Backbone 代码，并且在配置路由器后，你的 Redux 应用程序可以自行运行。
