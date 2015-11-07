## API

我们正在尽全力翻译，但速速远远不够  
欢迎你来翻译，加入我们：https://github.com/camsong/redux-in-chinese/issues/47  
原文：https://raw.githubusercontent.com/rackt/react-redux/master/docs/quick-start.md

### `<Provider store>`

`<Provider store>` 使组件层级中的 `connect()` 方法都能够获得 Redux store。正常情况下，你的根组件应该嵌套在 `<Provider>` 中才能使用 `connect()` 方法。

如果你*真的*需要这样做，你可以把 `store` 作为属性传递到每一个被 `connet()` 修饰的组件，但是我们只推荐您在单元测试中对 `store` 进行伪造 (stub) 或者在非完全基于 React 的代码中才这样做。正常情况下，你应该使用 `<Provider>`。

#### 属性

* `store` (*[Redux Store](http://rackt.github.io/redux/docs/api/Store.html)*): 应用程序中唯一的 Redux store 对象
* `children` (*ReactElement*) 组件层级的根组件。

#### 例子

##### React

```js
ReactDOM.render(
  <Provider store={store}>
    <MyRootComponent />
  </Provider>,
  rootEl
);
```

##### React Router 0.13

```js
Router.run(routes, Router.HistoryLocation, (Handler, routerState) => { // 注意这里的 "routerState"
  ReactDOM.render(
    <Provider store={store}>
      {/* 注意这里的 "routerState": 该变量应该传递到子组件 */}
      <Handler routerState={routerState} />
    </Provider>,
    document.getElementById('root')
  );
});
```

##### React Router 1.0

```js
ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>...</Router>
  </Provider>,
  targetEl
);
```

### `connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])`

连接 React 组件与 Redux store。

连接操作不会改变原来的组件类，反而*返回*一个新的已与 Redux store 连接的组件类。


#### 参数

* [`mapStateToProps(state, [ownProps]): stateProps`] \(*Function*): 如果定义该参数，组件将会监听 Redux store 的变化。任何时候，只要 Redux store 发生改变，`mapStateToProps` 函数就会被调用。该回调函数必须返回一个纯对象，这个对象会与组件的属性合并。如果指定了该回调函数中的第二个参数 `ownProps`，则该参数的值为传递到组件的属性，而且只要组件接收到新的属性，`mapStateToProps` 也会被调用。

* [`mapDispatchToProps(dispatch, [ownProps]): dispatchProps`] \(*Object* or *Function*): 如果传递的是一个对象，那么每个定义在该对象的函数都将被当作 Redux action creator，而且这个对象会与 Redux store 绑定在一起，其中所定义的方法名将作为属性名，合并到组件的属性中。如果传递的是一个函数，该函数将接收一个 `dispatch` 函数，然后由你来决定如何返回一个对象，这个对象通过 `dispatch` 函数与 action creators 以某种方式绑定在一起（提示：你也许会用到 Redux 的辅助函数 [`bindActionCreators()`](http://rackt.github.io/redux/docs/api/bindActionCreators.html)）。如果你省略这个 `mapDispatchToProps` 参数，默认情况下，`dispatch` 会注入到你的组件属性中。如果指定了该回调函数中第二个参数 `ownProps`，该参数的值为传递到组件的属性，而且只要组件接收到新属性，`mapDispatchToProps` 也会被调用。

* [`mergeProps(stateProps, dispatchProps, ownProps): props`] \(*Function*):  如果指定了这个参数，`mapStateToProps()` 与 `mapDispatchToProps()` 的执行结果和组件自身的属性将传入到这个回调函数中。该回调函数返回的对象将作为属性传递到被修饰的组件中。你也许可以用这个回调函数，根据组件的属性来筛选部分的状态数据，或者把某个特定的属性变量与 action creator 绑定在一起。如果你省略这个参数，默认情况下返回 `Object.assign({}, ownProps, stateProps, dispatchProps)` 的结果。

* [`options`] *(Object)* 如果指定这个参数，可以定制 connector 的行为。
  * [`pure = true`] *(Boolean)*: 如果为 true，connector 将执行 `shouldComponentUpdate` 并且浅对比 `mergeProps` 的结果，避免不必要的更新，前提是当前组件是一个“纯”组件，它不依赖于任何的输入或状态而只依赖于属性和 Redux store 的状态。*默认值为 `true`。*
  * [`withRef = false`] *(Boolean)*: 如果为 true，connector 会保存一个对被修饰组件实例的引用，该引用通过 `getWrappedInstance()` 方法获得。*默认值为 `false`*

#### 返回值

根据配置信息，返回一个注入了状态和 action creator 的 React 组件。

##### 静态属性

* `WrappedComponent` *(Component)*: 传递到 `connect()` 函数的原始组件类。

##### 静态方法

组件原来的静态方法都被提升到修饰后的 React 组件。

##### 实例方法

###### `getWrappedInstance(): ReactComponent`

 仅当 `connect()` 函数的第四个参数 `options` 设置了 `{ withRef: true }` 才返回被修饰的组件实例。

#### 备注

* 函数将被调用两次。第一次是设置参数，第二次是组件与 Redux store 连接：`connect(mapStateToProps, mapDispatchToProps, mergeProps)(MyComponent)`。

* connect 函数不会修改传入的 React 组件，返回的是一个新的已与 Redux store 连接的组件，而且你应该使用这个新组件。

* `mapStateToProps` 函数接收整个 Redux store 的状态作为参数，然后返回一个传入到组件属性的对象。该函数被称之为 **selector**。参考使用 [reselect](https://github.com/rackt/reselect) 高效地组合多个 **selector** ，并对 [收集到的数据进行处理](http://rackt.github.io/redux/docs/recipes/ComputingDerivedData.html)。

#### Examples 例子

##### 只注入 `dispatch`，不监听 store

```js
export default connect()(TodoApp);
```

##### 注入 `dispatch` 和全局 state

>不要这样做！由于每次发起 action 都会导致 `TodoApp` 重新渲染，这样会毁掉任何的性能优化。
>
>最好在多个组件上使用 `connect()`，而且这些组件只监听部分状态数据。

```js
export default connect(state => state)(TodoApp);
```

##### 注入 `dispatch` 和 `todos`

```js
function mapStateToProps(state) {
  return { todos: state.todos };
}

export default connect(mapStateToProps)(TodoApp);
```

##### 注入 `todos` 和所有 action creator  (`addTodo`, `completeTodo`, ...)

```js
import * as actionCreators from './actionCreators';

function mapStateToProps(state) {
  return { todos: state.todos };
}

export default connect(mapStateToProps, actionCreators)(TodoApp);
```

##### 注入 `todos` 并把所有 action creator 作为 `actions` 属性也注入组件中
```js
import * as actionCreators from './actionCreators';
import { bindActionCreators } from 'redux';

function mapStateToProps(state) {
  return { todos: state.todos };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoApp);
```

#####  注入 `todos` 和指定的 action creator (`addTodo`)

```js
import { addTodo } from './actionCreators';
import { bindActionCreators } from 'redux';

function mapStateToProps(state) {
  return { todos: state.todos };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addTodo }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoApp);
```

##### 注入 `todos` 并把 todoActionCreators 作为 `todoActions` 属性、counterActionCreators 作为 `counterActions` 属性注入到组件中

```js
import * as todoActionCreators from './todoActionCreators';
import * as counterActionCreators from './counterActionCreators';
import { bindActionCreators } from 'redux';

function mapStateToProps(state) {
  return { todos: state.todos };
}

function mapDispatchToProps(dispatch) {
  return {
    todoActions: bindActionCreators(todoActionCreators, dispatch),
    counterActions: bindActionCreators(counterActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoApp);
```

##### 注入 `todos` 并把 todoActionCreators 与 counterActionCreators 一同作为 `actions` 属性注入到组件中

```js
import * as todoActionCreators from './todoActionCreators';
import * as counterActionCreators from './counterActionCreators';
import { bindActionCreators } from 'redux';

function mapStateToProps(state) {
  return { todos: state.todos };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, todoActionCreators, counterActionCreators), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoApp);
```

##### 注入 `todos` 并把所有的 todoActionCreators 和 counterActionCreators 作为属性注入到组件中

```js
import * as todoActionCreators from './todoActionCreators';
import * as counterActionCreators from './counterActionCreators';
import { bindActionCreators } from 'redux';

function mapStateToProps(state) {
  return { todos: state.todos };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, todoActionCreators, counterActionCreators), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoApp);
```

##### 根据组件属性，注入特定用户的 `todos`

```js
import * as actionCreators from './actionCreators';

function mapStateToProps(state, ownProps) {
  return { todos: state.todos[ownProps.userId] };
}

export default connect(mapStateToProps)(TodoApp);
```

##### 根据组件属性，注入特定用户的 `todos` 并把 `props.userId` 传入到 action 中

```js
import * as actionCreators from './actionCreators';

function mapStateToProps(state) {
  return { todos: state.todos };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, ownProps, {
    todos: stateProps.todos[ownProps.userId],
    addTodo: (text) => dispatchProps.addTodo(ownProps.userId, text)
  });
}

export default connect(mapStateToProps, actionCreators, mergeProps)(TodoApp);
```