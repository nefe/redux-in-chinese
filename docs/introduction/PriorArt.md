# 先前技术

Redux 是一个混合的产物。它和一些设计模式和技术相似，但它也有与众不同之处。我们现在来探索它的一些相似与不同。

### Flux

Redux 可以被考虑是一种 [Flux](https://facebook.github.io/flux/) 实现吗?
[是](https://twitter.com/fisherwebdev/status/616278911886884864)，或者说 [不是](https://twitter.com/andrestaltz/status/616270755605708800).

(不用担心，[Flux 生成器](https://twitter.com/jingc/status/616608251463909376) [赞成它](https://twitter.com/fisherwebdev/status/616286955693682688)，如果所有人都想知道结果。)

Redux 是从很多有质量的 Flux 实现中产生的灵感。像 Flux 一样，Redux 规定集中你的 model 去更新应用的核心层里的逻辑（Flux 里的 store，Redux 里的 reducers）。替代应用代码直接改变数据，同时告诉你，描述每一个改变对象的动作叫 "action"。

不像 Flux 的是，**Redux 没有分发器的概念**。这是因为它依赖于纯函数来替代事件处理器。纯函数可以很方便的构建，而且不需要额外的实体来管理它们。取决于怎么样看 Flux，你可能看得到实现差异或实现细节。Flux 经常[被描述成 `(state, action) => state`](https://speakerdeck.com/jmorrell/jsconf-uy-flux-those-who-forget-the-past-dot-dot-dot)。从这个意义上说，Redux 是 Flux 架构的正确实现，这得感谢一下纯函数让它更简单。

和 Flux 另一个重要的区别是 **Redux 假设你永远不会改变你的数据**。你可以用纯对象和数组来管理好，在 reducers 里改变会深感挫折。你可以返回一个新对象， 它可以很容易的使用 [ES7 所提议的对象 spread 语法](https://github.com/sebmarkbage/ecmascript-rest-spread) 和 [Babel](http://babeljs.io)，或使用一个库像 [Immutable](https://facebook.github.io/immutable-js) 来实现。

虽然技术上*可能* [写不纯的 reducers](https://github.com/gaearon/redux/issues/328#issuecomment-125035516) 来改变数据为了性能方面，但我们不鼓励你这么做。像开发时间旅行、记录/回放或热加载特性将会被不可实现。此外，在大部分应用，不像不可变特性会影响性能问题，因为，像 [Om](https://github.com/omcljs/om) 里的示范，即时是对象分配失败，仍然可以防止昂贵的重渲染和重计算，因为你知道什么改变了，这得感谢 reducer 的纯度。

### Elm

[Elm](http://elm-lang.org/) 是一个函数式编程语言，创造于 [Evan Czaplicki](https://twitter.com/czaplic)。它受到了 [能描述成`(state, action) => state`的架构](http://elm-lang.org/guide/architecture) 激励。 从技术上说，Elm 的 "updaters" 等同于 Redux 里的 reducer。

不像 Redux，Elm 是一门语言，所以对于 actions 和模式匹配，它有着来自静态类型的优势。即使你没有计划使用 Elm，你也可以读关于 Elm 的架构，然后尝试一下。这将是十分有趣的，可以 [从 JavaScript 库产生的类似想法](https://github.com/paldepind/noname-functional-frontend-framework)。我们将看到 Redux 从中取得的灵感! 其中我们 [使用一个平缓的类型解决方案，像 Flow](https://github.com/gaearon/redux/issues/290) 来接近 Elm 的静态类型。

### Immutable

[Immutable](https://facebook.github.io/immutable-js) 是一个 JavaScript 库来实现不可变数据结构。它表现得十分高性能，并有着惯用的 JavaScript API。

Immutable 和相似的库对于 Redux 是相交的。我们一起使用它们非常容易!

**Redux 不关心你*怎么样*存储 state，它可能是纯对象，是不可变对象，或是其它类型。** 你将来可能想要序列化或反序列化技巧，为了在 server 端写同构应用或融合它们的 state，但此外，你也可以使用数据存储库 *尽可能让它支持不可变特性*。举个例子，对于 Redux state 来说，Backbone 没有任何意义，因为 Backbone models 是可变的。

记录到这，即使不可变库支持 cursors，你也不应该在 Redux 应用里使用。整个 state 树应该考虑只读，你应该使用 Redux 来更新 state 和订阅更新。因此通过 cursor 来写在 Redux 里没有任何意义。**如果只是 cursor 的用例是去耦的，对于从 UI 树和逐渐改善的 cursor 和产生的 state 树，你应该使用 selector 来替代它。** Selectors 是组合 getter 的方法组。参考 [reselect](http://github.com/faassen/reselect)，它是一个真正优秀和简洁的组合 selector 的现实。

### Baobab

[Baobab](https://github.com/Yomguithereal/baobab) 是另一个流行的实现了不可变 API 并使用纯 JavaScript 对象的库。当你在 Redux 里使用它，它们在一起会有着一定的优势。

大部分函数式 Baobab provides 是通过 cursors 来更新数据的，但是 Redux 施行只能通过分发一个 action 来更新数据。因此，它们通过不同的实现，解决了同样的问题。

不像 Immtable，Baobab 在引擎下还不能现实任何特别有效的数据结构，所以你在和 Redux 一起的时候没有真正的益处。它只是简单的使用了纯对象在案例里。

### Rx

[Reactive 扩展](https://github.com/Reactive-Extensions/RxJS) (和它们接受的 [现代化的重写](https://github.com/ReactiveX/RxJS)) 是管理复杂异步应用非常优秀的方案。事实上 [他们是构建人类计算机可观察到的，并有效的处理相互依赖的库](http://cycle.js.org).

它和 Redux 在一起使用有意义么? 当然! 他们可以极好的在一起。举个例子，这是一个简单地通过可观察变量来展示 Redx store 的例子:

```js
function toObservable(store) {
  return {
    subscribe({ onNext }) {
      let dispose = store.subscribe(() => onNext(store.getState()));
      onNext(store.getState());
      return { dispose };
    }
  }
}
```

相似地，你可以组成不同的异步流，在提供给他们 `store.dispatch()` 之前，转换他们到 action 中。

问题是: 你真的会在已经使用了 Rx 的同时需要 Redux 吗? 可能不会。[在 Rx 里重新现实 Redux](https://github.com/jas-chen/rx-redux) 并不难。有些人说这是使用 `.scan()` 方法的一两句实现。这可能不错!

如果你还在怀疑，拉下 Redux 的源代码 (这里不会多说什么)，它是也生态系统 (举个例子， [开发者工具](https://github.com/gaearon/redux-devtools)). 如果你不是很不关心这些，一定想要交互数据流，你可能是要探索像 [Cycle](http://cycle.js.org)，或者说把它合并到 Redux 中。让我们知道怎么才能做到它吧!
