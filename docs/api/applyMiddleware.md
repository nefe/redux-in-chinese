# `applyMiddleware(...middlewares)`

Middleware 是扩展 Redux，添加自定义功能建议使用的方式。Middleware 可以让你包装 store 的 [`dispatch`](Store.md#dispatch) 方法来实现功能。middleware 最大的优点是它的可组合性。多个 middleware 可以组合在一起，形成 middleware 链，其中每个 middleware 并不需要知道它在链中前面或后面的信息。

Middleware 最常用的使用场景是来做异步 action，好处是不需要太多样板代码，或者引入 [Rx](https://github.com/Reactive-Extensions/RxJS) 这样的第三方库。得益于它不但可以让你 dispatch 普通 action 还可以 dispatch [异步 action](../Glossary.md#async-action)。

例如，[redux-thunk](https://github.com/gaearon/redux-thunk) 支持 dispatch function，以此让 action creator 控制反转。这些 function 会接收 [`dispatch`](Store.md#dispatch) 作为参数，并且可以异步调用它。这类的 function 就称为 *thunk*。另一个 middleware 示例是 [redux-promise](https://github.com/acdlite/redux-promise)。它支持 dispatch 一个异步的 [Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) action，并且在 Promise resolve 后 dispatch 一个普通的 action。

Middleware 并不是和 [`createStore`](createStore.md) 绑在一起的，也不是 Redux 架构的基础组成部分，但我们觉得它非常有用，因为在 Redux 核心里就支持它。因此，它是扩展 [`dispatch`](Store.md#dispatch) 的惟一标准方式，虽然不同的 middleware 可能在易用性和用法上有所不同。

#### 参数

* `...middlewares` (*arguments*): Functions that conform to the Redux *middleware API*. Each middleware receives [`Store`](Store.md)’s [`dispatch`](Store.md#dispatch) and [`getState`](Store.md#getState) functions as named arguments, and returns a function. That function will be given the `next` middleware’s dispatch method, and is expected to return a function of `action` calling `next(action)` with a potentially different argument, or at a different time, or maybe not calling it at all. The last middleware in the chain will receive the real store’s [`dispatch`](Store.md#dispatch) method as the `next` parameter, thus ending the chain. 
所以，middleware 的格式是 `({ getState, dispatch }) => next => action`。
, the middleware signature is `({ getState, dispatch }) => next => action`.

#### 返回值

(*Function*) 一个应用了 middleware 后的 store enhancer。这个 store enhancer就是一个函数，并且需要应用到 `createStore`。它会返回一个应用了 middleware 的不同的 `createStore`。
 A store enhancer that applies the given middleware. The store enhancer is a function that needs to be applied to `createStore`. It will return a different `createStore` which has the middleware enabled.

#### 示例: 自定义 Logger Middleware

```js
import { createStore, applyMiddleware } from 'redux';
import todos from './reducers';

function logger({ getState }) {
  return (next) => (action) => {
    console.log('will dispatch', action);

    // 调用 middleware 链中下一个 middleware 的 dispatch。
    let returnValue = next(action);

    console.log('state after dispatch', getState());

    // 一般会是 action 本身，除非
    // 后面的 middleware 修改了它。
    return returnValue;
  };
}

let createStoreWithMiddleware = applyMiddleware(logger)(createStore);
let store = createStoreWithMiddleware(todos, ['Use Redux']);

store.dispatch({
  type: 'ADD_TODO',
  text: 'Understand the middleware'
});
// (将打印如下信息:)
// will dispatch: { type: 'ADD_TODO', text: 'Understand the middleware' }
// state after dispatch: ['Use Redux', 'Understand the middleware']
```

#### 示例: 使用 Thunk Middleware 来做异步 Actions

```js
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import * as reducers from './reducers';

// 调用 applyMiddleware，使用 middleware 增强 createStore：
let createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

// 像原生 createStore 一样使用。
let reducer = combineReducers(reducers);
let store = createStoreWithMiddleware(reducer);

function fetchSecretSauce() {
  return fetch('https://www.google.com/search?q=secret+sauce');
}

// These are the normal action creators you have seen so far.
// The actions they return can be dispatched without any middleware.
// However, they only express “facts” and not the “async flow”.

function makeASandwich(forPerson, secretSauce) {
  return {
    type: 'MAKE_SANDWICH',
    forPerson,
    secretSauce
  };
}

function apologize(fromPerson, toPerson, error) {
  return {
    type: 'APOLOGIZE',
    fromPerson,
    toPerson,
    error
  };
}

function withdrawMoney(amount) {
  return {
    type: 'WITHDRAW',
    amount
  };
}

// Even without middleware, you can dispatch an action:
store.dispatch(withdrawMoney(100));

// But what do you do when you need to start an asynchronous action,
// such as an API call, or a router transition?

// Meet thunks.
// A thunk is a function that returns a function.
// This is a thunk.

function makeASandwichWithSecretSauce(forPerson) {

  // Invert control!
  // Return a function that accepts `dispatch` so we can dispatch later.
  // Thunk middleware knows how to turn thunk async actions into actions.

  return function (dispatch) {
    return fetchSecretSauce().then(
      sauce => dispatch(makeASandwich(forPerson, sauce)),
      error => dispatch(apologize('The Sandwich Shop', forPerson, error))
    );
  };
}

// Thunk middleware lets me dispatch thunk async actions
// as if they were actions!

store.dispatch(
  makeASandwichWithSecretSauce('Me')
);

// It even takes care to return the thunk’s return value
// from the dispatch, so I can chain Promises as long as I return them.

store.dispatch(
  makeASandwichWithSecretSauce('My wife')
).then(() => {
  console.log('Done!');
});

// In fact I can write action creators that dispatch
// actions and async actions from other action creators,
// and I can build my control flow with Promises.

function makeSandwichesForEverybody() {
  return function (dispatch, getState) {
    if (!getState().sandwiches.isShopOpen) {

      // You don’t have to return Promises, but it’s a handy convention
      // so the caller can always call .then() on async dispatch result.

      return Promise.resolve();
    }

    // We can dispatch both plain object actions and other thunks,
    // which lets us compose the asynchronous actions in a single flow.

    return dispatch(
      makeASandwichWithSecretSauce('My Grandma')
    ).then(() =>
      Promise.all([
        dispatch(makeASandwichWithSecretSauce('Me')),
        dispatch(makeASandwichWithSecretSauce('My wife'))
      ])
    ).then(() =>
      dispatch(makeASandwichWithSecretSauce('Our kids'))
    ).then(() =>
      dispatch(getState().myMoney > 42 ?
        withdrawMoney(42) :
        apologize('Me', 'The Sandwich Shop')
      )
    );
  };
}

// This is very useful for server side rendering, because I can wait
// until data is available, then synchronously render the app.

store.dispatch(
  makeSandwichesForEverybody()
).then(() =>
  response.send(React.renderToString(<MyApp store={store} />))
);

// I can also dispatch a thunk async action from a component
// any time its props change to load the missing data.

import { connect } from 'react-redux';
import { Component } from 'react';

class SandwichShop extends Component {
  componentDidMount() {
    this.props.dispatch(
      makeASandwichWithSecretSauce(this.props.forPerson)
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.forPerson !== this.props.forPerson) {
      this.props.dispatch(
        makeASandwichWithSecretSauce(nextProps.forPerson)
      );
    }
  }

  render() {
    return <p>{this.props.sandwiches.join('mustard')}</p>
  }
}

export default connect(
  state => ({
    sandwiches: state.sandwiches
  })
)(SandwichShop);
```

#### 小贴士

* Middleware 只是包装了 store 的 [`dispatch`](Store.md#dispatch) 方法。技术上讲，任何 middleware 能做的事情，都可能通过手动包装 `dispatch` 调用来做。但是在一个地方统一管理会好很多。

* 如果除了 `applyMiddleware`，你还用了其它 store enhancer，一定要把 `applyMiddleware` 放到组合链的前面，因为 middleware 可能会做异步操作。比如，它应该在 [redux-devtools](https://github.com/gaearon/redux-devtools) 前面，不然 DevTools 就看不到 Promise middleware 里 dispatch 的 action 了。

* 如果你想有条件地使用 middleware，记住只 import 需要的部分：

  ```js
  let middleware = [a, b];
  if (process.env.NODE_ENV !== 'production') {
    let c = require('some-debug-middleware');
    let d = require('another-debug-middleware');
    middleware = [...middleware, c, d];
  }
  const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);
  ```

  这样做有利于打包时去掉不需要的模块，减小打包文件大小。

* 有想过 `applyMiddleware` 本质是什么吗？它肯定是比 middleware 还强大的扩展机制。实际上，`applyMiddleware` 只是被称为 Redux 最强大的扩展机制的 [store enhancers](../Glossary.md#store-enhancer) 中的一个范例而已。你不太可能需要实现自己的 store enhancer。另一个 store enhancer 示例是 [redux-devtools](https://github.com/gaearon/redux-devtools)。Middleware 并没有 store enhancer 强大，但开发起来却是更容易的。

* Middleware 听起来比实际难一些。真正理解 middleware 的惟一办法是看一下现有的 middleware 是如何工作的，并尝试自己写一些。实现的功能可能错综复杂，但是大部分 middleware 实际上很小，只有 10 行左右，组成起来后才变得强大。