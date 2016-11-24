## 排错

开始之前，一定你已经学习 [Redux 排错](http://redux.js.org/docs/Troubleshooting.html)。

### View 不更新的问题

阅读上面的链接。
简而言之，

* Reducer 永远不应该更改原有 state，应该始终返回新的对象，否则，React Redux 觉察不到数据变化。
* 确保你使用了 `connect()` 的 `mapDispatchToProps` 参数或者 `bindActionCreators` 来绑定 action creator 函数，你也可以手动调用 `dispatch()` 进行绑定。直接调用 `MyActionCreators.addTodo()` 并不会起任何作用，因为它只会**返回**一个 action 对象，并不会 *dispatch* 它。

### React Router 0.13 的 route 变化中，view 不更新

如果你正在使用 React Router 0.13，你可能会[碰到这样的问题](https://github.com/reactjs/react-redux/issues/43)。解决方法很简单：当使用 `<RouteHandler>` 或者 `Router.run` 提供的 `Handler` 时，不要忘记传递 router state。

根 View：

```js
Router.run(routes, Router.HistoryLocation, (Handler, routerState) => { // 注意这里的 "routerState"
  ReactDOM.render(
    <Provider store={store}>
      {/* 注意这里的 "routerState" */}
      <Handler routerState={routerState} />
    </Provider>,
    document.getElementById('root')
  )
})
```

嵌套 view：

```js
render() {
  // 保持这样传递下去
  return <RouteHandler routerState={this.props.routerState} />
}
```

很方便地，这样你的组件就能访问 router 的 state 了！
当然，你可以将 React Router 升级到 1.0，这样就不会有此问题了。（如果还有问题，联系我们！）

### Redux 外部的一些东西更新时，view 不更新

如果 view 依赖全局的 state 或是 [React “context”](http://facebook.github.io/react/docs/context.html)，你可能发现那些使用 `connect()` 进行修饰的 view 无法更新。

>这是因为，默认情况下 `connect()` 实现了 [shouldComponentUpdate](https://facebook.github.io/react/docs/component-specs.html#updating-shouldcomponentupdate)，它假定在 props 和 state 一样的情况下，组件会渲染出同样的结果。这与 React 中 [PureRenderMixin](https://facebook.github.io/react/docs/pure-render-mixin.html) 的概念很类似。

这个问题的**最好**的解决方案是保持组件的纯净，并且所有外部的 state 都应通过 props 传递给它们。这将确保组件只在需要重新渲染时才会重新渲染，这将大大地提高了应用的速度。

当不可抗力导致上述解法无法实现时（比如，你使用了严重依赖 React context 的外部库），你可以设置 `connect()` 的 `pure: false` 选项：

```
function mapStateToProps(state) {
  return { todos: state.todos }
}

export default connect(mapStateToProps, null, null, {
  pure: false
})(TodoApp)
```

这样就表示你的 `TodoApp` 不是纯净的，只要父组件渲染，自身都会重新渲染。注意，这会降低应用的性能，所以只有在别无他法的情况下才使用它。

### 在 context 或 props 中都找不到 “store”

如果你有 context 的问题，

1. [确保你没有引入多个 React 实例](https://medium.com/@dan_abramov/two-weird-tricks-that-fix-react-7cf9bbdef375) 到页面上。
2. 确保你没有忘记将根组件包装进 [`<Provider>`](#provider-store)。
3. 确保你运行的 React 和 React Redux 是最新版本。

### Invariant Violation：addComponentAsRefTo(...)：只有 ReactOwner 才有 refs。这通常意味着你在一个没有 owner 的组件中添加了 ref

如果你在 web 中使用 React，就通常意味着你[引用了两遍 React](https://medium.com/@dan_abramov/two-weird-tricks-that-fix-react-7cf9bbdef375)。按照这个链接解决即可。