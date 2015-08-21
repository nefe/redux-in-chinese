# Store

Store 就是用来维持应用所有的 [state 树](../Glossary.md#state) 的一个对象。  
改变 store 内 state 的惟一途径是对它 dispatch 一个 [action](../Glossary.md#action)。

Store 不是类。它只是有几个方法的对象。  
要创建它，只需要把根部的 [reducing 函数](../Glossary.md#reducer) 传递给 [`createStore`](createStore.md)。

>##### Flux 用户使用注意

>如果你以前使用 Flux，那么你只需要注意一个重要的区别。Redux 没有 Dispatcher 且不支持多个 store。相反，只有一个单一的 store 和一个根级的 reduce 函数（reducer）。随着应用不断变大，你应该把根级的 reducer 拆成多个小的 reducers，分别独立地操作 state 树的不同部分，而不是添加新的 stores。这就像一个 React 应用只有一个根级的组件，这个根组件又由很多小组件构成。

### Store 方法

- [`getState()`](#getState)
- [`dispatch(action)`](#dispatch)
- [`subscribe(listener)`](#subscribe)
- [`getReducer()`](#getReducer)
- [`replaceReducer(nextReducer)`](#replaceReducer)

## Store 方法

### <a id='getState'></a>[`getState()`](#getState)

返回应用当前的 state 树。  
它与 store 的最后一个 reducer 返回值相同。

#### 返回

*(any)*: 应用当前的 state 树。

<hr>

### <a id='dispatch'></a>[`dispatch(action)`](#dispatch)

分发 action。这是触发 state 变化的惟一途径。

会使用当前 [`getState()`](#getState) 的结果和传入的 `action` 以同步方式的调用 store 的 reduce 函数。返回值会被作为下一个 state。从现在开始，这就成为了 [`getState()`](#getState) 的返回值，同时变化监听器(change listener)会被触发。

>##### Flux 用户使用注意

>当你在 [reducer](../Glossary.md#reducer) 内部调用 `dispatch` 时，将会抛出错误提示“Reducers may not dispatch actions.（Reducer 内不能 dispatch action）”。这就相当于 Flux 里的 “Cannot dispatch in a middle of dispatch（dispatch 过程中不能再 dispatch）”，但并不会引起对应的错误。在 Flux 里，当 Store 处理 action 和触发 update 事件时，dispatch 是禁止的。这个限制并不好，因为他限制了不能在生命周期回调里 dispatch action，还有其它一些本来很正常的地方。

>在 Redux 里，只会在根 reducer 返回新 state 结束后再会调用事件监听器，因此，你可以在事件监听器里再做 dispatch。惟一使你不能在 reducer 中途 dispatch 的原因是要确保 reducer 没有副作用。如果 action 处理会产生副作用，正确的做法是使用异步 [action 生成器](../Glossary.md#action-creator)。

#### 参数

1. `action` (*Object*<sup>†</sup>): 描述应用变化的普通对象。Action 是把数据传入 store 的惟一途径，所以任何数据，无论来自 UI 事件，网络回调或者是其它资源如 WebSockets，最终都应该以 action 的形式被 dispatch。按照约定，action 具有 `type` 字段来表示它的类型。type 也可被定义为常量或者是从其它模块引入。最好使用字符串，而不是 [Symbols](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Symbol) 作为 action，因为字符串是可以被序列化的。除了 `type` 字段外，action 对象的结构完全取决于你。参照 [Flux 标准 Action](https://github.com/acdlite/flux-standard-action) 获取如何组织 action 的建议。

#### 返回

(Object<sup>†</sup>): 要 dispatch 的 action。

#### 注意

<sup>†</sup> The “vanilla” store implementation you get by calling [`createStore`](createStore.md) only supports plain object actions and hands them immediately to the reducer.

However, if you wrap [`createStore`](createStore.md) with [`applyMiddleware`](applyMiddleware.md), the middleware can interpret actions differently, and provide support for dispatching [intents](../Glossary.md#intent). Intents are usually asynchronous primitives like Promises, Observables, or thunks.

Middleware is created by the community and does not ship with Redux by default. You need to explicitly install packages like [redux-thunk](https://github.com/gaearon/redux-thunk) or [redux-promise](https://github.com/acdlite/redux-promise) to use it. You may also create your own middleware.

To learn how to describe asynchronous API calls, read the current state inside action creators, perform side effects, or chain them to execute in a sequence, see the examples for [`applyMiddleware`](applyMiddleware.md).

#### 示例

```js
import { createStore } from 'redux';
let store = createStore(todos, ['Use Redux']);

function addTodo(text) {
  return {
    type: 'ADD_TODO',
    text
  };
}

store.dispatch(addTodo('Read the docs'));
store.dispatch(addTodo('Read about the middleware'));
```

<hr>

### <a id='subscribe'></a>[`subscribe(listener)`](#subscribe)

添加一个变化监听器。
Adds a change listener. It will be called any time an action is dispatched, and some part of the state tree may potentially have changed. You may then call [`getState()`](#getState) to read the current state tree inside the callback.

It is a low-level API. Most likely, instead of using it directly, you’ll use React (or other) bindings. If you feel that the callback needs to be invoked with the current state, you might want to [convert the store to an Observable or write a custom `observeStore` utility instead](https://github.com/rackt/redux/issues/303#issuecomment-125184409).

To unsubscribe the change listener, invoke the function returned by `subscribe`.

#### 参数

1. `listener` (*Function*): The callback to be invoked any time an action has been dispatched, and the state tree might have changed. You may call [`getState()`](#getState) inside this callback to read the current state tree. It is reasonable to expect that the store’s reducer is a pure function, so you may compare references to some deep path in the state tree to learn whether its value has changed.

##### 返回

(*Function*): A function that unsubscribes the change listener.

##### 示例

```js
function select(state) {
  return state.some.deep.property;
}

let currentValue;
function handleChange() {
  let previousValue = currentValue;
  currentValue = select(store.getState());
  
  if (previousValue !== currentValue) {
    console.log('Some deep nested property changed from', previousValue, 'to', currentValue);
  }
}

let unsubscribe = store.subscribe(handleChange);
handleChange();
```

<hr>

### <a id='getReducer'></a>[`getReducer()`](#getReducer)

>##### 已过期

>此 API 已[过期](https://github.com/rackt/redux/issues/350).  
>我们找到更好的方式来处理后会移除它。

Returns the reducer currently used by the store to calculate the state.

It is an advanced API. You might only need this if you implement a hot reloading mechanism for Redux.

#### 返回

(*Function*): The store’s current reducer.

<hr>

### <a id='replaceReducer'></a>[`replaceReducer(nextReducer)`](#replaceReducer)

>##### 已过期

>此 API 已[过期](https://github.com/rackt/redux/issues/350).  
>我们找到更好的方式来处理后会移除它。

Replaces the reducer currently used by the store to calculate the state.

It is an advanced API. You might need this if your app implements code splitting, and you want to load some of the reducers dynamically. You might also need this if you implement a hot reloading mechanism for Redux.

#### 参数

1. `reducer` (*Function*) The next reducer for the store to use.
