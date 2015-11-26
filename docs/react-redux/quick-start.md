## 快速开始

本库深受 [分离容器组件和展示组件](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) 思想启发。

在应用中，只有最顶层组件是对 Redux 可知（例如路由处理）这是很好的。所有它们的子组件都应该是“笨拙”的，并且是通过 props 获取数据。


<table>
    <thead>
        <tr>
            <th></th>
            <th scope="col" style="text-align:left">容器组件</th>
            <th scope="col" style="text-align:left">展示组件</th>
        </tr>
    </thead>
    <tbody>
        <tr>
          <th scope="row" style="text-align:right">位置</th>
          <td>最顶层，路由处理</td>
          <td>中间和子组件</td>
        </tr>
        <tr>
          <th scope="row" style="text-align:right">使用 Redux</th>
          <td>是</th>
          <td>否</th>
        </tr>
        <tr>
          <th scope="row" style="text-align:right">读取数据</th>
          <td>从 Redux 获取 state</td>
          <td>从 props 获取数据</td>
        </tr>
        <tr>
          <th scope="row" style="text-align:right">修改数据</th>
          <td>向 Redux 发起 actions</td>
          <td>从 props 调用回调函数</td>
        </tr>
    </tbody>
</table>

### 不使用 Redux 的展示组件

让我们看下，我们拥有一个 `<Counter />` 的展示组件，它有一个通过 props 传过来的值，和一个函数 `onIncrement`，当你点击 “Increment” 按钮时就会调用这个函数：

```js
import { Component } from 'react';

export default class Counter extends Component {
  render() {
    return (
      <button onClick={this.props.onIncrement}>
        {this.props.value}
      </button>
    );
  }
}
```

### 容器组件使用 `connect()` 方法连接 Redux

以下为你说明如何连接到 Redux Store。

我们用 `react-redux` 提供的 `connect()` 方法将“笨拙”的 `Counter` 转化成容器组件。`connect()` 允许你从 Redux store 中指定**准确**的 state 到你想要获取的组件中。这让你能获取到任何级别颗粒度的数据。

##### `containers/CounterContainer.js`

```js
import { Component } from 'react';
import { connect } from 'react-redux';

import Counter from '../components/Counter';
import { increment } from '../actionsCreators';

// 哪些 Redux 全局的 state 是我们组件想要通过 props 获取的？
function mapStateToProps(state) {
  return {
    value: state.counter
  };
}

// 哪些 action 创建函数是我们想要通过 props 获取的？
function mapDispatchToProps(dispatch) {
  return {
    onIncrement: () => dispatch(increment())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter);

// 你可以传递一个对象，而不是定义一个 `mapDispatchToProps`：
// export default connect(mapStateToProps, CounterActionCreators)(Counter);

// 或者如果你想省略 `mapDispatchToProps`，你可以通过传递一个 `dispatch` 作为一个 props：
// export default connect(mapStateToProps)(Counter);

// 想看到更多的方法，详细的 connect() 示例如下。
```

作为一个展示组件，无论是在同一个文件中调用 `connect()`方法，还是分开调用，都取决于你。
你应该多考虑的是，是否重用这个组件来绑定不同数据。

### 嵌套

在你的应用任何层次中，你可以拥有很多使用 `connect()` 的组件，甚至你可以把它们嵌套使用。的确如此，但是更好的做法是只在最顶层的组件中使用 `connect()`，例如路由处理，这使得应用中的数据流是保持可预知的。

### 修饰器的支持

你可能会注意到，我们在调用 `connect()` 方法的时候使用了两个括号。这个叫作局部调用，并且这允许开发者使用 ES7 提供的修饰语法：

```js
// 这是还不稳定的语法！这可能在实际的应用中被修改或摒弃。
@connect(mapStateToProps)
export default class CounterContainer { ... }
```

不要忘了修饰器还在实验中！在以下的示范中，它们被提取出来，作为一个可以在任何地方调用的函数例子。

### 额外的灵活性

这是最基础的用法，但 `connect()` 也支持很多其他的模式：通过传递一个普通的 `dispatch()` 方法，绑定多个 action 创建函数，把它们传递到一个 `action` prop 中，选择一部分 state 和绑定的 action 创建函数依赖到 `props`中，等等。了解更多请看下面的 `connect()` 文档。

### 注入 Redux Store

最后，我们实际上是怎么连接到 Redux store 的呢？我们需要在根组件中创建这个 store。对于客户端应用而言，根组件是一个很好的地方。对于服务端渲染而言，你可以在处理请求中完成这个。

关键是从 React Redux 将整个视图结构包装进 `<Provider>`。

```js
import ReactDOM from 'react-dom';
import { Component } from 'react';
import { Provider } from 'react-redux';

class App extends Component {
  render() {
    // ...
  }
}

const targetEl = document.getElementById('root');

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  targetEl
);
```
