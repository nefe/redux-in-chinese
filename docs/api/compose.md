# `compose(...functions)`

从左到右来组合多个函数。

这是函数式编程中的方法，为了方便，被放到了 Redux 里。
当需要把多个 [store 增强器](../Glossary.md#store-enhancer) 依次执行的时候，需要用到它。

#### 参数

1. (*arguments*): 需要合成的多个函数。每个函数都接收一个函数作为参数，然后返回一个函数。

#### 返回

(*Function*): 从左到右把接收到的函数合成后的最终函数。

#### 示例

下面示例演示了如何使用 `compose` 增强 [store](Store.md)，这个 store 与 [`applyMiddleware`](applyMiddleware.md) 和 [redux-devtools](https://github.com/gaearon/redux-devtools) 一起使用。

```js
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import * as reducers from '../reducers/index';

let reducer = combineReducers(reducers);
let middleware = [thunk];

let finalCreateStore;

// 生产环境中，我们希望只使用 middleware。
// 而在开发环境中，我们还希望使用一些 redux-devtools 提供的一些 store 增强器。
// UglifyJS 会在构建过程中把一些不会执行的死代码去除掉。

if (process.env.NODE_ENV === 'production') {
  finalCreateStore = applyMiddleware(...middleware)(createStore);
} else {
  finalCreateStore = compose(
    applyMiddleware(...middleware),
    require('redux-devtools').devTools(),
    require('redux-devtools').persistState(
      window.location.href.match(/[?&]debug_session=([^&]+)\b/)
    ),
    createStore
  );

  // 不使用 compose 来写是这样子：
  //
  // finalCreateStore =
  //   applyMiddleware(middleware)(
  //     devTools()(
  //       persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))(
  //         createStore
  //       )
  //     )
  //   );
}

let store = finalCreateStore(reducer);
```

#### 小贴士

* `compse` 做的只是让你不使用深度右括号的情况下来写深度嵌套的函数。不要觉得它很复杂。
