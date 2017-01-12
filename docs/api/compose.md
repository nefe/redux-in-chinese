# `compose(...functions)`

从右到左来组合多个函数。

这是函数式编程中的方法，为了方便，被放到了 Redux 里。  
当需要把多个 [store 增强器](../Glossary.md#store-enhancer) 依次执行的时候，需要用到它。

#### 参数

1. (*arguments*): 需要合成的多个函数。预计每个函数都接收一个参数。它的返回值将作为一个参数提供给它左边的函数，以此类推。例外是最右边的参数可以接受多个参数，因为它将为由此产生的函数提供签名。（译者注：`compose(funcA, funcB, funcC)` 形象为 `compose(funcA(funcB(funcC())))`）

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

* `compose` 做的只是让你在写深度嵌套的函数时，避免了代码的向右偏移（译者注：可以参考[上述的译者注](#参数)）。不要觉得它很复杂。
