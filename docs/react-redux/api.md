## API

### `<Provider store>`

`<Provider store>` 使组件层级中的 `connect()` 方法都能够获得 Redux store。正常情况下，你的根组件应该嵌套在 `<Provider>` 中才能使用 `connect()` 方法。

如果你**真的**不想把根组件嵌套在 `<Provider>` 中，你可以把 `store` 作为 props 传递到每一个被 `connect()` 包装的组件，但是我们只推荐您在单元测试中对 `store` 进行伪造 (stub) 或者在非完全基于 React 的代码中才这样做。正常情况下，你应该使用 `<Provider>`。

#### 属性

- `store` (_[Redux Store](http://cn.redux.js.org/docs/api/Store.html)_): 应用程序中唯一的 Redux store 对象
- `children` (_ReactElement_) 组件层级的根组件。

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
        <Route path="foo" component={Foo} />
        <Route path="bar" component={Bar} />
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

- [`mapStateToProps(state, [ownProps]): stateProps`] \(_Function_): 如果定义该参数，组件将会监听 Redux store 的变化。任何时候，只要 Redux store 发生改变，`mapStateToProps` 函数就会被调用。该回调函数必须返回一个纯对象，这个对象会与组件的 props 合并。如果你省略了这个参数，你的组件将不会监听 Redux store。如果指定了该回调函数中的第二个参数 `ownProps`，则该参数的值为传递到组件的 props，而且只要组件接收到新的 props，`mapStateToProps` 也会被调用（例如，当 props 接收到来自父组件一个小小的改动，那么你所使用的 ownProps 参数，mapStateToProps 都会被重新计算）。

> 注意：在高级章节中，你需要更好地去控制渲染的性能，所用到的 `mapStateToProps()` 会返回一个函数。在这种情况下，**那个**函数将被作为 `mapStateToProps()` 在独有的组件实例中调用。这样就允许你在每一个实例中去记录。你可以参考 [#279](https://github.com/reactjs/react-redux/pull/279) 去测试和了解其中的详细内容。但在绝大多数的应用中不会用到。

- [`mapDispatchToProps(dispatch, [ownProps]): dispatchProps`] \(_Object_ or _Function_): 如果传递的是一个对象，那么每个定义在该对象的函数都将被当作 Redux action creator，对象所定义的方法名将作为属性名；每个方法将返回一个新的函数，函数中`dispatch`方法会将 action creator 的返回值作为参数执行。这些属性会被合并到组件的 props 中。

如果传递的是一个函数，该函数将接收一个 `dispatch` 函数，然后由你来决定如何返回一个对象，这个对象通过 `dispatch` 函数与 action creator 以某种方式绑定在一起（提示：你也许会用到 Redux 的辅助函数 [`bindActionCreators()`](http://cn.redux.js.org/docs/api/bindActionCreators.html)。如果你省略这个 `mapDispatchToProps` 参数，默认情况下，`dispatch` 会注入到你的组件 props 中。如果指定了该回调函数中第二个参数 `ownProps`，该参数的值为传递到组件的 props，而且只要组件接收到新 props，`mapDispatchToProps` 也会被调用。

> 注意：在高级章节中，你需要更好地去控制渲染的性能，所用到的 `mapStateToProps()` 会返回一个函数。但在这个例子中，**这个**函数将被 `mapStateToProps()` 在独有的组件实例中调用。这样就允许你在每一个实例中去记录。你可以参考 [#279](https://github.com/reactjs/react-redux/pull/279) 去测试和了解其中的详细内容。但在绝大多数的应用中不会用到。
> `mapStateToProps` 函数的第一个参数是整个 Redux store 的 state，它返回一个要作为 props 传递的对象。它通常被称作 **selector** （选择器）。 可以使用[reselect](https://github.com/reactjs/reselect)去有效地组合选择器和[计算衍生数据](http://cn.redux.js.org/docs/recipes/ComputingDerivedData.html).

- [`mergeProps(stateProps, dispatchProps, ownProps): props`] \(_Function_): 如果指定了这个参数，`mapStateToProps()` 与 `mapDispatchToProps()` 的执行结果和组件自身的 `props` 将传入到这个回调函数中。该回调函数返回的对象将作为 props 传递到被包装的组件中。你也许可以用这个回调函数，根据组件的 props 来筛选部分的 state 数据，或者把 props 中的某个特定变量与 action creator 绑定在一起。如果你省略这个参数，默认情况下返回 `Object.assign({}, ownProps, stateProps, dispatchProps)` 的结果。

- [`options`] _(Object)_ 如果指定这个参数，可以定制 connector 的行为。
  - [`pure = true`] _(Boolean)_: 如果为 true，connector 将执行 `shouldComponentUpdate` 并且浅对比 `mergeProps` 的结果，避免不必要的更新，前提是当前组件是一个“纯”组件，它不依赖于任何的输入或 state 而只依赖于 props 和 Redux store 的 state。_默认值为 `true`。_
  - [`withRef = false`] _(Boolean)_: 如果为 true，connector 会保存一个对被被包含的组件实例的引用，该引用通过 `getWrappedInstance()` 方法获得。_默认值为 `false`。_

> 注意：如果定义一个包含强制性参数函数（这个函数的长度为 1）时，`ownProps` **不会传到** `mapStateToProps` 和 `mapDispatchToProps` 中。举个例子，如下这样定义一个函数时将不会接收到 `ownProps` 作为第二个参数。

```javascript
function mapStateToProps(state) {
  console.log(state) // state
  console.log(arguments[1]) // undefined
}
```

```javascript
const mapStateToProps = (state, ownProps = {}) => {
  console.log(state) // state
  console.log(ownProps) // undefined
}
```

当函数没有强制性的参数或两个参数时**将接收到** `ownProps`。

```javascript
const mapStateToProps = (state, ownProps) => {
  console.log(state) // state
  console.log(ownProps) // ownProps
}
```

```javascript
function mapStateToProps() {
  console.log(arguments[0]) // state
  console.log(arguments[1]) // ownProps
}
```

```javascript
const mapStateToProps = (...args) => {
  console.log(args[0]) // state
  console.log(args[1]) // ownProps
}
```

#### 返回值

根据配置信息，返回一个注入了 state 和 action creator 的 React 组件。

##### 静态属性

- `WrappedComponent` _(Component)_: 传递到 `connect()` 函数的原始组件类。

##### 静态方法

组件原来的静态方法都被提升到被包装的 React 组件。

##### 实例方法

###### `getWrappedInstance(): ReactComponent`

仅当 `connect()` 函数的第四个参数 `options` 设置了 `{ withRef: true }` 才返回被包装的组件实例。

#### 备注

- 函数将被调用两次。第一次是设置参数，第二次是组件与 Redux store 连接：`connect(mapStateToProps, mapDispatchToProps, mergeProps)(MyComponent)`。

- connect 函数不会修改传入的 React 组件，返回的是一个新的已与 Redux store 连接的组件，而且你应该使用这个新组件。

- `mapStateToProps` 函数接收整个 Redux store 的 state 作为 props，然后返回一个传入到组件 props 的对象。该函数被称之为 **selector**。参考使用 [reselect](https://github.com/reactjs/reselect) 高效地组合多个 **selector** ，并对 [收集到的数据进行处理](http://cn.redux.js.org/docs/recipes/ComputingDerivedData.html)。

#### Examples 例子

##### 只注入 `dispatch`，不监听 store

```js
export default connect()(TodoApp)
```

##### 注入全部没有订阅 store 的 action creators (`addTodo`, `completeTodo`, ...)

```js
import * as actionCreators from './actionCreators'

export default connect(
  null,
  actionCreators
)(TodoApp)
```

##### 注入 `dispatch` 和全局 state

> 不要这样做！这会导致每次 action 都触发整个 `TodoApp` 重新渲染，你做的所有性能优化都将付之东流。
>
> 最好在多个组件上使用 `connect()`，每个组件只监听它所关联的部分 state。

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

export default connect(
  mapStateToProps,
  actionCreators
)(TodoApp)
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoApp)
```

##### 注入 `todos` 和指定的 action creator (`addTodo`)

```js
import { addTodo } from './actionCreators'
import { bindActionCreators } from 'redux'

function mapStateToProps(state) {
  return { todos: state.todos }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addTodo }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoApp)
```

##### 简写语法注入 `todos` 和特定的 action 创建函数(`addTodo` and `deleteTodo`)

```js
import { addTodo, deleteTodo } from './actionCreators'

function mapStateToProps(state) {
  return { todos: state.todos }
}

const mapDispatchToProps = {
  addTodo,
  deleteTodo
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoApp)
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoApp)
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
    actions: bindActionCreators(
      Object.assign({}, todoActionCreators, counterActionCreators),
      dispatch
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoApp)
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
  return bindActionCreators(
    Object.assign({}, todoActionCreators, counterActionCreators),
    dispatch
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoApp)
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
    addTodo: text => dispatchProps.addTodo(ownProps.userId, text)
  })
}

export default connect(
  mapStateToProps,
  actionCreators,
  mergeProps
)(TodoApp)
```

###### 工厂（Factory）函数

工厂函数可用于性能优化。

```js
import { addTodo } from './actionCreators'

function mapStateToPropsFactory(initialState, initialProps) {
  const getSomeProperty= createSelector(...);
  const anotherProperty = 200 + initialState[initialProps.another];
  return function(state){
    return {
      anotherProperty,
      someProperty: getSomeProperty(state),
      todos: state.todos
    }
  }
}

function mapDispatchToPropsFactory(initialState, initialProps) {
  function goToSomeLink(){
    initialProps.history.push('some/link');
  }
  return function(dispatch){
    return {
      addTodo
    }
  }
}


export default connect(mapStateToPropsFactory, mapDispatchToPropsFactory)(TodoApp)
```

<a id="connectAdvanced"></a>

### `connectAdvanced(selectorFactory, [connectOptions])`

它是一个将 React 组件连接到 Redux store 的函数。这个函数是 `connect()` 的基础，但是对于如何把`state`, `props`, 和 `dispatch` 组合到最后的 props 中，则不那么自以为是。它不对默认值或结果的记录做任何假设，而是将这些责任留给调用者。

它不修改传递给它的组件类；相反，它*返回*一个新的、已连接的组件类，供您使用。

<a id="connectAdvanced-arguments"></a>

#### 参数

- `selectorFactory(dispatch, factoryOptions): selector(state, ownProps): props` \(_Function_):初始化选择器函数 (在每个实例的构造函数中)。该选择器函数是在 connector 组件需要重新计算一个新的 props 时调用，作为 store 的 state 改变或者接收到一个新的 props 的结果。`selector` 的结果应该是一个普通对象，作为被包裹的组件的 props 传递。如果连续调用 `selector` 都返回与上一次调用相同的对象(`===`)，则不会重新渲染该组件。`selector` 的责任是在适当的时候返回以前的对象。

- [`connectOptions`] _(Object)_ 如果指定，则进一步自定义连接器(connector)的行为。

  - [`getDisplayName`] _(Function)_: 计算连接器组件相对于被包裹的组件的 DisplayName 属性。 通常被包裹函数覆盖。 默认值: `name => 'ConnectAdvanced('+name+')'`

  - [`methodName`] _(String)_:显示在错误消息中。 通常被包裹函数覆盖。 默认值: `'connectAdvanced'`

  - [`renderCountProp`] _(String)_: 如果被定义, 名为此值的属性将添加到传递给被包裹组件的 props 中。它的值将是组件被渲染的次数，这对于跟踪不必要的重新渲染非常有用。默认值: `undefined`

  - [`shouldHandleStateChanges`] _(Boolean)_: 控制连接器（connector）组件是否订阅 redux store 的 state 更改。 如果设置为 false，则只会在`componentWillReceiveProps`中重新渲染。 默认值: `true`

  - [`storeKey`] _(String)_: 可以获取 store 的 props/context key。 当你不明智地使用了多个 store 的时候，你才可能需要这个。默认值: `'store'`

  - [`withRef`] _(Boolean)_: 如果为 true，则将一个引用存储到被包裹的组件实例中，并通过 `getWrappedInstance()` 方法使其可用。 默认值: `false`

  - 此外，通过 `connectOptions` 传递的任何额外选项都将传递给 `factorOptions` 参数中的 `selectorFactory`。

<a id="connectAdvanced-returns"></a>

#### 返回值

一个高阶 React 组件类，它从 store 的 state 生成 props 并将它们传递给被包裹的组件。高阶组件是接受组件参数并返回新组件的函数.

##### 静态属性

- `WrappedComponent` _(Component)_: 原始组件类传递给 `connectAdvanced(...)(Component)`.

##### 静态函数

组件的所有原始静态方法都被挂起。

##### 实例方法

###### `getWrappedInstance(): ReactComponent`

返回被包裹组件的实例。只有当你传递 `{ withRef: true }` 作为`options` 的参数才可用。

#### 注意

- 因为 `connectAdvanced` 返回一个高阶组件，所以需要调用它两次。 第一次使用上面描述的参数，第二次使用组件： `connectAdvanced(selectorFactory)(MyComponent)`.

- `connectAdvanced` 不修改传递的 React 组件。它返回一个新的连接组件，您应该使用它。

<a id="connectAdvanced-examples"></a>

#### 例子

##### 根据 props 将特定用户的 `todos` 注入，并将 `pros.userid` 注入到操作中

```js
import * as actionCreators from './actionCreators'
import { bindActionCreators } from 'redux'

function selectorFactory(dispatch) {
  let ownProps = {}
  let result = {}
  const actions = bindActionCreators(actionCreators, dispatch)
  const addTodo = text => actions.addTodo(ownProps.userId, text)
  return (nextState, nextOwnProps) => {
    const todos = nextState.todos[nextOwnProps.userId]
    const nextResult = { ...nextOwnProps, todos, addTodo }
    ownProps = nextOwnProps
    if (!shallowEqual(result, nextResult)) result = nextResult
    return result
  }
}
export default connectAdvanced(selectorFactory)(TodoApp)
```

<a id="createProvider"></a>

### `createProvider([storeKey])`

创建一个新的`<Provider>`，它将在上下文的传递 key 上设置 Redux Store。 当你不明智地使用了多个 store 的时候，你才可能需要这个。您还需要将相同的 `storeKey` 传递给[`connect`](#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)的 `options` 参数。

<a id="createProvider-arguments"></a>

#### 参数

- [`storeKey`](*String*): The key of the context on which to set the store.要在其上设置 store 的上下文的 key。 默认值: `'store'`

#### 例子

在创建多个 store 之前，请浏览以下常见问题： [我是否可以或应该创建多个 store?](https://cn.redux.js.org/docs/faq/StoreSetup.html#store-setup-multiple-stores)

```js
import { connect, createProvider } from 'react-redux'

const STORE_KEY = 'componentStore'

export const Provider = createProvider(STORE_KEY)

function connectExtended(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  options = {}
) {
  options.storeKey = STORE_KEY
  return connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    options
  )
}

export { connectExtended as connect }
```

现在，您可以 import 上面的 `Provider`和 `connect` 并使用它们。
