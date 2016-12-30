# 搭配 React Router

现在你想在你的 Redux 应用中使用路由功能，可以搭配使用 [React Router](https://github.com/reactjs/react-router) 来实现。
Redux 和 React Router 将分别成为你数据和 URL 的事实来源（the source of truth）。
在大多数情况下， **最好** 将他们分开，除非你需要时光旅行和回放 action 来触发 URL 改变。

## 安装 React Router
可以使用 npm 来安装 `React Router`。本教程基于 `react-router@^2.7.0` 。

`npm install --save react-router`

## 配置后备(fallback) URL
在集成 React Router 之前，我们需要配置一下我们的开发服务器。
显然，我们的开发服务器无法感知配置在 React Router 中的 route。
比如：你想访问并刷新 `/todos`，由于是一个单页面应用，你的开发服务器需要生成并返回 `index.html`。
这里，我们将演示如何在流行的开发服务器上启用这项功能。

>### 使用 Create React App 须知
> 如果你是使用 Create React App （你可以点击[这里](https://facebook.github.io/react/blog/2016/07/22/create-apps-with-no-configuration.html)了解更多，译者注）工具来生成项目，会自动为你配置好后备(fallback) URL。

### 配置 Express
如果你使用的是 Express 来返回你的 `index.html` 页面，可以增加以下代码到你的项目中：

```js
app.get('/*', (req,res) => {
  res.sendfile(path.join(__dirname, 'index.html'))
})
```

### 配置 WebpackDevServer
如果你正在使用 WebpackDevServer 来返回你的 `index.html` 页面，
你可以增加如下配置到 webpack.config.dev.js：

```js
devServer: {
  historyApiFallback: true,
}
```

## 连接 React Router 和 Redux 应用
在这一章，我们将使用 [Todos](https://github.com/reactjs/redux/tree/master/examples/todos) 作为例子。我们建议你在阅读本章的时候，先将仓库克隆下来。

首先，我们需要从 React Router 中导入 `<Router />` 和 `<Route />`。代码如下：

```js
import { Router, Route, browserHistory } from 'react-router';
```

在 React 应用中，通常你会用 `<Router />` 包裹 `<Route />`。
如此，当 URL 变化的时候，`<Router />` 将会匹配到指定的路由，然后渲染路由绑定的组件。
`<Route />` 用来显式地把路由映射到应用的组件结构上。
用 `path` 指定 URL，用 `component` 指定路由命中 URL 后需要渲染的那个组件。

```js
const Root = () => (
  <Router>
    <Route path="/" component={App} />
  </Router>  
);
```

另外，在我们的 Redux 应用中，我们仍将使用  `<Provider />`。
`<Provider />` 是由 React Redux 提供的高阶组件，用来让你将 Redux 绑定到 React （详见 [搭配 React](../basics/UsageWithReact.md)）。

然后，我们从 React Redux 导入 `<Provider />`：

```js
import { Provider } from 'react-redux';
```

我们将用 `<Provider />` 包裹 `<Router />`，以便于路由处理器可以[访问 `store`](../basics/UsageWithReact.html#passing-the-store)（暂时未找到相关中文翻译，译者注）。

```js
const Root = ({ store }) => (
  <Provider store={store}>
    <Router>
      <Route path="/" component={App} />
    </Router>
  </Provider>
);
```

现在，如果 URL 匹配到 '/'，将会渲染 `<App />` 组件。此外，我们将在 '/' 后面增加参数 `(:filter)`,
当我们尝试从 URL 中读取参数 `(:filter)`，需要以下代码：

```js
<Route path="/(:filter)" component={App} />
```

也许你想将 '#' 从 URL 中移除（例如：`http://localhost:3000/#/?_k=4sbb0i`）。
你需要从 React Router 导入 `browserHistory` 来实现：

```js
import { Router, Route, browserHistory } from 'react-router';
```

然后将它传给 `<Router />` 来移除 URL 中的 '#'：

```js
<Router history={browserHistory}>
  <Route path="/(:filter)" component={App} />
</Router>
```

只要你不需要兼容古老的浏览器，比如IE9，你都可以使用 `browserHistory`。

#### `components/Root.js`

```js
import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import App from './App';

const Root = ({ store }) => (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/(:filter)" component={App} />
    </Router>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
```

## 通过 React Router 导航

React Router 提供了 [`<Link />`](https://github.com/reactjs/react-router/blob/master/docs/API.md#link) 来实现导航功能。
下面将举例演示。现在，修改我们的容器组件 `<FilterLink />` ，这样我们就可以使用 `<FilterLink />` 来改变 URL。你可以通过 `activeStyle` 属性来指定激活状态的样式。

### `containers/FilterLink.js`

```js
import React from 'react';
import { Link } from 'react-router';

const FilterLink = ({ filter, children }) => (
  <Link
    to={filter === 'all' ? '' : filter}
    activeStyle={{
      textDecoration: 'none',
      color: 'black'
    }}
  >
    {children}
  </Link>
);

export default FilterLink;
```

### `components/Footer.js`

```js
import React from 'react'
import FilterLink from '../containers/FilterLink'

const Footer = () => (
  <p>
    Show:
    {" "}
    <FilterLink filter="all">
      All
    </FilterLink>
    {", "}
    <FilterLink filter="active">
      Active
    </FilterLink>
    {", "}
    <FilterLink filter="completed">
      Completed
    </FilterLink>
  </p>
);

export default Footer
```

这时，如果你点击 `<FilterLink />`，你将看到你的 URL 在 `'/complete'`，`'/active'`，`'/'` 间切换。
甚至还支持浏览的回退功能，可以从历史记录中找到之前的 URL 并回退。

## 从 URL 中读取数据
现在，即使 URL 改变，todo 列表也不会被过滤。
这是因为我们是在 `<VisibleTodoList />` 的 `mapStateToProps()` 函数中过滤的。
这个目前仍然是和 `state` 绑定，而不是和 URL 绑定。
`mapStateToProps` 的第二可选参数 `ownProps`，这个是一个传递给 `<VisibleTodoList />` 所有属性的对象。

### `containers/VisibleTodoList.js`

```js
const mapStateToProps = (state, ownProps) => {
  return {
    todos: getVisibleTodos(state.todos, ownProps.filter) // 以前是 getVisibleTodos(state.todos, state.visibilityFilter)
  };
};
```

目前我们还没有传递任何参数给 `<App />`，所以 `ownProps` 依然是一个空对象。
为了能够根据 URL 来过滤我们的 todo 列表，我们需要向 `<VisibleTodoList />` 传递URL参数。

之前我们写过：`<Route path="/(:filter)" component={App} />`，这使得可以在 `App` 中获取 `params` 的属性。

`params` 是一个包含 url 中所有指定参数的对象。
*例如：如果我们访问 `localhost:3000/completed`，那么 `params` 将等价于 `{ filter: 'completed' }`。
现在，我们可以在 `<App />` 中读取 URL 参数了。*

注意，我们将使用 [ES6 的解构赋值](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)来对 `params` 进行赋值，以此传递给 `<VisibleTodoList />`。

### `components/App.js`

```js
const App = ({ params }) => {
  return (
    <div>
      <AddTodo />
      <VisibleTodoList
        filter={params.filter || 'all'}
      />
      <Footer />
    </div>
  );
};
```

## 下一步

现在你已经知道如何实现基础的路由，接下来你可以阅读 [React Router API](https://github.com/reactjs/react-router/tree/master/docs) 来学习更多知识。

>##### 其它路由库注意点

>*Redux Router* 是一个实验性质的库，它使得你的 URL 的状态和 redux store 内部状态保持一致。它有和 React Router 一样的 API，但是它的社区支持比 react-router 小。

>*React Router Redux* 将你的 redux 应用和 react-router 绑定在一起，并且使它们保持同步。如果没有这层绑定，你将不能通过时光旅行来回放 action。除非你需要这个，不然 React-router 和 Redux 完全可以分开操作。
