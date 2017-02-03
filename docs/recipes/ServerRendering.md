# 服务端渲染

服务端渲染一个很常见的场景是当用户（或搜索引擎爬虫）第一次请求页面时，用它来做_初始渲染_。当服务器接收到请求后，它把需要的组件渲染成 HTML 字符串，然后把它返回给客户端（这里统指浏览器）。之后，客户端会接手渲染控制权。

下面我们使用 React 来做示例，对于支持服务端渲染的其它 view 框架，做法也是类似的。

### 服务端使用 Redux

当在服务器使用 Redux 渲染时，一定要在响应中包含应用的 state，这样客户端可以把它作为初始 state。这点至关重要，因为如果在生成 HTML 前预加载了数据，我们希望客户端也能访问这些数据。否则，客户端生成的 HTML 与服务器端返回的 HTML 就会不匹配，客户端还需要重新加载数据。

把数据发送到客户端，需要以下步骤：

* 为每次请求创建全新的 Redux store 实例；
* 按需 dispatch 一些 action；
* 从 store 中取出 state；
* 把 state 一同返回给客户端。

在客户端，使用服务器返回的 state 创建并初始化一个全新的 Redux store。  
Redux 在服务端**惟一**要做的事情就是，提供应用所需的**初始 state**。

## 安装

