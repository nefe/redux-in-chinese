# 迁移到 Redux

Redux is not a monolithic framework, but a set of contracts and a [few functions that make them work together](../api/README.md). The majority of your “Redux code” will not even use Redux APIs, as most of the time you’ll be writing functions. 

Redux 不是一个monolithic 的框架，但是也设置了一些约定并[提供了一些函数](../api/README.md)来让这些工作。你的Redux项目中得主要代码都不是在使用Redux的API，大多数时间你会在写一些函数。

This makes it easy to migrate both to and from Redux.  
We don’t want to lock you in!

这让把旧的项目迁移到Redux上来变得非常容易。我们不想限制你！

## 迁移Flux项目

[Reducers](../Glossary.md#reducer) capture “the essence” of Flux Stores, so it’s possible to gradually migrate an existing Flux project towards Redux, whether you are using [Flummox](http://github.com/acdlite/flummox), [Alt](http://github.com/goatslacker/alt), [traditional Flux](https://github.com/facebook/flux), or any other Flux library.

[Reducers](../Glossary.md#reducer) 提取了 Flux Stores的本质，所以这让逐步迁移一个Flux项目到Redux上面来变成了可能，无论你使用了[Flummox](http://github.com/acdlite/flummox), [Alt](http://github.com/goatslacker/alt), [traditional Flux](https://github.com/facebook/flux), 还是其他Flux库。

It is also possible to do the reverse and migrate from Redux to any of these libraries following the same steps.

同样你也可以将Redux的项目通过同样的操作改回上述的这些Flux框架


Your process will look like this:
你需要做的大概是这样：

* Create a function called `createFluxStore(reducer)` that creates a Flux store compatible with your existing app from a reducer function. Internally it might look similar to [`createStore`](../api/createStore.md) implementation from Redux. Its dispatch handler should just call the `reducer` for any action, store the next state, and emit change.

* 建立一个叫做 `createFluxStore(reducer)`的函数，来通过reducer函数适配你当前项目的Flux Store。从内部来看，这个函数很像Redux中的[`createStore`](../api/createStore.md) 的实现。它的dispatch 处理器 应该根据不同的action来调用不同的 `reducer`，从该改变应用的状态。


* This allows you to gradually rewrite every Flux Store in your app as a reducer, but still export `createFluxStore(reducer)` so the rest of your app is not aware that this is happening and sees the Flux stores.

* 通过export `createFluxStore(reducer)`，可以让你逐步将你的Flux Store重写为Reducer，逐步回归改动，避免对应用产生影响。


* As you rewrite your Stores, you will find that you need to avoid certain Flux anti-patterns such as fetching API inside the Store, or triggering actions inside the Stores. Your Flux code will be easier to follow once as you port it to be based on reducers!

* 当你重写了你的 Stores后，你会发现你应该避免一些明显不对的Flux使用方法，例如在Store中请求API、在你的Store中触发actions。你的Flux代码会更容易follow一旦你基于Reducers来构建它。


* When you have ported all of your Flux Stores to be implemented on top of reducers, you can replace the Flux library with a single Redux store, and combine those reducers you already have into one using [`combineReducers(reducers)`](../api/combineReducers.md).

* 当你所有的Flux Stores 全部基于reducers来实现时，你可以将Flux库替换成Redux，这时你可以利用[`combineReducers(reducers)`](../api/combineReducers.md)将多个reducers合并成一个Redux Store。


* Now all that’s left to do is to port the UI to [use react-redux](../basics/UsageWithReact.md) or equivalent.

* 现在只剩下[使用 react-redux](../basics/UsageWithReact.md)或者类似的库来处理你的UI部分。

* Finally, you might want to begin using some Redux idioms like middleware to further simplify your asynchronous code.

* 最后，你或许想使用一些Redux的特性，例如利用中间件来进一步简化异步的代码


## 迁移Backbone项目

Sorry, you’ll need to rewrite your model layer.  
It’s way too different!

对不起，你需要重写你的 Model 层，这太困难了。