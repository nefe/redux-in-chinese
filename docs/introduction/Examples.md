# 示例

Redux [源码](https://github.com/gaearon/redux/tree/master/examples) 中同时包含了一些示例。

>##### 复制代码时注意
>如果你把 Redux 示例代码复制到其它目录，可以删除位于 `webpack.config.js` 文件尾部 “You can safely delete these lines in your project.” 注释后的代码。

## Counter

运行 [Counter](https://github.com/gaearon/redux/tree/master/examples/counter) 示例：

```
git clone https://github.com/rackt/redux.git

cd redux/examples/counter
npm install
npm start

open http://localhost:3000/
```

这个示例包含：

* 基本的 Redux 应用开发流程
* 测试代码

## TodoMVC

运行 [TodoMVC](https://github.com/gaearon/redux/tree/master/examples/todomvc) 示例：

```
git clone https://github.com/rackt/redux.git

cd redux/examples/todomvc
npm install
npm start

open http://localhost:3000/
```

这个示例包含：

* Redux 中使用两个 reducer 的方法
* 嵌套数据更新
* 测试代码

## Todos with Undo

运行 [todos-with-undo](https://github.com/rackt/redux/tree/master/examples/todos-with-undo) 示例:

```
git clone https://github.com/rackt/redux.git

cd redux/examples/todos-with-undo
npm install
npm start

open http://localhost:3000/
```

这个示例包含:

* Redux 中使用两个 reducer 的方法
* 使用 [redux-undo](https://github.com/omnidan/redux-undo) 在 Redux 中实现撤销/重做功能

## 异步

运行 [Async](https://github.com/gaearon/redux/tree/master/examples/async) 示例：

```
git clone https://github.com/rackt/redux.git

cd redux/examples/async
npm install
npm start

open http://localhost:3000/
```

这个示例包含：

* 使用 [redux-thunk](https://github.com/gaearon/redux-thunk) 处理简单的异步开发流程
* 缓存服务器响应数据，并在获取数据过程中显示加载进度条
* 缓存数据过期方法

## Universal

运行 [Universal](https://github.com/rackt/redux/tree/master/examples/universal) 示例:

```
git clone https://github.com/rackt/redux.git

cd redux/examples/universal
npm install
npm start

open http://localhost:3000/
```

这个示例包含：

* 使用 Redux 和 React 的 [Universal rendering](../recipes/ServerRendering.md) 库
* 根据输入通过异步 fetch 来预载 state
* 从服务器端向客户端传递 state

## Real World

运行 [Real World](https://github.com/gaearon/redux/tree/master/examples/real-world) 示例：

```
git clone https://github.com/rackt/redux.git

cd redux/examples/real-world
npm install
npm start

open http://localhost:3000/
```

这个示例包含：

* 实际应用中的 Redux 的异步处理
* 使用 [normalized](https://github.com/gaearon/normalizr) 结果集来缓存数据
* 用于 API 请求的自定义中间件
* 缓存服务器响应数据，并在获取数据过程中显示加载进度条
* 分页器
* 路由

## Shopping Cart

运行 [Shopping Cart](https://github.com/rackt/redux/tree/master/examples/shopping-cart) 示例：

```
git clone https://github.com/rackt/redux.git

cd redux/examples/shopping-cart
npm install
npm start

open http://localhost:3000/
```

这个示例包含：

* 范式化的 state
* 利用 ID 来跟踪数据中实体
* Reducer 合成
* 与 Reducer 一同定义查询方法
* 演示如何处理回滚失败
* 基于条件的 action 发布
* 只使用 [React Redux](https://github.com/rackt/react-redux) 来绑定 action 创建函数
* 条件型中间件 (日志示例)

## 更多

参考 [Awesome Redux](https://github.com/xgrommx/awesome-redux) 获取更多示例。
