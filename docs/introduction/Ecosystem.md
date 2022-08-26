---
id: ecosystem
title: 生态
description: '简介 > 生态: 流行、推荐、和有趣的 Redux 周边库'
hide_title: false
---

# 生态

Redux 是一个小型库，但是它的设计和 API 都是经过精心选择的，以至于衍生出工具和扩展的生态系统，并且社区中存在各种各样有用的插件、库和工具。虽然你无需使用任何这些插件就可以使用Redux，但它们可以帮助你更轻松地实现功能并解决应用程序中的问题。

与Redux相关的库，插件和工具的广泛目录
请访问 [Redux Ecosystem Links](https://github.com/markerikson/redux-ecosystem-links) 了解更全面的 Redux 库、插件、和工具的目录。此外，[React/Redux Links](https://github.com/markerikson/react-redux-links) 包含了学习 React 或 Redux 的教程和其他有用资料。

此页面列出了一些 Redux 维护人员亲自审核的或在社区中被广泛使用的 Redux 相关插件。不要让这阻止你尝试其他方法！生态系统增长太快，我们时间有限，无法洞察一切。考虑这些是“内部人员挑选”，如果您使用 Redux 构建了一些很棒的东西，请毫不犹豫地提交 PR。

## 目录

- [生态](#生态)
  - [目录](#目录)
  - [与其他框架绑定](#library-integration-and-bindings)
  - [Reducers](#reducers)
    - [Reducer Combination](#reducer-combination)
    - [Reducer Composition](#reducer-composition)
    - [高阶 Reducers](#higher-order-reducers)
  - [Actions](#actions)
  - [Utilities](#utilities)
  - [Store](#store)
    - [Change Subscriptions](#change-subscriptions)
    - [Batching](#batching)
    - [Persistence](#persistence)
  - [Immutable Data](#immutable-data)
    - [Data Structures](#data-structures)
    - [Immutable Update Utilities](#immutable-update-utilities)
    - [Immutable/Redux Interop](#immutableredux-interop)
  - [副作用（Side Effects）](#side-effects)
    - [广泛使用](#widely-used)
    - [Promises](#promises)
  - [Middleware](#middleware)
    - [网络请求](#networks-and-sockets)
    - [异步操作](#async-behavior)
    - [Analytics](#analytics)
  - [实体与集合](#entities-and-collections)
  - [组件 State 与封装](#component-state-and-encapsulation)
  - [开发者工具](#dev-tools)
    - [Debuggers and Viewers](#debuggers-and-viewers)
    - [开发者工具监听器](#devtools-monitors)
    - [Logging](#logging)
    - [Mutation Detection](#mutation-detection)
  - [测试](#testing)
  - [路由](#routing)
  - [表单](#forms)
  - [高阶抽象](#higher-level-abstractions)
  - [社区约定模式](#community-conventions)

## 与其他框架绑定

**[reduxjs/react-redux](https://github.com/reduxjs/react-redux)** <br />
官方 Redux 与 React的绑定，由Redux团队维护

**[angular-redux/ng-redux](https://github.com/angular-redux/ng-redux)** <br />
Redux 与 Angular 1 的绑定

**[ember-redux/ember-redux](https://github.com/ember-redux/ember-redux)** <br />
Redux 与 Ember 的绑定

**[glimmer-redux/glimmer-redux](https://github.com/glimmer-redux/glimmer-redux)** <br />
Redux 与 Ember's Glimmer组件引擎的绑定

**[tur-nr/polymer-redux](https://github.com/tur-nr/polymer-redux)** <br />
Redux 与 Polymer 的绑定

**[lastmjs/redux-store-element](https://github.com/lastmjs/redux-store-element)**
Redux 与 Custom Elements 的绑定

## Reducers

#### Reducer Combination

**[ryo33/combineSectionReducers](https://gitlab.com/ryo33/combine-section-reducers)** <br />
`combineReducers` 的扩展版本, 它允许将`state` 作为第三个参数传递给所有的 slice reducers.

**[KodersLab/topologically-combine-reducers](https://github.com/KodersLab/topologically-combine-reducers)** <br />
`combineReducers` 的变体，一种通过依赖关系追溯数据值的方法

```js
var masterReducer = topologicallyCombineReducers(
  { auth, users, todos },
  // define the dependency tree
  { auth: ['users'], todos: ['auth'] }
)
```

#### Reducer Composition

**[acdlite/reduce-reducers](https://github.com/acdlite/reduce-reducers)** <br />
提供了同级的reducers的顺序集合

```js
const combinedReducer = combineReducers({ users, posts, comments })
const rootReducer = reduceReducers(combinedReducer, otherTopLevelFeatureReducer)
```

**[mhelmer/redux-xforms](https://github.com/mhelmer/redux-xforms)** <br />
可组合的reducer transformers（高阶reducer）的集合

```js
const createByFilter = (predicate, mapActionToKey) =>
  compose(
    withInitialState({}), // inject initial state as {}
    withFilter(predicate), // let through if action has filterName
    updateSlice(mapActionToKey), // update a single key in the state
    isolateSlice(mapActionToKey) // run the reducer on a single state slice
  )
```

**[adrienjt/redux-data-structures](https://github.com/adrienjt/redux-data-structures)** <br />
通用数据结构的Reducer工厂函数: counters, maps, lists (queues, stacks), sets

```js
const myCounter = counter({
  incrementActionTypes: ['INCREMENT'],
  decrementActionTypes: ['DECREMENT']
})
```

#### 高阶 Reducers

**[omnidan/redux-undo](https://github.com/omnidan/redux-undo)** <br />
为reducers提供敏捷的撤销/重做和操作历史记录的功能

**[omnidan/redux-ignore](https://github.com/omnidan/redux-ignore)** <br />
通过数组或过滤函数忽略 redux actions

**[omnidan/redux-recycle](https://github.com/omnidan/redux-recycle)** <br />
重置某些 actions 的 redux 状态

**[ForbesLindesay/redux-optimist](https://github.com/ForbesLindesay/redux-optimist)** <br />
一个 reducer 的加强版，用于启动未知类型的乐观更新

## Actions

**[reduxactions/redux-actions](https://github.com/reduxactions/redux-actions)** <br />
用于 Redux 的 Flux Standard Action 实用程序

```js
const increment = createAction('INCREMENT')
const reducer = handleActions({ [increment]: (state, action) => state + 1 }, 0)
const store = createStore(reducer)
store.dispatch(increment())
```

**[BerkeleyTrue/redux-create-types](https://github.com/BerkeleyTrue/redux-create-types)** <br />
基于命名空间创建标准和异步 action 类型

```js
export const types = createTypes(
  ['openModal', createAsyncTypes('fetch')],
  'app'
)
// { openModal : "app.openModal", fetch : { start : "app.fetch.start", complete: 'app.fetch.complete' } }
```

**[maxhallinan/kreighter](https://github.com/maxhallinan/kreighter)** <br />
基于类型和预期字段生成 action creator

```js
const formatTitle = (id, title) => ({
  id,
  title: toTitleCase(title)
})
const updateBazTitle = fromType('UPDATE_BAZ_TITLE', formatTitle)
updateBazTitle(1, 'foo bar baz')
// -> { type: 'UPDATE_BAZ_TITLE', id: 1, title: 'Foo Bar Baz', }
```

## Utilities

**[reduxjs/reselect](https://github.com/reduxjs/reselect)** <br />
创建可组合的 memoized selector 函数，以有效地从 store state 中派生数据

```js
const taxSelector = createSelector(
  [subtotalSelector, taxPercentSelector],
  (subtotal, taxPercent) => subtotal * (taxPercent / 100)
)
```

**[paularmstrong/normalizr](https://github.com/paularmstrong/normalizr)** <br />
根据 schema 规范嵌套 JSON

```js
const user = new schema.Entity('users')
const comment = new schema.Entity('comments', { commenter: user })
const article = new schema.Entity('articles', {
  author: user,
  comments: [comment]
})
const normalizedData = normalize(originalData, article)
```

**[planttheidea/selectorator](https://github.com/planttheidea/selectorator)** <br />
common selector 用例的 Reselect 抽象

```js
const getBarBaz = createSelector(
  ['foo.bar', 'baz'],
  (bar, baz) => `${bar} ${baz}`
)
getBarBaz({ foo: { bar: 'a' }, baz: 'b' }) // "a b"
```

## Store

#### Change Subscriptions

**[jprichardson/redux-watch](https://github.com/jprichardson/redux-watch)** <br />
监听关键路径或 selectors 的 state 的变化

```js
let w = watch(() => mySelector(store.getState()))
store.subscribe(
  w((newVal, oldVal) => {
    console.log(newval, oldVal)
  })
)
```

**[ashaffer/redux-subscribe](https://github.com/ashaffer/redux-subscribe)** <br />
集中订阅路径中的 state 变化

```js
store.dispatch( subscribe("users.byId.abcd", "subscription1", () => {} );
```

#### Batching

**[tappleby/redux-batched-subscribe](https://github.com/tappleby/redux-batched-subscribe)** <br />
用于订阅通知的防抖的 Store enhancer

```js
const debounceNotify = _.debounce(notify => notify())
const store = createStore(
  reducer,
  initialState,
  batchedSubscribe(debounceNotify)
)
```

**[manaflair/redux-batch](https://github.com/manaflair/redux-batch)** <br />
允许调度 actions 数组的 Store enhancer

```js
const store = createStore(reducer, reduxBatch)
store.dispatch([{ type: 'INCREMENT' }, { type: 'INCREMENT' }])
```

**[laysent/redux-batch-actions-enhancer](https://github.com/laysent/redux-batch-actions-enhancer)** <br />
接受批量处理 actions 的Store enhancer

```js
const store = createStore(reducer, initialState, batch().enhancer)
store.dispatch(createAction({ type: 'INCREMENT' }, { type: 'INCREMENT' }))
```

**[tshelburne/redux-batched-actions](https://github.com/tshelburne/redux-batched-actions)** <br />
批量处理 actions 的高阶 reducer

```js
const store = createStore(enableBatching(reducer), initialState)
store.dispatch(batchActions([{ type: 'INCREMENT' }, { type: 'INCREMENT' }]))
```

#### Persistence

**[rt2zz/redux-persist](https://github.com/rt2zz/redux-persist)** <br />
持久化和补充 Redux store，有许多可扩展的选项

```js
const store = createStore(reducer, autoRehydrate())
persistStore(store)
```

**[react-stack/redux-storage](https://github.com/react-stack/redux-storage)** <br />
具有灵活后端的 Redux 持久层

```js
const reducer = storage.reducer(combineReducers(reducers))
const engine = createEngineLocalStorage('my-save-key')
const storageMiddleware = storage.createMiddleware(engine)
const store = createStore(reducer, applyMiddleware(storageMiddleware))
```

**[redux-offline/redux-offline](https://github.com/redux-offline/redux-offline)** <br />
离线优先（Offline-First）应用程序的持久化存储，支持乐观 UI

```js
const store = createStore(reducer, offline(offlineConfig))
store.dispatch({
  type: 'FOLLOW_USER_REQUEST',
  meta: { offline: { effect: {}, commit: {}, rollback: {} } }
})
```

## Immutable Data

**[ImmerJS/immer](https://github.com/immerjs/immer)** <br />
使用代理的普通可变代码的不可变更新

```js
const nextState = produce(baseState, draftState => {
  draftState.push({ todo: 'Tweet about it' })
  draftState[1].done = true
})
```

## 副作用

#### 广泛使用

**[gaearon/redux-thunk](https://github.com/gaearon/redux-thunk)** <br />
Dispatch 函数，它们被调用并给出 `dispatch` 和 `getState` 作为参数。 这是一个 AJAX 调用和其他异步行为的漏洞。

**Best for**: 入门，简单的异步和复杂的同步逻辑。

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

**[listenerMiddleware (Redux Toolkit)](https://redux-toolkit.js.org/api/createListenerMiddleware)** <br />
listenerMiddleware 旨在成为更广泛使用的 Redux 异步中间件（如 sagas 和 observables）的轻量级替代品。 虽然在复杂程度和概念上类似于 thunk，但它可以用来复制一些常见的 saga 使用模式。

```js
listenerMiddleware.startListening({
  matcher: isAnyOf(action1, action2, action3),
  effect: (action, listenerApi) => {
    const user = selectUserDetails(listenerApi.getState())

    const { specialData } = action.meta

    analyticsApi.trackUsage(action.type, user, specialData)
  }
})
```

**[redux-saga/redux-saga](https://github.com/redux-saga/redux-saga)** <br />
使用 synchronous-looking 的生成器函数处理异步逻辑。 Sagas 返回效果的描述，由 saga 中间件执行，就像 JS 应用程序的“后台线程”一样。

**Best for**: 复杂的异步逻辑，解耦工作流程

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

使用称为“史诗”的 RxJS 可观察链处理异步逻辑。
编写和取消异步操作以创建副作用等。

**Best for**: 复杂的异步逻辑，解耦工作流程

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

一个 Elm 架构到 Redux 的端口，它允许你通过从 reducers 返回的 effects 来自然而纯粹地对 effects 进行排序。 Reducers 现在返回 state 值和副作用描述。

**Best for**: 在 Redux+JS 中尽可能地像 Elm

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

使用 observables 构建的副作用库，允许使用回调、promise、async/await 或 observables。 提供 actions 的声明式处理。

**Best for**: 非常解耦的异步逻辑

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

#### Promises

**[acdlite/redux-promise](https://github.com/acdlite/redux-promise)** <br />
将 Promise 作为 action payloads 来 dispatch，并在 Promise 解决或拒绝后 dispatch FSA-compliant actions。

```js
dispatch({ type: 'FETCH_DATA', payload: myAjaxLib.get('/data') })
// will dispatch either {type : "FETCH_DATA", payload : response} if resolved,
// or dispatch {type : "FETCH_DATA", payload : error, error : true} if rejected
```

**[lelandrichardson/redux-pack](https://github.com/lelandrichardson/redux-pack)** <br />
合理的、可声明的、基于约定的 promise 处理，在不暴露 dispatch 的全部功能的情况下引导着用户朝着好的方向发展。

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

## Middleware

#### 网络请求

**[svrcekmichal/redux-axios-middleware](https://github.com/svrcekmichal/redux-axios-middleware)** <br />
使用 Axios 获取数据并 dispatch 开始/成功/失败 actions

```js
export const loadCategories() => ({ type: 'LOAD', payload: { request : { url: '/categories'} } });
```

**[agraboso/redux-api-middleware](https://github.com/agraboso/redux-api-middleware)** <br />
读取 API 调用 actions，fetch、dispatch FSAs

```js
const fetchUsers = () => ({
  [CALL_API]: {
    endpoint: 'http://www.example.com/api/users',
    method: 'GET',
    types: ['REQUEST', 'SUCCESS', 'FAILURE']
  }
})
```

**[itaylor/redux-socket.io](https://github.com/itaylor/redux-socket.io)** <br />
socket.io 和 redux 之间的一个固定的连接器。

```js
const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware.concat(socketIoMiddleware)
})
store.dispatch({ type: 'server/hello', data: 'Hello!' })
```

**[tiberiuc/redux-react-firebase](https://github.com/tiberiuc/redux-react-firebase)** <br />
Firebase、React 和 Redux 之间的集成。

#### 异步操作

**[rt2zz/redux-action-buffer](https://github.com/rt2zz/redux-action-buffer)** <br />
将所有 actions 缓冲到队列中，直到满足中断条件时队列被释放。

**[wyze/redux-debounce](https://github.com/wyze/redux-debounce)** <br />
Redux 的 FSA-compliant middleware，用于 actions 的防抖。

**[mathieudutour/redux-queue-offline](https://github.com/mathieudutour/redux-queue-offline)** <br />
离线时队列 actions 会重新在线被 dispatch。

#### 分析

**[rangle/redux-beacon](https://github.com/rangle/redux-beacon)** <br />
集成任何分析服务，可以在离线时进行跟踪，并将分析逻辑与应用程序逻辑分离。

**[markdalgleish/redux-analytics](https://github.com/markdalgleish/redux-analytics)** <br />
使用元分析值监视 Flux Standard Actions 并对其进行处理。

## 实体与集合

**[tommikaikkonen/redux-orm](https://github.com/tommikaikkonen/redux-orm)** <br />
一个简单的 immutable ORM，用于管理 Redux store 中的关系数据。

**[Versent/redux-crud](https://github.com/Versent/redux-crud)** <br />
CRUD 逻辑中基于约定的 action 和 reducer

**[kwelch/entities-reducer](https://github.com/kwelch/entities-reducer)** <br />
处理 Normalizr 数据的高阶 reducer。

**[amplitude/redux-query](https://github.com/amplitude/redux-query)** <br />
声明与组件并置的数据依赖关系，在组件挂载时运行查询，执行乐观更新，并使用 Redux 操作触发服务器更改。

**[cantierecreativo/redux-bees](https://github.com/cantierecreativo/redux-bees)** <br />
声明 JSON-API 交互，规范化数据，使用可运行查询的 React HOC。

**[GetAmbassador/redux-clerk](https://github.com/GetAmbassador/redux-clerk)** <br />
异步 CRUD 处理与规范化、乐观更新、同步/异步 action creators、selectors 和可扩展 reducer。

**[shoutem/redux-io](https://github.com/shoutem/redux-io)** <br />
具有异步 CRUD、规范化、乐观更新、缓存、数据状态和错误处理的 JSON-API 抽象。

**[jmeas/redux-resource](https://github.com/jmeas/redux-resource)** <br />
用于管理“资源”的小型但功能强大的系统：远程服务器的持久化数据。

## 组件 State 与封装

**[threepointone/redux-react-local](https://github.com/threepointone/redux-react-local)** <br />
Redux 中的本地组件 state，用于处理组件 actions

```js
@local({
  ident: 'counter', initial: 0, reducer : (state, action) => action.me ? state + 1 : state }
})
class Counter extends React.Component {
```

**[epeli/lean-redux](https://github.com/epeli/lean-redux)** <br />
使 Redux 中的组件 state 像 setState 一样简单

```js
const DynamicCounters = connectLean(
    scope: "dynamicCounters",
    getInitialState() => ({counterCount : 1}),
    addCounter, removeCounter
)(CounterList);
```

**[DataDog/redux-doghouse](https://github.com/DataDog/redux-doghouse)** <br />
通过将 action 和 reducer 限定为组件的特定实例，使得用 Redux 构建可重用组件更容易。

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

## 开发者工具

#### Debuggers and Viewers

**[reduxjs/redux-devtools](https://github.com/reduxjs/redux-devtools)**

Dan Abramov 最初实现的 Redux DevTools，专为展示应用内 state 和时间旅行调试而构建

**[zalmoxisus/redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension)**

Mihail Diordiev 的浏览器扩展，它捆绑了多个 state 监视器视图并添加了与浏览器自带开发工具的集成

**[infinitered/reactotron](https://github.com/infinitered/reactotron)**

一个跨平台的 Electron 应用程序，用于检查 React 和 React Native 应用程序，包括应用程序 state、API 请求、性能、错误、sagas 和 action dispatching。

#### 开发者工具监听器

**[Log Monitor](https://github.com/reduxjs/redux-devtools/tree/master/packages/redux-devtools-log-monitor)** <br />
Redux DevTools 的默认监听器，带有树形视图

**[Dock Monitor](https://github.com/reduxjs/redux-devtools/tree/master/packages/redux-devtools-dock-monitor)** <br />
具有可调整大小并且可移动的 dock 的 Redux DevTools 监听器

**[Slider Monitor](https://github.com/calesce/redux-slider-monitor)** <br />
Redux DevTools 的自定义监听器，用于重放 Redux actions 记录

**[Diff Monitor](https://github.com/whetstone/redux-devtools-diff-monitor)** <br />
Redux DevTools 的监听器，用于区分 actions 之间的 Redux store mutations

**[Filterable Log Monitor](https://github.com/bvaughn/redux-devtools-filterable-log-monitor/)** <br />
Redux DevTools 的可过滤树视图监听器

**[Filter Actions](https://github.com/zalmoxisus/redux-devtools-filter-actions)** <br />
Redux DevTools 可组合监听器，具有过滤 actions 的能力

#### 日志

**[evgenyrodionov/redux-logger](https://github.com/evgenyrodionov/redux-logger)** <br />
记录显示 actions、 states、 diffs 的中间件

**[inakianduaga/redux-state-history](https://github.com/inakianduaga/redux-state-history)** <br />
提供时间旅行调试和高效 action 记录功能的增强器，包括 action 日志的导入/导出和 action 回放。

**[joshwcomeau/redux-vcr](https://github.com/joshwcomeau/redux-vcr)** <br />
实时记录和回放用户会话

**[socialtables/redux-unhandled-action](https://github.com/socialtables/redux-unhandled-action)** <br />
在开发中警告没有 state 变化的 action

#### 变更检测

**[leoasis/redux-immutable-state-invariant](https://github.com/leoasis/redux-immutable-state-invariant)** <br />
在一个 dispatch 内或者 dispatch 之间更改 state 的时候抛出错误的中间件。

**[flexport/mutation-sentinel](https://github.com/flexport/mutation-sentinel)** <br />
帮助你在运行时深入检测 mutations，并在代码库中强制执行不变性。

**[mmahalwy/redux-pure-connect](https://github.com/mmahalwy/redux-pure-connect)** <br />
检查并记录 react-redux 的 connect 方法是否传入了不纯 props 的 `mapState` 函数。

## 测试

**[arnaudbenard/redux-mock-store](https://github.com/arnaudbenard/redux-mock-store)** <br />
将已 dispatch 的 actions 保存在数组中来用于断言的 mock store

**[Workable/redux-test-belt](https://github.com/Workable/redux-test-belt)** <br />
扩展 store API 使其更容易断言、隔离和操作 store

**[conorhastings/redux-test-recorder](https://github.com/conorhastings/redux-test-recorder)** <br />
根据应用程序中的 actions 自动生成 reducers tests 的中间件

**[wix/redux-testkit](https://github.com/wix/redux-testkit)** <br />
用于测试 Redux 项目(reducers, selectors, actions, thunks)完整且固定的测试套件

**[jfairbank/redux-saga-test-plan](https://github.com/jfairbank/redux-saga-test-plan)** <br />
使 sagas 的集成和单元测试变得轻而易举

## 路由

**[supasate/connected-react-router](https://github.com/supasate/connected-react-router)**
将 React Router v4+ 的 state 与 Redux store 同步。

**[faceyspacey/redux-first-router](https://github.com/faceyspacey/redux-first-router)** <br />
无缝 Redux-first 路由。在保持地址栏同步的同时，将应用程序视为 states，而不是路由、组件。一切都是 state。连接组件，只需dispatch flux标准 actions。

## 表单

**[erikras/redux-form](https://github.com/erikras/redux-form)** <br />
使 React HTML 表单能够将其 state 存储在 Redux 中的一个功能齐全的库。

**[davidkpiano/react-redux-form](https://github.com/davidkpiano/react-redux-form)** <br />
React Redux Form 是 reducer creators 和 action creators 的集合，简单而高效地使用 React 和 Redux 实现最复杂和自定义的表单。

## 高阶抽象

**[keajs/kea](https://github.com/keajs/kea)** <br />
Redux、Redux-Saga 和 Reselect 的抽象。 提供了应用程序的 actions、reducers、selectors 和 sagas 的框架。 它为 Redux 赋能，使其像 setState 一样简单易用。 它减少了样板和冗余，同时保留了可组合性。

**[TheComfyChair/redux-scc](https://github.com/TheComfyChair/redux-scc)** <br />
采用定义的结构并使用“行为”来创建一组 actions、 reducer 响应、 selectors。

**[Bloomca/redux-tiles](https://github.com/Bloomca/redux-tiles)** <br />
在 Redux 之上提供最小的抽象，以实现简单的可组合性、简单的异步请求和健全的可测试能力。

## 社区公约

**[Flux Standard Action](https://github.com/acdlite/flux-standard-action)** <br />
Flux 中 action 对象的人性化标准

**[Canonical Reducer Composition](https://github.com/gajus/canonical-reducer-composition)** <br />
嵌套 reducer 组成的固定标准

**[Ducks: Redux Reducer Bundles](https://github.com/erikras/ducks-modular-redux)** <br />
关于捆绑多个 reducer, action 类型 和 action 的提案
