# 服务端渲染

服务端渲染一个很常见的场景是当用户（或搜索引擎爬虫）第一次请求页面时，用它来做_初始渲染_。当服务器接收到请求后，它把需要的组件渲染成 HTML 字符串，然后把它返回给客户端（这里统指浏览器）。之后，客户端会接手控制所有渲染。

下面我们使用 React 来做示例，对于支持服务端渲染的其它 view 框架，做法也是类似的。

### 服务端使用 Redux

当在服务器使用 Redux 渲染时，一定要在响应中包含应用的 state，这样客户端可以把它作为初始 state。这样做至关重要，因为如果在生成 HTML 前预加载了数据，我们希望客户端也能访问这些数据。否则，客户端生成的 HTML 与服务器端返回的 HTML 就会不匹配，客户端还需要再加载一次数据。

把数据发送到客户端，需要以下步骤：

* 为每次请求创建全新的 Redux store 实例；
* 按需 dispatch 一些 action；
* 从 store 中取出 state；
* 把 state 一同返回给客户端。

在客户端，使用服务器返回的 state 创建并初始化一个全新的 Redux store。  
Redux 在服务端**惟一**要做的事情是提供应用所需的**初始 state**。

## 安装

下面来介绍如何配置服务端渲染。使用极简的 [Counter 计数器应用](https://github.com/rackt/redux/tree/master/examples/counter) 来做示例，介绍如何根据请求在服务端提前渲染 state。

### 安装依赖库

本例会使用 [Express](http://expressjs.com/) 来做小型的 web 服务器。引入 [serve-static](https://www.npmjs.com/package/serve-static) middleware 来处理静态文件，马上会看到。

还需要安装 Redux 对 React 的绑定库，因为它默认并不包含在 Redux 中。

```
npm install --save express serve-static react-redux
```

## 服务端开发

下面是服务端代码大概的样子。使用 [app.use](http://expressjs.com/api.html#app.use) 挂载 [Express middleware](http://expressjs.com/guide/using-middleware.html) 处理所有请求。`serve-static` middleware 也以同样的方式处理来自客户端的 javascript 文件请求。如果你还不熟悉 Express 或者 middleware，只需要了解每次服务器收到请求时就会调用 handleRender 函数。


>##### 生产环境使用须知
>在生产环境中，最好使用类似 nigix 这样的服务器来处理静态文件请求，只使用 Node 处理应用请求。虽然这个话题已经超出本教程讨论范畴。

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

// 使用这个 middleware 处理 dist 目录下的静态文件请求
app.use(require('serve-static')(path.join(__dirname, 'dist')));

// 每当收到请求时都会触发
app.use(handleRender);

// 接下来会补充这部分代码
function handleRender(req, res) { /* ... */ }
function renderFullPage(html, initialState) { /* ... */ }

app.listen(port);
```

### 处理请求

第一件要做的事情就是对每个请求创建一个新的 Redux store 实例。这个 store 惟一作用是提供应用初始的 state。

渲染时，使用 `<Provider>` 来包住根组件 `<App />`，以此来让组件树中所有组件都能访问到 store，就像之前的[搭配 React](../basics/UsageWithReact.md) 教程。

服务端渲染最关键的一步是在**发送响应前**渲染初始的 HTML。这就要使用 [React.renderToString()](https://facebook.github.io/react/docs/top-level-api.html#react.rendertostring).

然后使用 [`store.getState()`](../api/Store.md#getState) 从 store 得到初始 state。`renderFullPage` 函数会介绍接下来如何传递。

```js
function handleRender(req, res) {
  // 创建新的 Redux store 实例
  const store = createStore(counterApp);

  // 把组件渲染成字符串
  const html = React.renderToString(
    <Provider store={store}>
      {() => <App />}
    </Provider>
  );

  // 从 store 中获得 state
  const initialState = store.getState();

  // 把渲染后的页面内容发送给客户端
  res.send(renderFullPage(html, initialState));
}
```

### 注入初始组件的 HTML 和 State

服务端最后一步就是把初始组件的 HTML 和初始 state 注入到客户端能够渲染的模板中。如何传递 state 呢，我们添加一个 `<script>` 标签来把 `initialState` 赋给 `window.__INITIAL_STATE__`。

客户端可以通过 `window.__INITIAL_STATE__` 获取 `initialState`。

同时使用 script 标签来引入打包后的 js bundle 文件。之前引入的 `serve-static` middleware 会处理它的请求。下面是代码。

```js
function renderFullPage(html, initialState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
      </head>
      <body>
        <div id="app">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
        </script>
        <script src="/bundle.js"></script>
      </body>
    </html>
    `;
}
```

>##### 字符串插值语法须知

>上面的示例使用了 ES6 的[模板字符串](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/template_strings) 语法。它支持多行字符串和字符串插补特性，但需要支持 ES6。如果要在 Node 端使用 ES6，参考 [Babel require hook](https://babeljs.io/docs/usage/require/) 文档。或者继续使用 ES5。

## 客户端开发

客户端代码非常直接。只需要从 `window.__INITIAL_STATE__` 得到初始 state，并传给 [`createStore()`](../api/createStore.md) 函数即可。

代码如下:

#### `client.js`

```js
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './containers/App';
import counterApp from './reducers';

// 通过服务端注入的全局变量得到初始 state
const initialState = window.__INITIAL_STATE__;

// 使用初始 state 创建 Redux store
const store = createStore(counterApp, initialState);

React.render(
  <Provider store={store}>
    {() => <App />}
  </Provider>,
  document.getElementById('root')
);
```

You can set up your build tool of choice (Webpack, Browserify, etc.) to compile a bundle file into `dist/bundle.js`.

When the page loads, the bundle file will be started up and [`React.render()`](https://facebook.github.io/react/docs/top-level-api.html#react.render) will hook into the `data-react-id` attributes from the server-rendered HTML. This will connect our newly-started React instance to the virtual DOM used on the server. Since we have the same initial state for our Redux store and used the same code for all our view components, the result will be the same real DOM.

And that’s it! That is all we need to do to implement server side rendering.

But the result is pretty vanilla. It essentially renders a static view from dynamic code. What we need to do next is build an initial state dynamically to allow that rendered view to be dynamic.

## Preparing the Initial State

Because the client side executes ongoing code, it can start with an empty initial state and obtain any necessary state on demand and over time. On the server side, rendering is synchronous and we only get one shot to render our view. We need to be able to compile our initial state during the request, which will have to react to input and obtain external state (such as that from an API or database).

### Processing Request Parameters

The only input for server side code is the request made when loading up a page in your app in your browser. You may choose to configure the server during its boot (such as when you are running in a development vs. production environment), but that configuration is static.

The request contains information about the URL requested, including any query parameters, which will be useful when using something like [React Router](https://github.com/rackt/react-router). It can also contain headers with inputs like cookies or authorization, or POST body data. Let’s see how we can set the initial counter state based on a query parameter.

#### `server.js`

```js
import qs from 'qs'; // Add this at the top of the file

function handleRender(req, res) {
  // Read the counter from the request, if provided
  const params = qs.parse(req.query);
  const counter = parseInt(params.counter) || 0;

  // Compile an initial state
  let initialState = { counter };

  // Create a new Redux store instance
  const store = createStore(counterApp, initialState);

  // Render the component to a string
  const html = React.renderToString(
    <Provider store={store}>
      {() => <App />}
    </Provider>
  );

  // Grab the initial state from our Redux store
  const finalState = store.getState();

  // Send the rendered page back to the client
  res.send(renderFullPage(html, finalState));
}
```

The code reads from the Express `Request` object passed into our server middleware. The parameter is parsed into a number and then set in the initial state. If you visit [http://localhost:3000/?counter=100](http://localhost:3000/?counter=100) in your browser, you’ll see the counter starts at 100. In the rendered HTML, you’ll see the counter output as 100 and the `__INITIAL_STATE__` variable has the counter set in it.

### Async State Fetching

The most common issue with server side rendering is dealing with state that comes in asynchronously. Rendering on the server is synchronous by nature, so it’s necessary to map any asynchronous fetches into a synchronous operation.

The easiest way to do this is to pass through some callback back to your synchronous code. In this case, that will be a function that will reference the response object and send back our rendered HTML to the client. Don’t worry, it’s not as hard as it may sound.

For our example, we’ll imagine there is an external datastore that contains the counter’s initial value (Counter As A Service, or CaaS). We’ll make a mock call over to them and build our initial state from the result. We’ll start by building out our API call:

#### `api/counter.js`

```js
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function fetchCounter(callback) {
  setTimeout(() => {
    callback(getRandomInt(1, 100));
  }, 500);
}
```

Again, this is just a mock API, so we use `setTimeout` to simulate a network request that takes 500 milliseconds to respond (this should be much faster with a real world API). We pass in a callback that returns a random number asynchronously. If you’re using a Promise-based API client, then you would issue this callback in your `then` handler.

On the server side, we simply wrap our existing code in the `fetchCounter` and receive the result in the callback:

#### `server.js`

```js
// Add this to our imports
import { fetchCounter } from './api/counter';

function handleRender(req, res) {
  // Query our mock API asynchronously
  fetchCounter(apiResult => {
    // Read the counter from the request, if provided
    const params = qs.parse(req.query);
    const counter = parseInt(params.counter) || apiResult || 0;

    // Compile an initial state
    let initialState = { counter };

    // Create a new Redux store instance
    const store = createStore(counterApp, initialState);

    // Render the component to a string
    const html = React.renderToString(
      <Provider store={store}>
        {() => <App />}
      </Provider>
    );

    // Grab the initial state from our Redux store
    const finalState = store.getState();

    // Send the rendered page back to the client
    res.send(renderFullPage(html, finalState));
  });
}
```

Because we `res.send()` inside of the callback, the server will hold open the connection and won’t send any data until that callback executes. You’ll notice a 500ms delay is now added to each server request as a result of our new API call. A more advanced usage would handle errors in the API gracefully, such as a bad response or timeout.

### Security Considerations

Because we have introduced more code that relies on user generated content (UGC) and input, we have increased our attack surface area for our application. It is important for any application that you ensure your input is properly sanitized to prevent things like cross-site scripting (XSS) attacks or code injections.

In our example, we take a rudimentary approach to security. When we obtain the parameters from the request, we use `parseInt` on the `counter` parameter to ensure this value is a number. If we did not do this, you could easily get dangerous data into the rendered HTML by providing a script tag in the request. That might look like this: `?counter=</script><script>doSomethingBad();</script>`

For our simplistic example, coercing our input into a number is sufficiently secure. If you’re handling more complex input, such as freeform text, then you should run that input through an appropriate sanitization function, such as [validator.js](https://www.npmjs.com/package/validator).

Furthermore, you can add additional layers of security by sanitizing your state output. `JSON.stringify` can be subject to script injections. To counter this, you can scrub the JSON string of HTML tags and other dangerous characters. This can be done with either a simple text replacement on the string or via more sophisticated libraries such as [serialize-javascript](https://github.com/yahoo/serialize-javascript).

## 下一步

You may want to read [Async Actions](../advanced/AsyncActions.md) to learn more about expressing asynchronous flow in Redux with async primitives such Promises and thunks. Keep in mind that anything you learn there can also be applied to universal rendering.

If you use something like [React Router](https://github.com/rackt/react-router), you might also want to express your data fetching dependencies as static `fetchData()` methods on your route handler components. They may return [async actions](../advanced/AsyncActions.md), so that your `handleRender` function can match the route to the route handler component classes, dispatch `fetchData()` result for each of them, and render only after the Promises have resolved. This way the specific API calls required for different routes are colocated with the route handler component definitions. You can also use the same technique on the client side to prevent the router from switching the page until its data has been loaded.