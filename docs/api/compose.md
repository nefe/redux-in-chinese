# `compose(...functions)`

从右到左来组合多个函数。

这是函数式编程中的方法，为了方便，被放到了 Redux 里。　　
当需要把多个 [store 增强器](../Glossary.md#store-enhancer) 依次执行的时候，需要用到它。

#### 参数

1. (*arguments*): 需要合成的多个函数。每个函数都接收一个函数作为参数。它将提供一个在函数左边的参数作为返回值，等等。唯一的例外是最右边的参数可以接受多个参数，因为它将提供由此产生的函数的签名。

#### 返回值

(*Function*): 从右到左把接收到的函数合成后的最终函数。

#### 示例

下面示例演示了如何使用 `compose` 增强 [store](Store.md)，这个 store 与 [`applyMiddleware`](applyMiddleware.md) 和 [redux-devtools](https://github.com/gaearon/redux-devtools) 一起使用。

```js
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import DevTools from './containers/DevTools'
import reducer from '../reducers/index'

const store = createStore(
  reducer,
  compose(
    applyMiddleware(thunk),
    DevTools.instrument()
  )
)
```

#### 小贴士

* `compose` 做的只是让你不使用深度右括号的情况下来写深度嵌套的函数。不要觉得它很复杂。