下面来介绍如何配置服务端渲染。使用极简的 [Counter 计数器应用](https://github.com/rackt/redux/tree/master/examples/counter) 来做示例，介绍如何根据请求在服务端提前渲染 state。

### 安装依赖库

本例会使用 [Express](http://expressjs.com/) 来做小型的 web 服务器。还需要安装 Redux 对 React 的绑定库，Redux 默认并不包含。

```
npm install --save express react-redux
```

## 服务端开发

下面是服务端代码大概的样子。使用 [app.use](http://expressjs.com/api.html#app.use) 挂载 [Express middleware](http://expressjs.com/guide/using-middleware.html) 处理所有请求。如果你还不熟悉 Express 或者 middleware，只需要了解每次服务器收到请求时都会调用 handleRender 函数。

另外，如果有使用 ES6 和 JSX 语法，需要使用 [Babel](https://babeljs.io/) (对应示例[this example of a Node Server with Babel](https://github.com/babel/example-node-server)) 和 [React preset](https://babeljs.io/docs/plugins/preset-react/)。

##### `server.js`

```js
import path from 'path';
import Express from 'express';
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import counterApp from './reducers';
import App from './containers/App';

const app = Express();
const port = 3000;

// 每当收到请求时都会触发
app.use(handleRender);

// 接下来会补充这部分代码
function handleRender(req, res) { /* ... */ }
function renderFullPage(html, preloadedState) { /* ... */ }

app.listen(port);
```

### 处理请求

第一件要做的事情就是对每个请求创建一个新的 Redux store 实例。这个 store 惟一作用是提供应用初始的 state。

渲染时，使用 `<Provider>` 来包住根组件 `<App />`，以此来让组件树中所有组件都能访问到 store，就像之前的[搭配 React](../basics/UsageWithReact.md) 教程讲的那样。

服务端渲染最关键的一步是在**发送响应前**渲染初始的 HTML。这就要使用 [React.renderToString()](https://facebook.github.io/react/docs/top-level-api.html#react.rendertostring).

然后使用 [`store.getState()`](../api/Store.md#getState) 从 store 得到初始 state。`renderFullPage` 函数会介绍接下来如何传递。

```js
import { renderToString } from 'react-dom/server'

function handleRender(req, res) {
  // 创建新的 Redux store 实例
  const store = createStore(counterApp);

  // 把组件渲染成字符串
  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  )

  // 从 store 中获得初始 state
  const preloadedState = store.getState();

  // 把渲染后的页面内容发送给客户端
  res.send(renderFullPage(html, preloadedState));
}
```

### 注入初始组件的 HTML 和 State

服务端最后一步就是把初始组件的 HTML 和初始 state 注入到客户端能够渲染的模板中。如何传递 state 呢，我们添加一个 `<script>` 标签来把 `preloadedState` 赋给 `window.__INITIAL_STATE__`。

客户端可以通过 `window.__INITIAL_STATE__` 获取 `preloadedState`。

同时使用 script 标签来引入打包后的 js bundle 文件。这是打包工具输出的客户端入口文件，以静态文件或者 URL 的方式实现服务端开发中的热加载。下面是代码。

```js
function renderFullPage(html, preloadedState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(preloadedState)}
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `
}
```

## 客户端开发

客户端代码非常直观。只需要从 `window.__INITIAL_STATE__` 得到初始 state，并传给 [`createStore()`](../api/createStore.md) 函数即可。

代码如下:

#### `client.js`

```js
import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './containers/App'
import counterApp from './reducers'

// 通过服务端注入的全局变量得到初始 state
const preloadedState = window.__INITIAL_STATE__

// 使用初始 state 创建 Redux store
const store = createStore(counterApp, preloadedState)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

你可以选择自己喜欢的打包工具（Webpack, Browserify 或其它）来编译并打包文件到 `dist/bundle.js`。

当页面加载时，打包后的 js 会启动，并调用 [`React.render()`](https://facebook.github.io/react/docs/top-level-api.html#react.render)，然后会与服务端渲染的 HTML 的 `data-react-id` 属性做关联。这会把新生成的 React 实例与服务端的虚拟 DOM 连接起来。因为同样使用了来自 Redux store 的初始 state，并且 view 组件代码是一样的，结果就是我们得到了相同的 DOM。

就是这样！这就是实现服务端渲染的所有步骤。

但这样做还是比较原始的。只会用动态代码渲染一个静态的 View。下一步要做的是动态创建初始 state 支持动态渲染 view。

## 准备初始 State

因为客户端只是执行收到的代码，刚开始的初始 state 可能是空的，然后根据需要获取 state。在服务端，渲染是同步执行的而且我们只有一次渲染 view 的机会。在收到请求时，可能需要根据请求参数或者外部 state（如访问 API 或者数据库），计算后得到初始 state。

### 处理 Request 参数

服务端收到的惟一输入是来自浏览器的请求。在服务器启动时可能需要做一些配置（如运行在开发环境还是生产环境），但这些配置是静态的。

请求会包含 URL 请求相关信息，包括请求参数，它们对于做 [React Router](https://github.com/rackt/react-router) 路由时可能会有用。也可能在请求头里包含 cookies，鉴权信息或者 POST 内容数据。下面演示如何基于请求参数来得到初始 state。

#### `server.js`

```js
import qs from 'qs'; // 添加到文件开头
import { renderToString } from 'react-dom/server'

function handleRender(req, res) {
  // 如果存在的话，从 request 读取 counter
  const params = qs.parse(req.query)
  const counter = parseInt(params.counter) || 0

  // 得到初始 state
  let preloadedState = { counter }

  // 创建新的 Redux store 实例
  const store = createStore(counterApp, preloadedState)

  // 把组件渲染成字符串
  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  )

  // 从 Redux store 得到初始 state
  const finalState = store.getState()

  // 把渲染后的页面发给客户端
  res.send(renderFullPage(html, finalState))
}
```

上面的代码首先访问 Express 的 `Request` 对象。把参数转成数字，然后设置到初始 state 中。如果你在浏览器中访问 [http://localhost:3000/?counter=100](http://localhost:3000/?counter=100)，你会看到计数器从 100 开始。在渲染后的 HTML 中，你会看到计数显示 100 同时设置进了 `__INITIAL_STATE__` 变量。

### 获取异步 State

服务端渲染常用的场景是处理异步 state。因为服务端渲染天生是同步的，因此异步的数据获取操作对应到同步操作非常重要。

最简单的做法是往同步代码里传递一些回调函数。在这个回调函数里引用响应对象，把渲染后的 HTML 发给客户端。不要担心，并没有想像中那么难。

本例中，我们假设有一个外部数据源提供计算器的初始值（所谓的把计算作为一种服务）。我们会模拟一个请求并使用结果创建初始 state。API 请求代码如下：

#### `api/counter.js`

```js
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

export function fetchCounter(callback) {
  setTimeout(() => {
    callback(getRandomInt(1, 100))
  }, 500)
}
```

再次说明一下，这只是一个模拟的 API，我们使用 `setTimeout` 模拟一个需要 500 毫秒的请求（实际项目中 API 请求一般会更快）。传入一个回调函数，它异步返回一个随机数字。如果你使用了基于 Promise 的 API 工具，那么要把回调函数放到 `then` 中。

在服务端，把代码使用 `fetchCounter` 包起来，在回调函数里拿到结果：

#### `server.js`

```js
// 添加到 import
import { fetchCounter } from './api/counter'
import { renderToString } from 'react-dom/server'

function handleRender(req, res) {
  // 异步请求模拟的 API
  fetchCounter(apiResult => {
    // 如果存在的话，从 request 读取 counter
    const params = qs.parse(req.query)
    const counter = parseInt(params.counter) || apiResult || 0

    // 得到初始 state
    let preloadedState = { counter }

    // 创建新的 Redux store 实例
    const store = createStore(counterApp, preloadedState)

    // 把组件渲染成字符串
    const html = renderToString(
      <Provider store={store}>
        <App />
      </Provider>
    )

    // 从 Redux store 得到初始 state
    const finalState = store.getState()

    // 把渲染后的页面发给客户端
    res.send(renderFullPage(html, finalState))
  });
}
```

因为在回调中使用了 `res.send()`，服务器会保护连接打开并在回调函数执行前不发送任何数据。你会发现每个请求都有 500ms 的延时。更高级的用法会包括对 API 请求出错进行处理，比如错误的请求或者超时。

### 安全注意事项

因为我们代码中很多是基于用户生成内容（UGC）和输入的，不知不觉中，提高了应用可能受攻击区域。任何应用都应该对用户输入做安全处理以避免跨站脚本攻击（XSS）或者代码注入。

我们的示例中，只对安全做基本处理。当从请求中拿参数时，对 `counter` 参数使用 `parseInt` 把它转成数字。如果不这样做，当 request 中有 script 标签时，很容易在渲染的 HTML 中生成危险代码。就像这样的：`?counter=</script><script>doSomethingBad();</script>`

在我们极简的示例中，把输入转成数字已经比较安全。如果处理更复杂的输入，比如自定义格式的文本，你应该用安全函数处理输入，比如 [validator.js](https://www.npmjs.com/package/validator)。

此外，可能添加额外的安全层来对产生的 state 进行消毒。`JSON.stringify` 可能会造成 script 注入。鉴于此，你需要清洗 JSON 字符串中的 HTML 标签和其它危险的字符。可能通过字符串替换或者使用复杂的库如 [serialize-javascript](https://github.com/yahoo/serialize-javascript) 处理。

## 下一步

你还可以参考 [异步 Actions](../advanced/AsyncActions.md) 学习更多使用 Promise 和 thunk 这些异步元素来表示异步数据流的方法。记住，那里学到的任何内容都可以用于同构渲染。

如果你使用了 [React Router](https://github.com/rackt/react-router)，你可能还需要在路由处理组件中使用静态的 `fetchData()` 方法来获取依赖的数据。它可能返回 [异步 action](../advanced/AsyncActions.md)，以便你的 `handleRender` 函数可以匹配到对应的组件类，对它们均 dispatch `fetchData()` 的结果，在 Promise 解决后才渲染。这样不同路由需要调用的 API 请求都并置于路由处理组件了。在客户端，你也可以使用同样技术来避免在切换页面时，当数据还没有加载完成前执行路由。

