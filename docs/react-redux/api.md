## API

### `<Provider store>`

`<Provider store>` 使组件层级中的 `connect()` 方法都能够获得 Redux store。正常情况下，你的根组件应该嵌套在 `<Provider>` 中才能使用 `connect()` 方法。

如果你**真的**不想把根组件嵌套在 `<Provider>` 中，你可以把 `store` 作为 props 传递到每一个被 `connet()` 包装的组件，但是我们只推荐您在单元测试中对 `store` 进行伪造 (stub) 或者在非完全基于 React 的代码中才这样做。正常情况下，你应该使用 `<Provider>`。

#### 属性

* `store` (*[Redux Store](http://redux.js.org/docs/api/Store.html)*): 应用程序中唯一的 Redux store 对象
* `children` (*ReactElement*) 组件层级的根组件。

#### 例子

##### Vanilla React

```js
ReactDOM.render(
  <Provider store={store}>
    <MyRootComponent />
  </Provider>,
  rootEl
)
```

##### React Router

```js
ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <Route path="foo" component={Foo}/>
        <Route path="bar" component={Bar}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
```

### `connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])`

连接 React 组件与 Redux store。

连接操作不会改变原来的组件类。  
反而**返回**一个新的已与 Redux store 连接的组件类。

#### 参数

* [`mapStateToProps(state, [ownProps]): stateProps`] \(*Function*): 如果定义该参数，组件将会监听 Redux store 的变化。任何时候，只要 Redux store 发生改变，`mapStateToProps` 函数就会被调用。该回调函数必须返回一个纯对象，这个对象会与组件的 props 合并。如果你省略了这个参数，你的组件将不会监听 Redux store。如果指定了该回调函数中的第二个参数 `ownProps`，则该参数的值为传递到组件的 props，而且只要组件接收到新的 props，`mapStateToProps` 也会被调用（例如，当 props 接收到来自父组件一个小小的改动，那么你所使用的 ownProps 参数，mapStateToProps 都会被重新计算）。

  > 注意：在高级章节中，你需要更好地去控制渲染的性能，所用到的 `mapStateToProps()` 会返回一个函数。但在这个例子中，**这个**函数将被 `mapStateToProps()` 在独有的组件实例中调用。这样就允许你在每一个实例中去记录。你可以参考 [#279](https://github.com/reactjs/react-redux/pull/279) 去测试和了解其中的详细内容。但在绝大多数的应用中不会用到。

* [`mapDispatchToProps(dispatch, [ownProps]): dispatchProps`] \(*Object* or *Function*): 如果传递的是一个对象，那么每个定义在该对象的函数都将被当作 Redux action creator，而且这个对象会与 Redux store 绑定在一起，其中所定义的方法名将作为属性名，合并到组件的 props 中。如果传递的是一个函数，该函数将接收一个 `dispatch` 函数，然后由你来决定如何返回一个对象，这个对象通过 `dispatch` 函数与 action creator 以某种方式绑定在一起（提示：你也许会用到 Redux 的辅助函数 [`bindActionCreators()`](http://rackt.github.io/redux/docs/api/bindActionCreators.html)）。如果你省略这个 `mapDispatchToProps` 参数，默认情况下，`dispatch` 会注入到你的组件 props 中。如果指定了该回调函数中第二个参数 `ownProps`，该参数的值为传递到组件的 props，而且只要组件接收到新 props，`mapDispatchToProps` 也会被调用。

  > 注意：在高级章节中，你需要更好地去控制渲染的性能，所用到的 `mapStateToProps()` 会返回一个函数。但在这个例子中，**这个**函数将被 `mapStateToProps()` 在独有的组件实例中调用。这样就允许你在每一个实例中去记录。你可以参考 [#279](https://github.com/reactjs/react-redux/pull/279) 去测试和了解其中的详细内容。但在绝大多数的应用中不会用到。

* [`mergeProps(stateProps, dispatchProps, ownProps): props`] \(*Function*):  如果指定了这个参数，`mapStateToProps()` 与 `mapDispatchToProps()` 的执行结果和组件自身的 `props` 将传入到这个回调函数中。该回调函数返回的对象将作为 props 传递到被包装的组件中。你也许可以用这个回调函数，根据组件的 props 来筛选部分的 state 数据，或者把 props 中的某个特定变量与 action creator 绑定在一起。如果你省略这个参数，默认情况下返回 `Object.assign({}, ownProps, stateProps, dispatchProps)` 的结果。

* [`options`] *(Object)* 如果指定这个参数，可以定制 connector 的行为。
  * [`pure = true`] *(Boolean)*: 如果为 true，connector 将执行 `shouldComponentUpdate` 并且浅对比 `mergeProps` 的结果，避免不必要的更新，前提是当前组件是一个“纯”组件，它不依赖于任何的输入或 state 而只依赖于 props 和 Redux store 的 state。*默认值为 `true`。*
  * [`withRef = false`] *(Boolean)*: 如果为 true，connector 会保存一个对被包装组件实例的引用，该引用通过 `getWrappedInstance()` 方法获得。*默认值为 `false`。*

> 注意：如果定义一个包含强制性参数函数（这个函数的长度为 1）时，`ownProps` **不会传到** `mapStateToProps` 和 `mapDispatchToProps` 中。举个例子，如下这样定义一个函数时将不会接收到 `ownProps` 作为第二个参数。
```javascript
function mapStateToProps(state) {
  console.log(state); // state
  console.log(arguments[1]); // undefined
}
```
```javascript
const mapStateToProps = (state, ownProps = {}) => {
  console.log(state); // state
  console.log(ownProps); // undefined
}
```
当函数没有强制性的参数或两个参数时**将接收到** `ownProps`。
```javascript
const mapStateToProps = (state, ownProps) => {
  console.log(state); // state
  console.log(ownProps); // ownProps
}
```
```javascript
function mapStateToProps() {
  console.log(arguments[0]); // state
  console.log(arguments[1]); // ownProps
}
```
```javascript
const mapStateToProps = (...args) => {
  console.log(args[0]); // state
  console.log(args[1]); // ownProps
}
```


#### 返回值

根据配置信息，返回一个注入了 state 和 action creator 的 React 组件。

##### 静态属性

* `WrappedComponent` *(Component)*: 传递到 `connect()` 函数的原始组件类。

##### 静态方法

组件原来的静态方法都被提升到被包装的 React 组件。

##### 实例方法

###### `getWrappedInstance(): ReactComponent`

仅当 `connect()` 函数的第四个参数 `options` 设置了 `{ withRef: true }` 才返回被包装的组件实例。

#### 备注

* 函数将被调用两次。第一次是设置参数，第二次是组件与 Redux store 连接：`connect(mapStateToProps, mapDispatchToProps, mergeProps)(MyComponent)`。

* connect 函数不会修改传入的 React 组件，返回的是一个新的已与 Redux store 连接的组件，而且你应该使用这个新组件。

* `mapStateToProps` 函数接收整个 Redux store 的 state 作为 props，然后返回一个传入到组件 props 的对象。该函数被称之为 **selector**。参考使用 [reselect](https://github.com/reactjs/reselect) 高效地组合多个 **selector** ，并对 [收集到的数据进行处理](http://redux.js.org/docs/recipes/ComputingDerivedData.html)。

#### Examples 例子

##### 只注入 `dispatch`，不监听 store

```js
export default connect()(TodoApp)
```

##### 注入全部没有订阅 store 的 action creators  (`addTodo`, `completeTodo`, ...)

```js
import * as actionCreators from './actionCreators'

export default connect(null, actionCreators)(TodoApp)
```

##### 注入 `dispatch` 和全局 state

>不要这样做！这会导致每次 action 都触发整个 `TodoApp` 重新渲染，你做的所有性能优化都将付之东流。
>
>最好在多个组件上使用 `connect()`，每个组件只监听它所关联的部分 state。

```js
export default connect(state => state)(TodoApp)
```

##### 注入 `dispatch` 和 `todos`

```js
function mapStateToProps(state) {
  return { todos: state.todos }
}

export default connect(mapStateToProps)(TodoApp)
```

##### 注入 `todos` 和所有 action creator

```js
import * as actionCreators from './actionCreators'

function mapStateToProps(state) {
  return { todos: state.todos }
}

export default connect(mapStateToProps, actionCreators)(TodoApp)
```

##### 注入 `todos` 并把所有 action creator (`addTodo`, `completeTodo`, ...) 作为 `actions` 属性也注入组件中

```js
import * as actionCreators from './actionCreators'
import { bindActionCreators } from 'redux'

function mapStateToProps(state) {
  return { todos: state.todos }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoApp)
```

#####  注入 `todos` 和指定的 action creator (`addTodo`)

```js
import { addTodo } from './actionCreators'
import { bindActionCreators } from 'redux'

function mapStateToProps(state) {
  return { todos: state.todos }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addTodo }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoApp)
```

##### 注入 `todos` 并把 todoActionCreators 作为 `todoActions` 属性、counterActionCreators 作为 `counterActions` 属性注入到组件中

```js
import * as todoActionCreators from './todoActionCreators'
import * as counterActionCreators from './counterActionCreators'
import { bindActionCreators } from 'redux'

function mapStateToProps(state) {
  return { todos: state.todos }
}

function mapDispatchToProps(dispatch) {
  return {
    todoActions: bindActionCreators(todoActionCreators, dispatch),
    counterActions: bindActionCreators(counterActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoApp)
```

##### 注入 `todos` 并把 todoActionCreators 与 counterActionCreators 一同作为 `actions` 属性注入到组件中

```js
import * as todoActionCreators from './todoActionCreators'
import * as counterActionCreators from './counterActionCreators'
import { bindActionCreators } from 'redux'

function mapStateToProps(state) {
  return { todos: state.todos }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, todoActionCreators, counterActionCreators), dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoApp)
```

##### 注入 `todos` 并把所有的 todoActionCreators 和 counterActionCreators 作为 props 注入到组件中

```js
import * as todoActionCreators from './todoActionCreators'
import * as counterActionCreators from './counterActionCreators'
import { bindActionCreators } from 'redux'

function mapStateToProps(state) {
  return { todos: state.todos }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, todoActionCreators, counterActionCreators), dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoApp)
```

##### 根据组件的 props 注入特定用户的 `todos`

```js
import * as actionCreators from './actionCreators'

function mapStateToProps(state, ownProps) {
  return { todos: state.todos[ownProps.userId] }
}

export default connect(mapStateToProps)(TodoApp)
```

##### 根据组件的 props 注入特定用户的 `todos` 并把 `props.userId` 传入到 action 中

```js
import * as actionCreators from './actionCreators'

function mapStateToProps(state) {
  return { todos: state.todos }
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, ownProps, {
    todos: stateProps.todos[ownProps.userId],
    addTodo: (text) => dispatchProps.addTodo(ownProps.userId, text)
  })
}

export default connect(mapStateToProps, actionCreators, mergeProps)(TodoApp)
```
