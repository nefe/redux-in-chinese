# 示例

Redux [源码](https://github.com/reactjs/redux/tree/master/examples) 中同时包含了一些示例。

## 原生版 Counter

运行 [Counter Vanilla](https://github.com/reactjs/redux/tree/master/examples/counter-vanilla) 示例:

```
git clone https://github.com/reactjs/redux.git

cd redux/examples/counter-vanilla
open index.html
```

该示例不需搭建系统或视图框架，展示了基于 ES5 的原生 Redux API。

## Counter

运行 [Counter](https://github.com/reactjs/redux/tree/master/examples/counter) 示例：

```
git clone https://github.com/reactjs/redux.git

cd redux/examples/counter
npm install
npm start

open http://localhost:3000/
```

Redux 结合 React 使用的最基本示例。出于简化，当 store 发生变化，React 组件会手动重新渲染。在实际的项目中，可以使用 React 和 Redux 已绑定、且更高效的 [React Redux](https://github.com/reactjs/react-redux)。

该示例包含测试代码。

## Todos

运行 [Todos](https://github.com/reactjs/redux/tree/master/examples/todos) 示例：

```
git clone https://github.com/reactjs/redux.git

cd redux/examples/todos
npm install
npm start

open http://localhost:3000/
```

深入理解在 Redux 中 state 的更新与组件是如何共同运作的例子。展示了 reducer 如何委派 action 给其它 reducer，也展示了如何使用 [React Redux](https://github.com/reactjs/react-redux) 从展示组件中生成容器组件。

该示例包含测试代码。

## 支持撤销的 Todos

运行 [Todos-with-undo](https://github.com/reactjs/redux/tree/master/examples/todos-with-undo) 示例:

```
git clone https://github.com/reactjs/redux.git

cd redux/examples/todos-with-undo
npm install
npm start

open http://localhost:3000/
```

前一个示例的衍生。基本相同但额外展示了如何使用 [Redux Undo](https://github.com/omnidan/redux-undo) 打包 reducer，仅增加几行代码实现撤销/重做功能。

## TodoMVC

运行 [TodoMVC](https://github.com/reactjs/redux/tree/master/examples/todomvc) 示例:

```
git clone https://github.com/reactjs/redux.git

cd redux/examples/todomvc
npm install
npm start

open http://localhost:3000/
```

经典的 [TodoMVC](http://todomvc.com/) 示例。与 Todos 示例的目的相同，为了两者间比较罗列在此。

该示例包含测试代码。

## 购物车

运行 [Shopping Cart](https://github.com/reactjs/redux/tree/master/examples/shopping-cart) 示例：

```
git clone https://github.com/reactjs/redux.git

cd redux/examples/shopping-cart
npm install
npm start

open http://localhost:3000/
```

该示例展示了随着应用升级变得愈发重要的常用的 Redux 模式。尤其展示了，如何使用 ID 来标准化存储数据实体，如何在不同层级将多个 reducer 组合使用，如何利用 reducer 定义选择器以封装 state 的相关内容。该示例也展示了使用 [Redux Logger](https://github.com/fcomb/redux-logger) 生成日志，以及使用 [Redux Thunk](https://github.com/gaearon/redux-thunk) 中间件进行 action 的条件性分发。

## 树状视图

运行 [Tree View](https://github.com/reactjs/redux/tree/master/examples/tree-view) 示例:

```
git clone https://github.com/reactjs/redux.git

cd redux/examples/tree-view
npm install
npm start

open http://localhost:3000/
```

该示例展示了深层嵌套树状视图的渲染，以及为了方便 reducer 更新，state 的标准化写法。优良的渲染表现，来自于容器组件细粒度的、仅针对需要渲染的 tree node 的绑定。

该示例包含测试代码。

## 异步

运行 [Async](https://github.com/reactjs/redux/tree/master/examples/async) 示例：

```
git clone https://github.com/reactjs/redux.git

cd redux/examples/async
npm install
npm start

open http://localhost:3000/
```

该示例包含了：从异步 API 的读取操作、基于用户的输入来获取数据、显示正在加载的提示、缓存响应、以及使缓存过期失效。使用 [Redux Thunk](https://github.com/gaearon/redux-thunk) 中间件来封装异步带来的附带作用。

## 同构

运行 [Universal](https://github.com/reactjs/redux/tree/master/examples/universal) 示例:

```
git clone https://github.com/reactjs/redux.git

cd redux/examples/universal
npm install
npm start

open http://localhost:3000/
```

展示了基于 Redux 和 React 的 [server rendering](../recipes/ServerRendering.md)。怎样在服务器端准备 store 中的初始 state 并传递到客户端，使客户端中的 store 可以从现有的 state 启动。

## 真实场景

运行 [Real World](https://github.com/reactjs/redux/tree/master/examples/real-world) 示例：

```
git clone https://github.com/reactjs/redux.git

cd redux/examples/real-world
npm install
npm start

open http://localhost:3000/
```

最为高阶的示例。浓缩化的设计。包含了持续性地从标准化缓存中批量获取数据实例，针对 API 调用的自定义中间件的实现，逐步渲染已加载的数据、分页器、缓存响应，展示错误信息，以及路由。同时，包含了 Redux DevTools 的使用。

## 更多示例

前往 [Awesome Redux](https://github.com/xgrommx/awesome-redux) 获取更多 Redux 示例。
