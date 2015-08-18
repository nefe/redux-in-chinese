# 迁移到 Redux

Redux 不是一个整体框架，但是也设置了一些约定并[提供了一些函数](../api/README.md)来让这些工作。你的 Redux 项目中的主要代码都不是在使用 Redux 的 API ，大多数时间你会在写一些函数。

这让把旧的项目迁移到 Redux 上来变得非常容易。我们不想限制你！

## 迁移Flux项目

[Reducers](../Glossary.md#reducer) 提取了 Flux Stores 的本质，所以这让逐步迁移一个 Flux 项目到 Redux 上面来变成了可能，无论你使用了 [Flummox](http://github.com/acdlite/flummox), [Alt](http://github.com/goatslacker/alt), [traditional Flux](https://github.com/facebook/flux), 还是其他 Flux 库。

同样你也可以将 Redux 的项目通过同样的操作改回上述的这些 Flux 框架。

你需要做的包含下面几个步骤：

* 建立一个叫做 `createFluxStore(reducer)`的函数，来通过 reducer 函数适配你当前项目的 Flux Store。从代码来看，这个函数很像 Redux 中的 [`createStore`](../api/createStore.md) 的实现。它的 dispatch 处理器 应该根据不同的 action 来调用不同的 `reducer`，从该改变应用的状态。


* 通过使用 `createFluxStore(reducer)`，可以让你逐步将你的 Flux Store 重写为 Reducer，逐步回归改动，避免对应用产生影响。

* 当你重写了你的  Stores后，你会发现你应该避免一些明显不对的Flux使用方法，例如在 Store中请求 API、在你的 Store 中触发 actions。你的 Flux 代码会更容易掌握一旦你基于 Reducers 来构建它。

* 当你所有的Flux Stores 全部基于 reducers 来实现时，这时你可以利用[`combineReducers(reducers)`](../api/combineReducers.md)将多个 reducers 合并成一个，然后在应用里只使用一个Store。

* 现在只剩下[使用 react-redux](../basics/UsageWithReact.md)或者类似的库来处理你的UI部分。

* 最后，你或许想使用一些 Redux 的特性，例如利用中间件来进一步简化异步的代码


## 迁移Backbone项目

对不起，你需要重写你的 Model 层。
它们区别太大了。
