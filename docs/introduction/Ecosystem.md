# 生态系统

Redux 是一个体小精悍的库，但它相关的内容和 API 都是精挑细选的，目的是衍生出丰富的工具集和可扩展的生态系统。社区已经创建了各种各样的有用的插件、库和工具。使用 Redux 时并不需要您非要使用这些插件，但是它们可以帮助您更容易地实现特性并解决应用程序中的问题。

如果需要关于 Redux 所有内容的列表，推荐移步至 [Awesome Redux](https://github.com/xgrommx/awesome-redux)。它包含了示例、样板代码、中间件、工具库，还有很多其它相关内容。要想学习 React 和 Redux ，[React/Redux Links](https://github.com/markerikson/react-redux-links) 包含了教程和不少有用的资源，[Redux Ecosystem Links](https://github.com/markerikson/redux-ecosystem-links) 则列出了 许多 Redux 相关的库及插件。

本页将只列出由 Redux 维护者审查过的一部分内容。不要因此打消尝试其它工具的信心！整个生态发展得太快，我们没有足够的时间去关注所有内容。建议只把这些当作“内部推荐”，如果你使用 Redux 创建了很酷的内容，不要犹豫，马上发个 PR 吧。

## 目录

- [与不同框架绑定](#library-integration-and-bindings)
- [Reducers](#reducers)
  - [组合 Reducer](#reducer-combination)
  - [Reducer 结构](#reducer-composition)
  - [高阶 Reducers](#higher-order-reducers)
- [Actions](#actions)
- [工具集](#utilities)
- [Store](#store)
  - [更改订阅](#change-subscriptions)
  - [批处理](#batching)
  - [持久化](#persistence)
- [不可变（Immutable）数据](#immutable-data)
  - [数据结构](#data-structures)
  - [不可变更新（Immutable Update）实用程序](#immutable-update-utilities)
  - [Immutable/Redux 互操作](#immutable-redux-interop)
- [副作用（Side Effects）](#side-effects)
  - [广泛使用](#widely-used)
  - [Promises](#promises)
- [中间件](#middleware)
  - [Networks and Sockets](#networks-and-sockets)
  - [异步行为](#async-behavior)
  - [分析](#analytics)
- [实体和集合](#entities-and-collections)
- [组件 state 和封装](#component-state-and-encapsulation)
- [开发者工具](#dev-tools)
  - [Debuggers and Viewers](#debuggers-and-viewers)
  - [日志](#logging)
  - [突变检测](#mutation-detection)
- [测试](#testing)
- [路由](#routing)
- [Forms](#forms)
- [更高级别的抽象](#higher-level-abstractions)
- [社区公约](#community-conventions)

<a id="library-integration-and-bindings"></a>

## 与不同框架绑定

**[reduxjs/react-redux](https://github.com/reduxjs/react-redux)**  
Redux 与 react 的官方绑定库，由 Redux 团队维护

**[angular-redux/ng-redux](https://github.com/angular-redux/ng-redux)**  
Redux 与 Angular 1 的绑定库

**[angular-redux/store](https://github.com/angular-redux/store)**  
Redux 与 Angular 2+ 的绑定库

**[ember-redux/ember-redux](https://github.com/ember-redux/ember-redux)**  
Redux 与 Ember 的绑定库

**[glimmer-redux/glimmer-redux](glimmer-redux/glimmer-redux)**  
Redux 绑定 Ember 的 Glimmer 组件引擎

**[tur-nr/polymer-redux](https://github.com/tur-nr/polymer-redux)**  
Redux 与 Polymer 的绑定库

**[lastmjs/redux-store-element](https://github.com/lastmjs/redux-store-element)**
Redux 与自定义组件的绑定库

## Reducers

<a id="reducer-combination"></a>

#### 组合 Reducer

**[ryo33/combineSectionReducers](https://github.com/ryo33/combine-section-reducers)**  
`combineReducers` 的扩展版本，它允许将 `state` 作为第三个参数传递给所有的子 reducer。

**[KodersLab/topologically-combine-reducers](https://github.com/KodersLab/topologically-combine-reducers)**  
一种 `combineReducers` 变体，定义 reducer 之间的相互依赖用于调用排序和数据传递

```js
var masterReducer = topologicallyCombineReducers(
  { auth, users, todos },
  // 定义依赖树
  { auth: ['users'], todos: ['auth'] }
)
```

<a id="reducer-composition"></a>

#### Reducer 结构

**[acdlite/reduce-reducers](https://github.com/acdlite/reduce-reducers)**  
在同一级别提供 reducer 的顺序组合

```js
const combinedReducer = combineReducers({ users, posts, comments })
const rootReducer = reduceReducers(combinedReducer, otherTopLevelFeatureReducer)
```

**[mhelmer/redux-xforms](https://github.com/mhelmer/redux-xforms)**  
一组可组合的 reducer 变体。

```js
const createByFilter = (predicate, mapActionToKey) =>
  compose(
    withInitialState({}), // inject initial state as {}
    withFilter(predicate), // let through if action has filterName
    updateSlice(mapActionToKey), // update a single key in the state
    isolateSlice(mapActionToKey) // run the reducer on a single state slice
  )
```

**[adrienjt/redux-data-structures](https://github.com/adrienjt/redux-data-structures)**  
Reducer 工厂函数，用于常见数据结构：计数器，映射，列表（队列，堆栈），集合

```js
const myCounter = counter({
  incrementActionTypes: ['INCREMENT'],
  decrementActionTypes: ['DECREMENT']
})
```

<a id="higher-order-reducers"></a>

#### 高阶 Reducers

**[omnidan/redux-undo](https://github.com/omnidan/redux-undo)**  
轻松为 reducer 实现 undo/redo 和 action 的历史记录功能。

**[omnidan/redux-ignore](https://github.com/omnidan/redux-ignore)**  
通过数组或过滤器函数忽略 redux action

**[omnidan/redux-recycle](https://github.com/omnidan/redux-recycle)**  
在某些 action 上重置 redux 状态

**[ForbesLindesay/redux-optimist](https://github.com/ForbesLindesay/redux-optimist)**  
reducer 增强器，用于启用与类型无关的乐观更新

## Actions

**[reduxactions/redux-actions](https://github.com/reduxactions/redux-actions)**  
Redux 的 Flux 标准 action 实用程序。

```js
const increment = createAction('INCREMENT')
const reducer = handleActions({ [increment]: (state, action) => state + 1 }, 0)
const store = createStore(reducer)
store.dispatch(increment())
```

**[BerkeleyTrue/redux-create-types](https://github.com/BerkeleyTrue/redux-create-types)**  
根据命名空间创建标准和异步 action type。

```js
export const types = createTypes(
  ['openModal', createAsyncTypes('fetch')],
  'app'
)
// { openModal : "app.openModal", fetch : { start : "app.fetch.start", complete: 'app.fetch.complete' } }
```

**[maxhallinan/kreighter](https://github.com/maxhallinan/kreighter)**  
根据类型和预期字段生成 action creator

```js
const formatTitle = (id, title) => ({
  id,
  title: toTitleCase(title)
})
const updateBazTitle = fromType('UPDATE_BAZ_TITLE', formatTitle)
updateBazTitle(1, 'foo bar baz')
// -> { type: 'UPDATE_BAZ_TITLE', id: 1, title: 'Foo Bar Baz', }
```

<a id="utilities"></a>

## 工具集

**[reduxjs/reselect](https://github.com/reduxjs/reselect)**  
创建可组合的 memoized 选择器函数，以便从 store state 有效地导出数据

```js
const taxSelector = createSelector(
  [subtotalSelector, taxPercentSelector],
  (subtotal, taxPercent) => subtotal * (taxPercent / 100)
)
```

**[paularmstrong/normalizr](https://github.com/paularmstrong/normalizr)**  
根据模式规范化嵌套 JSON

```js
const user = new schema.Entity('users')
const comment = new schema.Entity('comments', { commenter: user })
const article = new schema.Entity('articles', {
  author: user,
  comments: [comment]
})
const normalizedData = normalize(originalData, article)
```

**[planttheidea/selectorator](https://github.com/planttheidea/selectorator)**  
对于常见 selector 用例的 reselect 的抽象化

```js
const getBarBaz = createSelector(
  ['foo.bar', 'baz'],
  (bar, baz) => `${bar} ${baz}`
)
getBarBaz({ foo: { bar: 'a' }, baz: 'b' }) // "a b"
```

## Store

<a id="change-subscriptions"></a>

#### 更改订阅

**[jprichardson/redux-watch](https://github.com/jprichardson/redux-watch)**  
根据 key path 或 selector 监视状态更改

```js
let w = watch(() => mySelector(store.getState()))
store.subscribe(
  w((newVal, oldVal) => {
    console.log(newval, oldVal)
  })
)
```

**[ashaffer/redux-subscribe](https://github.com/ashaffer/redux-subscribe)**  
集中订阅基于 path 的 state 更改

```js
store.dispatch( subscribe("users.byId.abcd", "subscription1", () => {} );
```

<a id="batching"></a>

#### 批处理

**[tappleby/redux-batched-subscribe](https://github.com/tappleby/redux-batched-subscribe)**  
可以取消订阅通知的 store 增强器

```js
const debounceNotify = _.debounce(notify => notify())
const store = createStore(
  reducer,
  initialState,
  batchedSubscribe(debounceNotify)
)
```

**[manaflair/redux-batch](https://github.com/manaflair/redux-batch)**  
store 增强器，允许 dispatch action 数组

```js
const store = createStore(reducer, reduxBatch)
store.dispatch([{ type: 'INCREMENT' }, { type: 'INCREMENT' }])
```

**[laysent/redux-batch-actions-enhancer](https://github.com/laysent/redux-batch-actions-enhancer)**  
store 增强器，接受批量 action

```js
const store = createStore(reducer, initialState, batch().enhancer)
store.dispatch(createAction({ type: 'INCREMENT' }, { type: 'INCREMENT' }))
```

**[tshelburne/redux-batched-actions](https://github.com/tshelburne/redux-batched-actions)**  
处理批量 action 的高阶 reducer

```js
const store = createStore(enableBatching(reducer), initialState)
store.dispatch(batchActions([{ type: 'INCREMENT' }, { type: 'INCREMENT' }]))
```

<a id="persistence"></a>

#### 持久化

**[rt2zz/redux-persist](https://github.com/rt2zz/redux-persist)**  
使用许多可扩展的选项，持久化和补充 Redux store。

```js
const store = createStore(reducer, autoRehydrate())
persistStore(store)
```

**[react-stack/redux-storage](https://github.com/react-stack/redux-storage)**  
Redux 的持久层，具有灵活的后端。

```js
const reducer = storage.reducer(combineReducers(reducers))
const engine = createEngineLocalStorage('my-save-key')
const storageMiddleware = storage.createMiddleware(engine)
const store = createStore(reducer, applyMiddleware(storageMiddleware))
```

**[redux-offline/redux-offline](https://github.com/redux-offline/redux-offline)**  
用于 Offline-First 应用程序的持久 store ，支持积极的 UI 更新（optimistic UI）

```js
const store = createStore(reducer, offline(offlineConfig))
store.dispatch({
  type: 'FOLLOW_USER_REQUEST',
  meta: { offline: { effect: {}, commit: {}, rollback: {} } }
})
```

<a id="immutable-data"></a>

## 不可变（Immutable）数据

<a id="data-structures"></a>

#### 数据结构

**[facebook/immutable-js](https://github.com/facebook/immutable-js)**  
Javascript 的不可变持久数据集合

```js
const map1 = Map({ a: 1, b: 2, c: 3 })
const map2 = map1.set('b', 50)
map1.get('b') // 2
map2.get('b') // 50
```

**[rtfeldman/seamless-immutable](https://github.com/rtfeldman/seamless-immutable)**  
冻结的不可变数组/对象，向后兼容 JS

```js
const array = Immutable(['totally', 'immutable', { a: 42 }])
array[0] = 'edited' // does nothing
```

**[planttheidea/crio](https://github.com/planttheidea/crio)**  
具有 API 的不可变 JS 对象

```js
const foo = crio(['foo'])
const fooBar = foo.push('bar') // new array: ['foo', 'bar']
```

**[aearly/icepick](https://github.com/aearly/icepick)**  
用于将冻结的 JS 对象视为持久不可变集合的实用程序。

```js
const newObj = icepick.assocIn({ c: { d: 'bar' } }, ['c', 'd'], 'baz')
const obj3 = icepicke.merge(obj1, obj2)
```

<a id="immutable-update-utilities"></a>

#### 不可变更新（Immutable Update）实用程序

**[mweststrate/immer](https://github.com/mweststrate/immer)**  
运用代理使用普通的更新代码进行不可变更新

```js
const nextState = produce(baseState, draftState => {
  draftState.push({ todo: 'Tweet about it' })
  draftState[1].done = true
})
```

**[kolodny/immutability-helper](https://github.com/kolodny/immutability-helper)**  
react-addons-update 的直接替代品

```js
const newData = update(myData, {
  x: { y: { z: { $set: 7 } } },
  a: { b: { $push: [9] } }
})
```

**[mariocasciaro/object-path-immutable](https://github.com/mariocasciaro/object-path-immutable)**  
更简单的替代 immutability-helpers 和 Immutable.js 的库

```js
const newObj = immutable(obj)
  .set('a.b', 'f')
  .del(['a', 'c', 0])
  .value()
```

**[debitoor/dot-prop-immutable](https://github.com/debitoor/dot-prop-immutable)**  
dot-prop 库的不可变（Immutable）版本，带有一些扩展

```js
const newState = dotProp.set(state, `todos.${index}.complete`, true)
const endOfArray = dotProp.get(obj, 'foo.$end')
```

<a id="immutable-redux-interop"></a>

#### Immutable/Redux 互操作

**[gajus/redux-immutable](https://github.com/gajus/redux-immutable)**  
与 Immutable.js Maps 一起使用的 combineReducers 等价物

```js
const initialState = Immutable.Map()
const rootReducer = combineReducers({})
const store = createStore(rootReducer, initialState)
```

**[eadmundo/redux-seamless-immutable](https://github.com/eadmundo/redux-seamless-immutable)**  
与 combineReducers 等效，与 seamless-immutable value 一起使用

```js
import { combineReducers } from 'redux-seamless-immutable';
const rootReducer = combineReducers({ userReducer, posts
```

<a id="side-effects"></a>

## 副作用（Side Effects）

<a id="widely-used"></a>

#### 广泛使用

**[gaearon/redux-thunk](https://github.com/gaearon/redux-thunk)**  
调度（dispatch）函数，调用并将 `dispatch` 和 `getState` 作为参数。 这充当了 AJAX 调用和其他异步行为的方法。

**适用于**: 入门、简单的异步和复杂的同步逻辑。

```js
function fetchData(someValue) {
    return (dispatch, getState) => {
        dispatch({type : "REQUEST_STARTED"});

        myAjaxLib.post("/someEndpoint", {data : someValue})
            .then(response => dispatch({type : "REQUEST_SUCCEEDED", payload : response})
            .catch(error => dispatch({type : "REQUEST_FAILED", error : error});
    };
}

function addTodosIfAllowed(todoText) {
    return (dispatch, getState) => {
        const state = getState();

        if(state.todos.length < MAX_TODOS) {
            dispatch({type : "ADD_TODO", text : todoText});
        }
    }
}
```

**[redux-saga/redux-saga](https://github.com/redux-saga/redux-saga)**  
使用同步查找生成器函数处理异步逻辑。 Sagas 返回 effect 的描述， 这些 effect 由 saga 中间件执行，并且像 JS 应用程序的“后台线程”。

**适用于**: 复杂的异步逻辑，解耦的工作流程

```js
function* fetchData(action) {
  const { someValue } = action
  try {
    const response = yield call(myAjaxLib.post, '/someEndpoint', {
      data: someValue
    })
    yield put({ type: 'REQUEST_SUCCEEDED', payload: response })
  } catch (error) {
    yield put({ type: 'REQUEST_FAILED', error: error })
  }
}

function* addTodosIfAllowed(action) {
  const { todoText } = action
  const todos = yield select(state => state.todos)

  if (todos.length < MAX_TODOS) {
    yield put({ type: 'ADD_TODO', text: todoText })
  }
}
```

**[redux-observable/redux-observable](https://github.com/redux-observable/redux-observable)**

使用称为 “epics” 的 RxJS 可观察链处理异步逻辑。
撰写和取消异步操作以创建副作用等。

**适用于**: 复杂的异步逻辑，解耦的工作流程

```js
const loginRequestEpic = action$ =>
  action$
    .ofType(LOGIN_REQUEST)
    .mergeMap(({ payload: { username, password } }) =>
      Observable.from(postLogin(username, password))
        .map(loginSuccess)
        .catch(loginFailure)
    )

const loginSuccessfulEpic = action$ =>
  action$
    .ofType(LOGIN_SUCCESS)
    .delay(2000)
    .mergeMap(({ payload: { msg } }) => showMessage(msg))

const rootEpic = combineEpics(loginRequestEpic, loginSuccessfulEpic)
```

**[redux-loop/redux-loop](https://github.com/redux-loop/redux-loop)**

Elm 体系结构的一个端口，用于 Redux，允许您通过从 Reducer 返回它们来自然而纯粹地对您的 effect 进行排序。 reducer 现在返回状态值和副作用描述。

**适用于**: 试图尽可能地像 Elm 一样使用 Redux + JS

```js
export const reducer = (state = {}, action) => {
  switch (action.type) {
    case ActionType.LOGIN_REQUEST:
      const { username, password } = action.payload
      return loop(
        { pending: true },
        Effect.promise(loginPromise, username, password)
      )
    case ActionType.LOGIN_SUCCESS:
      const { user, msg } = action.payload
      return loop(
        { pending: false, user },
        Effect.promise(delayMessagePromise, msg, 2000)
      )
    case ActionType.LOGIN_FAILURE:
      return { pending: false, err: action.payload }
    default:
      return state
  }
}
```

**[jeffbski/redux-logic](https://github.com/jeffbski/redux-logic)**

使用 observable 构建的副作用 lib，但允许使用回调、promises、async/await 或 observables。 提供 action 的声明性处理。

**适用于**: 非常分离的异步逻辑

```js
const loginLogic = createLogic({
  type: Actions.LOGIN_REQUEST,

  process({ getState, action }, dispatch, done) {
    const { username, password } = action.payload

    postLogin(username, password)
      .then(
        ({ user, msg }) => {
          dispatch(loginSucceeded(user))

          setTimeout(() => dispatch(showMessage(msg)), 2000)
        },
        err => dispatch(loginFailure(err))
      )
      .then(done)
  }
})
```

<a id="promises"></a>

#### Promises

**[acdlite/redux-promise](https://github.com/acdlite/redux-promise)**  
调度（Dispatch） promise 作为 action 的有效负载，并在 promise resolve 或 reject 时调度 FSA 兼容（FSA-compliant）的 action 。

```js
dispatch({ type: 'FETCH_DATA', payload: myAjaxLib.get('/data') })
// will dispatch either {type : "FETCH_DATA", payload : response} if resolved,
// or dispatch {type : "FETCH_DATA", payload : error, error : true} if rejected
```

**[lelandrichardson/redux-pack](https://github.com/lelandrichardson/redux-pack)**  
明智的、声明性的、基于约定的处理 promise，可以指导用户朝着良好的方向发展而不会暴露出全部的调度(dispatch)功能。

```js
dispatch({type : "FETCH_DATA", payload : myAjaxLib.get("/data") });

// in a reducer:
        case "FETCH_DATA": =
            return handle(state, action, {
                start: prevState => ({
                  ...prevState,
                  isLoading: true,
                  fooError: null
                }),
                finish: prevState => ({ ...prevState, isLoading: false }),
                failure: prevState => ({ ...prevState, fooError: payload }),
                success: prevState => ({ ...prevState, foo: payload }),
            });
```

<a id="middleware"></a>

## 中间件

<a id="networks-and-sockets"></a>

#### Networks and Sockets

**[svrcekmichal/redux-axios-middleware](https://github.com/svrcekmichal/redux-axios-middleware)**  
使用 Axios 获取数据并调度（dispatch）启动 / 成功 / 失败 action。

```js
export const loadCategories() => ({ type: 'LOAD', payload: { request : { url: '/categories'} } });
```

**[agraboso/redux-api-middleware](https://github.com/agraboso/redux-api-middleware)**  
通过读取 API 调用 action、获取数据和调度 FSA

```js
const fetchUsers = () => ({
  [CALL_API]: {
    endpoint: 'http://www.example.com/api/users',
    method: 'GET',
    types: ['REQUEST', 'SUCCESS', 'FAILURE']
  }
})
```

**[itaylor/redux-socket.io](https://github.com/itaylor/redux-socket.io)**  
socket.io 和 redux 之间的固定连接器。

```js
const store = createStore(reducer, applyMiddleware(socketIoMiddleware))
store.dispatch({ type: 'server/hello', data: 'Hello!' })
```

**[tiberiuc/redux-react-firebase](https://github.com/tiberiuc/redux-react-firebase)**  
Firebase、React 和 Redux 之间的集成。

<a id="async-behavior"></a>

#### 异步行为

**[rt2zz/redux-action-buffer](https://github.com/rt2zz/redux-action-buffer)**  
将所有操作缓冲到队列中，直到满足断路器条件，此时释放队列

**[wyze/redux-debounce](https://github.com/wyze/redux-debounce)**  
符合 FSA 标准的 Redux 中间件可以实现 action 的防抖。

**[mathieudutour/redux-queue-offline](https://github.com/mathieudutour/redux-queue-offline)**  
离线时将 action 加入队列，并在重新联机时 dispatch 它们。

<a id="analytics"></a>

#### 分析

**[rangle/redux-beacon](https://github.com/rangle/redux-beacon)**  
与任何分析服务集成，可以在离线时跟踪，并将分析逻辑与应用逻辑分离。

**[hyperlab/redux-insights](https://github.com/hyperlab/redux-insights)**  
使用简单的 API 进行分析和跟踪，以编写自己的适配器

**[markdalgleish/redux-analytics](https://github.com/markdalgleish/redux-analytics)**  
使用 meta 分析值监视 Flux 标准操作并处理它们

<a id="entities-and-collections"></a>

## 实体和集合

**[tommikaikkonen/redux-orm](https://github.com/tommikaikkonen/redux-orm)**  
一个简单的不可变 ORM，用于管理 Redux sotre 中的关系数据。

**[Versent/redux-crud](https://github.com/Versent/redux-crud)**  
基于约定的 action 和 reducer，用于处理 CRUD 逻辑

**[kwelch/entities-reducer](https://github.com/kwelch/entities-reducer)**  
处理 Normalizr 数据的高阶 reducer

**[amplitude/redux-query](https://github.com/amplitude/redux-query)**  
声明与组件共存的数据依赖关系，在组件 mount 时运行查询、执行乐观更新以及使用 Redux action 触发服务器更改。

**[cantierecreativo/redux-bees](https://github.com/cantierecreativo/redux-bees)**  
声明性 JSON-API 交互，用于规范化数据，与可以运行查询的 React 高阶组件（HOC）交互

**[GetAmbassador/redux-clerk](https://github.com/GetAmbassador/redux-clerk)**  
具有规范化、乐观更新、同步/异步 action creator、 selector 和可扩展 reducer 的异步 CRUD 处理。

**[shoutem/redux-io](https://github.com/shoutem/redux-io)**  
具有异步 CRUD、规范化、乐观更新、缓存、数据状态和错误处理的 JSON-API 抽象。

**[jmeas/redux-resource](https://github.com/jmeas/redux-resource)**  
用于管理“资源”的小而强大的系统：持久存储到远程服务器的数据。

<a id="component-state-and-encapsulation"></a>

## 组件 state 和封装

**[tonyhb/redux-ui](https://github.com/tonyhb/redux-ui)**  
用于 UI state 的“块级范围”。 装饰组件以声明数据字段，使这些数据字段成为 props 并可由嵌套子项更新。

```js
@ui({
  key: 'some-name',
  state: { uiVar1: '', uiVar2: (props, state) => state.someValue },
  reducer: (state, action) => {}
})
class YourComponent extends React.Component {}
```

**[threepointone/redux-react-local](https://github.com/threepointone/redux-react-local)**  
Redux 中的本地组件 state，用于处理组件 action

```js
@local({
  ident: 'counter', initial: 0, reducer : (state, action) => action.me ? state + 1 : state }
})
class Counter extends React.Component {
```

**[epeli/lean-redux](https://github.com/epeli/lean-redux)**  
使 Redux 中的组件的 state 与 setState 一样简单

```js
const DynamicCounters = connectLean(
    scope: "dynamicCounters",
    getInitialState() => ({counterCount : 1}),
    addCounter, removeCounter
)(CounterList);
```

**[ioof-holdings/redux-subspace](https://github.com/ioof-holdings/redux-subspace)**  
为分离的微前端创建独立的 “sub-store”，集成了 React、sagas 和 observables

```js
const reducer = combineReducers({
  subApp1: namespaced('subApp1')(counter),
  subApp2: namespaced('subApp2')(counter)
})

const subApp1Store = subspace(state => state.subApp1, 'subApp1')(store)
const subApp2Store = subspace(state => state.subApp2, 'subApp2')(store)

subApp1Store.dispatch({ type: 'INCREMENT' })
console.log('store state:', store.getState()) // { "subApp1": { value: 2 }, "subApp2": { value: 1 } }
```

**[DataDog/redux-doghouse](https://github.com/DataDog/redux-doghouse)**  
旨在通过将 actIon 和 reducer 作用于组件的特定实例，使 Redux 更易于构建可重用组件。

```js
const scopeableActions = new ScopedActionFactory(actionCreators)
const actionCreatorsScopedToA = scopeableActions.scope('a')
actionCreatorsScopedToA.foo('bar') //{ type: SET_FOO, value: 'bar', scopeID: 'a' }

const boundScopeableActions = bindScopedActionFactories(
  scopeableActions,
  store.dispatch
)
const scopedReducers = scopeReducers(reducers)
```

<a id="dev-tools"></a>

## 开发者工具

<a id="debuggers-and-viewers"></a>

#### Debuggers and Viewers

**[reduxjs/redux-devtools](https://github.com/reduxjs/redux-devtools)**

Dan Abramov 最初的 Redux DevTools 实现，专为在应用程序内显示 state 和 time-travel 调试而构建

**[zalmoxisus/redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension)**

Mihail Diordiev 的浏览器扩展，捆绑了多个 state 监视器视图，并增加了与浏览器自己的开发工具的集成

**[infinitered/reactotron](https://github.com/infinitered/reactotron)**

用于检查 React 和 React Native 应用程序的跨平台 Electron 应用程序，包括应用程序状态、API 请求、性能、错误、saga 和操作调度。

<a id="DevTools Monitors"></a>

#### 开发者工具监视器

**[Log Monitor](https://github.com/reduxjs/redux-devtools-log-monitor)**  
Redux DevTools 默认监视器，提供树状视图

**[Dock Monitor](https://github.com/reduxjs/redux-devtools-dock-monitor)**  
Redux DevTools 监视器的可调整大小和可移动的底座

**[Slider Monitor](https://github.com/calesce/redux-slider-monitor)**  
Redux DevTools 的自定义监视器，用于重放录制的 Redux 操作

**[Inspector](https://github.com/alexkuz/redux-devtools-inspector)**  
Redux DevTools 的自定义监视器，可让您过滤操作，检查差异，并在状态中固定深层路径以观察其更改

**[Diff Monitor](https://github.com/whetstone/redux-devtools-diff-monitor)**  
Redux DevTools 的监视器，用于在 action 之间区分 Redux store 突变

**[Filterable Log Monitor](https://github.com/bvaughn/redux-devtools-filterable-log-monitor/)**  
树状可筛选视图的 Redux DevTools 监视器

**[Chart Monitor](https://github.com/romseguy/redux-devtools-chart-monitor)**  
Redux DevTools 的图表监视器

**[Filter Actions](https://github.com/zalmoxisus/redux-devtools-filter-actions)**  
Redux DevTools 可组合监视器，具有过滤 action 的能力

<a id="logging"></a>

#### 日志

**[evgenyrodionov/redux-logger](https://github.com/evgenyrodionov/redux-logger)**  
记录显示 action、state 和差异的中间件

**[inakianduaga/redux-state-history](https://github.com/inakianduaga/redux-state-history)**  
提供 time-travel 和高效的 action 录制功能，包括导入 / 导出 action 日志和 action 播放的增强器。

**[joshwcomeau/redux-vcr](https://github.com/joshwcomeau/redux-vcr)**  
实时记录和重播用户会话

**[socialtables/redux-unhandled-action](https://github.com/socialtables/redux-unhandled-action)**  
在开发中对改变 state 的 action 发出警告

<a id="mutation-detection"></a>

#### 突变检测

**[leoasis/redux-immutable-state-invariant](https://github.com/leoasis/redux-immutable-state-invariant)**  
当您尝试在调度（dispatch）内或调度（dispatch）之间改变状态时抛出错误的中间件。

**[flexport/mutation-sentinel](https://github.com/flexport/mutation-sentinel)**  
帮助您在运行时深入检测突变并在代码库中强制实现不变性(immutability)。

**[mmahalwy/redux-pure-connect](https://github.com/mmahalwy/redux-pure-connect)**  
检查并记录 react-redux 的 connect 方法是否通过 `mapState` 函数创建了不纯的 props。

<a id="testing"></a>

## 测试

**[arnaudbenard/redux-mock-store](https://github.com/arnaudbenard/redux-mock-store)**  
一个模拟 store，用于将 dispatched action 保存在数组中以进行断言

**[Workable/redux-test-belt](https://github.com/Workable/redux-test-belt)**  
扩展 store API 以使其更容易断言、隔离和操纵 store

**[conorhastings/redux-test-recorder](https://github.com/conorhastings/redux-test-recorder)**  
根据应用程序中的操作自动生成 Reducer 测试的中间件

**[wix/redux-testkit](https://github.com/wix/redux-testkit)**  
用于测试 Redux 项目的完整且固定的测试工具包（Reducer、selectors、actions、thunk）

**[jfairbank/redux-saga-test-plan](https://github.com/jfairbank/redux-saga-test-plan)**  
使 saga 的集成和单元测试变得轻而易举

<a id="routing"></a>

## 路由

**[ReactTraining/react-router-redux](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux)**  
保持 state 与路由同步

**[FormidableLabs/redux-little-router](https://github.com/FormidableLabs/redux-little-router)**  
Redux 应用程序的一个小型路由，可以与 URL 进行通信

**[faceyspacey/redux-first-router](https://github.com/faceyspacey/redux-first-router)**  
无缝 Redux-first 路由。 在 state 中考虑您的应用，而不是在路由或组件中，同时保持与地址栏同步。 一切都是 state。 连接您的组件，只需调度（dispatch）标准的 action。

<a id="forms"></a>

## Forms

**[erikras/redux-form](https://github.com/erikras/redux-form)**  
一个功能齐全的库，可以使 React HTML 表单在 Redux 中存储其状态。

**[davidkpiano/react-redux-form](https://github.com/davidkpiano/react-redux-form)**  
React Redux Form 是一个 reducer creator 和 action creator 的集合，它们使 React 和 Redux 可以简单而高效地实现最复杂和自定义的 form。

<a id="higher-level-abstractions"></a>

## 更高级别的抽象

**[keajs/kea](https://github.com/keajs/kea)**  
Redux、Redux-Saga 和 Reselect 的抽象。 为您的应用程序的 action、reducer、selector 和 saga 提供框架。 它赋予 Redux 权限，使其与 setState 一样简单。 它减少了样板和冗余，同时保持了可组合性。

**[jumpsuit/jumpstate](https://github.com/jumpsuit/jumpstate)**  
基于 Redux 的简化版本。 没有 action creator 或显式调度（dispatch），具有内置的简单副作用（side effect）系统。

**[TheComfyChair/redux-scc](https://github.com/TheComfyChair/redux-scc)**  
采用定义的结构并使用“行为”来创建一组 actions、reducer responses 和 selectors。

**[Bloomca/redux-tiles](https://github.com/Bloomca/redux-tiles)**  
在 Redux 之上提供最小的抽象，以实现轻松的可组合性、简单的异步请求和可靠的可测试性。

<a id="community-conventions"></a>

## 社区公约

**[Flux Standard Action](https://github.com/acdlite/flux-standard-action)**  
Flux action object 的人性化标准

**[Canonical Reducer Composition](https://github.com/gajus/canonical-reducer-composition)**  
嵌套 reducer 组合的固定标准

**[Ducks: Redux Reducer Bundles](https://github.com/erikras/ducks-modular-redux)**  
捆绑 reducer、action type 和 action 的提议
