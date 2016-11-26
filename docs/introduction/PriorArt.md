# 先前技术

Redux 是一个混合产物。它和一些设计模式及技术相似，但也有不同之处。让我们来探索一下这些相似与不同。

### Flux

Redux 可以被看作 [Flux](https://facebook.github.io/flux/) 的一种实现吗？
[是](https://twitter.com/fisherwebdev/status/616278911886884864)，也可以说 [不是](https://twitter.com/andrestaltz/status/616270755605708800)。

（别担心，它得到了[Flux 作者](https://twitter.com/jingc/status/616608251463909376)[的认可](https://twitter.com/fisherwebdev/status/616286955693682688)，如果你想确认。）

Redux 的灵感来源于 Flux 的几个重要特性。和 Flux 一样，Redux 规定，将模型的更新逻辑全部集中于一个特定的层（Flux 里的 store，Redux 里的 reducer）。Flux 和 Redux 都不允许程序直接修改数据，而是用一个叫作  “action” 的普通对象来对更改进行描述。

而不同于 Flux ，**Redux 并没有 dispatcher 的概念**。原因是它依赖纯函数来替代事件处理器。纯函数构建简单，也不需额外的实体来管理它们。你可以将这点看作这两个框架的差异或细节实现，取决于你怎么看 Flux。Flux 常常[被表述为 `(state, action) => state`](https://speakerdeck.com/jmorrell/jsconf-uy-flux-those-who-forget-the-past-dot-dot-dot)。从这个意义上说，Redux 无疑是 Flux 架构的实现，且得益于纯函数而更为简单。

和 Flux 的另一个重要区别，是 **Redux 设想你永远不会变动你的数据**。你可以很好地使用普通对象和数组来管理 state ，而不是在多个 reducer 里变动数据。正确且简便的方式是，你应该在 reducer 中返回一个新对象来更新 state， 同时配合 [object spread 运算符提案](../recipes/UsingObjectSpreadOperator.md) 或一些库，如 [Immutable](https://facebook.github.io/immutable-js)。

虽然出于性能方面的考虑，[写不纯的 reducer](https://github.com/gaearon/redux/issues/328#issuecomment-125035516) 来变动数据在技术上是**可行**的，但我们并不鼓励这么做。不纯的 reducer 会使一些开发特性，如时间旅行、记录/回放或热加载不可实现。此外，在大部分实际应用中，这种数据不可变动的特性并不会带来性能问题，就像 [Om](https://github.com/omcljs/om) 所表现的，即使对象分配失败，仍可以防止昂贵的重渲染和重计算。而得益于 reducer 的纯度，应用内的变化更是一目了然。

### Elm

[Elm](http://elm-lang.org/) 是一种函数式编程语言，由 [Evan Czaplicki](https://twitter.com/czaplic) 受 Haskell 语言的启发开发。它执行一种 [“model view update” 的架构](http://elm-lang.org/guide/architecture) ，更新遵循 `(state, action) => state` 的规则。 Elm 的 “updater” 与 Redux 里的 reducer 服务于相同的目的。

不同于 Redux，Elm 是一门语言，因此它在执行纯度，静态类型，不可变动性，action 和模式匹配等方面更具优势。即使你不打算使用 Elm，也可以读一读 Elm 的架构，尝试一把。基于此，有一个有趣的[使用 JavaScript 库实现类似想法](https://github.com/paldepind/noname-functional-frontend-framework) 的项目。Redux 应该能从中获得更多的启发！ 为了更接近 Elm 的静态类型，[Redux 可以使用一个类似 Flow 的渐进类型解决方案](https://github.com/gaearon/redux/issues/290) 。

### Immutable

[Immutable](https://facebook.github.io/immutable-js) 是一个可实现持久数据结构的 JavaScript 库。它性能很好，并且命名符合 JavaScript API 的语言习惯 。

Immutable 及类似的库都可以与 Redux 对接良好。尽可随意捆绑使用！

**Redux 并不在意你如何存储 state，state 可以是普通对象，不可变对象，或者其它类型。** 为了从 server 端写同构应用或融合它们的 state ，你可能要用到序列化或反序列化的机制。但除此以外，你可以使用任何数据存储的库，**只要它支持数据的不可变动性**。举例说明，对于 Redux state ，Backbone 并无意义，因为 Backbone model 是可变的。

注意，即便你使用支持 cursor 的不可变库，也不应在 Redux 的应用中使用。整个 state tree 应被视为只读，并需通过 Redux 来更新 state 和订阅更新。因此，通过 cursor 来改写，对 Redux 来说没有意义。**而如果只是想用 cursor 把 state tree 从 UI tree 解耦并逐步细化 cursor，应使用 selector 来替代。** Selector 是可组合的 getter 函数组。具体可参考 [reselect](http://github.com/faassen/reselect)，这是一个优秀、简洁的可组合 selector 的实现。

### Baobab

[Baobab](https://github.com/Yomguithereal/baobab) 是另一个流行的库，实现了数据不可变特性的 API，用以更新纯 JavaScript 对象。你当然可以在 Redux 中使用它，但两者一起使用并没有什么优势。

Baobab 所提供的大部分功能都与使用 cursors 更新数据相关，而 Redux 更新数据的唯一方法是分发一个 action 。可见，两者用不同方法，解决的却是同样的问题，相互并无增益。

不同于 Immutable ，Baobab 在引擎下还不能现实任何特别有效的数据结构，同时使用 Baobab 和 Redux 并无裨益。这种情形下，使用普通对象会更简便。

### Rx

[Reactive Extensions](https://github.com/Reactive-Extensions/RxJS) (和它们正在进行的 [现代化重写](https://github.com/ReactiveX/RxJS)) 是管理复杂异步应用非常优秀的方案。[以外，还有致力于构建将人机交互作模拟为相互依赖的可观测变量的库](http://cycle.js.org)。

同时使用它和 Redux 有意义么？当然！它们配合得很好。将 Redux store 视作可观察变量非常简便，例如：

```js
function toObservable(store) {
  return {
    subscribe({ onNext }) {
      let dispose = store.subscribe(() => onNext(store.getState()))
      onNext(store.getState())
      return { dispose }
    }
  }
}
```

使用类似方法，你可以组合不同的异步流，将其转化为 action ，再提交到 `store.dispatch()` 。

问题在于: 在已经使用了 Rx 的情况下，你真的需要 Redux 吗？ 不一定。[通过 Rx 重新实现 Redux](https://github.com/jas-chen/rx-redux) 并不难。有人说仅需使用一两句的 `.scan()` 方法即可。这种做法说不定不错！

如果你仍有疑虑，可以去查看 Redux 的源代码 (并不多) 以及生态系统 (例如[开发者工具](https://github.com/gaearon/redux-devtools))。如果你无意于此，仍坚持使用交互数据流，可以去探索一下 [Cycle](http://cycle.js.org) 这样的库，或把它合并到 Redux 中。记得告诉我们它运作得如何！
