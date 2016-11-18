# 初始化 State

主要有两种方法来初始化应用的 state 。

可以使用 `createStore` 方法中的第二个可选参数 `preloadedState`。

也可以在 reducer 中为 `undefined` 的 state 参数指定的默认的初始值。这个可以通过在 reducer 中添加一个明确的检查来完成，也可以使用 ES6 中默认参数的语法 `function myReducer(state = someDefaultValue, action)`

这两种方法是怎么相互影响的也许并不总是很清楚，不过幸运的是，这个过程遵循着一些可预见的规则，这里来说明它们是如何联系在一起的。


## 概要

如果不使用 `combineReducers()` 或者类似的代码，那么 `preloadedState` 总是会优先于在 reducer 里面使用 `state = ...` ，因为 `state` 传到 reducer 里的**是** `preloadedState` 的 state **而不是** `undefined`，所以 ES6 的默认参数语法并不起作用。

如果使用 `combineReducers()` 方法，那么这里的行为就会有一些细微的差别了。那些指定了 `preloadedState` 的 reducer 会接收到那些对应的 state。而其他的 reducer 将会接收到 `undefined` 并因此回到了 `state = ...` 这里去获取指定的默认值。

**通常情况下，通过 `preloadedState` 指定的 state 要优先于通过 reducer 指定 state。这样可以使通过 reducer 默认参数指定初始数据显得更加的合理，并且当你从一些持久化的存储器或服务器更新 store 的时候，允许你更新已存在的数据（全部或者部分）。**


## 深度


### 单一简单的 Reducer

首先，让我们举一个单独的 reducer 的例子，并且不使用 `combineReducers()` 方法。

那么你的 reducer 可能像下面这样：

```js
function counter(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT': return state + 1;
  case 'DECREMENT': return state - 1;
  default: return state;
  }
}
```

现在让我们创建一个 store。

```
import { createStore } from 'redux';
let store = createStore(counter);
console.log(store.getState()); // 0
```

初始的状态是 0 。为什么呢？因为 `createStore` 的第二个参数是 `undefined`。这是 `state` 第一次传到了 reducer 当中。Redux 会发起（dispatch）一个“虚拟”的 action 来填充这个 state 。所以 `counter` reducer 里获得的 `state` 等于 `undefined`。**实际上这相当于触发了那个默认参数的特性**。因此，现在 `state` 的值是设定的默认参数 `0` ，这个 state (`0`) 是这里 reducer 的返回值。

接下来让我们举一个不同场景的例子：

```js
import { createStore } from 'redux';
let store = createStore(counter, 42);
console.log(store.getState()); // 42
```

为什么这次这里的值是 `42` 而不是 `0` 呢？因为 `createStore` 的第二个参数是 `42` 。这个参数会赋给 state 并伴随着一个虚拟 action 一起传给 reducer。**这次，传给 reducer 的 `state` 不再是 `undefined` (是 `42` )，所以 ES6 的默认参数特性没有起作用。**所以这里的 `state` 是 `42`，`42` 是这个 reducer 的返回值。


### 组合多个 Reducers

现在让我们举一个使用 `combineReducers()` 的例子。

你有两个 reducers：

```js
function a(state = 'lol', action) {
  return state;
}

function b(state = 'wat', action) {
  return state;
}
```

这个组合的 reducer 通过 `combineReducers({ a, b })` 生成，就像下面这样：

```js
// const combined = combineReducers({ a, b })
function combined(state = {}, action) {
  return {
	a: a(state.a, action),
	b: b(state.b, action)
  };
}
```

如果我们调用 `createStore` 方法并且不使用 `preloadedState` 参数，它将会把 `state` 初始化成 `{}`。 因此，传入 reducer 的`state.a` 和 `state.b` 的值将会是 `undefined` **不论是 `a` 还是 `b` 的值都是 `undefined` ，这时如果指定 `state` 的默认值，那么 reducer 将会返回这个默认值。 这就是第一次请求这个组合的 reducer 时返回 state `{ a: 'lol', b: 'wat'}` 的原因。

```js
import { createStore } from 'redux';
let store = createStore(combined);
console.log(store.getState()); // { a: 'lol', b: 'wat' }
```

接下来让我们举一个不同的场景的例子：

```js
import { createStore } from 'redux';
let store = createStore(combined, { a: 'horse' });
console.log(store.getState()); // { a: 'horse', b: 'wat' }
```

现在我们指定了 `createStore()` 的 `preloadedState` 参数。现在这个组合的 reducer 返回的 state 结合了我们指定给 `a` 的默认值 `horse` 以及通过 reducer 本身默认参数指定的 `b` 的值 `'wat'` 。

让我们重新看看这个组合的 reducer 做了什么：

```js
// const combined = combineReducers({ a, b })
function combined(state = {}, action) {
  return {
	a: a(state.a, action),
	b: b(state.b, action)
  };
}
```

在这个案例中，`state` 是我们指定的，所以它并没有被赋值为 `{}`。这是一个 `a` 的值是 `'horse'` 的对象，但是没有 `b` 的值。这就是为什么 `a` reducer 收到了 `'horse'` 的 state 并高兴地返回它，但 `b` reducer 却得到了 `undefined` state 并因此返回了它自己设定的默认值（在这个例子里是`'wat'`）。这就是我们如何得到的 `{ a: 'horse', b: 'wat' }` 这个结果。


## 总结

综上所述，如果你遵守 Redux 的约定并且要让 reducer 中 `undefined` 的 `state` 参数返回初始 state （最简单的实现方法就是利用 ES6 的默认参数来指定 state），那么对于组合多个 reducers 的情况，这将是一个很有用的做法，**他们会优先选择通过 `preloadedState` 参数传到 `createStore()` 的对象中的相应值，但是如果你不传任何东西，或者没设置相应的字段，那么 reducer 就会选择指定的默认 `state` 参数来取代**。这样的方法效果很好，因为他既能用来初始化也可以用来更新现有的数据，不过如果数据没有保护措施的话，这样做也会使一些独立的 reducer 的 state 被重新赋值。当然你可以递归地使用这个模式，比如你可以在多个层级上使用 `combineReducers()` 方法，或者甚至手动的组合这些 reducer 并且传入对应部分的 state tree。
