# 初始化 State

主要有两种方法可以用来初始化你的应用的 state 。

1. 可以通过 `createStore` 方法，该方法接受可选的 `preloadedState` 做为其第二个参数；

2. reducer 中 state 参数的默认值为 `undefined` ，修改其默认值也可以用来初始化应用的 state，可以在 reducer 中检查 state 值是否为 `undefined` 从而显式的添加默认值，也可以通过 ES6 中默认参数的语法来添加默认值：
   `function myReducer(state = someDefaultValue, action)`

两种初始化 State 的方法会如何相互影响并没有那么直观，不过好在它们相互作用的过程遵守下面的这些明确的规则。

## 概要

如果没有使用 `combineReducers()` 或者类似功能的代码，`preloadedState` 优先级会比在 reducer 里面使用 `state = ...` 高 ，这是因为 `preloadedState` 会做为 `state` 传递到 reducer 中，`state` 的值不再是 `undefined` ，ES6 的默认参数不会生效。

如果使用了 `combineReducers()` 方法，结果就会有一些细微的差别。那些在 `preloadedState` 中指明了 `state` 的 reducer 会以对应传入的值做为初始值。其他的 reducer 接收到的则还是 `undefined` 则还会使用 `state = ...` 指定的默认值。

**通常情况下，通过 `preloadedState` 指定的 state 优先级要高于通过 reducer 指定的 state。这种机制的存在允许我们在 reducer 可以通过指明默认参数来指定初始数据，而且还为通过服务端或者其它机制注入数据到 store 中提供了可能。**

> 注意：通过 `preloadedState` 传入了初始化数据的 reducers 仍然需要添加默认值来应对传递的 state 为 `undefined` 的情况。这样，当所有的 reducers 在初始化时被传入 state 的都是 `undefined` 时，还可以返回一些默认值，默认值可以是任何非 `undefined` 的值，不过也没有必要复制 `preloadedState` 做为其默认值。

## 深入理解

### 单个简单的 Reducer

首先我们来考虑只有一个 reducer 的情况，这种情况下我们无须使用 `combineReducers()` 方法。
此时的 reducer 可能会是下面这个样子：

```js
function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}
```

接下来，假设你通过上面的 reducer 创建了一个 store。

```js
import { createStore } from 'redux'
const store = createStore(counter)
console.log(store.getState()) // 0
```

结果我们得到的初始的 state 的值为 0 ，为什么呢？
因为你传给 `createStore` 的第二个参数是 `undefined`，也就是说你传给 reducer 中的 state 的初始值也是 `undefined` 。当 Redux 初始化时，实际上会触发一个 “dummy” action 来填充 store。当 reducer `counter` 被调用时，由于传入的 `state` 等于 `undefined` ，默认参数生效了。因此 state 的值为设定的默认值 0。

我们来看看另一种不同的场景：

```js
import { createStore } from 'redux'
const store = createStore(counter, 42)
console.log(store.getState()) // 42
```

此时得到的值为 `42`，不是 `0`，为什么又会这样呢？
这种情况下 `createStore` 方法被调用时，第二个参数传入的是 `42`。这个值会在 “dummmy” action 触发时传递给 state，由于这个值不为 `undefined`，因此设定的默认值不会起作用，在 reducer 中 `state` 返回值 42。

### 合并的 Reducers

我们再来看看使用了 `combineReducers()` 方法的情况。
假设你有下面这两个 reducer：

```js
function a(state = 'lol', action) {
  return state;
}
​
function b(state = 'wat', action) {
  return state;
}
```

通过 `combineReducers({ a, b })` 方式我们可以把上面两个 reducer 合并为一个 reducer

```js
// const combined = combineReducers({ a, b })
function combined(state = {}, action) {
  return {
    a: a(state.a, action),
    b: b(state.b, action)
  }
}
```

如果我们调用 `createStore` 方法时，不传入 `preloadedState` ，初始化 `state` 会为 `{}`。在调用对应的 reducer 时会传入 `state.a` 和 `state.b` 做为 `state` 的参数，不过由于这两个值都是 `undefined`。a 和 b 两个 reducer 都会接收 `undefined` 作为 `state` 的参数，此时如果 `state` 有默认值，就会返回默认值。因此上述组合 reducer 在首次调用时会返回 `{ a: 'lol', b: 'wat' }`。

```js
import { createStore } from 'redux'
const store = createStore(combined)
console.log(store.getState()) // { a: 'lol', b: 'wat' }
```

我们再来看看一个不同的情况：

```js
import { createStore } from 'redux'
const store = createStore(combined, { a: 'horse' })
console.log(store.getState()) // { a: 'horse', b: 'wat' }
```

上述代码中我在 `createStore()` 方法调用时传入了 `preloadedState` 。得到的结果是我为 a reducer 指定的值和 b reducer 的默认值组合而成。

我们仔细来看看这个组合 reducer 做了什么：

```js
// const combined = combineReducers({ a, b })
function combined(state = {}, action) {
  return {
    a: a(state.a, action),
    b: b(state.b, action)
  }
}
```

上面的代码中，指定了组合 reducer 的 `state` ，因此其值不会是默认的 `{}`, 而是一个对象，并且该对象中键 `a` 的值为 `’horse'`，但是并不存在键 `b`。这就导致 a reducer 接受 `horse` 作为其 state 的参数，而 b reducer 则接收 `undefined` 做为其 `state` 的参数，因此在 b reducer 中设置的默认 `state` 会生效 （在本例中是 `'wat'`）。最终我们得到的结果为 `{ a: 'horse', b: 'wat'}`。

## 总结

总结一下，如果你使用 redux 的推荐做法，在 reducer 中给定 state 参数的默认值（最简单的方法是通过 ES6 的默认值语法），你将拥有一个表现良好的组合 reducer。**这个组合 reducer 会优先使用你通过 `preloadedState` 传递来的对应的值，不过就算你没传递或者不存在对应的值，也会使用你设定的默认值。**这种机制非常棒，它提供了设置初始值并注入的途径，也保留了 reducer 设置默认值的能力。加上`combineReducers()` 可以在不同级别上使用，这种模式可以递归的使用。
