# 示例

Redux [源码](https://github.com/gaearon/redux/tree/master/examples)里包含一些示例一起发行。 
**运行示例的方法是，先 clone 仓库，然后分别在根目录和示例目录下执行 `npm install`。**

>##### 复制代码时注意
>如果你把 Redux 示例代码到其它目录，删除 `webpack.config.js` 里的这几行代码：
>
>```js
>alias: {
>   'redux': path.join(__dirname, '..', '..', 'src')
>},
>```
>and
>```js
>{
>   test: /\.js$/,
>   loaders: ['babel'],
>   include: path.join(__dirname, '..', '..', 'src')
>},
```
>
> 否则运行时会试图从相对的 `src` 目录定位 Redux，构建会失败。

## Counter 计数器示例

运行 [Counter](https://github.com/gaearon/redux/tree/master/examples/counter) 示例：

```
git clone https://github.com/gaearon/redux.git

cd redux
npm install

cd examples/counter
npm install

npm start
open http://localhost:3000/
```

这个示例包含：

* 基础的 Redux 开发流程；
* 测试代码。

## TodoMVC 示例

运行 [TodoMVC](https://github.com/gaearon/redux/tree/master/examples/todomvc) 示例：

```
git clone https://github.com/gaearon/redux.git

cd redux
npm install

cd examples/todomvc
npm install

npm start
open http://localhost:3000/
```

这个示例包含：

* 在 Redux 使用两个 reducer 的方法；
* 嵌套数据更新；
* 测试样例。

## 异步

运行 [Async](https://github.com/gaearon/redux/tree/master/examples/async) 示例：

```
git clone https://github.com/gaearon/redux.git

cd redux
npm install

cd examples/async
npm install

npm start
open http://localhost:3000/
```

这个示例包含：

* 
* 使用 [redux-thunk](https://github.com/gaearon/redux-thunk) 处理简单的异步开发流程；
* 缓存服务器响应数据和在获取数据过程中显示加载进度条；
* 缓存数据过期方法。

## Real World 示例

运行 [Real World](https://github.com/gaearon/redux/tree/master/examples/real-world) 示例：

```
git clone https://github.com/gaearon/redux.git

cd redux
npm install

cd examples/real-world
npm install

npm start
open http://localhost:3000/
```

这个示例包含：

* 实际应用中如何做异步处理；
* 使用 [normalized](https://github.com/gaearon/normalizr) 结果集来保存并缓存数据；
* 自定义 middleware 来做 API 请求；
* 缓存服务器响应数据和在获取数据过程中显示加载进度条；
* 分页；
* 路由。

## 更多

参考 [Awesome Redux](https://github.com/xgrommx/awesome-redux) 获取更多示例。
