## 排错

首先确保你已经阅读 [Redux 排错](http://redux.js.org/docs/Troubleshooting.html)。

### 我的观点没有改变！

阅读上面的链接。
简而言之，

* Reducer 永远不会去改变 state，它们只会返回新的对象，或是在 React Redux 中看不到变化。
* 确保你使用了 `connect()` 的参数 `mapDispatchToProps` 或者 `bindActionCreators` 去绑定 action 创建函数，又或手动调用 `dispatch()` 进行绑定。当你在调用 `MyActionCreators.addTodo()` 时不起作用，仅仅是因为它**返回**的是一个 action，而不会去 *dispatch* 它。

### 在使用 React Router 0.13 版本进行 route 变化中，我的观点仍旧没有改变

如果你正在使用 React Router 0.13，你可能会[碰到这样的问题](https://github.com/rackt/react-redux/issues/43)。解决方法很简单：无论你在任何时候使用 `Router.run` 提供的 `<RouteHandler>` 或 `Handler`，通过 router state 去传递即可。

根视图：

```js
Router.run(routes, Router.HistoryLocation, (Handler, routerState) => { // 注意 "routerState" 在这
  ReactDOM.render(
    <Provider store={store}>
      {/* 注意 "routerState" 在这 */}
      <Handler routerState={routerState} />
    </Provider>,
    document.getElementById('root')
  );
});
```

嵌套视图：

```js
render() {
  // 保持这样传递下去
  return <RouteHandler routerState={this.props.routerState} />;
}
```

很方便地，这就让你的组件可以访问 router 的 state！
当然，你可以将 React Router 升级到 1.0，这样就不会有此问题了。（让我们知道你已经这么做了！）

### 当外部的 Redux 改变了一些东西，我的观点还是没有改变

如果你的视图依赖全局的 state 或是 [React “context”](http://facebook.github.io/react/docs/context.html)，你可能发现那些使用 `connect()` 进行修饰的视图将无法更新。

>假设你的组件会产生相同的结果给同一 props 和 state，这是因为 `connect()` 是通过默认的 [shouldComponentUpdate](https://facebook.github.io/react/docs/component-specs.html#updating-shouldcomponentupdate) 实现的。这与 React 的 [PureRenderMixin](https://facebook.github.io/react/docs/pure-render-mixin.html) 有相似的概念。

这个问题的最好解决方案是保证组件的干净，并且任何外部的 state 都应通过 props 传递给它们。这大大地提高了应用的速度，也确保了组件不会重新渲染，除非它的确是需要重新渲染。

当不知道什么原因它无法实现时（比如，你使用了一个非常依赖 React context 的库），你可以通过 `pure: false` 选项去 `connect()`：

```
function mapStateToProps(state) {
  return { todos: state.todos };
}

export default connect(mapStateToProps, null, null, {
  pure: false
})(TodoApp);
```

这也就消除了这个 `TodoApp` 是干净的，并使它无论什么时候更新，其父组件都会渲染的假设。注意，这会降低应用的性能，所以只有在别无他法的情况下才使用它。

### 在 context 或 props 中找不到 “store”

如果你有 context 的问题，

1. [确保你没有复制 React 的实例](https://medium.com/@dan_abramov/two-weird-tricks-that-fix-react-7cf9bbdef375) 到页面上。
2. 确保你没有忘记将根组件包装进 [`<Provider>`](#provider-store)。
3. 确保你运行的 React 和 React Redux 是最新版本。

### 不变的违例：addComponentAsRefTo(...)：只有唯一的 ReactOwner 拥有 refs。通常，这就意味着你想在一个没有 owner 的组件中添加一个 ref

如果你在 web 中使用 React，就意味着你有一个 [React 的复样](https://medium.com/@dan_abramov/two-weird-tricks-that-fix-react-7cf9bbdef375)。接下来，按照指令去解决这个问题。