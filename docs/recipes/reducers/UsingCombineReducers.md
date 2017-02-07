# `combineReducers` 用法

## 核心概念

基于 Redux 的应用程序中最常见的 state 结构是一个简单的 JavaScript 对象，它最外层的每个 key 中拥有特定域的数据。类似地，给这种 state 结构写 reducer 的方式是分拆成多个 reducer，拆分之后的 reducer 都是相同的结构（state, action），并且每个函数独立负责管理该特定切片 state 的更新。多个拆分之后的 reducer 可以响应一个 action，在需要的情况下独立的更新他们自己的切片 state，最后组合成新的 state。

这个模式是如此的通用，Redux 提供了 `combineReducers` 去实现这个模式。这是一个高阶 Reducer 的示例，他接收一个拆分后 reducer 函数组成的对象，返回一个新的 Reducer 函数。

在使用 `combineReducer` 的时候你需要重点注意下面几个方法：

* 首先，`combineReducer` 只是一个工具函数，用于简化编写 Redux reducer 时最常见的场景。你没有必要一定在你的应用程序中使用它，他不会处理每一种可能的场景。你完全可以不使用它来编写 reducer，或者对于 `combinerReducer` 不能处理的情况编写自定义的 reducer。（参见 [combineReducers](./BeyondCombineReducers.md) 章节中的例子和建议）
* 虽然 Redux 本身并不管你的 state 是如何组织的，但是 combineReducer 强制地约定了几个规则来帮助使用者们避免常见的错误（参见 [combineReducer](../../api/combineReducers.md)）
* 一个常见的问题是 Reducer 在 dispatch action 的时候是否调用了所有的 reducer。当初你可能觉得“不是”，因为真的只有一个根 reducer 函数啊。但是 `combineReducer` 确实有着这样的特殊效果。在生成新的 state 树时，`combinerReducers` 将调用每一个拆分之后的 reducer 和与当前的 Action，如果有需要的话会使得每一个 reducer 有机会响应和更新拆分后的 state。所以，在这个意义上， `combineReducers` 会调用所有的 reducer，严格来说是它包装的所有 reducer。
* 你可以在任何级别的 reducer 中使用 `combineReducer`，不仅仅是在创建根 reducer 的时候。在不同的地方有多个组合的 reducer 是非常常见的，他们组合到一起来创建根 reducer。

## 定义 State 结构
这里有两种方式来定义 Store state 的初始结构和内容。首先，`createStore` 函数可以将 `preloadedState` 作为第二个参数。这主要用于初始化那些在其他地方有持久化存储的 state，例如浏览器的 localStorage，另外一种方式是当 state 是 `undefined` 的时候返回 initial state。这两种方法在 [初始化 state 章节](./InitializingState.md) 中有着更加详细的描述，但是在使用 `combineReducers` 的时候需要注意其他的一些问题。

`combineReducers` 接收拆分之后的 reducer 函数组成的对象，并且创建出具有相同键对应状态对象的函数。这意味着如果没有给 `createStore` 提供预加载 state，输出 state 对象的 key 将由输入的拆分之后 reducer 组成对象的 key 决定。这些名称之间的相关性并不总是显而易见的，尤其是在使用 ES6 的时候（如默认模块搭配出和对象字面量的简写方向时）。

这儿有一些如何用 ES6 中对象字面量简写方式使用 `combineReducers` 的例子。

``` javascript
// reducers.js
export default theDefaultReducer = (state = 0, action) => state;

export const firstNamedReducer = (state = 1, action) => state;

export const secondNamedReducer = (state = 2, action) => state;


// rootReducer.js
import {combineReducers, createStore} from "redux";

import theDefaultReducer, {firstNamedReducer, secondNamedReducer} from "./reducers";


// 使用 ES6 的对象字面量简写方式定义对象结构
const rootReducer = combineReducers({
    theDefaultReducer,
    firstNamedReducer,
    secondNamedReducer
});

const store = createStore(rootReducer);
console.log(store.getState());
// {theDefaultReducer : 0, firstNamedReducer : 1, secondNamedReducer : 2}
```
因为我们使用了 ES6 中的对象字面量简写方式，在最后的 state 中 key 的名字和 import 进来的变量的名字一样，这可能并不是经常期望的，经常会对不熟悉 ES6 的人造成困惑。

同样的，结果的名字也有点奇怪，在 state 中 key 的名字包含 “reducer” 这样的词通常不是一个好习惯，key 应该反映他们特有域或者数据类型。这意味着我们应该明确拆分之后 reducer 对象中 key 的名称，定义输出 state 对象中的 key，或者在使用对象字面量简写方式的时候，仔细的重命名的拆分之后的 reducer 以设置 key。

一个比较好用的使用示例如下：

``` javascript
import {combineReducers, createStore} from "redux";

// 将 default import 进来的名称重命名为任何我们想要的名称。我们也可以重命名 import 进来的名称。
import defaultState, {firstNamedReducer, secondNamedReducer as secondState} from "./reducers";

const rootReducer = combineReducers({
    defaultState,                   // key 的名称和 default export 的名称一样
    firstState : firstNamedReducer, // key 的名字是单独取的，而不是变量的名字
    secondState,                    // key 的名称和已经被重命名过的 export 的名称一样
});

const reducerInitializedStore = createStore(rootReducer);
console.log(reducerInitializedStore.getState());
// {defaultState : 0, firstState : 1, secondState : 2}
```

这种 state 的结构恰好能反应所涉及的数据，因为我们特别的设置了我们传递给 `combineReducers` 的 key。
